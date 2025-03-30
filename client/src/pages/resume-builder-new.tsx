import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Loader2, X, ChevronDown, ChevronUp, Save, Download, PenSquare, Star, Plus, Trash, FilePlus, Bot, RefreshCw, Upload, FileUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTheme } from "@/contexts/UnifiedThemeContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import PageHeader from "@/features/layout/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, User, Briefcase, GraduationCap, Code, FolderGit2, Eye } from "lucide-react";

// Import from new organized structure
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

  // Updated function to handle file upload for storage AND parsing
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type (keep existing check)
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
      // Reset file input if invalid type
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // --- Step 1: Upload for Storage --- 
    setIsUploading(true); // Indicate general processing start
    const storageFormData = new FormData();
    storageFormData.append('file', file);

    let storedResumeInfo: { resume_id: number; storage_path: string } | null = null;
    try {
      // *** NOTE: Replace with your ACTUAL storage endpoint URL ***
      const storageResponse = await fetch('/api/users/me/resumes/upload', { 
        method: 'POST',
        body: storageFormData,
        credentials: 'include' // Important if your endpoint requires auth cookies
      });

      if (!storageResponse.ok) {
        const errorData = await storageResponse.json().catch(() => ({ detail: 'Failed to store resume file.' }));
        throw new Error(errorData.detail || 'Failed to store resume file.');
      }
      storedResumeInfo = await storageResponse.json(); // Assuming backend sends back ID and path
      toast({
        title: "Resume Stored",
        description: `Original file '${file.name}' stored successfully.`,
      });

    } catch (storageError: any) {
      console.error('Error storing resume:', storageError);
      toast({
        title: "Error Storing Resume",
        description: storageError.message || "Could not save the original resume file.",
        variant: "destructive"
      });
      setIsUploading(false); // Stop loading indicator on storage failure
       if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
      return; // Stop if storage failed
    }

    // --- Step 2: Parse for Builder Population (using the same file) --- 
    // No need to create new FormData if the file object is still valid 
    // (fetch doesn't consume it permanently unless read multiple times without reset)
    const parseFormData = new FormData();
    parseFormData.append('file', file);

    try {
      // *** NOTE: Ensure this is your CORRECT parsing endpoint URL ***
      const parseResponse = await fetch('/api/resumes/parse', { 
        method: 'POST',
        body: parseFormData, // Send file again for parsing
        credentials: 'include'
      });

      if (!parseResponse.ok) {
         // Try to get error detail from response body
         const errorData = await parseResponse.json().catch(() => ({ detail: 'Failed to parse resume for builder.'}));
         throw new Error(errorData.detail || 'Failed to parse resume for builder.');
      }

      const parsedResume = await parseResponse.json();

      if (parsedResume.error) {
        toast({
          title: "Error Parsing Resume",
          description: parsedResume.error,
          variant: "destructive"
        });
        // Note: Parse failed, but storage succeeded. Don't return fully, just skip population.
      } else if (parsedResume.success && parsedResume.data) {
        // --- Populate resume state from parsedResume.data --- 
        const resumeData = parsedResume.data;
        const newResume = {
          ...resume,
          title: resumeData.title || resume.title || 'My Resume',
          personalInfo: {
            ...resume.personalInfo,
            firstName: resumeData.personalInfo?.firstName || resume.personalInfo.firstName,
            lastName: resumeData.personalInfo?.lastName || resume.personalInfo.lastName,
            email: resumeData.personalInfo?.email || resume.personalInfo.email,
            phone: resumeData.personalInfo?.phone || resume.personalInfo.phone,
            headline: resumeData.personalInfo?.headline || resume.personalInfo.headline,
            summary: resumeData.personalInfo?.summary || resume.personalInfo.summary
          },
          // Safely map experience, education, skills, projects only if they exist
          experience: (resumeData.experience && resumeData.experience.length > 0) ? resumeData.experience.map((exp: any, index: number) => ({
            id: `exp-${Date.now()}-${index}`,
            title: exp.title || 'Position Title',
            company: exp.company || 'Company Name',
            startDate: exp.startDate || '',
            endDate: exp.endDate || '',
            description: exp.description || ''
          })) : resume.experience,
          education: (resumeData.education && resumeData.education.length > 0) ? resumeData.education.map((edu: any, index: number) => ({
            id: `edu-${Date.now()}-${index}`,
            degree: edu.degree || 'Degree',
            institution: edu.institution || 'Institution Name',
            startDate: edu.startDate || '',
            endDate: edu.endDate || '',
            description: edu.description || ''
          })) : resume.education,
          skills: (resumeData.skills && resumeData.skills.length > 0) ? resumeData.skills.map((skill: any, index: number) => ({
            id: `skill-${Date.now()}-${index}`,
            name: typeof skill === 'string' ? skill : skill.name || 'Skill',
            proficiency: typeof skill === 'object' && skill.proficiency ? skill.proficiency : 80
          })) : resume.skills,
          projects: (resumeData.projects && resumeData.projects.length > 0) ? resumeData.projects.map((proj: any, index: number) => ({
             id: `proj-${Date.now()}-${index}`,
             name: proj.name || 'Project Name',
             description: proj.description || '',
             url: proj.url || ''
          })) : resume.projects,
        };
        
        updateResume(newResume); // Update state with populated data

        if (parsedResume.warning) {
          toast({
            title: "Resume parsed with limitations",
            description: parsedResume.warning
          });
        }

        toast({
          title: "Resume Populated",
          description: "Builder fields filled from uploaded resume.",
        });
        setUploadDialogOpen(false); // Close dialog only on full success (storage + parse)
      }
    } catch (parseError: any) {
      console.error('Error parsing resume:', parseError);
      toast({
        title: "Error Parsing Resume",
        description: parseError.message || "Could not populate builder from the resume.",
        variant: "destructive",
      });
      // Don't close dialog on parse failure if storage succeeded
    } finally {
       // Set loading false and reset input only at the very end, regardless of parse outcome
       setIsUploading(false);
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
    <div className="w-full min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="AI Resume Builder"
          subtitle="Craft a professional resume with AI assistance."
          variant="gradient"
          borderStyle="gradient"
          actions={
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
              <Button variant="outline" onClick={handleSaveResume}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="default" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          }
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Resume Editor */}
          <div className="lg:col-span-8">
            <Card className="solid-card">
              <CardContent className="p-6">
                <Tabs 
                  value={activeSection} 
                  onValueChange={setActiveSection}
                  className="w-full"
                >
                  <TabsList className="solid-card mb-6">
                    <TabsTrigger 
                      value="contact"
                      className="no-blur flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Contact
                    </TabsTrigger>
                    <TabsTrigger 
                      value="summary"
                      className="no-blur flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Summary
                    </TabsTrigger>
                    <TabsTrigger 
                      value="experience"
                      className="no-blur flex items-center gap-2"
                    >
                      <Briefcase className="w-4 h-4" />
                      Experience
                    </TabsTrigger>
                    <TabsTrigger 
                      value="education"
                      className="no-blur flex items-center gap-2"
                    >
                      <GraduationCap className="w-4 h-4" />
                      Education
                    </TabsTrigger>
                    <TabsTrigger 
                      value="skills"
                      className="no-blur flex items-center gap-2"
                    >
                      <Code className="w-4 h-4" />
                      Skills
                    </TabsTrigger>
                    <TabsTrigger 
                      value="projects"
                      className="no-blur flex items-center gap-2"
                    >
                      <FolderGit2 className="w-4 h-4" />
                      Projects
                    </TabsTrigger>
                    <TabsTrigger 
                      value="preview"
                      className="no-blur flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="contact">
                    <Card className="solid-card">
                      <CardHeader>
                        <CardTitle className="text-2xl font-semibold no-blur">Contact Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResumeContactSection
                          personalInfo={resume.personalInfo}
                          title={resume.title}
                          onUpdatePersonalInfo={updatePersonalInfo}
                          onUpdateTitle={updateResumeTitle}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="summary">
                    <Card className="solid-card">
                      <CardHeader>
                        <CardTitle className="text-2xl font-semibold no-blur">Professional Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResumeSummarySection
                          summary={resume.personalInfo.summary}
                          onUpdateSummary={(summary: string) => updatePersonalInfo({
                            ...resume.personalInfo,
                            summary
                          })}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="experience">
                    <Card className="solid-card">
                      <CardHeader>
                        <CardTitle className="text-2xl font-semibold no-blur">Work Experience</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResumeExperienceSection
                          experiences={resume.experience}
                          onUpdate={updateExperienceList}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="education">
                    <Card className="solid-card">
                      <CardHeader>
                        <CardTitle className="text-2xl font-semibold no-blur">Education</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResumeEducationSection
                          education={resume.education}
                          onUpdate={updateEducationList}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="skills">
                    <Card className="solid-card">
                      <CardHeader>
                        <CardTitle className="text-2xl font-semibold no-blur">Skills</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResumeSkillsSection
                          skills={resume.skills}
                          onUpdate={updateSkillsList}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="projects">
                    <Card className="solid-card">
                      <CardHeader>
                        <CardTitle className="text-2xl font-semibold no-blur">Projects</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResumeProjectsSection
                          projects={resume.projects}
                          onUpdate={updateProjectsList}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="preview">
                    <Card className="solid-card">
                      <CardHeader>
                        <CardTitle className="text-2xl font-semibold no-blur">Resume Preview</CardTitle>
                        <CardDescription className="no-blur">
                          See how your resume looks with our advanced preview features.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResumeTemplate 
                          resume={resume}
                          onDownload={handleDownload}
                          editable={true}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - AI Assistant */}
          <div className="lg:col-span-4">
            <Card className="solid-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl font-semibold no-blur">Career Analysis</CardTitle>
                </div>
                <CardDescription className="no-blur">
                  Analyze your resume to detect your career path and get tailored advice
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CareerPathDetection
                  resumeId={resume.id}
                  onAdviceReceived={handleCareerAdviceReceived}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Hidden file input for resume upload */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileUpload}
      />
    </div>
  );
}