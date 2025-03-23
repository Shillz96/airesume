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

import PageHeader from "@/components/page-header";
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold cosmic-text-gradient">
              Resume Builder
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Create and customize your professional resume
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <CosmicButton
              variant="outline"
              className="hidden sm:flex"
              disabled={!isDirty}
              onClick={handleSaveResume}
              iconLeft={<Save className="h-4 w-4" />}
            >
              Save
            </CosmicButton>
            <CosmicButton 
              variant="primary"
              className="hidden sm:flex"
              withGlow
              onClick={handleDownload}
              iconLeft={<Download className="h-4 w-4" />}
            >
              Download
            </CosmicButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <CosmicButton variant="outline" className="sm:hidden" iconLeft={<ChevronDown className="h-4 w-4" />}>
                  <span className="hidden sm:inline">Options</span>
                </CosmicButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="cosmic-dropdown-content">
                <DropdownMenuItem onClick={handleSaveResume} disabled={!isDirty} className="cosmic-dropdown-item">
                  <Save className="mr-2 h-4 w-4" />
                  <span>Save</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownload} className="cosmic-dropdown-item">
                  <Download className="mr-2 h-4 w-4" />
                  <span>Download</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              <TabsList className="mb-6 flex flex-wrap h-auto bg-gray-100/80 dark:bg-gray-800/50 p-1 rounded-lg">
                <TabsTrigger 
                  value="contact" 
                  className="py-2 data-[state=active]:cosmic-tab-active"
                >
                  Contact
                </TabsTrigger>
                <TabsTrigger 
                  value="summary" 
                  className="py-2 data-[state=active]:cosmic-tab-active"
                >
                  Summary
                </TabsTrigger>
                <TabsTrigger 
                  value="experience" 
                  className="py-2 data-[state=active]:cosmic-tab-active"
                >
                  Experience
                </TabsTrigger>
                <TabsTrigger 
                  value="education" 
                  className="py-2 data-[state=active]:cosmic-tab-active"
                >
                  Education
                </TabsTrigger>
                <TabsTrigger 
                  value="skills" 
                  className="py-2 data-[state=active]:cosmic-tab-active"
                >
                  Skills
                </TabsTrigger>
                <TabsTrigger 
                  value="projects" 
                  className="py-2 data-[state=active]:cosmic-tab-active"
                >
                  Projects
                </TabsTrigger>
                <TabsTrigger 
                  value="preview" 
                  className="py-2 data-[state=active]:cosmic-tab-active"
                >
                  Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="contact">
                <div className="bg-card p-6 rounded-md border shadow-sm">
                  <ResumeContactSection
                    personalInfo={resume.personalInfo}
                    title={resume.title}
                    onUpdatePersonalInfo={updatePersonalInfo}
                    onUpdateTitle={updateResumeTitle}
                  />
                </div>
              </TabsContent>

              <TabsContent value="summary">
                <div className="bg-card p-6 rounded-md border shadow-sm">
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
                <div className="bg-card p-6 rounded-md border shadow-sm">
                  <ResumeExperienceSection
                    experiences={resume.experience}
                    onUpdate={updateExperienceList}
                  />
                </div>
              </TabsContent>

              <TabsContent value="education">
                <div className="cosmic-card p-6 backdrop-blur-sm">
                  <h2 className="text-2xl font-semibold cosmic-text-gradient mb-4">Education</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-5">
                    List your educational qualifications and academic achievements.
                  </p>
                  <ResumeEducationSection
                    education={resume.education}
                    onUpdate={updateEducationList}
                  />
                </div>
              </TabsContent>

              <TabsContent value="skills">
                <div className="cosmic-card p-6 backdrop-blur-sm">
                  <h2 className="text-2xl font-semibold cosmic-text-gradient mb-4">Skills</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-5">
                    Highlight your technical and soft skills that are relevant to your target roles.
                  </p>
                  <ResumeSkillsSection
                    skills={resume.skills}
                    onUpdate={updateSkillsList}
                  />
                </div>
              </TabsContent>

              <TabsContent value="projects">
                <div className="cosmic-card p-6 backdrop-blur-sm">
                  <h2 className="text-2xl font-semibold cosmic-text-gradient mb-4">Projects</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-5">
                    Showcase projects that demonstrate your capabilities and accomplishments.
                  </p>
                  <ResumeProjectsSection
                    projects={resume.projects}
                    onUpdate={updateProjectsList}
                  />
                </div>
              </TabsContent>

              <TabsContent value="preview">
                <div className="cosmic-card p-6 backdrop-blur-sm">
                  <h2 className="text-2xl font-semibold cosmic-text-gradient mb-4">Resume Preview</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-5">
                    See how your resume looks and select from different templates.
                  </p>
                  <div className="mt-4">
                    <ResumeTemplate 
                      resume={resume} 
                      onTemplateChange={updateResumeTemplate}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - AI Assistant */}
          <div className="w-full lg:w-80">
            <div className="sticky top-6">
              <div className="cosmic-card p-5 backdrop-blur-sm overflow-hidden">
                {/* Using our new ResumeAIAssistant component */}
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
      </div>
    </>
  );
}