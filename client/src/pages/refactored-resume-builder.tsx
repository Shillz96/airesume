import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useParams } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";

// Import custom components for resume builder
import Navbar from "@/components/navbar";
import ResumeBuilderHeader from "@/components/resume-builder/ResumeBuilderHeader";
import SummarySuggestions from "@/components/resume-builder/SummarySuggestions";
import ExperienceSuggestions from "@/components/resume-builder/ExperienceSuggestions";
import SkillSuggestions from "@/components/resume-builder/SkillSuggestions";
import TemplateSelector from "@/components/resume-builder/TemplateSelector";
import ResumePreviewComponent from "@/components/resume-builder/ResumePreviewComponent";
import AIAssistantDialog from "@/components/resume-builder/AIAssistantDialog";

// Import modular resume section components
import { PersonalInfoSection } from "@/components/resume/PersonalInfoSection";
import { ExperienceSection } from "@/components/resume/ExperienceSection";
import { EducationSection } from "@/components/resume/EducationSection";
import { SkillsSection } from "@/components/resume/SkillsSection";
import { ProjectsSection } from "@/components/resume/ProjectsSection";

// Import resume types and hooks
import { Resume, useResumeData } from "@/hooks/use-resume-data";
import { 
  ExperienceItem, 
  EducationItem, 
  SkillItem, 
  ProjectItem 
} from "@/components/resume-section";

// UI Components
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

// Icons
import {
  FileText,
  GraduationCap,
  Briefcase,
  Code,
  Award,
  FolderKanban,
  Sparkles,
  Loader2,
  Cpu,
  User,
} from "lucide-react";

