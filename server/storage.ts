import { 
  User, 
  InsertUser,
  users,
  RegisterInput, 
  LoginInput, 
  ProfileUpdateInput 
} from "@shared/schema";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { log } from './vite';
import { db } from './db';
import { eq, and } from 'drizzle-orm';

dotenv.config();

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

// Define a type for our in-memory user
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
    
    // Create a format that matches our User type
    const userToReturn = {
      id: parseInt(id) || 0,
      firstName: user.firstName,
      lastName: user.lastName,
      nickname: user.nickname,
      email: user.email,
      phone: user.phone,
      gender: user.gender as any,
      dateOfBirth: user.dateOfBirth || null,
      birthCity: user.birthCity || null,
      birthState: user.birthState || null,
      birthCountry: user.birthCountry || null,
      currentCity: user.currentCity,
      currentState: user.currentState,
      currentCountry: user.currentCountry,
      gotra: user.gotra,
      pravara: user.pravara,
      occupation: user.occupation || null,
      company: user.company || null,
      industry: user.industry || null,
      primaryLanguage: user.primaryLanguage,
      secondaryLanguage: user.secondaryLanguage || null,
      community: user.community,
      hideEmail: user.hideEmail,
      hidePhone: user.hidePhone,
      hideDob: user.hideDob,
      bio: user.bio || null,
      profileCompleted: user.profileCompleted,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    
    return userToReturn as User;
  }
  
  async getUserByEmail(email: string): Promise<User | null> {
    const userId = this.emailToId.get(email.toLowerCase());
    if (!userId) return null;
    
    return this.getUserById(userId);
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
      
      // Return format matches User type
      return this.getUserById(userId) as Promise<User>;
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
    
    // Return in format matching User type
    return this.getUserById(userId);
  }
  
  async login(loginData: LoginInput): Promise<{ user: User; token: string } | null> {
    try {
      // Get user by email
      const user = await this.getUserByEmail(loginData.email);
      if (!user) return null;
      
      // Get the original user to check password
      const originalUser = this.users.get(this.emailToId.get(loginData.email.toLowerCase()) || '');
      if (!originalUser) return null;
      
      // Check password
      const isPasswordValid = await bcrypt.compare(loginData.password, originalUser.password);
      if (!isPasswordValid) return null;
      
      // Generate token
      const token = this.generateToken(originalUser._id);
      
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

// Choose storage implementation based on database connection
let storageImplementation: IStorage;

try {
  // Try to use PostgreSQL with Drizzle
  log('Attempting to connect to PostgreSQL database with Drizzle...', 'database');
  // Test database connection
  db.select().from(users).limit(1);
  log('Successfully connected to PostgreSQL database', 'database');
  storageImplementation = new DatabaseStorage();
} catch (error) {
  // If PostgreSQL connection fails, fall back to memory storage
  log('PostgreSQL connection failed, using in-memory storage as fallback', 'database');
  console.error('Database connection error:', error);
  storageImplementation = new MemStorage();
}

export const storage = storageImplementation;
