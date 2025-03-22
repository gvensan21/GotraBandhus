import mongoose from 'mongoose';
import { log } from '../vite';

// MongoDB connection options
const options: mongoose.ConnectOptions = {
  autoIndex: true, // Build indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 10 seconds
  socketTimeoutMS: 60000, // Close sockets after 60 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
  retryWrites: true,
  // Use any assertion to avoid TypeScript error with w:'majority'
  w: 'majority' as any
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
      setTimeout(() => reject(new Error('Connection timeout')), 10000);
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
    // Log detailed error information
    if (error instanceof Error) {
      log(`Error connecting to MongoDB: ${error.message}`, 'database');
      if (error.stack) {
        log(`Error stack: ${error.stack}`, 'database');
      }
    } else {
      log(`Error connecting to MongoDB: ${error}`, 'database');
    }
    
    // Check if MONGO_URI is valid
    const mongoUri = process.env.MONGO_URI;
    if (mongoUri) {
      if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
        log('Invalid MongoDB URI format. URI should start with mongodb:// or mongodb+srv://', 'database');
      }
    }
    
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