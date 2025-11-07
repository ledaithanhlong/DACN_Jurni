import { Router } from 'express';
import { clerkAuth, requireAuth, requireRole } from '../middlewares/auth.js';
import { sendNotification, listNotifications } from '../controllers/notifications.controller.js';

const router = Router();
router.get('/', clerkAuth, requireAuth, listNotifications);
router.post('/send', clerkAuth, requireRole('admin'), sendNotification);
export default router;


