import { Request, Response } from 'express';
import { storage } from '../storage';
import { profileUpdateSchema } from '@shared/schema';
import { AuthRequest } from '../middleware/auth';
import { z } from 'zod';

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    // Get user ID from authenticated request
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    // Get user data
    const user = await storage.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Return user profile
    res.status(200).json({ profile: user });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Server error fetching profile data' });
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    // Get user ID from authenticated request
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    // Validate request body against profile update schema
    const validatedData = profileUpdateSchema.parse(req.body);
    
    // Update user profile
    const updatedUser = await storage.updateUserProfile(userId, validatedData);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Determine whether to redirect based on profile completion
    const redirectTo = updatedUser.profileCompleted ? '/dashboard' : null;
    
    // Return updated profile and optional redirect
    res.status(200).json({ 
      profile: updatedUser,
      message: 'Profile updated successfully',
      redirectTo
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.errors 
      });
    }
    
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
};

export const checkProfileCompletion = async (req: AuthRequest, res: Response) => {
  try {
    // Get user ID from authenticated request
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    // Check profile completion
    const isComplete = await storage.checkProfileCompletion(userId);
    
    // Return completion status
    res.status(200).json({ 
      isComplete,
      redirectTo: isComplete ? null : '/profile'
    });
  } catch (error) {
    console.error('Check profile completion error:', error);
    res.status(500).json({ error: 'Server error checking profile completion' });
  }
};