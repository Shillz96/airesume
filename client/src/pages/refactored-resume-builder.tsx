import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useResumeData, Resume } from '@/hooks/use-resume-data';
import { PersonalInfo } from '@/hooks/use-resume-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Resume Section Components
import { PersonalInfoSection } from '@/components/resume/PersonalInfoSection';
import { ExperienceSection } from '@/components/resume/ExperienceSection';
import { EducationSection } from '@/components/resume/EducationSection';
import { SkillsSection } from '@/components/resume/SkillsSection';
import { ProjectsSection } from '@/components/resume/ProjectsSection';

// Resume Builder Components
import ResumeBuilderHeader from '@/components/resume-builder/ResumeBuilderHeader';
import ResumePreviewComponent from '@/components/resume-builder/ResumePreviewComponent';
import AIAssistantDialog from '@/components/resume-builder/AIAssistantDialog';
import TemplateSelector from '@/components/resume-builder/TemplateSelector';

// Icons
import {
  User,
  Briefcase,
  GraduationCap,
  Code,
  Folder,
  FileText,
  Sparkles,
  Bot,
  Send,
  Lightbulb,
  Plus,
} from 'lucide-react';

/**
 * ResumeBuilder is a comprehensive editor for creating and editing resumes.
 * It features section-by-section editing, AI assistance, and live preview.
 */
