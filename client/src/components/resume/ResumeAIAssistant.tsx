import React, { useState, useEffect, useCallback } from 'react';
// Import both button versions during transition
import { CosmicButton } from '@/components/cosmic-button';
import Button from '@/components/ui/modern-button';
import { Loader2, RefreshCw, X, Bot, Sparkles, MessageCircle, ArrowRight, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useResumeData } from '@/hooks/use-resume-data';

interface ResumeAIAssistantProps {
  activeSection: string;
  skillSearchQuery: string;
  setSkillSearchQuery: (query: string) => void;
  onApplySuggestion: (suggestion: string) => void;
  isHidden?: boolean;
  resumeId?: number | string;
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
  isHidden = false,
  resumeId
}: ResumeAIAssistantProps) {
  const { toast } = useToast();
  const { resume } = useResumeData();
  const [aiSuggestionType, setAiSuggestionType] = useState<'short' | 'medium' | 'long'>('medium');
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);
  const [isChatView, setIsChatView] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [suggestionsExpanded, setSuggestionsExpanded] = useState(true);

  // All available skills across multiple industries (as fallback)
  const allSkills = [
    // Technology & Software Development
    "JavaScript", "TypeScript", "Python", "React", "Node.js", 
    "AWS", "Docker", "REST APIs", "GraphQL", "SQL",
    
    // Business & Management
    "Strategic Planning", "Project Management", "Team Leadership", 
    
    // Soft Skills
    "Communication", "Problem Solving", "Critical Thinking"
  ];
  
  // Reset states and suggestions when active section changes
  useEffect(() => {
    setAiSuggestionType('medium');
    setSuggestions([]);
    setIsChatView(false);
    
    if (activeSection === "skills") {
      generateSkillSuggestions();
    } else if (["summary", "experience", "education", "projects"].includes(activeSection)) {
      generateSuggestions('medium');
    } else {
      setSkillSuggestions([]);
    }
  }, [activeSection]);

  // Function to fetch data from API or handle errors
  const fetchFromApi = useCallback(async (url: string) => {
    try {
      const response = await apiRequest('GET', url);
      const data = await response.json();
      
      if (data.success && Array.isArray(data.suggestions)) {
        return data.suggestions;
      } else if (data.fallbackSuggestions && Array.isArray(data.fallbackSuggestions)) {
        // Use fallback suggestions if provided
        return data.fallbackSuggestions;
      }
      throw new Error('Invalid API response format');
    } catch (error) {
      console.error(`Error fetching from ${url}:`, error);
      throw error; // Let the caller handle fallback
    }
  }, []);
  
  // Function to generate skills based on real API data
  const generateSkillSuggestions = async () => {
    if (!resumeId) {
      // If no resumeId, use local fallbacks immediately
      const shuffled = [...allSkills].sort(() => 0.5 - Math.random());
      setSkillSuggestions(shuffled.slice(0, 10));
      return;
    }
    
    setIsLoadingSuggestions(true);
    
    try {
      // Call API endpoint to get skill suggestions
      const suggestions = await fetchFromApi(`/api/resumes/${resumeId}/suggestions?skillsOnly=true${skillSearchQuery ? `&query=${encodeURIComponent(skillSearchQuery)}` : ''}`);
      setSkillSuggestions(suggestions);
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
  
  // Function to search for skills based on query
  const searchSkills = useCallback(async () => {
    if (!skillSearchQuery.trim()) {
      return generateSkillSuggestions();
    }
    
    setIsLoadingSuggestions(true);
    
    try {
      if (!resumeId) {
        // Fallback to local filtering if no resumeId
        const matches = allSkills.filter(skill => 
          skill.toLowerCase().includes(skillSearchQuery.toLowerCase())
        );
        setSkillSuggestions(matches.slice(0, 10));
        return;
      }
      
      const suggestions = await fetchFromApi(`/api/resumes/${resumeId}/suggestions?skillsOnly=true&query=${encodeURIComponent(skillSearchQuery)}`);
      setSkillSuggestions(suggestions);
    } catch (error) {
      // Fallback to local filtering
      const matches = allSkills.filter(skill => 
        skill.toLowerCase().includes(skillSearchQuery.toLowerCase())
      );
      setSkillSuggestions(matches.slice(0, 10));
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, [skillSearchQuery, resumeId, fetchFromApi]);
  
  // Search for skills when query changes
  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      if (activeSection === "skills") {
        searchSkills();
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [skillSearchQuery, activeSection, searchSkills]);
  
  // Function to generate AI suggestions based on the active section and suggestion type
  const generateSuggestions = async (type: "short" | "medium" | "long") => {
    setAiSuggestionType(type);
    setIsLoadingSuggestions(true);
    
    try {
      if (!resumeId) {
        // If no resumeId, use fallbacks (showing UI will show placeholder message)
        setTimeout(() => {
          setIsLoadingSuggestions(false);
          setSuggestions([]);
        }, 500);
        return;
      }
      
      // Determine the suggestion type based on the active section
      let queryParams = '';
      
      if (activeSection === "summary") {
        queryParams = `summaryOnly=true&length=${type}`;
      } else if (activeSection === "experience") {
        queryParams = `experienceOnly=true&length=${type}`;
      } else if (activeSection === "skills") {
        queryParams = `skillsOnly=true`;
      } else if (activeSection === "projects") {
        // No specific API for projects yet, use general suggestions
        queryParams = ``;
      } else {
        queryParams = ``;
      }
      
      // Call the API to get suggestions
      const suggestions = await fetchFromApi(`/api/resumes/${resumeId}/suggestions?${queryParams}`);
      setSuggestions(suggestions);
    } catch (error) {
      console.error(`Error generating ${activeSection} suggestions:`, error);
      // Reset suggestions on error
      setSuggestions([]);
      
      toast({
        title: "Unable to generate suggestions",
        description: "There was an error connecting to the AI service. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingSuggestions(false);
    }
  };
  
  // Handle chat message submission
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMessage.trim() || isSendingMessage) return;
    
    setIsSendingMessage(true);
    
    // Add user message to chat
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    const messageToSend = userMessage;
    setUserMessage('');
    
    try {
      if (!resumeId) {
        // Placeholder response if no resumeId
        setTimeout(() => {
          setChatMessages(prev => [...prev, { 
            role: 'assistant', 
            content: "I'm your AI resume assistant. Please save your resume or sign in to unlock personalized resume advice tailored to your experience and skills." 
          }]);
          setIsSendingMessage(false);
        }, 1000);
        return;
      }
      
      // In a real implementation, we would call an API endpoint
      // For now, simulate a response
      setTimeout(() => {
        let response: string;
        
        if (messageToSend.toLowerCase().includes('improve') || messageToSend.toLowerCase().includes('better')) {
          response = "To improve your resume, I recommend: 1) Add measurable achievements with specific numbers, 2) Use more powerful action verbs at the start of each bullet point, 3) Tailor your skills section to each job application, and 4) Ensure your summary highlights your most unique qualifications.";
        } else if (messageToSend.toLowerCase().includes('skills') || messageToSend.toLowerCase().includes('abilities')) {
          response = "Based on your experience, consider adding these in-demand skills: Data Analysis, Project Management, Team Leadership, Strategic Planning, and Problem Solving. Technical skills like SQL, Python, or Excel can also significantly boost your resume's visibility to ATS systems.";
        } else if (messageToSend.toLowerCase().includes('summary') || messageToSend.toLowerCase().includes('profile')) {
          response = "For your professional summary, consider: 'Seasoned professional with 5+ years of experience delivering business-critical solutions through innovative approaches and technical expertise. Proven track record of leading cross-functional teams to exceed objectives while optimizing resources and driving continuous improvement.'";
        } else {
          response = "I'm your AI resume assistant. I can help you improve your resume by suggesting better content for your summary, experience bullets, and skills. What specific section would you like help with?";
        }
        
        setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
        setIsSendingMessage(false);
      }, 1500);
    } catch (error) {
      console.error("Error sending chat message:", error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I encountered an error while processing your request. Please try again later." 
      }]);
      setIsSendingMessage(false);
    }
  };
  
  // Render the appropriate UI based on active section
  if (isHidden) {
    return null;
  }
  
  // Chat view UI
  if (isChatView) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Bot className="h-5 w-5 mr-2 text-primary" />
            <h3 className="font-medium">AI Resume Assistant</h3>
          </div>
          <CosmicButton 
            variant="ghost" 
            size="sm"
            onClick={() => setIsChatView(false)}
            className="h-8 w-8 p-0"
            iconLeft={<X className="h-4 w-4" />}
          />
        </div>
        
        <div className="flex-grow p-3 overflow-y-auto space-y-4">
          {chatMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <Bot className="h-10 w-10 mb-2 text-primary" />
              <p className="text-sm">Ask me anything about improving your resume!</p>
              <div className="mt-4 grid grid-cols-1 gap-2 w-full max-w-xs">
                <CosmicButton variant="outline" size="sm" onClick={() => {
                  setUserMessage("How can I improve my resume?");
                  setChatMessages([{ role: 'user', content: "How can I improve my resume?" }]);
                  
                  setTimeout(() => {
                    setChatMessages(prev => [...prev, { 
                      role: 'assistant', 
                      content: "To improve your resume, I recommend: 1) Add measurable achievements with specific numbers, 2) Use more powerful action verbs at the start of each bullet point, 3) Tailor your skills section to each job application, and 4) Ensure your summary highlights your most unique qualifications." 
                    }]);
                  }, 1000);
                }}>
                  How can I improve my resume?
                </CosmicButton>
                <CosmicButton variant="outline" size="sm" onClick={() => {
                  setUserMessage("Suggest skills for my experience");
                  setChatMessages([{ role: 'user', content: "Suggest skills for my experience" }]);
                  
                  setTimeout(() => {
                    setChatMessages(prev => [...prev, { 
                      role: 'assistant', 
                      content: "Based on your experience, consider adding these in-demand skills: Data Analysis, Project Management, Team Leadership, Strategic Planning, and Problem Solving. Technical skills like SQL, Python, or Excel can also significantly boost your resume's visibility to ATS systems." 
                    }]);
                  }, 1000);
                }}>
                  Suggest skills for my experience
                </CosmicButton>
                <CosmicButton variant="outline" size="sm" onClick={() => {
                  setUserMessage("Write a professional summary for me");
                  setChatMessages([{ role: 'user', content: "Write a professional summary for me" }]);
                  
                  setTimeout(() => {
                    setChatMessages(prev => [...prev, { 
                      role: 'assistant', 
                      content: "For your professional summary, consider: 'Seasoned professional with 5+ years of experience delivering business-critical solutions through innovative approaches and technical expertise. Proven track record of leading cross-functional teams to exceed objectives while optimizing resources and driving continuous improvement.'" 
                    }]);
                  }, 1000);
                }}>
                  Write a professional summary for me
                </CosmicButton>
              </div>
            </div>
          ) : (
            chatMessages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user' 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))
          )}
          
          {isSendingMessage && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 dark:bg-gray-700">
                <div className="flex space-x-2 items-center">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <form onSubmit={handleChatSubmit} className="p-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <input
              type="text"
              className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white dark:bg-gray-800"
              placeholder="Type your message..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              disabled={isSendingMessage}
            />
            <CosmicButton 
              type="submit" 
              className="rounded-l-none"
              disabled={isSendingMessage || !userMessage.trim()}
              variant="primary"
            >
              {isSendingMessage ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </CosmicButton>
          </div>
        </form>
      </div>
    );
  }
  
  // For Skills section, render skill search and suggestions
  if (activeSection === "skills") {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 cosmic-text-gradient" />
            <h3 className="text-sm font-semibold cosmic-text-gradient">AI Skill Suggestions</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsChatView(true)}
            className="h-7 w-7 p-0 rounded-full hover:bg-primary/10 dark:hover:bg-primary/20"
          >
            <MessageCircle className="h-3.5 w-3.5 text-primary" />
          </Button>
        </div>
      
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white dark:bg-gray-800"
              placeholder="Search skills or abilities..."
              value={skillSearchQuery}
              onChange={(e) => setSkillSearchQuery(e.target.value)}
            />
            {skillSearchQuery && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setSkillSearchQuery('')}
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <button 
              className="flex items-center space-x-1 text-sm font-medium cosmic-text-gradient"
              onClick={() => setSuggestionsExpanded(!suggestionsExpanded)}
            >
              <span>Skills to Add</span>
              {suggestionsExpanded ? <ChevronUp className="h-4 w-4 text-primary" /> : <ChevronDown className="h-4 w-4 text-primary" />}
            </button>
            <CosmicButton 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2"
              onClick={generateSkillSuggestions}
              disabled={isLoadingSuggestions}
              iconLeft={isLoadingSuggestions ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            />
          </div>
          
          {suggestionsExpanded && (
            isLoadingSuggestions ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : Array.isArray(skillSuggestions) && skillSuggestions.length > 0 ? (
              <div className="flex flex-wrap gap-2 py-2">
                {skillSuggestions.map((skill, index) => (
                  <button
                    key={index}
                    className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary dark:bg-primary/20 dark:hover:bg-primary/30 rounded-full text-xs font-medium transition-colors"
                    onClick={() => onApplySuggestion(skill)}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 text-sm italic">
                {resumeId ? "No skills found. Try a different search or refresh suggestions." : 
                "Save your resume to get AI-powered skill suggestions tailored to your experience."}
              </div>
            )
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Click any skill to add it to your resume. The AI assistant analyzes job market trends to recommend relevant skills.
          </p>
        </div>
      </div>
    );
  }
  
  // Render UI for other sections that support AI suggestions
  if (["summary", "experience", "education", "projects"].includes(activeSection)) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 cosmic-text-gradient" />
            <h3 className="text-sm font-semibold cosmic-text-gradient">AI Suggestions</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsChatView(true)}
            className="h-7 w-7 p-0 rounded-full hover:bg-primary/10 dark:hover:bg-primary/20"
          >
            <MessageCircle className="h-3.5 w-3.5 text-primary" />
          </Button>
        </div>
        
        {/* Only for summary, experience sections */}
        {["summary", "experience"].includes(activeSection) && (
          <div className="flex gap-2">
            <Button
              variant={aiSuggestionType === 'short' ? 'default' : 'outline'}
              size="sm"
              onClick={() => generateSuggestions('short')}
              disabled={isLoadingSuggestions}
              className="px-3 py-1 h-8 text-xs"
            >
              Short
            </Button>
            <Button
              variant={aiSuggestionType === 'medium' ? 'default' : 'outline'}
              size="sm"
              onClick={() => generateSuggestions('medium')}
              disabled={isLoadingSuggestions}
              className="px-3 py-1 h-8 text-xs"
            >
              Medium
            </Button>
            <Button
              variant={aiSuggestionType === 'long' ? 'default' : 'outline'}
              size="sm"
              onClick={() => generateSuggestions('long')}
              disabled={isLoadingSuggestions}
              className="px-3 py-1 h-8 text-xs"
            >
              Long
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => generateSuggestions(aiSuggestionType)}
              disabled={isLoadingSuggestions}
              className="px-2 py-1 h-8"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        )}
        
        {/* Section-specific helper text */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {activeSection === "summary" && "Choose an option to generate professional summary suggestions"}
          {activeSection === "experience" && "Get AI-powered bullet points for your work experience"}
          {activeSection === "education" && "Enhance your education section descriptions"}
          {activeSection === "projects" && "Generate compelling project descriptions"}
        </div>
        
        {/* Suggestions display */}
        {isLoadingSuggestions ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : suggestions.length > 0 ? (
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index} 
                className="bg-primary/5 dark:bg-primary/10 p-3.5 rounded-lg border border-primary/10 dark:border-primary/30"
              >
                <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{suggestion}</p>
                <div className="mt-3 flex justify-end">
                  <Button
                    size="sm"
                    onClick={() => onApplySuggestion(suggestion)}
                    className="h-7 text-xs cosmic-btn-glow text-white"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            {resumeId ? (
              <div className="flex flex-col items-center text-gray-500">
                <Sparkles className="h-8 w-8 mb-2 text-primary opacity-70" />
                <p className="text-sm">Click an option above to generate AI-powered suggestions.</p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                <Bot className="h-8 w-8 mb-2 text-primary opacity-70" />
                <p className="text-sm">Save your resume to unlock AI-powered suggestions.</p>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <CosmicButton 
            variant="ghost" 
            size="sm" 
            className="text-xs cosmic-text-gradient px-0 font-medium"
            onClick={() => setIsChatView(true)}
            iconLeft={<MessageCircle className="h-3.5 w-3.5 text-primary" />}
          >
            Chat with AI for tailored advice
          </CosmicButton>
        </div>
      </div>
    );
  }
  
  // For unsupported sections, show chat-only mode
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Bot className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold cosmic-text-gradient">AI Resume Assistant</h3>
        </div>
      </div>
      
      <div className="text-center py-8">
        <Bot className="h-12 w-12 mx-auto mb-3 text-primary opacity-70" />
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Have questions about your resume? Chat with our AI assistant for personalized advice.
        </p>
        <CosmicButton 
          variant="primary"
          onClick={() => setIsChatView(true)}
          className="cosmic-btn-glow text-white"
          iconLeft={<MessageCircle className="h-4 w-4 text-primary" />}
        >
          Chat with AI Assistant
        </CosmicButton>
      </div>
    </div>
  );
}