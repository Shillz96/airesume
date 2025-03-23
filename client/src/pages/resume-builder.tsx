import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2, X, ChevronDown, ChevronUp, Save, Download, PenSquare, Star, Plus, Trash, FilePlus, Bot, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Resume, useResumeData } from "@/hooks/use-resume-data";
import { useTheme } from "@/contexts/ThemeContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CosmicButton } from "@/components/cosmic-button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ResumeAIAssistant } from "@/components/resume/ResumeAIAssistant";

import PageHeader from "@/features/layout/components/PageHeader";
import { 
  ResumeExperienceSection, 
  ResumeEducationSection, 
  ResumeSkillsSection, 
  ResumeProjectsSection,
  ResumeContactSection,
  ResumeSummarySection
} from "@/components/resume-section";
import ResumeTemplate from "@/components/resume-template";

// Function component
export default function ResumeBuilder() {
  // States for resume data and UI controls
  const [activeSection, setActiveSection] = useState<string>("contact");
  const [skillSearchQuery, setSkillSearchQuery] = useState<string>("");
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
  
  // Clear local state when active section changes, AI assistant handles its own state
  useEffect(() => {
    // Clear any local state if needed
    setSkillSearchQuery('');
  }, [activeSection]);

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
  
  // Function to apply a suggestion from the AI Assistant to the resume
  const applySuggestion = (suggestion: string) => {
    if (activeSection === "summary") {
      // Update the summary field
      updatePersonalInfo({
        ...resume.personalInfo,
        summary: suggestion
      });
      
      toast({
        title: "Summary updated",
        description: "Your professional summary has been updated with the AI suggestion."
      });
    } else if (activeSection === "experience") {
      // Check if we have any existing experience to update
      if (resume.experience.length > 0) {
        // Update the most recent experience description
        const updatedExperience = [...resume.experience];
        const latestExp = {...updatedExperience[0]};
        latestExp.description = suggestion;
        updatedExperience[0] = latestExp;
        
        updateExperienceList(updatedExperience);
        
        toast({
          title: "Experience updated",
          description: "Your most recent experience has been updated with the AI suggestion."
        });
      } else {
        // Create a new experience entry
        const newExp = {
          id: `exp-${Date.now()}`,
          title: "Position Title",
          company: "Company Name",
          startDate: "Jan 2023",
          endDate: "Present",
          description: suggestion
        };
        
        addExperience();
        
        // Need to use setTimeout because addExperience is async
        setTimeout(() => {
          const updatedExperience = [{...newExp}, ...resume.experience];
          updateExperienceList(updatedExperience);
        }, 100);
        
        toast({
          title: "Experience added",
          description: "A new experience entry has been created with the AI suggestion."
        });
      }
    } else if (activeSection === "skills") {
      // Add as a skill
      const newSkill = {
        id: `skill-${Date.now()}`,
        name: suggestion,
        proficiency: 80
      };
      
      // Check if skill already exists to avoid duplicates
      const skillExists = resume.skills.some(
        skill => skill.name.toLowerCase() === suggestion.toLowerCase()
      );
      
      if (skillExists) {
        toast({
          title: "Skill already exists",
          description: `${suggestion} is already in your skills list.`,
          variant: "destructive"
        });
        return;
      }
      
      updateSkillsList([...resume.skills, newSkill]);
      
      toast({
        title: "Skill added",
        description: `"${suggestion}" has been added to your skills.`
      });
    } else if (activeSection === "education") {
      // For education, we'll update the description of the most recent education
      if (resume.education.length > 0) {
        const updatedEducation = [...resume.education];
        const latestEdu = {...updatedEducation[0]};
        latestEdu.description = suggestion;
        updatedEducation[0] = latestEdu;
        
        updateEducationList(updatedEducation);
        
        toast({
          title: "Education updated",
          description: "Your most recent education entry has been updated with the AI suggestion."
        });
      } else {
        toast({
          title: "No education entries",
          description: "Please add an education entry first.",
          variant: "destructive"
        });
      }
    } else if (activeSection === "projects") {
      // For projects, we'll update the description of the most recent project
      if (resume.projects.length > 0) {
        const updatedProjects = [...resume.projects];
        const latestProject = {...updatedProjects[0]};
        latestProject.description = suggestion;
        updatedProjects[0] = latestProject;
        
        updateProjectsList(updatedProjects);
        
        toast({
          title: "Project updated",
          description: "Your most recent project has been updated with the AI suggestion."
        });
      } else {
        // Create a new project
        const newProject = {
          id: `proj-${Date.now()}`,
          title: "Project Title",
          description: suggestion,
          technologies: ["React", "TypeScript", "Node.js"],
          link: ""
        };
        
        updateProjectsList([...resume.projects, newProject]);
        
        toast({
          title: "Project added",
          description: "A new project has been created with the AI suggestion."
        });
      }
    }
  };

  return (
    <>
      {/* Using global CosmicBackground from App.tsx */}
      <div className="container mx-auto px-2 sm:px-6 pb-8 pt-3 min-h-screen relative z-10">
        <PageHeader
          title="Resume Builder"
          subtitle="Create and customize your professional resume"
          className="py-4 mb-2 sm:mb-4"
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="hidden sm:flex"
                disabled={!isDirty}
                onClick={handleSaveResume}
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button 
                variant="default"
                className="hidden sm:flex"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="sm:hidden h-9 w-9 p-0">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleSaveResume} disabled={!isDirty}>
                    <Save className="mr-2 h-4 w-4" />
                    <span>Save</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    <span>Download</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          }
        />

        {/* Mobile progress indicator */}
        <div className="block lg:hidden mt-2 mb-4">
          <div className="bg-black/30 border border-white/10 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-white/90">Resume Progress</h3>
              <span className="text-xs text-primary font-medium">
                Step {['contact', 'summary', 'experience', 'education', 'skills', 'projects', 'preview'].indexOf(activeSection) + 1} of 7
              </span>
            </div>
            <div className="flex gap-1 mb-2">
              {['contact', 'summary', 'experience', 'education', 'skills', 'projects', 'preview'].map((section, index) => (
                <button 
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`group h-1.5 flex-1 rounded-full relative ${
                    section === activeSection ? 'bg-primary' : 'bg-white/20'
                  }`}
                >
                  <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap pointer-events-none">
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-white/60">
              <span className="text-[10px]">Contact Info</span>
              <span className="text-[10px]">
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
              </span>
              <span className="text-[10px]">Preview</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <Tabs 
              defaultValue="contact" 
              value={activeSection}
              onValueChange={setActiveSection}
              className="w-full"
            >
              {/* Desktop tabs list */}
              <TabsList className="mb-6 hidden md:flex flex-wrap h-auto bg-black/30 border border-white/10 rounded-lg w-full gap-0">
                <TabsTrigger 
                  value="contact" 
                  className="py-2 text-sm font-medium text-white/70 transition-all rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-white"
                >
                  Contact
                </TabsTrigger>
                <TabsTrigger 
                  value="summary" 
                  className="py-2 text-sm font-medium text-white/70 transition-all rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-white"
                >
                  Summary
                </TabsTrigger>
                <TabsTrigger 
                  value="experience" 
                  className="py-2 text-sm font-medium text-white/70 transition-all rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-white"
                >
                  Experience
                </TabsTrigger>
                <TabsTrigger 
                  value="education" 
                  className="py-2 text-sm font-medium text-white/70 transition-all rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-white"
                >
                  Education
                </TabsTrigger>
                <TabsTrigger 
                  value="skills" 
                  className="py-2 text-sm font-medium text-white/70 transition-all rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-white"
                >
                  Skills
                </TabsTrigger>
                <TabsTrigger 
                  value="projects" 
                  className="py-2 text-sm font-medium text-white/70 transition-all rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-white"
                >
                  Projects
                </TabsTrigger>
                <TabsTrigger 
                  value="preview" 
                  className="py-2 text-sm font-medium text-white/70 transition-all rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-white"
                >
                  Preview
                </TabsTrigger>
              </TabsList>
              
              {/* Mobile tabs - optimized for touch */}
              <div className="md:hidden mb-4 flex overflow-x-auto scrollbar-none -mx-2 px-2 pb-1">
                {['contact', 'summary', 'experience', 'education', 'skills', 'projects', 'preview'].map((section) => (
                  <button
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={`py-2 px-4 mr-2 text-sm font-medium whitespace-nowrap rounded-full flex-shrink-0 transition-colors ${
                      section === activeSection
                        ? 'bg-primary text-white'
                        : 'bg-black/30 text-white/70 border border-white/10'
                    }`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                ))}
              </div>

              <TabsContent value="contact">
                <div className="bg-black/30 border border-white/10 rounded-md p-3 sm:p-6">
                  <ResumeContactSection
                    personalInfo={resume.personalInfo}
                    title={resume.title}
                    onUpdatePersonalInfo={updatePersonalInfo}
                    onUpdateTitle={updateResumeTitle}
                  />
                </div>
              </TabsContent>

              <TabsContent value="summary">
                <div className="bg-black/30 border border-white/10 rounded-md p-3 sm:p-6">
                  <ResumeSummarySection
                    summary={resume.personalInfo.summary}
                    onUpdateSummary={(summary) => updatePersonalInfo({
                      ...resume.personalInfo,
                      summary
                    })}
                  />
                </div>
              </TabsContent>

              <TabsContent value="experience">
                <div className="bg-black/30 border border-white/10 rounded-md p-3 sm:p-6">
                  <ResumeExperienceSection
                    experiences={resume.experience}
                    onUpdate={updateExperienceList}
                  />
                </div>
              </TabsContent>

              <TabsContent value="education">
                <div className="bg-black/30 border border-white/10 rounded-md p-3 sm:p-6">
                  <ResumeEducationSection
                    education={resume.education}
                    onUpdate={updateEducationList}
                  />
                </div>
              </TabsContent>

              <TabsContent value="skills">
                <div className="bg-black/30 border border-white/10 rounded-md p-3 sm:p-6">
                  <ResumeSkillsSection
                    skills={resume.skills}
                    onUpdate={updateSkillsList}
                  />
                </div>
              </TabsContent>

              <TabsContent value="projects">
                <div className="bg-black/30 border border-white/10 rounded-md p-3 sm:p-6">
                  <ResumeProjectsSection
                    projects={resume.projects}
                    onUpdate={updateProjectsList}
                  />
                </div>
              </TabsContent>

              <TabsContent value="preview">
                <div className="bg-black/30 border border-white/10 rounded-md p-3 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-medium text-foreground mb-1 sm:mb-3">Resume Preview</h3>
                  <p className="text-muted-foreground mb-2 sm:mb-4 text-xs sm:text-sm">
                    See how your resume looks and download the final version.
                  </p>
                  <div className="mt-2">
                    <ResumeTemplate 
                      resume={resume} 
                      onDownload={handleDownload}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Mobile quick actions bar - only show on small screens */}
          <div className="block lg:hidden sticky bottom-4 left-0 right-0 z-30 mt-4 mb-2">
            <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-4 py-3 flex justify-between items-center shadow-xl">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 rounded-full bg-white/10"
                  onClick={handleSaveResume}
                  disabled={!isDirty}
                >
                  <Save size={18} />
                </Button>
                <Button 
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 rounded-full bg-white/10"
                  onClick={handleDownload}
                >
                  <Download size={18} />
                </Button>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="default"
                  size="sm"
                  className="rounded-full"
                  onClick={() => {
                    // Scroll to AI assistant on mobile
                    document.getElementById('mobile-ai-assistant')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Bot size={16} className="mr-2" />
                  AI Help
                </Button>
                {activeSection !== 'preview' ? (
                  <Button
                    variant="default"
                    size="sm"
                    className="rounded-full"
                    onClick={() => setActiveSection('preview')}
                  >
                    Preview
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => setActiveSection('contact')}
                  >
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Sidebar - AI Assistant (desktop) */}
          <div className="hidden lg:block lg:w-80">
            <div className="sticky top-6">
              <div className="bg-black/30 border border-white/10 rounded-md p-6 overflow-hidden">
                <ResumeAIAssistant 
                  activeSection={activeSection}
                  skillSearchQuery={skillSearchQuery}
                  setSkillSearchQuery={setSkillSearchQuery}
                  onApplySuggestion={applySuggestion}
                  resumeId={resume?.id}
                />
              </div>
            </div>
          </div>
          
          {/* Mobile AI Assistant (separate section at bottom) */}
          <div id="mobile-ai-assistant" className="block lg:hidden w-full mt-6 pt-6 border-t border-white/10">
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Bot size={18} className="mr-2" /> AI Resume Assistant
            </h3>
            <div className="bg-black/30 border border-white/10 rounded-md p-3 sm:p-4 overflow-hidden">
              <div className="mb-2 text-sm text-white/80">
                Based on your current section: <span className="font-medium text-primary">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</span>
              </div>
              <ResumeAIAssistant 
                activeSection={activeSection}
                skillSearchQuery={skillSearchQuery}
                setSkillSearchQuery={setSkillSearchQuery}
                onApplySuggestion={applySuggestion}
                resumeId={resume?.id}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}