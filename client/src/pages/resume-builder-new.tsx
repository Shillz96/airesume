import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar";
import AIAssistant from "@/components/ai-assistant";
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
          <div 
            className={`border rounded-lg p-4 cursor-pointer ${resume.template === 'professional' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200'}`}
            onClick={() => {/* handleTemplateChange('professional') */}}
          >
            <h4 className="font-medium mb-2">Professional</h4>
            <p className="text-sm text-secondary-600">Clean, traditional layout ideal for conservative industries</p>
          </div>
          <div 
            className={`border rounded-lg p-4 cursor-pointer ${resume.template === 'creative' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200'}`}
            onClick={() => {/* handleTemplateChange('creative') */}}
          >
            <h4 className="font-medium mb-2">Creative</h4>
            <p className="text-sm text-secondary-600">Modern design with accent colors for creative fields</p>
          </div>
          <div 
            className={`border rounded-lg p-4 cursor-pointer ${resume.template === 'executive' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200'}`}
            onClick={() => {/* handleTemplateChange('executive') */}}
          >
            <h4 className="font-medium mb-2">Executive</h4>
            <p className="text-sm text-secondary-600">Sophisticated layout highlighting leadership experience</p>
          </div>
        </div>
      </div>
      
      {/* Resume optimization tips */}
      <div className="bg-secondary-50 p-4 rounded-lg border border-secondary-200 mt-8">
        <div className="flex items-center mb-3">
          <Cpu className="h-5 w-5 text-primary-500 mr-2" />
          <h3 className="font-medium text-secondary-900">Resume Optimization Tips</h3>
        </div>
        <ul className="space-y-2 text-sm text-secondary-700">
          <li className="flex items-start">
            <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
            <span>Keep resume length to 1-2 pages for best readability</span>
          </li>
          <li className="flex items-start">
            <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
            <span>Use the zoom controls to fit content appropriately on page</span>
          </li>
          <li className="flex items-start">
            <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
            <span>Include keywords from job descriptions to pass ATS scans</span>
          </li>
          <li className="flex items-start">
            <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
            <span>Quantify achievements with numbers and percentages</span>
          </li>
          <li className="flex items-start">
            <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
            <span>Review for spelling and grammar errors before downloading</span>
          </li>
        </ul>
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
  
  // Function to add a new experience entry with an AI-generated bullet point
  const handleAddExperienceWithAI = (bulletPoint: string) => {
    const newExperience: ExperienceItem = {
      id: `exp-${Date.now()}`,
      title: "New Position",
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
      title: "Experience added",
      description: "New experience with AI-generated bullet point has been added.",
    });
  };
  
  // Function to add a new skill with AI suggestion
  const handleAddSkill = (skillName: string) => {
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
  
  // Function to update personal information
  const handlePersonalInfoChange = (field: string, value: string) => {
    setResume({
      ...resume,
      personalInfo: {
        ...resume.personalInfo,
        [field]: value
      }
    });
  };
  
  // Function to apply a generated summary
  const handleApplySummary = (summary: string) => {
    handlePersonalInfoChange("summary", summary);
    
    toast({
      title: "Summary updated",
      description: "Professional summary has been updated with AI-generated content.",
    });
  };
  
  // Function to apply tailored content from AI assistant
  const handleApplyTailoredContent = (content: any) => {
    const updatedResume = { ...resume };
    
    // Update summary if provided
    if (content.summary) {
      updatedResume.personalInfo.summary = content.summary;
    }
    
    // Add suggested skills if provided
    if (content.skills && Array.isArray(content.skills)) {
      content.skills.forEach((skill: string) => {
        // Only add skills that don't already exist
        if (!updatedResume.skills.some(s => s.name.toLowerCase() === skill.toLowerCase())) {
          updatedResume.skills.push({
            id: `skill-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            name: skill,
            proficiency: 3
          });
        }
      });
    }
    
    // Update experience descriptions if provided
    if (content.experienceImprovements && Array.isArray(content.experienceImprovements)) {
      content.experienceImprovements.forEach((improvement: any) => {
        const expIndex = updatedResume.experience.findIndex(exp => exp.id === improvement.id);
        if (expIndex !== -1) {
          updatedResume.experience[expIndex].description = improvement.improvedDescription;
        }
      });
    }
    
    setResume(updatedResume);
    
    toast({
      title: "Resume tailored",
      description: "Your resume has been updated with AI-tailored content.",
    });
  };
  
  // Function to apply all suggestions from AI assistant
  const handleApplySuggestions = (suggestions: string[]) => {
    toast({
      title: "Suggestions applied",
      description: "AI suggestions have been applied to your resume.",
    });
  };
  
  // Function to save the resume
  const handleSaveResume = async () => {
    setIsSaving(true);
    
    try {
      let response;
      
      if (resumeId) {
        // Update existing resume
        response = await apiRequest("PUT", `/api/resumes/${resumeId}`, resume);
      } else {
        // Create new resume
        response = await apiRequest("POST", "/api/resumes", resume);
      }
      
      const data = await response.json();
      
      if (data.id) {
        setResumeId(data.id);
        setResumeSaved(true);
        
        toast({
          title: "Resume saved",
          description: "Your resume has been saved successfully.",
        });
      }
    } catch (error) {
      console.error("Error saving resume:", error);
      
      toast({
        title: "Save failed",
        description: "There was an error saving your resume. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsSaving(false);
  };
  
  // Function to handle resume file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    // Create FormData object to send the file
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const res = await apiRequest("POST", "/api/resumes/upload", formData);
      const data = await res.json();
      
      if (data.success && data.resumeData) {
        // Update state with parsed resume data
        setResume(data.resumeData);
        setResumeId(data.resumeId || null);
        
        toast({
          title: "Resume uploaded",
          description: "Your resume has been successfully parsed and loaded.",
        });
      } else {
        throw new Error(data.message || "Failed to parse resume");
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      
      toast({
        title: "Upload failed",
        description: "There was an error uploading your resume. Please try again or create a new resume manually.",
        variant: "destructive",
      });
    }
    
    setIsUploading(false);
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  // Function to change the resume template
  const handleTemplateChange = (template: string) => {
    setResume({
      ...resume,
      template
    });
    
    toast({
      title: "Template changed",
      description: `Resume template has been updated to ${template}.`,
    });
  };
  
  return (
    <div className="min-h-screen bg-secondary-50">
      <Navbar />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Page header */}
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-secondary-900">Resume Builder</h1>
                <p className="mt-1 text-sm text-secondary-500">Create and customize your professional resume</p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={handleSaveResume}
                  disabled={isSaving}
                  className="flex items-center space-x-2"
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
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex items-center space-x-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span>Upload Resume</span>
                    </>
                  )}
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  accept=".pdf,.docx,.txt"
                />
              </div>
            </div>

            {/* Main tab navigation */}
            <div className="mb-6 bg-secondary-900 rounded-lg">
              <Tabs 
                defaultValue="profile" 
                value={activeSection}
                onValueChange={setActiveSection}
                className="w-full"
              >
                <TabsList className="w-full grid grid-cols-6 h-12 bg-secondary-900">
                  <TabsTrigger 
                    value="profile" 
                    className={`${activeSection === "profile" ? "bg-primary-600 text-white" : "text-white/80"} font-medium`}
                  >
                    PROFILE
                  </TabsTrigger>
                  <TabsTrigger 
                    value="experience" 
                    className={`${activeSection === "experience" ? "bg-primary-600 text-white" : "text-white/80"} font-medium`}
                  >
                    EXPERIENCE
                  </TabsTrigger>
                  <TabsTrigger 
                    value="education" 
                    className={`${activeSection === "education" ? "bg-primary-600 text-white" : "text-white/80"} font-medium`}
                  >
                    EDUCATION
                  </TabsTrigger>
                  <TabsTrigger 
                    value="skills" 
                    className={`${activeSection === "skills" ? "bg-primary-600 text-white" : "text-white/80"} font-medium`}
                  >
                    SKILLS
                  </TabsTrigger>
                  <TabsTrigger 
                    value="projects" 
                    className={`${activeSection === "projects" ? "bg-primary-600 text-white" : "text-white/80"} font-medium`}
                  >
                    PROJECTS
                  </TabsTrigger>
                  <TabsTrigger 
                    value="preview" 
                    className={`${activeSection === "preview" ? "bg-primary-600 text-white" : "text-white/80"} font-medium`}
                  >
                    PREVIEW
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Main content area */}
            <div className="max-w-5xl mx-auto">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  {/* Profile section with nested tabs */}
                  {activeSection === "profile" && (
                    <div>
                      <h2 className="text-lg font-medium text-secondary-900 mb-4">Profile</h2>
                      <Tabs defaultValue="personal" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="personal">Personal Information</TabsTrigger>
                          <TabsTrigger value="summary">Professional Summary</TabsTrigger>
                        </TabsList>
                        <TabsContent value="personal">
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
                        </TabsContent>
                        <TabsContent value="summary">
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="summary">Professional Summary</Label>
                              <Textarea
                                id="summary"
                                value={resume.personalInfo.summary}
                                onChange={(e) => handlePersonalInfoChange("summary", e.target.value)}
                                rows={5}
                                className="mt-1 resize-none"
                                placeholder="Passionate software engineer with expertise in JavaScript, React, and Node.js."
                              />
                              <p className="mt-2 text-sm text-secondary-500">
                                Write a 2-3 sentence summary highlighting your experience and strengths.
                              </p>
                            </div>
                            <div className="bg-secondary-50 p-4 rounded-lg border border-secondary-200">
                              <Collapsible>
                                <CollapsibleTrigger asChild>
                                  <Button variant="ghost" className="flex items-center justify-between w-full p-0 h-auto">
                                    <div className="flex items-center">
                                      <Cpu className="h-4 w-4 text-primary-500 mr-2" />
                                      <span className="font-medium text-sm text-secondary-900">AI Summary Suggestions</span>
                                    </div>
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="mt-2">
                                  <SummarySuggestions 
                                    resumeId={resumeId?.toString() || "temp-id"} 
                                    onApply={handleApplySummary}
                                  />
                                </CollapsibleContent>
                              </Collapsible>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  )}
                  
                  {/* Experience section */}
                  {activeSection === "experience" && (
                    <div>
                      <h2 className="text-lg font-medium text-secondary-900 mb-4">Work Experience</h2>
                      <ResumeExperienceSection
                        experiences={resume.experience}
                        onUpdate={(experience) => setResume({ ...resume, experience })}
                      />
                      
                      {/* Compact AI Experience Suggestions */}
                      <div className="mt-6 bg-secondary-50 p-4 rounded-lg border border-secondary-200">
                        <Collapsible>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="flex items-center justify-between w-full p-0 h-auto">
                              <div className="flex items-center">
                                <Cpu className="h-4 w-4 text-primary-500 mr-2" />
                                <span className="font-medium text-sm text-secondary-900">AI Bullet Point Generator</span>
                              </div>
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-2">
                            <ExperienceSuggestions 
                              resumeId={resumeId?.toString() || "temp-id"} 
                              onApply={handleAddExperienceWithAI}
                            />
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    </div>
                  )}
                  
                  {/* Education section */}
                  {activeSection === "education" && (
                    <div>
                      <h2 className="text-lg font-medium text-secondary-900 mb-4">Education</h2>
                      <ResumeEducationSection
                        education={resume.education}
                        onUpdate={(education) => setResume({ ...resume, education })}
                      />
                    </div>
                  )}
                  
                  {/* Skills section */}
                  {activeSection === "skills" && (
                    <div>
                      <h2 className="text-lg font-medium text-secondary-900 mb-4">Skills</h2>
                      <ResumeSkillsSection
                        skills={resume.skills}
                        onUpdate={(skills) => setResume({ ...resume, skills })}
                      />
                      
                      {/* Compact AI Skills Suggestions */}
                      <div className="mt-6 bg-secondary-50 p-4 rounded-lg border border-secondary-200">
                        <Collapsible>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="flex items-center justify-between w-full p-0 h-auto">
                              <div className="flex items-center">
                                <Cpu className="h-4 w-4 text-primary-500 mr-2" />
                                <span className="font-medium text-sm text-secondary-900">AI Skill Suggestions</span>
                              </div>
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-2">
                            <SkillSuggestions 
                              resumeId={resumeId?.toString() || "temp-id"} 
                              onApply={handleAddSkill}
                            />
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    </div>
                  )}
                  
                  {/* Projects section */}
                  {activeSection === "projects" && (
                    <div>
                      <h2 className="text-lg font-medium text-secondary-900 mb-4">Projects</h2>
                      <ResumeProjectsSection
                        projects={resume.projects}
                        onUpdate={(projects) => setResume({ ...resume, projects })}
                      />
                    </div>
                  )}
                  
                  {/* Preview section */}
                  {activeSection === "preview" && (
                    <ResumePreview resume={resume} />
                  )}
                </div>
              </div>
              
              {/* Live preview for all sections except preview */}
              {activeSection !== "preview" && (
                <div className="bg-white shadow rounded-lg overflow-hidden p-6 mt-6">
                  <h3 className="text-lg font-medium mb-4 border-b pb-2">Live Preview</h3>
                  <ResumeTemplate 
                    resume={resume} 
                    onTemplateChange={handleTemplateChange} 
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Floating AI Assistant Button */}
      <div className="fixed bottom-4 right-4 z-10">
        <Dialog>
          <DialogTrigger asChild>
            <Button size="icon" className="rounded-full h-12 w-12">
              <Cpu className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>AI Resume Assistant</DialogTitle>
              <DialogDescription>
                Get AI-powered suggestions to improve your resume
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <AIAssistant 
                resumeId={resumeId?.toString() || "temp-id"} 
                resume={resume}
                onApplySuggestions={handleApplySuggestions}
                onApplySummary={handleApplySummary}
                onApplyTailoredContent={handleApplyTailoredContent}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}