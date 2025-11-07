import { Router } from 'express';
import { clerkAuth, requireAuth } from '../middlewares/auth.js';
import { addFavorite, listFavorites } from '../controllers/favorites.controller.js';

const router = Router();
router.get('/', clerkAuth, requireAuth, listFavorites);
router.post('/', clerkAuth, requireAuth, addFavorite);
export default router;


