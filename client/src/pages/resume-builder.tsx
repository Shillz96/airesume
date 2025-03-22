import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useParams, useLocation, useNavigate } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Download,
  Eye,
  Sparkles,
  MessageSquare,
  Check,
  FileText,
  PlusCircle,
  MinusCircle,
  AlertCircle,
  ChevronDown,
  Layout,
  Palette,
  Layers
} from "lucide-react";
import {
  ProfessionalTemplate,
  ModernTemplate,
  MinimalTemplate,
  CreativeTemplate,
  ExecutiveTemplate,
  IndustryTemplate,
  BoldTemplate,
} from "@/components/resume-template";
import PageHeader from "@/components/page-header";
import CosmicBackground from "@/components/cosmic-background";

// Types
export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface SkillItem {
  id: string;
  name: string;
  proficiency: number;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface Resume {
  id?: string;
  title: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    headline: string;
    summary: string;
    location?: string;
    website?: string;
    linkedin?: string;
  };
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  template: string;
  skillsDisplayMode: "bubbles" | "bullets";
}

// Stages for the conversational flow
type BuilderStage = 
  | "personal-info" 
  | "experience" 
  | "experience-details" 
  | "education" 
  | "education-details" 
  | "skills" 
  | "projects" 
  | "project-details" 
  | "template";

