import { Router } from 'express';
import { clerkAuth, requireRole } from '../middlewares/auth.js';
import { listVouchers, createVoucher, deleteVoucher } from '../controllers/vouchers.controller.js';

const router = Router();
router.get('/', listVouchers);
router.post('/', clerkAuth, requireRole('admin'), createVoucher);
router.delete('/:id', clerkAuth, requireRole('admin'), deleteVoucher);
export default router;


