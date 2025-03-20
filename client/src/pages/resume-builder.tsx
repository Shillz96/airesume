import React, { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar";
import ResumeTemplate, { 
  ProfessionalTemplate, 
  CreativeTemplate, 
  ExecutiveTemplate 
} from "@/components/resume-template";
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
import { Resume } from "@/components/resume-template";
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
  Cpu,
  Check,
  RefreshCw,
  Sparkles,
  Plus,
  Maximize2,
  Printer,
  ChevronDown,
  Download,
  Minus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SummarySuggestions from "@/components/SummarySuggestions";
import ExperienceSuggestions from "@/components/ExperienceSuggestions";
import SkillSuggestions from "@/components/SkillSuggestions";
import { EnhancedTextarea } from "@/components/enhanced-textarea";

// Preview component for the "Preview" section
function ResumePreview({ resume }: { resume: Resume }) {
  const [scale, setScale] = useState(1);
  
  // Function to download the resume
  const downloadResume = () => {
    window.print(); // Simplified for demo; replace with actual PDF generation in production
  };
  
  // Get the appropriate template component based on resume.template
  const TemplateComponent = 
    resume.template === "creative" ? CreativeTemplate :
    resume.template === "executive" ? ExecutiveTemplate :
    ProfessionalTemplate; // Default to professional
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-secondary-900">Resume Preview</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setScale(Math.max(0.5, scale - 0.1))}
            disabled={scale <= 0.5}
            className="flex items-center"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="flex items-center text-sm px-2">{Math.round(scale * 100)}%</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setScale(Math.min(1.5, scale + 0.1))}
            disabled={scale >= 1.5}
            className="flex items-center"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={downloadResume}
            className="flex items-center gap-1 ml-2"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>
      
      <div className="bg-white border border-secondary-200 rounded-lg overflow-hidden shadow-lg p-8">
        <div 
          className="transition-all duration-300 origin-top"
          style={{ transform: `scale(${scale})` }}
        >
          <TemplateComponent resume={resume} />
        </div>
      </div>
      
      {/* Template selection */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Choose a Template</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Template options would go here */}
        </div>
      </div>
    </div>
  );
}

