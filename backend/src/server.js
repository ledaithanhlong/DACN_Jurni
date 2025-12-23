import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import db from './models/index.js';
import apiRouter from './routes/index.js';

const app = express();

app.use(cors({ origin: ['http://localhost:5173,https://jurni-hazel.vercel.app/'], credentials: true }));
app.use(helmet());
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

