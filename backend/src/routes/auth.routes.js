import { Router } from 'express';
import { clerkAuth, requireAuth } from '../middlewares/auth.js';
import db from '../models/index.js';
import { env } from '../config/env.js';

const router = Router();

// Sync Clerk user into DB and apply role via ADMIN_EMAILS
router.post('/sync-user', clerkAuth, requireAuth, async (req, res, next) => {
  try {
    console.log('POST /api/auth/sync-user called, auth:', !!req.auth, 'userId:', req.auth?.userId);
    console.log('Session claims:', JSON.stringify(req.auth.sessionClaims, null, 2));
    
    const clerkId = req.auth.userId;
    
    if (!clerkId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Get user data from Clerk session claims
    // Clerk provides email in various possible fields
    const sessionClaims = req.auth.sessionClaims || {};
    
    // Log all available claims for debugging
    console.log('Available session claims keys:', Object.keys(sessionClaims));
    
    let email = sessionClaims.email || 
                sessionClaims.primary_email_address ||
                sessionClaims.primaryEmail ||
                sessionClaims['https://clerk.dev/email'] ||
                sessionClaims['https://clerk.dev/primary_email_address'] ||
                null;
    
    // If email_addresses is an array, get the first one
    if (!email && sessionClaims.email_addresses && Array.isArray(sessionClaims.email_addresses)) {
      const firstEmail = sessionClaims.email_addresses[0];
      email = typeof firstEmail === 'string' ? firstEmail : 
              (firstEmail?.email_address || firstEmail?.emailAddress || firstEmail);
    }
    
    // Try to get email from primary_email_address_id
    if (!email && sessionClaims.primary_email_address_id && sessionClaims.email_addresses) {
      const primaryEmailObj = sessionClaims.email_addresses.find(
        e => (typeof e === 'object' && (e.id === sessionClaims.primary_email_address_id || e.email_address_id === sessionClaims.primary_email_address_id))
      );
      if (primaryEmailObj) {
        email = primaryEmailObj.email_address || primaryEmailObj.emailAddress || primaryEmailObj;
      }
    }
    
    // If email is an object, extract the email address
    if (email && typeof email === 'object') {
      email = email.email_address || email.emailAddress || email;
    }
    
    // Get name from various possible fields
    let name = sessionClaims.name ||
               sessionClaims.first_name ||
               sessionClaims.firstName ||
               sessionClaims['https://clerk.dev/first_name'] ||
               sessionClaims.username ||
               null;
    
    // If name is an object, extract the name
    if (name && typeof name === 'object') {
      name = name.first_name || name.firstName || name.name || name;
    }

    // Final fallback for name
    if (!name && email) {
      name = email.split('@')[0];
    } else if (!name) {
      name = 'User';
    }
    
    // Validate required fields
    if (!email || !name || name === 'User') {
      // Fallback: Fetch from Clerk API if Secret Key is available
      if (env.clerk.secretKey) {
          try {
              console.log('Fetching user details from Clerk API for:', clerkId);
              const clerkRes = await fetch(`https://api.clerk.com/v1/users/${clerkId}`, {
                  headers: {
                      'Authorization': `Bearer ${env.clerk.secretKey}`,
                      'Content-Type': 'application/json'
                  }
              });
              
              if (clerkRes.ok) {
                  const clerkUser = await clerkRes.json();
                  console.log('Clerk API User:', JSON.stringify(clerkUser, null, 2));

                  if (clerkUser.email_addresses && clerkUser.email_addresses.length > 0) {
                      email = clerkUser.email_addresses[0].email_address;
                  }
                  
                  const first = clerkUser.first_name || '';
                  const last = clerkUser.last_name || '';
                  if (first || last) {
                      name = `${last} ${first}`.trim(); // Vietnamese order often Last First or First Last depending on preference. 
                      // User in screenshot "Minh hiếu Nguyễn Khắc" -> First: Minh hiếu, Last: Nguyễn Khắc? 
                      // Clerk usually has first_name and last_name.
                      // Let's use standard Western "First Last" or if user provided, "Last First". 
                      // Actually, let's just join them.
                      name = `${first} ${last}`.trim();
                  }
              } else {
                  console.warn('Failed to fetch from Clerk API:', await clerkRes.text());
              }
          } catch (apiErr) {
              console.error('Clerk API fetch error:', apiErr);
          }
      }
    }

    if (!email) {
      // If email is STILL not available, try to create user with temporary email
      // This can happen if email verification is pending or API failed
      const tempEmail = `temp_${clerkId}@pending.clerk`;
      console.warn(`Email not found in session claims for user ${clerkId}, using temporary email: ${tempEmail}`);
      
      // Try to find existing user first
      let user = await db.User.findOne({ where: { clerkId } });
      
      if (user) {
          // If user exists, we might want to update their name if we found it from API but still no email?
          if (name && name !== 'User' && user.name !== name) {
               await user.update({ name });
          }
      } else {
        // Create user with temporary email
        user = await db.User.create({
          clerkId,
          name: name || 'User',
          email: tempEmail,
          role: 'user'
        });
        console.log(`Created user with temporary email:`, { id: user.id, clerkId, email: tempEmail });
      }
      
      return res.json({ 
        ok: true, 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          clerkId: user.clerkId
        },
        created: false,
        warning: 'Email not verified yet, using temporary email'
      });
    }

    const isAdmin = env.adminEmails.includes(email);

    // Find or create user with validated data
    const [user, created] = await db.User.findOrCreate({
      where: { clerkId },
      defaults: { 
        name, 
        email,
        role: isAdmin ? 'admin' : 'user'
      }
    });

    // Determine new role
    let newRole = user.role;
    if (isAdmin) {
      newRole = 'admin'; // Force admin if in admin list
    } else {
      // If not admin in env...
      if (user.role === 'admin') {
        // ...but was admin in DB => Demote to user
        newRole = 'user';
      }
      // If user.role is 'staff' or 'user', keep it as is. 
      // Do NOT force 'user' if they are 'staff'.
    }

    // Update if email, name or role changed
    const hasTempEmail = user.email && user.email.includes('@pending.clerk');
    const needsUpdate = user.email !== email || 
                       user.name !== name || 
                       user.role !== newRole ||
                       (hasTempEmail && email && !email.includes('@pending.clerk'));
    
    if (needsUpdate) {
      await user.update({ 
        email, 
        name,
        role: newRole
      });
      console.log('Updated user:', { 
        id: user.id, 
        oldEmail: hasTempEmail ? user.email : null,
        newEmail: email, 
        name, 
        role: newRole 
      });
    }

    console.log(`Synced user (${created ? 'created' : 'found'}):`, { 
      id: user.id, 
      email, 
      name,
      role: user.role 
    });
    
    res.json({ 
      ok: true, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        clerkId: user.clerkId
      },
      created 
    });

  } catch (e) {
    console.error('Sync user error:', e);
    next(e);
  }
});

router.get('/me', clerkAuth, requireAuth, async (req, res, next) => {
  try {
    const user = await db.User.findOne({ where: { clerkId: req.auth.userId } });
    res.json({ auth: req.auth, user });
  } catch (e) { next(e); }
});

export default router;


