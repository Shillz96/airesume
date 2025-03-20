import OpenAI from "openai";
import { Resume, Job } from "@shared/schema";
import fs from "fs";
import path from "path";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

export interface ResumeSuggestions {
  suggestions: string[];
}

/**
 * Generate AI-powered suggestions to improve a resume
 */
export async function generateResumeSuggestions(resume: Resume): Promise<string[]> {
  try {
    // If no API key is provided, return sample suggestions
    if (!process.env.OPENAI_API_KEY) {
      return getSampleResumeSuggestions(resume);
    }
    
    // Extract resume content for AI analysis
    const personalInfo = resume.content?.personalInfo || {};
    const experience = resume.content?.experience || [];
    const education = resume.content?.education || [];
    const skills = resume.content?.skills || [];
    const projects = resume.content?.projects || [];
    
    const resumeContext = {
      personalInfo,
      experience,
      education,
      skills,
      projects
    };
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert resume consultant who helps job seekers improve their resumes. Provide specific, actionable suggestions to enhance this resume. Focus on improvements related to content, structure, achievements, and keywords. Limit your suggestions to 3-5 concise, bullet-point style recommendations."
        },
        {
          role: "user",
          content: `Please analyze this resume and provide suggestions for improvement: ${JSON.stringify(resumeContext)}`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    const result = JSON.parse(response.choices[0].message.content);
    return Array.isArray(result.suggestions) ? result.suggestions : [];
  } catch (error) {
    console.error("Error generating resume suggestions:", error);
    return getSampleResumeSuggestions(resume);
  }
}

/**
 * Match jobs with a user's resume, calculating match percentages
 */
export async function matchJobsWithResume(jobs: Job[], resume: Resume): Promise<Job[]> {
  try {
    // If no API key is provided, calculate simple keyword matches
    if (!process.env.OPENAI_API_KEY) {
      return calculateSimpleMatchScores(jobs, resume);
    }
    
    // Extract resume content for job matching
    const personalInfo = resume.content?.personalInfo || {};
    const experience = resume.content?.experience || [];
    const skills = resume.content?.skills || [];
    
    // For each job, calculate match score using OpenAI
    const enhancedJobs = await Promise.all(jobs.map(async (job) => {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are an expert job matching algorithm. You will analyze a job description and a candidate's resume to calculate a match percentage between 0-100. Consider skills, experience, and fit. Respond with a JSON object containing only the match percentage."
            },
            {
              role: "user",
              content: `Job: ${JSON.stringify(job)}
              
              Candidate Resume: 
              Skills: ${JSON.stringify(skills)}
              Experience: ${JSON.stringify(experience)}
              Personal Info: ${JSON.stringify(personalInfo)}`
            }
          ],
          response_format: { type: "json_object" }
        });
        
        const result = JSON.parse(response.choices[0].message.content);
        const matchPercentage = Math.min(Math.max(result.match || 0, 0), 100);
        
        return {
          ...job,
          match: matchPercentage,
          isNew: isNewJob(job.postedAt)
        };
      } catch (error) {
        console.error(`Error matching job ${job.id}:`, error);
        // Fallback to simple match if OpenAI fails
        const matchScore = calculateSimpleMatch(job, resume);
        return {
          ...job,
          match: matchScore,
          isNew: isNewJob(job.postedAt)
        };
      }
    }));
    
    // Sort jobs by match percentage (highest first)
    return enhancedJobs.sort((a, b) => (b.match || 0) - (a.match || 0));
  } catch (error) {
    console.error("Error matching jobs with resume:", error);
    return calculateSimpleMatchScores(jobs, resume);
  }
}

// Helper function to determine if a job is new (posted within the last 3 days)
function isNewJob(postedAt: Date): boolean {
  const now = new Date();
  const threeDaysAgo = new Date(now);
  threeDaysAgo.setDate(now.getDate() - 3);
  
  return new Date(postedAt) >= threeDaysAgo;
}

// Calculate a simple match score based on keyword overlap
function calculateSimpleMatch(job: Job, resume: Resume): number {
  const skills = resume.content?.personalInfo?.skills || [];
  const experience = resume.content?.experience || [];
  
  // Extract keywords from resume
  const resumeKeywords = new Set<string>();
  
  // Add skills
  if (Array.isArray(resume.content?.skills)) {
    resume.content.skills.forEach((skill: any) => {
      if (skill && skill.name) {
        resumeKeywords.add(skill.name.toLowerCase());
      }
    });
  }
  
  // Add experience keywords
  if (Array.isArray(experience)) {
    experience.forEach((exp: any) => {
      if (exp && exp.title) {
        exp.title.toLowerCase().split(/\s+/).forEach((word: string) => {
          if (word.length > 3) resumeKeywords.add(word);
        });
      }
      if (exp && exp.description) {
        exp.description.toLowerCase().split(/\s+/).forEach((word: string) => {
          if (word.length > 3) resumeKeywords.add(word);
        });
      }
    });
  }
  
  // Count matches in job posting
  let matchCount = 0;
  const jobText = `${job.title} ${job.description} ${job.skills.join(' ')}`.toLowerCase();
  
  resumeKeywords.forEach(keyword => {
    if (jobText.includes(keyword)) {
      matchCount++;
    }
  });
  
  // Calculate percentage based on number of matches
  // Floor at 50% and cap at 95% for simple matching
  const baseMatch = Math.min(matchCount * 5, 95);
  return Math.max(baseMatch, 50);
}

