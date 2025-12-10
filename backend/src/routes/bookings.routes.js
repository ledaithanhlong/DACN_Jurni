import { Router } from 'express';
import { clerkAuth, requireAuth } from '../middlewares/auth.js';
import { createBooking, getBooking, getAllBookings, updateBooking } from '../controllers/bookings.controller.js';

const router = Router();
router.post('/', clerkAuth, requireAuth, createBooking);
router.get('/', clerkAuth, requireAuth, getAllBookings); // Admin check inside controller or middleware?
// Ideally requireAuth checks for user, but we might want a requireAdmin middleware. 
// For now, the controller checks role.
router.get('/:id', clerkAuth, requireAuth, getBooking);
router.patch('/:id', clerkAuth, requireAuth, updateBooking);
export default router;


