import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2, X, ChevronDown, ChevronUp, Save, Download, PenSquare, Star, Plus, Trash, FilePlus, Bot, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Resume, useResumeData } from "@/hooks/use-resume-data";
import { useTheme } from "@/contexts/ThemeContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ResumeAIAssistant } from "@/components/resume/ResumeAIAssistant";

import PageHeader from "@/components/page-header";
import { 
  ResumeExperienceSection, 
  ResumeEducationSection, 
  ResumeSkillsSection, 
  ResumeProjectsSection 
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
    <div className="container pb-10">
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
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hidden sm:flex hover:from-blue-700 hover:to-purple-700"
              onClick={handleDownload}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="sm:hidden">
                  <ChevronDown className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Options</span>
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

      <div className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs 
              defaultValue="contact" 
              value={activeSection}
              onValueChange={setActiveSection}
              className="w-full"
            >
              <TabsList className="mb-4 flex flex-wrap h-auto">
                <TabsTrigger value="contact" className="py-2">
                  Contact
                </TabsTrigger>
                <TabsTrigger value="summary" className="py-2">
                  Summary
                </TabsTrigger>
                <TabsTrigger value="experience" className="py-2">
                  Experience
                </TabsTrigger>
                <TabsTrigger value="education" className="py-2">
                  Education
                </TabsTrigger>
                <TabsTrigger value="skills" className="py-2">
                  Skills
                </TabsTrigger>
                <TabsTrigger value="projects" className="py-2">
                  Projects
                </TabsTrigger>
                <TabsTrigger value="preview" className="py-2">
                  Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="contact">
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Contact Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="title" className="text-sm font-medium">Resume Title</label>
                      <input 
                        type="text"
                        id="title"
                        value={resume.title}
                        onChange={(e) => updateResumeTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Software Engineer Resume"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                      <input 
                        type="text"
                        id="firstName"
                        value={resume.personalInfo.firstName}
                        onChange={(e) => updatePersonalInfo({
                          ...resume.personalInfo,
                          firstName: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                      <input 
                        type="text"
                        id="lastName"
                        value={resume.personalInfo.lastName}
                        onChange={(e) => updatePersonalInfo({
                          ...resume.personalInfo,
                          lastName: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email</label>
                      <input 
                        type="email"
                        id="email"
                        value={resume.personalInfo.email}
                        onChange={(e) => updatePersonalInfo({
                          ...resume.personalInfo,
                          email: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="johndoe@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                      <input 
                        type="text"
                        id="phone"
                        value={resume.personalInfo.phone}
                        onChange={(e) => updatePersonalInfo({
                          ...resume.personalInfo,
                          phone: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="(123) 456-7890"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="headline" className="text-sm font-medium">Professional Headline</label>
                    <input 
                      type="text"
                      id="headline"
                      value={resume.personalInfo.headline}
                      onChange={(e) => updatePersonalInfo({
                        ...resume.personalInfo,
                        headline: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Senior Software Engineer | Full Stack Developer | Tech Lead"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="summary" className="text-sm font-medium">Professional Summary</label>
                    <textarea 
                      id="summary"
                      value={resume.personalInfo.summary}
                      onChange={(e) => updatePersonalInfo({
                        ...resume.personalInfo,
                        summary: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                      placeholder="Write a short summary of your skills and experience..."
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="summary">
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Professional Summary</h2>
                  <p className="text-gray-600">
                    Write a compelling summary that highlights your skills, experience, and achievements.
                  </p>
                  
                  <div className="space-y-2">
                    <label htmlFor="summary" className="text-sm font-medium">Professional Summary</label>
                    <textarea 
                      id="summaryFull"
                      value={resume.personalInfo.summary}
                      onChange={(e) => updatePersonalInfo({
                        ...resume.personalInfo,
                        summary: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[250px]"
                      placeholder="Write a short summary of your skills and experience..."
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="experience">
                <ResumeExperienceSection
                  experiences={resume.experience}
                  onUpdate={updateExperienceList}
                />
              </TabsContent>

              <TabsContent value="education">
                <ResumeEducationSection
                  education={resume.education}
                  onUpdate={updateEducationList}
                />
              </TabsContent>

              <TabsContent value="skills">
                <ResumeSkillsSection
                  skills={resume.skills}
                  onUpdate={updateSkillsList}
                />
              </TabsContent>

              <TabsContent value="projects">
                <ResumeProjectsSection
                  projects={resume.projects}
                  onUpdate={updateProjectsList}
                />
              </TabsContent>

              <TabsContent value="preview" className="px-0">
                <ResumeTemplate 
                  resume={resume} 
                  onTemplateChange={updateResumeTemplate}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - AI Assistant - Fixed to the screen */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="fixed top-24 right-10 w-72">
              <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-5 shadow-lg">
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
    </div>
  );
}