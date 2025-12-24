import { Router } from 'express';
import db from '../models/index.js';

const router = Router();

// Get history for a specific room
router.get('/:roomId', async (req, res, next) => {
  try {
    const messages = await db.Message.findAll({
      where: { roomId: req.params.roomId },
      order: [['createdAt', 'ASC']]
    });

    // Map to frontend format
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      text: msg.content,
      role: msg.senderId === 'staff' ? 'staff' : 'customer',
      sender: msg.senderId, // for detailed UI if needed
      timestamp: msg.createdAt
    }));

    res.json(formattedMessages);
  } catch (e) {
    next(e);
  }
});

export default router;