// Apply simple match scores to a list of jobs
function calculateSimpleMatchScores(jobs: Job[], resume: Resume): Job[] {
  return jobs.map(job => ({
    ...job,
    match: calculateSimpleMatch(job, resume),
    isNew: isNewJob(job.postedAt)
  })).sort((a, b) => (b.match || 0) - (a.match || 0));
}

// Provide sample resume suggestions when API key is not available
function getSampleResumeSuggestions(resume: Resume): string[] {
  return [
    "Add more measurable achievements to your work experience with specific metrics and results.",
    "Include keywords from the job descriptions you're targeting to improve ATS compatibility.",
    "Strengthen your professional summary to highlight your unique value proposition.",
    "Add relevant certifications or training to showcase your continuous learning.",
    "Consider reorganizing your skills section to prioritize the most in-demand technologies."
  ];
}

/**
 * Parse a resume file (PDF, DOCX, TXT) and extract structured information
 */
export async function parseResumeFile(filePath: string, fileName: string): Promise<any> {
  try {
    // If no API key is provided, return empty data structure
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OpenAI API key not provided, cannot parse resume file");
      return { success: false, error: "API key not configured" };
    }
    
    // Read the file
    const fileBuffer = fs.readFileSync(filePath);
    const fileExtension = path.extname(fileName).toLowerCase();
    
    let fileContent = "";
    
    // For simplicity, we're treating all files as text and sending their content to OpenAI
    // In a production app, you'd want to use specific libraries to parse different file types
    if (fileExtension === '.pdf' || fileExtension === '.docx' || fileExtension === '.txt') {
      // Convert file to base64
      const base64File = fileBuffer.toString('base64');
      
      // For PDFs and DOCXs, use OpenAI's vision capabilities to extract text
      if (fileExtension === '.pdf' || fileExtension === '.docx') {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are an expert resume parser. Extract the text content from this document."
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "This is a resume document. Please extract all the text content."
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:application/${fileExtension === '.pdf' ? 'pdf' : 'vnd.openxmlformats-officedocument.wordprocessingml.document'};base64,${base64File}`
                  }
                }
              ]
            }
          ]
        });
        
        fileContent = response.choices[0].message.content || "";
      } else {
        // Text files can be read directly
        fileContent = fileBuffer.toString('utf-8');
      }
      
      // Now parse the extracted text to structure the resume data
      const structureResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert resume parser. Extract structured information from the resume text and format it according to the application's schema. Include personal information, work experience, education, skills, and projects."
          },
          {
            role: "user",
            content: `Parse this resume text and structure it according to the following format:
            {
              "personalInfo": {
                "firstName": "",
                "lastName": "",
                "email": "",
                "phone": "",
                "headline": "",
                "summary": ""
              },
              "experience": [
                {
                  "id": "1",
                  "title": "",
                  "company": "",
                  "startDate": "YYYY-MM",
                  "endDate": "YYYY-MM or 'Present'",
                  "description": ""
                }
              ],
              "education": [
                {
                  "id": "1",
                  "degree": "",
                  "institution": "",
                  "startDate": "YYYY-MM",
                  "endDate": "YYYY-MM",
                  "description": ""
                }
              ],
              "skills": [
                {
                  "id": "1",
                  "name": "",
                  "proficiency": 1-5
                }
              ],
              "projects": [
                {
                  "id": "1",
                  "title": "",
                  "description": "",
                  "technologies": ["tech1", "tech2"],
                  "link": ""
                }
              ]
            }
            
            Resume text:
            ${fileContent}`
          }
        ],
        response_format: { type: "json_object" }
      });
      
      try {
        const parsedData = JSON.parse(structureResponse.choices[0].message.content);
        return { success: true, data: parsedData };
      } catch (err) {
        console.error("Error parsing resume structure:", err);
        return { success: false, error: "Failed to parse resume structure" };
      }
    } else {
      return { success: false, error: "Unsupported file format. Please upload PDF, DOCX, or TXT files." };
    }
  } catch (error) {
    console.error("Error parsing resume file:", error);
    return { success: false, error: "Failed to parse resume file" };
  }
}
