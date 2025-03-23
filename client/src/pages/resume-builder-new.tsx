import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Loader2, X, ChevronDown, ChevronUp, Save, Download, PenSquare, Star, Plus, Trash, FilePlus, Bot, RefreshCw, Upload, FileUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { UnifiedPageHeader, UnifiedContainer } from "@/components/unified";

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
import CareerPathDetection from "@/features/career/components/CareerPathDetection";
import { CareerSpecificAdvice, CareerPath } from "@/features/career/types";

/**
 * New and improved Resume Builder that connects to our new component organization
 * This version properly links to our feature-organized components and types
 */
export default function ResumeBuilderNew() {
  // States for resume data and UI controls
  const [activeSection, setActiveSection] = useState<string>("contact");
  const [skillSearchQuery, setSkillSearchQuery] = useState<string>("");
  const [detectedCareerPath, setDetectedCareerPath] = useState<CareerPath | null>(null);
  const [careerAdvice, setCareerAdvice] = useState<CareerSpecificAdvice | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
  
  // Handle career advice received from the CareerPathDetection component
  const handleCareerAdviceReceived = (careerPath: CareerPath, advice: CareerSpecificAdvice) => {
    setDetectedCareerPath(careerPath);
    setCareerAdvice(advice);
    
    // Show a toast notification about the detected career path
    toast({
      title: "Career Path Detected",
      description: `Your resume matches the ${careerPath.replace('_', ' ')} career path. Career-specific advice has been generated.`,
    });
    
    // You could also apply suggestions based on the career path
    if (advice.suggestedSkills.length > 0 && activeSection === 'skills') {
      // Suggest adding first skill from career advice
      applySuggestion(advice.suggestedSkills[0]);
    }
  };

  // Function to handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
      'application/msword', // doc
      'text/plain' // txt
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOCX, DOC, or TXT file.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Create FormData to send the file
      const formData = new FormData();
      formData.append('file', file);
      
      // Send the file to the server
      const response = await fetch('/api/resumes/parse', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to parse resume');
      }
      
      // Parse the response data
      const parsedResume = await response.json();
      
      // If the response contains an error message, show it
      if (parsedResume.error) {
        toast({
          title: "Error parsing resume",
          description: parsedResume.error,
          variant: "destructive"
        });
        return;
      }
      
      // Check if the resume was successfully parsed
      if (parsedResume.success && parsedResume.data) {
        // Create a new resume object with the parsed data
        const resumeData = parsedResume.data;
        const newResume = {
          ...resume,
          title: resumeData.title || 'My Resume',
          personalInfo: {
            ...resume.personalInfo,
            firstName: resumeData.personalInfo?.firstName || resume.personalInfo.firstName,
            lastName: resumeData.personalInfo?.lastName || resume.personalInfo.lastName,
            email: resumeData.personalInfo?.email || resume.personalInfo.email,
            phone: resumeData.personalInfo?.phone || resume.personalInfo.phone,
            headline: resumeData.personalInfo?.headline || resume.personalInfo.headline,
            summary: resumeData.personalInfo?.summary || resume.personalInfo.summary
          }
        };
        
        // Update experience, education, skills if they exist in parsed data
        if (resumeData.experience && resumeData.experience.length > 0) {
          newResume.experience = resumeData.experience.map((exp: any) => ({
            id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            title: exp.title || 'Position Title',
            company: exp.company || 'Company Name',
            startDate: exp.startDate || 'Jan 2023',
            endDate: exp.endDate || 'Present',
            description: exp.description || ''
          }));
        }
        
        if (resumeData.education && resumeData.education.length > 0) {
          newResume.education = resumeData.education.map((edu: any) => ({
            id: `edu-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            degree: edu.degree || 'Degree',
            institution: edu.institution || 'Institution Name',
            startDate: edu.startDate || 'Jan 2020',
            endDate: edu.endDate || 'Dec 2023',
            description: edu.description || ''
          }));
        }
        
        if (resumeData.skills && resumeData.skills.length > 0) {
          newResume.skills = resumeData.skills.map((skill: any) => ({
            id: `skill-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            name: typeof skill === 'string' ? skill : skill.name || 'Skill',
            proficiency: typeof skill === 'object' && skill.proficiency ? skill.proficiency : 80
          }));
        }
        
        // Show warning if any was returned from server
        if (parsedResume.warning) {
          toast({
            title: "Resume parsed with limitations",
            description: parsedResume.warning
            // Using default variant since warning is not defined
          });
        }
        
        // Update the resume state
        updateResume(newResume);
        
        toast({
          title: "Resume uploaded successfully",
          description: "Your resume has been parsed and the data has been filled in.",
        });
        
        // Close the dialog
        setUploadDialogOpen(false);
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast({
        title: "Error uploading resume",
        description: "There was an error parsing your resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

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
      <UnifiedContainer className="min-h-screen pb-10">
        <UnifiedPageHeader
          title="Resume Builder"
          subtitle="Create and customize your professional resume"
          variant="cosmic"
          borderStyle="gradient"
          actions={
            <div className="flex items-center gap-3">
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <button
                    className="btn btn-outline hidden sm:flex items-center cosmic-gradient-border"
                    onClick={() => setUploadDialogOpen(true)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Resume</DialogTitle>
                    <DialogDescription>
                      Upload an existing resume file to auto-fill your resume information.
                      We support PDF, DOCX, DOC, and TXT formats.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="flex flex-col items-center justify-center w-full">
                      <label
                        htmlFor="resume-file"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FileUp className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PDF, DOCX, DOC, or TXT (max. 10MB)
                          </p>
                        </div>
                        <input
                          id="resume-file"
                          type="file"
                          className="hidden"
                          accept=".pdf,.docx,.doc,.txt"
                          onChange={handleFileUpload}
                          ref={fileInputRef}
                        />
                      </label>
                    </div>
                    {isUploading && (
                      <div className="mt-4 flex items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        <span>Uploading and parsing resume...</span>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setUploadDialogOpen(false)}
                      disabled={isUploading}
                    >
                      Cancel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
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
                  <DropdownMenuItem onClick={() => setUploadDialogOpen(true)}>
                    <Upload className="mr-2 h-4 w-4" />
                    <span>Upload</span>
                  </DropdownMenuItem>
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
                      See how your resume looks with our advanced preview features. Use smart adjust to optimize spacing.
                    </div>
                  </div>
                  <div className="card-content">
                    <ResumeTemplate 
                      resume={resume} 
                      onDownload={handleDownload}
                      editable={true}
                      onResumeEdit={(field, value) => {
                        // Handle direct edits to resume fields
                        const [section, fieldName] = field.split('.');
                        
                        if (section === 'personalInfo') {
                          updatePersonalInfo({
                            ...resume.personalInfo,
                            [fieldName]: value
                          });
                        } else if (section === 'experience' && resume.experience.length > 0) {
                          // For simplicity, update the first item
                          const updatedExperience = [...resume.experience];
                          updatedExperience[0] = {
                            ...updatedExperience[0],
                            [fieldName]: value
                          };
                          updateExperienceList(updatedExperience);
                        } else if (section === 'education' && resume.education.length > 0) {
                          const updatedEducation = [...resume.education];
                          updatedEducation[0] = {
                            ...updatedEducation[0],
                            [fieldName]: value
                          };
                          updateEducationList(updatedEducation);
                        }
                        
                        toast({
                          title: "Resume updated",
                          description: "Your changes have been applied to the resume."
                        });
                      }}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - Career Path Detection & Analysis */}
          <div className="w-full lg:w-96">
            <div className="sticky top-6">
              {/* Only show the CareerPathDetection component if we have a valid resumed saved */}
              {resume && resume.id ? (
                <CareerPathDetection 
                  resumeId={resume.id} 
                  onAdviceReceived={handleCareerAdviceReceived} 
                />
              ) : (
                <div className="card">
                  <div className="card-header">
                    <div className="flex items-center">
                      <Bot className="h-5 w-5 mr-2 text-primary" />
                      <h3 className="card-title">Career Analysis</h3>
                    </div>
                  </div>
                  
                  <div className="card-content">
                    <p className="mb-4">
                      Save your resume to get AI-powered career path detection and tailored advice.
                    </p>
                    
                    <Button 
                      onClick={handleSaveResume} 
                      disabled={!isDirty}
                      className="w-full"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Resume to Continue
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </UnifiedContainer>
    </>
  );
}