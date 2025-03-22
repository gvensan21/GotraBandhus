import mongoose from 'mongoose';
import { log } from '../vite';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gotrabandhus';

// Connect to MongoDB
export async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    log('Connected to MongoDB', 'mongodb');
    return mongoose.connection;
  } catch (error) {
    log(`Error connecting to MongoDB: ${error}`, 'mongodb');
    process.exit(1);
  }
}

// Disconnect from MongoDB (useful for testing)
export async function disconnectFromDatabase() {
  try {
    await mongoose.disconnect();
    log('Disconnected from MongoDB', 'mongodb');
  } catch (error) {
    log(`Error disconnecting from MongoDB: ${error}`, 'mongodb');
  }
}