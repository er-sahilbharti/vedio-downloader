import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import videoRoutes from './routes/videoRoutes.js';
import downloadRoutes from './routes/downloadRoutes.js';
import historyRoutes from './routes/historyRoutes.js';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: env.frontendUrl,
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(generalLimiter);

app.use('/api/video', videoRoutes);
app.use('/api/download', downloadRoutes);
app.use('/api/history', historyRoutes);

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is healthy.' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.', code: 'NOT_FOUND' });
});

app.use(errorHandler);

export default app;