export default function ResumeBuilder() {
  // Resume data management
  const {
    resume,
    resumeId,
    activeSection,
    setActiveSection,
    isLoading,
    isDirty,
    updatePersonalInfo,
    updateExperienceList,
    updateEducationList,
    updateSkillsList,
    updateProjectsList,
    updateResumeTemplate,
    updateResumeTitle,
    saveResume
  } = useResumeData();
  
  const { toast } = useToast();
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [location] = useLocation();
  const [chatInput, setChatInput] = useState("");
  // Define ChatMessage type
  interface ChatMessage {
    id: string;
    sender: "AI" | "User";
    message: string;
    type?: "suggestion" | "summary" | "bullet" | "skill" | "content";
    suggestions?: string[];
    isLoading?: boolean;
  }
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "AI",
      message: "Hello! I'm your AI resume assistant. How can I help with your resume today?",
      type: "suggestion",
      suggestions: [
        "Help me write a professional summary",
        "Generate experience bullet points",
        "Suggest skills for my profile"
      ]
    }
  ]);
  
  // Handle resume download
  const handleDownload = () => {
    // In a real implementation, this would generate a PDF
    toast({
      title: "Preparing Download",
      description: "Your resume is being prepared for download as PDF.",
    });
    // Download functionality would be implemented here
  };
  
  // Handle section tab change
  const handleSectionChange = (value: string) => {
    setActiveSection(value);
  };
  
  // Handle personal info updates
  const handlePersonalInfoUpdate = (field: keyof PersonalInfo, value: string) => {
    updatePersonalInfo(field, value);
  };
  
  // Handle AI suggestions for summary
  const handleApplySummary = (summary: string) => {
    updatePersonalInfo('summary', summary);
  };
  
  // Handle AI suggestions for bullet points
  const handleApplyBulletPoint = (bulletPoint: string) => {
    // This would need logic to append to the right experience item
    // For now, we'll just show a toast
    toast({
      title: "Bullet Point Added",
      description: "The bullet point has been added to your experience.",
    });
  };
  
  // Handle AI suggestions for skills
  const handleApplySkill = (skill: string) => {
    const newSkill = {
      id: `skill-${Date.now()}`,
      name: skill,
      proficiency: 3 // Medium proficiency as default
    };
    
    const updatedSkills = [...resume.skills, newSkill];
    updateSkillsList(updatedSkills);
  };
  
  // Handle sending a chat message to AI assistant
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "User",
      message: chatInput,
    };
    
    const thinkingMessage: ChatMessage = {
      id: `ai-thinking-${Date.now()}`,
      sender: "AI",
      message: "Thinking...",
      isLoading: true
    };
    
    setChatMessages(prev => [...prev, userMessage, thinkingMessage]);
    
    // Clear input
    setChatInput("");
    
    // Simulate AI response after a delay (this would connect to your AI backend)
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "AI",
        message: "Here are some suggestions that might help with your resume:",
        type: "suggestion",
        suggestions: [
          "Add quantifiable achievements to your experience",
          "Include relevant keywords from the job description",
          "Highlight your most relevant skills"
        ]
      };
      
      setChatMessages(prev => [...prev.filter(msg => !msg.isLoading), aiResponse]);
    }, 1000);
  };
  
  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    // Add user selection to chat
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "User",
      message: suggestion,
    };
    
    const thinkingMessage: ChatMessage = {
      id: `ai-thinking-${Date.now()}`,
      sender: "AI",
      message: "Generating suggestions...",
      isLoading: true
    };
    
    setChatMessages(prev => [...prev, userMessage, thinkingMessage]);
    
    // Simulate AI response for different types of suggestions
    setTimeout(() => {
      let responseMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "AI",
        message: "",
        type: "content",
        suggestions: []
      };
      
      if (suggestion.includes("summary")) {
        responseMessage.message = "Here are some professional summary suggestions:";
        responseMessage.type = "summary";
        responseMessage.suggestions = [
          "Accomplished professional with a proven track record of delivering innovative solutions. Adept at leveraging expertise to drive business outcomes and optimize processes.",
          "Detail-oriented professional with a talent for analyzing complex situations and developing practical approaches. Consistently delivers results that drive business growth and operational excellence."
        ];
      } else if (suggestion.includes("experience") || suggestion.includes("bullet")) {
        responseMessage.message = "Here are some bullet point suggestions for your experience:";
        responseMessage.type = "bullet";
        responseMessage.suggestions = [
          "Increased website conversion rate by 25% through implementation of A/B testing and UX improvements",
          "Led a team of 5 developers to successfully deliver a mission-critical application, reducing processing time by 40%"
        ];
      } else if (suggestion.includes("skills")) {
        responseMessage.message = "Here are some skill suggestions based on your experience:";
        responseMessage.type = "skill";
        responseMessage.suggestions = [
          "Project Management",
          "Data Analysis",
          "React.js",
          "Problem Solving",
          "Team Leadership"
        ];
      }
      
      setChatMessages(prev => [...prev.filter(msg => !msg.isLoading), responseMessage]);
    }, 1000);
  };
  
  return (
    <div className="min-h-screen bg-cosmic-background">
      {/* Header with controls */}
      <ResumeBuilderHeader
        resumeTitle={resume.title}
        onTitleChange={updateResumeTitle}
        onSave={saveResume}
        onDownload={handleDownload}
        onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        isSaving={isLoading}
        isDirty={isDirty}
      />
      
      <main className="container mx-auto px-4 py-6 cosmic-container" style={{ padding: 'var(--space-6) var(--space-4)' }}>
        {/* Navigation Tabs */}
        <Tabs
          className="cosmic-tabs"
          value={activeSection}
          onValueChange={handleSectionChange}
        >
          <TabsList className="cosmic-tab-list mb-6" style={{ marginBottom: 'var(--space-6)' }}>
            <TabsTrigger value="profile" className="cosmic-tab-trigger">
              <User className="h-4 w-4 mr-1" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="experience" className="cosmic-tab-trigger">
              <Briefcase className="h-4 w-4 mr-1" />
              Experience
            </TabsTrigger>
            <TabsTrigger value="project" className="cosmic-tab-trigger">
              <Folder className="h-4 w-4 mr-1" />
              Project
            </TabsTrigger>
            <TabsTrigger value="education" className="cosmic-tab-trigger">
              <GraduationCap className="h-4 w-4 mr-1" />
              Education
            </TabsTrigger>
            <TabsTrigger value="skills" className="cosmic-tab-trigger">
              <Code className="h-4 w-4 mr-1" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="summary" className="cosmic-tab-trigger">
              <FileText className="h-4 w-4 mr-1" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="preview" className="cosmic-tab-trigger">
              <Sparkles className="h-4 w-4 mr-1" />
              Finish Up & Preview
            </TabsTrigger>
          </TabsList>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ gap: 'var(--space-6)' }}>
            {/* Main Content - Left/Center */}
            <div className={activeSection === "preview" ? "lg:col-span-3" : "lg:col-span-2 space-y-6"} style={{ '--space-y': 'var(--space-6)' } as React.CSSProperties}>
              {/* Content for each tab */}
              <TabsContent value="profile" className="mt-0">
                <PersonalInfoSection
                  personalInfo={resume.personalInfo}
                  resumeId={resumeId || undefined}
                  onUpdate={handlePersonalInfoUpdate}
                />
              </TabsContent>
              
              <TabsContent value="experience" className="mt-0">
                <ExperienceSection
                  experiences={resume.experience}
                  resumeId={resumeId || undefined}
                  onUpdate={updateExperienceList}
                />
              </TabsContent>
              
              <TabsContent value="project" className="mt-0">
                <ProjectsSection
                  projects={resume.projects}
                  resumeId={resumeId || undefined}
                  onUpdate={updateProjectsList}
                />
              </TabsContent>
              
              <TabsContent value="education" className="mt-0">
                <EducationSection
                  education={resume.education}
                  resumeId={resumeId || undefined}
                  onUpdate={updateEducationList}
                />
              </TabsContent>
              
              <TabsContent value="skills" className="mt-0">
                <SkillsSection
                  skills={resume.skills}
                  resumeId={resumeId || undefined}
                  onUpdate={updateSkillsList}
                />
              </TabsContent>
              
              <TabsContent value="summary" className="mt-0">
                <div className="cosmic-card cosmic-panel border border-cosmic-border p-6 rounded-lg" style={{ padding: 'var(--space-6)' }}>
                  <h2 className="text-lg font-medium mb-4 text-cosmic-text">Resume Summary</h2>
                  <p className="text-cosmic-text-secondary mb-4" style={{ marginBottom: 'var(--space-4)' }}>
                    Write a compelling summary that highlights your key qualifications, skills, and career goals.
                  </p>
                  <textarea
                    value={resume.personalInfo.summary}
                    onChange={(e) => handlePersonalInfoUpdate('summary', e.target.value)}
                    className="cosmic-input w-full h-32 p-3 bg-cosmic-input-bg border border-cosmic-border rounded-lg text-cosmic-text"
                    style={{ padding: 'var(--space-3)', height: '8rem' }}
                    placeholder="Enter a professional summary..."
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="preview" className="mt-0">
                <div className="flex flex-col space-y-6" style={{ gap: 'var(--space-6)' }}>
                  <TemplateSelector
                    selectedTemplate={resume.template}
                    onTemplateChange={updateResumeTemplate}
                  />
                  
                  {/* Full Width Preview Only Shown on Preview Tab */}
                  <div className="h-[calc(100vh-320px)] cosmic-card cosmic-panel border border-cosmic-border rounded-lg overflow-hidden">
                    <ResumePreviewComponent
                      resume={resume}
                      onTemplateChange={updateResumeTemplate}
                      onDownload={handleDownload}
                    />
                  </div>
                </div>
              </TabsContent>
            </div>
            
            {/* AI Assistant - Right Side (Only show when not in preview) */}
            {activeSection !== "preview" && (
              <div className="lg:col-span-1 h-[calc(100vh-220px)] sticky top-20">
                <div className="cosmic-card cosmic-panel border border-cosmic-border rounded-lg h-full flex flex-col overflow-hidden">
                  {/* Assistant Header */}
                  <div className="p-4 border-b border-cosmic-border flex items-center justify-between" style={{ padding: 'var(--space-4)' }}>
                    <div className="flex items-center">
                      <Bot className="h-5 w-5 text-cosmic-accent mr-2" />
                      <h2 className="text-lg font-medium text-cosmic-text">AI Resume Assistant</h2>
                    </div>
                  </div>
                  
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ padding: 'var(--space-4)', '--space-y': 'var(--space-4)' } as React.CSSProperties}>
                    {chatMessages.map((message: any) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "User" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg p-3 ${
                            message.sender === "User"
                              ? "bg-cosmic-accent text-white"
                              : "bg-cosmic-card-hover border border-cosmic-border text-cosmic-text"
                          }`}
                          style={{ padding: 'var(--space-3)' }}
                        >
                          {message.isLoading ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-cosmic-accent-light rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                              <div className="w-2 h-2 bg-cosmic-accent-light rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                              <div className="w-2 h-2 bg-cosmic-accent-light rounded-full animate-bounce"></div>
                            </div>
                          ) : (
                            <>
                              <p className="whitespace-pre-wrap">{message.message}</p>
                              
                              {/* Suggestions */}
                              {message.suggestions && message.suggestions.length > 0 && (
                                <div className="mt-3 space-y-2" style={{ marginTop: 'var(--space-3)', '--space-y': 'var(--space-2)' } as React.CSSProperties}>
                                  {message.suggestions.map((suggestion: string, idx: number) => (
                                    <div key={idx} className="flex">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="cosmic-button-outline text-xs text-left justify-start h-auto py-2 bg-cosmic-card-hover hover:bg-cosmic-accent-muted w-full"
                                        style={{ padding: 'var(--space-2) var(--space-3)' }}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                      >
                                        <Lightbulb className="h-3 w-3 mr-2 text-cosmic-accent flex-shrink-0" />
                                        <span className="whitespace-normal">{suggestion}</span>
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {/* Add buttons for applying content */}
                              {message.type === "summary" && message.suggestions && (
                                <div className="mt-2" style={{ marginTop: 'var(--space-2)' }}>
                                  {message.suggestions.map((text: string, idx: number) => (
                                    <div key={idx} className="mt-2 flex justify-end" style={{ marginTop: 'var(--space-2)' }}>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="cosmic-button-outline text-xs bg-cosmic-card-hover border-cosmic-accent-muted text-cosmic-accent hover:bg-cosmic-accent-muted"
                                        onClick={() => handleApplySummary(text)}
                                      >
                                        <Plus className="h-3 w-3 mr-2" />
                                        Apply to Summary
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {message.type === "bullet" && message.suggestions && (
                                <div className="mt-2" style={{ marginTop: 'var(--space-2)' }}>
                                  {message.suggestions.map((text: string, idx: number) => (
                                    <div key={idx} className="mt-2 flex justify-end" style={{ marginTop: 'var(--space-2)' }}>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="cosmic-button-outline text-xs bg-cosmic-card-hover border-cosmic-accent-muted text-cosmic-accent hover:bg-cosmic-accent-muted"
                                        onClick={() => handleApplyBulletPoint(text)}
                                      >
                                        <Plus className="h-3 w-3 mr-2" />
                                        Add to Experience
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {message.type === "skill" && message.suggestions && (
                                <div className="mt-2 flex flex-wrap gap-2" style={{ marginTop: 'var(--space-2)', gap: 'var(--space-2)' }}>
                                  {message.suggestions.map((skill: string, idx: number) => (
                                    <Button
                                      key={idx}
                                      size="sm"
                                      variant="outline"
                                      className="cosmic-button-outline text-xs bg-cosmic-card-hover border-cosmic-accent-muted text-cosmic-accent hover:bg-cosmic-accent-muted"
                                      onClick={() => handleApplySkill(skill)}
                                    >
                                      <Plus className="h-3 w-3 mr-1" />
                                      {skill}
                                    </Button>
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
                  <div className="p-4 border-t border-cosmic-border" style={{ padding: 'var(--space-4)' }}>
                    <div className="flex space-x-2" style={{ gap: 'var(--space-2)' }}>
                      <Input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask for resume help..."
                        className="cosmic-input flex-1 bg-cosmic-input-bg border-cosmic-border text-cosmic-text"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button
                        onClick={handleSendMessage}
                        size="icon"
                        className="cosmic-button bg-cosmic-accent hover:bg-cosmic-accent-hover text-white"
                        disabled={!chatInput.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Tabs>
      </main>
      
      {/* AI Assistant Dialog */}
      <AIAssistantDialog
        resumeId={resumeId || undefined}
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        onApplySummary={handleApplySummary}
        onApplyBulletPoint={handleApplyBulletPoint}
        onApplySkill={handleApplySkill}
        resume={resume}
        activeTab={activeSection}
      />
    </div>
  );
}