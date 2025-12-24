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

  // Customer joins their own room (userId or guest ID)
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  // Start a conversation (Staff or Customer sends message)
  socket.on('send_message', (data) => {
    // data: { roomId, sender, content, timestamp, role }
    // Broadcast to the room (both staff and customer in that room receive it)
    io.to(data.roomId).emit('receive_message', data);
    
    // Notify staff of new message if sender is customer
    if (data.role === 'customer') {
      io.emit('staff_notification', {
        roomId: data.roomId,
        sender: data.sender, // Name or ID
        content: data.content,
        timestamp: data.timestamp
      });
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

