import { Router } from 'express';
import { clerkAuth, requireAdminOrAdmin2 } from '../middlewares/auth.js';
import { listHotels, getHotel, createHotel, updateHotel, deleteHotel } from '../controllers/hotels.controller.js';

const router = Router();

router.get('/', listHotels);
router.get('/:id', getHotel);
router.post('/', clerkAuth, requireAdminOrAdmin2, createHotel);
router.put('/:id', clerkAuth, requireAdminOrAdmin2, updateHotel);
router.delete('/:id', clerkAuth, requireAdminOrAdmin2, deleteHotel);

export default router;


