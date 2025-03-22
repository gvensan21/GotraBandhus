import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';

// Extend the Express Request interface to include userId
export interface AuthRequest extends Request {
  userId?: string;
}

// Middleware to authenticate requests using JWT
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Extract token without "Bearer " prefix
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const userId = storage.verifyToken(token);
    
    if (!userId) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    
    // Add userId to request for use in route handlers
    req.userId = userId;
    
    // Continue to next middleware or route handler
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Middleware to check if user profile is complete
export const checkProfileComplete = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Check if profile is complete
    const isComplete = await storage.checkProfileCompletion(userId);
    
    if (!isComplete) {
      return res.status(403).json({ 
        error: 'Profile incomplete', 
        message: 'Please complete your profile before accessing this resource',
        redirectTo: '/profile'
      });
    }
    
    // Profile is complete, continue
    next();
  } catch (error) {
    console.error('Profile check error:', error);
    res.status(500).json({ error: 'Error checking profile completion' });
  }
};