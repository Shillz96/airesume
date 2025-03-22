import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CosmicButton } from "@/components/cosmic-button-refactored";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Resume } from "@/hooks/use-resume-data";
import { Sparkles, Lightbulb, Briefcase, Book, Cpu, Code, FileText, Send, Bot } from "lucide-react";

interface AIAssistantDialogProps {
  resumeId?: string;
  isOpen: boolean;
  onClose: () => void;
  onApplySummary?: (summary: string) => void;
  onApplyBulletPoint?: (bulletPoint: string) => void;
  onApplySkill?: (skill: string) => void;
  resume?: Resume;
  activeTab?: string;
}

interface ChatMessage {
  id: string;
  sender: "AI" | "User";
  message: string;
  type?: "summary" | "bullet" | "skill" | "tailoring" | "education" | "project" | "general";
  options?: string[];
  isLoading?: boolean;
}

export default function AIAssistantDialog({
  resumeId,
  isOpen,
  onClose,
  onApplySummary,
  onApplyBulletPoint,
  onApplySkill,
  resume,
  activeTab
}: AIAssistantDialogProps) {
  const { toast } = useToast();
  const [activeAssistantTab, setActiveAssistantTab] = useState("chat");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "AI",
      message: "Hello! I'm your AI resume assistant. How can I help with your resume today?",
      type: "general",
      options: [
        "Help me write a professional summary",
        "Generate experience bullet points",
        "Suggest skills for my profile",
        "Improve my educational background"
      ]
    }
  ]);
  
  // When activeTab changes, suggest help for that section
  useEffect(() => {
    if (isOpen && activeTab) {
      let suggestion = "";
      let options: string[] = [];
      
      switch (activeTab) {
        case "profile":
          suggestion = "I see you're working on your profile section. Would you like help with your personal information or professional summary?";
          options = ["Help me write a professional summary", "Craft a catchy headline"];
          break;
        case "experience":
          suggestion = "Working on your work experience? I can help create impactful bullet points highlighting your achievements.";
          options = ["Generate bullet points for my current role", "Improve my job descriptions", "Quantify my achievements"];
          break;
        case "education":
          suggestion = "Let me help with your education section. I can suggest ways to highlight your academic achievements.";
          options = ["Format my education details", "Highlight relevant coursework"];
          break;
        case "skills":
          suggestion = "Need help with your skills section? I can suggest relevant skills based on your experience.";
          options = ["Suggest technical skills", "Suggest soft skills", "Recommend skills for my industry"];
          break;
        case "project":
          suggestion = "Working on projects? I can help you showcase them effectively on your resume.";
          options = ["Create project descriptions", "Highlight project technologies", "Format project achievements"];
          break;
        default:
          return; // Don't add a message for other tabs
      }
      
      // Add a contextual suggestion based on the active tab
      const newMessage: ChatMessage = {
        id: `suggestion-${Date.now()}`,
        sender: "AI",
        message: suggestion,
        type: "general",
        options: options
      };
      
      setChatMessages(prev => [...prev, newMessage]);
    }
  }, [isOpen, activeTab]);

  // Query to get suggestions when the dialog opens
  const { data: suggestionData, isLoading: suggestionsLoading } = useQuery({
    queryKey: ['/api/resume/suggestions', resumeId],
    enabled: isOpen && !!resumeId,
  });
  
  // Handle sending AI requests for suggestions
  const aiRequestMutation = useMutation({
    mutationFn: async (prompt: string) => {
      return await apiRequest('/api/resume/ai-suggestions', {
        method: 'POST',
        data: {
          resumeId,
          prompt,
          section: activeTab,
          currentContent: resume
        }
      });
    },
    onSuccess: (data: any) => {
      // Handle successful response from AI
      const aiResponse: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "AI",
        message: data.message || "Here are some suggestions for you:",
        type: data.type || "general",
        options: data.suggestions || []
      };
      
      setChatMessages(prev => [
        ...prev.map(msg => ({ ...msg, isLoading: false })),
        aiResponse
      ]);
    },
    onError: (error: Error) => {
      // Handle error
      toast({
        title: "Suggestion Error",
        description: "Failed to generate suggestions. Please try again.",
        variant: "destructive"
      });
      
      // Update the loading indicator
      setChatMessages(prev => prev.map(msg => ({ ...msg, isLoading: false })));
      
      // Add fallback suggestions based on the section
      const fallbackMessage: ChatMessage = getFallbackMessage();
      setChatMessages(prev => [...prev, fallbackMessage]);
    }
  });

  // Function to handle sending a message
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "User",
      message: chatInput,
    };
    
    // Add AI loading message
    const loadingMessage: ChatMessage = {
      id: `loading-${Date.now()}`,
      sender: "AI",
      message: "Thinking...",
      isLoading: true
    };
    
    setChatMessages(prev => [...prev, userMessage, loadingMessage]);
    
    // Clear input
    setChatInput("");
    
    // Send to AI
    aiRequestMutation.mutate(chatInput);
  };

  // Function to handle clicking on a suggestion option
  const handleSuggestionClick = (option: string) => {
    // Add user message indicating selection
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "User",
      message: option,
    };
    
    // Add AI loading message
    const loadingMessage: ChatMessage = {
      id: `loading-${Date.now()}`,
      sender: "AI",
      message: "Generating suggestions...",
      isLoading: true
    };
    
    setChatMessages(prev => [...prev, userMessage, loadingMessage]);
    
    // Send to AI
    aiRequestMutation.mutate(option);
  };

  // Function to apply a suggestion to the resume
  const handleApplySuggestion = (suggestion: string, type?: string) => {
    switch (type) {
      case "summary":
        if (onApplySummary) onApplySummary(suggestion);
        toast({
          title: "Summary Applied",
          description: "The professional summary has been added to your resume.",
        });
        break;
      case "bullet":
        if (onApplyBulletPoint) onApplyBulletPoint(suggestion);
        toast({
          title: "Bullet Point Applied",
          description: "The bullet point has been added to your experience.",
        });
        break;
      case "skill":
        if (onApplySkill) onApplySkill(suggestion);
        toast({
          title: "Skill Applied",
          description: "The skill has been added to your resume.",
        });
        break;
      default:
        // Copy to clipboard as fallback
        navigator.clipboard.writeText(suggestion);
        toast({
          title: "Copied to Clipboard",
          description: "The suggestion has been copied to your clipboard.",
        });
    }
  };

  // Fallback messages if the API fails
  const getFallbackMessage = (): ChatMessage => {
    let options: string[] = [];
    
    switch (activeTab) {
      case "profile":
        return {
          id: `fallback-${Date.now()}`,
          sender: "AI",
          message: "Here are some professional summary suggestions:",
          type: "summary",
          options: [
            "Experienced software developer with a passion for creating clean, efficient code and a track record of delivering high-quality applications on time.",
            "Detail-oriented marketing professional with 5+ years of experience developing successful campaigns that increase brand visibility and drive customer engagement.",
            "Results-driven project manager skilled in leading cross-functional teams to deliver complex projects on schedule and within budget constraints."
          ]
        };
      case "experience":
        return {
          id: `fallback-${Date.now()}`,
          sender: "AI",
          message: "Here are some bullet point suggestions for your experience:",
          type: "bullet",
          options: [
            "Increased website conversion rate by 25% through implementation of A/B testing and user experience improvements.",
            "Led a team of 5 developers to successfully deliver a mission-critical application, reducing processing time by 40%.",
            "Managed a $500K budget while overseeing all aspects of project planning, execution, and reporting to stakeholders."
          ]
        };
      case "skills":
        return {
          id: `fallback-${Date.now()}`,
          sender: "AI",
          message: "Here are some skill suggestions based on common industry requirements:",
          type: "skill",
          options: [
            "React.js",
            "Project Management",
            "Data Analysis",
            "Communication",
            "Problem Solving",
            "Team Leadership"
          ]
        };
      default:
        return {
          id: `fallback-${Date.now()}`,
          sender: "AI",
          message: "I can help you improve various sections of your resume. What would you like assistance with?",
          type: "general",
          options: [
            "Help me write a professional summary",
            "Generate experience bullet points",
            "Suggest skills for my profile"
          ]
        };
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[90vw] md:max-w-[700px] h-[80vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Cpu className="h-5 w-5 text-blue-400" />
            Resume AI Assistant
          </DialogTitle>
          <DialogDescription>
            Get intelligent suggestions to enhance your resume and stand out to employers
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeAssistantTab} onValueChange={setActiveAssistantTab} className="flex flex-col h-full">
          <div className="px-6">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="chat" className="flex items-center gap-1">
                <Bot className="h-4 w-4" />
                Chat Assistant
              </TabsTrigger>
              <TabsTrigger value="summaries" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Summary Ideas
              </TabsTrigger>
              <TabsTrigger value="bullets" className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                Bullet Points
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="chat" className="flex-1 flex flex-col px-6 overflow-hidden m-0">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "User" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "User"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 border border-gray-700 text-gray-100"
                    }`}
                  >
                    {message.isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"></div>
                      </div>
                    ) : (
                      <>
                        <p className="whitespace-pre-wrap">{message.message}</p>
                        
                        {/* Suggestion Options */}
                        {message.options && message.options.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {message.options.map((option, index) => (
                              <div key={index} className="flex">
                                {message.type && message.type !== "general" ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs text-left justify-start h-auto py-2 bg-gray-700/50 hover:bg-blue-900/50 w-full"
                                    onClick={() => handleApplySuggestion(option, message.type)}
                                  >
                                    <Sparkles className="h-3 w-3 mr-2 text-blue-400" />
                                    <span className="whitespace-normal">{option}</span>
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs text-left justify-start h-auto py-2 bg-gray-700/50 hover:bg-blue-900/50 w-full"
                                    onClick={() => handleSuggestionClick(option)}
                                  >
                                    <Lightbulb className="h-3 w-3 mr-2 text-blue-400" />
                                    <span className="whitespace-normal">{option}</span>
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Chat Input */}
            <div className="border-t border-gray-800 pt-4 pb-2">
              <div className="flex space-x-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask for resume help or suggestions..."
                  className="cosmic-input"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  disabled={!chatInput.trim() || aiRequestMutation.isPending}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="summaries" className="flex-1 overflow-y-auto px-6 space-y-4 m-0">
            <div className="space-y-4">
              <div className="cosmic-card p-4 border border-blue-900/30 bg-blue-950/20">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-blue-400" />
                  Professional Summary Suggestions
                </h3>
                <p className="text-gray-300 mb-4">
                  Choose one of these compelling summaries to highlight your professional background
                </p>
                
                <div className="space-y-3">
                  {suggestionsLoading ? (
                    <div className="space-y-2">
                      <div className="h-14 bg-gray-800 animate-pulse rounded-md"></div>
                      <div className="h-14 bg-gray-800 animate-pulse rounded-md"></div>
                      <div className="h-14 bg-gray-800 animate-pulse rounded-md"></div>
                    </div>
                  ) : (
                    [
                      "Result-oriented software developer with 5+ years of experience building scalable web applications. Proficient in JavaScript, React, and Node.js with a strong focus on code quality and performance optimization.",
                      "Creative marketing professional with expertise in digital strategy and brand development. Proven track record of increasing customer engagement and driving conversion through innovative campaigns across multiple platforms.",
                      "Analytical financial advisor skilled in portfolio management and wealth preservation strategies. Dedicated to providing personalized financial guidance that helps clients achieve long-term goals and security."
                    ].map((summary, index) => (
                      <div key={index} className="cosmic-card border border-gray-700 p-3 bg-gray-800/50 rounded-md">
                        <p className="text-gray-200 text-sm mb-2">{summary}</p>
                        <Button
                          size="sm"
                          className="text-xs bg-blue-600 hover:bg-blue-700"
                          onClick={() => {
                            if (onApplySummary) onApplySummary(summary);
                            toast({
                              title: "Summary Applied",
                              description: "The professional summary has been added to your resume.",
                            });
                          }}
                        >
                          <Sparkles className="h-3 w-3 mr-1" /> Apply to Resume
                        </Button>
                      </div>
                    ))
                  )}
                </div>
                
                <p className="text-gray-400 text-xs mt-4">
                  Summaries are generated based on your experience and skills. Customize after applying.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="bullets" className="flex-1 overflow-y-auto px-6 space-y-4 m-0">
            <div className="space-y-4">
              <div className="cosmic-card p-4 border border-blue-900/30 bg-blue-950/20">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                  <Briefcase className="h-5 w-5 text-blue-400" />
                  Experience Bullet Points
                </h3>
                <p className="text-gray-300 mb-4">
                  Add these impactful bullet points to showcase your achievements
                </p>
                
                <div>
                  <Label className="text-sm text-blue-300 mb-2 block">Select job position</Label>
                  <select className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white mb-4">
                    <option value="">Frontend Developer at TechCorp</option>
                    <option value="">Project Manager at Creative Solutions</option>
                  </select>
                </div>
                
                <div className="space-y-3 mt-4">
                  {suggestionsLoading ? (
                    <div className="space-y-2">
                      <div className="h-12 bg-gray-800 animate-pulse rounded-md"></div>
                      <div className="h-12 bg-gray-800 animate-pulse rounded-md"></div>
                      <div className="h-12 bg-gray-800 animate-pulse rounded-md"></div>
                    </div>
                  ) : (
                    [
                      "Developed a responsive web application that increased mobile user engagement by 45% and reduced bounce rate by 30% within three months of launch.",
                      "Implemented CI/CD pipeline using GitHub Actions, reducing deployment time by 60% and eliminating 90% of post-deployment issues.",
                      "Optimized database queries, resulting in a 70% improvement in application load time and enhanced user experience for over 10,000 daily active users.",
                      "Led cross-functional team of 6 developers to deliver project milestones on time and 15% under budget.",
                    ].map((bullet, index) => (
                      <div key={index} className="cosmic-card border border-gray-700 p-3 bg-gray-800/50 rounded-md">
                        <p className="text-gray-200 text-sm mb-2">{bullet}</p>
                        <Button
                          size="sm"
                          className="text-xs bg-blue-600 hover:bg-blue-700"
                          onClick={() => {
                            if (onApplyBulletPoint) onApplyBulletPoint(bullet);
                            toast({
                              title: "Bullet Point Applied",
                              description: "The bullet point has been added to your experience.",
                            });
                          }}
                        >
                          <Sparkles className="h-3 w-3 mr-1" /> Add to Experience
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="px-6 py-4 border-t border-gray-800">
          <DialogClose asChild>
            <Button variant="outline" className="mr-auto">Close</Button>
          </DialogClose>
          <div className="text-xs text-gray-400">
            AI suggestions are tailored to your resume content
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}