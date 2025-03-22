import { 
  User, 
  RegisterInput, 
  LoginInput, 
  ProfileUpdateInput 
} from "@shared/schema";
import { UserModel, UserDocument } from "./models/User";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_only_for_development';

// Storage interface for MongoDB
export interface IStorage {
  // User methods
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<UserDocument | null>;
  createUser(userData: RegisterInput): Promise<User>;
  updateUserProfile(userId: string, profileData: ProfileUpdateInput): Promise<User | null>;
  login(loginData: LoginInput): Promise<{ user: User; token: string } | null>;
  
  // JWT methods
  generateToken(userId: string): string;
  verifyToken(token: string): string | null;
  
  // Profile methods
  checkProfileCompletion(userId: string): Promise<boolean>;
}

export class MongoStorage implements IStorage {
  // User methods
  async getUserById(id: string): Promise<User | null> {
    try {
      const user = await UserModel.findById(id).select('-password');
      return user ? user.toObject() : null;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }
  }
  
  async getUserByEmail(email: string): Promise<UserDocument | null> {
    try {
      return await UserModel.findOne({ email: email.toLowerCase() });
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }
  }
  
  async createUser(userData: RegisterInput): Promise<User> {
    try {
      // Create new user
      const newUser = new UserModel({
        ...userData,
        profileCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Save user
      const savedUser = await newUser.save();
      
      // Return user object without password
      const userObj = savedUser.toObject();
      delete userObj.password;
      return userObj;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  
  async updateUserProfile(userId: string, profileData: ProfileUpdateInput): Promise<User | null> {
    try {
      // Find user by ID
      const user = await UserModel.findById(userId);
      if (!user) return null;
      
      // Update user with new profile data
      Object.assign(user, profileData);
      
      // Check if profile is complete
      user.profileCompleted = user.checkProfileCompletion();
      user.updatedAt = new Date();
      
      // Save updated user
      const updatedUser = await user.save();
      
      // Return user object without password
      const userObj = updatedUser.toObject();
      delete userObj.password;
      return userObj;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
  }
  
  async login(loginData: LoginInput): Promise<{ user: User; token: string } | null> {
    try {
      // Find user by email
      const user = await this.getUserByEmail(loginData.email);
      if (!user) return null;
      
      // Check password
      const isPasswordValid = await user.comparePassword(loginData.password);
      if (!isPasswordValid) return null;
      
      // Generate token
      const token = this.generateToken(user._id.toString());
      
      // Return user data and token
      const userObj = user.toObject();
      delete userObj.password;
      
      return { user: userObj, token };
    } catch (error) {
      console.error('Error during login:', error);
      return null;
    }
  }
  
  // JWT methods
  generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  }
  
  verifyToken(token: string): string | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      return decoded.userId;
    } catch (error) {
      console.error('Error verifying token:', error);
      return null;
    }
  }
  
  // Profile methods
  async checkProfileCompletion(userId: string): Promise<boolean> {
    try {
      const user = await UserModel.findById(userId);
      return user ? user.profileCompleted : false;
    } catch (error) {
      console.error('Error checking profile completion:', error);
      return false;
    }
  }
}

export const storage = new MongoStorage();
