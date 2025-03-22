import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';

// Extended Express Request interface to include userId
export interface AuthRequest extends Request {
  userId?: string;
}

// Authentication middleware
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }
    
    // Extract token
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const userId = storage.verifyToken(token);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
    
    // Attach userId to request for use in route handlers
    req.userId = userId;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Server error during authentication' });
  }
};

// Profile completion check middleware
export const checkProfileComplete = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized - Authentication required' });
    }
    
    // Check if user's profile is complete
    const isProfileComplete = await storage.checkProfileCompletion(req.userId);
    
    if (!isProfileComplete) {
      return res.status(403).json({ 
        error: 'Profile incomplete',
        message: 'Please complete your profile before accessing this resource',
        redirectTo: '/profile'
      });
    }
    
    next();
  } catch (error) {
    console.error('Profile check error:', error);
    res.status(500).json({ error: 'Server error during profile check' });
  }
};