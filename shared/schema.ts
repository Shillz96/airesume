import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Resumes table
export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  template: text("template").notNull().default("professional"),
  content: jsonb("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const resumeSchema = createInsertSchema(resumes).pick({
  title: true,
  template: true,
  content: true,
});

export type InsertResume = z.infer<typeof resumeSchema>;
export type Resume = typeof resumes.$inferSelect;

// Jobs table
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  skills: text("skills").array().notNull(),
  postedAt: timestamp("posted_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"),
  applyUrl: text("apply_url").notNull(),
});

export const jobSchema = createInsertSchema(jobs).pick({
  title: true,
  company: true,
  location: true,
  type: true,
  description: true,
  skills: true,
  applyUrl: true,
});

export type InsertJob = z.infer<typeof jobSchema>;
export type Job = typeof jobs.$inferSelect & {
  match?: number;       // Match percentage with user's resume
  isNew?: boolean;      // Whether the job is recent
  saved?: boolean;      // Whether the job is saved by the user
  salary?: string;      // Salary information from Adzuna API
};

// Saved Jobs table
export const savedJobs = pgTable("saved_jobs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  jobId: integer("job_id").notNull().references(() => jobs.id),
  savedAt: timestamp("saved_at").notNull().defaultNow(),
});

export const savedJobSchema = createInsertSchema(savedJobs).pick({
  userId: true,
  jobId: true,
});

export type InsertSavedJob = z.infer<typeof savedJobSchema>;
export type SavedJob = typeof savedJobs.$inferSelect;

// Job Applications table
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  jobId: integer("job_id").notNull().references(() => jobs.id),
  resumeId: integer("resume_id").notNull().references(() => resumes.id),
  status: text("status").notNull().default("applied"),
  appliedAt: timestamp("applied_at").notNull().defaultNow(),
  notes: text("notes"),
});

export const applicationSchema = createInsertSchema(applications).pick({
  userId: true,
  jobId: true,
  resumeId: true,
  status: true,
  notes: true,
});

export type InsertApplication = z.infer<typeof applicationSchema>;
export type Application = typeof applications.$inferSelect;
