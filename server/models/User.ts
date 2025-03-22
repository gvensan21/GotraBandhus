import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { User as UserType } from '@shared/schema';

// Define the user document interface extending both Mongoose Document and our User type
export interface UserDocument extends UserType, Document {
  // Add methods to the interface
  comparePassword(candidatePassword: string): Promise<boolean>;
  checkProfileCompletion(): boolean;
}

// Create the user schema
const userSchema = new Schema({
  // Personal info
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  nickname: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  dateOfBirth: { type: Date },
  placeOfBirth: { type: String },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  
  // Current location
  currentCity: { type: String, required: true },
  currentState: { type: String, required: true },
  currentCountry: { type: String, required: true },
  
  // Cultural information
  gotra: { type: String, required: true },
  pravara: { type: String, required: true },
  community: { type: String, required: true },
  nativePlace: { type: String },
  
  // Additional info
  occupation: { type: String },
  education: { type: String },
  interests: [{ type: String }],
  primaryLanguage: { type: String, required: true },
  otherLanguages: [{ type: String }],
  
  // Profile status
  profileCompleted: { type: Boolean, default: false },
  privacySettings: {
    profileVisibility: { type: String, enum: ['public', 'connections', 'private'], default: 'public' },
    contactInfoVisibility: { type: String, enum: ['public', 'connections', 'private'], default: 'connections' }
  },
  
  // Optional bio
  bio: { type: String }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash password
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Method to check if profile is complete
userSchema.methods.checkProfileCompletion = function(): boolean {
  // List of required fields for profile completion
  const requiredFields = [
    'firstName', 'lastName', 'nickname', 'email', 'phone', 'gender',
    'currentCity', 'currentState', 'currentCountry',
    'gotra', 'pravara', 'community', 'primaryLanguage'
  ];
  
  // Check if all required fields have values
  return requiredFields.every(field => {
    return this[field as keyof UserDocument] !== undefined && 
           this[field as keyof UserDocument] !== null && 
           this[field as keyof UserDocument] !== '';
  });
};

// Update profileCompleted flag before saving
userSchema.pre('save', function(next) {
  // Check if profile is complete and update the flag
  // Use a type assertion to satisfy TypeScript
  const self = this as unknown as UserDocument;
  self.profileCompleted = self.checkProfileCompletion();
  next();
});

// Create and export the User model
export const UserModel = mongoose.model<UserDocument>('User', userSchema);