import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ResumeAIAssistantProps {
  activeSection: string;
  skillSearchQuery: string;
  setSkillSearchQuery: (query: string) => void;
  onApplySuggestion: (suggestion: string) => void;
  isHidden?: boolean;
}

/**
 * AI Assistant component for the Resume Builder
 * Provides contextual AI suggestions based on the active section
 */
export function ResumeAIAssistant({
  activeSection,
  skillSearchQuery,
  setSkillSearchQuery,
  onApplySuggestion,
  isHidden = false
}: ResumeAIAssistantProps) {
  const { toast } = useToast();
  const [aiSuggestionType, setAiSuggestionType] = useState<'short' | 'medium' | 'long'>('medium');
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);

  // Reset states and suggestions when active section changes
  useEffect(() => {
    setAiSuggestionType('medium');
    setSuggestions([]);
    
    if (activeSection === "skills") {
      generateSkillSuggestions();
    } else {
      setSkillSuggestions([]);
    }
  }, [activeSection]);

  // All available skills across multiple industries
  const allSkills = [
    // Technology & Software Development
    "JavaScript", "TypeScript", "Python", "Java", "C#", "C++", "Go", "Ruby", "PHP", "Swift",
    "React", "Angular", "Vue.js", "Node.js", "HTML/CSS", "SQL", "NoSQL", "MongoDB", "AWS", "Azure",
    "Docker", "Kubernetes", "DevOps", "CI/CD", "Git", "REST APIs", "GraphQL", "Microservices",
    "Agile", "Scrum", "Test-Driven Development", "Unit Testing", "Full-Stack Development",
    "Mobile App Development", "Cloud Computing", "System Design", "Database Design", "Data Modeling",
    "Web Accessibility", "SEO", "Performance Optimization", "Cybersecurity", "Network Security",
    
    // Business & Management
    "Strategic Planning", "Business Development", "Market Analysis", "Competitive Analysis",
    "Financial Analysis", "Budgeting", "Forecasting", "P&L Management", "Risk Management",
    "Process Improvement", "Change Management", "Team Leadership", "Performance Management",
    
    // Soft Skills
    "Communication", "Teamwork", "Problem Solving", "Critical Thinking", "Time Management",
    "Leadership", "Conflict Resolution", "Decision Making", "Adaptability", "Emotional Intelligence"
  ];
  
  // Function to generate skills based on real API data
  const generateSkillSuggestions = async () => {
    setIsLoadingSuggestions(true);
    
    try {
      // Get the resume ID from URL or context
      const resumeId = 1; // Replace with actual resume ID when available
      
      // Call the API to get skill suggestions
      const response = await fetch(`/api/resumes/${resumeId}/suggestions?type=skills`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch skill suggestions');
      }
      
      const data = await response.json();
      
      if (data.success && Array.isArray(data.suggestions)) {
        setSkillSuggestions(data.suggestions);
      } else {
        // Fallback to local suggestions if API response structure is unexpected
        const shuffled = [...allSkills].sort(() => 0.5 - Math.random());
        setSkillSuggestions(shuffled.slice(0, 10));
      }
    } catch (error) {
      console.error("Error fetching skill suggestions:", error);
      // Fallback to local suggestions in case of API failure
      const shuffled = [...allSkills].sort(() => 0.5 - Math.random());
      setSkillSuggestions(shuffled.slice(0, 10));
      
      toast({
        title: "Couldn't connect to AI service",
        description: "Using locally generated suggestions instead. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingSuggestions(false);
    }
  };
  
  // Function to get AI-based skill suggestions for a search query
  const getFilteredSkillSuggestions = async () => {
    // If no search query, just return the random suggestions
    if (!skillSearchQuery) return skillSuggestions;
    
    // If we have an active search query, show loading state
    if (isLoadingSuggestions) {
      return [];
    }
    
    try {
      // Get the resume ID from URL or context
      const resumeId = 1; // Replace with actual resume ID when available
      
      // In a real implementation with a search query, we would call the API
      // For now, filter locally but prepare for future API implementation
      setIsLoadingSuggestions(true);
      
      // Simulate API delay for the AI search
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // For now, filter the skills locally
      const matches = allSkills.filter(skill => 
        skill.toLowerCase().includes(skillSearchQuery.toLowerCase())
      );
      
      setIsLoadingSuggestions(false);
      
      // Take up to 10 matches
      return matches.slice(0, 10);
    } catch (error) {
      console.error("Error with skill search:", error);
      setIsLoadingSuggestions(false);
      
      // Fallback to local filtering in case of API issues
      const matches = allSkills.filter(skill => 
        skill.toLowerCase().includes(skillSearchQuery.toLowerCase())
      );
      return matches.slice(0, 10);
    }
  };
  
  // Function to generate AI suggestions based on the active section and suggestion type
  const generateSuggestions = async (type: "short" | "medium" | "long") => {
    setAiSuggestionType(type);
    setIsLoadingSuggestions(true);
    
    try {
      // Get the resume ID from URL or context
      const resumeId = 1; // Replace with actual resume ID when available
      
      // Determine the suggestion type based on the active section
      let suggestionType = "";
      
      if (activeSection === "summary") {
        suggestionType = "summary";
      } else if (activeSection === "experience") {
        suggestionType = "experience";
      } else if (activeSection === "skills") {
        suggestionType = "skills";
      } else if (activeSection === "projects") {
        suggestionType = "projects";
      } else {
        suggestionType = "general";
      }
      
      // Call the API to get suggestions
      const response = await fetch(`/api/resumes/${resumeId}/suggestions?type=${suggestionType}&length=${type}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${suggestionType} suggestions`);
      }
      
      const data = await response.json();
      
      if (data.success && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions);
        setIsLoadingSuggestions(false);
        return;
      } else {
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error(`Error generating ${activeSection} suggestions:`, error);
      
      // Fallback to local suggestions in case of API failure
      setTimeout(() => {
        let newSuggestions: string[] = [];
        
        // Generate different suggestions based on the active section
        if (activeSection === "summary") {
          // Based on the detected industry/role (here we're providing multiple industries)
          if (type === "short") {
            newSuggestions = [
              // Technology
              "Dedicated software engineer with 5+ years experience in web development, specializing in React and Node.js.",
              // Healthcare
              "Compassionate Registered Nurse with 6+ years of acute care experience, specializing in emergency medicine and patient advocacy.",
              // Marketing
              "Creative Marketing Specialist with proven success developing innovative campaigns that increase brand visibility and drive conversion rates."
            ];
          } else if (type === "medium") {
            newSuggestions = [
              // Technology
              "Seasoned software engineer with 5+ years of experience building responsive web applications. Expertise in JavaScript frameworks (React, Vue) and backend technologies (Node.js, Express). Delivered solutions that improved customer engagement by 40%.",
              // Healthcare
              "Dedicated Registered Nurse with 6+ years of experience in emergency and critical care settings. Expertise in trauma assessment, medication administration, and patient advocacy. Consistently recognized for compassionate care and quick decision-making in high-pressure situations.",
              // Sales/Business
              "Results-driven Sales Manager with 7+ years experience exceeding targets in competitive markets. Skilled in team leadership, client relationship management, and strategic territory planning. Proven track record of increasing regional sales by 35% and implementing effective sales training programs."
            ];
          } else {
            newSuggestions = [
              // Technology
              "Senior Software Engineer with 5+ years of experience architecting and implementing scalable web applications. Proficient in the entire development lifecycle from concept to deployment. Core expertise includes React, Node.js, GraphQL, and AWS. Successfully reduced API response times by 65% and implemented CI/CD pipelines that decreased deployment times from days to minutes. Known for mentoring junior developers and promoting best practices across development teams.",
              // Healthcare
              "Compassionate and versatile Registered Nurse with 6+ years of progressive experience in emergency medicine and critical care settings. Advanced certifications in ACLS, PALS, and Trauma Nursing. Recognized for exceptional patient care, having maintained 98% patient satisfaction scores while managing high-volume trauma cases. Experienced in implementing new triage protocols that reduced wait times by 30% and improved patient outcomes. Actively contributes to cross-departmental initiatives and mentors new nursing staff on best practices in emergency care protocols."
            ];
          }
        } else if (activeSection === "experience") {
          if (type === "short") {
            newSuggestions = [
              // Technology
              "Led development of a customer-facing web application that increased user engagement by 45%.",
              // Healthcare
              "Managed care for 15-20 patients daily in high-volume emergency department while maintaining 98% satisfaction rating.",
              // Sales
              "Exceeded quarterly sales targets by 32% through strategic account management and effective client relationship building."
            ];
          } else if (type === "medium") {
            newSuggestions = [
              // Technology
              "Spearheaded the development of a React-based customer portal that improved user engagement by 45% and reduced support tickets by 30%. Implemented state management using Redux and integrated with RESTful APIs to streamline data flow and enhance application performance.",
              // Healthcare
              "Coordinated patient care for 15-20 individuals daily in high-volume emergency department, implementing new triage protocols that reduced wait times by 25%. Collaborated with interdisciplinary teams to ensure comprehensive treatment plans and maintained 98% patient satisfaction rating."
            ];
          } else {
            newSuggestions = [
              // Technology
              "Led a cross-functional team of 5 developers to redesign the company's flagship customer portal using React and GraphQL, resulting in a 45% increase in user engagement and 30% reduction in support tickets. Implemented sophisticated state management with Redux, integrated with 12 internal microservices, and established comprehensive testing protocols that caught 95% of bugs before production. Collaborated with UX designers to optimize user workflows that reduced average task completion time by 40%, receiving recognition for exceptional project delivery from the CTO.",
              // Marketing
              "Orchestrated end-to-end rebranding campaign for established B2B company, including market research, positioning strategy, visual identity development, and omnichannel implementation. Managed $1.2M marketing budget and cross-functional team of 12 specialists across creative, digital, and content departments. Campaign resulted in 85% brand recognition improvement, 130% increase in qualified leads, and 45% growth in conversion rates."
            ];
          }
        } else if (activeSection === "projects") {
          if (type === "short") {
            newSuggestions = [
              "Developed a responsive e-commerce website with product filtering and secure checkout functionality.",
              "Created a mobile fitness application that tracks workouts and provides personalized recommendations.",
              "Built an inventory management system that reduced processing time by 35% for a local business."
            ];
          } else if (type === "medium") {
            newSuggestions = [
              "E-Commerce Platform | React, Node.js, MongoDB, Stripe API | Developed a fully responsive online store with product filtering, shopping cart, and secure payment processing. Implemented user authentication, order tracking, and admin dashboard for inventory management.",
              "Fitness Tracking Application | React Native, Firebase, Chart.js | Built a cross-platform mobile app that allows users to log workouts, track progress with interactive charts, and receive AI-powered exercise recommendations based on personal goals."
            ];
          } else {
            newSuggestions = [
              "E-Commerce Platform (2023) | React, Node.js, MongoDB, Stripe API | Led the development of a comprehensive online shopping platform for a specialty retailer with 15,000+ monthly visitors. Created a responsive UI with intuitive product filtering, wish list functionality, and seamless checkout experience. Implemented JWT authentication, role-based access control, and inventory management features. Integrated Stripe payment processing with webhook support for order fulfillment automation. The platform achieved a 28% increase in conversion rate and 45% decrease in cart abandonment compared to the client's previous solution.",
              "Healthcare Provider Portal (2022) | Angular, Express, PostgreSQL, Docker | Architected and developed a HIPAA-compliant web portal that streamlined communication between 200+ healthcare providers and their patients. Designed secure document exchange system with end-to-end encryption, appointment scheduling with automated reminders, and real-time messaging. Implemented comprehensive audit logging and access controls to ensure regulatory compliance. Containerized the application using Docker for consistent deployment across development and production environments. The solution reduced administrative workload by 40% and improved patient satisfaction scores by 25%."
            ];
          }
        } else if (activeSection === "skills") {
          // For skills section, we should use the skill suggestions generated earlier
          // This path shouldn't normally be reached since skills have their own UI
          newSuggestions = [
            "JavaScript", "React", "Node.js", "TypeScript",
            "Python", "AWS", "Docker", "REST APIs",
            "Communication", "Problem Solving", "Team Leadership"
          ];
        } else {
          // Default suggestions for other sections
          newSuggestions = [
            "Professional Web Developer with expertise in React and Node.js",
            "Full-Stack Engineer focused on creating scalable web applications",
            "Frontend Development Specialist | UI/UX Enthusiast | Performance Optimization Guru"
          ];
        }
        
        setSuggestions(newSuggestions);
        setIsLoadingSuggestions(false);
      }, 600);
    }
  };

  // If component should be hidden, return null
  if (isHidden) return null;

  // Render skills section UI
  if (activeSection === "skills") {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">AI Skill Suggestions</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={generateSkillSuggestions}
            disabled={isLoadingSuggestions}
          >
            {isLoadingSuggestions ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        </div>
        
        {/* Search input */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search for skills..."
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md text-sm"
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
          {skillSearchQuery && (
            <button
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
              onClick={() => setSkillSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {/* Skills suggestions */}
        <div className="space-y-2 mt-2">
          {isLoadingSuggestions ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              {skillSearchQuery ? (
                // Show search results
                <div className="grid grid-cols-1 gap-2">
                  {/* We'll handle this differently since we can't use .then() in JSX */}
                  {/* Using the skillSuggestions directly filtered by the search query */}
                  {allSkills
                    .filter(skill => skill.toLowerCase().includes(skillSearchQuery.toLowerCase()))
                    .slice(0, 10)
                    .map((skill, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 dark:bg-gray-900 p-2 rounded cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-800 text-sm"
                        onClick={() => onApplySuggestion(skill)}
                      >
                        {skill}
                      </div>
                    ))
                  }
                </div>
              ) : (
                // Show random skill suggestions
                <div className="grid grid-cols-1 gap-2">
                  {skillSuggestions.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-900 p-2 rounded cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-800 text-sm"
                      onClick={() => onApplySuggestion(skill)}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // Render standard UI for other sections
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">AI Assistant</h3>
      </div>
      
      {/* Options for summary, experience, and education sections */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={aiSuggestionType === 'short' ? 'default' : 'outline'}
          size="sm"
          onClick={() => generateSuggestions('short')}
          disabled={isLoadingSuggestions}
        >
          Short
        </Button>
        <Button
          variant={aiSuggestionType === 'medium' ? 'default' : 'outline'}
          size="sm"
          onClick={() => generateSuggestions('medium')}
          disabled={isLoadingSuggestions}
        >
          Medium
        </Button>
        <Button
          variant={aiSuggestionType === 'long' ? 'default' : 'outline'}
          size="sm"
          onClick={() => generateSuggestions('long')}
          disabled={isLoadingSuggestions}
        >
          Long
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => generateSuggestions(aiSuggestionType)}
          disabled={isLoadingSuggestions}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Suggestions display */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-md p-1 h-[calc(100%-8rem)] overflow-y-auto">
        {isLoadingSuggestions ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-3 mb-2 bg-gray-50 dark:bg-gray-900 rounded-md cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-800"
              onClick={() => onApplySuggestion(suggestion)}
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
    </div>
  );
}