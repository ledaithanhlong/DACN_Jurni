import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import db from './models/index.js';
import apiRouter from './routes/index.js';

const app = express();

// Configure CORS - must be before other middleware
const corsOptions = {
  origin: ['http://localhost:5173', 'https://jurni-lake.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Configure helmet to not interfere with CORS
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

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
    // eslint-disable-next-line no-console
    console.log('Database connected');
    app.listen(env.port, () => {
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

