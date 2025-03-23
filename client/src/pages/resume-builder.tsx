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
      <div className="container mx-auto px-4 sm:px-6 pb-10 min-h-screen relative z-10">
        <PageHeader
          title="Resume Builder"
          subtitle="Create and customize your professional resume"
          actions={
            <div className="flex items-center gap-3">
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
                  <Button variant="outline" className="sm:hidden">
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
        <div className="block lg:hidden mt-2 mb-6">
          <div className="bg-black/30 border border-white/10 rounded-lg p-4">
            <h3 className="text-sm font-medium text-white/90 mb-2">Resume Progress</h3>
            <div className="flex gap-1 mb-3">
              {['contact', 'summary', 'experience', 'education', 'skills', 'projects', 'preview'].map((section) => (
                <div 
                  key={section}
                  className={`h-1.5 flex-1 rounded-full ${
                    section === activeSection ? 'bg-primary' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-white/60">
              <span>Contact Info</span>
              <span>Preview</span>
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
              <TabsList className="mb-6 flex flex-wrap h-auto bg-black/30 border border-white/10 rounded-lg w-full gap-0 overflow-x-auto scrollbar-thin">
                <TabsTrigger 
                  value="contact" 
                  className="py-2 text-sm font-medium text-white/70 transition-all rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-white whitespace-nowrap min-w-[80px] flex-shrink-0"
                >
                  Contact
                </TabsTrigger>
                <TabsTrigger 
                  value="summary" 
                  className="py-2 text-sm font-medium text-white/70 transition-all rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-white whitespace-nowrap min-w-[80px] flex-shrink-0"
                >
                  Summary
                </TabsTrigger>
                <TabsTrigger 
                  value="experience" 
                  className="py-2 text-sm font-medium text-white/70 transition-all rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-white whitespace-nowrap min-w-[80px] flex-shrink-0"
                >
                  Experience
                </TabsTrigger>
                <TabsTrigger 
                  value="education" 
                  className="py-2 text-sm font-medium text-white/70 transition-all rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-white whitespace-nowrap min-w-[80px] flex-shrink-0"
                >
                  Education
                </TabsTrigger>
                <TabsTrigger 
                  value="skills" 
                  className="py-2 text-sm font-medium text-white/70 transition-all rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-white whitespace-nowrap min-w-[80px] flex-shrink-0"
                >
                  Skills
                </TabsTrigger>
                <TabsTrigger 
                  value="projects" 
                  className="py-2 text-sm font-medium text-white/70 transition-all rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-white whitespace-nowrap min-w-[80px] flex-shrink-0"
                >
                  Projects
                </TabsTrigger>
                <TabsTrigger 
                  value="preview" 
                  className="py-2 text-sm font-medium text-white/70 transition-all rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-white whitespace-nowrap min-w-[80px] flex-shrink-0"
                >
                  Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="contact">
                <div className="bg-black/30 border border-white/10 rounded-md p-6">
                  <ResumeContactSection
                    personalInfo={resume.personalInfo}
                    title={resume.title}
                    onUpdatePersonalInfo={updatePersonalInfo}
                    onUpdateTitle={updateResumeTitle}
                  />
                </div>
              </TabsContent>

              <TabsContent value="summary">
                <div className="bg-black/30 border border-white/10 rounded-md p-6">
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
                <div className="bg-black/30 border border-white/10 rounded-md p-6">
                  <ResumeExperienceSection
                    experiences={resume.experience}
                    onUpdate={updateExperienceList}
                  />
                </div>
              </TabsContent>

              <TabsContent value="education">
                <div className="bg-black/30 border border-white/10 rounded-md p-6">
                  <ResumeEducationSection
                    education={resume.education}
                    onUpdate={updateEducationList}
                  />
                </div>
              </TabsContent>

              <TabsContent value="skills">
                <div className="bg-black/30 border border-white/10 rounded-md p-6">
                  <ResumeSkillsSection
                    skills={resume.skills}
                    onUpdate={updateSkillsList}
                  />
                </div>
              </TabsContent>

              <TabsContent value="projects">
                <div className="bg-black/30 border border-white/10 rounded-md p-6">
                  <ResumeProjectsSection
                    projects={resume.projects}
                    onUpdate={updateProjectsList}
                  />
                </div>
              </TabsContent>

              <TabsContent value="preview">
                <div className="bg-black/30 border border-white/10 rounded-md p-6">
                  <h3 className="text-xl font-medium text-foreground mb-4">Resume Preview</h3>
                  <p className="text-muted-foreground mb-5">
                    See how your resume looks and download the final version.
                  </p>
                  <div className="mt-4">
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
          <div id="mobile-ai-assistant" className="block lg:hidden w-full mt-8 pt-8 border-t border-white/10">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Bot size={18} className="mr-2" /> AI Resume Assistant
            </h3>
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
      </div>
    </>
  );
}