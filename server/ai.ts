import OpenAI from "openai";
import { Resume, Job } from "@shared/schema";
import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
export const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "",
  // Add a default timeout
  timeout: 30000
});

export interface ResumeSuggestions {
  suggestions: string[];
}

// Career path definitions for tailored advice
export type CareerPath = 
  | 'software_engineering'
  | 'data_science'
  | 'design'
  | 'marketing'
  | 'sales'
  | 'product_management'
  | 'finance'
  | 'healthcare'
  | 'education'
  | 'customer_service'
  | 'general';

// Interface for career-specific resume advice
export interface CareerSpecificAdvice {
  suggestedSkills: string[];
  industryKeywords: string[];
  resumeTips: string[];
  careerPathDescription: string;
  certifications: string[];
}

/**
 * Generate AI-powered suggestions to improve a resume
 */
export async function generateResumeSuggestions(resume: Resume, careerPath?: CareerPath): Promise<string[]> {
  try {
    // If no API key is provided, return sample suggestions
    if (!process.env.OPENAI_API_KEY) {
      return getSampleResumeSuggestions(resume, careerPath);
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
    
    // Determine career path from resume if not provided
    let detectedCareerPath = careerPath;
    if (!detectedCareerPath) {
      detectedCareerPath = await detectCareerPath(resumeContext);
    }
    
    // Get career-specific system prompt
    const systemPrompt = getCareerSpecificSystemPrompt(detectedCareerPath);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Please analyze this resume and provide suggestions for improvement in JSON format. The response should be a JSON object with a 'suggestions' array containing string recommendations, focusing specifically on the ${detectedCareerPath.replace('_', ' ')} career path: ${JSON.stringify(resumeContext)}`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    const result = JSON.parse(response.choices[0].message.content);
    return Array.isArray(result.suggestions) ? result.suggestions : [];
  } catch (error) {
    console.error("Error generating resume suggestions:", error);
    return getSampleResumeSuggestions(resume, careerPath);
  }
}

/**
 * Detect the likely career path based on resume content
 */
async function detectCareerPath(resumeContext: any): Promise<CareerPath> {
  try {
    // Extract relevant information from the resume context
    const jobTitles = resumeContext.experience.map((exp: any) => exp.title || '').join(', ');
    const skillNames = resumeContext.skills.map((skill: any) => skill.name || '').join(', ');
    const summary = resumeContext.personalInfo.summary || '';
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a career assessment expert. Your task is to analyze resume data and determine the most likely career path from this list: software_engineering, data_science, design, marketing, sales, product_management, finance, healthcare, education, customer_service. Return just the single most appropriate career path as a string value."
        },
        {
          role: "user",
          content: `Based on the following resume information, identify the most likely career path:
          Job Titles: ${jobTitles}
          Skills: ${skillNames}
          Summary: ${summary}
          
          Return only one of these values: software_engineering, data_science, design, marketing, sales, product_management, finance, healthcare, education, customer_service, general`
        }
      ],
      response_format: { type: "text" }
    });
    
    const result = response.choices[0].message.content.trim().toLowerCase();
    
    // Check if the result matches one of our career paths
    const validPaths: CareerPath[] = [
      'software_engineering', 'data_science', 'design', 'marketing', 
      'sales', 'product_management', 'finance', 'healthcare', 
      'education', 'customer_service', 'general'
    ];
    
    if (validPaths.includes(result as CareerPath)) {
      return result as CareerPath;
    }
    
    return 'general';
  } catch (error) {
    console.error("Error detecting career path:", error);
    return 'general';
  }
}

/**
 * Get career-specific system prompt for tailored resume advice
 */
function getCareerSpecificSystemPrompt(careerPath: CareerPath): string {
  const basePrompt = "You are an expert resume consultant who helps job seekers improve their resumes. Provide specific, actionable suggestions to enhance this resume. Focus on improvements related to content, structure, achievements, and keywords. Limit your suggestions to 3-5 concise, bullet-point style recommendations. Return the result as JSON.";
  
  const careerPrompts: Record<CareerPath, string> = {
    software_engineering: `${basePrompt} Focus on technical skills, developer tools, programming languages, frameworks, and software development methodologies. Emphasize quantifiable improvements to code, systems, or processes. Suggest industry-specific technical certifications if applicable.`,
    
    data_science: `${basePrompt} Focus on data analysis tools, programming languages for data (Python, R), statistical methods, machine learning frameworks, and data visualization techniques. Emphasize quantifiable insights derived from data and business impact. Suggest skills related to big data technologies and domain-specific data expertise.`,
    
    design: `${basePrompt} Focus on design tools (Adobe Creative Suite, Figma, Sketch), user experience methodologies, and portfolio presentation. Emphasize the impact of designs on users, conversions, or business metrics. Suggest ways to incorporate design thinking and user-centered approaches.`,
    
    marketing: `${basePrompt} Focus on marketing platforms, analytical tools, campaign performance metrics, and content creation skills. Emphasize measurable results like growth percentages, engagement rates, or ROI. Suggest digital marketing certifications and multi-channel expertise.`,
    
    sales: `${basePrompt} Focus on sales methodologies, CRM software experience, negotiation techniques, and client relationship management. Emphasize quantifiable achievements like revenue growth, quota attainment, and client acquisition. Suggest industry-specific sales certifications.`,
    
    product_management: `${basePrompt} Focus on product development methodologies, stakeholder management, and product metrics. Emphasize product launches, feature adoption rates, and business impact. Suggest skills related to user research, roadmapping, and cross-functional team leadership.`,
    
    finance: `${basePrompt} Focus on financial analysis tools, accounting software, regulatory knowledge, and financial modeling skills. Emphasize quantifiable financial achievements, cost savings, or revenue growth. Suggest relevant certifications like CFA, CPA, or financial software expertise.`,
    
    healthcare: `${basePrompt} Focus on medical terminology, healthcare systems/software, patient care metrics, and compliance requirements. Emphasize patient outcomes, quality improvements, or operational efficiencies. Suggest relevant certifications and continuing education credentials.`,
    
    education: `${basePrompt} Focus on instructional methodologies, curriculum development, assessment techniques, and educational technologies. Emphasize student achievement metrics, program development, and innovative teaching approaches. Suggest relevant teaching certifications or specialized educational training.`,
    
    customer_service: `${basePrompt} Focus on CRM systems, communication techniques, problem-resolution metrics, and customer satisfaction tools. Emphasize measurable improvements in customer satisfaction, retention rates, or issue resolution times. Suggest customer service certifications and conflict resolution training.`,
    
    general: basePrompt
  };
  
  return careerPrompts[careerPath] || basePrompt;
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
              content: "You are an expert job matching algorithm. You will analyze a job description and a candidate's resume to calculate a match percentage between 0-100. Consider skills, experience, and fit. Return your response as JSON."
            },
            {
              role: "user",
              content: `Analyze the following job and resume information and return a JSON object with a "match" field containing a number from 0-100 representing the match percentage.
              
              Job: ${JSON.stringify(job)}
              
              Candidate Resume: 
              Skills: ${JSON.stringify(skills)}
              Experience: ${JSON.stringify(experience)}
              Personal Info: ${JSON.stringify(personalInfo)}
              
              Return your response in JSON format with a match field, for example: {"match": 85}`
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
  // Define a fallback structure to return in case of API errors
  const fallbackResumeData = {
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      headline: "",
      summary: ""
    },
    experience: [],
    education: [],
    skills: [],
    projects: []
  };
  
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
    
    // Process files based on their extension using appropriate libraries
    if (fileExtension === '.pdf' || fileExtension === '.docx' || fileExtension === '.txt') {
      try {
        // For PDF files, use pdf-parse to extract the text
        if (fileExtension === '.pdf') {
          try {
            console.log("Parsing PDF file using pdf-parse...");
            const pdfData = await pdfParse(fileBuffer);
            fileContent = pdfData.text || "";
            console.log("PDF text extracted successfully, length:", fileContent.length);
            
            // If extraction failed or returned empty content, provide feedback
            if (!fileContent || fileContent.trim().length < 10) {
              console.log("PDF extraction returned minimal content, may need OCR for scanned documents");
              return { 
                success: true,
                data: fallbackResumeData,
                warning: "Could not extract text from this PDF. It may be a scanned document that requires OCR. Please try a different file format or enter your details manually." 
              };
            }
          } catch (pdfError) {
            console.error("PDF parsing failed:", pdfError);
            return { 
              success: true,
              data: fallbackResumeData,
              warning: "This PDF file could not be parsed. Please try a different format or enter your details manually." 
            };
          }
        } 
        else if (fileExtension === '.docx') {
          // For DOCX, we'd use a library like mammoth, but for now use a placeholder
          console.log("DOCX support requires additional libraries. Using fallback.");
          return { 
            success: true,
            data: fallbackResumeData,
            warning: "DOCX parsing is currently in development. Please upload a PDF or TXT file instead, or enter your details manually." 
          };
        } 
        else {
          // Text files can be read directly
          fileContent = fileBuffer.toString('utf-8');
        }
      } catch (extractionError) {
        console.error("Text extraction error:", extractionError);
        return { 
          success: true,
          data: fallbackResumeData,
          warning: "Could not extract text from the file. Please try a different format or enter details manually." 
        };
      }
      
      // Now parse the extracted text to structure the resume data
      const structureResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert resume parser. Extract structured information from the resume text and format it according to the application's schema. Include personal information, work experience, education, skills, and projects. Return the result as JSON."
          },
          {
            role: "user",
            content: `Parse this resume text and structure it according to the following JSON format:
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
            
            Make sure to return valid JSON that matches the structure above.
            
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
  } catch (error: any) {
    console.error("Error parsing resume file:", error);
    
    // Check if this is a quota or rate limit error
    if (error?.status === 429 || error?.code === 'insufficient_quota' || 
        (error?.message && error.message.includes('quota'))) {
      return { 
        success: true, // Return success but with minimal data
        data: fallbackResumeData,
        warning: "Using simplified resume format due to API quota limitations. Manual editing required."
      };
    }
    
    // Check for various OpenAI API errors and provide meaningful responses
    if (error?.code === 'invalid_image_format' || 
        (error?.message && (error.message.includes('Invalid MIME type') || error.message.includes('image')))) {
      console.log("Detected format/image error but continuing with text-based extraction");
      // Return fallback data with a warning
      return { 
        success: true,
        data: fallbackResumeData,
        warning: "PDF processing is currently in development. Using template data - please edit manually."
      };
    }
    
    if (error?.type === 'invalid_request_error') {
      console.log("Detected invalid request error:", error.message);
      // Return fallback data with appropriate warning
      return { 
        success: true,
        data: fallbackResumeData,
        warning: "Could not process this file format automatically. Using template - please edit manually."
      };
    }
    
    // Handle errors related to messages and JSON format
    if (error?.message && error.message.includes('messages') && error.message.includes('json')) {
      console.log("Detected JSON format error in messages");
      // Attempt to fix this by using the fallback data with a warning
      return { 
        success: true,
        data: fallbackResumeData,
        warning: "Resume processing is available but encountered a temporary error. Using template - please edit manually."
      };
    }
    
    return { success: false, error: "Failed to parse resume file" };
  }
}
