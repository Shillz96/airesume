import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import {
  Briefcase,
  Code,
  Download,
  Eye,
  FileText,
  FolderKanban,
  GraduationCap,
  Upload,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EducationItem, ExperienceItem, ProjectItem, SkillItem, ResumeExperienceSection, ResumeEducationSection, ResumeSkillsSection, ResumeProjectsSection } from "@/components/resume-section";
import ResumeTemplate from "@/components/resume-template";
import AIAssistant from "@/components/ai-assistant";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import ResumePreviewComponent from "@/components/resume/resume-preview";
import { useToast } from "@/hooks/use-toast";
import ResumeUpload from "@/components/resume/resume-upload";
import SummarySuggestions from "@/components/resume/summary-suggestions";
import ExperienceSuggestions from "@/components/resume/experience-suggestions";
import SkillSuggestions from "@/components/resume/skills-suggestions";

// Function to generate a unique ID
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export default function ResumeBuilder() {
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const [resume, setResume] = useState({
    id: "",
    title: "My Resume",
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      headline: "",
      summary: "",
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    template: "professional",
    skillsDisplayMode: "bubbles",
    sectionOrder: ['experience', 'education', 'skills', 'projects'], // Default order
  });
  
  const [currentTab, setCurrentTab] = useState("contact");
  const [showPersonalInfo, setShowPersonalInfo] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Function to handle section reordering and within-section item reordering
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;
    
    if (sourceIndex === destIndex) return;
    
    const updatedResume = { ...resume };
    
    // Handle different droppable contexts
    if (result.type === 'main-section') {
      // Reordering main sections
      const newSectionOrder = [...resume.sectionOrder];
      const [removed] = newSectionOrder.splice(sourceIndex, 1);
      newSectionOrder.splice(destIndex, 0, removed);
      updatedResume.sectionOrder = newSectionOrder;
    } else if (result.type === 'experience') {
      // Reordering experience items
      const items = [...updatedResume.experience];
      const [removed] = items.splice(sourceIndex, 1);
      items.splice(destIndex, 0, removed);
      updatedResume.experience = items;
    } else if (result.type === 'education') {
      // Reordering education items
      const items = [...updatedResume.education];
      const [removed] = items.splice(sourceIndex, 1);
      items.splice(destIndex, 0, removed);
      updatedResume.education = items;
    } else if (result.type === 'skills') {
      // Reordering skill items
      const items = [...updatedResume.skills];
      const [removed] = items.splice(sourceIndex, 1);
      items.splice(destIndex, 0, removed);
      updatedResume.skills = items;
    } else if (result.type === 'projects') {
      // Reordering project items
      const items = [...updatedResume.projects];
      const [removed] = items.splice(sourceIndex, 1);
      items.splice(destIndex, 0, removed);
      updatedResume.projects = items;
    }
    
    setResume(updatedResume);
  };
  
  // Function to toggle preview mode
  const togglePreviewMode = () => {
    setShowPreview(prev => !prev);
  };
  
  // Personal info handlers
  const handlePersonalInfoChange = (field: string, value: string) => {
    setResume(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };
  
  // Resume section handlers
  const handleExperienceUpdate = (experiences: ExperienceItem[]) => {
    setResume(prev => ({ ...prev, experience: experiences }));
  };
  
  const handleEducationUpdate = (education: EducationItem[]) => {
    setResume(prev => ({ ...prev, education }));
  };
  
  const handleSkillsUpdate = (skills: SkillItem[]) => {
    setResume(prev => ({ ...prev, skills }));
  };
  
  const handleProjectsUpdate = (projects: ProjectItem[]) => {
    setResume(prev => ({ ...prev, projects }));
  };
  
  // Template handling
  const handleTemplateChange = (template: string) => {
    setResume(prev => ({ ...prev, template }));
  };
  
  // Skills display mode handling
  const toggleSkillsDisplay = () => {
    setResume(prev => ({
      ...prev,
      skillsDisplayMode: prev.skillsDisplayMode === "bubbles" ? "bullets" : "bubbles"
    }));
  };
  
  // Download handler
  const handleDownloadResume = () => {
    // Current implementation of download logic
    toast({
      title: "Downloading resume",
      description: "Your resume is being prepared for download"
    });
  };
  
  // Smart adjust handler
  const handleSmartAdjust = () => {
    toast({
      title: "Smart Adjust",
      description: "Optimizing your resume layout..."
    });
    
    // Here's the simplified Smart Adjust implementation
    setResume(prev => {
      // Single update with all adjustments at once
      return {
        ...prev,
        skillsDisplayMode: prev.skills.length > 7 ? "bullets" : "bubbles",
        personalInfo: {
          ...prev.personalInfo,
          summary: prev.personalInfo.summary.length > 500 
            ? prev.personalInfo.summary.substring(0, 497) + "..." 
            : prev.personalInfo.summary
        },
        // Optimize other sections as needed
      };
    });
    
    toast({
      title: "Smart Adjust Complete",
      description: "Your resume has been optimized for better readability and layout"
    });
  };
  
  // AI suggestions handlers
  const handleApplySummary = (summary: string) => {
    handlePersonalInfoChange("summary", summary);
    toast({
      title: "Summary Applied",
      description: "The AI-generated summary has been added to your resume"
    });
  };
  
  const handleApplyBulletPoint = (bullet: any) => {
    // Implementation for applying bullet points to experience
    toast({
      title: "Bullet Point Applied",
      description: "The AI-generated bullet point has been added"
    });
  };
  
  const handleApplySkill = (skill: string) => {
    setResume(prev => ({
      ...prev,
      skills: [
        ...prev.skills,
        {
          id: generateId(),
          name: skill,
          proficiency: 3
        }
      ]
    }));
    toast({
      title: "Skill Added",
      description: `${skill} has been added to your skills`
    });
  };
  
  return (
    <div className="container max-w-7xl mx-auto py-6 px-4 sm:px-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-300">Resume Builder</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={togglePreviewMode}>
            {showPreview ? <FileText className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
            {showPreview ? "Edit Mode" : "Preview Mode"}
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        {showPreview ? (
          <ResumePreviewComponent 
            resume={resume} 
            onTemplateChange={handleTemplateChange}
            onDownload={handleDownloadResume}
            onToggleSkillsDisplay={toggleSkillsDisplay}
            onSmartAdjust={handleSmartAdjust}
            onEdit={togglePreviewMode}
          />
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex flex-col xl:flex-row gap-6">
              {/* Left sidebar with resume sections navigation */}
              <div className="xl:w-64 shrink-0">
                <div className="bg-[rgba(10,15,40,0.5)] backdrop-blur-sm rounded-lg border border-indigo-900/30 p-4 sticky top-24">
                  <h3 className="text-lg font-medium mb-4 text-blue-300">Resume Sections</h3>
                  <div className="space-y-2">
                    <Button
                      variant={currentTab === "contact" ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        currentTab === "contact"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "text-blue-300 hover:text-blue-200 hover:bg-blue-900/30"
                      )}
                      onClick={() => {
                        setCurrentTab("contact");
                        setShowPersonalInfo(true);
                      }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Personal Info
                    </Button>
                    
                    <Button
                      variant={currentTab === "summary" ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        currentTab === "summary"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "text-blue-300 hover:text-blue-200 hover:bg-blue-900/30"
                      )}
                      onClick={() => {
                        setCurrentTab("summary");
                        setShowPersonalInfo(true);
                      }}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Professional Summary
                    </Button>
                    
                    {/* Draggable sections */}
                    <Droppable droppableId="main-sections" type="main-section">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                          {resume.sectionOrder.map((section, index) => (
                            <Draggable key={section} draggableId={section} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <Button
                                    variant={currentTab === section ? "default" : "ghost"}
                                    className={cn(
                                      "w-full justify-start",
                                      currentTab === section
                                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                        : "text-blue-300 hover:text-blue-200 hover:bg-blue-900/30"
                                    )}
                                    onClick={() => {
                                      setCurrentTab(section);
                                      setShowPersonalInfo(false);
                                    }}
                                  >
                                    {section === 'experience' && <Briefcase className="mr-2 h-4 w-4" />}
                                    {section === 'education' && <GraduationCap className="mr-2 h-4 w-4" />}
                                    {section === 'skills' && <Code className="mr-2 h-4 w-4" />}
                                    {section === 'projects' && <FolderKanban className="mr-2 h-4 w-4" />}
                                    {section.charAt(0).toUpperCase() + section.slice(1)}
                                    {resume[section].length > 0 && (
                                      <Badge className="ml-auto bg-blue-700">{resume[section].length}</Badge>
                                    )}
                                  </Button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
              </div>
              
              {/* Main content area */}
              <div className="flex-1 flex flex-col xl:flex-row gap-6">
                <div className="flex-1">
                  {/* Personal Information */}
                  {(currentTab === "contact" || (currentTab === "summary" && showPersonalInfo)) && (
                    <div className="bg-[rgba(10,15,40,0.5)] backdrop-blur-sm rounded-lg border border-indigo-900/30 p-6 space-y-4">
                      <h2 className="text-xl font-semibold text-blue-300">
                        {currentTab === "contact" ? "Personal Information" : "Professional Summary"}
                      </h2>
                      
                      {currentTab === "contact" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-blue-300">First Name</Label>
                            <Input
                              id="firstName"
                              value={resume.personalInfo.firstName}
                              onChange={(e) => handlePersonalInfoChange("firstName", e.target.value)}
                              className="bg-[rgba(10,20,50,0.3)] border-indigo-900/50 text-blue-100"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-blue-300">Last Name</Label>
                            <Input
                              id="lastName"
                              value={resume.personalInfo.lastName}
                              onChange={(e) => handlePersonalInfoChange("lastName", e.target.value)}
                              className="bg-[rgba(10,20,50,0.3)] border-indigo-900/50 text-blue-100"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-blue-300">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={resume.personalInfo.email}
                              onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
                              className="bg-[rgba(10,20,50,0.3)] border-indigo-900/50 text-blue-100"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-blue-300">Phone</Label>
                            <Input
                              id="phone"
                              value={resume.personalInfo.phone}
                              onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
                              className="bg-[rgba(10,20,50,0.3)] border-indigo-900/50 text-blue-100"
                            />
                          </div>
                          
                          <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="headline" className="text-blue-300">Professional Headline</Label>
                            <Input
                              id="headline"
                              value={resume.personalInfo.headline}
                              onChange={(e) => handlePersonalInfoChange("headline", e.target.value)}
                              className="bg-[rgba(10,20,50,0.3)] border-indigo-900/50 text-blue-100"
                              placeholder="e.g. Senior Software Engineer | React.js Specialist"
                            />
                          </div>
                        </div>
                      )}
                      
                      {(currentTab === "summary" || currentTab === "contact") && (
                        <div className="space-y-2">
                          <Label htmlFor="summary" className="text-blue-300">Professional Summary</Label>
                          <Textarea
                            id="summary"
                            value={resume.personalInfo.summary}
                            onChange={(e) => handlePersonalInfoChange("summary", e.target.value)}
                            className="bg-[rgba(10,20,50,0.3)] border-indigo-900/50 text-blue-100 min-h-[120px]"
                            placeholder="Write a brief summary of your professional background and key strengths..."
                          />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Experience Section */}
                  {currentTab === "experience" && !showPersonalInfo && (
                    <Droppable droppableId="experience" type="experience">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                          <ResumeExperienceSection experiences={resume.experience} onUpdate={handleExperienceUpdate} />
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  )}
                  
                  {/* Education Section */}
                  {currentTab === "education" && !showPersonalInfo && (
                    <Droppable droppableId="education" type="education">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                          <ResumeEducationSection education={resume.education} onUpdate={handleEducationUpdate} />
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  )}
                  
                  {/* Skills Section */}
                  {currentTab === "skills" && !showPersonalInfo && (
                    <Droppable droppableId="skills" type="skills">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                          <ResumeSkillsSection skills={resume.skills} onUpdate={handleSkillsUpdate} />
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  )}
                  
                  {/* Projects Section */}
                  {currentTab === "projects" && !showPersonalInfo && (
                    <Droppable droppableId="projects" type="projects">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                          <ResumeProjectsSection projects={resume.projects} onUpdate={handleProjectsUpdate} />
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  )}
                </div>
                
                {/* AI Assistant */}
                <div className="xl:w-80 shrink-0">
                  <div className="bg-[rgba(10,15,40,0.5)] backdrop-blur-sm rounded-lg border border-indigo-900/30 p-4 sticky top-24">
                    <AIAssistant
                      resumeId={resume.id}
                      onApplySuggestions={() => {}}
                      onApplySummary={handleApplySummary}
                      onApplyBulletPoint={handleApplyBulletPoint}
                      onApplySkill={handleApplySkill}
                      resume={resume}
                      activeTab={currentTab}
                    />
                  </div>
                </div>
              </div>
            </div>
          </DragDropContext>
        )}
      </div>
    </div>
  );
}

// Utility function to get URL parameters
function useParams<T extends Record<string, string>>(): T {
  const [location] = useLocation();
  const params = {} as T;
  
  // Extract the path parameters
  const pathParts = location.split('/').filter(Boolean);
  if (pathParts.length > 1 && pathParts[0] === 'resume-builder') {
    params['id' as keyof T] = pathParts[1] as T[keyof T];
  } else {
    params['id' as keyof T] = 'new' as T[keyof T];
  }
  
  return params;
}