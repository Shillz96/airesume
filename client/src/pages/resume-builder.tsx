import React, { useState, useRef, useEffect } from "react";
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
  User,
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

// Component for professional summary AI suggestions
interface SummarySuggestionsProps {
  resumeId: string;
  onApply: (summary: string) => void;
}

function SummarySuggestions({ resumeId, onApply }: SummarySuggestionsProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [summaries, setSummaries] = useState<string[]>([]);
  
  // Generate AI summaries
  const handleGenerateSummaries = async () => {
    if (!resumeId) {
      return;
    }
    
    setIsGenerating(true);
    try {
      // Use the summaryOnly parameter to get complete summary rewrites
      const res = await apiRequest("GET", `/api/resumes/${resumeId}/suggestions?summaryOnly=true`);
      const data = await res.json();
      
      if (data.success && data.suggestions && Array.isArray(data.suggestions)) {
        setSummaries(data.suggestions.slice(0, 3));
      } else {
        // Fallback summaries if the API call fails
        setSummaries([
          "Accomplished software professional with a proven track record of delivering innovative solutions. Adept at leveraging technical expertise to drive business outcomes and optimize processes.",
          "Results-driven professional combining technical expertise with strong communication skills. Committed to continuous improvement and delivering high-quality work that exceeds expectations.",
          "Versatile and dedicated professional with strong problem-solving abilities. Effectively balances technical excellence with business requirements to create impactful solutions."
        ]);
      }
    } catch (error) {
      console.error("Error generating summaries:", error);
      // Fallback summaries if the API call fails
      setSummaries([
        "Accomplished software professional with a proven track record of delivering innovative solutions. Adept at leveraging technical expertise to drive business outcomes and optimize processes.",
        "Results-driven professional combining technical expertise with strong communication skills. Committed to continuous improvement and delivering high-quality work that exceeds expectations.",
        "Versatile and dedicated professional with strong problem-solving abilities. Effectively balances technical excellence with business requirements to create impactful solutions."
      ]);
    }
    setIsGenerating(false);
  };
  
  return (
    <div>
      {summaries.length === 0 ? (
        <div className="text-center py-3">
          <Button
            onClick={handleGenerateSummaries}
            disabled={isGenerating}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating summaries...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate AI summaries
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {summaries.map((summary, index) => (
            <div 
              key={index} 
              className="bg-white p-3 rounded-md border border-secondary-200 text-sm relative group"
            >
              <p className="text-secondary-600">{summary}</p>
              <Button
                onClick={() => onApply(summary)}
                size="sm"
                className="mt-2 w-full flex items-center justify-center gap-1"
              >
                <Check className="h-3 w-3" />
                Use this summary
              </Button>
            </div>
          ))}
          <Button
            onClick={() => {
              setSummaries([]);
              handleGenerateSummaries();
            }}
            variant="ghost"
            size="sm"
            className="w-full flex items-center justify-center gap-1 mt-2"
          >
            <RefreshCw className="h-3 w-3" />
            Generate different suggestions
          </Button>
        </div>
      )}
    </div>
  );
}

// Component for experience bullet point AI suggestions
interface ExperienceSuggestionsProps {
  resumeId: string;
  jobTitle?: string;
  onApply: (bulletPoint: string) => void;
}

