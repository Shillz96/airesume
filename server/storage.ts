import { 
  User, InsertUser, Job, Application, Resume, 
  Subscription, InsertSubscription, Addon, InsertAddon, Payment, InsertPayment,
  users, resumes, jobs, applications, savedJobs, subscriptions, addons, payments
} from "@shared/schema";
import { type Activity, type DashboardStats } from "./types";
import session from "express-session";
import createMemoryStore from "memorystore";
import { db } from "./db";
import { eq, and, asc, desc } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import pkg from "pg";
const { Pool } = pkg;

const MemoryStore = createMemoryStore(session);
const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  
  // Resume operations
  getResumes(userId: number): Promise<Resume[]>;
  getResume(id: number, userId: number): Promise<Resume | undefined>;
  createResume(userId: number, resumeData: any): Promise<Resume>;
  updateResume(id: number, userId: number, resumeData: any): Promise<Resume | undefined>;
  deleteResume(id: number, userId: number): Promise<boolean>;
  
  // Job operations
  getJobs(filters?: { title?: string, location?: string, type?: string, experience?: string }): Promise<Job[]>;
  getJob(id: number): Promise<Job | undefined>;
  getSavedJobs(userId: number): Promise<Job[]>;
  getSavedJobIds(userId?: number): Promise<number[]>;
  toggleSavedJob(userId: number, jobId: number): Promise<boolean>;
  
  // Application operations
  createApplication(userId: number, jobId: number, resumeId: number, notes?: string): Promise<Application>;
  getApplications(userId: number): Promise<Application[]>;
  
  // Dashboard operations
  getDashboardStats(userId: number): Promise<DashboardStats>;
  getRecentActivities(userId: number): Promise<Activity[]>;
  
  // Subscription operations
  getUserSubscription(userId: number): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: number, userId: number, updates: Partial<InsertSubscription>): Promise<Subscription | undefined>;
  cancelSubscription(id: number, userId: number): Promise<boolean>;
  
  // Add-on operations
  getUserAddons(userId: number): Promise<Addon[]>;
  createAddon(addon: InsertAddon): Promise<Addon>;
  updateAddon(id: number, userId: number, updates: Partial<InsertAddon>): Promise<Addon | undefined>;
  
  // Payment operations
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentsByUser(userId: number): Promise<Payment[]>;
  
  // Session store
  sessionStore: any;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private resumes: Map<number, Resume>;
  private jobs: Map<number, Job>;
  private savedJobs: Map<string, boolean>; // Format: userId-jobId
  private applications: Map<number, Application>;
  private activities: Map<number, Activity[]>;
  private subscriptions: Map<number, Subscription>;
  private addons: Map<number, Addon>;
  private payments: Map<number, Payment>;
  
  sessionStore: any;
  currentUserId: number;
  currentResumeId: number;
  currentJobId: number;
  currentApplicationId: number;
  currentActivityId: number;
  currentSubscriptionId: number;
  currentAddonId: number;
  currentPaymentId: number;

  constructor() {
    this.users = new Map();
    this.resumes = new Map();
    this.jobs = new Map();
    this.savedJobs = new Map();
    this.applications = new Map();
    this.activities = new Map();
    this.subscriptions = new Map();
    this.addons = new Map();
    this.payments = new Map();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    this.currentUserId = 1;
    this.currentResumeId = 1;
    this.currentJobId = 1;
    this.currentApplicationId = 1;
    this.currentActivityId = 1;
    this.currentSubscriptionId = 1;
    this.currentAddonId = 1;
    this.currentPaymentId = 1;
    
    // Initialize with sample job data
    this.initializeSampleJobs();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      isAdmin: insertUser.isAdmin ?? false // Ensure isAdmin is always set to a boolean
    };
    this.users.set(id, user);
    
    // Initialize user's activities list
    this.activities.set(id, []);
    
    return user;
  }
  
  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = await this.getUser(id);
    if (!existingUser) {
      return undefined;
    }
    
    const updatedUser: User = {
      ...existingUser,
      ...updates,
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Resume operations
  async getResumes(userId: number): Promise<Resume[]> {
    return Array.from(this.resumes.values()).filter(
      (resume) => resume.userId === userId
    );
  }

  async getResume(id: number, userId: number): Promise<Resume | undefined> {
    const resume = this.resumes.get(id);
    if (resume && resume.userId === userId) {
      return resume;
    }
    return undefined;
  }

  async createResume(userId: number, resumeData: any): Promise<Resume> {
    const id = this.currentResumeId++;
    const now = new Date();
    
    const resume: Resume = {
      id,
      userId,
      title: resumeData.title || "Untitled Resume",
      template: resumeData.template || "professional",
      content: resumeData.content || {},
      createdAt: now,
      updatedAt: now
    };
    
    this.resumes.set(id, resume);
    
    // Add activity
    this.addActivity(userId, {
      id: this.currentActivityId++,
      type: 'resume_update',
      title: `Resume created: ${resume.title}`,
      status: 'complete',
      timestamp: now.toISOString()
    });
    
    return resume;
  }

  async updateResume(id: number, userId: number, resumeData: any): Promise<Resume | undefined> {
    const existingResume = await this.getResume(id, userId);
    if (!existingResume) {
      return undefined;
    }
    
    const updatedResume: Resume = {
      ...existingResume,
      title: resumeData.title !== undefined ? resumeData.title : existingResume.title,
      template: resumeData.template !== undefined ? resumeData.template : existingResume.template,
      content: resumeData.content !== undefined ? resumeData.content : existingResume.content,
      updatedAt: new Date()
    };
    
    this.resumes.set(id, updatedResume);
    
    // Add activity
    this.addActivity(userId, {
      id: this.currentActivityId++,
      type: 'resume_update',
      title: `Resume updated: ${updatedResume.title}`,
      status: 'complete',
      timestamp: new Date().toISOString()
    });
    
    return updatedResume;
  }

  async deleteResume(id: number, userId: number): Promise<boolean> {
    const resume = await this.getResume(id, userId);
    if (!resume) {
      return false;
    }
    
    this.resumes.delete(id);
    return true;
  }

  // Job operations
  async getJobs(filters?: { title?: string, location?: string, type?: string, experience?: string }): Promise<Job[]> {
    let jobs = Array.from(this.jobs.values());
    
    if (filters) {
      if (filters.title) {
        const titleLower = filters.title.toLowerCase();
        jobs = jobs.filter(job => job.title.toLowerCase().includes(titleLower));
      }
      
      if (filters.location) {
        const locationLower = filters.location.toLowerCase();
        jobs = jobs.filter(job => job.location.toLowerCase().includes(locationLower));
      }
      
      if (filters.type && filters.type !== 'all') {
        jobs = jobs.filter(job => job.type.toLowerCase() === filters.type!.toLowerCase());
      }
      
      if (filters.experience && filters.experience !== 'all') {
        // In a real implementation, we'd have an experience level field
        // For this demo, we'll filter based on title keywords
        const experienceLevel = filters.experience.toLowerCase();
        
        if (experienceLevel === 'entry') {
          jobs = jobs.filter(job => 
            job.title.toLowerCase().includes('junior') || 
            job.title.toLowerCase().includes('entry') ||
            job.description.toLowerCase().includes('entry level')
          );
        } else if (experienceLevel === 'mid') {
          jobs = jobs.filter(job => 
            !job.title.toLowerCase().includes('senior') && 
            !job.title.toLowerCase().includes('junior') &&
            !job.title.toLowerCase().includes('lead')
          );
        } else if (experienceLevel === 'senior') {
          jobs = jobs.filter(job => 
            job.title.toLowerCase().includes('senior') || 
            job.title.toLowerCase().includes('lead') ||
            job.description.toLowerCase().includes('senior level')
          );
        } else if (experienceLevel === 'executive') {
          jobs = jobs.filter(job => 
            job.title.toLowerCase().includes('director') || 
            job.title.toLowerCase().includes('vp') ||
            job.title.toLowerCase().includes('chief')
          );
        }
      }
    }
    
    return jobs;
  }

  async getJob(id: number): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async getSavedJobs(userId: number): Promise<Job[]> {
    const savedJobIds = await this.getSavedJobIds(userId);
    const savedJobs: Job[] = [];
    
    for (const jobId of savedJobIds) {
      const job = await this.getJob(jobId);
      if (job) {
        savedJobs.push({ ...job, saved: true });
      }
    }
    
    return savedJobs;
  }

  async getSavedJobIds(userId?: number): Promise<number[]> {
    // If userId is undefined, return an empty array (for guest mode)
    if (userId === undefined) {
      return [];
    }
    
    const savedJobIds: number[] = [];
    
    for (const [key, isSaved] of this.savedJobs.entries()) {
      if (isSaved) {
        const [savedUserId, jobId] = key.split('-').map(Number);
        if (savedUserId === userId) {
          savedJobIds.push(jobId);
        }
      }
    }
    
    return savedJobIds;
  }

  async toggleSavedJob(userId: number, jobId: number): Promise<boolean> {
    const key = `${userId}-${jobId}`;
    const isSaved = this.savedJobs.get(key) || false;
    
    this.savedJobs.set(key, !isSaved);
    
    if (!isSaved) {
      // Add activity when saving a job
      const job = await this.getJob(jobId);
      if (job) {
        this.addActivity(userId, {
          id: this.currentActivityId++,
          type: 'job_match',
          title: `Saved job: ${job.title} at ${job.company}`,
          status: 'new',
          timestamp: new Date().toISOString()
        });
      }
    }
    
    return !isSaved;
  }

  // Application operations
  async createApplication(userId: number, jobId: number, resumeId: number, notes?: string): Promise<Application> {
    const id = this.currentApplicationId++;
    const now = new Date();
    
    const application: Application = {
      id,
      userId,
      jobId,
      resumeId,
      status: 'applied',
      appliedAt: now,
      notes: notes || null
    };
    
    this.applications.set(id, application);
    
    // Add activity
    const job = await this.getJob(jobId);
    if (job) {
      this.addActivity(userId, {
        id: this.currentActivityId++,
        type: 'job_application',
        title: `Applied to: ${job.title} at ${job.company}`,
        status: 'in_progress',
        timestamp: now.toISOString()
      });
    }
    
    return application;
  }

  async getApplications(userId: number): Promise<Application[]> {
    return Array.from(this.applications.values()).filter(
      (application) => application.userId === userId
    );
  }

  // Dashboard operations
  async getDashboardStats(userId: number): Promise<DashboardStats> {
    const resumes = await this.getResumes(userId);
    const savedJobs = await this.getSavedJobs(userId);
    const applications = await this.getApplications(userId);
    
    return {
      activeResumes: resumes.length,
      jobMatches: await this.getJobs().then(jobs => jobs.length),
      submittedApplications: applications.length
    };
  }

  async getRecentActivities(userId: number): Promise<Activity[]> {
    const userActivities = this.activities.get(userId) || [];
    
    // Sort by timestamp in descending order (most recent first)
    return [...userActivities].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }
  
  // Subscription operations
  async getUserSubscription(userId: number): Promise<Subscription | undefined> {
    // Find the subscription for the given user
    const subscriptions = Array.from(this.subscriptions.values()).filter(
      (subscription) => subscription.userId === userId
    );
    
    // Return the active subscription if exists
    return subscriptions.find(sub => sub.status === 'active');
  }
  
  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const id = this.currentSubscriptionId++;
    const now = new Date();
    
    // Create the subscription with defaults, ensuring required fields have values
    const newSubscription: Subscription = {
      id,
      userId: subscription.userId,
      planType: subscription.planType,
      status: subscription.status || "active",
      startDate: subscription.startDate || now,
      endDate: subscription.endDate || null,
      paymentMethod: subscription.paymentMethod || null,
      autoRenew: subscription.autoRenew !== undefined ? subscription.autoRenew : true,
      createdAt: now,
      updatedAt: now
    };
    
    this.subscriptions.set(id, newSubscription);
    
    // Add activity
    this.addActivity(subscription.userId, {
      id: this.currentActivityId++,
      type: 'resume_update', // Using existing type for now
      title: `Subscription started: ${subscription.planType}`,
      status: 'complete',
      timestamp: now.toISOString()
    });
    
    return newSubscription;
  }
  
  async updateSubscription(id: number, userId: number, updates: Partial<InsertSubscription>): Promise<Subscription | undefined> {
    const existingSubscription = this.subscriptions.get(id);
    
    if (!existingSubscription || existingSubscription.userId !== userId) {
      return undefined;
    }
    
    const updatedSubscription: Subscription = {
      ...existingSubscription,
      ...updates,
      updatedAt: new Date()
    };
    
    this.subscriptions.set(id, updatedSubscription);
    
    // Add activity
    this.addActivity(userId, {
      id: this.currentActivityId++,
      type: 'resume_update', // Using existing type for now
      title: `Subscription updated: ${updatedSubscription.planType}`,
      status: 'complete',
      timestamp: new Date().toISOString()
    });
    
    return updatedSubscription;
  }
  
  async cancelSubscription(id: number, userId: number): Promise<boolean> {
    const existingSubscription = this.subscriptions.get(id);
    
    if (!existingSubscription || existingSubscription.userId !== userId) {
      return false;
    }
    
    // Update the subscription status to cancelled
    const updatedSubscription: Subscription = {
      ...existingSubscription,
      status: 'cancelled',
      updatedAt: new Date()
    };
    
    this.subscriptions.set(id, updatedSubscription);
    
    // Add activity
    this.addActivity(userId, {
      id: this.currentActivityId++,
      type: 'resume_update', // Using existing type for now
      title: `Subscription cancelled: ${updatedSubscription.planType}`,
      status: 'complete',
      timestamp: new Date().toISOString()
    });
    
    return true;
  }
  
  // Add-on operations
  async getUserAddons(userId: number): Promise<Addon[]> {
    return Array.from(this.addons.values()).filter(
      (addon) => addon.userId === userId
    );
  }
  
  async createAddon(addon: InsertAddon): Promise<Addon> {
    const id = this.currentAddonId++;
    const now = new Date();
    
    // Create the add-on with defaults, ensuring required fields have values
    const newAddon: Addon = {
      id,
      userId: addon.userId,
      addonType: addon.addonType,
      quantity: addon.quantity || 1,
      expiresAt: addon.expiresAt || null,
      createdAt: now
    };
    
    this.addons.set(id, newAddon);
    
    // Add activity
    this.addActivity(addon.userId, {
      id: this.currentActivityId++,
      type: 'resume_update', // Using existing type for now
      title: `Add-on purchased: ${addon.addonType}`,
      status: 'complete',
      timestamp: now.toISOString()
    });
    
    return newAddon;
  }
  
  async updateAddon(id: number, userId: number, updates: Partial<InsertAddon>): Promise<Addon | undefined> {
    const existingAddon = this.addons.get(id);
    
    if (!existingAddon || existingAddon.userId !== userId) {
      return undefined;
    }
    
    const updatedAddon: Addon = {
      ...existingAddon,
      ...updates
    };
    
    this.addons.set(id, updatedAddon);
    
    return updatedAddon;
  }
  
  // Payment operations
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const id = this.currentPaymentId++;
    const now = new Date();
    
    // Create the payment with defaults, ensuring required fields have values
    const newPayment: Payment = {
      id,
      userId: payment.userId,
      amount: payment.amount,
      currency: payment.currency || "USD",
      paymentMethod: payment.paymentMethod,
      status: payment.status,
      transactionId: payment.transactionId || null,
      itemType: payment.itemType,
      itemId: payment.itemId || null,
      createdAt: now
    };
    
    this.payments.set(id, newPayment);
    
    // Add activity based on payment type
    let activityTitle = "Payment processed";
    if (payment.itemType === 'subscription') {
      activityTitle = `Subscription payment: $${payment.amount} ${payment.currency || "USD"}`;
    } else if (payment.itemType === 'addon') {
      activityTitle = `Add-on payment: $${payment.amount} ${payment.currency || "USD"}`;
    }
    
    this.addActivity(payment.userId, {
      id: this.currentActivityId++,
      type: 'resume_update', // Using existing type for now
      title: activityTitle,
      status: 'complete',
      timestamp: now.toISOString()
    });
    
    return newPayment;
  }
  
  async getPaymentsByUser(userId: number): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(
      (payment) => payment.userId === userId
    );
  }

  // Helper methods
  private addActivity(userId: number, activity: Activity): void {
    const userActivities = this.activities.get(userId) || [];
    userActivities.push(activity);
    this.activities.set(userId, userActivities);
    
    // Limit to 10 most recent activities
    if (userActivities.length > 10) {
      userActivities.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      this.activities.set(userId, userActivities.slice(0, 10));
    }
  }

  private initializeSampleJobs(): void {
    const now = new Date();
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(now.getDate() - 3);
    
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);
    
    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(now.getDate() - 14);
    
    const defaultJob = {
      company: "TechGlobal Inc.",
      location: "San Francisco, CA (Remote)",
      type: "Full-time",
      description: "Looking for a senior frontend developer with expertise in React, TypeScript, and modern frontend architectures. You'll work on building scalable web applications used by millions of users.",
      skills: ["React", "TypeScript", "Redux", "CSS-in-JS"],
      postedAt: threeDaysAgo,
      expiresAt: null,
      applyUrl: "https://example.com/apply/1"
    };
    
    const jobs: Partial<Job>[] = [
      {
        id: this.currentJobId++,
        title: "Senior Frontend Developer",
        ...defaultJob
      },
      {
        id: this.currentJobId++,
        title: "Full Stack Developer",
        company: "InnovateTech Solutions",
        location: "New York, NY",
        type: "Full-time",
        description: "We are seeking an experienced full stack developer who is comfortable with both frontend and backend technologies. You'll be working on our main product and collaborating with a talented team.",
        skills: ["JavaScript", "Node.js", "React", "MongoDB"],
        postedAt: oneWeekAgo,
        expiresAt: null,
        applyUrl: "https://example.com/apply/2"
      },
      {
        id: this.currentJobId++,
        title: "UI/UX Developer",
        company: "DesignFirst Company",
        location: "Austin, TX (Remote)",
        type: "Contract",
        description: "Seeking a UI/UX Developer who can translate designs into beautiful, responsive interfaces. You should have a good eye for design as well as strong frontend development skills.",
        skills: ["HTML/CSS", "JavaScript", "Figma", "Responsive Design"],
        postedAt: twoWeeksAgo,
        expiresAt: null,
        applyUrl: "https://example.com/apply/3"
      },
      {
        id: this.currentJobId++,
        title: "Backend Engineer",
        company: "DataSystems Corp",
        location: "Seattle, WA",
        type: "Full-time",
        description: "Join our backend team to develop and maintain high-performance APIs and services. Experience with distributed systems and cloud infrastructure is a plus.",
        skills: ["Node.js", "Python", "PostgreSQL", "AWS"],
        postedAt: threeDaysAgo,
        expiresAt: null,
        applyUrl: "https://example.com/apply/4"
      },
      {
        id: this.currentJobId++,
        title: "Junior Frontend Developer",
        company: "StartupHub",
        location: "Chicago, IL (Hybrid)",
        type: "Full-time",
        description: "Great opportunity for a junior developer to grow their skills. Work on our web application with mentorship from senior team members. Entry level position perfect for recent graduates.",
        skills: ["HTML/CSS", "JavaScript", "React", "Git"],
        postedAt: now,
        expiresAt: null,
        applyUrl: "https://example.com/apply/5"
      },
      {
        id: this.currentJobId++,
        title: "DevOps Engineer",
        company: "CloudNative Solutions",
        location: "Remote",
        type: "Full-time",
        description: "Looking for a DevOps engineer to help us build and maintain our cloud infrastructure. Experience with containerization and CI/CD pipelines is required.",
        skills: ["Docker", "Kubernetes", "CI/CD", "AWS/Azure"],
        postedAt: oneWeekAgo,
        expiresAt: null,
        applyUrl: "https://example.com/apply/6"
      }
    ];
    
    jobs.forEach(job => {
      if (job.id !== undefined) {
        this.jobs.set(job.id, job as Job);
      }
    });
  }
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;
  
  constructor() {
    // Initialize session store with PostgreSQL
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Ensure isAdmin is always a boolean
    const userToInsert = {
      ...insertUser,
      isAdmin: insertUser.isAdmin ?? false
    };
    
    const [user] = await db.insert(users).values(userToInsert).returning();
    return user;
  }
  
  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    // First check if the user exists
    const existingUser = await this.getUser(id);
    if (!existingUser) {
      return undefined;
    }
    
    // Update the user in the database
    const [updatedUser] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
      
    return updatedUser;
  }
  
  // Resume operations
  async getResumes(userId: number): Promise<Resume[]> {
    return db.select().from(resumes).where(eq(resumes.userId, userId));
  }

  async getResume(id: number, userId: number): Promise<Resume | undefined> {
    const [resume] = await db.select().from(resumes)
      .where(and(eq(resumes.id, id), eq(resumes.userId, userId)));
    return resume;
  }

  async createResume(userId: number, resumeData: any): Promise<Resume> {
    const now = new Date();
    const [resume] = await db.insert(resumes).values({
      userId,
      title: resumeData.title || "Untitled Resume",
      template: resumeData.template || "professional",
      content: resumeData.content || {},
      createdAt: now,
      updatedAt: now
    }).returning();
    
    // Add activity
    await this.addActivity(userId, {
      id: Date.now(), // Use timestamp as unique ID
      type: 'resume_update',
      title: `Resume created: ${resume.title}`,
      status: 'complete',
      timestamp: now.toISOString()
    });
    
    return resume;
  }

  async updateResume(id: number, userId: number, resumeData: any): Promise<Resume | undefined> {
    const existingResume = await this.getResume(id, userId);
    if (!existingResume) {
      return undefined;
    }
    
    const now = new Date();
    const [updatedResume] = await db.update(resumes)
      .set({
        title: resumeData.title !== undefined ? resumeData.title : existingResume.title,
        template: resumeData.template !== undefined ? resumeData.template : existingResume.template,
        content: resumeData.content !== undefined ? resumeData.content : existingResume.content,
        updatedAt: now
      })
      .where(and(eq(resumes.id, id), eq(resumes.userId, userId)))
      .returning();
    
    // Add activity
    if (updatedResume) {
      await this.addActivity(userId, {
        id: Date.now(),
        type: 'resume_update',
        title: `Resume updated: ${updatedResume.title}`,
        status: 'complete',
        timestamp: now.toISOString()
      });
    }
    
    return updatedResume;
  }

  async deleteResume(id: number, userId: number): Promise<boolean> {
    const result = await db.delete(resumes)
      .where(and(eq(resumes.id, id), eq(resumes.userId, userId)))
      .returning();
    
    return result.length > 0;
  }
  
  // Job operations
  async getJobs(filters?: { title?: string, location?: string, type?: string, experience?: string }): Promise<Job[]> {
    // For simplicity, we're just fetching all jobs and filtering in memory for now
    // In a real application, you'd build a more sophisticated query with WHERE clauses
    const allJobs = await db.select().from(jobs);
    let filteredJobs = [...allJobs];
    
    if (filters) {
      if (filters.title) {
        const titleLower = filters.title.toLowerCase();
        filteredJobs = filteredJobs.filter(job => job.title.toLowerCase().includes(titleLower));
      }
      
      if (filters.location) {
        const locationLower = filters.location.toLowerCase();
        filteredJobs = filteredJobs.filter(job => job.location.toLowerCase().includes(locationLower));
      }
      
      if (filters.type && filters.type !== 'all') {
        filteredJobs = filteredJobs.filter(job => job.type.toLowerCase() === filters.type!.toLowerCase());
      }
      
      if (filters.experience && filters.experience !== 'all') {
        const experienceLevel = filters.experience.toLowerCase();
        
        if (experienceLevel === 'entry') {
          filteredJobs = filteredJobs.filter(job => 
            job.title.toLowerCase().includes('junior') || 
            job.title.toLowerCase().includes('entry') ||
            job.description.toLowerCase().includes('entry level')
          );
        } else if (experienceLevel === 'mid') {
          filteredJobs = filteredJobs.filter(job => 
            !job.title.toLowerCase().includes('senior') && 
            !job.title.toLowerCase().includes('junior') &&
            !job.title.toLowerCase().includes('lead')
          );
        } else if (experienceLevel === 'senior') {
          filteredJobs = filteredJobs.filter(job => 
            job.title.toLowerCase().includes('senior') || 
            job.title.toLowerCase().includes('lead') ||
            job.description.toLowerCase().includes('senior level')
          );
        } else if (experienceLevel === 'executive') {
          filteredJobs = filteredJobs.filter(job => 
            job.title.toLowerCase().includes('director') || 
            job.title.toLowerCase().includes('vp') ||
            job.title.toLowerCase().includes('chief')
          );
        }
      }
    }
    
    // Convert isNew here in-memory for each job
    return filteredJobs.map(job => ({
      ...job,
      isNew: this.isNewJob(job.postedAt),
    }));
  }

  private isNewJob(postedAt: Date): boolean {
    const now = new Date();
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(now.getDate() - 3);
    
    return postedAt >= threeDaysAgo;
  }

  async getJob(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    if (job) {
      return {
        ...job,
        isNew: this.isNewJob(job.postedAt),
      };
    }
    return undefined;
  }

  async getSavedJobs(userId: number): Promise<Job[]> {
    // Join the saved_jobs table with the jobs table
    const savedJobsData = await db.select({
      job: jobs,
      savedJob: savedJobs,
    }).from(savedJobs)
      .innerJoin(jobs, eq(savedJobs.jobId, jobs.id))
      .where(eq(savedJobs.userId, userId));
    
    // Format the result for the expected Job type with saved=true
    return savedJobsData.map(({ job }) => ({
      ...job,
      saved: true,
      isNew: this.isNewJob(job.postedAt),
    }));
  }

  async getSavedJobIds(userId?: number): Promise<number[]> {
    // If userId is undefined, return an empty array (for guest mode)
    if (userId === undefined) {
      return [];
    }
    
    const savedJobsData = await db.select({ jobId: savedJobs.jobId })
      .from(savedJobs)
      .where(eq(savedJobs.userId, userId));
    
    return savedJobsData.map(item => item.jobId);
  }

  async toggleSavedJob(userId: number, jobId: number): Promise<boolean> {
    // Check if the job is already saved
    const [existingSavedJob] = await db.select()
      .from(savedJobs)
      .where(and(
        eq(savedJobs.userId, userId),
        eq(savedJobs.jobId, jobId)
      ));
    
    if (existingSavedJob) {
      // Job is already saved, so remove it
      await db.delete(savedJobs)
        .where(and(
          eq(savedJobs.userId, userId),
          eq(savedJobs.jobId, jobId)
        ));
      return false;
    } else {
      // Job is not saved, so save it
      await db.insert(savedJobs)
        .values({
          userId,
          jobId,
          savedAt: new Date(),
        });
      
      // Add activity
      const job = await this.getJob(jobId);
      if (job) {
        await this.addActivity(userId, {
          id: Date.now(),
          type: 'job_match',
          title: `Saved job: ${job.title} at ${job.company}`,
          status: 'new',
          timestamp: new Date().toISOString()
        });
      }
      
      return true;
    }
  }
  
  // Application operations
  async createApplication(userId: number, jobId: number, resumeId: number, notes?: string): Promise<Application> {
    const now = new Date();
    
    const [application] = await db.insert(applications)
      .values({
        userId,
        jobId,
        resumeId,
        status: 'applied',
        appliedAt: now,
        notes: notes || null
      })
      .returning();
    
    // Add activity
    const job = await this.getJob(jobId);
    if (job) {
      await this.addActivity(userId, {
        id: Date.now(),
        type: 'job_application',
        title: `Applied to: ${job.title} at ${job.company}`,
        status: 'in_progress',
        timestamp: now.toISOString()
      });
    }
    
    return application;
  }

  async getApplications(userId: number): Promise<Application[]> {
    return db.select()
      .from(applications)
      .where(eq(applications.userId, userId));
  }
  
  // Dashboard operations
  async getDashboardStats(userId: number): Promise<DashboardStats> {
    const resumeCount = await db.select()
      .from(resumes)
      .where(eq(resumes.userId, userId));
    
    const applicationsCount = await db.select()
      .from(applications)
      .where(eq(applications.userId, userId));
    
    const jobsCount = await db.select()
      .from(jobs);
    
    return {
      activeResumes: resumeCount.length,
      jobMatches: jobsCount.length,
      submittedApplications: applicationsCount.length
    };
  }

  async getRecentActivities(userId: number): Promise<Activity[]> {
    // Placeholder for activities - in a real implementation, you'd have an activities table
    // For now, we'll return an empty array, but you would implement a proper DB query
    return [];
  }
  
  // We need a method to add activities - in a real implementation, this would insert into a DB table
  private async addActivity(userId: number, activity: Activity): Promise<void> {
    // This is a placeholder function - in a real implementation, you'd insert the activity into a DB table
    console.log(`Activity for user ${userId}: ${activity.title}`);
  }
  
  // Subscription operations
  async getUserSubscription(userId: number): Promise<Subscription | undefined> {
    const [subscription] = await db.select()
      .from(subscriptions)
      .where(and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.status, 'active')
      ));
    
    return subscription;
  }
  
  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const now = new Date();
    
    const [newSubscription] = await db.insert(subscriptions)
      .values({
        userId: subscription.userId,
        planType: subscription.planType,
        status: subscription.status || 'active',
        startDate: subscription.startDate || now,
        endDate: subscription.endDate || null,
        paymentMethod: subscription.paymentMethod || null,
        autoRenew: subscription.autoRenew !== undefined ? subscription.autoRenew : true,
        createdAt: now,
        updatedAt: now
      })
      .returning();
    
    // Add activity
    await this.addActivity(subscription.userId, {
      id: Date.now(),
      type: 'resume_update', // Using existing type for now
      title: `Subscription started: ${subscription.planType}`,
      status: 'complete',
      timestamp: now.toISOString()
    });
    
    return newSubscription;
  }
  
  async updateSubscription(id: number, userId: number, updates: Partial<InsertSubscription>): Promise<Subscription | undefined> {
    const now = new Date();
    
    const [updatedSubscription] = await db.update(subscriptions)
      .set({
        ...updates,
        updatedAt: now
      })
      .where(and(
        eq(subscriptions.id, id),
        eq(subscriptions.userId, userId)
      ))
      .returning();
    
    if (updatedSubscription) {
      // Add activity
      await this.addActivity(userId, {
        id: Date.now(),
        type: 'resume_update', // Using existing type for now
        title: `Subscription updated: ${updatedSubscription.planType}`,
        status: 'complete',
        timestamp: now.toISOString()
      });
    }
    
    return updatedSubscription;
  }
  
  async cancelSubscription(id: number, userId: number): Promise<boolean> {
    const [updatedSubscription] = await db.update(subscriptions)
      .set({
        status: 'cancelled',
        updatedAt: new Date()
      })
      .where(and(
        eq(subscriptions.id, id),
        eq(subscriptions.userId, userId)
      ))
      .returning();
    
    if (updatedSubscription) {
      // Add activity
      await this.addActivity(userId, {
        id: Date.now(),
        type: 'resume_update', // Using existing type for now
        title: `Subscription cancelled: ${updatedSubscription.planType}`,
        status: 'complete',
        timestamp: new Date().toISOString()
      });
      return true;
    }
    
    return false;
  }
  
  // Add-on operations
  async getUserAddons(userId: number): Promise<Addon[]> {
    return db.select()
      .from(addons)
      .where(eq(addons.userId, userId));
  }
  
  async createAddon(addon: InsertAddon): Promise<Addon> {
    const [newAddon] = await db.insert(addons)
      .values({
        userId: addon.userId,
        addonType: addon.addonType,
        quantity: addon.quantity || 1,
        expiresAt: addon.expiresAt || null,
        createdAt: new Date()
      })
      .returning();
    
    return newAddon;
  }
  
  async updateAddon(id: number, userId: number, updates: Partial<InsertAddon>): Promise<Addon | undefined> {
    const [updatedAddon] = await db.update(addons)
      .set(updates)
      .where(and(
        eq(addons.id, id),
        eq(addons.userId, userId)
      ))
      .returning();
    
    return updatedAddon;
  }
  
  // Payment operations
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db.insert(payments)
      .values({
        userId: payment.userId,
        amount: payment.amount,
        currency: payment.currency || 'USD',
        paymentMethod: payment.paymentMethod,
        status: payment.status,
        transactionId: payment.transactionId || null,
        itemType: payment.itemType,
        itemId: payment.itemId || null,
        createdAt: new Date()
      })
      .returning();
    
    return newPayment;
  }
  
  async getPaymentsByUser(userId: number): Promise<Payment[]> {
    return db.select()
      .from(payments)
      .where(eq(payments.userId, userId))
      .orderBy(desc(payments.createdAt));
  }
}

// Use the database storage for production
export const storage = new DatabaseStorage();
