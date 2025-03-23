import { Request, Response } from 'express';
import { storage } from '../storage';
import { loginSchema, registerSchema } from '@shared/schema';
import { z } from 'zod';

export const register = async (req: Request, res: Response) => {
  try {
    // Validate request body against register schema
    const validatedData = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await storage.getUserByEmail(validatedData.email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create user
    const newUser = await storage.createUser(validatedData);

    // Generate token from user ID
    const userId = newUser.id.toString();
    const token = storage.generateToken(userId);

    // Return user data and token
    res.status(201).json({ 
      user: newUser,
      token,
      redirectTo: '/profile' // Redirect to profile page after registration
    });
  } catch (error) {
    console.error('Registration error details:', error);
    res.status(400).json({ 
      error: "Validation error", 
      details: error instanceof Error ? error.message : String(error)
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // Validate request body against login schema
    const validatedData = loginSchema.parse(req.body);

    // Attempt login
    const result = await storage.login(validatedData);

    if (!result) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if profile is complete to determine redirect
    const redirectTo = result.user.profileCompleted ? '/dashboard' : '/profile';

    // Return user data, token and redirect path
    res.status(200).json({
      user: result.user,
      token: result.token,
      redirectTo
    });
  } catch (error) {
    console.error('Login error details:', error);
    res.status(400).json({ 
      error: "Validation error", 
      details: error instanceof Error ? error.message : String(error)
    });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // Get user ID from authenticated request
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Get user data
    const user = await storage.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user data
    res.status(200).json({ user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Server error fetching user data' });
  }
};