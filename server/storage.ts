import { User, InsertUser, Job, Application, Resume } from "@shared/schema";
import { type Activity, type DashboardStats } from "./types";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private resumes: Map<number, Resume>;
  private jobs: Map<number, Job>;
  private savedJobs: Map<string, boolean>; // Format: userId-jobId
  private applications: Map<number, Application>;
  private activities: Map<number, Activity[]>;
  
  sessionStore: session.SessionStore;
  currentUserId: number;
  currentResumeId: number;
  currentJobId: number;
  currentApplicationId: number;
  currentActivityId: number;

  constructor() {
    this.users = new Map();
    this.resumes = new Map();
    this.jobs = new Map();
    this.savedJobs = new Map();
    this.applications = new Map();
    this.activities = new Map();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    this.currentUserId = 1;
    this.currentResumeId = 1;
    this.currentJobId = 1;
    this.currentApplicationId = 1;
    this.currentActivityId = 1;
    
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
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    
    // Initialize user's activities list
    this.activities.set(id, []);
    
    return user;
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

export const storage = new MemStorage();
