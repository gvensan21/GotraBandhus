import { 
  User, 
  RegisterInput, 
  LoginInput, 
  ProfileUpdateInput 
} from "@shared/schema";
import { UserModel, UserDocument } from "./models/User";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { log } from './vite';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_only_for_development';

// Storage interface
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

// MongoDB Storage Implementation
export class MongoStorage implements IStorage {
  // User methods
  async getUserById(id: string): Promise<User | null> {
    try {
      const user = await UserModel.findById(id).select('-password');
      if (!user) return null;
      
      // Convert to regular object and explicitly cast as User
      const userObj = user.toObject();
      return {
        ...userObj,
        _id: userObj._id?.toString(), // Ensure _id is a string
      } as unknown as User;
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
      const result = { 
        ...userObj,
        _id: userObj._id?.toString() // Ensure _id is a string
      };
      
      // Create a type-safe way to remove the password
      const { password, ...resultWithoutPassword } = result;
      return resultWithoutPassword as unknown as User;
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
      
      // Ensure _id is a string
      const result = {
        ...userObj,
        _id: userObj._id?.toString()
      };
      
      const { password, ...resultWithoutPassword } = result;
      return resultWithoutPassword as unknown as User;
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
      // Convert _id to string safely
      const userId = user._id ? user._id.toString() : '';
      const token = this.generateToken(userId);
      
      // Return user data and token
      const userObj = user.toObject();
      
      // Ensure _id is a string
      const result = {
        ...userObj,
        _id: userObj._id?.toString()
      };
      
      const { password, ...userWithoutPassword } = result;
      
      return { user: userWithoutPassword as unknown as User, token };
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

// Define a type for our in-memory user that includes _id and sets all fields as required
type InMemoryUser = {
  _id: string;
  firstName: string;
  lastName: string;
  nickname: string;
  email: string;
  password: string;
  phone: string;
  gender: "male" | "female" | "other";
  dateOfBirth?: string; 
  birthCity?: string;
  birthState?: string;
  birthCountry?: string;
  currentCity: string;
  currentState: string;
  currentCountry: string;
  gotra: string;
  pravara: string;
  occupation?: string;
  company?: string;
  industry?: string;
  primaryLanguage: string;
  secondaryLanguage?: string;
  community: string;
  hideEmail: boolean;
  hidePhone: boolean;
  hideDob: boolean;
  bio?: string;
  profileCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// In-Memory Storage Implementation (Fallback)
export class MemStorage implements IStorage {
  private users: Map<string, InMemoryUser> = new Map();
  private emailToId: Map<string, string> = new Map();
  
  constructor() {
    log('Using in-memory storage as fallback', 'database');
  }
  
  // Helper method to check if a profile is complete
  private isProfileComplete(user: InMemoryUser): boolean {
    // Required fields for profile completion
    const requiredFields = [
      'firstName', 'lastName', 'nickname', 'email', 'phone', 'gender',
      'currentCity', 'currentState', 'currentCountry',
      'gotra', 'pravara', 'community', 'primaryLanguage'
    ];
    
    // Check if all required fields have values
    return requiredFields.every(field => {
      return user[field as keyof InMemoryUser] !== undefined && 
             user[field as keyof InMemoryUser] !== null && 
             user[field as keyof InMemoryUser] !== '';
    });
  }
  
  // User methods
  async getUserById(id: string): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) return null;
    
    // Return user without password by creating a new object without it
    const { password, ...userWithoutPassword } = user;
    
    return userWithoutPassword as User;
  }
  
  async getUserByEmail(email: string): Promise<UserDocument | null> {
    const userId = this.emailToId.get(email.toLowerCase());
    if (!userId) return null;
    
    const user = this.users.get(userId);
    if (!user) return null;
    
    // Create a UserDocument-like object with necessary methods
    const userDoc = {
      ...user,
      id: user._id,
      comparePassword: async (candidatePassword: string): Promise<boolean> => {
        try {
          return await bcrypt.compare(candidatePassword, user.password);
        } catch (error) {
          console.error('Password comparison error:', error);
          return false;
        }
      },
      checkProfileCompletion: (): boolean => {
        return this.isProfileComplete(user);
      },
      toObject: () => {
        const obj = { ...user };
        return obj;
      }
    } as unknown as UserDocument;
    
    return userDoc;
  }
  
  async createUser(userData: RegisterInput): Promise<User> {
    try {
      // Generate ID
      const userId = uuidv4();
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // Create a minimal user with required fields for registration
      const newUser: InMemoryUser = {
        _id: userId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        nickname: userData.nickname,
        email: userData.email,
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
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Store user
      this.users.set(userId, newUser);
      this.emailToId.set(userData.email.toLowerCase(), userId);
      
      // Return user without password
      const { password, ...userToReturn } = newUser;
      
      return userToReturn as User;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  
  async updateUserProfile(userId: string, profileData: ProfileUpdateInput): Promise<User | null> {
    // Get existing user
    const existingUser = this.users.get(userId);
    if (!existingUser) return null;
    
    // Update user with new profile data
    const updatedUser: InMemoryUser = {
      ...existingUser,
      ...profileData,
      updatedAt: new Date()
    };
    
    // Check profile completion
    updatedUser.profileCompleted = this.isProfileComplete(updatedUser);
    
    // Store updated user
    this.users.set(userId, updatedUser);
    
    // Return user without password
    const { password, ...userToReturn } = updatedUser;
    
    return userToReturn as User;
  }
  
  async login(loginData: LoginInput): Promise<{ user: User; token: string } | null> {
    try {
      // Get user by email
      const userDoc = await this.getUserByEmail(loginData.email);
      if (!userDoc) return null;
      
      // Check password
      const isPasswordValid = await userDoc.comparePassword(loginData.password);
      if (!isPasswordValid) return null;
      
      // Get the user ID safely 
      const userId = typeof userDoc._id === 'string' ? userDoc._id : '';
      if (!userId) return null;
      
      // Get user without password
      const user = await this.getUserById(userId);
      if (!user) return null;
      
      // Generate token
      const token = this.generateToken(userId);
      
      return { user, token };
    } catch (error) {
      console.error('Login error:', error);
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
    const user = this.users.get(userId);
    return user ? user.profileCompleted : false;
  }
}

// Always use MongoDB storage
let storageImplementation: IStorage;

try {
  // Use MongoDB storage
  log('Using MongoDB storage', 'database');
  storageImplementation = new MongoStorage();
} catch (error) {
  // This is a catastrophic initialization error, not a connection error
  log(`Error initializing MongoDB storage class: ${error}`, 'database');
  // Still use MongoDB with another instance as we want MongoDB only
  storageImplementation = new MongoStorage();
}

export const storage = storageImplementation;
