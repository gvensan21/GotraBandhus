import { 
  User, 
  InsertUser,
  users,
  RegisterInput, 
  LoginInput, 
  ProfileUpdateInput 
} from "@shared/schema";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { log } from './vite';
import { db } from './db';
import { eq, and } from 'drizzle-orm';

import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_only_for_development';

// Storage interface
export interface IStorage {
  // User methods
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(userData: RegisterInput): Promise<User>;
  updateUserProfile(userId: string, profileData: ProfileUpdateInput): Promise<User | null>;
  login(loginData: LoginInput): Promise<{ user: User; token: string } | null>;
  
  // JWT methods
  generateToken(userId: string): string;
  verifyToken(token: string): string | null;
  
  // Profile methods
  checkProfileCompletion(userId: string): Promise<boolean>;
}

// Helper function to check profile completion
function isProfileComplete(user: User): boolean {
  // Required fields for profile completion
  const requiredFields = [
    'firstName', 'lastName', 'nickname', 'email', 'phone', 'gender',
    'currentCity', 'currentState', 'currentCountry',
    'gotra', 'pravara', 'community', 'primaryLanguage'
  ];
  
  // Check if all required fields have values
  return requiredFields.every(field => {
    return user[field as keyof User] !== undefined && 
           user[field as keyof User] !== null && 
           user[field as keyof User] !== '';
  });
}

// PostgreSQL Storage Implementation with Drizzle
export class DatabaseStorage implements IStorage {
  // User methods
  async getUserById(id: string): Promise<User | null> {
    try {
      const numericId = parseInt(id);
      if (isNaN(numericId)) return null;
      
      const [user] = await db.select().from(users).where(eq(users.id, numericId));
      if (!user) return null;
      
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }
  }
  
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
      return user || null;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }
  }
  
  async createUser(userData: RegisterInput): Promise<User> {
    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      const insertData: InsertUser = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        nickname: userData.nickname,
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        phone: userData.phone,
        gender: 'other', // Default value
        currentCity: '',
        currentState: '',
        currentCountry: '',
        gotra: '',
        pravara: '',
        community: '',
        primaryLanguage: '',
        // Default privacy settings
        hideEmail: false,
        hidePhone: false,
        hideDob: false,
        profileCompleted: false,
      };
      
      // Insert user into database
      const [newUser] = await db.insert(users).values(insertData).returning();
      
      // Return user without password
      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword as User;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  
  async updateUserProfile(userId: string, profileData: ProfileUpdateInput): Promise<User | null> {
    try {
      const numericId = parseInt(userId);
      if (isNaN(numericId)) return null;
      
      // Get current user
      const [existingUser] = await db.select().from(users).where(eq(users.id, numericId));
      if (!existingUser) return null;
      
      // Prepare update data with profile completion check
      const updatedData = {
        ...profileData,
        profileCompleted: isProfileComplete({...existingUser, ...profileData}),
        updatedAt: new Date(),
      };
      
      // Update user
      const [updatedUser] = await db.update(users)
        .set(updatedData)
        .where(eq(users.id, numericId))
        .returning();
        
      if (!updatedUser) return null;
      
      // Return user without password
      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword as User;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
  }
  
  async login(loginData: LoginInput): Promise<{ user: User; token: string } | null> {
    try {
      // Find user by email
      const [user] = await db.select().from(users).where(eq(users.email, loginData.email.toLowerCase()));
      if (!user) return null;
      
      // Check password
      const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
      if (!isPasswordValid) return null;
      
      // Generate token
      const token = this.generateToken(user.id.toString());
      
      // Return user data without password
      const { password, ...userWithoutPassword } = user;
      return { user: userWithoutPassword as User, token };
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
      const numericId = parseInt(userId);
      if (isNaN(numericId)) return false;
      
      const [user] = await db.select().from(users).where(eq(users.id, numericId));
      // Ensure a boolean return value
      return user ? (user.profileCompleted === true) : false;
    } catch (error) {
      console.error('Error checking profile completion:', error);
      return false;
    }
  }
}

// Using PostgreSQL with Drizzle ORM exclusively
log('Using PostgreSQL database with Drizzle ORM', 'database');

// Export the database storage instance
export const storage = new DatabaseStorage();
