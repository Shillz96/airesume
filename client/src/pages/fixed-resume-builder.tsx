import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  User,
  BriefcaseIcon,
  GraduationCap,
  Code,
  FolderKanban,
  Maximize2,
  Download,
  Plus,
  Check,
  Cpu,
  FileText,
  Briefcase,
  Minus,
  Layout,
  UserRound,
  Star,
  Save,
  X,
  Info,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  ProfessionalTemplate, 
  CreativeTemplate, 
  ExecutiveTemplate,
  ModernTemplate,
  MinimalTemplate,
  IndustryTemplate,
  BoldTemplate,
  TemplatePreviewProfessional,
  TemplatePreviewCreative,
  TemplatePreviewExecutive,
  TemplatePreviewModern,
  TemplatePreviewMinimal,
  TemplatePreviewIndustry,
  TemplatePreviewBold
} from "@/components/resume-template";

// Define Resume interfaces
interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  headline: string;
  summary: string;
}

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface SkillItem {
  id: string;
  name: string;
  proficiency: number;
}

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
}

interface Resume {
  id?: string;
  title: string;
  personalInfo: PersonalInfo;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  template: string;
}

// Resume Section Components
const SectionCard = ({ children, title, icon }) => (
  <div className="cosmic-card border border-white/10 rounded-lg bg-gray-900/60 backdrop-blur-sm p-6 mb-8">
    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-white/10">
      {icon}
      <h2 className="text-xl font-medium text-white">{title}</h2>
    </div>
    {children}
  </div>
);

