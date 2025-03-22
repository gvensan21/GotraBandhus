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
export async function connectToDatabase(retryAttempts = 2, retryInterval = 3000) {
  let lastError;
  
  // Attempt to connect with retries
  for (let attempt = 1; attempt <= retryAttempts; attempt++) {
    try {
      // Get MongoDB URI from environment variables
      const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
      
      // Skip connection if no URI provided
      if (!mongoUri) {
        log('No MongoDB URI provided, using in-memory storage', 'database');
        return false;
      }
      
      // Validate URI format
      if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
        log('Invalid MongoDB URI format. URI should start with mongodb:// or mongodb+srv://', 'database');
        return false;
      }
      
      // Log connection attempt
      log(`Connecting to MongoDB (attempt ${attempt}/${retryAttempts})...`, 'database');
      
      // Try to connect to MongoDB with timeout
      const connectPromise = mongoose.connect(mongoUri, options);
      
      // Set timeout for connection (shorter to avoid blocking startup)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Connection timeout')), 5000);
      });
      
      // Race connection against timeout
      await Promise.race([connectPromise, timeoutPromise]);
      
      log(`Connected to MongoDB database successfully`, 'database');
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
      lastError = error;
      
      // Log detailed error information
      if (error instanceof Error) {
        log(`Error connecting to MongoDB (attempt ${attempt}/${retryAttempts}): ${error.message}`, 'database');
        if (error.stack) {
          log(`Error stack: ${error.stack}`, 'database');
        }
      } else {
        log(`Error connecting to MongoDB (attempt ${attempt}/${retryAttempts}): ${error}`, 'database');
      }
      
      // If more attempts are available, wait before retrying
      if (attempt < retryAttempts) {
        log(`Retrying connection in ${retryInterval/1000} seconds...`, 'database');
        await new Promise(resolve => setTimeout(resolve, retryInterval));
      }
    }
  }
  
  // All attempts failed
  log(`Failed to connect to MongoDB after ${retryAttempts} attempts`, 'database');
  
  // Check if MONGO_URI has specific issues
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (mongoUri && lastError instanceof Error) {
    const errorMsg = lastError.message.toLowerCase();
    
    if (errorMsg.includes('authentication failed')) {
      log('MongoDB authentication failed. Please check your username and password.', 'database');
    } else if (errorMsg.includes('enotfound')) {
      log('MongoDB server not found. Please check your cluster name and network connection.', 'database');
    } else if (errorMsg.includes('timed out')) {
      log('MongoDB connection timed out. This might be due to network issues or firewall restrictions.', 'database');
    }
  }
  
  log('Using in-memory storage as fallback', 'database');
  return false;
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