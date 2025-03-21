import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, hashPassword, comparePasswords } from "./auth";
import { z } from "zod";
import { ResumeSuggestions, generateResumeSuggestions, matchJobsWithResume, parseResumeFile, openai } from "./ai";
import multer from "multer";
import path from "path";
import fs from "fs";
import os from "os";
import puppeteer from "puppeteer";
import { jobsApiService } from "./services/jobs-api";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve the direct admin page
  app.get('/direct-admin', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'client/src/pages/direct-admin.html'));
  });
  
  // Setup authentication routes
  await setupAuth(app);
  
  // Admin API Routes
  // Stats endpoints for admin dashboard
  app.get("/api/admin/stats/users", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      // Count would normally come from a database query
      // For in-memory storage, we'll use a simpler approach
      const count = (await storage.getAllUsers()).length;
      res.json({ count });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ error: "Failed to fetch user statistics" });
    }
  });
  
  app.get("/api/admin/stats/resumes", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      // Count would normally come from a database query
      // For in-memory storage, we can estimate based on aggregated user resumes
      const count = (await storage.getAllResumes()).length;
      res.json({ count });
    } catch (error) {
      console.error("Error fetching resume stats:", error);
      res.status(500).json({ error: "Failed to fetch resume statistics" });
    }
  });
  
  app.get("/api/admin/stats/jobs", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      // For jobs, we'll use a placeholder count since they're from an external API
      const jobs = await jobsApiService.searchJobs({});
      const count = jobs.length;
      res.json({ count });
    } catch (error) {
      console.error("Error fetching job stats:", error);
      res.status(500).json({ error: "Failed to fetch job statistics" });
    }
  });
  
  app.get("/api/admin/stats/subscriptions", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      // Count would normally come from a database query
      // For in-memory storage, we'll use a simpler approach
      const count = (await storage.getAllSubscriptions()).length;
      res.json({ count });
    } catch (error) {
      console.error("Error fetching subscription stats:", error);
      res.status(500).json({ error: "Failed to fetch subscription statistics" });
    }
  });
  
  // Admin direct login route
  app.post("/api/admin-login", async (req, res) => {
    try {
      // Use the imported hashPassword from auth.ts
      const user = await storage.getUserByUsername("shillshady96");
      if (!user) {
        // Create admin user if it doesn't exist
        const hashedPassword = await hashPassword("Kidcudi690!+=");
        const newAdminUser = await storage.createUser({
          username: "shillshady96",
          password: hashedPassword,
          isAdmin: true
        });
        
        // Give admin a pro subscription
        await storage.createSubscription({
          userId: newAdminUser.id,
          planType: "pro",
          status: "active",
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
          paymentMethod: "system",
          autoRenew: true
        });
        
        // Log the user in
        req.login(newAdminUser, (err) => {
          if (err) {
            return res.status(500).json({ message: "Login error", error: err.message });
          }
          res.status(200).json(newAdminUser);
        });
        return;
      }
      
      // Log the user in directly without password verification
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login error", error: err.message });
        }
        res.status(200).json(user);
      });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
  });
  
  // Route to promote user to admin - allow direct access without authentication
  app.post('/api/admin/make-admin', async (req, res) => {
    const { username } = req.body;
    
    try {
      let userToPromote;
      
      if (username) {
        // If username is provided, try to find that user
        userToPromote = await storage.getUserByUsername(username);
        if (!userToPromote) {
          return res.status(404).json({ error: 'User not found' });
        }
      } else if (req.isAuthenticated()) {
        // If no username but authenticated, use the current user
        userToPromote = req.user;
      } else {
        // Create a sample user with admin privileges if not logged in
        // This is for demo purposes only
        const demoUser = await storage.createUser({
          username: "demouser" + Math.floor(Math.random() * 10000),
          password: await hashPassword("password123"),
          isAdmin: true
        });
        return res.status(200).json(demoUser);
      }
      
      // Update the user to make them an admin
      const updatedUser = await storage.updateUser(userToPromote.id, { isAdmin: true });
      
      if (!updatedUser) {
        return res.status(500).json({ error: 'Failed to update user' });
      }
      
      // If the updated user is the current user (and user is authenticated), update the session as well
      if (req.isAuthenticated() && userToPromote.id === req.user.id) {
        req.login(updatedUser, (err) => {
          if (err) {
            return res.status(500).json({ error: 'Error updating session' });
          }
          
          return res.status(200).json(updatedUser);
        });
      } else {
        return res.status(200).json(updatedUser);
      }
    } catch (error) {
      console.error('Error making user admin:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // API endpoint to test Adzuna API credentials
  app.get('/api/test-adzuna', async (req, res) => {
    try {
      // Get query parameters from request
      const what = req.query.what as string | undefined;
      const where = req.query.where as string | undefined;
      
      // Build URL with any provided parameters
      let apiUrl = `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=${process.env.ADZUNA_APP_ID}&app_key=${process.env.ADZUNA_API_KEY}&results_per_page=5`;
      
      if (what) {
        apiUrl += `&what=${encodeURIComponent(what)}`;
      }
      
      if (where) {
        apiUrl += `&where=${encodeURIComponent(where)}`;
      }
      
      console.log(`Testing Adzuna API: ${apiUrl}`);
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      res.json({
        success: true,
        status: response.status,
        data: data
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
  
  // Configure multer for file uploads
  const uploadDir = path.join(os.tmpdir(), 'resume-uploads');
  
  // Ensure upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const upload = multer({ 
    storage: multer.diskStorage({
      destination: (_req, _file, cb) => {
        cb(null, uploadDir);
      },
      filename: (_req, file, cb) => {
        // Create a unique filename with original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
      }
    }),
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
  
  // Endpoint to get the active resume or a sample one if none exists
  app.get("/api/resumes/active", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const userId = req.user!.id;
      const resumes = await storage.getResumes(userId);
      
      if (resumes.length > 0) {
        // Return the first resume as the active one
        return res.json(resumes[0]);
      }
      
      // If no resume exists, create a sample resume based on the basic professional template
      const sampleResume = {
        title: "Basic Professional Resume",
        template: "professional",
        content: {
          personalInfo: {
            firstName: "Your",
            lastName: "Name",
            email: "yourname@example.com",
            phone: "(123) 456-7890",
            headline: "Software Developer | Web Design Professional",
            summary: "Detail-oriented software developer with experience building responsive web applications and strong problem-solving skills. Proficient in multiple programming languages with a focus on creating efficient, user-friendly solutions.",
          },
          experience: [
            {
              id: "exp-1",
              title: "Software Developer",
              company: "Company Name",
              location: "City, State",
              startDate: "2023-01",
              endDate: "Present",
              description: "Developed and maintained web applications using modern JavaScript frameworks. Collaborated with cross-functional teams to implement new features and improve application performance. Optimized database queries resulting in 30% faster page load times.",
            },
            {
              id: "exp-2",
              title: "Junior Web Developer",
              company: "Previous Company",
              location: "City, State",
              startDate: "2020-06",
              endDate: "2022-12",
              description: "Built responsive user interfaces using HTML, CSS, and JavaScript. Worked with REST APIs to integrate frontend components with backend services. Participated in code reviews and implemented best practices for web development.",
            },
            {
              id: "exp-3",
              title: "Web Design Intern",
              company: "Internship Company",
              location: "City, State",
              startDate: "2019-05",
              endDate: "2020-05",
              description: "Assisted in designing and implementing website layouts. Created graphics and visual elements for company websites and marketing materials. Gained experience with front-end frameworks and version control systems.",
            }
          ],
          education: [
            {
              id: "edu-1",
              degree: "Bachelor of Science, Computer Science",
              institution: "University Name",
              location: "City, State",
              startDate: "2015-09", 
              endDate: "2019-05",
              description: "Relevant coursework: Data Structures, Algorithms, Web Development, Database Systems, Software Engineering",
            }
          ],
          skills: [
            { id: "skill-1", name: "JavaScript", proficiency: 4 },
            { id: "skill-2", name: "React", proficiency: 4 },
            { id: "skill-3", name: "HTML/CSS", proficiency: 5 },
            { id: "skill-4", name: "Node.js", proficiency: 3 },
            { id: "skill-5", name: "SQL", proficiency: 3 },
            { id: "skill-6", name: "Git", proficiency: 4 },
            { id: "skill-7", name: "Python", proficiency: 3 },
            { id: "skill-8", name: "Responsive Design", proficiency: 4 },
          ],
          projects: [
            {
              id: "proj-1",
              title: "E-commerce Website",
              description: "Developed a full-stack e-commerce application with user authentication, product catalog, shopping cart, and payment processing. Implemented responsive design for optimal user experience across all devices.",
              technologies: ["React", "Node.js", "MongoDB", "Express", "CSS"],
              link: "https://github.com/example/ecommerce"
            },
            {
              id: "proj-2",
              title: "Project Management Tool",
              description: "Created a collaborative task management application with real-time updates, user roles, and project tracking features. Implemented drag-and-drop functionality for intuitive task prioritization.",
              technologies: ["JavaScript", "React", "Firebase", "Bootstrap"],
              link: "https://github.com/example/project-manager"
            }
          ]
        }
      };
      
      // Save the sample resume to the database
      try {
        const savedResume = await storage.createResume(userId, sampleResume);
        return res.json(savedResume);
      } catch (saveError) {
        console.error("Error saving sample resume:", saveError);
        // Return the sample resume even if saving fails
        return res.json({
          id: -1,
          userId,
          ...sampleResume,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  app.get("/api/resumes/latest", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const userId = req.user!.id;
      const latestResume = await storage.getLatestResume(userId);
      
      if (!latestResume) {
        return res.status(404).json({ message: "No resume found" });
      }
      
      res.json(latestResume);
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
  app.post("/api/resumes/parse", upload.single('file'), async (req, res) => {
    // Allow guest access to this endpoint (removed authentication check)
    
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: "No file uploaded" });
      }
      
      // If user is authenticated, use their ID; otherwise use a placeholder for guest mode
      const userId = req.isAuthenticated() ? req.user!.id : -1;
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
          
          // Only save to database if user is authenticated
          if (req.isAuthenticated()) {
            // Create the resume entry in database
            const resume = await storage.createResume(userId, {
              title: resumeTitle || 'My Resume',
              content: parsedResume.data,
              template: 'professional'
            });
            
            // Return both the parsed data and the created resume
            return res.json({
              ...parsedResume,
              resumeId: resume.id
            });
          } else {
            // For guest mode, just return the parsed data without saving to DB
            return res.json({
              ...parsedResume,
              guestMode: true,
              message: "Resume parsed successfully. Create an account to save this resume."
            });
          }
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
      const experienceOnly = req.query.experienceOnly === 'true';
      const skillsOnly = req.query.skillsOnly === 'true';
      const jobTitle = req.query.jobTitle as string | undefined;
      
      const resume = await storage.getResume(resumeId, userId);
      if (!resume) {
        return res.status(404).json({ success: false, error: "Resume not found" });
      }
      
      // Generate experience bullet points for a specific job
      if (experienceOnly) {
        try {
          // Use the imported openai client
          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: "You are an expert resume writer who specializes in crafting ATS-optimized bullet points. You create achievement-focused, specific bullet points that highlight measurable results and use industry keywords that pass through applicant tracking systems."
              },
              {
                role: "user",
                content: `Generate 5 professional and ATS-optimized bullet points for a ${jobTitle || 'professional'} based on this existing experience:
                
                Experience: ${JSON.stringify(resume.content?.experience || [])}
                
                Skills: ${JSON.stringify(resume.content?.skills || [])}
                
                Format each bullet point to:
                1. Start with a strong action verb
                2. Include specific, measurable achievements with numbers when possible
                3. Incorporate keywords that ATS systems look for
                4. Focus on accomplishments, not just responsibilities
                5. Be concise (15-20 words per bullet)

                Return only the bullet points, each on a new line. Do not include any other text.`
              }
            ],
          });
          
          // Process the response to extract the bullet points
          const content = response.choices[0].message.content || '';
          
          // Split by lines and clean up
          const bulletPoints = content.split(/\n+/)
            .filter(line => line.trim().length > 0)
            .map(line => line.replace(/^[•\-*]\s*/, '').trim()) // Remove bullet symbols
            .filter(line => line.length > 15); // Must be substantial enough
            
          if (bulletPoints.length > 0) {
            return res.json({ success: true, suggestions: bulletPoints });
          }
          
          // Fallback if extraction failed
          return res.json({ 
            success: true, 
            suggestions: [
              "Increased website performance by 40% through optimization of front-end code and implementation of caching strategies.",
              "Developed and implemented automated testing protocols that reduced QA time by 25% while improving code quality.",
              "Spearheaded migration to cloud-based infrastructure, resulting in 30% cost reduction and 99.9% uptime.",
              "Led cross-functional team of 5 developers to deliver critical project under budget and 2 weeks ahead of schedule.",
              "Designed and implemented RESTful API that processed over 1M requests daily with average response time under 100ms."
            ]
          });
        } catch (error) {
          console.error("Error generating experience suggestions:", error);
          return res.json({ 
            success: true, 
            suggestions: [
              "Increased website performance by 40% through optimization of front-end code and implementation of caching strategies.",
              "Developed and implemented automated testing protocols that reduced QA time by 25% while improving code quality.",
              "Spearheaded migration to cloud-based infrastructure, resulting in 30% cost reduction and 99.9% uptime.",
              "Led cross-functional team of 5 developers to deliver critical project under budget and 2 weeks ahead of schedule.",
              "Designed and implemented RESTful API that processed over 1M requests daily with average response time under 100ms."
            ]
          });
        }
      }
      
      // Generate skill suggestions
      if (skillsOnly) {
        try {
          // Use the imported openai client
          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: "You are an expert at identifying in-demand technical and soft skills that employers and ATS systems look for. You analyze a person's experience and provide relevant skill suggestions that will enhance their resume's visibility and match rate with job descriptions."
              },
              {
                role: "user",
                content: `Based on this person's experience and existing skills, suggest 10 relevant technical and soft skills that would boost their resume's visibility to ATS systems and recruiters${jobTitle ? ' for ' + jobTitle + ' roles' : ''}.
                
                Current Experience: ${JSON.stringify(resume.content?.experience || [])}
                
                Current Skills: ${JSON.stringify(resume.content?.skills || [])}
                
                Return a list of 10 skills only, with no additional text. Include both technical and soft skills that are:
                1. Highly relevant to their experience
                2. In-demand in the current job market
                3. Frequently included in ATS systems as keywords
                4. A mix of both hard technical skills and valuable soft skills`
              }
            ],
            response_format: { type: "text" }
          });
          
          // Process the response to extract the skills
          const content = response.choices[0].message.content || '';
          
          // Split and clean up
          const skills = content.split(/\n+/)
            .filter(line => line.trim().length > 0)
            .map(line => line.replace(/^[•\-*0-9.]\s*/, '').trim()) // Remove bullets or numbering
            .filter(line => line.length > 2 && line.length < 50); // Reasonable skill name length
            
          if (skills.length > 0) {
            return res.json({ success: true, suggestions: skills });
          }
          
          // Fallback skills by job category
          const fallbackSkills = {
            developer: [
              "React", "Node.js", "TypeScript", "GraphQL", "CI/CD", "AWS", "Docker", 
              "Problem Solving", "Agile Methodologies", "System Design"
            ],
            designer: [
              "UI/UX Design", "Figma", "Adobe Creative Suite", "Wireframing", "Prototyping", 
              "User Research", "Accessibility", "Design Systems", "Visual Communication", "Typography"
            ],
            manager: [
              "Agile Project Management", "Team Leadership", "Strategic Planning", "Stakeholder Management", 
              "Budget Oversight", "Risk Management", "Performance Analysis", "Process Optimization", 
              "Change Management", "Cross-functional Collaboration"
            ],
            default: [
              "Project Management", "Communication", "Problem Solving", "Data Analysis", 
              "Microsoft Office Suite", "Critical Thinking", "Collaboration", "Time Management", 
              "Leadership", "Attention to Detail"
            ]
          };
          
          // Determine which fallback list to use
          let categorySkills = fallbackSkills.default;
          if (jobTitle) {
            const title = jobTitle.toLowerCase();
            if (title.includes('develop') || title.includes('engineer') || title.includes('program')) {
              categorySkills = fallbackSkills.developer;
            } else if (title.includes('design')) {
              categorySkills = fallbackSkills.designer;
            } else if (title.includes('manage') || title.includes('director') || title.includes('lead')) {
              categorySkills = fallbackSkills.manager;
            }
          }
          
          return res.json({ success: true, suggestions: categorySkills });
        } catch (error) {
          console.error("Error generating skill suggestions:", error);
          return res.json({ 
            success: true, 
            suggestions: [
              "React", "Node.js", "TypeScript", "GraphQL", "CI/CD", "AWS", "Docker", 
              "Problem Solving", "Agile Methodologies", "System Design"
            ]
          });
        }
      }
      
      // Generate professional summaries
      if (summaryOnly) {
        try {
          // Use the imported openai client
          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: "You are an expert resume writer. Given a person's resume information, generate 3 different complete professional summaries that highlight their experience, skills, and unique selling points. Make each summary different in tone and focus, but all professionally written and ready to use on a resume. Include ATS-friendly keywords."
              },
              {
                role: "user",
                content: `Generate 3 different professional summaries based on this person's information:
                
                Name: ${resume.content?.personalInfo?.firstName || ''} ${resume.content?.personalInfo?.lastName || ''}
                
                Current Summary: ${resume.content?.personalInfo?.summary || ''}
                
                Experience: ${JSON.stringify(resume.content?.experience || [])}
                
                Skills: ${JSON.stringify(resume.content?.skills || [])}
                
                Each summary should be:
                1. Complete, professionally written, and approximately 2-4 sentences long
                2. Include ATS-friendly keywords that hiring systems scan for
                3. Highlight different strengths or angles in each version
                4. Be ready to use without modification
                
                Return just the summaries, not explanations or other text.`
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
      
      // Use the imported openai client
      const response = await openai.chat.completions.create({
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
  
  // New endpoint to tailor resume to a specific job posting
  app.post("/api/resumes/:id/tailor-to-job/:jobId", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const userId = req.user!.id;
      const resumeId = parseInt(req.params.id);
      const jobId = parseInt(req.params.jobId);
      
      // Get the resume and job data
      const resume = await storage.getResume(resumeId, userId);
      const job = await jobsApiService.getJobById(jobId);
      
      if (!resume) {
        return res.status(404).json({ success: false, error: "Resume not found" });
      }
      
      if (!job) {
        return res.status(404).json({ success: false, error: "Job not found" });
      }
      
      // Verify API key is configured
      if (!process.env.OPENAI_API_KEY) {
        return res.status(400).json({ 
          success: false, 
          error: "AI service is not properly configured."
        });
      }
      
      // Extract resume data
      const personalInfo = resume.content?.personalInfo || {};
      const experience = resume.content?.experience || [];
      const skills = resume.content?.skills || [];
      
      // Extract job data
      const { title, company, description, skills: jobSkills = [] } = job;
      
      // Use the imported openai client
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert resume tailoring assistant. You will analyze a job description and modify a resume to maximize its relevance to the specific job. Focus on highlighting the most relevant experience, skills, and accomplishments that align with the job requirements. Identify and incorporate keywords from the job description that may be used in ATS (Applicant Tracking Systems)."
          },
          {
            role: "user",
            content: `Tailor this resume for the following job:
            
            Job Title: ${title}
            Company: ${company}
            Job Description: ${description}
            Required Skills: ${JSON.stringify(jobSkills)}
            
            Resume Information:
            Summary: ${personalInfo.summary || ''}
            Skills: ${JSON.stringify(skills)}
            Experience: ${JSON.stringify(experience)}
            
            Provide a comprehensive tailoring in JSON format with these sections:
            {
              "summary": "ATS-optimized professional summary that directly addresses the job requirements",
              "skills": ["skill1", "skill2", "skill3", ...], (prioritize skills mentioned in the job description)
              "experienceImprovements": [
                { "id": "exp-id", "improvedDescription": "enhanced bullet points that highlight relevant experience" }
              ],
              "keywordsIncorporated": ["keyword1", "keyword2", ...], (list of ATS keywords you've incorporated)
              "matchAnalysis": "Brief explanation of how well the resume matches the job requirements"
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
          originalResume: resume,
          job: job
        });
      } catch (error) {
        console.error("Error parsing tailored content:", error);
        return res.status(500).json({ 
          success: false, 
          error: "Failed to process tailored content" 
        });
      }
    } catch (error) {
      console.error("Error tailoring resume to job:", error);
      return res.status(500).json({ 
        success: false, 
        error: "Failed to tailor resume to job" 
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
  
  // Apply tailored resume content to an existing resume
  app.post("/api/resumes/:id/apply-tailored", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const userId = req.user!.id;
      const resumeId = parseInt(req.params.id);
      const tailoredContent = req.body;
      
      // Get the existing resume
      const resume = await storage.getResume(resumeId, userId);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      // Extract tailored content sections
      const { personalInfo, experience, skills } = tailoredContent;
      
      // Create updated resume object
      const updatedResumeData = {
        ...resume,
        content: {
          ...resume.content,
          personalInfo: {
            ...resume.content?.personalInfo,
            ...personalInfo
          },
          experience: experience || resume.content?.experience,
          skills: skills || resume.content?.skills
        }
      };
      
      // Update resume in storage
      const updatedResume = await storage.updateResume(resumeId, userId, updatedResumeData);
      
      res.json({
        success: true,
        resume: updatedResume
      });
    } catch (error) {
      console.error("Error applying tailored content:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to apply tailored content to resume"
      });
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
  
  // AI-Tailor Resume to a specific job
  app.post("/api/jobs/:id/tailor-resume", async (req, res) => {
    // Support for both authenticated users and guest mode
    try {
      const jobId = parseInt(req.params.id);
      const job = await jobsApiService.getJobById(jobId);
      
      if (!job) {
        return res.status(404).json({ success: false, error: "Job not found" });
      }
      
      let resumeData = null;
      
      // If authenticated user, get their resume by ID
      if (req.isAuthenticated() && req.body.resumeId && req.body.resumeId !== "guest-resume") {
        const resumeId = parseInt(req.body.resumeId);
        resumeData = await storage.getResume(resumeId, req.user!.id);
        if (!resumeData) {
          return res.status(404).json({ success: false, error: "Resume not found" });
        }
      }
      // For guest mode, use the resume data from the request body
      else if (req.body.resumeData) {
        resumeData = req.body.resumeData;
      }
      // Neither resume ID or data provided
      else {
        return res.status(400).json({ 
          success: false, 
          error: "Either resumeId or resumeData must be provided" 
        });
      }
      
      // Verify API key is configured
      if (!process.env.OPENAI_API_KEY) {
        console.warn("OpenAI API key not configured for resume tailoring");
        return res.status(400).json({ 
          success: false, 
          error: "AI service is not properly configured" 
        });
      }
      
      // Use the imported openai client
      const openAI = openai;
      
      try {
        // Extract skills from the job
        const jobSkills = job.skills || [];
        const jobTitle = job.title;
        const jobDescription = job.description;
        const jobCompany = job.company;
          
        // Prepare resume data - handle different structures for guest mode and authenticated users
        // Check if resumeData has direct personalInfo or is nested inside content
        const resumeContent = resumeData.content || resumeData;
        const personalInfo = resumeContent.personalInfo || {};
        const summary = personalInfo.summary || "";
        const experiences = resumeContent.experience || [];
        const skills = resumeContent.skills || [];
        
        // Tailor summary to the job
        const summaryPrompt = `
          I need a tailored professional summary for a ${jobTitle} position at ${jobCompany}.
          
          Original Summary: "${summary}"
          
          Job Description: "${jobDescription}"
          
          Required Skills: ${jobSkills.join(', ')}
          
          Create a tailored professional summary (3-4 sentences) that:
          1. Highlights relevant experience and skills that match this specific job
          2. Incorporates keywords from the job description and required skills
          3. Positions the candidate as an ideal fit for this specific role
          4. Is concise, professional, and ready to use on a resume
          
          Return ONLY the tailored summary text with no additional explanations or formatting.
        `;
        
        const summaryResponse = await openAI.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are an expert resume writer specializing in tailoring resumes to specific job descriptions. You craft professional, concise content that incorporates relevant keywords to pass ATS systems."
            },
            {
              role: "user",
              content: summaryPrompt
            }
          ],
        });
        
        const tailoredSummary = summaryResponse.choices[0].message.content || summary;
        
        // Tailor experience bullet points
        const tailoredExperience = [...experiences];
        
        // If there are experiences to tailor
        if (experiences.length > 0) {
          // Only tailor the first two experiences for efficiency
          for (let i = 0; i < Math.min(2, experiences.length); i++) {
            const exp = experiences[i];
            const experiencePrompt = `
              I need to tailor this experience bullet point for a ${jobTitle} position at ${jobCompany}.
              
              Original Job Title: ${exp.title}
              Original Company: ${exp.company}
              Original Description: "${exp.description}"
              
              Job Description: "${jobDescription}"
              
              Required Skills: ${jobSkills.join(', ')}
              
              Rewrite the description to:
              1. Highlight aspects that are most relevant to the ${jobTitle} position
              2. Incorporate keywords from the job description and required skills
              3. Emphasize measurable achievements and results where possible
              4. Make it more impactful while keeping approximately the same length
              
              Return ONLY the improved description with no additional explanations or formatting.
            `;
            
            const expResponse = await openAI.chat.completions.create({
              model: "gpt-4o",
              messages: [
                {
                  role: "system",
                  content: "You are an expert resume writer specializing in tailoring experience descriptions to specific job requirements. You craft professional, achievement-oriented bullet points that incorporate relevant keywords to pass ATS systems."
                },
                {
                  role: "user",
                  content: experiencePrompt
                }
              ],
            });
            
            const tailoredDescription = expResponse.choices[0].message.content || exp.description;
            tailoredExperience[i] = {
              ...exp,
              description: tailoredDescription
            };
          }
        }
        
        // Tailor skills - combine existing skills with job skills
        let existingSkillNames: string[] = [];
        if (Array.isArray(skills)) {
          existingSkillNames = skills.map(skill => typeof skill === 'string' ? skill : skill.name);
        }
        
        // Create a set to remove duplicates
        const skillsSet = new Set([...existingSkillNames, ...jobSkills]);
        const tailoredSkills = [...skillsSet].slice(0, 10); // Limit to top 10 skills
        
        // Create the tailored resume - ensure we're using the right personalInfo structure
        const tailoredResume = {
          personalInfo: {
            ...(resumeContent.personalInfo || {}),
            summary: tailoredSummary
          },
          experience: tailoredExperience,
          skills: tailoredSkills,
        };
        
        return res.json({
          success: true,
          tailoredResume,
          jobDetails: {
            id: job.id,
            title: job.title,
            company: job.company
          }
        });
        
      } catch (aiError) {
        console.error("Error tailoring resume with AI:", aiError);
        return res.status(500).json({ 
          success: false, 
          error: "Failed to tailor resume. Please try again." 
        });
      }
      
    } catch (error) {
      console.error("Tailor resume error:", error);
      res.status(500).json({ 
        success: false, 
        error: "An unexpected error occurred" 
      });
    }
  });
  
  // Removed duplicate route handler - using the Adzuna API-based one below
  
  // Apply to job
  app.post("/api/jobs/:id/apply", async (req, res) => {
    try {
      const jobId = parseInt(req.params.id);
      // Use the job API service instead of storage
      const job = await jobsApiService.getJobById(jobId);
      
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      
      // For authenticated users, save the application
      if (req.isAuthenticated()) {
        const userId = req.user!.id;
        const resumeId = req.body.resumeId || -1;
        const notes = req.body.notes;
        
        await storage.createApplication(userId, jobId, resumeId, notes);
      }
      
      // For all users (including guest mode), return success
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });
  
  app.get("/api/jobs", async (req, res) => {
    // Support for guest mode - allow access to job listings without authentication
    try {
      // Get filter parameters
      const title = req.query.title as string | undefined;
      const location = req.query.location as string | undefined;
      const type = req.query.type as string | undefined;
      const experience = req.query.experience as string | undefined;
      const country = req.query.country as string | undefined; // Add country parameter
      const isGuest = req.query.guest === 'true';
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      console.log(`Search jobs with filters: title=${title}, location=${location}, type=${type}, experience=${experience}, country=${country}`);
      
      // Get jobs with filtering from the jobs API service instead of storage
      let jobs = await jobsApiService.searchJobs({ 
        title, 
        location, 
        type, 
        experience,
        country, // Pass country to the API service
        page,
        results_per_page: limit
      });
      
      // If user is authenticated, get their resume for matching
      let primaryResume = null;
      let userId: number | undefined;
      
      if (req.isAuthenticated()) {
        userId = req.user!.id;
        const resumes = await storage.getResumes(userId);
        primaryResume = resumes.length > 0 ? resumes[0] : null;
      } 
      
      // For guest mode or when no resume is found
      if (!primaryResume || isGuest) {
        // For guest users, add default match scores between 60-90%
        jobs = jobs.map(job => ({
          ...job,
          match: Math.floor(Math.random() * 30) + 60, // Random score between 60-90
          isNew: new Date(job.postedAt).getTime() > (Date.now() - 3 * 24 * 60 * 60 * 1000) // New if less than 3 days old
        }));
      }
      
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
      
      // Mark saved jobs if user is authenticated
      let savedJobIds: number[] = [];
      if (req.isAuthenticated() && userId !== undefined) {
        savedJobIds = await storage.getSavedJobIds(userId);
      }
      
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

  // Get a single job by ID
  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const jobId = parseInt(req.params.id);
      // Use the job API service instead of storage
      const job = await jobsApiService.getJobById(jobId);
      
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      
      // Get saved job IDs for the current user
      let savedJobIds: number[] = [];
      if (req.isAuthenticated()) {
        savedJobIds = await storage.getSavedJobIds(req.user!.id);
      }
      
      // Format dates for the frontend
      const postedAtStr = job.postedAt instanceof Date 
        ? job.postedAt.toLocaleDateString() 
        : new Date(job.postedAt).toLocaleDateString();
        
      // Augment job with saved status and other frontend-needed properties
      const augmentedJob = {
        ...job,
        saved: savedJobIds.includes(job.id),
        postedAt: postedAtStr,
        match: job.match || 0, // Use existing match or default to 0
        isNew: job.isNew || new Date(job.postedAt).getTime() > (Date.now() - 3 * 24 * 60 * 60 * 1000) // New if less than 3 days old
      };
      
      // If user is authenticated, calculate match score
      if (req.isAuthenticated()) {
        const userId = req.user!.id;
        const resumes = await storage.getResumes(userId);
        
        if (resumes.length > 0) {
          // Use the first resume for matching
          const primaryResume = resumes[0];
          const matchedJobs = await matchJobsWithResume([augmentedJob], primaryResume);
          return res.json(matchedJobs[0]);
        }
      }
      
      // For guest users, add a random match score
      if (!req.isAuthenticated() || req.query.guest === 'true') {
        augmentedJob.match = Math.floor(Math.random() * 30) + 60; // Random score between 60-90
      }
      
      return res.json(augmentedJob);
    } catch (error) {
      console.error("Error fetching job details:", error);
      res.status(500).json({ 
        message: "Failed to retrieve job details",
        error: (error as Error).message 
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
  
  // The API for tailoring a resume to a specific job is defined above

  // Subscription management endpoints
  app.get("/api/subscription", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const subscription = await storage.getUserSubscription(req.user!.id);
      res.json(subscription || { active: false });
    } catch (error) {
      console.error("Error getting user subscription:", error);
      res.status(500).json({ error: "Failed to get subscription information" });
    }
  });
  
  app.post("/api/subscription", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const userId = req.user!.id;
      
      // Check if user already has an active subscription
      const existingSubscription = await storage.getUserSubscription(userId);
      if (existingSubscription) {
        return res.status(400).json({ error: "User already has an active subscription" });
      }
      
      // Validate subscription data
      const subscriptionData = {
        userId,
        planType: req.body.planType,
        status: "active",
        startDate: new Date(),
        endDate: req.body.endDate || null,
        paymentMethod: req.body.paymentMethod || null,
        autoRenew: req.body.autoRenew !== false
      };
      
      // Create the subscription
      const subscription = await storage.createSubscription(subscriptionData);
      
      // Create a payment record if payment method is provided
      if (req.body.paymentMethod && req.body.amount) {
        await storage.createPayment({
          userId,
          amount: req.body.amount,
          currency: req.body.currency || "USD",
          paymentMethod: req.body.paymentMethod,
          status: "completed",
          transactionId: req.body.transactionId || null,
          itemType: "subscription",
          itemId: subscription.id
        });
      }
      
      res.status(201).json(subscription);
    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ error: "Failed to create subscription" });
    }
  });
  
  app.put("/api/subscription/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const subscriptionId = parseInt(req.params.id);
      const userId = req.user!.id;
      
      // Update the subscription
      const updatedSubscription = await storage.updateSubscription(subscriptionId, userId, {
        planType: req.body.planType,
        status: req.body.status,
        endDate: req.body.endDate,
        paymentMethod: req.body.paymentMethod,
        autoRenew: req.body.autoRenew
      });
      
      if (!updatedSubscription) {
        return res.status(404).json({ error: "Subscription not found or not owned by user" });
      }
      
      res.json(updatedSubscription);
    } catch (error) {
      console.error("Error updating subscription:", error);
      res.status(500).json({ error: "Failed to update subscription" });
    }
  });
  
  app.post("/api/subscription/:id/cancel", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const subscriptionId = parseInt(req.params.id);
      const userId = req.user!.id;
      
      // Cancel the subscription
      const cancelled = await storage.cancelSubscription(subscriptionId, userId);
      
      if (!cancelled) {
        return res.status(404).json({ error: "Subscription not found or not owned by user" });
      }
      
      res.json({ success: true, message: "Subscription cancelled successfully" });
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      res.status(500).json({ error: "Failed to cancel subscription" });
    }
  });
  
  // Add-on management endpoints
  app.get("/api/addons", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const addons = await storage.getUserAddons(req.user!.id);
      res.json(addons);
    } catch (error) {
      console.error("Error getting user add-ons:", error);
      res.status(500).json({ error: "Failed to get add-ons information" });
    }
  });
  
  app.post("/api/addons", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const userId = req.user!.id;
      
      // Validate add-on data
      const addonData = {
        userId,
        addonType: req.body.addonType,
        quantity: req.body.quantity || 1,
        expiresAt: req.body.expiresAt || null
      };
      
      // Create the add-on
      const addon = await storage.createAddon(addonData);
      
      // Create a payment record if payment information is provided
      if (req.body.paymentMethod && req.body.amount) {
        await storage.createPayment({
          userId,
          amount: req.body.amount,
          currency: req.body.currency || "USD",
          paymentMethod: req.body.paymentMethod,
          status: "completed",
          transactionId: req.body.transactionId || null,
          itemType: "addon",
          itemId: addon.id
        });
      }
      
      res.status(201).json(addon);
    } catch (error) {
      console.error("Error creating add-on:", error);
      res.status(500).json({ error: "Failed to create add-on" });
    }
  });
  
  // Payment history endpoint
  app.get("/api/payments", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const payments = await storage.getPaymentsByUser(req.user!.id);
      res.json(payments);
    } catch (error) {
      console.error("Error getting payment history:", error);
      res.status(500).json({ error: "Failed to get payment history" });
    }
  });

  // PDF Generation Endpoint
  app.post('/api/generate-pdf', upload.none(), async (req, res) => {
    try {
      const resumeData = req.body.resumeData ? JSON.parse(req.body.resumeData) : null;
      const template = req.body.template || 'professional';
      
      if (!resumeData) {
        return res.status(400).json({ error: 'Resume data is required' });
      }
      
      console.log('Generating PDF for resume with template:', template);
      
      // Create an HTML template for the resume based on the selected template
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${resumeData.personalInfo?.firstName || ''} ${resumeData.personalInfo?.lastName || ''} - Resume</title>
          <style>
            /* Reset and base styles */
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              font-family: Arial, sans-serif;
            }
            body {
              padding: 0;
              margin: 0;
              background: white;
              color: #333;
              font-size: 12px;
              line-height: 1.5;
            }
            .page {
              width: 210mm;
              min-height: 297mm;
              padding: 20mm;
              margin: 0;
              background: white;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 5px;
              color: #333;
            }
            h2 {
              font-size: 18px;
              margin: 15px 0 10px;
              color: ${template === 'modern' ? '#2563eb' : 
                        template === 'creative' ? '#8b5cf6' : 
                        template === 'bold' ? '#dc2626' : '#333'};
              border-bottom: ${template === 'professional' || template === 'executive' ? '1px solid #ddd' : 'none'};
              padding-bottom: 5px;
            }
            h3 {
              font-size: 16px;
              margin-bottom: 3px;
            }
            p {
              margin-bottom: 10px;
            }
            .header {
              ${template === 'creative' ? 'text-align: center;' : ''}
              ${template === 'bold' || template === 'modern' ? 'border-bottom: 3px solid #ddd;' : ''}
              margin-bottom: 20px;
              padding-bottom: 10px;
            }
            .contact-info {
              ${template === 'creative' ? 'text-align: center;' : ''}
              display: flex;
              flex-wrap: wrap;
              gap: 15px;
              margin-bottom: 20px;
              font-size: 14px;
            }
            .section {
              margin-bottom: 20px;
            }
            .experience-item, .education-item {
              margin-bottom: 15px;
            }
            .job-title, .degree {
              font-weight: bold;
              font-size: 14px;
            }
            .company, .institution {
              font-style: ${template === 'bold' ? 'normal' : 'italic'};
            }
            .date {
              color: #666;
              font-size: 12px;
              ${template === 'modern' ? 'float: right;' : ''}
            }
            .skills-list {
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
              list-style-type: none;
            }
            .skill-item {
              background: ${template === 'modern' ? '#e0f2fe' : 
                            template === 'creative' ? '#f3e8ff' : 
                            template === 'bold' ? '#fee2e2' : '#f3f4f6'};
              padding: 5px 10px;
              border-radius: 3px;
              font-size: 12px;
            }
            .projects {
              margin-top: 20px;
            }
            .project-item {
              margin-bottom: 15px;
            }
            .project-title {
              font-weight: bold;
              font-size: 14px;
            }
            .project-tech {
              margin-top: 5px;
              font-size: 12px;
              color: #666;
            }
            /* Template specific styles */
            ${template === 'executive' ? `
              body { font-family: 'Times New Roman', serif; }
              h1 { text-align: center; font-size: 28px; }
              .header { border-bottom: 2px solid #000; }
              .contact-info { justify-content: center; }
            ` : ''}
            ${template === 'creative' ? `
              body { font-family: 'Calibri', sans-serif; }
              .header { background-color: #8b5cf6; color: white; padding: 20px; }
              h1, h2 { color: #8b5cf6; }
            ` : ''}
            ${template === 'modern' ? `
              body { font-family: 'Segoe UI', sans-serif; }
              .header { display: flex; justify-content: space-between; align-items: flex-start; }
              .contact-info { flex-direction: column; }
            ` : ''}
            ${template === 'bold' ? `
              body { font-family: 'Arial Black', sans-serif; }
              h1, h2 { color: #dc2626; }
              .header { border-bottom: 4px solid #dc2626; }
            ` : ''}
            ${template === 'minimal' ? `
              body { font-family: 'Helvetica', sans-serif; }
              .header { border: none; }
              h2 { border: none; font-weight: 300; }
            ` : ''}
            ${template === 'industry' ? `
              body { font-family: 'Georgia', serif; }
              .header { background-color: #1e3a8a; color: white; padding: 15px; }
              h1, h2 { color: #1e3a8a; }
            ` : ''}
          </style>
        </head>
        <body>
          <div class="page">
            <div class="header">
              <h1>${resumeData.personalInfo?.firstName || ''} ${resumeData.personalInfo?.lastName || ''}</h1>
              <p>${resumeData.personalInfo?.headline || ''}</p>
            </div>
            
            <div class="contact-info">
              <span>${resumeData.personalInfo?.email || ''}</span>
              <span>${resumeData.personalInfo?.phone || ''}</span>
            </div>
            
            <div class="section">
              <h2>Summary</h2>
              <p>${resumeData.personalInfo?.summary || ''}</p>
            </div>
            
            <div class="section">
              <h2>Experience</h2>
              ${(resumeData.experience || []).map(exp => `
                <div class="experience-item">
                  <div class="job-title">${exp.title || ''}</div>
                  <div class="company">${exp.company || ''}</div>
                  <div class="date">${exp.startDate || ''} - ${exp.endDate || 'Present'}</div>
                  <p>${exp.description || ''}</p>
                </div>
              `).join('')}
            </div>
            
            <div class="section">
              <h2>Education</h2>
              ${(resumeData.education || []).map(edu => `
                <div class="education-item">
                  <div class="degree">${edu.degree || ''}</div>
                  <div class="institution">${edu.institution || ''}</div>
                  <div class="date">${edu.startDate || ''} - ${edu.endDate || ''}</div>
                  <p>${edu.description || ''}</p>
                </div>
              `).join('')}
            </div>
            
            <div class="section">
              <h2>Skills</h2>
              <ul class="skills-list">
                ${(resumeData.skills || []).map(skill => `
                  <li class="skill-item">${skill.name || ''}</li>
                `).join('')}
              </ul>
            </div>
            
            ${(resumeData.projects && resumeData.projects.length > 0) ? `
            <div class="section projects">
              <h2>Projects</h2>
              ${resumeData.projects.map(project => `
                <div class="project-item">
                  <div class="project-title">${project.title || ''}</div>
                  <p>${project.description || ''}</p>
                  <div class="project-tech">Technologies: ${(project.technologies || []).join(', ')}</div>
                </div>
              `).join('')}
            </div>
            ` : ''}
          </div>
        </body>
        </html>
      `;
      
      // Launch Puppeteer to generate PDF
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: 'new'
      });
      
      const page = await browser.newPage();
      await page.setContent(htmlContent);
      
      // Set PDF options
      const pdfOptions = {
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0.4in',
          right: '0.4in',
          bottom: '0.4in',
          left: '0.4in'
        }
      };
      
      // Generate PDF
      const pdfBuffer = await page.pdf(pdfOptions);
      
      // Close browser
      await browser.close();
      
      // Return the PDF file
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${resumeData.personalInfo?.firstName || 'Resume'}_${resumeData.personalInfo?.lastName || ''}.pdf"`);
      res.send(pdfBuffer);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).json({ 
        error: 'Failed to generate PDF',
        message: (error as Error).message 
      });
    }
  });

  // PDF Generation API Route
  app.post('/api/generate-pdf', upload.none(), async (req, res) => {
    try {
      // Extract resume data from request
      const resumeData = JSON.parse(req.body.resumeData);
      const templateName = req.body.template || 'professional';
      
      console.log(`Generating PDF for resume with template: ${templateName}`);
      
      try {
        // Create HTML content from template and resume data
        let htmlContent = `<!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Resume - ${resumeData.personalInfo?.firstName || ''} ${resumeData.personalInfo?.lastName || ''}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
            .page { width: 8.5in; height: 11in; padding: 0.5in; box-sizing: border-box; }
            .header { margin-bottom: 1rem; }
            h1 { margin: 0; color: #333; }
            .contact-info { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem; }
            .section { margin-bottom: 1rem; }
            .section-title { border-bottom: 1px solid #ccc; padding-bottom: 0.25rem; margin-bottom: 0.5rem; color: #333; }
            .experience-item, .education-item { margin-bottom: 0.75rem; }
            .experience-header, .education-header { display: flex; justify-content: space-between; }
            .job-title, .degree { font-weight: bold; }
            .company, .institution { font-style: italic; }
            .skills-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
            .skill-item { background: #f0f0f0; padding: 0.25rem 0.5rem; border-radius: 3px; font-size: 0.9rem; }
            
            /* Template styles */
            ${templateName === 'professional' ? `
              body { color: #333; }
              h1 { color: #2c3e50; }
              .section-title { color: #2c3e50; border-bottom: 2px solid #3498db; }
              .job-title, .degree { color: #3498db; }
            ` : templateName === 'creative' ? `
              body { color: #333; }
              h1 { color: #e74c3c; }
              .section-title { color: #e74c3c; border-bottom: 2px solid #e74c3c; }
              .job-title, .degree { color: #e74c3c; }
              .skill-item { background: #fce4ec; color: #e74c3c; }
            ` : templateName === 'executive' ? `
              body { color: #333; }
              h1 { color: #000; border-bottom: 2px solid #000; padding-bottom: 0.5rem; }
              .section-title { color: #000; border-bottom: 1px solid #000; text-transform: uppercase; letter-spacing: 1px; }
              .job-title, .degree { font-weight: bold; }
            ` : templateName === 'modern' ? `
              body { color: #333; font-family: 'Segoe UI', sans-serif; }
              h1 { color: #4a154b; }
              .section-title { color: #4a154b; border-bottom: 2px solid #4a154b; }
              .job-title, .degree { color: #4a154b; }
              .skill-item { background: #f4eff4; color: #4a154b; }
            ` : templateName === 'minimal' ? `
              body { color: #333; font-family: 'Helvetica', sans-serif; }
              h1 { color: #333; font-weight: 300; letter-spacing: 1px; }
              .section-title { color: #333; border-bottom: 1px solid #ddd; font-weight: 300; }
              .job-title, .degree { font-weight: normal; }
              .skill-item { background: #f8f8f8; color: #333; border: 1px solid #eee; }
            ` : `
              body { color: #333; }
              h1 { color: #2c3e50; }
              .section-title { color: #2c3e50; border-bottom: 2px solid #3498db; }
              .job-title, .degree { color: #3498db; }
            `}
          </style>
        </head>
        <body>
          <div class="page">
            <div class="header">
              <h1>${resumeData.personalInfo?.firstName || ''} ${resumeData.personalInfo?.lastName || ''}</h1>
              <div class="contact-info">
                ${resumeData.personalInfo?.email ? `<div class="email">${resumeData.personalInfo.email}</div>` : ''}
                ${resumeData.personalInfo?.phone ? `<div class="phone">${resumeData.personalInfo.phone}</div>` : ''}
              </div>
              ${resumeData.personalInfo?.summary ? `
                <div class="summary">
                  ${resumeData.personalInfo.summary}
                </div>
              ` : ''}
            </div>
            
            ${resumeData.experience && resumeData.experience.length > 0 ? `
              <div class="section experience-section">
                <h2 class="section-title">Experience</h2>
                ${resumeData.experience.map((exp: any) => `
                  <div class="experience-item">
                    <div class="experience-header">
                      <div class="job-title">${exp.title || ''}</div>
                      <div class="dates">${exp.startDate || ''} - ${exp.endDate || 'Present'}</div>
                    </div>
                    <div class="company">${exp.company || ''}</div>
                    <div class="description">${exp.description || ''}</div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            ${resumeData.education && resumeData.education.length > 0 ? `
              <div class="section education-section">
                <h2 class="section-title">Education</h2>
                ${resumeData.education.map((edu: any) => `
                  <div class="education-item">
                    <div class="education-header">
                      <div class="degree">${edu.degree || ''}</div>
                      <div class="dates">${edu.startDate || ''} - ${edu.endDate || ''}</div>
                    </div>
                    <div class="institution">${edu.institution || ''}</div>
                    ${edu.description ? `<div class="description">${edu.description}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            ${resumeData.skills && resumeData.skills.length > 0 ? `
              <div class="section skills-section">
                <h2 class="section-title">Skills</h2>
                <div class="skills-list">
                  ${resumeData.skills.map((skill: any) => `
                    <div class="skill-item">${skill.name || ''}</div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            
            ${resumeData.projects && resumeData.projects.length > 0 ? `
              <div class="section projects-section">
                <h2 class="section-title">Projects</h2>
                ${resumeData.projects.map((project: any) => `
                  <div class="project-item">
                    <div class="project-title">${project.title || ''}</div>
                    <div class="description">${project.description || ''}</div>
                    ${project.technologies && project.technologies.length > 0 ? `
                      <div class="technologies">
                        <strong>Technologies:</strong> ${project.technologies.join(', ')}
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </body>
        </html>`;
        
        // Try to use Puppeteer for server-side PDF generation
        try {
          const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: 'new'
          });
          
          const page = await browser.newPage();
          await page.setContent(htmlContent);
          
          const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '0.4in', right: '0.4in', bottom: '0.4in', left: '0.4in' }
          });
          
          await browser.close();
          
          // Send PDF response
          res.contentType('application/pdf');
          res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
          return res.send(pdfBuffer);
          
        } catch (puppeteerError) {
          // If Puppeteer fails, return HTML that the browser can print
          console.error('Error generating PDF:', puppeteerError);
          throw new Error('Server-side PDF generation failed, falling back to client-side');
        }
        
      } catch (renderError) {
        // Return HTML content for the client to handle
        console.log('Falling back to client-side PDF rendering');
        
        // Return an error so the client uses the window.print() fallback
        return res.status(500).json({
          error: 'Failed to generate PDF',
          message: 'Server-side PDF generation failed, falling back to client-side',
          htmlContent: ''  // We don't send HTML back for security reasons
        });
      }
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).json({
        error: 'Failed to generate PDF',
        message: (error as Error).message
      });
    }
  });

  // PDF Generation Endpoint
  app.post('/api/generate-pdf', upload.none(), async (req, res) => {
    try {
      const resumeData = JSON.parse(req.body.resumeData);
      const template = req.body.template || 'professional';
      console.log('Generating PDF for resume template:', template);
      
      // Create HTML content for the resume
      const htmlContent = generateResumeHTML(resumeData, template);
      
      // Launch puppeteer
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      
      // Set the content to the HTML string
      await page.setContent(htmlContent, { 
        waitUntil: 'networkidle0',
        timeout: 30000
      });
      
      // Set the PDF options for A4 size
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '10mm',
          right: '10mm',
          bottom: '10mm',
          left: '10mm'
        }
      });
      
      // Close the browser
      await browser.close();
      
      // Send the PDF as a response
      res.contentType('application/pdf');
      res.send(pdfBuffer);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).json({ 
        error: 'Failed to generate PDF',
        message: error.message
      });
    }
  });
  
  /**
   * Generates HTML content for a resume based on the provided data and template
   */
  function generateResumeHTML(resumeData: any, template: string): string {
    // Basic styling for the resume
    const styles = `
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.5;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .resume-container {
          width: 100%;
          max-width: 210mm;
          margin: 0 auto;
          padding: 20px;
          box-sizing: border-box;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          color: #2a3f5f;
        }
        .header .contact {
          margin-top: 10px;
          font-size: 14px;
        }
        .section {
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 20px;
          font-weight: bold;
          border-bottom: 2px solid #2a3f5f;
          margin-bottom: 10px;
          padding-bottom: 5px;
          color: #2a3f5f;
        }
        .experience-item, .education-item, .project-item {
          margin-bottom: 15px;
        }
        .item-header {
          display: flex;
          justify-content: space-between;
          font-weight: bold;
        }
        .item-title {
          font-weight: bold;
        }
        .item-subtitle {
          font-style: italic;
        }
        .item-date {
          color: #666;
        }
        .item-description {
          margin-top: 5px;
        }
        .skills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .skill-item {
          background-color: #f5f5f5;
          border-radius: 3px;
          padding: 5px 10px;
          font-size: 14px;
        }
        
        /* Professional template */
        .professional .header {
          text-align: center;
        }
        
        /* Modern template */
        .modern .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modern .section-title {
          color: #0072b1;
          border-bottom-color: #0072b1;
        }
        
        /* Creative template */
        .creative .header {
          background-color: #9c27b0;
          color: white;
          padding: 30px;
          margin: -20px -20px 20px -20px;
          border-radius: 5px 5px 0 0;
        }
        .creative .header h1 {
          color: white;
        }
        .creative .section-title {
          color: #9c27b0;
          border-bottom-color: #9c27b0;
        }
        
        /* Executive template */
        .executive .header {
          border-bottom: 3px double #333;
          padding-bottom: 20px;
        }
        .executive .section-title {
          font-size: 18px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        /* Minimal template */
        .minimal {
          font-family: 'Helvetica', sans-serif;
        }
        .minimal .section-title {
          font-weight: normal;
          border-bottom: 1px solid #ddd;
        }
        
        /* Industry template */
        .industry .header {
          background-color: #006699;
          color: white;
          padding: 20px;
          margin: -20px -20px 20px -20px;
        }
        .industry .header h1 {
          color: white;
        }
        .industry .section-title {
          background-color: #f2f2f2;
          padding: 5px 10px;
          border-left: 4px solid #006699;
          border-bottom: none;
        }
        
        /* Bold template */
        .bold .header h1 {
          font-size: 32px;
          text-transform: uppercase;
        }
        .bold .section-title {
          font-size: 22px;
          text-transform: uppercase;
          border-bottom: 3px solid #e91e63;
          color: #e91e63;
        }
      </style>
    `;
    
    // Get personal info
    const { firstName, lastName, email, phone, headline, summary } = resumeData.personalInfo || {};
    const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Your Name';
    
    // Generate header section
    const headerSection = `
      <div class="header">
        <h1>${fullName}</h1>
        ${headline ? `<div class="headline">${headline}</div>` : ''}
        <div class="contact">
          ${email ? `<span>${email}</span> | ` : ''}
          ${phone ? `<span>${phone}</span>` : ''}
        </div>
      </div>
    `;
    
    // Generate summary section
    const summarySection = summary ? `
      <div class="section">
        <div class="section-title">Summary</div>
        <div class="summary-content">${summary}</div>
      </div>
    ` : '';
    
    // Generate experience section
    let experienceSection = '';
    if (resumeData.experience && resumeData.experience.length > 0) {
      const experienceItems = resumeData.experience
        .map((exp: any) => `
          <div class="experience-item">
            <div class="item-header">
              <span class="item-title">${exp.title || ''}</span>
              <span class="item-date">${exp.startDate || ''} - ${exp.endDate || 'Present'}</span>
            </div>
            <div class="item-subtitle">${exp.company || ''}</div>
            <div class="item-description">${exp.description || ''}</div>
          </div>
        `)
        .join('');
      
      experienceSection = `
        <div class="section">
          <div class="section-title">Experience</div>
          ${experienceItems}
        </div>
      `;
    }
    
    // Generate education section
    let educationSection = '';
    if (resumeData.education && resumeData.education.length > 0) {
      const educationItems = resumeData.education
        .map((edu: any) => `
          <div class="education-item">
            <div class="item-header">
              <span class="item-title">${edu.degree || ''}</span>
              <span class="item-date">${edu.startDate || ''} - ${edu.endDate || ''}</span>
            </div>
            <div class="item-subtitle">${edu.institution || ''}</div>
            ${edu.description ? `<div class="item-description">${edu.description}</div>` : ''}
          </div>
        `)
        .join('');
      
      educationSection = `
        <div class="section">
          <div class="section-title">Education</div>
          ${educationItems}
        </div>
      `;
    }
    
    // Generate skills section
    let skillsSection = '';
    if (resumeData.skills && resumeData.skills.length > 0) {
      const skillItems = resumeData.skills
        .map((skill: any) => `<div class="skill-item">${skill.name || ''}</div>`)
        .join('');
      
      skillsSection = `
        <div class="section">
          <div class="section-title">Skills</div>
          <div class="skills-list">
            ${skillItems}
          </div>
        </div>
      `;
    }
    
    // Generate projects section
    let projectsSection = '';
    if (resumeData.projects && resumeData.projects.length > 0) {
      const projectItems = resumeData.projects
        .map((project: any) => `
          <div class="project-item">
            <div class="item-title">${project.title || ''}</div>
            <div class="item-description">${project.description || ''}</div>
            ${project.technologies && project.technologies.length ? 
              `<div class="item-technologies">Technologies: ${project.technologies.join(', ')}</div>` : ''}
            ${project.link ? `<div class="item-link">Link: ${project.link}</div>` : ''}
          </div>
        `)
        .join('');
      
      projectsSection = `
        <div class="section">
          <div class="section-title">Projects</div>
          ${projectItems}
        </div>
      `;
    }
    
    // Combine all sections
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${fullName} - Resume</title>
        ${styles}
      </head>
      <body>
        <div class="resume-container ${template || 'professional'}">
          ${headerSection}
          ${summarySection}
          ${experienceSection}
          ${educationSection}
          ${skillsSection}
          ${projectsSection}
        </div>
      </body>
      </html>
    `;
  }

  const httpServer = createServer(app);
  return httpServer;
}