export default function ResumeBuilder() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [resumeSaved, setResumeSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("profile");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [resumeId, setResumeId] = useState<number | null>(null);
  
  // For AI targeting specific job
  const [jobTitle, setJobTitle] = useState<string>("");
  const [showJobTargeting, setShowJobTargeting] = useState(false);
  
  // Initial resume state
  const [resume, setResume] = useState<Resume>({
    title: "My Professional Resume",
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      headline: "",
      summary: ""
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    template: "professional"
  });
  
  // Fetch resume data if resumeId exists
  const { data: fetchedResume } = useQuery({
    queryKey: ["/api/resumes", resumeId],
    enabled: !!resumeId
  });
  
  // Update resume state when data is fetched
  React.useEffect(() => {
    if (fetchedResume) {
      setResume(fetchedResume as Resume);
    }
  }, [fetchedResume]);
  
  // Save resume mutation
  const saveResumeMutation = useMutation({
    mutationFn: async (resumeData: Resume) => {
      if (resumeId) {
        const res = await apiRequest("PATCH", `/api/resumes/${resumeId}`, resumeData);
        return await res.json();
      } else {
        const res = await apiRequest("POST", "/api/resumes", resumeData);
        return await res.json();
      }
    },
    onSuccess: (data) => {
      setResumeId(data.id);
      setResumeSaved(true);
      
      toast({
        title: "Resume saved",
        description: "Your resume has been saved successfully.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
    },
    onError: (error) => {
      console.error("Error saving resume:", error);
      toast({
        title: "Error saving resume",
        description: "There was an error saving your resume. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Save resume handler
  const handleSaveResume = () => {
    setIsSaving(true);
    saveResumeMutation.mutate(resume);
    setIsSaving(false);
  };
  
  // Update personal info fields
  const updatePersonalInfo = (field: string, value: string) => {
    setResume({
      ...resume,
      personalInfo: {
        ...resume.personalInfo,
        [field]: value
      }
    });
  };
  
  // Template change handler
  const handleTemplateChange = (template: string) => {
    setResume({
      ...resume,
      template
    });
  };
  
  // File upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const res = await apiRequest("POST", "/api/resumes/parse", formData);
      const parsedData = await res.json();
      
      if (parsedData.success) {
        // Update resume state with parsed data
        setResume({
          ...resume,
          personalInfo: {
            ...resume.personalInfo,
            ...parsedData.data.personalInfo
          },
          experience: parsedData.data.experience || [],
          education: parsedData.data.education || [],
          skills: parsedData.data.skills || []
        });
        
        toast({
          title: "Resume uploaded",
          description: "Your resume has been parsed successfully.",
        });
      } else {
        toast({
          title: "Error parsing resume",
          description: parsedData.error || "There was an error parsing your resume.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast({
        title: "Error uploading resume",
        description: "There was an error uploading your resume. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsUploading(false);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  // Apply AI suggestions to experience section
  const handleApplyBulletPoint = (bulletPoint: string) => {
    if (activeSection === "experience" && resume.experience.length > 0) {
      // Apply to the most recent experience item
      const updatedExperience = [...resume.experience];
      const lastIndex = updatedExperience.length - 1;
      
      updatedExperience[lastIndex] = {
        ...updatedExperience[lastIndex],
        description: bulletPoint
      };
      
      setResume({
        ...resume,
        experience: updatedExperience
      });
      
      toast({
        title: "Bullet point applied",
        description: "AI-generated bullet point has been applied to your experience.",
      });
    } else {
      // Create a new experience item with the bullet point
      const newExperience: ExperienceItem = {
        id: `exp-${Date.now()}`,
        title: "Position Title",
        company: "Company Name",
        startDate: "2022-01",
        endDate: "Present",
        description: bulletPoint
      };
      
      setResume({
        ...resume,
        experience: [...resume.experience, newExperience]
      });
      
      toast({
        title: "New experience added",
        description: "New experience with AI-generated bullet point has been added.",
      });
    }
  };
  
  // Apply AI suggestions to summary
  const handleApplySummary = (summary: string) => {
    updatePersonalInfo("summary", summary);
    
    toast({
      title: "Summary applied",
      description: "AI-generated summary has been applied to your resume.",
    });
  };
  
  // Apply AI suggestions to skills
  const handleApplySkill = (skill: string) => {
    // Check if skill already exists
    const skillExists = resume.skills.some(s => s.name.toLowerCase() === skill.toLowerCase());
    
    if (!skillExists) {
      const newSkill: SkillItem = {
        id: `skill-${Date.now()}`,
        name: skill,
        proficiency: 3 // Default medium proficiency
      };
      
      setResume({
        ...resume,
        skills: [...resume.skills, newSkill]
      });
      
      toast({
        title: "Skill added",
        description: `"${skill}" has been added to your skills.`,
      });
    } else {
      toast({
        title: "Skill already exists",
        description: `"${skill}" is already in your skills list.`,
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
            <p className="text-gray-500">Create a professional resume with AI assistance</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                disabled={isUploading}
                className="flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload Resume
                  </>
                )}
              </Button>
            </div>
            <Button
              onClick={handleSaveResume}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Resume
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* Resume Builder Interface */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
          {/* Horizontal Tab Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto px-4 py-2 space-x-2">
              <Button
                variant={activeSection === "profile" ? "default" : "ghost"}
                className="flex items-center px-4 py-2 rounded-md"
                onClick={() => setActiveSection("profile")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Personal Info
              </Button>
              <Button
                variant={activeSection === "experience" ? "default" : "ghost"}
                className="flex items-center px-4 py-2 rounded-md"
                onClick={() => setActiveSection("experience")}
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Experience
              </Button>
              <Button
                variant={activeSection === "education" ? "default" : "ghost"}
                className="flex items-center px-4 py-2 rounded-md"
                onClick={() => setActiveSection("education")}
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                Education
              </Button>
              <Button
                variant={activeSection === "skills" ? "default" : "ghost"}
                className="flex items-center px-4 py-2 rounded-md"
                onClick={() => setActiveSection("skills")}
              >
                <Code className="h-4 w-4 mr-2" />
                Skills
              </Button>
              <Button
                variant={activeSection === "projects" ? "default" : "ghost"}
                className="flex items-center px-4 py-2 rounded-md"
                onClick={() => setActiveSection("projects")}
              >
                <FolderKanban className="h-4 w-4 mr-2" />
                Projects
              </Button>
              <Button
                variant={activeSection === "preview" ? "default" : "ghost"}
                className="flex items-center px-4 py-2 rounded-md"
                onClick={() => setActiveSection("preview")}
              >
                <Maximize2 className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>
          
          {/* Job targeting section - moved to right side of tabs */}
          <div className="border-b border-gray-200 px-4 py-2 flex justify-end">
            <Collapsible
              open={showJobTargeting}
              onOpenChange={setShowJobTargeting}
              className="w-64"
            >
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Cpu className="h-4 w-4" />
                  <span>Target Job</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showJobTargeting ? 'transform rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 p-3 bg-white rounded-md border border-gray-200 shadow-sm absolute right-0 z-10">
                <div className="space-y-2">
                  <Label htmlFor="job-title">Job Title</Label>
                  <Input
                    id="job-title"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g., Software Engineer"
                  />
                  <p className="text-xs text-gray-500">
                    Enter a job title to tailor AI suggestions
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
          
          {/* Main Content Area */}
          <div className="p-6">
            {/* Personal Information Section */}
            {activeSection === "profile" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={resume.personalInfo.firstName}
                      onChange={(e) => updatePersonalInfo("firstName", e.target.value)}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={resume.personalInfo.lastName}
                      onChange={(e) => updatePersonalInfo("lastName", e.target.value)}
                      placeholder="Doe"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={resume.personalInfo.email}
                      onChange={(e) => updatePersonalInfo("email", e.target.value)}
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={resume.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                      placeholder="(123) 456-7890"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="headline">Professional Headline</Label>
                  <Input
                    id="headline"
                    value={resume.personalInfo.headline}
                    onChange={(e) => updatePersonalInfo("headline", e.target.value)}
                    placeholder="Senior Software Engineer"
                  />
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="summary">Professional Summary</Label>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          AI Assist
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>AI Summary Suggestions</DialogTitle>
                          <DialogDescription>
                            Select an AI-generated professional summary to use in your resume.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 max-h-[60vh] overflow-y-auto">
                          <SummarySuggestions 
                            resumeId={resumeId ? String(resumeId) : "new"} 
                            onApply={handleApplySummary} 
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <EnhancedTextarea
                    id="summary-textarea"
                    value={resume.personalInfo.summary}
                    onChange={(e) => updatePersonalInfo("summary", e.target.value)}
                    placeholder="Write a professional summary that highlights your experience, skills, and career goals..."
                    className="h-32"
                  />
                </div>
              </div>
            )}
            
            {/* Experience Section */}
            {activeSection === "experience" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-gray-900">Work Experience</h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        AI Assist
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>AI Experience Suggestions</DialogTitle>
                        <DialogDescription>
                          Select ATS-optimized bullet points to highlight your achievements.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-4 max-h-[60vh] overflow-y-auto">
                        <ExperienceSuggestions 
                          resumeId={resumeId ? String(resumeId) : "new"} 
                          jobTitle={jobTitle}
                          onApply={handleApplyBulletPoint}
                          previewTargetId="experience-textarea"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <ResumeExperienceSection
                  experiences={resume.experience}
                  onUpdate={(experiences) => {
                    setResume({
                      ...resume,
                      experience: experiences
                    });
                  }}
                />
              </div>
            )}
            
            {/* Education Section */}
            {activeSection === "education" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">Education</h2>
                <ResumeEducationSection
                  education={resume.education}
                  onUpdate={(education) => {
                    setResume({
                      ...resume,
                      education
                    });
                  }}
                />
              </div>
            )}
            
            {/* Skills Section */}
            {activeSection === "skills" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-gray-900">Skills</h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        AI Assist
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>AI Skill Suggestions</DialogTitle>
                        <DialogDescription>
                          Add in-demand skills that match your profile.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-4 max-h-[60vh] overflow-y-auto">
                        <SkillSuggestions 
                          resumeId={resumeId ? String(resumeId) : "new"} 
                          jobTitle={jobTitle}
                          onApply={handleApplySkill}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <ResumeSkillsSection
                  skills={resume.skills}
                  onUpdate={(skills) => {
                    setResume({
                      ...resume,
                      skills
                    });
                  }}
                />
              </div>
            )}
            
            {/* Projects Section */}
            {activeSection === "projects" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">Projects</h2>
                <ResumeProjectsSection
                  projects={resume.projects}
                  onUpdate={(projects) => {
                    setResume({
                      ...resume,
                      projects
                    });
                  }}
                />
              </div>
            )}
            
            {/* Preview Section */}
            {activeSection === "preview" && (
              <div>
                <ResumePreview resume={resume} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}