function ExperienceSuggestions({ resumeId, jobTitle, onApply }: ExperienceSuggestionsProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [bulletPoints, setBulletPoints] = useState<string[]>([]);
  
  // Generate AI bullet points for experience section
  const handleGenerateBulletPoints = async () => {
    if (!resumeId) {
      return;
    }
    
    setIsGenerating(true);
    try {
      // Use the experienceOnly parameter to get ATS-optimized bullet points
      let url = `/api/resumes/${resumeId}/suggestions?experienceOnly=true`;
      if (jobTitle) {
        url += `&jobTitle=${encodeURIComponent(jobTitle)}`;
      }
      
      const res = await apiRequest("GET", url);
      const data = await res.json();
      
      if (data.success && data.suggestions && Array.isArray(data.suggestions)) {
        setBulletPoints(data.suggestions);
      } else {
        // Fallback bullet points if the API call fails
        setBulletPoints([
          "Increased website performance by 40% through optimization of front-end code and implementation of caching strategies.",
          "Developed and implemented automated testing protocols that reduced QA time by 25% while improving code quality.",
          "Spearheaded migration to cloud-based infrastructure, resulting in 30% cost reduction and 99.9% uptime.",
          "Led cross-functional team of 5 developers to deliver critical project under budget and 2 weeks ahead of schedule.",
          "Designed and implemented RESTful API that processed over 1M requests daily with average response time under 100ms."
        ]);
      }
    } catch (error) {
      console.error("Error generating experience bullet points:", error);
      // Fallback bullet points if the API call fails
      setBulletPoints([
        "Increased website performance by 40% through optimization of front-end code and implementation of caching strategies.",
        "Developed and implemented automated testing protocols that reduced QA time by 25% while improving code quality.",
        "Spearheaded migration to cloud-based infrastructure, resulting in 30% cost reduction and 99.9% uptime.",
        "Led cross-functional team of 5 developers to deliver critical project under budget and 2 weeks ahead of schedule.",
        "Designed and implemented RESTful API that processed over 1M requests daily with average response time under 100ms."
      ]);
    }
    setIsGenerating(false);
  };
  
  return (
    <div>
      {bulletPoints.length === 0 ? (
        <div className="text-center py-3">
          <Button
            onClick={handleGenerateBulletPoints}
            disabled={isGenerating}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating bullet points...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate ATS-optimized bullet points
              </>
            )}
          </Button>
          <p className="text-xs text-secondary-500 mt-2">
            Creates achievement-focused bullet points with keywords that ATS systems scan for
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bulletPoints.map((bulletPoint, index) => (
            <div 
              key={index} 
              className="bg-white p-3 rounded-md border border-secondary-200 text-sm relative group"
            >
              <p className="text-secondary-600">{bulletPoint}</p>
              <Button
                onClick={() => onApply(bulletPoint)}
                size="sm"
                className="mt-2 w-full flex items-center justify-center gap-1"
              >
                <Check className="h-3 w-3" />
                Use this bullet point
              </Button>
            </div>
          ))}
          <Button
            onClick={() => {
              setBulletPoints([]);
              handleGenerateBulletPoints();
            }}
            variant="ghost"
            size="sm"
            className="w-full flex items-center justify-center gap-1 mt-2"
          >
            <RefreshCw className="h-3 w-3" />
            Generate different bullet points
          </Button>
        </div>
      )}
    </div>
  );
}

// Component for skills AI suggestions
interface SkillSuggestionsProps {
  resumeId: string;
  jobTitle?: string;
  onApply: (skill: string) => void;
}

