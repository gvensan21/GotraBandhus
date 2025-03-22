import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { User as UserType } from '../../shared/schema';

export interface UserDocument extends UserType, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
  checkProfileCompletion(): boolean;
}

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  nickname: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  dateOfBirth: { type: String },
  birthCity: { type: String },
  birthState: { type: String },
  birthCountry: { type: String },
  currentCity: { type: String, required: true },
  currentState: { type: String, required: true },
  currentCountry: { type: String, required: true },
  gotra: { type: String, required: true },
  pravara: { type: String, required: true },
  occupation: { type: String },
  company: { type: String },
  industry: { type: String },
  primaryLanguage: { type: String, required: true },
  secondaryLanguage: { type: String },
  community: { type: String, required: true },
  hideEmail: { type: Boolean, default: false },
  hidePhone: { type: Boolean, default: false },
  hideDob: { type: Boolean, default: false },
  bio: { type: String },
  profileCompleted: { type: Boolean, default: false },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  const user = this as UserDocument;
  
  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Check if all required profile fields are completed
userSchema.methods.checkProfileCompletion = function(): boolean {
  const user = this as UserDocument;
  const requiredFields = [
    'firstName', 'lastName', 'nickname', 'email', 'phone', 'gender',
    'currentCity', 'currentState', 'currentCountry', 'gotra', 'pravara',
    'community', 'primaryLanguage'
  ];
  
  return requiredFields.every(field => 
    user[field as keyof UserDocument] !== undefined && 
    user[field as keyof UserDocument] !== null && 
    user[field as keyof UserDocument] !== ''
  );
};

// Method to compare password for login
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = mongoose.model<UserDocument>('User', userSchema);