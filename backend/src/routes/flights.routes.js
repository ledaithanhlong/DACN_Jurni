import { Router } from 'express';
import { clerkAuth, requireRole } from '../middlewares/auth.js';
import { listFlights, createFlight, updateFlight, deleteFlight } from '../controllers/flights.controller.js';

const router = Router();
router.get('/', listFlights);
router.post('/', clerkAuth, requireRole('admin'), createFlight);
router.put('/:id', clerkAuth, requireRole('admin'), updateFlight);
router.delete('/:id', clerkAuth, requireRole('admin'), deleteFlight);
export default router;


