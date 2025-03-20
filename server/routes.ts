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
        return res.status(400).json({ success: false, error: "No file uploaded" });
      }
      
      const userId = req.user!.id;
      const filePath = req.file.path;
      const fileName = req.file.originalname;
      
      // Double-check file format (in addition to multer filter)
      const fileExtension = path.extname(fileName).toLowerCase();
      if (!['.pdf', '.docx', '.txt'].includes(fileExtension)) {
        fs.unlink(filePath, (err) => {
          if (err) console.error("Error deleting invalid file:", err);
        });
        return res.status(400).json({ 
          success: false, 
          error: "Invalid file format. Please upload a PDF, DOCX, or TXT file." 
        });
      }
      
      // Verify API key is configured
      if (!process.env.OPENAI_API_KEY) {
        console.warn("OpenAI API key not configured for resume parsing");
        return res.status(400).json({ 
          success: false, 
          error: "AI service is not properly configured. Please contact the administrator." 
        });
      }
      
      // Parse the resume file
      console.log(`Processing resume upload: ${fileName} (${fileExtension})`);
      const parsedResume = await parseResumeFile(filePath, fileName);
      
      // Clean up the uploaded file
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting temporary file:", err);
      });
      
      // Create a resume in the database with the parsed data
      if (parsedResume.success && parsedResume.data) {
        try {
          // Generate a title based on the parsed data
          const personalInfo = parsedResume.data.personalInfo || {};
          const resumeTitle = `${personalInfo.firstName || ''} ${personalInfo.lastName || ''} Resume`.trim();
          
          // Create the resume entry in database
          const resume = await storage.createResume(userId, {
            title: resumeTitle || 'My Resume',
            content: parsedResume.data,
            template: 'professional'
          });
          
          // Return both the parsed data and the created resume
          res.json({
            ...parsedResume,
            resumeId: resume.id
          });
        } catch (dbError) {
          console.error("Error saving resume to database:", dbError);
          // Still return the parsed data even if saving to DB failed
          res.json(parsedResume);
        }
      } else {
        // Just return the parsed data if there was an issue
        res.json(parsedResume);
      }
    } catch (error: any) {
      console.error("Resume upload error:", error);
      
      // Check for common OpenAI API errors
      if (error?.status === 429) {
        return res.status(429).json({ 
          success: false, 
          error: "The AI service is currently experiencing high demand. Please try again later." 
        });
      }
      
      if (error?.code === 'insufficient_quota') {
        return res.status(402).json({ 
          success: false, 
          error: "AI service quota exceeded. Please try again later." 
        });
      }
      
      res.status(500).json({ 
        success: false, 
        error: "Failed to process the resume file. Please try again." 
      });
    }
  });

  // Get AI suggestions for improving a resume
  app.get("/api/resumes/:id/suggestions", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const userId = req.user!.id;
      const resumeId = parseInt(req.params.id);
      const summaryOnly = req.query.summaryOnly === 'true';
      
      const resume = await storage.getResume(resumeId, userId);
      if (!resume) {
        return res.status(404).json({ success: false, error: "Resume not found" });
      }
      
      if (summaryOnly) {
        // For summaryOnly requests, use OpenAI to generate complete summary rewrites
        try {
          // Import the openai client from ai.ts
          const response = await (await import('./ai')).openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: "You are an expert resume writer. Given a person's resume information, generate 3 different complete professional summaries that highlight their experience, skills, and unique selling points. Make each summary different in tone and focus, but all professionally written and ready to use on a resume."
              },
              {
                role: "user",
                content: `Generate 3 different professional summaries based on this person's information:
                
                Name: ${resume.content?.personalInfo?.firstName || ''} ${resume.content?.personalInfo?.lastName || ''}
                
                Current Summary: ${resume.content?.personalInfo?.summary || ''}
                
                Experience: ${JSON.stringify(resume.content?.experience || [])}
                
                Skills: ${JSON.stringify(resume.content?.skills || [])}
                
                Each summary should be complete, professionally written, and approximately 2-4 sentences long. Use varied styles and highlight different strengths in each one. Return just the summaries, not explanations or other text.`
              }
            ],
          });
          
          // Process the response to extract the 3 summaries
          const content = response.choices[0].message.content || '';
          
          // Extract summaries, assuming they are separated by numbers or line breaks
          const summaryLines = content.split(/\n+/);
          const summaries = summaryLines
            .filter(line => line.trim().length > 0)
            .filter(line => !line.trim().match(/^[0-9]\.?\s*$/)) // Remove number-only lines
            .map(line => line.replace(/^[0-9]\.?\s*/, '').trim()) // Remove leading numbers
            .filter(line => line.length > 50); // Only include lines long enough to be summaries
            
          if (summaries.length > 0) {
            return res.json({ success: true, suggestions: summaries });
          }
          
          // Fallback if no good summaries were extracted
          return res.json({ 
            success: true, 
            suggestions: [
              "Dynamic professional with a proven track record of delivering high-quality results through technical expertise and innovative problem-solving. Excels in collaborative environments while driving continuous improvement and efficiency gains across projects.",
              "Detail-oriented specialist combining analytical thinking with strong communication skills to translate complex requirements into practical solutions. Committed to excellence with a demonstrated history of exceeding stakeholder expectations.",
              "Results-driven professional with expertise in leveraging cutting-edge technologies to address business challenges. Balances technical proficiency with strategic insight to deliver meaningful outcomes and sustainable growth."
            ]
          });
        } catch (error) {
          console.error("Error generating summary suggestions:", error);
          return res.json({ 
            success: true, 
            suggestions: [
              "Dynamic professional with a proven track record of delivering high-quality results through technical expertise and innovative problem-solving. Excels in collaborative environments while driving continuous improvement and efficiency gains across projects.",
              "Detail-oriented specialist combining analytical thinking with strong communication skills to translate complex requirements into practical solutions. Committed to excellence with a demonstrated history of exceeding stakeholder expectations.",
              "Results-driven professional with expertise in leveraging cutting-edge technologies to address business challenges. Balances technical proficiency with strategic insight to deliver meaningful outcomes and sustainable growth."
            ]
          });
        }
      } else {
        // Generate general resume improvement suggestions using OpenAI
        const suggestions = await generateResumeSuggestions(resume);
        return res.json({ success: true, suggestions });
      }
    } catch (error) {
      console.error("Error generating resume suggestions:", error);
      return res.status(500).json({ 
        success: false, 
        error: "Failed to generate suggestions", 
        fallbackSuggestions: [
          "Add measurable achievements with specific numbers and results",
          "Tailor your skills section to match job requirements",
          "Use powerful action verbs to begin bullet points",
          "Ensure your summary highlights your most relevant qualifications",
          "Include relevant keywords from the job posting"
        ]
      });
    }
  });
  
  // Tailor resume for specific company or job posting
  app.post("/api/resumes/:id/tailor", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const userId = req.user!.id;
      const resumeId = parseInt(req.params.id);
      const { company, jobDescription } = req.body;
      
      if (!company && !jobDescription) {
        return res.status(400).json({ 
          success: false, 
          error: "Either company name or job description is required"
        });
      }
      
      const resume = await storage.getResume(resumeId, userId);
      if (!resume) {
        return res.status(404).json({ success: false, error: "Resume not found" });
      }
      
      // Verify API key is configured
      if (!process.env.OPENAI_API_KEY) {
        return res.status(400).json({ 
          success: false, 
          error: "AI service is not properly configured."
        });
      }
      
      // Use OpenAI to tailor the resume content
      const personalInfo = resume.content?.personalInfo || {};
      const experience = resume.content?.experience || [];
      const skills = resume.content?.skills || [];
      
      // Import the openai client from ai.ts
      const response = await (await import('./ai')).openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert resume tailoring assistant. You will receive a resume and information about a target company or job description. Your task is to suggest specific modifications to the resume to better align it with the target opportunity. Focus on the summary, skills, and experience sections."
          },
          {
            role: "user",
            content: `Tailor this resume for ${company ? 'a position at ' + company : 'this job description'}.
            
            ${jobDescription ? 'Job Description: ' + jobDescription : ''}
            
            Resume Information:
            Summary: ${personalInfo.summary || ''}
            Skills: ${JSON.stringify(skills)}
            Experience: ${JSON.stringify(experience)}
            
            Provide suggestions in JSON format with these sections:
            {
              "summary": "Improved professional summary",
              "skills": ["skill1", "skill2", "skill3"],
              "experienceImprovements": [
                { "id": "1", "improvedDescription": "text" }
              ]
            }`
          }
        ],
        response_format: { type: "json_object" }
      });
      
      try {
        const tailoredContent = JSON.parse(response.choices[0].message.content);
        return res.json({ 
          success: true, 
          tailoredContent,
          originalResume: resume
        });
      } catch (error) {
        return res.status(500).json({ 
          success: false, 
          error: "Failed to process tailored content" 
        });
      }
    } catch (error) {
      console.error("Error tailoring resume:", error);
      return res.status(500).json({ 
        success: false, 
        error: "Failed to tailor resume" 
      });
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

  // The API Resume Suggestions Route is defined above

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
        try {
          // Verify API key is configured
          if (!process.env.OPENAI_API_KEY) {
            console.warn("OpenAI API key not configured for job matching");
            // Continue without job matching but don't return an error
          } else {
            jobs = await matchJobsWithResume(jobs, primaryResume);
          }
        } catch (matchError: any) {
          console.error("Error matching jobs with resume:", matchError);
          // Continue without AI matching if there's an API error
        }
      }
      
      // Mark saved jobs
      const savedJobIds = await storage.getSavedJobIds(userId);
      jobs = jobs.map(job => ({
        ...job,
        saved: savedJobIds.includes(job.id)
      }));
      
      res.json(jobs);
    } catch (error) {
      console.error("Job listing error:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to retrieve job listings" 
      });
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
