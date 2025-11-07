import { clerkMiddleware, getAuth, requireAuth as clerkRequireAuth } from '@clerk/express';
import { env } from '../config/env.js';
import db from '../models/index.js';

// Configure Clerk middleware
// Clerk Express automatically reads CLERK_SECRET_KEY from environment variables
// But we can also pass it explicitly
export const clerkAuth = env.clerk.secretKey 
  ? clerkMiddleware({ secretKey: env.clerk.secretKey })
  : clerkMiddleware();

export const requireAuth = clerkRequireAuth();

export const requireRole = (role) => async (req, res, next) => {
  try {
    const auth = getAuth(req);
    if (!auth?.userId) return res.status(401).json({ error: 'Unauthorized' });
    const clerkId = auth.userId;
    const user = await db.User.findOne({ where: { clerkId } });
    const email = user?.email || auth.sessionClaims?.email;
    const isAdminByEmail = email && env.adminEmails.includes(email);
    const roleValue = user?.role || (isAdminByEmail ? 'admin' : 'user');
    if (role === 'admin' && roleValue !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    req.user = user || null;
    return next();
  } catch (e) {
    return next(e);
  }
};

