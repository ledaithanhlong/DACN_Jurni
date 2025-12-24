import { Router } from 'express';
import db from '../models/index.js';

const router = Router();

// Get list of conversations (latest message per room)
router.get('/conversations', async (req, res, next) => {
  try {
    // 1. Get all unique roomIds
    // We can't easily do "DISTINCT ON" in all SQL dialects via Sequelize simple find
    // So we'll fetch all messages (optimizable later with group by raw query)
    // For now, let's just use a raw query or find all and process in memory (small scale)
    // IMPROVED: Use sequelize.fn to get max createdAt per room, but that's complex
    // SIMPLE APPROACH for MVP:
    
    const messages = await db.Message.findAll({
      order: [['createdAt', 'DESC']]
    });

    const conversationsMap = new Map();

    for (const msg of messages) {
      if (!conversationsMap.has(msg.roomId)) {
        conversationsMap.set(msg.roomId, {
          roomId: msg.roomId,
          lastMessage: msg.content,
          timestamp: msg.createdAt,
          unread: 0,
          senderId: msg.senderId
        });
      }
      
      // Count unread (assuming logic: if message is from customer and !isRead)
      // We assume senderId !== 'staff' means customer message.
      if (msg.senderId !== 'staff' && !msg.isRead) {
        conversationsMap.get(msg.roomId).unread++;
      }
    }

    const conversations = Array.from(conversationsMap.values());

    // 2. Fetch User Details & Conversation Status for each conversation
    for (const conv of conversations) {
        // Fetch Conversation Status
        const statusRecord = await db.Conversation.findOne({ where: { roomId: conv.roomId } });
        if (statusRecord) {
            conv.status = statusRecord.status;
            conv.consultantId = statusRecord.consultantId;
            // Fetch consultant Clerk ID for frontend checks
            if (statusRecord.consultantId) {
                 const consultant = await db.User.findByPk(statusRecord.consultantId);
                 if (consultant) {
                     conv.consultantClerkId = consultant.clerkId;
                     conv.consultantName = consultant.name;
                 }
            }
        } else {
            conv.status = 'pending';
        }

        if (!conv.roomId.startsWith('guest-')) {
            // Try to find user by clerkId (since roomId seems to be the Clerk ID string)
            let user = await db.User.findOne({ where: { clerkId: conv.roomId } });

            // Fallback: Check by PK if it happens to be an integer (legacy/dev data)
            if (!user && !isNaN(conv.roomId)) {
                 user = await db.User.findByPk(conv.roomId);
            }

            if (user) {
                conv.senderName = user.name;
                conv.avatar = null; // Use default
            }
        }
        
        if (!conv.senderName) {
            conv.senderName = conv.roomId.startsWith('guest-') ? 'Guest' : `User ${conv.roomId}`;
        }
    }

    res.json(conversations);
  } catch (e) {
    next(e);
  }
});

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
      text: msg.content,
      role: msg.senderId === 'staff' ? 'staff' : 'customer',
      sender: msg.senderId, // for detailed UI if needed
      timestamp: msg.createdAt,
      isRead: msg.isRead
    }));

    res.json(formattedMessages);
  } catch (e) {
    next(e);
  }
});

export default router;
