import React, { useState, useEffect, useCallback } from 'react';
// Import standard button
import { Button } from '@/components/ui/button';
// import { CosmicButton } from '@/components/cosmic-button'; // Assuming CosmicButton is deprecated or handled differently
// import Button from '@/components/ui/modern-button'; // Remove this import
import { Loader2, RefreshCw, X, Bot, Sparkles, MessageCircle, ArrowRight, Search, ChevronDown, ChevronUp, Plus } from 'lucide-react';
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
  
  // Function to fetch data from API with retry logic
  const fetchFromApi = useCallback(async (url: string, retries = 2) => {
    for (let i = 0; i <= retries; i++) {
      try {
        const response = await apiRequest('GET', url);
        const data = await response.json();
        
        if (data.success && Array.isArray(data.suggestions)) {
          return data.suggestions;
        } else if (data.fallbackSuggestions && Array.isArray(data.fallbackSuggestions)) {
          toast({
            title: "Using Fallback Suggestions",
            description: "Using locally stored suggestions due to API limitations.",
            variant: "default"
          });
          return data.fallbackSuggestions;
        }
        throw new Error('Invalid API response format');
      } catch (error) {
        if (i === retries) {
          // On final retry, return null to trigger fallback
          return null;
        }
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
    return null;
  }, [toast]);
  
  // Function to generate skills with improved error handling
  const generateSkillSuggestions = useCallback(async () => {
    if (!resumeId) {
      const shuffled = [...allSkills].sort(() => 0.5 - Math.random());
      setSkillSuggestions(shuffled.slice(0, 10));
      return;
    }
    
    setIsLoadingSuggestions(true);
    
    try {
      const suggestions = await fetchFromApi(`/api/resumes/${resumeId}/suggestions?skillsOnly=true${skillSearchQuery ? `&query=${encodeURIComponent(skillSearchQuery)}` : ''}`);
      if (suggestions) {
        setSkillSuggestions(suggestions);
      } else {
        // Fallback to local suggestions
        const shuffled = [...allSkills].sort(() => 0.5 - Math.random());
        setSkillSuggestions(shuffled.slice(0, 10));
        
        toast({
          title: "Using Local Suggestions",
          description: "Using locally generated suggestions while we restore the connection.",
          variant: "default"
        });
      }
    } catch (error) {
      // Silent error handling with user feedback
      const shuffled = [...allSkills].sort(() => 0.5 - Math.random());
      setSkillSuggestions(shuffled.slice(0, 10));
      
      toast({
        title: "Using Local Suggestions",
        description: "Using locally generated suggestions while we restore the connection.",
        variant: "default"
      });
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, [resumeId, skillSearchQuery, fetchFromApi, toast, allSkills]);
  
  // Function to search skills with improved error handling
  const handleSkillSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      return generateSkillSuggestions();
    }
    
    setIsLoadingSuggestions(true);
    
    try {
      if (!resumeId) {
        // Fallback to local filtering if no resumeId
        const matches = allSkills.filter(skill => 
          skill.toLowerCase().includes(query.toLowerCase())
        );
        setSkillSuggestions(matches.slice(0, 10));
        return;
      }
      
      const suggestions = await fetchFromApi(`/api/resumes/${resumeId}/suggestions?skillsOnly=true&query=${encodeURIComponent(query)}`);
      if (suggestions) {
        setSkillSuggestions(suggestions);
      } else {
        // Fallback to local filtering
        const matches = allSkills.filter(skill => 
          skill.toLowerCase().includes(query.toLowerCase())
        );
        setSkillSuggestions(matches.slice(0, 10));
        
        toast({
          title: "Local Search Results",
          description: "Showing matches from local database.",
          variant: "default"
        });
      }
    } catch (error) {
      // Silent error handling with user feedback
      const matches = allSkills.filter(skill => 
        skill.toLowerCase().includes(query.toLowerCase())
      );
      setSkillSuggestions(matches.slice(0, 10));
      
      toast({
        title: "Local Search Results",
        description: "Showing matches from local database.",
        variant: "default"
      });
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, [resumeId, fetchFromApi, toast, allSkills, generateSkillSuggestions]);
  
  // Search for skills when query changes
  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      if (activeSection === "skills") {
        handleSkillSearch(skillSearchQuery);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [skillSearchQuery, activeSection, handleSkillSearch]);
  
  // Function to generate suggestions with improved error handling
  const generateSuggestions = useCallback(async (type: "short" | "medium" | "long") => {
    setAiSuggestionType(type);
    setIsLoadingSuggestions(true);
    
    try {
      if (!resumeId) {
        setTimeout(() => {
          setIsLoadingSuggestions(false);
          setSuggestions([]);
          toast({
            title: "Resume ID Required",
            description: "Please save your resume first to get AI suggestions.",
            variant: "default"
          });
        }, 500);
        return;
      }
      
      let queryParams = '';
      
      switch (activeSection) {
        case "summary":
          queryParams = `summaryOnly=true&length=${type}`;
          break;
        case "experience":
          queryParams = `experienceOnly=true&length=${type}`;
          break;
        case "skills":
          queryParams = `skillsOnly=true`;
          break;
        case "projects":
        default:
          queryParams = ``;
      }
      
      const suggestions = await fetchFromApi(`/api/resumes/${resumeId}/suggestions?${queryParams}`);
      if (suggestions) {
        setSuggestions(suggestions);
      } else {
        setSuggestions([]);
        toast({
          title: "Suggestion Generation Failed",
          description: "Unable to generate suggestions at this time. Please try again later.",
          variant: "default"
        });
      }
    } catch (error) {
      // Silent error handling with user feedback
      setSuggestions([]);
      toast({
        title: "Suggestion Generation Failed",
        description: "Unable to generate suggestions at this time. Please try again later.",
        variant: "default"
      });
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, [resumeId, activeSection, fetchFromApi, toast]);
  
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
  }, [activeSection, generateSkillSuggestions, generateSuggestions]);

  // Handle chat message submission
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMessage.trim() || isSendingMessage) return;
    
    setIsSendingMessage(true);
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    const messageToSend = userMessage;
    setUserMessage('');
    
    try {
      if (!resumeId) {
        setTimeout(() => {
          setChatMessages(prev => [...prev, { 
            role: 'assistant', 
            content: "I'm your AI resume assistant. Please save your resume or sign in to unlock personalized resume advice tailored to your experience and skills." 
          }]);
          setIsSendingMessage(false);
        }, 1000);
        return;
      }
      
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
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I encountered an error while processing your request. Please try again later." 
      }]);
      setIsSendingMessage(false);
    }
  };
  
  const fetchSuggestions = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      toast({
        title: "Error Fetching Suggestions",
        description: "Failed to fetch suggestions. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  return (
    <div className={`w-full transition-all ease-out duration-500 ${isHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="solid-card shadow-lg rounded-lg overflow-hidden border border-white/20 dark:border-gray-800/40">
        <div className="p-4 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border-b border-white/10 dark:border-gray-800/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold no-blur">AI Resume Assistant</h3>
            </div>
            
            <div className="flex gap-2">
              {!isChatView && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-2"
                  onClick={() => setIsChatView(true)}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Chat
                </Button>
              )}
              {isChatView && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-2"
                  onClick={() => setIsChatView(false)}
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  Suggestions
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-4">
          {/* Regular Suggestions View */}
          {!isChatView && (
            <>
              {/* Content based on active section */}
              {activeSection === "skills" ? (
                <>
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={skillSearchQuery}
                        onChange={(e) => setSkillSearchQuery(e.target.value)}
                        placeholder="Search for relevant skills..."
                        className="w-full pl-9 py-2 px-3 rounded-md border border-white/10 dark:border-gray-700/30 no-blur bg-white/10 dark:bg-gray-900/10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 my-3 no-blur">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400">Recommended Skills</h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 px-2"
                        onClick={() => generateSkillSuggestions()}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Refresh
                      </Button>
                    </div>
                    
                    {isLoadingSuggestions ? (
                      <div className="py-4 flex justify-center">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 py-1">
                        {skillSuggestions.length > 0 ? (
                          skillSuggestions.map((skill, index) => (
                            <div key={index} className="solid-card no-blur rounded-md p-2 text-sm flex justify-between items-center group">
                              <span className="truncate">{skill}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onApplySuggestion(skill)}
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-2 text-sm text-muted-foreground py-2">
                            No skill suggestions available. Try refining your search or adding a work history.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Suggestions for other sections */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={aiSuggestionType === 'short' ? 'secondary' : 'outline'}
                        size="sm"
                        onClick={() => generateSuggestions('short')}
                        disabled={isLoadingSuggestions}
                      >
                        Short
                      </Button>
                      <Button
                        variant={aiSuggestionType === 'medium' ? 'secondary' : 'outline'}
                        size="sm"
                        onClick={() => generateSuggestions('medium')}
                        disabled={isLoadingSuggestions}
                      >
                        Medium
                      </Button>
                      <Button
                        variant={aiSuggestionType === 'long' ? 'secondary' : 'outline'}
                        size="sm"
                        onClick={() => generateSuggestions('long')}
                        disabled={isLoadingSuggestions}
                      >
                        Detailed
                      </Button>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSuggestionsExpanded(!suggestionsExpanded)}
                      className="p-1 h-8 w-8"
                    >
                      {suggestionsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  {isLoadingSuggestions ? (
                    <div className="py-6 flex justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <>
                      {suggestionsExpanded && (
                        <div className="space-y-3 no-blur">
                          {suggestions.length > 0 ? (
                            suggestions.map((suggestion, index) => (
                              <div 
                                key={index} 
                                className="solid-card rounded-md p-3 text-sm hover:shadow-md transition-shadow"
                              >
                                <p className="text-slate-700 dark:text-slate-300 mb-2">{suggestion}</p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-1 w-full text-xs"
                                  onClick={() => onApplySuggestion(suggestion)}
                                >
                                  Apply
                                </Button>
                              </div>
                            ))
                          ) : (
                            <div className="text-center p-4 text-muted-foreground">
                              {resumeId ? 
                                "No AI suggestions available for this section yet. Try a different length or save your resume first." :
                                "Please save your resume to enable AI-powered suggestions tailored to your profile."
                              }
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
          
          {/* Chat Interface */}
          {isChatView && (
            <div className="h-[350px] flex flex-col">
              <div className="flex-1 overflow-y-auto mb-3 space-y-3 solid-card rounded-md p-3">
                {chatMessages.length > 0 ? (
                  chatMessages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div 
                        className={`max-w-[80%] p-2 rounded-lg text-sm no-blur
                          ${message.role === 'user' 
                            ? 'bg-blue-500 text-white ml-4' 
                            : 'solid-card mr-4'}
                        `}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-center">
                    <div className="max-w-xs text-muted-foreground">
                      <Bot className="h-8 w-8 mx-auto mb-2 text-primary/60" />
                      <p className="text-sm">
                        Ask me anything about your resume. I can help with phrasing, formatting tips, or suggest improvements.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <form onSubmit={handleChatSubmit} className="relative mt-auto">
                <input 
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder="Ask for resume help..."
                  className="w-full pl-3 pr-10 py-2 rounded-md border border-white/10 dark:border-gray-700/30 no-blur bg-white/10 dark:bg-gray-900/10"
                  disabled={isSendingMessage}
                />
                <Button 
                  type="submit" 
                  variant="ghost" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  disabled={isSendingMessage || !userMessage.trim()}
                >
                  {isSendingMessage ? 
                    <Loader2 className="h-4 w-4 animate-spin" /> : 
                    <ArrowRight className="h-4 w-4" />
                  }
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}