const FormField = ({ label, value, onChange, placeholder = "", className = "" }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full bg-black/30 border border-blue-500/30 rounded-md p-2.5 text-white text-sm ${className}`}
      placeholder={placeholder}
    />
  </div>
);

const TextAreaField = ({ label, value, onChange, placeholder = "", rows = 4 }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full bg-black/30 border border-blue-500/30 rounded-md p-2.5 text-white text-sm"
      placeholder={placeholder}
    />
  </div>
);

// Section Components
const ContactSection = ({ personalInfo, onUpdate }) => {
  const handleChange = (field, value) => {
    onUpdate({
      ...personalInfo,
      [field]: value
    });
  };

  return (
    <SectionCard 
      title="Personal Information" 
      icon={<User className="h-5 w-5 text-blue-400" />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="First Name"
          value={personalInfo.firstName}
          onChange={(value) => handleChange('firstName', value)}
          placeholder="Enter your first name"
        />
        <FormField
          label="Last Name"
          value={personalInfo.lastName}
          onChange={(value) => handleChange('lastName', value)}
          placeholder="Enter your last name"
        />
        <FormField
          label="Email"
          value={personalInfo.email}
          onChange={(value) => handleChange('email', value)}
          placeholder="Enter your email"
        />
        <FormField
          label="Phone"
          value={personalInfo.phone}
          onChange={(value) => handleChange('phone', value)}
          placeholder="Enter your phone number"
        />
        <div className="md:col-span-2">
          <FormField
            label="Professional Headline"
            value={personalInfo.headline}
            onChange={(value) => handleChange('headline', value)}
            placeholder="e.g., Senior Software Engineer | React Specialist"
          />
        </div>
        <div className="md:col-span-2">
          <TextAreaField
            label="Professional Summary"
            value={personalInfo.summary}
            onChange={(value) => handleChange('summary', value)}
            placeholder="Provide a brief summary of your professional background and key strengths"
            rows={5}
          />
        </div>
      </div>
    </SectionCard>
  );
};

const ExperienceSection = ({ experiences, onUpdate }) => {
  const [editingExp, setEditingExp] = useState(null);
  
  const addExperience = () => {
    const newExperience = {
      id: `exp-${Date.now()}`,
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      description: ""
    };
    onUpdate([...experiences, newExperience]);
    setEditingExp(newExperience.id);
  };
  
  const updateExperience = (id, field, value) => {
    const updatedExperiences = experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    onUpdate(updatedExperiences);
  };
  
  const deleteExperience = (id) => {
    onUpdate(experiences.filter(exp => exp.id !== id));
  };

  return (
    <SectionCard 
      title="Work Experience" 
      icon={<Briefcase className="h-5 w-5 text-blue-400" />}
    >
      <div className="space-y-6">
        {experiences.map(exp => (
          <div key={exp.id} className="border border-white/10 rounded-lg p-4 bg-black/20">
            {editingExp === exp.id ? (
              <div className="space-y-3">
                <FormField
                  label="Job Title"
                  value={exp.title}
                  onChange={(value) => updateExperience(exp.id, 'title', value)}
                  placeholder="e.g., Senior Developer"
                />
                <FormField
                  label="Company"
                  value={exp.company}
                  onChange={(value) => updateExperience(exp.id, 'company', value)}
                  placeholder="e.g., Tech Solutions Inc."
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Start Date"
                    value={exp.startDate}
                    onChange={(value) => updateExperience(exp.id, 'startDate', value)}
                    placeholder="MM/YYYY"
                  />
                  <FormField
                    label="End Date"
                    value={exp.endDate}
                    onChange={(value) => updateExperience(exp.id, 'endDate', value)}
                    placeholder="MM/YYYY or Present"
                  />
                </div>
                <TextAreaField
                  label="Description"
                  value={exp.description}
                  onChange={(value) => updateExperience(exp.id, 'description', value)}
                  placeholder="Describe your responsibilities and achievements"
                />
                <div className="flex justify-between mt-4">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => deleteExperience(exp.id)}
                  >
                    Delete
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => setEditingExp(null)}
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between">
                  <h3 className="font-medium text-white">{exp.title || "No Title"}</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setEditingExp(exp.id)}
                  >
                    Edit
                  </Button>
                </div>
                <p className="text-blue-300">{exp.company || "No Company"}</p>
                <p className="text-sm text-gray-400">
                  {exp.startDate || "Start Date"} - {exp.endDate || "End Date"}
                </p>
                <p className="mt-2 text-gray-300">{exp.description || "No description provided"}</p>
              </div>
            )}
          </div>
        ))}
        
        <Button 
          variant="outline" 
          className="w-full border-dashed border-white/30 hover:border-blue-500/50 hover:bg-blue-900/20" 
          onClick={addExperience}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Experience
        </Button>
      </div>
    </SectionCard>
  );
};

const EducationSection = ({ education, onUpdate }) => {
  const [editingEdu, setEditingEdu] = useState(null);
  
  const addEducation = () => {
    const newEducation = {
      id: `edu-${Date.now()}`,
      degree: "",
      institution: "",
      startDate: "",
      endDate: "",
      description: ""
    };
    onUpdate([...education, newEducation]);
    setEditingEdu(newEducation.id);
  };
  
  const updateEducation = (id, field, value) => {
    const updatedEducation = education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    onUpdate(updatedEducation);
  };
  
  const deleteEducation = (id) => {
    onUpdate(education.filter(edu => edu.id !== id));
  };

  return (
    <SectionCard 
      title="Education" 
      icon={<GraduationCap className="h-5 w-5 text-blue-400" />}
    >
      <div className="space-y-6">
        {education.map(edu => (
          <div key={edu.id} className="border border-white/10 rounded-lg p-4 bg-black/20">
            {editingEdu === edu.id ? (
              <div className="space-y-3">
                <FormField
                  label="Degree"
                  value={edu.degree}
                  onChange={(value) => updateEducation(edu.id, 'degree', value)}
                  placeholder="e.g., Bachelor of Science in Computer Science"
                />
                <FormField
                  label="Institution"
                  value={edu.institution}
                  onChange={(value) => updateEducation(edu.id, 'institution', value)}
                  placeholder="e.g., University of Technology"
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Start Date"
                    value={edu.startDate}
                    onChange={(value) => updateEducation(edu.id, 'startDate', value)}
                    placeholder="MM/YYYY or YYYY"
                  />
                  <FormField
                    label="End Date"
                    value={edu.endDate}
                    onChange={(value) => updateEducation(edu.id, 'endDate', value)}
                    placeholder="MM/YYYY or YYYY"
                  />
                </div>
                <TextAreaField
                  label="Description"
                  value={edu.description}
                  onChange={(value) => updateEducation(edu.id, 'description', value)}
                  placeholder="Describe relevant coursework, achievements, etc."
                />
                <div className="flex justify-between mt-4">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => deleteEducation(edu.id)}
                  >
                    Delete
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => setEditingEdu(null)}
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between">
                  <h3 className="font-medium text-white">{edu.degree || "No Degree"}</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setEditingEdu(edu.id)}
                  >
                    Edit
                  </Button>
                </div>
                <p className="text-blue-300">{edu.institution || "No Institution"}</p>
                <p className="text-sm text-gray-400">
                  {edu.startDate || "Start Date"} - {edu.endDate || "End Date"}
                </p>
                <p className="mt-2 text-gray-300">{edu.description || "No description provided"}</p>
              </div>
            )}
          </div>
        ))}
        
        <Button 
          variant="outline" 
          className="w-full border-dashed border-white/30 hover:border-blue-500/50 hover:bg-blue-900/20" 
          onClick={addEducation}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Education
        </Button>
      </div>
    </SectionCard>
  );
};

const SkillsSection = ({ skills, onUpdate }) => {
  const [newSkill, setNewSkill] = useState("");
  
  const addSkill = () => {
    if (!newSkill.trim()) return;
    
    const skill = {
      id: `skill-${Date.now()}`,
      name: newSkill,
      proficiency: 3 // Default value, not shown in UI
    };
    
    onUpdate([...skills, skill]);
    setNewSkill("");
  };
  
  const deleteSkill = (id) => {
    onUpdate(skills.filter(skill => skill.id !== id));
  };

  return (
    <SectionCard 
      title="Skills" 
      icon={<Code className="h-5 w-5 text-blue-400" />}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <div 
              key={skill.id} 
              className="group flex items-center gap-2 bg-black/30 border border-blue-500/20 rounded-lg px-3 py-2"
            >
              <div className="text-white font-medium">{skill.name}</div>
              <button 
                onClick={() => deleteSkill(skill.id)}
                className="ml-2 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        
        <div className="border border-white/10 rounded-lg p-4 bg-black/20">
          <h3 className="font-medium text-white mb-3">Add New Skill</h3>
          <div className="flex gap-3">
            <FormField
              label="Skill Name"
              value={newSkill}
              onChange={setNewSkill}
              placeholder="e.g., React, Project Management, etc."
              className="flex-1 mb-0"
            />
            <div className="flex items-end">
              <Button 
                variant="default" 
                onClick={addSkill}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

const ProjectsSection = ({ projects, onUpdate }) => {
  const [editingProj, setEditingProj] = useState(null);
  const [newTech, setNewTech] = useState("");
  
  const addProject = () => {
    const newProject = {
      id: `proj-${Date.now()}`,
      title: "",
      description: "",
      technologies: [],
      link: ""
    };
    onUpdate([...projects, newProject]);
    setEditingProj(newProject.id);
  };
  
  const updateProject = (id, field, value) => {
    const updatedProjects = projects.map(proj => 
      proj.id === id ? { ...proj, [field]: value } : proj
    );
    onUpdate(updatedProjects);
  };
  
  const addTechnology = (id) => {
    if (!newTech.trim()) return;
    
    const updatedProjects = projects.map(proj => {
      if (proj.id === id) {
        return {
          ...proj,
          technologies: [...proj.technologies, newTech]
        };
      }
      return proj;
    });
    
    onUpdate(updatedProjects);
    setNewTech("");
  };
  
  const removeTechnology = (projectId, techIndex) => {
    const updatedProjects = projects.map(proj => {
      if (proj.id === projectId) {
        const updatedTechs = [...proj.technologies];
        updatedTechs.splice(techIndex, 1);
        return {
          ...proj,
          technologies: updatedTechs
        };
      }
      return proj;
    });
    
    onUpdate(updatedProjects);
  };
  
  const deleteProject = (id) => {
    onUpdate(projects.filter(proj => proj.id !== id));
  };

  return (
    <SectionCard 
      title="Projects" 
      icon={<FolderKanban className="h-5 w-5 text-blue-400" />}
    >
      <div className="space-y-6">
        {projects.map(project => (
          <div key={project.id} className="border border-white/10 rounded-lg p-4 bg-black/20">
            {editingProj === project.id ? (
              <div className="space-y-3">
                <FormField
                  label="Project Title"
                  value={project.title}
                  onChange={(value) => updateProject(project.id, 'title', value)}
                  placeholder="e.g., E-commerce Platform Redesign"
                />
                <TextAreaField
                  label="Description"
                  value={project.description}
                  onChange={(value) => updateProject(project.id, 'description', value)}
                  placeholder="Describe the project, your role, and key achievements"
                />
                <FormField
                  label="Project Link (Optional)"
                  value={project.link || ""}
                  onChange={(value) => updateProject(project.id, 'link', value)}
                  placeholder="e.g., https://github.com/username/project"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Technologies Used</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.technologies.map((tech, index) => (
                      <div 
                        key={index} 
                        className="bg-blue-900/30 text-blue-300 px-2 py-1 rounded text-sm flex items-center"
                      >
                        {tech}
                        <button 
                          onClick={() => removeTechnology(project.id, index)}
                          className="ml-2 text-blue-300 hover:text-red-400"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      className="flex-1 bg-black/30 border border-blue-500/30 rounded-md p-2 text-white text-sm"
                      placeholder="e.g., React"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTechnology(project.id);
                        }
                      }}
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addTechnology(project.id)}
                    >
                      Add
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between mt-4">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => deleteProject(project.id)}
                  >
                    Delete
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => setEditingProj(null)}
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between">
                  <h3 className="font-medium text-white">{project.title || "No Title"}</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setEditingProj(project.id)}
                  >
                    Edit
                  </Button>
                </div>
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 my-2">
                    {project.technologies.map((tech, index) => (
                      <span 
                        key={index} 
                        className="bg-blue-900/30 text-blue-300 px-2 py-0.5 rounded-sm text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-2 text-gray-300">{project.description || "No description provided"}</p>
                {project.link && (
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block"
                  >
                    View Project →
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
        
        <Button 
          variant="outline" 
          className="w-full border-dashed border-white/30 hover:border-blue-500/50 hover:bg-blue-900/20" 
          onClick={addProject}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Project
        </Button>
      </div>
    </SectionCard>
  );
};

// AI Assistant Panel Component
const AIAssistantPanel = ({ title, description, suggestions, icon, onGetSuggestions }) => {
  return (
    <div className="cosmic-card border border-blue-500/30 bg-blue-900/20 p-5 rounded-lg">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h3 className="font-medium text-white">{title}</h3>
      </div>
      <p className="text-gray-300 text-sm mb-4">{description}</p>
      
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="bg-black/30 border border-blue-500/20 rounded-lg p-3 text-sm text-gray-300">
            {suggestion}
          </div>
        ))}
      </div>
      
      <Button 
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
        onClick={onGetSuggestions}
      >
        <Cpu className="h-4 w-4 mr-2" />
        Generate Suggestions
      </Button>
    </div>
  );
};

export default function FixedResumeBuilder() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("contact");
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [previewScale, setPreviewScale] = useState(0.8);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [resume, setResume] = useState<Resume>({
    title: "My Professional Resume",
    personalInfo: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "(555) 123-4567",
      headline: "Frontend Developer | React & TypeScript Specialist",
      summary: "Experienced frontend developer with expertise in React and TypeScript. Passionate about creating intuitive user experiences and writing clean, maintainable code. Strong focus on accessibility and responsive design.",
    },
    experience: [
      {
        id: "exp-1",
        title: "Frontend Developer",
        company: "WebTech Solutions",
        startDate: "2020-01",
        endDate: "Present",
        description: "Enhanced staff professional development through the design and implementation of innovative training programs, increasing nurse competency and engagement by 25%, to foster high-quality healthcare and maintain a compassionate caregiving environment at Complete Care at Harrington Court.",
      },
    ],
    education: [
      {
        id: "edu-1",
        degree: "B.S. Computer Science",
        institution: "University of Technology",
        startDate: "2015",
        endDate: "2019",
        description: "Focused on web development and user interface design. Completed a senior project on accessible web design patterns.",
      },
    ],
    skills: [
      {
        id: "skill-1",
        name: "React",
        proficiency: 5,
      },
      {
        id: "skill-2",
        name: "TypeScript",
        proficiency: 4,
      },
      {
        id: "skill-3",
        name: "CSS/SCSS",
        proficiency: 4,
      },
      {
        id: "skill-4",
        name: "Node.js",
        proficiency: 3,
      },
    ],
    projects: [
      {
        id: "proj-1",
        title: "E-commerce Redesign",
        description: "Led the frontend redesign of an e-commerce platform, improving mobile conversions by 35% and reducing bounce rate by 20%.",
        technologies: ["React", "TypeScript", "Redux", "Styled Components"],
        link: "https://example.com/project",
      },
    ],
    template: "professional",
  });

  // Mock auto-save functionality
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Auto-saved resume to localStorage");
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [resume]);

  const handleTemplateChange = (template: string) => {
    setResume((prev) => ({
      ...prev,
      template,
    }));
  };

  const downloadResume = () => {
    toast({
      title: "Resume Downloaded",
      description: "Your resume has been downloaded as a PDF.",
    });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen pb-20 bg-background text-foreground">
      <div className="container pt-12 pb-10 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight cosmic-text-gradient">Resume Builder</h1>
            <p className="text-muted-foreground">
              Create and customize your professional resume with AI assistance
            </p>
          </div>
        </div>

        {/* Resume Title */}
        <div className="mb-6 bg-gray-900/50 p-4 rounded-lg border border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <label htmlFor="resume-title" className="block text-sm font-medium text-gray-300 mb-1">Resume Title</label>
              <input
                id="resume-title"
                type="text"
                value={resume.title}
                onChange={(e) => setResume({ ...resume, title: e.target.value })}
                className="w-full bg-black/30 border border-blue-500/30 rounded-md p-2 text-white text-sm"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  toast({
                    title: "Resume Saved",
                    description: "Your resume has been saved successfully.",
                  });
                }}
              >
                Save Resume
              </Button>
              <Button
                variant="outline"
                className="border-blue-500/30 text-white"
                onClick={downloadResume}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation - Styled like Job Finder */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8 cosmic-tabs">
          <TabsList className="w-full bg-black/40 border border-white/10 p-1 rounded-lg">
            <TabsTrigger 
              value="contact" 
              className="flex-1 data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300 text-gray-300"
            >
              <User className="h-4 w-4 mr-2" />
              Personal Info
            </TabsTrigger>
            <TabsTrigger 
              value="experience" 
              className="flex-1 data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300 text-gray-300"
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Experience
            </TabsTrigger>
            <TabsTrigger 
              value="education" 
              className="flex-1 data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300 text-gray-300"
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              Education
            </TabsTrigger>
            <TabsTrigger 
              value="skills" 
              className="flex-1 data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300 text-gray-300"
            >
              <Code className="h-4 w-4 mr-2" />
              Skills
            </TabsTrigger>
            <TabsTrigger 
              value="projects" 
              className="flex-1 data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300 text-gray-300"
            >
              <FolderKanban className="h-4 w-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              className="flex-1 data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300 text-gray-300"
            >
              <Maximize2 className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value="contact" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <ContactSection 
                  personalInfo={resume.personalInfo}
                  onUpdate={(personalInfo) => {
                    setResume({
                      ...resume,
                      personalInfo,
                    });
                  }}
                />
              </div>
              
              <div className="md:col-span-1">
                <AIAssistantPanel
                  title="AI Resume Assistant"
                  description="Get AI-powered suggestions to enhance your professional summary:"
                  suggestions={[
                    "Craft a concise overview of your career achievements",
                    "Highlight your industry-specific expertise",
                    "Showcase your leadership and communication skills",
                    "Tailor your summary for your target role"
                  ]}
                  icon={<Cpu className="h-4 w-4 text-white" />}
                  onGetSuggestions={() => {
                    toast({
                      title: "Generating suggestions",
                      description: "AI is analyzing your profile to provide personalized suggestions.",
                    });
                  }}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="experience" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <ExperienceSection
                  experiences={resume.experience}
                  onUpdate={(experience) => {
                    setResume({
                      ...resume,
                      experience,
                    });
                  }}
                />
              </div>
              
              <div className="md:col-span-1">
                <AIAssistantPanel
                  title="Experience Assistant"
                  description="Enhance your work experience with these AI suggestions:"
                  suggestions={[
                    "Use action verbs to begin each bullet point",
                    "Include measurable achievements and results",
                    "Highlight skills relevant to your target job",
                    "Focus on your unique contributions"
                  ]}
                  icon={<Briefcase className="h-4 w-4 text-white" />}
                  onGetSuggestions={() => {
                    toast({
                      title: "Generating suggestions",
                      description: "AI is analyzing your experience to provide personalized suggestions.",
                    });
                  }}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="education" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <EducationSection
                  education={resume.education}
                  onUpdate={(education) => {
                    setResume({
                      ...resume,
                      education,
                    });
                  }}
                />
              </div>
              
              <div className="md:col-span-1">
                <AIAssistantPanel
                  title="Education Assistant"
                  description="Enhance your education section with these tips:"
                  suggestions={[
                    "Focus on relevant coursework that aligns with your target job",
                    "Highlight leadership roles in student organizations",
                    "Include special projects, research, or thesis work",
                    "List certifications or specialized training programs"
                  ]}
                  icon={<GraduationCap className="h-4 w-4 text-white" />}
                  onGetSuggestions={() => {
                    toast({
                      title: "Generating suggestions",
                      description: "AI is analyzing your education to provide personalized suggestions.",
                    });
                  }}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="skills" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <SkillsSection
                  skills={resume.skills}
                  onUpdate={(skills) => {
                    setResume({
                      ...resume,
                      skills,
                    });
                  }}
                />
              </div>
              
              <div className="md:col-span-1">
                <AIAssistantPanel
                  title="Skills Assistant"
                  description="Add relevant skills to make your resume stand out:"
                  suggestions={[
                    "Technical: Redux, Next.js, GraphQL, Webpack",
                    "Soft: Project Management, Team Leadership",
                    "Domain: UX/UI Design, Responsive Layouts",
                    "Tools: Git, Jest, Docker, CI/CD Pipelines"
                  ]}
                  icon={<Code className="h-4 w-4 text-white" />}
                  onGetSuggestions={() => {
                    toast({
                      title: "Generating suggestions",
                      description: "AI is analyzing job market trends to suggest relevant skills.",
                    });
                  }}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="projects" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <ProjectsSection
                  projects={resume.projects}
                  onUpdate={(projects) => {
                    setResume({
                      ...resume,
                      projects,
                    });
                  }}
                />
              </div>
              
              <div className="md:col-span-1">
                <AIAssistantPanel
                  title="Projects Assistant"
                  description="Enhance your projects section with these formatting tips:"
                  suggestions={[
                    "Use action verbs to describe your contributions",
                    "Quantify achievements with metrics when possible",
                    "Showcase problem-solving and technical skills",
                    "Include the business impact of your project"
                  ]}
                  icon={<FolderKanban className="h-4 w-4 text-white" />}
                  onGetSuggestions={() => {
                    toast({
                      title: "Generating suggestions",
                      description: "AI is analyzing your projects to provide improvement suggestions.",
                    });
                  }}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="mt-4">
            <div className="cosmic-resume-panel p-6 rounded-lg bg-gray-900/50 border border-blue-500/30">
              <div className="flex justify-between mb-6 items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex space-x-2 items-center">
                    <span className="text-white text-sm">Scale:</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewScale(Math.max(0.5, previewScale - 0.1))}
                      className="h-8 w-8 p-0 rounded-full"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-white text-sm w-12 text-center">{Math.round(previewScale * 100)}%</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewScale(Math.min(1.5, previewScale + 0.1))}
                      className="h-8 w-8 p-0 rounded-full"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="border-blue-500/50 text-white"
                    onClick={() => setShowTemplateSelector(true)}
                  >
                    <Layout className="h-4 w-4 mr-2" />
                    Change Template
                  </Button>
                  <Button
                    variant="default"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={downloadResume}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>

              {/* Template Preview */}
              <div className="overflow-auto bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div 
                  className="bg-white rounded-lg mx-auto transition-all"
                  style={{ 
                    transform: `scale(${previewScale})`, 
                    transformOrigin: 'top center',
                    width: `${100 / previewScale}%`,
                    maxWidth: '1000px'
                  }}
                >
                  {resume.template === "professional" && <ProfessionalTemplate resume={resume} />}
                  {resume.template === "creative" && <CreativeTemplate resume={resume} />}
                  {resume.template === "executive" && <ExecutiveTemplate resume={resume} />}
                  {resume.template === "modern" && <ModernTemplate resume={resume} />}
                  {resume.template === "minimal" && <MinimalTemplate resume={resume} />}
                  {resume.template === "industry" && <IndustryTemplate resume={resume} />}
                  {resume.template === "bold" && <BoldTemplate resume={resume} />}
                </div>
              </div>

              {/* Template Selection Dialog */}
              <Dialog open={showTemplateSelector} onOpenChange={setShowTemplateSelector}>
                <DialogContent className="sm:max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Choose a Resume Template</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-3 gap-4 py-4">
                    <div
                      onClick={() => {
                        handleTemplateChange("professional");
                        setShowTemplateSelector(false);
                      }}
                      className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        resume.template === "professional"
                          ? "border-blue-500 ring-2 ring-blue-500/30"
                          : "border-gray-700 hover:border-gray-500"
                      }`}
                    >
                      <div className="h-32 bg-gray-800 p-2">
                        <TemplatePreviewProfessional />
                      </div>
                      <div className="p-2 bg-gray-900/80 flex justify-between items-center">
                        <span className="text-sm capitalize text-white">
                          Professional
                        </span>
                        {resume.template === "professional" && (
                          <Check className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                    </div>
                    
                    <div
                      onClick={() => {
                        handleTemplateChange("creative");
                        setShowTemplateSelector(false);
                      }}
                      className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        resume.template === "creative"
                          ? "border-blue-500 ring-2 ring-blue-500/30"
                          : "border-gray-700 hover:border-gray-500"
                      }`}
                    >
                      <div className="h-32 bg-gray-800 p-2">
                        <TemplatePreviewCreative />
                      </div>
                      <div className="p-2 bg-gray-900/80 flex justify-between items-center">
                        <span className="text-sm capitalize text-white">
                          Creative
                        </span>
                        {resume.template === "creative" && (
                          <Check className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                    </div>
                    
                    <div
                      onClick={() => {
                        handleTemplateChange("executive");
                        setShowTemplateSelector(false);
                      }}
                      className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        resume.template === "executive"
                          ? "border-blue-500 ring-2 ring-blue-500/30"
                          : "border-gray-700 hover:border-gray-500"
                      }`}
                    >
                      <div className="h-32 bg-gray-800 p-2">
                        <TemplatePreviewExecutive />
                      </div>
                      <div className="p-2 bg-gray-900/80 flex justify-between items-center">
                        <span className="text-sm capitalize text-white">
                          Executive
                        </span>
                        {resume.template === "executive" && (
                          <Check className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                    </div>
                    
                    <div
                      onClick={() => {
                        handleTemplateChange("modern");
                        setShowTemplateSelector(false);
                      }}
                      className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        resume.template === "modern"
                          ? "border-blue-500 ring-2 ring-blue-500/30"
                          : "border-gray-700 hover:border-gray-500"
                      }`}
                    >
                      <div className="h-32 bg-gray-800 p-2">
                        <TemplatePreviewModern />
                      </div>
                      <div className="p-2 bg-gray-900/80 flex justify-between items-center">
                        <span className="text-sm capitalize text-white">
                          Modern
                        </span>
                        {resume.template === "modern" && (
                          <Check className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                    </div>
                    
                    <div
                      onClick={() => {
                        handleTemplateChange("minimal");
                        setShowTemplateSelector(false);
                      }}
                      className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        resume.template === "minimal"
                          ? "border-blue-500 ring-2 ring-blue-500/30"
                          : "border-gray-700 hover:border-gray-500"
                      }`}
                    >
                      <div className="h-32 bg-gray-800 p-2">
                        <TemplatePreviewMinimal />
                      </div>
                      <div className="p-2 bg-gray-900/80 flex justify-between items-center">
                        <span className="text-sm capitalize text-white">
                          Minimal
                        </span>
                        {resume.template === "minimal" && (
                          <Check className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                    </div>
                    
                    <div
                      onClick={() => {
                        handleTemplateChange("industry");
                        setShowTemplateSelector(false);
                      }}
                      className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        resume.template === "industry"
                          ? "border-blue-500 ring-2 ring-blue-500/30"
                          : "border-gray-700 hover:border-gray-500"
                      }`}
                    >
                      <div className="h-32 bg-gray-800 p-2">
                        <TemplatePreviewIndustry />
                      </div>
                      <div className="p-2 bg-gray-900/80 flex justify-between items-center">
                        <span className="text-sm capitalize text-white">
                          Industry
                        </span>
                        {resume.template === "industry" && (
                          <Check className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                    </div>
                    
                    <div
                      onClick={() => {
                        handleTemplateChange("bold");
                        setShowTemplateSelector(false);
                      }}
                      className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        resume.template === "bold"
                          ? "border-blue-500 ring-2 ring-blue-500/30"
                          : "border-gray-700 hover:border-gray-500"
                      }`}
                    >
                      <div className="h-32 bg-gray-800 p-2">
                        <TemplatePreviewBold />
                      </div>
                      <div className="p-2 bg-gray-900/80 flex justify-between items-center">
                        <span className="text-sm capitalize text-white">
                          Bold
                        </span>
                        {resume.template === "bold" && (
                          <Check className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}