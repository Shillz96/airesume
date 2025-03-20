import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar";
import AIAssistant from "@/components/ai-assistant";
import ResumeTemplate from "@/components/resume-template";
import { 
  ResumeExperienceSection, 
  ResumeEducationSection, 
  ResumeSkillsSection,
  ResumeProjectsSection,
  ExperienceItem,
  EducationItem,
  SkillItem,
  ProjectItem,
} from "@/components/resume-section";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  GraduationCap, 
  Briefcase, 
  Code, 
  Award, 
  FolderKanban,
  Save,
  Upload,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ResumeBuilder() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [resumeSaved, setResumeSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("personal");
  const [isUploading, setIsUploading] = useState(false);
  
  const [resume, setResume] = useState({
    id: "1", // In a real app, this would be assigned by the backend
    title: "Software Engineer Resume",
    template: "professional",
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      headline: "",
      summary: "",
    },
    experience: [] as ExperienceItem[],
    education: [] as EducationItem[],
    skills: [] as SkillItem[],
    projects: [] as ProjectItem[],
  });
  
  // Fetch resume data
  const { isLoading } = useQuery({
    queryKey: ['/api/resumes/1'],
    enabled: false, // Disable auto-fetching for the demo
    onSuccess: (data) => {
      if (data) {
        setResume(data);
      }
    },
  });
  
  // Save resume mutation
  const { mutate: saveResume, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/resumes/${resume.id}`, resume);
    },
    onSuccess: () => {
      setResumeSaved(true);
      setTimeout(() => setResumeSaved(false), 2000);
      toast({
        title: "Resume saved",
        description: "Your resume has been saved successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to save",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handlePersonalInfoChange = (field: string, value: string) => {
    setResume({
      ...resume,
      personalInfo: {
        ...resume.personalInfo,
        [field]: value,
      },
    });
  };
  
  const handleTemplateChange = (template: string) => {
    setResume({
      ...resume,
      template,
    });
  };
  
  const handleApplySuggestions = (suggestions: string[]) => {
    // In a real implementation, this would parse suggestions and apply them to the resume
    // For this demo, we'll just add a sample enhancement to the summary
    if (resume.personalInfo.summary) {
      setResume({
        ...resume,
        personalInfo: {
          ...resume.personalInfo,
          summary: resume.personalInfo.summary + " I excel at optimizing processes and driving innovative solutions."
        }
      });
    }
  };
  
  // Upload resume file and parse it
  const { mutate: uploadResume } = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/resume-upload', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header, let the browser set it with the boundary
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload resume');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success && data.data) {
        // Update the resume state with the parsed data
        const parsedData = data.data;
        
        // Map the parsed data to our resume structure
        setResume({
          ...resume,
          personalInfo: parsedData.personalInfo || resume.personalInfo,
          experience: parsedData.experience || resume.experience,
          education: parsedData.education || resume.education,
          skills: parsedData.skills || resume.skills,
          projects: parsedData.projects || resume.projects,
        });
        
        // Check if there's a warning (likely due to API quota issue)
        if (data.warning) {
          toast({
            title: "Resume uploaded",
            description: data.warning,
            variant: "destructive",
          });
          // Switch to personal section for editing
          setActiveSection("personal");
        } else {
          // Show success message
          toast({
            title: "Resume uploaded successfully",
            description: "Your resume has been parsed and loaded into the builder.",
          });
        }
      } else {
        toast({
          title: "Resume parsing incomplete",
          description: "Some resume sections could not be parsed. Please review and edit manually.",
          variant: "default",
        });
      }
      setIsUploading(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to upload resume",
        description: error.message,
        variant: "destructive",
      });
      setIsUploading(false);
    },
  });
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file type
    const fileType = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx', 'txt'].includes(fileType || '')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOCX, or TXT file.",
        variant: "destructive",
      });
      return;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    // Create form data and append file
    const formData = new FormData();
    formData.append('file', file);
    
    // Upload the file
    uploadResume(formData);
    
    // Reset the file input
    event.target.value = '';
  };
  
  return (
    <div className="min-h-screen bg-secondary-50">
      <Navbar />
      
      {resumeSaved && (
        <div className="fixed top-20 right-4 bg-green-50 p-4 rounded-md shadow-md border border-green-200 z-50 animate-in fade-in slide-in-from-top-5">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Resume saved successfully!
              </p>
            </div>
            <button 
              onClick={() => setResumeSaved(false)}
              className="ml-auto pl-3 -mx-1.5 -my-1.5 rounded-md p-1.5 inline-flex text-green-500 hover:bg-green-100 focus:outline-none"
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-secondary-900">Resume Builder</h1>
                <p className="mt-1 text-sm text-secondary-500">
                  Create and edit your professional resume with AI assistance.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {isUploading ? "Uploading..." : "Upload Resume"}
                </Button>
                <Button 
                  onClick={() => saveResume()} 
                  disabled={isSaving} 
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Resume"}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sidebar with builder controls */}
              <div className="lg:col-span-1">
                <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
                  <div className="p-4 border-b border-secondary-200">
                    <h2 className="text-lg font-medium text-secondary-900">Resume Sections</h2>
                  </div>
                  <div className="p-4">
                    <Accordion type="single" collapsible defaultValue="personal">
                      <AccordionItem value="personal">
                        <AccordionTrigger className="hover:no-underline py-3 px-3 hover:bg-secondary-50 rounded-md">
                          <div className="flex items-center">
                            <FileText className="text-primary-500 mr-2 h-5 w-5" />
                            <span className="font-medium">Personal Info</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="ml-7 space-y-2 mt-2">
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start text-secondary-700 font-normal"
                              onClick={() => setActiveSection("personal")}
                            >
                              Basic Information
                            </Button>
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start text-secondary-700 font-normal"
                              onClick={() => setActiveSection("summary")}
                            >
                              Professional Summary
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="experience">
                        <AccordionTrigger className="hover:no-underline py-3 px-3 hover:bg-secondary-50 rounded-md">
                          <div className="flex items-center">
                            <Briefcase className="text-secondary-500 mr-2 h-5 w-5" />
                            <span className="font-medium">Work Experience</span>
                          </div>
                          <Badge className="ml-auto mr-4">{resume.experience.length}</Badge>
                        </AccordionTrigger>
                        <AccordionContent>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start text-secondary-700 font-normal ml-7 mt-2"
                            onClick={() => setActiveSection("experience")}
                          >
                            Manage Experience
                          </Button>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="education">
                        <AccordionTrigger className="hover:no-underline py-3 px-3 hover:bg-secondary-50 rounded-md">
                          <div className="flex items-center">
                            <GraduationCap className="text-secondary-500 mr-2 h-5 w-5" />
                            <span className="font-medium">Education</span>
                          </div>
                          <Badge className="ml-auto mr-4">{resume.education.length}</Badge>
                        </AccordionTrigger>
                        <AccordionContent>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start text-secondary-700 font-normal ml-7 mt-2"
                            onClick={() => setActiveSection("education")}
                          >
                            Manage Education
                          </Button>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="skills">
                        <AccordionTrigger className="hover:no-underline py-3 px-3 hover:bg-secondary-50 rounded-md">
                          <div className="flex items-center">
                            <Code className="text-secondary-500 mr-2 h-5 w-5" />
                            <span className="font-medium">Skills</span>
                          </div>
                          <Badge className="ml-auto mr-4">{resume.skills.length}</Badge>
                        </AccordionTrigger>
                        <AccordionContent>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start text-secondary-700 font-normal ml-7 mt-2"
                            onClick={() => setActiveSection("skills")}
                          >
                            Manage Skills
                          </Button>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="projects">
                        <AccordionTrigger className="hover:no-underline py-3 px-3 hover:bg-secondary-50 rounded-md">
                          <div className="flex items-center">
                            <FolderKanban className="text-secondary-500 mr-2 h-5 w-5" />
                            <span className="font-medium">Projects</span>
                          </div>
                          <Badge className="ml-auto mr-4">{resume.projects.length}</Badge>
                        </AccordionTrigger>
                        <AccordionContent>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start text-secondary-700 font-normal ml-7 mt-2"
                            onClick={() => setActiveSection("projects")}
                          >
                            Manage Projects
                          </Button>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="certifications">
                        <AccordionTrigger className="hover:no-underline py-3 px-3 hover:bg-secondary-50 rounded-md">
                          <div className="flex items-center">
                            <Award className="text-secondary-500 mr-2 h-5 w-5" />
                            <span className="font-medium">Certifications</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start text-secondary-700 font-normal ml-7 mt-2"
                          >
                            Add Certifications
                          </Button>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
                
                {/* AI Assistant */}
                <AIAssistant 
                  resumeId={resume.id} 
                  onApplySuggestions={handleApplySuggestions} 
                />
              </div>
              
              {/* Main resume editor and preview */}
              <div className="lg:col-span-2 space-y-6">
                {/* Editor for current section */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="border-b border-secondary-200 px-6 py-4">
                    <h2 className="text-lg font-medium text-secondary-900">
                      {activeSection === "personal" && "Personal Information"}
                      {activeSection === "summary" && "Professional Summary"}
                      {activeSection === "experience" && "Work Experience"}
                      {activeSection === "education" && "Education"}
                      {activeSection === "skills" && "Skills"}
                      {activeSection === "projects" && "Projects"}
                    </h2>
                  </div>
                  
                  <div className="p-6">
                    {activeSection === "personal" && (
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <Label htmlFor="first-name">First name</Label>
                          <Input
                            id="first-name"
                            value={resume.personalInfo.firstName}
                            onChange={(e) => handlePersonalInfoChange("firstName", e.target.value)}
                            className="mt-1"
                            placeholder="John"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <Label htmlFor="last-name">Last name</Label>
                          <Input
                            id="last-name"
                            value={resume.personalInfo.lastName}
                            onChange={(e) => handlePersonalInfoChange("lastName", e.target.value)}
                            className="mt-1"
                            placeholder="Doe"
                          />
                        </div>

                        <div className="sm:col-span-4">
                          <Label htmlFor="email">Email address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={resume.personalInfo.email}
                            onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
                            className="mt-1"
                            placeholder="john.doe@example.com"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={resume.personalInfo.phone}
                            onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
                            className="mt-1"
                            placeholder="(555) 123-4567"
                          />
                        </div>

                        <div className="sm:col-span-6">
                          <Label htmlFor="headline">Professional Headline</Label>
                          <Input
                            id="headline"
                            value={resume.personalInfo.headline}
                            onChange={(e) => handlePersonalInfoChange("headline", e.target.value)}
                            className="mt-1"
                            placeholder="Software Engineer with 5+ years of experience"
                          />
                        </div>
                      </div>
                    )}
                    
                    {activeSection === "summary" && (
                      <div className="sm:col-span-6">
                        <Label htmlFor="summary">Professional Summary</Label>
                        <div className="mt-1">
                          <Textarea
                            id="summary"
                            value={resume.personalInfo.summary}
                            onChange={(e) => handlePersonalInfoChange("summary", e.target.value)}
                            rows={5}
                            className="resize-none"
                            placeholder="Passionate software engineer with expertise in JavaScript, React, and Node.js. Proven track record of delivering high-quality web applications with a focus on user experience and performance optimization."
                          />
                        </div>
                        <p className="mt-2 text-sm text-secondary-500">
                          Write a 2-3 sentence summary highlighting your experience and strengths.
                        </p>
                      </div>
                    )}
                    
                    {activeSection === "experience" && (
                      <ResumeExperienceSection
                        experiences={resume.experience}
                        onUpdate={(experience) => setResume({ ...resume, experience })}
                      />
                    )}
                    
                    {activeSection === "education" && (
                      <ResumeEducationSection
                        education={resume.education}
                        onUpdate={(education) => setResume({ ...resume, education })}
                      />
                    )}
                    
                    {activeSection === "skills" && (
                      <ResumeSkillsSection
                        skills={resume.skills}
                        onUpdate={(skills) => setResume({ ...resume, skills })}
                      />
                    )}
                    
                    {activeSection === "projects" && (
                      <ResumeProjectsSection
                        projects={resume.projects}
                        onUpdate={(projects) => setResume({ ...resume, projects })}
                      />
                    )}
                  </div>
                </div>
                
                {/* Resume Preview */}
                <ResumeTemplate 
                  resume={resume} 
                  onTemplateChange={handleTemplateChange} 
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