function SkillSuggestions({ resumeId, jobTitle, onApply }: SkillSuggestionsProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  
  // Generate AI skill suggestions
  const handleGenerateSkills = async () => {
    if (!resumeId) {
      return;
    }
    
    setIsGenerating(true);
    try {
      // Use the skillsOnly parameter to get ATS-optimized skills
      let url = `/api/resumes/${resumeId}/suggestions?skillsOnly=true`;
      if (jobTitle) {
        url += `&jobTitle=${encodeURIComponent(jobTitle)}`;
      }
      
      const res = await apiRequest("GET", url);
      const data = await res.json();
      
      if (data.success && data.suggestions && Array.isArray(data.suggestions)) {
        setSkills(data.suggestions);
      } else {
        // Fallback skills if the API call fails
        setSkills([
          "JavaScript", "React", "Node.js", "TypeScript", "GraphQL", 
          "AWS", "Docker", "CI/CD", "Git", "Agile Methodologies"
        ]);
      }
    } catch (error) {
      console.error("Error generating skill suggestions:", error);
      // Fallback skills if the API call fails
      setSkills([
        "JavaScript", "React", "Node.js", "TypeScript", "GraphQL", 
        "AWS", "Docker", "CI/CD", "Git", "Agile Methodologies"
      ]);
    }
    setIsGenerating(false);
  };
  
  return (
    <div>
      {skills.length === 0 ? (
        <div className="text-center py-3">
          <Button
            onClick={handleGenerateSkills}
            disabled={isGenerating}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating skills...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate ATS-friendly skills
              </>
            )}
          </Button>
          <p className="text-xs text-secondary-500 mt-2">
            Suggests skills that align with your experience and are frequently scanned by ATS systems
          </p>
        </div>
      ) : (
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {skills.map((skill, index) => (
              <Badge 
                key={index} 
                variant="secondary"
                className="py-1 px-3 cursor-pointer hover:bg-primary-100 flex items-center gap-1"
                onClick={() => onApply(skill)}
              >
                {skill}
                <span className="text-xs text-primary-500">
                  <Plus className="h-3 w-3" />
                </span>
              </Badge>
            ))}
          </div>
          <Button
            onClick={() => {
              setSkills([]);
              handleGenerateSkills();
            }}
            variant="ghost"
            size="sm"
            className="w-full flex items-center justify-center gap-1 mt-2"
          >
            <RefreshCw className="h-3 w-3" />
            Generate different skills
          </Button>
        </div>
      )}
    </div>
  );
}

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
  
  // Use useEffect to handle the data instead of onSuccess
  useEffect(() => {
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
      
      // Switch to experience tab
      setActiveSection("experience");
      
      toast({
        title: "Experience added",
        description: "New experience with AI-generated bullet point has been added.",
      });
    }
  };
  
  // Apply AI summary to personal info
  const handleApplySummary = (summary: string) => {
    updatePersonalInfo("summary", summary);
    
    toast({
      title: "Summary applied",
      description: "AI-generated summary has been applied to your resume.",
    });
  };
  
  // Apply AI skill to skills section
  const handleApplySkill = (skillName: string) => {
    // Check if skill already exists
    if (resume.skills.some(skill => skill.name.toLowerCase() === skillName.toLowerCase())) {
      toast({
        title: "Skill already exists",
        description: `"${skillName}" is already in your skills list.`,
        variant: "destructive",
      });
      return;
    }
    
    const newSkill: SkillItem = {
      id: `skill-${Date.now()}`,
      name: skillName,
      proficiency: 3 // Default to medium proficiency
    };
    
    setResume({
      ...resume,
      skills: [...resume.skills, newSkill]
    });
    
    toast({
      title: "Skill added",
      description: `"${skillName}" has been added to your skills.`,
    });
  };
  
  // Handle file input click
  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="min-h-screen bg-black cosmic-background">
      <Navbar />
      
      <main className="container mx-auto pt-24 pb-20 px-4">
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold cosmic-text-gradient mb-2">Resume Builder</h1>
            <p className="text-gray-300">
              Create a professional resume that passes ATS systems and gets you hired.
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button
              onClick={handleSaveResume}
              disabled={isSaving}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Resume</span>
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleFileInputClick}
              disabled={isUploading}
              className="flex items-center space-x-2 border-white/10 text-gray-200 hover:bg-white/10 hover:text-white"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 text-blue-400" />
                  <span>Upload Resume</span>
                </>
              )}
            </Button>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.docx,.txt"
              className="hidden"
            />
          </div>
        </div>
        
        {/* Main content area */}
        <div className="cosmic-card border border-white/10 rounded-xl shadow-lg backdrop-blur-md overflow-hidden">
          {/* Horizontal Tab Navigation */}
          <div className="relative">
            <div className="bg-gradient-to-r from-blue-900/80 to-purple-900/80 rounded-t-xl px-6 py-4 border-b border-white/10">
              <Tabs 
                value={activeSection} 
                onValueChange={setActiveSection} 
                className="w-full cosmic-tabs"
              >
                <TabsList className="bg-transparent w-full justify-start mb-1 p-0 space-x-1">
                  <TabsTrigger 
                    value="profile" 
                    className={`${activeSection === "profile" 
                      ? "bg-blue-600/50 text-white border-b-2 border-blue-400" 
                      : "text-gray-300 hover:text-white hover:bg-white/5"} font-medium transition-all duration-200`}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    PROFILE
                  </TabsTrigger>
                  <TabsTrigger 
                    value="experience" 
                    className={`${activeSection === "experience" 
                      ? "bg-blue-600/50 text-white border-b-2 border-blue-400" 
                      : "text-gray-300 hover:text-white hover:bg-white/5"} font-medium transition-all duration-200`}
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    EXPERIENCE
                  </TabsTrigger>
                  <TabsTrigger 
                    value="education" 
                    className={`${activeSection === "education" 
                      ? "bg-blue-600/50 text-white border-b-2 border-blue-400" 
                      : "text-gray-300 hover:text-white hover:bg-white/5"} font-medium transition-all duration-200`}
                  >
                    <GraduationCap className="h-4 w-4 mr-2" />
                    EDUCATION
                  </TabsTrigger>
                  <TabsTrigger 
                    value="skills" 
                    className={`${activeSection === "skills" 
                      ? "bg-blue-600/50 text-white border-b-2 border-blue-400" 
                      : "text-gray-300 hover:text-white hover:bg-white/5"} font-medium transition-all duration-200`}
                  >
                    <Code className="h-4 w-4 mr-2" />
                    SKILLS
                  </TabsTrigger>
                  <TabsTrigger 
                    value="projects" 
                    className={`${activeSection === "projects" 
                      ? "bg-blue-600/50 text-white border-b-2 border-blue-400" 
                      : "text-gray-300 hover:text-white hover:bg-white/5"} font-medium transition-all duration-200`}
                  >
                    <FolderKanban className="h-4 w-4 mr-2" />
                    PROJECTS
                  </TabsTrigger>
                  <TabsTrigger 
                    value="preview" 
                    className={`${activeSection === "preview" 
                      ? "bg-blue-600/50 text-white border-b-2 border-blue-400" 
                      : "text-gray-300 hover:text-white hover:bg-white/5"} font-medium transition-all duration-200`}
                  >
                    <Maximize2 className="h-4 w-4 mr-2" />
                    PREVIEW
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Tab Content */}
            <div className="p-6">
              {/* Profile Section */}
              {activeSection === "profile" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
                        <User className="h-5 w-5 mr-2 text-blue-400" />
                        Personal Information
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                          <Input 
                            id="firstName"
                            value={resume.personalInfo.firstName}
                            onChange={e => updatePersonalInfo("firstName", e.target.value)}
                            className="mt-1 bg-black/60 border-white/10 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                          <Input 
                            id="lastName"
                            value={resume.personalInfo.lastName}
                            onChange={e => updatePersonalInfo("lastName", e.target.value)}
                            className="mt-1 bg-black/60 border-white/10 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-gray-300">Email</Label>
                          <Input 
                            id="email"
                            type="email"
                            value={resume.personalInfo.email}
                            onChange={e => updatePersonalInfo("email", e.target.value)}
                            className="mt-1 bg-black/60 border-white/10 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-gray-300">Phone</Label>
                          <Input 
                            id="phone"
                            value={resume.personalInfo.phone}
                            onChange={e => updatePersonalInfo("phone", e.target.value)}
                            className="mt-1 bg-black/60 border-white/10 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="headline" className="text-gray-300">Professional Headline</Label>
                      <Input 
                        id="headline"
                        value={resume.personalInfo.headline}
                        onChange={e => updatePersonalInfo("headline", e.target.value)}
                        className="mt-1 bg-black/60 border-white/10 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="e.g., Senior Software Engineer | Front-End Specialist | React & TypeScript Expert"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="summary" className="text-gray-300">Professional Summary</Label>
                      <Textarea 
                        id="summary"
                        value={resume.personalInfo.summary}
                        onChange={e => updatePersonalInfo("summary", e.target.value)}
                        className="mt-1 min-h-32 bg-black/60 border-white/10 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Write a concise summary of your professional background, key skills, and career achievements."
                      />
                    </div>
                  </div>
                  
                  {/* AI Assistant Section */}
                  <div className="md:col-span-1">
                    <div className="cosmic-card border border-white/10 bg-black/40 p-5 rounded-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                      <div className="relative z-10">
                        <div className="flex items-center mb-4">
                          <Cpu className="h-5 w-5 mr-2 text-blue-400 animate-pulse" />
                          <h3 className="font-medium text-white">AI Resume Assistant</h3>
                        </div>
                        
                        <Collapsible className="mb-4">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-medium text-blue-300 mb-2">
                              Generate Professional Summary
                            </h4>
                            <CollapsibleTrigger className="text-xs text-gray-400 hover:text-gray-200">
                              <ChevronDown className="h-4 w-4" />
                            </CollapsibleTrigger>
                          </div>
                          <CollapsibleContent>
                            <div className="mt-2">
                              <SummarySuggestions 
                                resumeId={resumeId?.toString() || "new"}
                                onApply={handleApplySummary}
                              />
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                        
                        <div className="text-xs text-gray-300 mt-3 bg-white/5 p-3 rounded-lg">
                          <p className="mb-2 text-blue-300 font-medium">Tips for a great summary:</p>
                          <ul className="list-disc pl-4 space-y-1">
                            <li>Keep it concise (3-5 sentences)</li>
                            <li>Highlight your most relevant experience</li>
                            <li>Focus on achievements rather than responsibilities</li>
                            <li>Include keywords relevant to your target position</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Experience Section */}
              {activeSection === "experience" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-white flex items-center">
                        <Briefcase className="h-5 w-5 mr-2 text-blue-400" />
                        Work Experience
                      </h2>
                      <Button 
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newExperience: ExperienceItem = {
                            id: `exp-${Date.now()}`,
                            title: "Position Title",
                            company: "Company Name",
                            startDate: "",
                            endDate: "",
                            description: ""
                          };
                          
                          setResume({
                            ...resume,
                            experience: [...resume.experience, newExperience]
                          });
                        }}
                        className="flex items-center space-x-1 border-white/10 text-blue-400 hover:bg-white/10 hover:text-white"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Experience</span>
                      </Button>
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
                  
                  {/* AI Assistant for Experience */}
                  <div className="md:col-span-1">
                    <div className="cosmic-card border border-white/10 bg-black/40 p-5 rounded-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                      <div className="relative z-10">
                        <div className="flex items-center mb-4">
                          <Cpu className="h-5 w-5 mr-2 text-blue-400 animate-pulse" />
                          <h3 className="font-medium text-white">AI Resume Assistant</h3>
                        </div>
                        
                        <Collapsible className="mb-4">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-medium text-blue-300 mb-2">
                              Generate Achievement Bullets
                            </h4>
                            <CollapsibleTrigger className="text-xs text-gray-400 hover:text-gray-200">
                              <ChevronDown className="h-4 w-4" />
                            </CollapsibleTrigger>
                          </div>
                          <CollapsibleContent>
                            <div className="mt-2">
                              <ExperienceSuggestions 
                                resumeId={resumeId?.toString() || "new"}
                                jobTitle={resume.experience.length > 0 ? resume.experience[resume.experience.length - 1].title : undefined}
                                onApply={handleApplyBulletPoint}
                              />
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                        
                        <div className="text-xs text-gray-300 mt-3 bg-white/5 p-3 rounded-lg">
                          <p className="mb-2 text-blue-300 font-medium">Tips for effective bullet points:</p>
                          <ul className="list-disc pl-4 space-y-1">
                            <li>Start with strong action verbs</li>
                            <li>Include metrics and achievements</li>
                            <li>Use industry-specific keywords</li>
                            <li>Highlight results, not just responsibilities</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Education Section */}
              {activeSection === "education" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2 text-blue-400" />
                      Education
                    </h2>
                    <Button 
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newEducation: EducationItem = {
                          id: `edu-${Date.now()}`,
                          degree: "Degree Name",
                          institution: "Institution Name",
                          startDate: "",
                          endDate: "",
                          description: ""
                        };
                        
                        setResume({
                          ...resume,
                          education: [...resume.education, newEducation]
                        });
                      }}
                      className="flex items-center space-x-1 border-white/10 text-blue-400 hover:bg-white/10 hover:text-white"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Education</span>
                    </Button>
                  </div>
                  
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-white flex items-center">
                        <Code className="h-5 w-5 mr-2 text-blue-400" />
                        Skills
                      </h2>
                      <Button 
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newSkill: SkillItem = {
                            id: `skill-${Date.now()}`,
                            name: "New Skill",
                            proficiency: 3
                          };
                          
                          setResume({
                            ...resume,
                            skills: [...resume.skills, newSkill]
                          });
                        }}
                        className="flex items-center space-x-1 border-white/10 text-blue-400 hover:bg-white/10 hover:text-white"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Skill</span>
                      </Button>
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
                  
                  {/* AI Assistant for Skills */}
                  <div className="md:col-span-1">
                    <div className="cosmic-card border border-white/10 bg-black/40 p-5 rounded-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                      <div className="relative z-10">
                        <div className="flex items-center mb-4">
                          <Cpu className="h-5 w-5 mr-2 text-blue-400 animate-pulse" />
                          <h3 className="font-medium text-white">AI Resume Assistant</h3>
                        </div>
                        
                        <Collapsible className="mb-4">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-medium text-blue-300 mb-2">
                              Suggested Skills
                            </h4>
                            <CollapsibleTrigger className="text-xs text-gray-400 hover:text-gray-200">
                              <ChevronDown className="h-4 w-4" />
                            </CollapsibleTrigger>
                          </div>
                          <CollapsibleContent>
                            <div className="mt-2">
                              <SkillSuggestions 
                                resumeId={resumeId?.toString() || "new"}
                                jobTitle={resume.experience.length > 0 ? resume.experience[0].title : undefined}
                                onApply={handleApplySkill}
                              />
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                        
                        <div className="text-xs text-gray-300 mt-3 bg-white/5 p-3 rounded-lg">
                          <p className="mb-2 text-blue-300 font-medium">Tips for showcasing skills:</p>
                          <ul className="list-disc pl-4 space-y-1">
                            <li>Include a mix of technical and soft skills</li>
                            <li>Prioritize skills mentioned in job descriptions</li>
                            <li>Be honest about your proficiency levels</li>
                            <li>Group similar skills together</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Projects Section */}
              {activeSection === "projects" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white flex items-center">
                      <FolderKanban className="h-5 w-5 mr-2 text-blue-400" />
                      Projects
                    </h2>
                    <Button 
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newProject: ProjectItem = {
                          id: `proj-${Date.now()}`,
                          title: "Project Name",
                          description: "",
                          technologies: []
                        };
                        
                        setResume({
                          ...resume,
                          projects: [...resume.projects, newProject]
                        });
                      }}
                      className="flex items-center space-x-1 border-white/10 text-blue-400 hover:bg-white/10 hover:text-white"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Project</span>
                    </Button>
                  </div>
                  
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
                <div className="text-white">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-white flex items-center">
                      <Maximize2 className="h-5 w-5 mr-2 text-blue-400" />
                      Resume Preview
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-400 hover:bg-white/10 hover:text-white border border-white/10"
                      onClick={() => window.print()}
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Print/Save PDF
                    </Button>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 shadow-xl">
                    <ResumePreview resume={resume} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}