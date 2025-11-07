import { Router } from 'express';
import { clerkAuth, requireAuth } from '../middlewares/auth.js';
import { createBooking, getBooking } from '../controllers/bookings.controller.js';

const router = Router();
router.post('/', clerkAuth, requireAuth, createBooking);
router.get('/:id', clerkAuth, requireAuth, getBooking);
export default router;


