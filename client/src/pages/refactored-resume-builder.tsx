import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2, X, ChevronDown, ChevronUp, Save, Download, PenSquare, Star, Plus, Trash, FilePlus, Bot, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Resume, useResumeData } from "@/hooks/use-resume-data";
import { useTheme } from "@/contexts/ThemeContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import PageHeader from "@/components/page-header";
import { 
  ResumeExperienceSection, 
  ResumeEducationSection, 
  ResumeSkillsSection, 
  ResumeProjectsSection 
} from "@/components/resume-section";
import ResumePreviewComponent from "@/components/resume-builder/ResumePreviewComponent";

// Function component
export default function ResumeBuilder() {
  // States for resume data and UI controls
  const [activeSection, setActiveSection] = useState<string>("contact");
  const [aiSuggestionType, setAiSuggestionType] = useState<"short" | "medium" | "long">("medium");
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [skillSearchQuery, setSkillSearchQuery] = useState<string>("");
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);
  const { toast } = useToast();
  const { 
    resume, 
    setResume,
    isLoading, 
    saveResume, 
    isDirty,
    updatePersonalInfo,
    updateExperienceList,
    updateEducationList,
    updateSkillsList,
    updateProjectsList,
    updateResumeTemplate,
    updateResumeTitle,
    addExperience,
    addEducation,
    addSkill,
    addProject
  } = useResumeData();
  
  // Helper function to update the entire resume at once
  const updateResume = (newResumeData: Resume) => {
    setResume(newResumeData);
  };
  
  // Generate new suggestions when active section changes
  useEffect(() => {
    // Only show AI assistant for Summary, Experience, and Skills tabs
    if (activeSection === 'summary' || activeSection === 'experience') {
      generateSuggestions(aiSuggestionType);
    } else if (activeSection === 'skills') {
      generateSkillSuggestions();
    } else {
      // Clear suggestions for other tabs
      setSuggestions([]);
      setSkillSuggestions([]);
    }
  }, [activeSection]);
  
  // All available skills
  const allSkills = [
    // Programming Languages
    "JavaScript", "TypeScript", "Python", "Java", "C#", "C++", "Go", "Ruby", "PHP", "Swift", "Kotlin", "Rust",
    // Frontend 
    "React", "Angular", "Vue.js", "Next.js", "HTML", "CSS", "SASS/SCSS", "Bootstrap", "Tailwind CSS", "Material-UI", 
    "Redux", "Context API", "Webpack", "Babel", "GraphQL", "Apollo Client", "Responsive Design", "Mobile-First Design",
    // Backend
    "Node.js", "Express", "Django", "Flask", "Spring Boot", "Ruby on Rails", ".NET Core", "Laravel", "NestJS",
    "REST APIs", "GraphQL", "WebSockets", "Microservices", "Socket.io", 
    // Databases
    "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "Firebase", "Supabase", "DynamoDB", "Cassandra",
    "ORM", "Sequelize", "TypeORM", "Mongoose", "Prisma", "Entity Framework",
    // Cloud & DevOps
    "AWS", "Azure", "Google Cloud", "Heroku", "Vercel", "Netlify", "Docker", "Kubernetes", "CI/CD", "GitHub Actions",
    "Jenkins", "Terraform", "Serverless", "Cloudflare", "Load Balancing", "Auto-scaling",
    // Testing
    "Jest", "Mocha", "Cypress", "Selenium", "Puppeteer", "React Testing Library", "TDD", "BDD", "Unit Testing", 
    "Integration Testing", "E2E Testing", "Test Coverage",
    // Tools & Methodologies
    "Git", "GitHub", "GitLab", "BitBucket", "Jira", "Agile", "Scrum", "Kanban", "Code Reviews", "Pair Programming",
    // Security
    "Authentication", "Authorization", "OAuth", "JWT", "HTTPS", "Encryption", "XSS Prevention", "CSRF Protection",
    // Performance
    "Web Performance", "Lazy Loading", "Code Splitting", "Bundle Optimization", "Server-Side Rendering", "Caching Strategies",
    // Soft Skills
    "Problem Solving", "Communication", "Teamwork", "Leadership", "Time Management", "Critical Thinking", 
    "Adaptability", "Project Management", "Mentoring", "Documentation",
    // Mobile
    "React Native", "Flutter", "iOS Development", "Android Development", "Mobile UI/UX", "App Store Optimization"
  ];
  
  // Function to generate 10 random skills
  const generateSkillSuggestions = () => {
    setIsLoadingSuggestions(true);
    
    // In a real implementation, this would call an API
    setTimeout(() => {
      // Shuffle the skills array and take 10 random skills
      const shuffled = [...allSkills].sort(() => 0.5 - Math.random());
      const randomSkills = shuffled.slice(0, 10);
      
      setSkillSuggestions(randomSkills);
      setIsLoadingSuggestions(false);
    }, 600);
  };
  
  // Function to get AI-based skill suggestions for a search query
  const getFilteredSkillSuggestions = () => {
    // If no search query, just return the random suggestions
    if (!skillSearchQuery) return skillSuggestions;
    
    // This would normally call an AI API with the search query
    // For now, we'll simulate an AI response by finding all matching skills from our full list
    const matches = allSkills.filter(skill => 
      skill.toLowerCase().includes(skillSearchQuery.toLowerCase())
    );
    
    // Take up to 10 matches
    return matches.slice(0, 10);
  };

  // Function to handle download
  const handleDownload = () => {
    toast({
      title: "Resume downloaded",
      description: "Your resume has been downloaded successfully."
    });
  };

  // Function to handle save
  const handleSaveResume = async () => {
    try {
      await saveResume();
      toast({
        title: "Resume saved",
        description: "Your resume has been saved successfully."
      });
    } catch (error) {
      toast({
        title: "Error saving resume",
        description: "There was an error saving your resume. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Function to generate AI suggestions based on the active section and suggestion type
  const generateSuggestions = (type: "short" | "medium" | "long") => {
    setAiSuggestionType(type);
    setIsLoadingSuggestions(true);
    
    // In a real implementation, this would call an API
    setTimeout(() => {
      let newSuggestions: string[] = [];
      
      // Generate different suggestions based on the active section
      if (activeSection === "summary") {
        if (type === "short") {
          newSuggestions = [
            "Dedicated software engineer with 5+ years experience in web development, specializing in React and Node.js.",
            "Results-driven full-stack developer with expertise in building scalable applications and optimizing user experiences.",
            "Tech professional with a proven track record of delivering efficient solutions in agile environments."
          ];
        } else if (type === "medium") {
          newSuggestions = [
            "Seasoned software engineer with 5+ years of experience building responsive web applications. Expertise in JavaScript frameworks (React, Vue) and backend technologies (Node.js, Express). Delivered solutions that improved customer engagement by 40%.",
            "Full-stack developer with a passion for clean code and user-centric design. Specialized in modern JavaScript frameworks and cloud infrastructure. Proven track record of reducing application load times by 60% and increasing conversion rates.",
            "Innovative web developer with extensive experience in frontend and backend technologies. Skilled in React, Node.js, and cloud platforms. Successfully led multiple teams to deliver enterprise-grade solutions on schedule and under budget."
          ];
        } else {
          newSuggestions = [
            "Senior software engineer with 5+ years of experience architecting and implementing scalable web applications. Proficient in the entire development lifecycle from concept to deployment. Core expertise includes React, Node.js, GraphQL, and AWS. Successfully reduced API response times by 65% and implemented CI/CD pipelines that decreased deployment times from days to minutes. Known for mentoring junior developers and promoting best practices across development teams.",
            "Results-driven full-stack developer with a proven track record of converting business requirements into elegant technical solutions. Specialized in JavaScript ecosystems including React, Angular, and Node.js with experience in cloud platforms (AWS, Azure). Led development of an e-commerce platform that processes $2M in annual transactions. Passionate about performance optimization, having reduced application load times by 70% through code refactoring and infrastructure improvements.",
            "Dedicated software professional with extensive experience developing enterprise-grade applications. Proficient in modern JavaScript frameworks (React, Vue) and server-side technologies (Node.js, Express, PostgreSQL). Implemented microservice architectures that improved system reliability by 99.9%. Strong collaborator who excels in agile environments and consistently delivers high-quality code that exceeds client expectations."
          ];
        }
      } else if (activeSection === "experience") {
        if (type === "short") {
          newSuggestions = [
            "Led development of a customer-facing web application that increased user engagement by 45%.",
            "Implemented responsive design principles that improved mobile conversion rates by 60%.",
            "Refactored legacy codebase resulting in 30% performance improvement and 25% reduction in bugs."
          ];
        } else if (type === "medium") {
          newSuggestions = [
            "Spearheaded the development of a React-based customer portal that improved user engagement by 45% and reduced support tickets by 30%. Implemented state management using Redux and integrated with RESTful APIs.",
            "Designed and built a responsive e-commerce platform using Vue.js and Node.js that increased mobile conversion rates by 60%. Integrated payment gateways and implemented cart optimization algorithms.",
            "Led the refactoring of a critical legacy application, resulting in 30% improved performance and 25% fewer bugs. Implemented automated testing that increased code coverage from 20% to 85%."
          ];
        } else {
          newSuggestions = [
            "Led a team of 5 developers to redesign the company's flagship customer portal using React and GraphQL, resulting in a 45% increase in user engagement and 30% reduction in support tickets. Implemented sophisticated state management with Redux, integrated with 12 internal microservices, and established comprehensive testing protocols that caught 95% of bugs before production.",
            "Architected and developed a mobile-first e-commerce platform serving 100K+ monthly users using Vue.js frontend and Node.js microservices backend. Implemented advanced caching strategies and responsive design principles that improved mobile conversion rates by 60% and reduced page load times from 4.2s to 1.8s. Integrated with multiple payment gateways and shipping APIs to create a seamless checkout experience.",
            "Took ownership of a critical legacy Java application with technical debt and transformed it into a modern, maintainable system. Refactored over 200K lines of code while maintaining backward compatibility, resulting in 30% performance improvement and 25% reduction in reported bugs. Implemented CI/CD pipelines that reduced deployment time from 2 days to 20 minutes and increased test coverage from 20% to 85%."
          ];
        }
      } else if (activeSection === "skills") {
        if (type === "short") {
          newSuggestions = [
            "JavaScript (React, Node.js)",
            "SQL & NoSQL Databases",
            "Cloud Services (AWS, Azure)"
          ];
        } else if (type === "medium") {
          newSuggestions = [
            "Frontend: JavaScript, TypeScript, React, Vue.js, HTML5, CSS3, Responsive Design",
            "Backend: Node.js, Express, RESTful APIs, GraphQL, Java, Python",
            "Cloud & DevOps: AWS (S3, Lambda, EC2), Azure, Docker, Kubernetes, CI/CD pipelines"
          ];
        } else {
          newSuggestions = [
            "Programming Languages: JavaScript, TypeScript, Python, Java, SQL\nFrontend: React, Redux, Vue.js, Angular, HTML5, CSS3/SCSS, Webpack, Jest, Cypress\nState Management: Redux, MobX, Context API\nUI/UX: Responsive Design, Material-UI, Bootstrap, Figma",
            "Backend: Node.js, Express, NestJS, Django, Spring Boot\nAPIs: REST, GraphQL, WebSockets\nDatabases: PostgreSQL, MongoDB, Redis, Elasticsearch\nORM/ODM: Sequelize, TypeORM, Mongoose\nAuthentication: OAuth, JWT, SAML",
            "Cloud Services: AWS (S3, EC2, Lambda, CloudFront), GCP, Azure\nDevOps: Docker, Kubernetes, Terraform, CI/CD (Jenkins, GitHub Actions)\nMonitoring: Prometheus, Grafana, ELK Stack\nSecurity: OWASP, Penetration Testing, SSL/TLS\nAgile Methodologies: Scrum, Kanban, JIRA"
          ];
        }
      } else if (activeSection === "education") {
        if (type === "short") {
          newSuggestions = [
            "Bachelor of Science in Computer Science, University of Technology, 2018",
            "Associate's Degree in Web Development, Community College, 2016",
            "Full-Stack Web Development Bootcamp, Tech Academy, 2020"
          ];
        } else if (type === "medium") {
          newSuggestions = [
            "Bachelor of Science in Computer Science\nUniversity of Technology\n2014 - 2018\nGPA: 3.8/4.0",
            "Associate's Degree in Web Development\nCommunity College\n2014 - 2016\nRelevant Coursework: Web Design, Database Management",
            "Full-Stack Web Development Bootcamp\nTech Academy\nJanuary - June 2020\nCompleted 800+ hours of intensive coding training"
          ];
        } else {
          newSuggestions = [
            "Bachelor of Science in Computer Science\nUniversity of Technology\n2014 - 2018\nGPA: 3.8/4.0\nRelevant Coursework: Data Structures & Algorithms, Database Systems, Web Development, Software Engineering\nAchievements: Dean's List (all semesters), Senior Project Award for Innovative Web Application",
            "Associate's Degree in Web Development\nCommunity College\n2014 - 2016\nGPA: 3.9/4.0\nRelevant Coursework: Web Design, Database Management, JavaScript Programming, User Experience Design\nAchievements: President of Web Development Club, Created college's student portal",
            "Full-Stack Web Development Bootcamp\nTech Academy\nJanuary - June 2020\nCompleted 800+ hours of intensive coding training\nTechnologies learned: JavaScript, React, Node.js, Express, MongoDB\nCapstone Project: Developed a full-stack e-commerce platform with payment processing and inventory management"
          ];
        }
      } else if (activeSection === "projects") {
        if (type === "short") {
          newSuggestions = [
            "E-commerce Platform: Developed a full-stack online store with payment processing using React and Node.js.",
            "Task Management App: Built a productivity tool with drag-and-drop interface using Vue.js and Firebase.",
            "Portfolio Website: Designed and implemented a responsive personal website showcasing projects and skills."
          ];
        } else if (type === "medium") {
          newSuggestions = [
            "E-commerce Platform\nDeveloped a full-stack online store using React, Node.js, and MongoDB. Implemented secure payment processing with Stripe, product search, and user authentication.\nTechnologies: React, Redux, Node.js, Express, MongoDB, Stripe API",
            "Task Management Application\nBuilt a productivity tool with drag-and-drop interface, real-time updates, and team collaboration features.\nTechnologies: Vue.js, Vuex, Firebase, CSS Grid, Moment.js",
            "Portfolio Website\nDesigned and implemented a responsive personal website showcasing projects and skills. Implemented animations and contact form with email integration.\nTechnologies: HTML5, CSS3/SCSS, JavaScript, GreenSock Animation"
          ];
        } else {
          newSuggestions = [
            "E-commerce Platform\nDeveloped a comprehensive full-stack online store with advanced features for both shoppers and administrators. Implemented secure payment processing with Stripe, product search with filters, user authentication, wishlist functionality, and an admin dashboard for inventory management.\n\nTechnologies: React, Redux, Node.js, Express, MongoDB, Stripe API, JWT authentication, Docker\n\nResults: Processed 500+ test transactions with 0% error rate. Achieved 98% performance score on Google Lighthouse.",
            "Task Management Application\nArchitected and built a productivity tool aimed at remote teams with drag-and-drop interface, real-time updates, and comprehensive team collaboration features. Implemented user roles, task dependencies, time tracking, file attachments, and analytics dashboard.\n\nTechnologies: Vue.js, Vuex, Firebase, CSS Grid, Moment.js, Chart.js, Socket.io, Cloud Storage\n\nResults: Reduced team's meeting time by 30% during beta testing. Application currently used by 15+ teams.",
            "Portfolio Website\nDesigned and implemented a responsive personal website showcasing projects and skills with a focus on accessibility and performance. Created advanced animations, interactive project showcase, theme switching, and contact form with email integration and spam protection.\n\nTechnologies: HTML5, CSS3/SCSS, JavaScript, GreenSock Animation, Netlify Functions, reCAPTCHA\n\nResults: Achieved 100% score on accessibility audit. Loads in under 2 seconds on 3G connections."
          ];
        }
      } else if (activeSection === "contact") {
        // For contact info, we'll provide professional headline suggestions
        if (type === "short") {
          newSuggestions = [
            "Senior Software Engineer",
            "Full-Stack Web Developer",
            "Frontend Development Specialist"
          ];
        } else if (type === "medium") {
          newSuggestions = [
            "Senior Software Engineer | React Specialist",
            "Full-Stack Web Developer | JavaScript Expert",
            "Frontend Development Specialist | UI/UX Enthusiast"
          ];
        } else {
          newSuggestions = [
            "Senior Software Engineer | React & Node.js Expert | Cloud Solutions Architect",
            "Full-Stack Web Developer | JavaScript Ecosystem Specialist | Agile Team Lead",
            "Frontend Development Specialist | UI/UX Enthusiast | Performance Optimization Guru"
          ];
        }
      }
      
      setSuggestions(newSuggestions);
      setIsLoadingSuggestions(false);
    }, 600);
  };
  
  // Function to apply a suggestion to the appropriate field based on the active section
  const applySuggestion = (suggestion: string) => {
    if (activeSection === "summary") {
      updateResume({
        ...resume,
        personalInfo: {
          ...resume.personalInfo,
          summary: suggestion
        }
      });
    } else if (activeSection === "experience") {
      // For simplicity, we'll just add this as a new experience item
      // In a real implementation, you'd want to handle this differently
      const newExp = {
        id: `exp-${Date.now()}`,
        title: "Position Title",
        company: "Company Name",
        startDate: "Jan 2020",
        endDate: "Present",
        description: suggestion
      };
      updateResume({
        ...resume,
        experience: [...resume.experience, newExp]
      });
    } else if (activeSection === "skills") {
      // Add as a skill or skills
      const skillParts = suggestion.split('\n');
      const newSkills = skillParts.map((skill, index) => ({
        id: `skill-${Date.now()}-${index}`,
        name: skill,
        proficiency: 80
      }));
      updateResume({
        ...resume,
        skills: [...resume.skills, ...newSkills]
      });
    } else if (activeSection === "education") {
      // Parse the education suggestion
      const lines = suggestion.split('\n');
      const degree = lines[0] || "Degree";
      const institution = lines[1] || "Institution";
      const years = lines[2] || "2018 - 2022";
      
      const newEdu = {
        id: `edu-${Date.now()}`,
        degree,
        institution,
        startDate: years.split(' - ')[0] || "2018",
        endDate: years.split(' - ')[1] || "2022",
        description: lines.slice(3).join('\n')
      };
      
      updateResume({
        ...resume,
        education: [...resume.education, newEdu]
      });
    } else if (activeSection === "projects") {
      // Parse the project suggestion
      const lines = suggestion.split('\n');
      const title = lines[0] || "Project Title";
      
      const newProject = {
        id: `proj-${Date.now()}`,
        title,
        description: lines.slice(1).join('\n'),
        technologies: ["React", "JavaScript", "CSS"],
        link: ""
      };
      
      updateResume({
        ...resume,
        projects: [...resume.projects, newProject]
      });
    } else if (activeSection === "contact") {
      updateResume({
        ...resume,
        personalInfo: {
          ...resume.personalInfo,
          headline: suggestion
        }
      });
    }
    
    toast({
      title: "Suggestion applied",
      description: "The AI suggestion has been added to your resume."
    });
  };

  return (
    <div className="cosmic-app-container flex flex-col min-h-screen">
      
      <div className="cosmic-main-content container  pb-20 px-4 md:px-6 max-w-7xl mx-auto relative z-10">
        {/* Page Header */}
        <PageHeader 
          title={<span className="cosmic-text-gradient">Resume Builder</span>}
          subtitle="Create a professional resume that passes ATS systems and gets you hired."
          actions={
            <div className="flex space-x-3">
              {/* Simple actions */}
              <Button 
                variant="outline" 
                onClick={handleSaveResume} 
                disabled={isLoading || !isDirty}
                className="border-white/10 text-gray-200 hover:bg-white/10 hover:text-white"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save
              </Button>
              <Button 
                onClick={handleDownload}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          }
        />

        {/* Main Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resume Editor Section */}
          <div className="lg:col-span-2 space-y-6">

            {/* Tabs Navigation */}
            <Tabs 
              defaultValue="contact" 
              value={activeSection} 
              onValueChange={setActiveSection}
              className="space-y-4"
            >
              <TabsList className="w-full max-w-full flex-nowrap bg-[#131c36] border-b border-[#2a325a] flex justify-between overflow-hidden">
                <TabsTrigger className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none bg-transparent hover:bg-[#212b52] text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent transition-colors" value="contact">Contact</TabsTrigger>
                <TabsTrigger className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none bg-transparent hover:bg-[#212b52] text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent transition-colors" value="summary">Summary</TabsTrigger>
                <TabsTrigger className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none bg-transparent hover:bg-[#212b52] text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent transition-colors" value="experience">Experience</TabsTrigger>
                <TabsTrigger className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none bg-transparent hover:bg-[#212b52] text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent transition-colors" value="education">Education</TabsTrigger>
                <TabsTrigger className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none bg-transparent hover:bg-[#212b52] text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent transition-colors" value="skills">Skills</TabsTrigger>
                <TabsTrigger className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none bg-transparent hover:bg-[#212b52] text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent transition-colors" value="projects">Projects</TabsTrigger>
                <TabsTrigger className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none bg-transparent hover:bg-[#212b52] text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent transition-colors" value="preview">Preview</TabsTrigger>
              </TabsList>

              {/* Contact/Personal Info Tab */}
              <TabsContent value="contact" className="space-y-4 p-6 bg-[#161f36] rounded-md border border-[#2a325a] mt-4 shadow-md">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <input
                      type="text"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={resume.personalInfo.firstName || ""}
                      onChange={(e) => updateResume({
                        ...resume,
                        personalInfo: {
                          ...resume.personalInfo,
                          firstName: e.target.value
                        }
                      })}
                      placeholder="First Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <input
                      type="text"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={resume.personalInfo.lastName || ""}
                      onChange={(e) => updateResume({
                        ...resume,
                        personalInfo: {
                          ...resume.personalInfo,
                          lastName: e.target.value
                        }
                      })}
                      placeholder="Last Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <input
                      type="email"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={resume.personalInfo.email || ""}
                      onChange={(e) => updateResume({
                        ...resume,
                        personalInfo: {
                          ...resume.personalInfo,
                          email: e.target.value
                        }
                      })}
                      placeholder="Email"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <input
                      type="tel"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={resume.personalInfo.phone || ""}
                      onChange={(e) => updateResume({
                        ...resume,
                        personalInfo: {
                          ...resume.personalInfo,
                          phone: e.target.value
                        }
                      })}
                      placeholder="Phone"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Professional Headline</label>
                    <input
                      type="text"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={resume.personalInfo.headline || ""}
                      onChange={(e) => updateResume({
                        ...resume,
                        personalInfo: {
                          ...resume.personalInfo,
                          headline: e.target.value
                        }
                      })}
                      placeholder="e.g., Senior Software Engineer | AI Specialist | Project Manager"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Summary Tab */}
              <TabsContent value="summary" className="space-y-4 p-6 bg-[#161f36] rounded-md border border-[#2a325a] mt-4 shadow-md">
                <div className="mb-4">
                  <h3 className="text-lg font-medium">Professional Summary</h3>
                </div>
                <div className="space-y-4">
                  <textarea
                    className="w-full min-h-[200px] rounded-md border border-input bg-background px-3 py-2"
                    value={resume.personalInfo.summary || ""}
                    onChange={(e) => updateResume({
                      ...resume,
                      personalInfo: {
                        ...resume.personalInfo,
                        summary: e.target.value
                      }
                    })}
                    placeholder="Write a compelling professional summary that highlights your expertise, experience, and key strengths."
                  />
                  <div className="bg-[#1a2442] border border-[#2a325a] p-5 rounded-md shadow-inner">
                    <h4 className="text-sm font-medium mb-3 flex items-center text-white">
                      <Star className="h-4 w-4 mr-2 text-blue-400" />
                      Pro Tips for a Great Summary
                    </h4>
                    <ul className="text-xs space-y-2 text-gray-300">
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        <span>Keep it between 3-5 sentences for optimal ATS scanning</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        <span>Mention years of experience and key specializations</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        <span>Include notable achievements with measurable results</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        <span>Tailor it to match the job descriptions you're targeting</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              {/* Experience Tab */}
              <TabsContent value="experience" className="space-y-4 p-6 bg-[#161f36] rounded-md border border-[#2a325a] mt-4 shadow-md">
                <ResumeExperienceSection
                  experiences={resume.experience}
                  onUpdate={(experiences) => updateResume({...resume, experience: experiences})}
                />
              </TabsContent>

              {/* Education Tab */}
              <TabsContent value="education" className="space-y-4 p-6 bg-[#161f36] rounded-md border border-[#2a325a] mt-4 shadow-md">
                <ResumeEducationSection
                  education={resume.education}
                  onUpdate={(education) => updateResume({...resume, education: education})}
                />
              </TabsContent>

              {/* Skills Tab */}
              <TabsContent value="skills" className="space-y-4 p-6 bg-[#161f36] rounded-md border border-[#2a325a] mt-4 shadow-md">
                <ResumeSkillsSection
                  skills={resume.skills}
                  onUpdate={(skills) => updateResume({...resume, skills: skills})}
                />
              </TabsContent>

              {/* Projects Tab */}
              <TabsContent value="projects" className="space-y-4 p-6 bg-[#161f36] rounded-md border border-[#2a325a] mt-4 shadow-md">
                <ResumeProjectsSection
                  projects={resume.projects}
                  onUpdate={(projects) => updateResume({...resume, projects: projects})}
                />
              </TabsContent>
              
              {/* Preview Tab */}
              <TabsContent value="preview" className="space-y-4 p-6 bg-[#161f36] rounded-md border border-[#2a325a] mt-4 shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Resume Preview</h3>
                  <Button 
                    onClick={handleDownload} 
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <ResumePreviewComponent
                    resume={resume}
                    onTemplateChange={(template) => updateResume({...resume, template})}
                    onDownload={handleDownload}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - AI Assistant - Only visible on large screens and only for non-preview tabs */}
          <div className={`hidden lg:block lg:col-span-1 ${activeSection === 'preview' || activeSection === 'contact' || activeSection === 'education' || activeSection === 'projects' ? 'hidden' : ''}`}>
            <div className="sticky top-4">
              <div className="bg-[#161f36] rounded-md border border-[#2a325a] p-5 shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <Bot className="h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-medium">AI Assistant</h3>
                </div>
                
                {activeSection === 'skills' ? (
                  /* Skills-specific UI */
                  <>
                    <p className="text-sm text-gray-300 mb-4">
                      Search and add skills that are relevant to your background and the jobs you're targeting.
                    </p>

                    {/* Search box for skills and refresh button */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="Search skills..."
                          className="w-full px-3 py-2 bg-[#0f172a] border border-[#2a325a] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={skillSearchQuery}
                          onChange={(e) => {
                            setSkillSearchQuery(e.target.value);
                            if (e.target.value) {
                              setIsLoadingSuggestions(true);
                              // Simulate API delay for the AI search
                              setTimeout(() => {
                                setIsLoadingSuggestions(false);
                              }, 500);
                            }
                          }}
                        />
                        {skillSearchQuery && !isLoadingSuggestions && (
                          <button 
                            className="absolute right-2 top-2 text-gray-400 hover:text-white"
                            onClick={() => setSkillSearchQuery('')}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                        {isLoadingSuggestions && skillSearchQuery && (
                          <div className="absolute right-2 top-2 text-blue-400">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={generateSkillSuggestions}
                        className="border-white/10 text-gray-200 hover:bg-white/10"
                        title="Show different skills"
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Refresh
                      </Button>
                    </div>
                    
                    {/* Skills suggestions grid */}
                    <div className="max-h-[400px] overflow-y-auto pr-1">
                      {isLoadingSuggestions ? (
                        <div className="flex justify-center items-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          {getFilteredSkillSuggestions().map((skill, index) => (
                            <div 
                              key={index}
                              className="p-2 rounded bg-[#1a2442] border border-[#2a325a] hover:border-blue-500/50 transition-all cursor-pointer text-center"
                              onClick={() => {
                                const newSkill = {
                                  id: `skill-${Date.now()}-${index}`,
                                  name: skill,
                                  proficiency: 80
                                };
                                updateResume({
                                  ...resume,
                                  skills: [...resume.skills, newSkill]
                                });
                                toast({
                                  title: "Skill added",
                                  description: `${skill} has been added to your skills.`
                                });
                              }}
                            >
                              <p className="text-sm">{skill}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  /* UI for Summary and Experience */
                  <>
                    {/* Length selector buttons */}
                    <div className="flex gap-2 mb-4">
                      <Button 
                        size="sm" 
                        variant={aiSuggestionType === 'short' ? 'default' : 'outline'}
                        onClick={() => generateSuggestions('short')}
                        className={aiSuggestionType === 'short' 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                          : 'border-white/10 text-gray-200 hover:bg-white/10'}
                      >
                        Short
                      </Button>
                      <Button 
                        size="sm" 
                        variant={aiSuggestionType === 'medium' ? 'default' : 'outline'}
                        onClick={() => generateSuggestions('medium')}
                        className={aiSuggestionType === 'medium' 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                          : 'border-white/10 text-gray-200 hover:bg-white/10'}
                      >
                        Medium
                      </Button>
                      <Button 
                        size="sm" 
                        variant={aiSuggestionType === 'long' ? 'default' : 'outline'}
                        onClick={() => generateSuggestions('long')}
                        className={aiSuggestionType === 'long' 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                          : 'border-white/10 text-gray-200 hover:bg-white/10'}
                      >
                        Long
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => generateSuggestions(aiSuggestionType)}
                        className="border-white/10 text-gray-200 hover:bg-white/10 ml-auto"
                        title="Generate new suggestions"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Descriptive text based on active section */}
                    <p className="text-sm text-gray-300 mb-4">
                      {activeSection === 'summary' && 'Select a professional summary that highlights your expertise and achievements.'}
                      {activeSection === 'experience' && 'Add impressive work experience bullet points to showcase your impact and skills.'}
                    </p>
                    
                    {/* Suggestions area */}
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                      {isLoadingSuggestions ? (
                        <div className="flex justify-center items-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                        </div>
                      ) : suggestions.length > 0 ? (
                        suggestions.map((suggestion, index) => (
                          <div 
                            key={index}
                            className="p-3 rounded bg-[#1a2442] border border-[#2a325a] hover:border-blue-500/50 transition-all cursor-pointer"
                            onClick={() => applySuggestion(suggestion)}
                          >
                            <p className="text-sm whitespace-pre-line">{suggestion}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-400">
                          <p>Click one of the buttons above to generate suggestions for your {activeSection}.</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Hint at bottom */}
                    {suggestions.length > 0 && (
                      <p className="text-xs text-gray-400 mt-4 text-center">
                        Click on a suggestion to apply it to your resume
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>




      </div>
    </div>
  );
}