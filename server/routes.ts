import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { ResumeSuggestions, generateResumeSuggestions, matchJobsWithResume, parseResumeFile } from "./ai";
import multer from "multer";
import path from "path";
import fs from "fs";
import os from "os";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);
  
  // Configure multer for file uploads
  const uploadDir = path.join(os.tmpdir(), 'resume-uploads');
  
  // Ensure upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const multerStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      // Create a unique filename with original extension
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
  
  const upload = multer({ 
    storage: multerStorage,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB max file size
    },
    fileFilter: (_req, file, cb) => {
      // Accept only PDF, DOCX, and TXT files
      const allowedFileTypes = ['.pdf', '.docx', '.txt'];
      const ext = path.extname(file.originalname).toLowerCase();
      
      if (allowedFileTypes.includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error('Only PDF, DOCX, and TXT files are allowed'));
      }
    }
  });

  // Dashboard Stats Route
  app.get("/api/dashboard/stats", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const userId = req.user!.id;
      const stats = await storage.getDashboardStats(userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Recent Activities Route
  app.get("/api/activities", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const userId = req.user!.id;
      const activities = await storage.getRecentActivities(userId);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Resume Routes
  app.get("/api/resumes", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const userId = req.user!.id;
      const resumes = await storage.getResumes(userId);
      res.json(resumes);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  app.get("/api/resumes/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const userId = req.user!.id;
      const resumeId = parseInt(req.params.id);
      
      const resume = await storage.getResume(resumeId, userId);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      res.json(resume);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  app.post("/api/resumes", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const userId = req.user!.id;
      const resumeData = req.body;
      
      const resume = await storage.createResume(userId, resumeData);
      res.status(201).json(resume);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });
  
  // Resume Upload and Parsing Route
  app.post("/api/resume-upload", upload.single('file'), async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const userId = req.user!.id;
      const filePath = req.file.path;
      const fileName = req.file.originalname;
      
      // Parse the resume file
      const parsedResume = await parseResumeFile(filePath, fileName);
      
      // Clean up the uploaded file (optional)
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting temporary file:", err);
      });
      
      res.json(parsedResume);
    } catch (error) {
      console.error("Resume upload error:", error);
      res.status(500).json({ message: (error as Error).message });
    }
  });

  app.post("/api/resumes/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const userId = req.user!.id;
      const resumeId = parseInt(req.params.id);
      const resumeData = req.body;
      
      const resume = await storage.updateResume(resumeId, userId, resumeData);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      res.json(resume);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  app.delete("/api/resumes/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const userId = req.user!.id;
      const resumeId = parseInt(req.params.id);
      
      const success = await storage.deleteResume(resumeId, userId);
      if (!success) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // AI Resume Suggestions Route
  app.get("/api/resumes/:id/suggestions", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const userId = req.user!.id;
      const resumeId = parseInt(req.params.id);
      
      const resume = await storage.getResume(resumeId, userId);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }

      const suggestions = await generateResumeSuggestions(resume);
      res.json({ suggestions });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Job Routes
  app.get("/api/jobs", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const userId = req.user!.id;
      
      // Get filter parameters
      const title = req.query.title as string | undefined;
      const location = req.query.location as string | undefined;
      const type = req.query.type as string | undefined;
      const experience = req.query.experience as string | undefined;
      
      // Get user's primary resume for matching
      const resumes = await storage.getResumes(userId);
      const primaryResume = resumes.length > 0 ? resumes[0] : null;
      
      // Get jobs with filtering
      let jobs = await storage.getJobs({ title, location, type, experience });
      
      // If user has a resume, match jobs with it
      if (primaryResume) {
        jobs = await matchJobsWithResume(jobs, primaryResume);
      }
      
      // Mark saved jobs
      const savedJobIds = await storage.getSavedJobIds(userId);
      jobs = jobs.map(job => ({
        ...job,
        saved: savedJobIds.includes(job.id)
      }));
      
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  app.post("/api/jobs/:id/toggle-save", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const userId = req.user!.id;
      const jobId = parseInt(req.params.id);
      
      const isSaved = await storage.toggleSavedJob(userId, jobId);
      res.json({ saved: isSaved });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  app.get("/api/saved-jobs", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const userId = req.user!.id;
      const savedJobs = await storage.getSavedJobs(userId);
      res.json(savedJobs);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Application Routes
  app.post("/api/applications", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const userId = req.user!.id;
      const { jobId, resumeId, notes } = req.body;
      
      const application = await storage.createApplication(userId, jobId, resumeId, notes);
      res.status(201).json(application);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  app.get("/api/applications", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const userId = req.user!.id;
      const applications = await storage.getApplications(userId);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