export default function ResumeBuilder() {
  // Get resumeId from URL params
  const { resumeId } = useParams();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { isDarkMode } = useTheme();
  
  // Component state
  const [activeTab, setActiveTab] = useState("personal");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Import resume data hook functions
  const {
    resume,
    isLoading,
    error,
    setResume,
    createResumeMutation,
    updateResumeMutation,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addSkill,
    updateSkill,
    removeSkill,
    addProject,
    updateProject,
    removeProject,
  } = useResumeData();

  // Fetch resume data if editing existing resume
  useEffect(() => {
    if (resumeId && resumeId !== "new") {
      queryClient.invalidateQueries({ queryKey: [`/api/resumes/${resumeId}`] });
    }
  }, [resumeId]);

  // Fetch the selected resume if we have an ID
  const { data: fetchedResume, isLoading: isResumeLoading } = useQuery({
    queryKey: [`/api/resumes/${resumeId}`],
    queryFn: async () => {
      if (!resumeId || resumeId === "new") return null;
      const res = await apiRequest("GET", `/api/resumes/${resumeId}`);
      if (!res.ok) throw new Error("Failed to fetch resume");
      return res.json();
    },
    enabled: !!resumeId && resumeId !== "new",
  });

  // Update local resume state when fetched resume changes
  useEffect(() => {
    if (fetchedResume && fetchedResume.data) {
      setResume(fetchedResume.data);
      setIsDirty(false);
    }
  }, [fetchedResume, setResume]);

  // Mark as dirty when resume changes
  useEffect(() => {
    if (!isResumeLoading && fetchedResume) {
      setIsDirty(true);
    }
  }, [resume, isResumeLoading, fetchedResume]);

  // Handler for resume title change
  const handleTitleChange = (value: string) => {
    setResume({
      ...resume,
      title: value,
    });
    setIsDirty(true);
  };

  // Handler for personal info changes
  const handlePersonalInfoChange = (field: string, value: string) => {
    setResume({
      ...resume,
      personalInfo: {
        ...resume.personalInfo,
        [field]: value,
      },
    });
    setIsDirty(true);
  };

  // Handler for template selection
  const handleTemplateChange = (template: string) => {
    setResume({
      ...resume,
      template,
    });
    setIsDirty(true);
  };

  // Handle saving the resume
  const handleSaveResume = async () => {
    try {
      if (resumeId && resumeId !== "new") {
        // Update existing resume
        await updateResumeMutation.mutateAsync({
          id: resumeId,
          resumeData: resume,
        });
        toast({
          title: "Resume updated",
          description: "Your resume has been updated successfully.",
          variant: "default",
        });
      } else {
        // Create new resume
        const result = await createResumeMutation.mutateAsync(resume);
        if (result?.id) {
          toast({
            title: "Resume created",
            description: "Your new resume has been created successfully.",
            variant: "default",
          });
          // Redirect to the edit page for the new resume
          setLocation(`/resumes/${result.id}`);
        }
      }
      setIsDirty(false);
    } catch (error) {
      console.error("Error saving resume:", error);
      toast({
        title: "Error saving resume",
        description: "There was a problem saving your resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle downloading the resume as PDF
  const handleDownloadResume = () => {
    if (iframeRef.current) {
      // Generate the printable HTML content
      const printContent = generatePrintableHTML(resume);
      
      // Access the iframe document
      const iframeDoc = iframeRef.current.contentDocument;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(printContent);
        iframeDoc.close();
        
        // Trigger the print dialog
        setTimeout(() => {
          iframeRef.current?.contentWindow?.print();
        }, 500);
      }
    }
  };

  // Function to generate printable HTML
  function generatePrintableHTML(resumeData: Resume): string {
    // Choose the template based on the selected template
    let templateHTML = "";
    
    // Create the HTML content with the appropriate template
    switch (resumeData.template) {
      case "professional":
        templateHTML = `<div id="professional-template">
          <!-- Professional template HTML -->
          <h1>${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}</h1>
          <p>${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone}</p>
          <h2>${resumeData.personalInfo.headline}</h2>
          <p>${resumeData.personalInfo.summary}</p>
          <!-- Sections would be added here -->
        </div>`;
        break;
      default:
        templateHTML = `<div id="default-template">
          <!-- Default template HTML -->
          <h1>${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}</h1>
          <p>${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone}</p>
          <h2>${resumeData.personalInfo.headline}</h2>
          <p>${resumeData.personalInfo.summary}</p>
          <!-- Sections would be added here -->
        </div>`;
    }
    
    // Return the complete HTML document
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${resumeData.title || "Resume"}</title>
        <style>
          /* Print-specific styles would be added here */
          body { font-family: Arial, sans-serif; }
          h1 { color: #333; }
          /* More styles based on template */
        </style>
      </head>
      <body>
        ${templateHTML}
      </body>
      </html>
    `;
  }

  // If still loading, show a loading indicator
  if (isLoading || isResumeLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-blue-200">Loading resume...</span>
      </div>
    );
  }

  // If there's an error, show an error message
  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-red-500">
          <p>Error loading resume. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      
      {/* Resume Builder Header */}
      <ResumeBuilderHeader
        resumeTitle={resume.title}
        onTitleChange={handleTitleChange}
        onSave={handleSaveResume}
        onDownload={handleDownloadResume}
        onOpenAIAssistant={() => setIsDialogOpen(true)}
        isSaving={updateResumeMutation.isPending || createResumeMutation.isPending}
        isDirty={isDirty}
      />
      
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Resume Editor Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs 
            defaultValue="personal" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="bg-slate-800/70 p-1 rounded-lg backdrop-blur-sm w-full flex overflow-x-auto">
              <TabsTrigger
                value="personal"
                className="flex items-center data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-200"
              >
                <User className="h-4 w-4 mr-1" />
                <span className="truncate">Personal</span>
              </TabsTrigger>
              <TabsTrigger
                value="experience"
                className="flex items-center data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-200"
              >
                <Briefcase className="h-4 w-4 mr-1" />
                <span className="truncate">Experience</span>
              </TabsTrigger>
              <TabsTrigger
                value="education"
                className="flex items-center data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-200"
              >
                <GraduationCap className="h-4 w-4 mr-1" />
                <span className="truncate">Education</span>
              </TabsTrigger>
              <TabsTrigger
                value="skills"
                className="flex items-center data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-200"
              >
                <Award className="h-4 w-4 mr-1" />
                <span className="truncate">Skills</span>
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="flex items-center data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-200"
              >
                <FolderKanban className="h-4 w-4 mr-1" />
                <span className="truncate">Projects</span>
              </TabsTrigger>
              <TabsTrigger
                value="templates"
                className="flex items-center data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-200"
              >
                <FileText className="h-4 w-4 mr-1" />
                <span className="truncate">Templates</span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="personal">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8">
                    <PersonalInfoSection
                      personalInfo={resume.personalInfo}
                      resumeId={resumeId?.toString()}
                      onUpdate={handlePersonalInfoChange}
                    />
                  </div>
                  <div className="lg:col-span-4">
                    <div className="bg-slate-800/50 rounded-lg border border-blue-500/20 p-4">
                      <h3 className="text-blue-100 font-medium flex items-center mb-3">
                        <Sparkles className="h-4 w-4 mr-2 text-blue-300" />
                        AI Summary Suggestions
                      </h3>
                      <SummarySuggestions 
                        resumeId={resumeId?.toString() || ""} 
                        onApply={(summary) => handlePersonalInfoChange("summary", summary)} 
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="experience">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8">
                    <ExperienceSection
                      experiences={resume.experience}
                      resumeId={resumeId?.toString()}
                      onUpdate={(experiences) => {
                        setResume({ ...resume, experience: experiences });
                        setIsDirty(true);
                      }}
                      onAdd={addExperience}
                    />
                  </div>
                  <div className="lg:col-span-4">
                    <div className="bg-slate-800/50 rounded-lg border border-blue-500/20 p-4">
                      <h3 className="text-blue-100 font-medium flex items-center mb-3">
                        <Sparkles className="h-4 w-4 mr-2 text-blue-300" />
                        AI Bullet Point Suggestions
                      </h3>
                      <ExperienceSuggestions 
                        resumeId={resumeId?.toString() || ""} 
                        jobTitle={resume.experience[0]?.title || ""}
                        onApply={(bullet) => {
                          // Add to the first experience item's description
                          if (resume.experience.length > 0) {
                            const updated = [...resume.experience];
                            updated[0] = {
                              ...updated[0],
                              description: updated[0].description 
                                ? updated[0].description + "\n• " + bullet
                                : "• " + bullet
                            };
                            setResume({ ...resume, experience: updated });
                            setIsDirty(true);
                          }
                        }} 
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="education">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8">
                    <EducationSection
                      education={resume.education}
                      resumeId={resumeId?.toString()}
                      onUpdate={(education) => {
                        setResume({ ...resume, education });
                        setIsDirty(true);
                      }}
                      onAdd={addEducation}
                    />
                  </div>
                  <div className="lg:col-span-4">
                    <div className="bg-slate-800/50 rounded-lg border border-blue-500/20 p-4 sticky top-20">
                      <h3 className="text-blue-100 font-medium flex items-center">
                        <Cpu className="h-4 w-4 mr-2 text-blue-300" />
                        AI Resume Assistant
                      </h3>
                      <p className="text-blue-300 text-sm mt-2">
                        Need help with your education section? The AI assistant can help you craft compelling descriptions and improve your educational achievements.
                      </p>
                      <div className="mt-4">
                        <button
                          onClick={() => setIsDialogOpen(true)}
                          className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-md flex items-center justify-center"
                        >
                          <Cpu className="h-4 w-4 mr-2" />
                          Open AI Assistant
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="skills">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8">
                    <SkillsSection
                      skills={resume.skills}
                      resumeId={resumeId?.toString()}
                      onUpdate={(skills) => {
                        setResume({ ...resume, skills });
                        setIsDirty(true);
                      }}
                      onAdd={addSkill}
                    />
                  </div>
                  <div className="lg:col-span-4">
                    <div className="bg-slate-800/50 rounded-lg border border-blue-500/20 p-4">
                      <h3 className="text-blue-100 font-medium flex items-center mb-3">
                        <Sparkles className="h-4 w-4 mr-2 text-blue-300" />
                        AI Skill Suggestions
                      </h3>
                      <SkillSuggestions 
                        resumeId={resumeId?.toString() || ""} 
                        jobTitle={resume.personalInfo.headline || resume.experience[0]?.title}
                        onApply={(skill) => {
                          addSkill();
                          const newSkills = [...resume.skills];
                          newSkills[newSkills.length - 1] = {
                            ...newSkills[newSkills.length - 1],
                            name: skill,
                            proficiency: 3
                          };
                          setResume({ ...resume, skills: newSkills });
                          setIsDirty(true);
                        }} 
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="projects">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8">
                    <ProjectsSection
                      projects={resume.projects}
                      resumeId={resumeId?.toString()}
                      onUpdate={(projects) => {
                        setResume({ ...resume, projects });
                        setIsDirty(true);
                      }}
                      onAdd={addProject}
                    />
                  </div>
                  <div className="lg:col-span-4">
                    <div className="bg-slate-800/50 rounded-lg border border-blue-500/20 p-4 sticky top-20">
                      <h3 className="text-blue-100 font-medium flex items-center">
                        <Code className="h-4 w-4 mr-2 text-blue-300" />
                        Project Tips
                      </h3>
                      <ul className="text-blue-300 text-sm mt-3 space-y-2">
                        <li className="flex items-start">
                          <span className="text-blue-400 mr-2">•</span>
                          Include measurable achievements and outcomes
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-400 mr-2">•</span>
                          List technologies and tools you used
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-400 mr-2">•</span>
                          Add links to live demos or repositories
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-400 mr-2">•</span>
                          Describe your role and contributions
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-400 mr-2">•</span>
                          Highlight unique challenges you overcame
                        </li>
                      </ul>
                      <div className="mt-4">
                        <button
                          onClick={() => setIsDialogOpen(true)}
                          className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-md flex items-center justify-center"
                        >
                          <Cpu className="h-4 w-4 mr-2" />
                          Open AI Assistant
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="templates">
                <div className="bg-slate-800/50 p-6 rounded-lg border border-blue-500/20">
                  <h2 className="text-xl text-blue-50 font-semibold mb-4">Choose a Template</h2>
                  <p className="text-blue-300 mb-6">
                    Select a template that best showcases your experience and fits the job you're applying for.
                  </p>
                  <TemplateSelector 
                    selectedTemplate={resume.template} 
                    onTemplateChange={handleTemplateChange} 
                  />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Resume Preview Panel */}
        <div className="lg:col-span-1 h-[calc(100vh-200px)] sticky top-20">
          <ResumePreviewComponent 
            resume={resume} 
            onTemplateChange={handleTemplateChange}
            onDownload={handleDownloadResume}
          />
        </div>
      </div>

      {/* Hidden iframe for printing */}
      <iframe
        ref={iframeRef}
        style={{ display: "none" }}
        title="Resume Print Frame"
      />

      {/* AI Assistant Dialog */}
      <AIAssistantDialog
        resumeId={resumeId?.toString()}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onApplySummary={(summary) => handlePersonalInfoChange("summary", summary)}
        onApplyBulletPoint={(bullet) => {
          // Add to the first experience item's description
          if (resume.experience.length > 0) {
            const updated = [...resume.experience];
            updated[0] = {
              ...updated[0],
              description: updated[0].description 
                ? updated[0].description + "\n• " + bullet
                : "• " + bullet
            };
            setResume({ ...resume, experience: updated });
            setIsDirty(true);
          }
        }}
        onApplySkill={(skill) => {
          addSkill();
          const newSkills = [...resume.skills];
          newSkills[newSkills.length - 1] = {
            ...newSkills[newSkills.length - 1],
            name: skill,
            proficiency: 3
          };
          setResume({ ...resume, skills: newSkills });
          setIsDirty(true);
        }}
        resume={resume}
        activeTab={activeTab}
      />
    </div>
  );
}