export default function ResumeBuilder() {
  const { user } = useAuth();
  const [, params] = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // State variables
  const [currentResume, setCurrentResume] = useState<Resume>({
    title: "My Professional Resume",
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      headline: "",
      summary: "",
      location: "",
      website: "",
      linkedin: ""
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    template: "professional",
    skillsDisplayMode: "bubbles"
  });
  
  const [currentStage, setCurrentStage] = useState<BuilderStage>("personal-info");
  const [currentItemIndex, setCurrentItemIndex] = useState<number>(-1);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [aiSuggestion, setAiSuggestion] = useState<string>("");
  const [showAiChat, setShowAiChat] = useState<boolean>(false);
  const [showTips, setShowTips] = useState<boolean>(true);
  const [previewScale, setPreviewScale] = useState<number>(1);

  // Resume ID from URL if present
  const resumeId = params?.id;

  // Fetch resume if ID is provided
  const { data: resumeData, isLoading: isLoadingResume } = useQuery({
    queryKey: ['/api/resumes', resumeId],
    enabled: !!resumeId,
  });

  // Load existing resume data if available
  useEffect(() => {
    if (resumeData && !isLoadingResume) {
      setCurrentResume(resumeData);
    }
  }, [resumeData, isLoadingResume]);

  // Save resume mutation
  const saveResumeMutation = useMutation({
    mutationFn: async () => {
      if (resumeId) {
        return apiRequest(`/api/resumes/${resumeId}`, {
          method: 'PATCH',
          body: JSON.stringify(currentResume)
        });
      } else {
        return apiRequest('/api/resumes', {
          method: 'POST',
          body: JSON.stringify(currentResume)
        });
      }
    },
    onSuccess: (data) => {
      toast({
        title: resumeId ? "Resume updated" : "Resume created",
        description: "Your resume has been successfully saved.",
        variant: "default",
      });
      if (!resumeId && data.id) {
        navigate(`/resume-builder/${data.id}`);
      }
      queryClient.invalidateQueries({ queryKey: ['/api/resumes'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to save resume: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Handle save resume
  const handleSaveResume = () => {
    saveResumeMutation.mutate();
  };

  // Generate contextual questions based on the current stage
  useEffect(() => {
    switch (currentStage) {
      case "personal-info":
        if (!currentResume.personalInfo.firstName) {
          setCurrentQuestion("What is your first name?");
        } else if (!currentResume.personalInfo.lastName) {
          setCurrentQuestion("What is your last name?");
        } else if (!currentResume.personalInfo.email) {
          setCurrentQuestion("What is your email address?");
        } else if (!currentResume.personalInfo.phone) {
          setCurrentQuestion("What is your phone number?");
        } else if (!currentResume.personalInfo.headline) {
          setCurrentQuestion("What is your professional headline? (e.g., Senior Software Engineer)");
        } else if (!currentResume.personalInfo.location) {
          setCurrentQuestion("Where are you located? (City, State)");
        } else if (!currentResume.personalInfo.summary) {
          setCurrentQuestion("Write a brief professional summary about yourself.");
          setAiSuggestion("Include your years of experience, key skills, and what makes you unique in your field.");
        } else {
          setCurrentQuestion("Would you like to add any work experience?");
        }
        break;
      
      case "experience":
        setCurrentQuestion("Let's add your work experience. What was your job title?");
        setAiSuggestion("Use a specific title that clearly represents your role, like 'Frontend Developer' rather than just 'Developer'.");
        break;
      
      case "experience-details":
        const exp = currentResume.experience[currentItemIndex];
        if (!exp.company) {
          setCurrentQuestion("What company did you work for?");
        } else if (!exp.startDate) {
          setCurrentQuestion("When did you start working there? (MM/YYYY)");
        } else if (!exp.endDate) {
          setCurrentQuestion("When did you finish working there? (MM/YYYY or 'Present')");
        } else if (!exp.description || exp.description.length < 10) {
          setCurrentQuestion("Describe your role and responsibilities.");
          setAiSuggestion("Focus on achievements with measurable results rather than just listing duties.");
        } else if (!exp.bullets || exp.bullets.length === 0) {
          setCurrentQuestion("Add some key accomplishments as bullet points.");
          setAiSuggestion("Start each bullet with a strong action verb like 'Developed', 'Managed', or 'Increased'.");
        } else {
          setCurrentQuestion("Would you like to add another work experience?");
        }
        break;
      
      case "education":
        setCurrentQuestion("Let's add your education. What degree or certification did you receive?");
        break;
      
      case "education-details":
        const edu = currentResume.education[currentItemIndex];
        if (!edu.institution) {
          setCurrentQuestion("What school, college, or university did you attend?");
        } else if (!edu.startDate) {
          setCurrentQuestion("When did you start? (MM/YYYY)");
        } else if (!edu.endDate) {
          setCurrentQuestion("When did you graduate? (MM/YYYY or 'Present')");
        } else if (!edu.description) {
          setCurrentQuestion("Add any relevant details about your education.");
          setAiSuggestion("You might include your GPA, honors, relevant coursework, or activities.");
        } else {
          setCurrentQuestion("Would you like to add another education entry?");
        }
        break;
      
      case "skills":
        setCurrentQuestion("What are your top professional skills?");
        setAiSuggestion("Include both technical skills (like programming languages) and soft skills (like leadership).");
        break;
      
      case "projects":
        setCurrentQuestion("Would you like to add any projects to your resume?");
        break;
      
      case "project-details":
        const project = currentResume.projects[currentItemIndex];
        if (!project.description) {
          setCurrentQuestion("Describe this project briefly.");
        } else if (!project.technologies || project.technologies.length === 0) {
          setCurrentQuestion("What technologies or skills did you use in this project?");
        } else {
          setCurrentQuestion("Would you like to add another project?");
        }
        break;
      
      case "template":
        setCurrentQuestion("Choose a template for your resume.");
        break;
      
      default:
        setCurrentQuestion("What would you like to work on next?");
    }
  }, [currentStage, currentItemIndex, currentResume]);

  // Handle moving to the next stage
  const handleNext = () => {
    if (currentStage === "personal-info") {
      if (currentResume.personalInfo.firstName && 
          currentResume.personalInfo.lastName && 
          currentResume.personalInfo.email) {
        setCurrentStage("experience");
        setCurrentItemIndex(-1);
      } else {
        toast({
          title: "Required Information Missing",
          description: "Please fill in your name and email before continuing.",
          variant: "destructive",
        });
      }
    } else if (currentStage === "experience") {
      // Create a new experience item and move to details
      const newExp: ExperienceItem = {
        id: `exp-${Date.now()}`,
        title: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
        bullets: []
      };
      setCurrentResume(prev => ({
        ...prev,
        experience: [...prev.experience, newExp]
      }));
      setCurrentItemIndex(currentResume.experience.length);
      setCurrentStage("experience-details");
    } else if (currentStage === "experience-details") {
      const exp = currentResume.experience[currentItemIndex];
      if (exp.title && exp.company && exp.startDate) {
        // Experience is complete, go back to experience list or to education
        if (currentItemIndex < currentResume.experience.length - 1) {
          setCurrentItemIndex(currentItemIndex + 1);
        } else {
          setCurrentStage("education");
          setCurrentItemIndex(-1);
        }
      } else {
        toast({
          title: "Required Information Missing",
          description: "Please fill in job title, company, and dates before continuing.",
          variant: "destructive",
        });
      }
    } else if (currentStage === "education") {
      // Create a new education item and move to details
      const newEdu: EducationItem = {
        id: `edu-${Date.now()}`,
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
        description: ""
      };
      setCurrentResume(prev => ({
        ...prev,
        education: [...prev.education, newEdu]
      }));
      setCurrentItemIndex(currentResume.education.length);
      setCurrentStage("education-details");
    } else if (currentStage === "education-details") {
      const edu = currentResume.education[currentItemIndex];
      if (edu.degree && edu.institution) {
        // Education is complete, go back to education list or to skills
        if (currentItemIndex < currentResume.education.length - 1) {
          setCurrentItemIndex(currentItemIndex + 1);
        } else {
          setCurrentStage("skills");
          setCurrentItemIndex(-1);
        }
      } else {
        toast({
          title: "Required Information Missing",
          description: "Please fill in degree and school before continuing.",
          variant: "destructive",
        });
      }
    } else if (currentStage === "skills") {
      setCurrentStage("projects");
      setCurrentItemIndex(-1);
    } else if (currentStage === "projects") {
      // Create a new project item and move to details
      const newProject: ProjectItem = {
        id: `proj-${Date.now()}`,
        title: "",
        description: "",
        technologies: []
      };
      setCurrentResume(prev => ({
        ...prev,
        projects: [...prev.projects, newProject]
      }));
      setCurrentItemIndex(currentResume.projects.length);
      setCurrentStage("project-details");
    } else if (currentStage === "project-details") {
      const project = currentResume.projects[currentItemIndex];
      if (project.title && project.description) {
        // Project is complete, go back to project list or to template
        if (currentItemIndex < currentResume.projects.length - 1) {
          setCurrentItemIndex(currentItemIndex + 1);
        } else {
          setCurrentStage("template");
          setCurrentItemIndex(-1);
        }
      } else {
        toast({
          title: "Required Information Missing",
          description: "Please fill in project title and description before continuing.",
          variant: "destructive",
        });
      }
    } else if (currentStage === "template") {
      // Complete - go to review or save
      handleSaveResume();
    }
  };

  // Handle moving to the previous stage
  const handlePrevious = () => {
    if (currentStage === "experience") {
      setCurrentStage("personal-info");
    } else if (currentStage === "experience-details") {
      if (currentItemIndex > 0) {
        setCurrentItemIndex(currentItemIndex - 1);
      } else {
        setCurrentStage("experience");
      }
    } else if (currentStage === "education") {
      setCurrentStage("experience");
      if (currentResume.experience.length > 0) {
        setCurrentItemIndex(currentResume.experience.length - 1);
      }
    } else if (currentStage === "education-details") {
      if (currentItemIndex > 0) {
        setCurrentItemIndex(currentItemIndex - 1);
      } else {
        setCurrentStage("education");
      }
    } else if (currentStage === "skills") {
      setCurrentStage("education");
      if (currentResume.education.length > 0) {
        setCurrentItemIndex(currentResume.education.length - 1);
      }
    } else if (currentStage === "projects") {
      setCurrentStage("skills");
    } else if (currentStage === "project-details") {
      if (currentItemIndex > 0) {
        setCurrentItemIndex(currentItemIndex - 1);
      } else {
        setCurrentStage("projects");
      }
    } else if (currentStage === "template") {
      setCurrentStage("projects");
      if (currentResume.projects.length > 0) {
        setCurrentItemIndex(currentResume.projects.length - 1);
      }
    }
  };

  // Handle template change
  const handleTemplateChange = (template: string) => {
    setCurrentResume(prev => ({
      ...prev,
      template
    }));
  };

  // Handle toggle skills display mode
  const handleToggleSkillsDisplay = () => {
    setCurrentResume(prev => ({
      ...prev,
      skillsDisplayMode: prev.skillsDisplayMode === "bubbles" ? "bullets" : "bubbles"
    }));
  };

  // Handle input changes for personal info
  const handlePersonalInfoChange = (field: string, value: string) => {
    setCurrentResume(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  // Handle experience changes
  const handleExperienceChange = (index: number, field: string, value: string) => {
    setCurrentResume(prev => {
      const updatedExperience = [...prev.experience];
      updatedExperience[index] = {
        ...updatedExperience[index],
        [field]: value
      };
      return {
        ...prev,
        experience: updatedExperience
      };
    });
  };

  // Handle bullet point changes
  const handleBulletChange = (expIndex: number, bulletIndex: number, value: string) => {
    setCurrentResume(prev => {
      const updatedExperience = [...prev.experience];
      const updatedBullets = [...(updatedExperience[expIndex].bullets || [])];
      updatedBullets[bulletIndex] = value;
      updatedExperience[expIndex] = {
        ...updatedExperience[expIndex],
        bullets: updatedBullets
      };
      return {
        ...prev,
        experience: updatedExperience
      };
    });
  };

  // Add a new bullet point
  const handleAddBullet = (expIndex: number) => {
    setCurrentResume(prev => {
      const updatedExperience = [...prev.experience];
      const updatedBullets = [...(updatedExperience[expIndex].bullets || []), ""];
      updatedExperience[expIndex] = {
        ...updatedExperience[expIndex],
        bullets: updatedBullets
      };
      return {
        ...prev,
        experience: updatedExperience
      };
    });
  };

  // Remove a bullet point
  const handleRemoveBullet = (expIndex: number, bulletIndex: number) => {
    setCurrentResume(prev => {
      const updatedExperience = [...prev.experience];
      const updatedBullets = [...(updatedExperience[expIndex].bullets || [])];
      updatedBullets.splice(bulletIndex, 1);
      updatedExperience[expIndex] = {
        ...updatedExperience[expIndex],
        bullets: updatedBullets
      };
      return {
        ...prev,
        experience: updatedExperience
      };
    });
  };

  // Handle education changes
  const handleEducationChange = (index: number, field: string, value: string) => {
    setCurrentResume(prev => {
      const updatedEducation = [...prev.education];
      updatedEducation[index] = {
        ...updatedEducation[index],
        [field]: value
      };
      return {
        ...prev,
        education: updatedEducation
      };
    });
  };

  // Handle skill changes
  const handleSkillChange = (index: number, field: string, value: any) => {
    setCurrentResume(prev => {
      const updatedSkills = [...prev.skills];
      updatedSkills[index] = {
        ...updatedSkills[index],
        [field]: value
      };
      return {
        ...prev,
        skills: updatedSkills
      };
    });
  };

  // Add a new skill
  const handleAddSkill = (skillName: string) => {
    const newSkill: SkillItem = {
      id: `skill-${Date.now()}`,
      name: skillName,
      proficiency: 3
    };
    setCurrentResume(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  // Remove a skill
  const handleRemoveSkill = (index: number) => {
    setCurrentResume(prev => {
      const updatedSkills = [...prev.skills];
      updatedSkills.splice(index, 1);
      return {
        ...prev,
        skills: updatedSkills
      };
    });
  };

  // Handle project changes
  const handleProjectChange = (index: number, field: string, value: any) => {
    setCurrentResume(prev => {
      const updatedProjects = [...prev.projects];
      updatedProjects[index] = {
        ...updatedProjects[index],
        [field]: value
      };
      return {
        ...prev,
        projects: updatedProjects
      };
    });
  };

  // Add a technology to a project
  const handleAddTechnology = (projIndex: number, tech: string) => {
    setCurrentResume(prev => {
      const updatedProjects = [...prev.projects];
      const updatedTechs = [...(updatedProjects[projIndex].technologies || []), tech];
      updatedProjects[projIndex] = {
        ...updatedProjects[projIndex],
        technologies: updatedTechs
      };
      return {
        ...prev,
        projects: updatedProjects
      };
    });
  };

  // Remove a technology from a project
  const handleRemoveTechnology = (projIndex: number, techIndex: number) => {
    setCurrentResume(prev => {
      const updatedProjects = [...prev.projects];
      const updatedTechs = [...updatedProjects[projIndex].technologies];
      updatedTechs.splice(techIndex, 1);
      updatedProjects[projIndex] = {
        ...updatedProjects[projIndex],
        technologies: updatedTechs
      };
      return {
        ...prev,
        projects: updatedProjects
      };
    });
  };

  // Zoom handlers
  const zoomIn = () => setPreviewScale(prev => Math.min(prev + 0.1, 1.5));
  const zoomOut = () => setPreviewScale(prev => Math.max(prev - 0.1, 0.5));

  // Download resume as PDF
  const handleDownload = () => {
    toast({
      title: "Downloading resume",
      description: "Preparing your resume for download...",
    });
    // Implement PDF download logic
  };

  // Render the current template
  const renderTemplate = () => {
    switch (currentResume.template) {
      case "professional":
        return <ProfessionalTemplate resume={currentResume} />;
      case "creative":
        return <CreativeTemplate resume={currentResume} />;
      case "executive":
        return <ExecutiveTemplate resume={currentResume} />;
      case "modern":
        return <ModernTemplate resume={currentResume} />;
      case "minimal":
        return <MinimalTemplate resume={currentResume} />;
      case "industry":
        return <IndustryTemplate resume={currentResume} />;
      case "bold":
        return <BoldTemplate resume={currentResume} />;
      default:
        return <ProfessionalTemplate resume={currentResume} />;
    }
  };

  // Render the current input section based on the stage
  const renderInputSection = () => {
    switch (currentStage) {
      case "personal-info":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{currentQuestion}</h3>
            
            {!currentResume.personalInfo.firstName && (
              <Input
                placeholder="First Name"
                value={currentResume.personalInfo.firstName}
                onChange={(e) => handlePersonalInfoChange("firstName", e.target.value)}
                className="bg-opacity-50 backdrop-blur-sm"
              />
            )}
            
            {currentResume.personalInfo.firstName && !currentResume.personalInfo.lastName && (
              <Input
                placeholder="Last Name"
                value={currentResume.personalInfo.lastName}
                onChange={(e) => handlePersonalInfoChange("lastName", e.target.value)}
                className="bg-opacity-50 backdrop-blur-sm"
              />
            )}
            
            {currentResume.personalInfo.firstName && 
             currentResume.personalInfo.lastName && 
             !currentResume.personalInfo.email && (
              <Input
                placeholder="Email"
                type="email"
                value={currentResume.personalInfo.email}
                onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
                className="bg-opacity-50 backdrop-blur-sm"
              />
            )}
            
            {currentResume.personalInfo.email && 
             !currentResume.personalInfo.phone && (
              <Input
                placeholder="Phone Number"
                value={currentResume.personalInfo.phone}
                onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
                className="bg-opacity-50 backdrop-blur-sm"
              />
            )}
            
            {currentResume.personalInfo.phone && 
             !currentResume.personalInfo.headline && (
              <Input
                placeholder="Professional Headline"
                value={currentResume.personalInfo.headline}
                onChange={(e) => handlePersonalInfoChange("headline", e.target.value)}
                className="bg-opacity-50 backdrop-blur-sm"
              />
            )}
            
            {currentResume.personalInfo.headline && 
             !currentResume.personalInfo.location && (
              <Input
                placeholder="Location (City, State)"
                value={currentResume.personalInfo.location}
                onChange={(e) => handlePersonalInfoChange("location", e.target.value)}
                className="bg-opacity-50 backdrop-blur-sm"
              />
            )}
            
            {currentResume.personalInfo.location && 
             !currentResume.personalInfo.summary && (
              <Textarea
                placeholder="Professional Summary"
                value={currentResume.personalInfo.summary}
                onChange={(e) => handlePersonalInfoChange("summary", e.target.value)}
                className="min-h-[120px] bg-opacity-50 backdrop-blur-sm"
              />
            )}
            
            {aiSuggestion && (
              <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-md">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-200">{aiSuggestion}</p>
                </div>
              </div>
            )}
          </div>
        );

      case "experience":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{currentQuestion}</h3>
            <Input
              placeholder="Job Title"
              className="bg-opacity-50 backdrop-blur-sm"
            />
            
            {aiSuggestion && (
              <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-md">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-200">{aiSuggestion}</p>
                </div>
              </div>
            )}
            
            {currentResume.experience.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-blue-100 mb-3">Work Experience Added</h4>
                <div className="space-y-2">
                  {currentResume.experience.map((exp, index) => (
                    <div 
                      key={exp.id} 
                      className="p-3 bg-blue-900/30 border border-blue-800/50 rounded-md flex justify-between items-center"
                      onClick={() => {
                        setCurrentItemIndex(index);
                        setCurrentStage("experience-details");
                      }}
                    >
                      <div>
                        <p className="text-blue-100 font-medium">{exp.title || "Untitled Position"}</p>
                        {exp.company && (
                          <p className="text-sm text-blue-300">{exp.company}</p>
                        )}
                      </div>
                      <ChevronRight className="h-5 w-5 text-blue-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "experience-details":
        const exp = currentResume.experience[currentItemIndex];
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setCurrentStage("experience")}
                className="h-8 w-8 rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-lg font-medium">
                {exp.title ? exp.title : "New Position"}
              </h3>
            </div>
            
            <h4 className="text-sm font-medium text-blue-200">{currentQuestion}</h4>
            
            {!exp.title && (
              <Input
                placeholder="Job Title"
                value={exp.title}
                onChange={(e) => handleExperienceChange(currentItemIndex, "title", e.target.value)}
                className="bg-opacity-50 backdrop-blur-sm"
              />
            )}
            
            {exp.title && !exp.company && (
              <Input
                placeholder="Company Name"
                value={exp.company}
                onChange={(e) => handleExperienceChange(currentItemIndex, "company", e.target.value)}
                className="bg-opacity-50 backdrop-blur-sm"
              />
            )}
            
            {exp.company && !exp.startDate && (
              <Input
                placeholder="Start Date (MM/YYYY)"
                value={exp.startDate}
                onChange={(e) => handleExperienceChange(currentItemIndex, "startDate", e.target.value)}
                className="bg-opacity-50 backdrop-blur-sm"
              />
            )}
            
            {exp.startDate && !exp.endDate && (
              <Input
                placeholder="End Date (MM/YYYY or Present)"
                value={exp.endDate}
                onChange={(e) => handleExperienceChange(currentItemIndex, "endDate", e.target.value)}
                className="bg-opacity-50 backdrop-blur-sm"
              />
            )}
            
            {exp.endDate && (!exp.description || exp.description.length < 10) && (
              <Textarea
                placeholder="Describe your role and responsibilities"
                value={exp.description}
                onChange={(e) => handleExperienceChange(currentItemIndex, "description", e.target.value)}
                className="min-h-[120px] bg-opacity-50 backdrop-blur-sm"
              />
            )}
            
            {exp.description && exp.description.length >= 10 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-blue-200">Key Accomplishments</h4>
                {exp.bullets && exp.bullets.map((bullet, bulletIndex) => (
                  <div key={bulletIndex} className="flex gap-2 items-start">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveBullet(currentItemIndex, bulletIndex)}
                      className="h-6 w-6 rounded-full shrink-0 mt-1"
                    >
                      <MinusCircle className="h-4 w-4 text-red-400" />
                    </Button>
                    <Textarea
                      placeholder={`Accomplishment ${bulletIndex + 1}`}
                      value={bullet}
                      onChange={(e) => handleBulletChange(currentItemIndex, bulletIndex, e.target.value)}
                      className="min-h-[60px] bg-opacity-50 backdrop-blur-sm"
                    />
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => handleAddBullet(currentItemIndex)}
                  className="w-full bg-blue-900/30 border-blue-700/50 text-blue-100"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Bullet Point
                </Button>
              </div>
            )}
            
            {aiSuggestion && (
              <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-md">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-200">{aiSuggestion}</p>
                </div>
              </div>
            )}
          </div>
        );

      case "skills":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{currentQuestion}</h3>
            
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill"
                className="bg-opacity-50 backdrop-blur-sm"
                id="skill-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const input = document.getElementById('skill-input') as HTMLInputElement;
                    if (input.value.trim()) {
                      handleAddSkill(input.value.trim());
                      input.value = '';
                    }
                  }
                }}
              />
              <Button 
                variant="outline"
                onClick={() => {
                  const input = document.getElementById('skill-input') as HTMLInputElement;
                  if (input.value.trim()) {
                    handleAddSkill(input.value.trim());
                    input.value = '';
                  }
                }}
                className="bg-blue-900/30 border-blue-700/50 text-blue-100"
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
            
            {aiSuggestion && (
              <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-md">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-200">{aiSuggestion}</p>
                </div>
              </div>
            )}
            
            {currentResume.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {currentResume.skills.map((skill, index) => (
                  <div 
                    key={skill.id} 
                    className="bg-blue-900/40 border border-blue-700/50 rounded-full px-3 py-1.5 flex items-center gap-2"
                  >
                    <span className="text-sm text-blue-100">{skill.name}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveSkill(index)}
                      className="h-5 w-5 rounded-full p-0"
                    >
                      <MinusCircle className="h-3.5 w-3.5 text-red-400" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "template":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">{currentQuestion}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {["professional", "modern", "minimal", "creative", "executive", "industry", "bold"].map((template) => (
                <div 
                  key={template} 
                  className={cn(
                    "relative rounded-md overflow-hidden border hover:border-blue-400 transition-all cursor-pointer",
                    currentResume.template === template 
                      ? "border-blue-500 ring-2 ring-blue-400/50" 
                      : "border-blue-900/50"
                  )}
                  onClick={() => handleTemplateChange(template)}
                >
                  <div className="aspect-[8.5/11] bg-white relative">
                    <div className="absolute inset-0 p-1 transform scale-[0.98]">
                      {template === "professional" && (
                        <div className="h-full bg-gray-100 p-1">
                          <div className="h-8 bg-blue-500 mb-2"></div>
                          <div className="h-3 w-1/3 bg-gray-300 mb-4"></div>
                          <div className="grid grid-cols-3 gap-1 mb-4">
                            <div className="h-2 bg-gray-300"></div>
                            <div className="h-2 bg-gray-300"></div>
                            <div className="h-2 bg-gray-300"></div>
                          </div>
                          <div className="h-4 bg-gray-300 mb-2 w-1/4"></div>
                          <div className="h-2 bg-gray-300 mb-1"></div>
                          <div className="h-2 bg-gray-300 mb-1"></div>
                          <div className="h-2 bg-gray-300 mb-3"></div>
                          <div className="h-4 bg-gray-300 mb-2 w-1/4"></div>
                          <div className="h-2 bg-gray-300 mb-1"></div>
                          <div className="h-2 bg-gray-300 mb-3"></div>
                        </div>
                      )}
                      {template === "modern" && (
                        <div className="h-full bg-white p-1">
                          <div className="grid grid-cols-3 h-full">
                            <div className="bg-gray-800 p-2">
                              <div className="h-8 w-8 rounded-full bg-white mb-4 mx-auto"></div>
                              <div className="h-2 bg-gray-500 mb-1 mx-2"></div>
                              <div className="h-2 bg-gray-500 mb-3 mx-2"></div>
                              <div className="h-3 bg-gray-500 mb-2 mx-2"></div>
                              <div className="h-2 bg-gray-500 mb-1 mx-2"></div>
                              <div className="h-2 bg-gray-500 mb-1 mx-2"></div>
                            </div>
                            <div className="col-span-2 p-2">
                              <div className="h-6 bg-gray-200 mb-2 w-1/2"></div>
                              <div className="h-3 bg-gray-200 mb-2 w-3/4"></div>
                              <div className="h-2 bg-gray-200 mb-1"></div>
                              <div className="h-2 bg-gray-200 mb-1"></div>
                              <div className="h-2 bg-gray-200 mb-3"></div>
                              <div className="h-4 bg-gray-200 mb-2 w-1/4"></div>
                              <div className="h-2 bg-gray-200 mb-1"></div>
                              <div className="h-2 bg-gray-200 mb-3"></div>
                            </div>
                          </div>
                        </div>
                      )}
                      {template === "minimal" && (
                        <div className="h-full bg-white p-2 border">
                          <div className="h-6 bg-gray-200 mb-4 w-1/2 mx-auto"></div>
                          <div className="h-3 bg-gray-200 mb-4 w-3/4 mx-auto"></div>
                          <div className="h-0.5 bg-gray-200 mb-4"></div>
                          <div className="h-4 bg-gray-200 mb-2 w-1/4"></div>
                          <div className="h-2 bg-gray-200 mb-1"></div>
                          <div className="h-2 bg-gray-200 mb-1"></div>
                          <div className="h-2 bg-gray-200 mb-3"></div>
                          <div className="h-4 bg-gray-200 mb-2 w-1/4"></div>
                          <div className="h-2 bg-gray-200 mb-1"></div>
                          <div className="h-2 bg-gray-200 mb-3"></div>
                        </div>
                      )}
                      {template === "creative" && (
                        <div className="h-full bg-gradient-to-br from-pink-100 to-blue-100 p-1">
                          <div className="h-10 bg-gradient-to-r from-pink-400 to-purple-400 mb-2"></div>
                          <div className="grid grid-cols-5 gap-1 mb-4">
                            <div className="col-span-2">
                              <div className="h-10 w-10 rounded-full bg-purple-400 mb-2 mx-auto"></div>
                              <div className="h-3 bg-white mb-1 mx-1"></div>
                              <div className="h-2 bg-white mb-3 mx-1"></div>
                            </div>
                            <div className="col-span-3">
                              <div className="h-3 bg-white mb-1"></div>
                              <div className="h-3 bg-white mb-1"></div>
                              <div className="h-3 bg-white mb-1"></div>
                              <div className="h-3 bg-white mb-1"></div>
                            </div>
                          </div>
                          <div className="h-4 bg-purple-300 mb-2 w-1/4"></div>
                          <div className="h-2 bg-white mb-1"></div>
                          <div className="h-2 bg-white mb-1"></div>
                          <div className="h-2 bg-white mb-3"></div>
                        </div>
                      )}
                      {template === "executive" && (
                        <div className="h-full bg-gray-100 p-1">
                          <div className="h-10 bg-gray-800 mb-2 flex items-center justify-center">
                            <div className="h-4 bg-white w-1/3"></div>
                          </div>
                          <div className="h-3 bg-gray-300 w-2/3 mb-4 mx-auto"></div>
                          <div className="grid grid-cols-4 gap-1 mb-4">
                            <div className="h-2 bg-gray-300"></div>
                            <div className="h-2 bg-gray-300"></div>
                            <div className="h-2 bg-gray-300"></div>
                            <div className="h-2 bg-gray-300"></div>
                          </div>
                          <div className="h-4 bg-gray-800 mb-2 w-1/4"></div>
                          <div className="h-2 bg-gray-300 mb-1"></div>
                          <div className="h-2 bg-gray-300 mb-1"></div>
                          <div className="h-2 bg-gray-300 mb-3"></div>
                          <div className="h-4 bg-gray-800 mb-2 w-1/4"></div>
                          <div className="h-2 bg-gray-300 mb-1"></div>
                          <div className="h-2 bg-gray-300 mb-3"></div>
                        </div>
                      )}
                      {template === "industry" && (
                        <div className="h-full bg-white p-1 border-t-8 border-blue-600">
                          <div className="h-6 bg-gray-200 mb-2 w-1/2"></div>
                          <div className="h-3 bg-gray-200 mb-2 w-3/4"></div>
                          <div className="grid grid-cols-2 gap-1 mb-4">
                            <div className="h-2 bg-gray-200"></div>
                            <div className="h-2 bg-gray-200"></div>
                          </div>
                          <div className="h-4 bg-blue-600 mb-2 w-1/4"></div>
                          <div className="h-2 bg-gray-200 mb-1"></div>
                          <div className="h-2 bg-gray-200 mb-1"></div>
                          <div className="h-2 bg-gray-200 mb-3"></div>
                          <div className="h-4 bg-blue-600 mb-2 w-1/4"></div>
                          <div className="h-2 bg-gray-200 mb-1"></div>
                          <div className="h-2 bg-gray-200 mb-3"></div>
                        </div>
                      )}
                      {template === "bold" && (
                        <div className="h-full bg-gray-900 p-1 text-white">
                          <div className="h-8 bg-yellow-500 mb-2"></div>
                          <div className="h-4 bg-gray-700 mb-2 w-1/2 mx-auto"></div>
                          <div className="h-2 bg-gray-700 mb-4 w-3/4 mx-auto"></div>
                          <div className="grid grid-cols-3 gap-1 mb-4">
                            <div className="h-2 bg-gray-700"></div>
                            <div className="h-2 bg-gray-700"></div>
                            <div className="h-2 bg-gray-700"></div>
                          </div>
                          <div className="h-4 bg-yellow-500 mb-2 w-1/4"></div>
                          <div className="h-2 bg-gray-700 mb-1"></div>
                          <div className="h-2 bg-gray-700 mb-1"></div>
                          <div className="h-2 bg-gray-700 mb-3"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-center py-2 font-medium text-blue-100 text-sm capitalize">
                    {template}
                  </div>
                  {currentResume.template === template && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-200">Display Style for Skills</h4>
                <p className="text-xs text-blue-300">Choose how your skills are displayed</p>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="skills-display-mode" className="text-sm text-blue-100">
                  {currentResume.skillsDisplayMode === "bullets" ? "Bullets" : "Bubbles"}
                </Label>
                <Switch
                  id="skills-display-mode"
                  checked={currentResume.skillsDisplayMode === "bubbles"}
                  onCheckedChange={handleToggleSkillsDisplay}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
            </div>
          </div>
        );

      default:
        return <div>Unknown stage</div>;
    }
  };

  // Sidebar navigation items
  const sidebarItems = [
    { id: "personal-info", label: "Personal Info", icon: <FileText className="h-5 w-5" /> },
    { id: "experience", label: "Experience", icon: <FileText className="h-5 w-5" /> },
    { id: "education", label: "Education", icon: <FileText className="h-5 w-5" /> },
    { id: "skills", label: "Skills", icon: <FileText className="h-5 w-5" /> },
    { id: "projects", label: "Projects", icon: <FileText className="h-5 w-5" /> },
    { id: "template", label: "Template", icon: <Layout className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6 pb-16 relative">
      <CosmicBackground />
      
      <PageHeader
        title={
          <div className="flex items-center gap-2">
            <span>Resume Builder</span>
            {saveResumeMutation.isPending && (
              <Badge variant="outline" className="bg-blue-900/50 text-blue-200 border-blue-500/30">
                Saving...
              </Badge>
            )}
            {resumeId && (
              <Badge variant="outline" className="bg-blue-900/50 text-blue-200 border-blue-500/30">
                Last saved: {new Date().toLocaleTimeString()}
              </Badge>
            )}
          </div>
        }
        subtitle="Create a professional resume with our step-by-step guide"
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="bg-[rgba(30,40,70,0.6)] text-blue-300 hover:text-blue-200 hover:bg-blue-800/50 border-blue-700/30"
              onClick={handleSaveResume}
              disabled={saveResumeMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button
              variant="outline"
              className="bg-[rgba(30,40,70,0.6)] text-blue-300 hover:text-blue-200 hover:bg-blue-800/50 border-blue-700/30"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        }
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left side: Conversational interface */}
        <div className="relative">
          <Card className="bg-[rgba(10,15,25,0.7)] backdrop-blur-lg border-indigo-800/30 shadow-md h-full">
            <div className="p-4 h-full flex flex-col">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <Tabs defaultValue="builder" className="w-full">
                  <TabsList className="w-full grid grid-cols-3 bg-[rgba(30,40,80,0.3)]">
                    <TabsTrigger value="builder" className="data-[state=active]:bg-blue-900/50">Builder</TabsTrigger>
                    <TabsTrigger value="sections" className="data-[state=active]:bg-blue-900/50">Sections</TabsTrigger>
                    <TabsTrigger value="customize" className="data-[state=active]:bg-blue-900/50">Customize</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="builder" className="p-0 mt-4">
                    <ScrollArea className="h-[calc(100vh-300px)]">
                      <div className="pr-4">
                        {renderInputSection()}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="sections" className="p-0 mt-4">
                    <ScrollArea className="h-[calc(100vh-300px)]">
                      <div className="space-y-4 pr-4">
                        {sidebarItems.map((item) => (
                          <div 
                            key={item.id}
                            className={cn(
                              "flex items-center p-3 rounded-md cursor-pointer transition-all",
                              currentStage === item.id 
                                ? "bg-blue-900/60 text-blue-100" 
                                : "bg-blue-900/20 text-blue-300 hover:bg-blue-900/40"
                            )}
                            onClick={() => setCurrentStage(item.id as BuilderStage)}
                          >
                            <div className="mr-3">{item.icon}</div>
                            <span>{item.label}</span>
                            {item.id === "experience" && currentResume.experience.length > 0 && (
                              <Badge className="ml-auto bg-blue-700/50">{currentResume.experience.length}</Badge>
                            )}
                            {item.id === "education" && currentResume.education.length > 0 && (
                              <Badge className="ml-auto bg-blue-700/50">{currentResume.education.length}</Badge>
                            )}
                            {item.id === "skills" && currentResume.skills.length > 0 && (
                              <Badge className="ml-auto bg-blue-700/50">{currentResume.skills.length}</Badge>
                            )}
                            {item.id === "projects" && currentResume.projects.length > 0 && (
                              <Badge className="ml-auto bg-blue-700/50">{currentResume.projects.length}</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="customize" className="p-0 mt-4">
                    <ScrollArea className="h-[calc(100vh-300px)]">
                      <div className="space-y-6 pr-4">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Template Style</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {["professional", "modern", "minimal", "creative", "executive", "industry", "bold"].map((template) => (
                              <div 
                                key={template} 
                                className={cn(
                                  "relative rounded-md overflow-hidden border hover:border-blue-400 transition-all cursor-pointer",
                                  currentResume.template === template 
                                    ? "border-blue-500 ring-2 ring-blue-400/50" 
                                    : "border-blue-900/50"
                                )}
                                onClick={() => handleTemplateChange(template)}
                              >
                                <div className="aspect-square bg-white relative">
                                  {/* Template miniature previews */}
                                </div>
                                <div className="text-center py-1 font-medium text-blue-100 text-xs capitalize">
                                  {template}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <Separator className="bg-blue-900/50" />
                        
                        <div>
                          <h3 className="text-lg font-medium mb-3">Style Options</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-sm font-medium text-blue-200">Skills Display</h4>
                                <p className="text-xs text-blue-300">How skills appear on your resume</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-blue-300">
                                  {currentResume.skillsDisplayMode === "bullets" ? "Bullets" : "Bubbles"}
                                </span>
                                <Switch
                                  checked={currentResume.skillsDisplayMode === "bubbles"}
                                  onCheckedChange={handleToggleSkillsDisplay}
                                  className="data-[state=checked]:bg-blue-600"
                                />
                              </div>
                            </div>
                            
                            {/* Additional customization options can be added here */}
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-sm font-medium text-blue-200">Show Tips</h4>
                                <p className="text-xs text-blue-300">Display helpful writing suggestions</p>
                              </div>
                              <Switch
                                checked={showTips}
                                onCheckedChange={setShowTips}
                                className="data-[state=checked]:bg-blue-600"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="mt-auto pt-4 flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="bg-blue-900/30 border-blue-700/50 text-blue-100"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white border-none"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
          
          {/* AI Chat Button */}
          <Button
            variant="outline"
            className="absolute bottom-4 right-4 rounded-full h-12 w-12 bg-blue-700 hover:bg-blue-600 border-blue-500 text-white shadow-lg"
            onClick={() => setShowAiChat(!showAiChat)}
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
          
          {/* AI Chat Panel */}
          {showAiChat && (
            <div className="absolute bottom-20 right-4 w-[300px] bg-[rgba(10,15,25,0.9)] backdrop-blur-lg border border-blue-800/50 rounded-lg shadow-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-blue-100 flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-blue-400" />
                  AI Assistant
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full"
                  onClick={() => setShowAiChat(false)}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
              <div className="h-[200px] mb-3 overflow-y-auto">
                <div className="p-3 bg-blue-900/40 rounded-lg mb-2">
                  <p className="text-sm text-blue-100">How can I help with your resume?</p>
                </div>
                <div className="p-3 bg-indigo-900/40 rounded-lg ml-4">
                  <p className="text-sm text-blue-100">
                    Try asking about:
                    <ul className="mt-1 space-y-1 text-xs list-disc pl-4">
                      <li>Tips for writing a strong summary</li>
                      <li>How to describe achievements</li>
                      <li>Best format for your industry</li>
                    </ul>
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Ask a question..."
                  className="bg-blue-900/30 border-blue-800/50 text-blue-100"
                />
                <Button
                  variant="ghost"
                  className="bg-blue-700 hover:bg-blue-600 text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Right side: Resume preview */}
        <Card className="bg-[rgba(10,15,25,0.7)] backdrop-blur-lg border-indigo-800/30 shadow-md overflow-hidden flex flex-col">
          <div className="p-4 flex justify-between items-center border-b border-blue-900/50">
            <h3 className="text-lg font-medium text-blue-100">Live Preview</h3>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={zoomOut}
                className="h-8 w-8 rounded-full p-0 bg-transparent hover:bg-blue-900/50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-blue-300 w-12 text-center">
                {Math.round(previewScale * 100)}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={zoomIn}
                className="h-8 w-8 rounded-full p-0 bg-transparent hover:bg-blue-900/50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="flex items-center justify-center p-8">
              <div
                style={{
                  transform: `scale(${previewScale})`,
                  transformOrigin: "top center",
                  width: "8.5in",
                  minHeight: "11in", 
                  backgroundColor: "white",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                  margin: "0 auto"
                }}
              >
                {renderTemplate()}
              </div>
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}