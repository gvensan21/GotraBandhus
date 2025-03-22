import { z } from "zod";

// User schema
export const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  nickname: z.string().min(1, "Nickname is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(1, "Phone number is required"),
  gender: z.enum(["male", "female", "other"]),
  dateOfBirth: z.string().optional(), 
  birthCity: z.string().optional(),
  birthState: z.string().optional(),
  birthCountry: z.string().optional(),
  currentCity: z.string().min(1, "Current city is required"),
  currentState: z.string().min(1, "Current state is required"),
  currentCountry: z.string().min(1, "Current country is required"),
  gotra: z.string().min(1, "Gotra is required"),
  pravara: z.string().min(1, "Pravara is required"),
  occupation: z.string().optional(),
  company: z.string().optional(),
  industry: z.string().optional(),
  primaryLanguage: z.string().min(1, "Primary language is required"),
  secondaryLanguage: z.string().optional(),
  community: z.string().min(1, "Community is required"),
  hideEmail: z.boolean().default(false),
  hidePhone: z.boolean().default(false),
  hideDob: z.boolean().default(false),
  bio: z.string().optional(),
  profileCompleted: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Registration schema (subset of user schema for registration)
export const registerSchema = userSchema.pick({
  firstName: true,
  lastName: true,
  nickname: true,
  email: true,
  password: true,
  phone: true,
});

// Profile update schema (excludes some fields that shouldn't be updated directly)
export const profileUpdateSchema = userSchema.omit({
  password: true,
  createdAt: true,
  updatedAt: true,
  profileCompleted: true,
});

// Types
export type User = z.infer<typeof userSchema> & {
  // Include MongoDB _id or regular id field
  _id?: string;
  id?: string;
};
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
