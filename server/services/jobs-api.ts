import { Job } from "@shared/schema";
import fetch from 'node-fetch';

// Real-world job API service to fetch job listings
export class JobsAPIService {
  private apiKey: string | undefined;
  private baseUrl: string;

  constructor() {
    // We'll pull the API key from environment variables
    this.apiKey = process.env.JOBS_API_KEY;
    this.baseUrl = 'https://api.adzuna.com/v1/api/jobs';
  }

  /**
   * Search for jobs with the given filters
   */
  async searchJobs(filters: { 
    title?: string, 
    location?: string, 
    type?: string, 
    experience?: string, 
    page?: number,
    results_per_page?: number
  }): Promise<Job[]> {
    try {
      // If no API key, throw error
      if (!this.apiKey) {
        console.warn("Using sample jobs because JOBS_API_KEY is not set");
        return this.getSampleJobs(filters);
      }

      // Build query parameters
      const params = new URLSearchParams();
      params.append('app_id', 'your-app-id'); // You'll need to register with Adzuna or another job API
      params.append('app_key', this.apiKey);
      params.append('results_per_page', String(filters.results_per_page || 10));
      params.append('page', String(filters.page || 1));
      
      // Add what to search for
      if (filters.title) {
        params.append('what', filters.title);
      }
      
      // Add where to search
      if (filters.location) {
        params.append('where', filters.location);
      }
      
      // Handle job type - full-time, part-time, contract, etc.
      if (filters.type) {
        params.append('contract_type', filters.type === 'Full-time' ? '1' : 
                                      filters.type === 'Part-time' ? '2' : 
                                      filters.type === 'Contract' ? '3' : '1');
      }
      
      // Handle experience level
      if (filters.experience) {
        // Note: This depends on the specific API - some may not support this directly
        // You might need to filter results after fetching
      }
      
      // Make the API request
      const response = await fetch(`${this.baseUrl}/us/search/1?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Jobs API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform the API response into our Job schema
      return this.transformJobsData(data.results);
    } catch (error) {
      console.error("Error fetching jobs from API:", error);
      // If there's an error, fall back to sample data rather than failing completely
      return this.getSampleJobs(filters);
    }
  }
  
  /**
   * Get a single job by ID
   */
  async getJobById(id: number): Promise<Job | undefined> {
    try {
      // If no API key, throw error to use sample data
      if (!this.apiKey) {
        console.warn("Using sample job because JOBS_API_KEY is not set");
        throw new Error("No API key");
      }
      
      // In a real implementation, you would fetch a specific job from the API
      // Most job APIs allow you to fetch details for a specific job
      // Since the implementation depends on the specific API, this is a placeholder
      const params = new URLSearchParams();
      params.append('app_id', 'your-app-id');
      params.append('app_key', this.apiKey);
      
      const response = await fetch(`${this.baseUrl}/us/job/${id}?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Job API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform the API response into our Job schema
      return this.transformJobData(data);
    } catch (error) {
      console.error(`Error fetching job ${id} from API:`, error);
      // Fall back to sample data
      return this.getSampleJobs({}).find(job => job.id === id);
    }
  }
  
  /**
   * Transform job data from the API to our schema
   */
  private transformJobsData(apiJobs: any[]): Job[] {
    return apiJobs.map((job, index) => this.transformJobData(job, index + 1));
  }
  
  /**
   * Transform a single job from the API to our schema
   */
  private transformJobData(apiJob: any, index?: number): Job {
    const id = apiJob.id || index || Math.floor(Math.random() * 10000);
    
    // Extract skills from description
    const skills = this.extractSkillsFromDescription(apiJob.description || '');
    
    return {
      id: id,
      title: apiJob.title || 'Unknown Position',
      company: apiJob.company?.display_name || 'Unknown Company',
      location: apiJob.location?.display_name || 'Remote',
      type: apiJob.contract_time || 'Full-time',
      description: apiJob.description || 'No description provided',
      skills: skills,
      postedAt: new Date(apiJob.created || Date.now()),
      expiresAt: null,
      applyUrl: apiJob.redirect_url || '#',
      // These fields will be calculated when matching with a resume
      match: 0,
      isNew: true,
      saved: false
    };
  }
  
  /**
   * Extract skills from a job description
   */
  private extractSkillsFromDescription(description: string): string[] {
    // This is a simplified approach
    // In a real implementation, you'd use NLP or a tech skills database
    const techSkills = [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Angular', 'Vue', 
      'HTML', 'CSS', 'Python', 'Java', 'C#', 'PHP', 'SQL', 'NoSQL',
      'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes',
      'AWS', 'Azure', 'GCP', 'REST', 'GraphQL', 'Express', 'Flask',
      'Spring', 'Django', 'Ruby', 'Rails', 'Swift', 'Kotlin', 'Flutter'
    ];
    
    const foundSkills = new Set<string>();
    
    // Check for each skill in the description
    techSkills.forEach(skill => {
      if (description.includes(skill)) {
        foundSkills.add(skill);
      }
    });
    
    // If we didn't find any skills, add some generic ones based on the job title
    if (foundSkills.size === 0) {
      if (description.toLowerCase().includes('frontend') || 
          description.toLowerCase().includes('front-end') ||
          description.toLowerCase().includes('front end')) {
        foundSkills.add('JavaScript');
        foundSkills.add('React');
        foundSkills.add('HTML');
        foundSkills.add('CSS');
      } else if (description.toLowerCase().includes('backend') || 
                description.toLowerCase().includes('back-end') ||
                description.toLowerCase().includes('back end')) {
        foundSkills.add('Node.js');
        foundSkills.add('Express');
        foundSkills.add('SQL');
        foundSkills.add('APIs');
      } else if (description.toLowerCase().includes('fullstack') || 
                description.toLowerCase().includes('full-stack') ||
                description.toLowerCase().includes('full stack')) {
        foundSkills.add('JavaScript');
        foundSkills.add('React');
        foundSkills.add('Node.js');
        foundSkills.add('SQL');
      }
    }
    
    return Array.from(foundSkills);
  }
  
  /**
   * Get sample jobs data for testing or when API is unavailable
   */
  private getSampleJobs(filters: {
    title?: string, 
    location?: string, 
    type?: string, 
    experience?: string
  }): Job[] {
    // A set of realistic sample jobs
    const sampleJobs: Job[] = [
      {
        id: 1,
        title: "Senior Frontend Developer",
        company: "Tech Innovations Inc",
        location: "San Francisco, CA",
        type: "Full-time",
        description: "We're looking for a Senior Frontend Developer with expertise in React, TypeScript, and modern JavaScript frameworks. You'll be responsible for building high-performance web applications and collaborating with cross-functional teams.",
        skills: ["React", "TypeScript", "JavaScript", "HTML/CSS", "Redux"],
        postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        expiresAt: null,
        applyUrl: "#",
        match: 92,
        isNew: true,
        saved: false
      },
      {
        id: 2,
        title: "Full Stack Developer",
        company: "WebSolutions Co",
        location: "Remote (US)",
        type: "Full-time",
        description: "Join our remote team as a Full Stack Developer! We're seeking someone experienced with Node.js and React to help build and maintain our suite of web applications. You'll work on both frontend and backend development.",
        skills: ["React", "Node.js", "MongoDB", "Express", "JavaScript"],
        postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        expiresAt: null,
        applyUrl: "#",
        match: 88,
        isNew: true,
        saved: false
      },
      {
        id: 3,
        title: "UI/UX Developer",
        company: "DesignWorks Agency",
        location: "New York, NY",
        type: "Contract",
        description: "DesignWorks is hiring a UI/UX Developer to create beautiful, intuitive interfaces for our clients. The ideal candidate has a strong background in design principles and frontend development skills.",
        skills: ["HTML/CSS", "JavaScript", "Figma", "UI/UX Design", "React"],
        postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        expiresAt: null,
        applyUrl: "#",
        match: 75,
        isNew: true,
        saved: false
      },
      {
        id: 4,
        title: "Backend Developer",
        company: "DataSystems",
        location: "Austin, TX",
        type: "Full-time",
        description: "DataSystems is seeking a skilled Backend Developer to join our engineering team. You'll be designing RESTful APIs, implementing business logic, and working with databases to support our growing platform.",
        skills: ["Node.js", "Express", "PostgreSQL", "Docker", "Microservices"],
        postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        expiresAt: null,
        applyUrl: "#",
        match: 68,
        isNew: false,
        saved: false
      },
      {
        id: 5,
        title: "Junior Frontend Developer",
        company: "StartupNow",
        location: "Remote (Global)",
        type: "Part-time",
        description: "Exciting startup looking for a Junior Frontend Developer to help build our customer-facing web application. Great opportunity for someone early in their career to gain experience with modern web technologies.",
        skills: ["JavaScript", "React", "HTML/CSS", "Responsive Design"],
        postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        expiresAt: null,
        applyUrl: "#",
        match: 95,
        isNew: true,
        saved: false
      },
      {
        id: 6,
        title: "DevOps Engineer",
        company: "CloudTech Solutions",
        location: "Seattle, WA",
        type: "Full-time",
        description: "Join our DevOps team to help automate deployment processes, manage cloud infrastructure, and improve our CI/CD pipelines. Experience with AWS and containerization technologies is required.",
        skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"],
        postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        expiresAt: null,
        applyUrl: "#",
        match: 62,
        isNew: true,
        saved: false
      },
      {
        id: 7,
        title: "Mobile Developer (React Native)",
        company: "AppGenies",
        location: "Chicago, IL",
        type: "Full-time",
        description: "AppGenies is looking for a talented Mobile Developer experienced with React Native to join our product team. You'll be building cross-platform mobile applications for iOS and Android.",
        skills: ["React Native", "JavaScript", "iOS", "Android", "Redux"],
        postedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
        expiresAt: null,
        applyUrl: "#",
        match: 78,
        isNew: false,
        saved: false
      },
      {
        id: 8,
        title: "ML Engineer",
        company: "AI Innovations",
        location: "Boston, MA",
        type: "Full-time",
        description: "AI Innovations is seeking a Machine Learning Engineer to develop and implement ML models. You'll be working on cutting-edge AI solutions for our clients in healthcare and finance.",
        skills: ["Python", "TensorFlow", "PyTorch", "Data Science", "AI"],
        postedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        expiresAt: null,
        applyUrl: "#",
        match: 55,
        isNew: false,
        saved: false
      },
      {
        id: 9,
        title: "QA Engineer",
        company: "QualitySoft",
        location: "Denver, CO",
        type: "Full-time",
        description: "QualitySoft is hiring a QA Engineer to ensure the quality of our software products. You'll be responsible for designing test cases, performing manual testing, and developing automated tests.",
        skills: ["Selenium", "Jest", "Cypress", "QA Methodologies", "JIRA"],
        postedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
        expiresAt: null,
        applyUrl: "#",
        match: 72,
        isNew: false,
        saved: false
      },
      {
        id: 10,
        title: "Technical Writer",
        company: "DocuTech",
        location: "Portland, OR",
        type: "Contract",
        description: "DocuTech needs a Technical Writer to create clear, concise documentation for our software products. The ideal candidate has experience documenting APIs and writing user guides.",
        skills: ["Technical Writing", "Markdown", "API Documentation", "Information Architecture"],
        postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        expiresAt: null,
        applyUrl: "#",
        match: 81,
        isNew: true,
        saved: false
      }
    ];
    
    // Apply filters
    let filteredJobs = [...sampleJobs];
    
    if (filters.title) {
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(filters.title!.toLowerCase()) ||
        job.description.toLowerCase().includes(filters.title!.toLowerCase())
      );
    }
    
    if (filters.location) {
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    
    if (filters.type) {
      filteredJobs = filteredJobs.filter(job => 
        job.type.toLowerCase() === filters.type!.toLowerCase()
      );
    }
    
    // Experience filter is more complex and we'd need to parse descriptions
    // For sample data, we'll simplify:
    if (filters.experience) {
      if (filters.experience.toLowerCase() === 'junior') {
        filteredJobs = filteredJobs.filter(job => 
          job.title.toLowerCase().includes('junior') || 
          job.description.toLowerCase().includes('junior') ||
          job.description.toLowerCase().includes('entry level')
        );
      } else if (filters.experience.toLowerCase() === 'mid-level') {
        filteredJobs = filteredJobs.filter(job => 
          !job.title.toLowerCase().includes('senior') && 
          !job.title.toLowerCase().includes('junior')
        );
      } else if (filters.experience.toLowerCase() === 'senior') {
        filteredJobs = filteredJobs.filter(job => 
          job.title.toLowerCase().includes('senior') || 
          job.description.toLowerCase().includes('senior') ||
          job.description.toLowerCase().includes('experienced')
        );
      }
    }
    
    // Make sure all jobs have match scores
    return filteredJobs.map(job => ({
      ...job,
      match: job.match || Math.floor(Math.random() * 40) + 60, // Random match between 60-100
      isNew: job.isNew || (new Date(job.postedAt).getTime() > Date.now() - 3 * 24 * 60 * 60 * 1000)
    }));
  }
}

// Export a singleton instance
export const jobsApiService = new JobsAPIService();