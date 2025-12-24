import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import db from './models/index.js';
import apiRouter from './routes/index.js';

import { Server } from 'socket.io';
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://jurni-lake.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors({ origin: ['http://localhost:5173', 'https://jurni-lake.vercel.app'], credentials: true }));
app.use(helmet());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Socket.io Logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join room event (updated to return status)
  socket.on('join_room', async (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);

    try {
        // Find or create conversation status
        const [conv, created] = await db.Conversation.findOrCreate({ // Ensure Conversation status exists
            where: { roomId },
            defaults: { status: 'pending' }
        });
        
        let consultantName = null;
        if (conv.consultantId) {
            const consultant = await db.User.findByPk(conv.consultantId);
            if (consultant) consultantName = consultant.name;
        }

        // Emit current status to the user/staff who joined
        socket.emit('consultation_status', {
            status: conv.status,
            consultantId: conv.consultantId,
            consultantName: consultantName
        });
    } catch (e) {
        console.error('Error fetching conversation status:', e);
    }
  });

  // Start a conversation (Staff or Customer sends message)
  socket.on('send_message', async (data) => {
    // data: { roomId, sender, content, timestamp, role, staffId (Clerk ID) }
    
    try {
      // Validation: If staff is sending, check if allowed
      if (data.role === 'staff') {
          const conv = await db.Conversation.findOne({ where: { roomId: data.roomId } });
          
          // Resolve Clerk ID to DB ID if needed
          let senderDbId = null;
          if (data.staffId) {
             const u = await db.User.findOne({ where: { clerkId: data.staffId } });
             if (u) senderDbId = u.id;
          }

          // If conversation is active and assigned to someone else, BLOCK IT
          if (conv && conv.status === 'active' && conv.consultantId) {
              // If we couldn't resolve ID, or ID mismatch
              if (!senderDbId || conv.consultantId !== senderDbId) {
                 console.warn(`Blocked message from unauthorized staff ${data.staffId} (DB: ${senderDbId}) in room ${data.roomId}`);
                 return; 
              }
          }
           
           // If 'pending' or 'ended', we might block strictness? 
           // For now, let's assume 'active' is the main protected state.
      }

      // 1. Save to database
      const msg = await db.Message.create({
        senderId: data.role === 'staff' ? 'staff' : data.sender, 
        receiverId: data.role === 'staff' ? data.roomId : 'staff',
        content: data.content,
        roomId: data.roomId,
        isRead: false
      });

      // 2. Update Conversation Status
      const [conv] = await db.Conversation.findOrCreate({ where: { roomId: data.roomId } });
      
      // If customer sends message and status was 'ended', reset to 'pending'
      if (data.role === 'customer' && conv.status === 'ended') {
          await conv.update({ status: 'pending', consultantId: null, lastMessageAt: new Date() });
          io.emit('consultation_global_update', { roomId: data.roomId, status: 'pending', consultantId: null });
      } else {
          await conv.update({ lastMessageAt: new Date() });
      }

    } catch (e) {
      console.error('Error saving message:', e);
    }

    // Broadcast to the room
    io.to(data.roomId).emit('receive_message', data);
    
    if (data.role === 'customer') {
      io.emit('staff_notification', {
        roomId: data.roomId,
        sender: data.sender, 
        content: data.content,
        timestamp: data.timestamp
      });
    }
  });

  // Handle Staff Accepting Consultation
  socket.on('accept_consultation', async ({ roomId, staffId, staffName }) => {
      // staffId is CLERK ID from frontend
      try {
          // Resolve Clerk ID to DB ID
          const u = await db.User.findOne({ where: { clerkId: staffId } });
          if (!u) {
              console.error(`Cannot accept consultation: Staff Clerk ID ${staffId} not found in DB`);
              return;
          }
          const dbStaffId = u.id;

          const conv = await db.Conversation.findOne({ where: { roomId } });
          
          // Only allow if pending or ended
          if (conv && conv.status === 'active' && conv.consultantId && conv.consultantId !== dbStaffId) {
             return;
          }

          if (conv) {
              await conv.update({ status: 'active', consultantId: dbStaffId });
              
              // Notify everyone in room (Customer + Staff)
              io.to(roomId).emit('consultation_update', {
                  status: 'active',
                  consultantId: dbStaffId,
                  consultantName: staffName,
                  message: `Cuộc hội thoại đã được tiếp nhận bởi ${staffName}`
              });

              // Notify all staff (to lock/update sidebar)
              // Include consultantName so others can see "Served by X"
              io.emit('consultation_global_update', { 
                  roomId, 
                  status: 'active', 
                  consultantId: dbStaffId,
                  consultantClerkId: staffId, // Pass back Clerk ID (Crucial for frontend lock)
                  consultantName: staffName 
              });
          }
      } catch (e) { console.error(e); }
  });

  // Handle Staff Ending Consultation
  socket.on('end_consultation', async ({ roomId, staffId }) => {
      // staffId is CLERK ID
      try {
          const u = await db.User.findOne({ where: { clerkId: staffId } });
          const dbStaffId = u ? u.id : null;

          const conv = await db.Conversation.findOne({ where: { roomId } });
          
          // Validation: Only owner can end
          if (conv && conv.consultantId !== dbStaffId) {
              console.warn(`Unauthorized end attempt by ClerkID ${staffId} on room ${roomId}`);
              return;
          }

          if (conv) {
              await conv.update({ status: 'ended', consultantId: null });

              io.to(roomId).emit('consultation_ended', {
                  message: 'Cuộc hội thoại đã kết thúc.'
              });
              
             // Notify all staff
             io.emit('consultation_global_update', { 
                roomId, 
                status: 'ended', 
                consultantId: null, 
                consultantClerkId: null 
             });
          }
      } catch (e) { console.error(e); }
  });

  // Handle Mark as Read
  socket.on('mark_read', async ({ roomId, role }) => {
      // If role is 'staff', mark all messages from 'customer' as read
      // If role is 'customer', mark all messages from 'staff' as read
      // Simplified: Mark all messages in room that are NOT from me as read.
      try {
          const senderFilter = role === 'staff' ? { [db.Sequelize.Op.ne]: 'staff' } : 'staff';
          
          await db.Message.update(
              { isRead: true },
              { 
                  where: { 
                      roomId: roomId, 
                      isRead: false,
                      senderId: senderFilter
                  } 
              }
          );
          
          // Emit to room so sender sees "Seen"
          io.to(roomId).emit('messages_read', { roomId, readerRole: role });
          
      } catch (e) {
          console.error('Error marking read:', e);
      }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

async function start() {
  try {
    await db.sequelize.authenticate();
    // Use sync to update models (including new Message model and User role update)
    // Note: alter: true attempts to update tables without data loss
    await db.sequelize.sync({ alter: true });
    
    // eslint-disable-next-line no-console
    console.log('Database connected');
    server.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on http://localhost:${env.port}`);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', e);
    process.exit(1);
  }
}

start();

