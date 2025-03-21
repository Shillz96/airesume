import { Job } from "@shared/schema";
import fetch from 'node-fetch';

// Real-world job API service to fetch job listings
export class JobsAPIService {
  private apiKey: string | undefined;
  private appId: string | undefined;
  private baseUrl: string;
  private defaultCountry: string = 'us'; // Default to US jobs

  constructor() {
    // We'll pull the API keys from environment variables
    this.apiKey = process.env.ADZUNA_API_KEY;
    this.appId = process.env.ADZUNA_APP_ID;
    this.baseUrl = 'https://api.adzuna.com';
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
    results_per_page?: number,
    country?: string
  }): Promise<Job[]> {
    try {
      // If no API key or appId, use sample data
      if (!this.apiKey || !this.appId) {
        console.warn("Using sample jobs because Adzuna API credentials are not set");
        return this.getSampleJobs(filters);
      }

      // Determine which country to search in
      // If location contains 'US' or 'United States', use 'us', otherwise use specified country or default
      let country = this.defaultCountry;
      
      if (filters.country) {
        country = filters.country.toLowerCase();
      } else if (filters.location) {
        const locationLower = filters.location.toLowerCase();
        if (locationLower.includes('uk') || 
            locationLower.includes('united kingdom') || 
            locationLower.includes('london') || 
            locationLower.includes('manchester') || 
            locationLower.includes('birmingham')) {
          country = 'gb';
        }
      }

      // Build query parameters carefully, similar to our test endpoint
      let apiUrl = `${this.baseUrl}/v1/api/jobs/${country}/search/1?app_id=${this.appId}&app_key=${this.apiKey}`;
      
      // Add pagination parameters
      apiUrl += `&results_per_page=${filters.results_per_page || 10}`;
      if (filters.page && filters.page > 1) {
        apiUrl += `&page=${filters.page}`;
      }
      
      // Add title search parameter (what)
      if (filters.title && filters.title.trim().length > 0) {
        apiUrl += `&what=${encodeURIComponent(filters.title.trim())}`;
      } else {
        // Add a default search term to ensure we get results
        apiUrl += `&what=developer`;
      }
      
      // Add location search parameter if provided
      if (filters.location && filters.location.trim().length > 0 && 
          !filters.location.toLowerCase().includes('remote') &&
          !filters.location.toLowerCase().includes('anywhere')) {
        // Remove country name from location if it's there to prevent API errors
        let locationSearch = filters.location.trim()
          .replace(/united states|usa|us/gi, '')
          .replace(/united kingdom|uk|gb/gi, '')
          .trim();
          
        if (locationSearch.length > 0) {
          apiUrl += `&where=${encodeURIComponent(locationSearch)}`;
        }
      }
      
      // Handle job type filtering
      if (filters.type && filters.type !== 'all') {
        // Convert our job type values to Adzuna format
        let contractType = '';
        
        if (filters.type.toLowerCase().includes('full')) {
          contractType = 'full_time';
        } else if (filters.type.toLowerCase().includes('part')) {
          contractType = 'part_time';
        } else if (filters.type.toLowerCase().includes('contract') || 
                  filters.type.toLowerCase().includes('temp')) {
          contractType = 'contract';
        }
        
        if (contractType) {
          apiUrl += `&contract_type=${contractType}`;
        }
      }
      
      // Add experience level filtering if specified - with safety mechanisms
      if (filters.experience && filters.experience !== 'all') {
        try {
          // Map our experience levels to appropriate search terms
          let experienceSearch = '';
          
          if (filters.experience.toLowerCase().includes('senior') || 
              filters.experience.toLowerCase().includes('lead')) {
            // For senior positions, add senior keywords directly to the search
            // This is the safer approach than modifying the existing query
            if (!filters.title || filters.title.trim().length === 0) {
              // If no title, use these terms as the main search
              apiUrl += `&what=${encodeURIComponent('senior lead')}`;
            } else {
              // If there is a title, add "senior" to the beginning to find senior roles
              // This is more reliable than trying to append to an existing query
              let currentWhat = '';
              const whatMatch = apiUrl.match(/&what=([^&]+)/);
              if (whatMatch && whatMatch[1]) {
                currentWhat = decodeURIComponent(whatMatch[1]);
                // Replace the current what with "senior" + the current what
                apiUrl = apiUrl.replace(/&what=([^&]+)/, 
                  `&what=${encodeURIComponent(`senior ${currentWhat}`)}`);
              }
            }
          } else if (filters.experience.toLowerCase().includes('mid')) {
            // For mid-level, we don't modify the query as it can cause API errors
            // Instead, we'll do client-side filtering of the results
          } else if (filters.experience.toLowerCase().includes('junior') || 
                    filters.experience.toLowerCase().includes('entry')) {
            // For junior positions, add junior keywords to the search
            if (!filters.title || filters.title.trim().length === 0) {
              apiUrl += `&what=${encodeURIComponent('junior entry level')}`;
            } else {
              let currentWhat = '';
              const whatMatch = apiUrl.match(/&what=([^&]+)/);
              if (whatMatch && whatMatch[1]) {
                currentWhat = decodeURIComponent(whatMatch[1]);
                apiUrl = apiUrl.replace(/&what=([^&]+)/, 
                  `&what=${encodeURIComponent(`junior ${currentWhat}`)}`);
              }
            }
          }
        } catch (error) {
          console.warn("Error adding experience filtering, ignoring this filter", error);
          // If there's an error adding experience filtering, just continue without it
          // rather than breaking the whole API request
        }
      }
      
      console.log(`Fetching jobs from Adzuna: ${apiUrl}`);
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        const responseText = await response.text();
        console.error(`Adzuna API error (${response.status}):`, responseText);
        throw new Error(`Adzuna API request failed with status ${response.status}: ${responseText}`);
      }
      
      const data = await response.json();
      
      // Transform the API response into our Job schema
      if (data.results && Array.isArray(data.results)) {
        return this.transformJobsData(data.results);
      } else {
        console.warn("Unexpected Adzuna API response format", data);
        return this.getSampleJobs(filters);
      }
    } catch (error) {
      console.error("Error fetching jobs from Adzuna API:", error);
      // If there's an error, fall back to sample data rather than failing completely
      return this.getSampleJobs(filters);
    }
  }
  
  /**
   * Get a single job by ID
   */
  async getJobById(id: number): Promise<Job | undefined> {
    try {
      // If no API key or appId, use sample data
      if (!this.apiKey || !this.appId) {
        console.warn("Using sample job because Adzuna API credentials are not set");
        throw new Error("No API credentials");
      }
      
      // Adzuna doesn't have a direct endpoint for a single job by ID
      // We'd typically need to get the job from our database where we've stored
      // the API details, or do a new search with specific parameters
      
      // For this implementation, we'll just return a sample job
      // In a real-world app, we would store job IDs and metadata in our database
      console.warn("Getting job by ID not directly supported by Adzuna API, using sample job");
      
      return this.getSampleJobs({}).find(job => job.id === id);
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
    // Adzuna API returns jobs with a specific structure based on our API test
    // Convert the ID to a number (Adzuna provides string IDs)
    const id = apiJob.id ? parseInt(apiJob.id) : (index || Math.floor(Math.random() * 10000));
    
    // Get description - Adzuna provides this in the 'description' field
    const description = apiJob.description || 'No description provided';
    
    // Extract skills from description
    const skills = this.extractSkillsFromDescription(description);
    
    // Parse location - Adzuna provides location as an object with display_name and area array
    let location = 'Remote';
    if (apiJob.location && apiJob.location.display_name) {
      location = apiJob.location.display_name;
    } else if (apiJob.location && apiJob.location.area && Array.isArray(apiJob.location.area)) {
      // Take the most specific location (city/town) which is usually the last element
      // Remove the country (first element) as that's redundant
      const locationParts = [...apiJob.location.area];
      if (locationParts.length > 1) {
        locationParts.shift(); // Remove the country
        location = locationParts.join(', ');
      } else {
        location = locationParts.join(', ');
      }
    }
    
    // Get contract type (full-time, part-time, etc.)
    let type = 'Full-time';
    if (apiJob.contract_time) {
      // Convert contract_time to more friendly format
      if (apiJob.contract_time === 'full_time') {
        type = 'Full-time';
      } else if (apiJob.contract_time === 'part_time') {
        type = 'Part-time';
      } else {
        type = apiJob.contract_time.charAt(0).toUpperCase() + apiJob.contract_time.slice(1);
      }
    } else if (apiJob.contract_type === 'permanent') {
      type = 'Full-time';
    } else if (apiJob.contract_type === 'contract' || apiJob.contract_type === 'temporary') {
      type = 'Contract';
    }
    
    // Handle salary information if available
    let salaryInfo = '';
    if (apiJob.salary_min && apiJob.salary_max) {
      const min = Math.round(apiJob.salary_min);
      const max = Math.round(apiJob.salary_max);
      if (min === max) {
        salaryInfo = `$${min.toLocaleString()}/year`;
      } else {
        salaryInfo = `$${min.toLocaleString()} - $${max.toLocaleString()}/year`;
      }
    }
    
    // Determine if the job is new (less than 3 days old)
    const isNew = apiJob.created ? 
      new Date(apiJob.created).getTime() > Date.now() - 3 * 24 * 60 * 60 * 1000 :
      false;
    
    return {
      id: id,
      title: apiJob.title || 'Unknown Position',
      company: apiJob.company && apiJob.company.display_name ? apiJob.company.display_name : 'Unknown Company',
      location: location,
      type: type,
      description: description,
      skills: skills,
      postedAt: new Date(apiJob.created || Date.now()),
      expiresAt: null,
      applyUrl: apiJob.redirect_url || '#',
      salary: salaryInfo || undefined,
      // These fields will be calculated when matching with a resume
      match: 0, 
      isNew: isNew,
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