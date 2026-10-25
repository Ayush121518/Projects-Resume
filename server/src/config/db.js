import mongoose from 'mongoose';
import { memoryDb } from './memoryStore.js';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      console.log('Connecting to provided MongoDB URI...');
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
      console.log('✅ MongoDB connected successfully via MONGODB_URI.');
      global.USE_MEMORY_STORE = false;
      return;
    } catch (err) {
      console.warn('⚠️ Could not connect to MONGODB_URI:', err.message);
    }
  }

  // Fast zero-setup in-memory database store
  console.log('⚡ Running embedded In-Memory MongoDB Store for instant 0-setup execution.');
  global.USE_MEMORY_STORE = true;
};
