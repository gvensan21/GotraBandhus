import mongoose from 'mongoose';
import { log } from '../vite';

// MongoDB connection options
const options = {
  autoIndex: true, // Build indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};

// Track connection status
let isMongoConnected = false;

// Connect to MongoDB database
export async function connectToDatabase() {
  try {
    // Get MongoDB URI from environment variables
    const mongoUri = process.env.MONGO_URI;
    
    // Skip connection if no URI provided
    if (!mongoUri) {
      log('No MongoDB URI provided, using in-memory storage', 'database');
      return false;
    }
    
    // Try to connect to MongoDB with timeout
    const connectPromise = mongoose.connect(mongoUri, options);
    
    // Set timeout for connection
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout')), 5000);
    });
    
    // Race connection against timeout
    await Promise.race([connectPromise, timeoutPromise]);
    
    log(`Connected to MongoDB database`, 'database');
    isMongoConnected = true;
    
    // Handle MongoDB events
    mongoose.connection.on('error', (error) => {
      log(`MongoDB connection error: ${error}`, 'database');
      isMongoConnected = false;
    });
    
    mongoose.connection.on('disconnected', () => {
      log('MongoDB disconnected', 'database');
      isMongoConnected = false;
    });
    
    mongoose.connection.on('reconnected', () => {
      log('MongoDB reconnected', 'database');
      isMongoConnected = true;
    });
    
    // Handle application termination
    process.on('SIGINT', async () => {
      await disconnectFromDatabase();
      process.exit(0);
    });
    
    return true;
  } catch (error) {
    log(`Error connecting to MongoDB: ${error}`, 'database');
    log('Using in-memory storage as fallback', 'database');
    return false;
  }
}

// Check if MongoDB is connected
export function isConnectedToMongoDB(): boolean {
  return isMongoConnected && mongoose.connection.readyState === 1;
}

// Disconnect from MongoDB database
export async function disconnectFromDatabase() {
  if (!isMongoConnected) return;
  
  try {
    await mongoose.disconnect();
    isMongoConnected = false;
    log('Disconnected from MongoDB database', 'database');
  } catch (error) {
    log(`Error disconnecting from MongoDB: ${error}`, 'database');
  }
}