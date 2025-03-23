import { z } from "zod";
import { pgTable, serial, text, varchar, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// Gender enum for database
export const genderEnum = pgEnum("gender", ["male", "female", "other"]);

// Users table schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  nickname: varchar("nickname", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  gender: genderEnum("gender").default("other"),
  dateOfBirth: varchar("date_of_birth", { length: 50 }),
  birthCity: varchar("birth_city", { length: 100 }),
  birthState: varchar("birth_state", { length: 100 }),
  birthCountry: varchar("birth_country", { length: 100 }),
  currentCity: varchar("current_city", { length: 100 }).notNull(),
  currentState: varchar("current_state", { length: 100 }).notNull(),
  currentCountry: varchar("current_country", { length: 100 }).notNull(),
  gotra: varchar("gotra", { length: 100 }).notNull(),
  pravara: varchar("pravara", { length: 100 }).notNull(),
  occupation: varchar("occupation", { length: 100 }),
  company: varchar("company", { length: 100 }),
  industry: varchar("industry", { length: 100 }),
  primaryLanguage: varchar("primary_language", { length: 50 }).notNull(),
  secondaryLanguage: varchar("secondary_language", { length: 50 }),
  community: varchar("community", { length: 100 }).notNull(),
  hideEmail: boolean("hide_email").default(false),
  hidePhone: boolean("hide_phone").default(false),
  hideDob: boolean("hide_dob").default(false),
  bio: text("bio"),
  profileCompleted: boolean("profile_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Drizzle insert schemas
export const insertUserSchema = createInsertSchema(users);

// Zod schemas for validation
export const userSchema = z.object({
  id: z.number().optional(),
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
  id: true,
  password: true,
  createdAt: true,
  updatedAt: true,
  profileCompleted: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
