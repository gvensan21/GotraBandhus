import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authenticate, checkProfileComplete } from "./middleware/auth";
import * as authController from "./controllers/auth.controller";
import * as userController from "./controllers/user.controller";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post('/api/auth/register', authController.register);
  app.post('/api/auth/login', authController.login);
  app.get('/api/auth/me', authenticate, authController.getCurrentUser);
  
  // User profile routes
  app.get('/api/user/profile', authenticate, userController.getUserProfile);
  app.put('/api/user/profile', authenticate, userController.updateUserProfile);
  app.get('/api/user/profile/check-completion', authenticate, userController.checkProfileCompletion);
  
  // Protected routes that require complete profile
  // For example, Dashboard access:
  app.get('/api/user/dashboard', authenticate, checkProfileComplete, (req, res) => {
    res.status(200).json({ message: 'Access to dashboard granted' });
  });

  const httpServer = createServer(app);
  return httpServer;
}
