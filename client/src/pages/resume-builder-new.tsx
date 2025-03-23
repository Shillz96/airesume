import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2, X, ChevronDown, ChevronUp, Save, Download, PenSquare, Star, Plus, Trash, FilePlus, Bot, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import PageHeader from "@/features/layout/components/PageHeader";

// Import from new organized structure
import { Button } from "@/ui/core/Button";
import { useResumeData } from "@/features/resume/hooks/useResumeData";
import { Resume } from "@/features/resume/types";
import { 
  ResumeExperienceSection, 
  ResumeEducationSection, 
  ResumeSkillsSection, 
  ResumeProjectsSection,
  ResumeContactSection,
  ResumeSummarySection
} from "@/features/resume/components/ResumeSections";
import ResumeTemplate from "@/features/resume/components/ResumeTemplate"; // Now using feature-based import

/**
 * New and improved Resume Builder that connects to our new component organization
 * This version properly links to our feature-organized components and types
 */
export default function ResumeBuilderNew() {
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
      <div className="page-container">
        <PageHeader
          title="Resume Builder"
          subtitle="Create and customize your professional resume"
          actions={
            <div className="flex items-center gap-3">
              <button
                className="btn btn-outline hidden sm:flex items-center"
                disabled={!isDirty}
                onClick={handleSaveResume}
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </button>
              <button 
                className="btn btn-primary hidden sm:flex items-center"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
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

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <Tabs 
              defaultValue="contact" 
              value={activeSection}
              onValueChange={setActiveSection}
              className="w-full"
            >
              <TabsList className="mb-6 flex flex-wrap h-auto bg-black/30 border border-white/10 rounded-lg w-full gap-0">
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

              <TabsContent value="contact">
                <div className="card">
                  <ResumeContactSection
                    personalInfo={resume.personalInfo}
                    title={resume.title}
                    onUpdatePersonalInfo={updatePersonalInfo}
                    onUpdateTitle={updateResumeTitle}
                  />
                </div>
              </TabsContent>

              <TabsContent value="summary">
                <div className="card">
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
                <div className="card">
                  <ResumeExperienceSection
                    experiences={resume.experience}
                    onUpdate={updateExperienceList}
                  />
                </div>
              </TabsContent>

              <TabsContent value="education">
                <div className="card">
                  <ResumeEducationSection
                    education={resume.education}
                    onUpdate={updateEducationList}
                  />
                </div>
              </TabsContent>

              <TabsContent value="skills">
                <div className="card">
                  <ResumeSkillsSection
                    skills={resume.skills}
                    onUpdate={updateSkillsList}
                  />
                </div>
              </TabsContent>

              <TabsContent value="projects">
                <div className="card">
                  <ResumeProjectsSection
                    projects={resume.projects}
                    onUpdate={updateProjectsList}
                  />
                </div>
              </TabsContent>

              <TabsContent value="preview">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Resume Preview</h3>
                    <div className="card-description">
                      See how your resume looks and download the final version.
                    </div>
                  </div>
                  <div className="card-content">
                    <ResumeTemplate 
                      resume={resume} 
                      onDownload={handleDownload}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - Temporary placeholder for AI Assistant */}
          <div className="w-full lg:w-80">
            <div className="sticky top-6">
              <div className="card">
                <div className="card-header">
                  <div className="flex items-center">
                    <Bot className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="card-title">AI Assistant</h3>
                  </div>
                </div>
                
                <div className="card-content">
                  <p className="mb-4">
                    Getting intelligent suggestions for your resume...
                  </p>
                  
                  <div className="flex justify-center my-6">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary opacity-50" />
                  </div>
                  
                  <div className="text-xs text-muted text-center">
                    The AI Assistant feature is being migrated to the new component structure. 
                    It will be available soon!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}