import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import planRoutes from './routes/planRoutes.js';
import workoutRoutes from './routes/workoutRoutes.js';
import measurementRoutes from './routes/measurementRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

import { seedSystemTemplates } from './utils/seedData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend Vite dev server (usually 5173 or any origin)
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/workout-plans', planRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/measurements', measurementRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'FitTrack API',
    timestamp: new Date().toISOString(),
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// Start Server
const startServer = async () => {
  await connectDB();
  await seedSystemTemplates();
  app.listen(PORT, () => {
    console.log(`🚀 FitTrack API Server running on port ${PORT} [http://localhost:${PORT}]`);
  });
};

startServer();
