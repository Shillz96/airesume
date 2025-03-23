import { useState } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from "@/components/ui/collapsible";

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
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

interface ResumeExperienceSectionProps {
  experiences: ExperienceItem[];
  onUpdate: (experiences: ExperienceItem[]) => void;
}

interface ResumeEducationSectionProps {
  education: EducationItem[];
  onUpdate: (education: EducationItem[]) => void;
}

interface ResumeSkillsSectionProps {
  skills: SkillItem[];
  onUpdate: (skills: SkillItem[]) => void;
}

interface ResumeProjectsSectionProps {
  projects: ProjectItem[];
  onUpdate: (projects: ProjectItem[]) => void;
}

export function ResumeExperienceSection({ experiences, onUpdate }: ResumeExperienceSectionProps) {
  const [openId, setOpenId] = useState<string | null>(experiences[0]?.id || null);

  const handleAdd = () => {
    const newExp: ExperienceItem = {
      id: Date.now().toString(),
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    onUpdate([...experiences, newExp]);
    setOpenId(newExp.id);
  };

  const handleDelete = (id: string) => {
    onUpdate(experiences.filter((exp) => exp.id !== id));
    if (openId === id) {
      setOpenId(experiences[0]?.id !== id ? experiences[0]?.id : null);
    }
  };

  const handleChange = (id: string, field: keyof ExperienceItem, value: string) => {
    onUpdate(
      experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  return (
    <div>
      {experiences.length > 0 && (
        <div className="cosmic-add-button-container flex justify-end mb-4">
          <Button
            onClick={handleAdd}
            className="cosmic-btn-outline cosmic-btn-glow"
            variant="outline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Experience
          </Button>
        </div>
      )}
      
      {experiences.map((exp) => (
        <Collapsible
          key={exp.id}
          open={openId === exp.id}
          onOpenChange={() => setOpenId(openId === exp.id ? null : exp.id)}
          className="cosmic-experience-item mb-4"
        >
          <div className="cosmic-experience-title-bar">
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-start p-0 hover:bg-transparent"
              >
                <div className="text-left">
                  <div className="cosmic-experience-title-text">
                    {exp.title || "Job Title"} - {exp.company || "Company"}
                  </div>
                </div>
              </Button>
            </CollapsibleTrigger>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(exp.id);
              }}
              aria-label="Delete experience"
              className="cosmic-experience-delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
            
          <CollapsibleContent className="cosmic-experience-content">
            <div className="cosmic-experience-form">
              <div className="cosmic-form-group">
                <Label htmlFor={`job-title-${exp.id}`} className="cosmic-form-label">Job Title</Label>
                <Input
                  id={`job-title-${exp.id}`}
                  value={exp.title}
                  onChange={(e) => handleChange(exp.id, "title", e.target.value)}
                  className="cosmic-form-input"
                  placeholder="Freelance Coder"
                />
              </div>
              
              <div className="cosmic-form-group">
                <Label htmlFor={`company-${exp.id}`} className="cosmic-form-label">Company</Label>
                <Input
                  id={`company-${exp.id}`}
                  value={exp.company}
                  onChange={(e) => handleChange(exp.id, "company", e.target.value)}
                  className="cosmic-form-input"
                  placeholder="Programming"
                />
              </div>

              <div className="cosmic-form-group">
                <Label htmlFor={`start-date-${exp.id}`} className="cosmic-form-label">Start Date</Label>
                <Input
                  id={`start-date-${exp.id}`}
                  value={exp.startDate}
                  onChange={(e) => handleChange(exp.id, "startDate", e.target.value)}
                  className="cosmic-form-input"
                  placeholder="2021-03"
                />
              </div>

              <div className="cosmic-form-group">
                <Label htmlFor={`end-date-${exp.id}`} className="cosmic-form-label">End Date</Label>
                <Input
                  id={`end-date-${exp.id}`}
                  value={exp.endDate}
                  onChange={(e) => handleChange(exp.id, "endDate", e.target.value)}
                  className="cosmic-form-input"
                  placeholder="Present"
                />
              </div>

              <div className="cosmic-form-group cosmic-experience-form-full">
                <Label htmlFor={`description-${exp.id}`} className="cosmic-form-label">Responsibilities & Achievements</Label>
                <Textarea
                  id={`description-${exp.id}`}
                  value={exp.description}
                  onChange={(e) => handleChange(exp.id, "description", e.target.value)}
                  placeholder="Utilized Python automation to streamline client-specified tasks, efficiently reducing time commitments by 30%. Utilized Git for version control and project management, ensuring code quality and collaboration with other developers."
                  className="cosmic-form-input cosmic-form-textarea"
                  rows={5}
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
      
      {experiences.length === 0 && (
        <button
          onClick={handleAdd}
          className="w-full py-3 mt-2 cosmic-btn-gradient rounded-md flex items-center justify-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          <span>Add Your First Experience</span>
        </button>
      )}
    </div>
  );
}

export function ResumeEducationSection({ education, onUpdate }: ResumeEducationSectionProps) {
  const [openId, setOpenId] = useState<string | null>(education[0]?.id || null);

  const handleAdd = () => {
    const newEdu: EducationItem = {
      id: Date.now().toString(),
      degree: "",
      institution: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    onUpdate([...education, newEdu]);
    setOpenId(newEdu.id);
  };

  const handleDelete = (id: string) => {
    onUpdate(education.filter((edu) => edu.id !== id));
    if (openId === id) {
      setOpenId(education[0]?.id !== id ? education[0]?.id : null);
    }
  };

  const handleChange = (id: string, field: keyof EducationItem, value: string) => {
    onUpdate(
      education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    );
  };

  return (
    <div>
      {education.length > 0 && (
        <div className="cosmic-add-button-container flex justify-end mb-4">
          <Button
            onClick={handleAdd}
            className="cosmic-btn-outline cosmic-btn-glow"
            variant="outline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Education
          </Button>
        </div>
      )}
      
      {education.map((edu) => (
        <Collapsible
          key={edu.id}
          open={openId === edu.id}
          onOpenChange={() => setOpenId(openId === edu.id ? null : edu.id)}
          className="cosmic-education-item mb-4"
        >
          <div className="cosmic-education-title-bar">
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-start p-0 hover:bg-transparent"
              >
                <div className="text-left">
                  <div className="cosmic-education-title-text">
                    {edu.degree || "Degree"} - {edu.institution || "Institution"}
                  </div>
                </div>
              </Button>
            </CollapsibleTrigger>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(edu.id);
              }}
              aria-label="Delete education"
              className="cosmic-experience-delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
            
          <CollapsibleContent className="cosmic-education-content">
            <div className="cosmic-education-form">
              <div className="cosmic-form-group">
                <Label htmlFor={`degree-${edu.id}`} className="cosmic-form-label">Degree</Label>
                <Input
                  id={`degree-${edu.id}`}
                  value={edu.degree}
                  onChange={(e) => handleChange(edu.id, "degree", e.target.value)}
                  className="cosmic-form-input"
                  placeholder="Bachelor of Science in Computer Science"
                />
              </div>
              
              <div className="cosmic-form-group">
                <Label htmlFor={`institution-${edu.id}`} className="cosmic-form-label">Institution</Label>
                <Input
                  id={`institution-${edu.id}`}
                  value={edu.institution}
                  onChange={(e) => handleChange(edu.id, "institution", e.target.value)}
                  className="cosmic-form-input"
                  placeholder="CU Denver"
                />
              </div>

              <div className="cosmic-form-group">
                <Label htmlFor={`start-date-${edu.id}`} className="cosmic-form-label">Start Date</Label>
                <Input
                  id={`start-date-${edu.id}`}
                  value={edu.startDate}
                  onChange={(e) => handleChange(edu.id, "startDate", e.target.value)}
                  className="cosmic-form-input"
                  placeholder="2022-08"
                />
              </div>

              <div className="cosmic-form-group">
                <Label htmlFor={`end-date-${edu.id}`} className="cosmic-form-label">End Date</Label>
                <Input
                  id={`end-date-${edu.id}`}
                  value={edu.endDate}
                  onChange={(e) => handleChange(edu.id, "endDate", e.target.value)}
                  className="cosmic-form-input"
                  placeholder="2026-05"
                />
              </div>

              <div className="cosmic-form-group cosmic-education-form-full">
                <Label htmlFor={`description-${edu.id}`} className="cosmic-form-label">Description</Label>
                <Textarea
                  id={`description-${edu.id}`}
                  value={edu.description}
                  onChange={(e) => handleChange(edu.id, "description", e.target.value)}
                  placeholder="Currently pursuing a degree with a focus on software development, data analysis, and algorithms."
                  className="cosmic-form-input cosmic-form-textarea"
                  rows={4}
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
      
      {education.length === 0 && (
        <button
          onClick={handleAdd}
          className="w-full py-3 mt-2 cosmic-btn-gradient rounded-md flex items-center justify-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          <span>Add Your First Education</span>
        </button>
      )}
    </div>
  );
}

export function ResumeSkillsSection({ skills, onUpdate }: ResumeSkillsSectionProps) {
  const handleAdd = () => {
    const newSkill: SkillItem = {
      id: Date.now().toString(),
      name: "",
      proficiency: 3,
    };
    onUpdate([...skills, newSkill]);
  };

  const handleDelete = (id: string) => {
    onUpdate(skills.filter((skill) => skill.id !== id));
  };

  const handleChange = (id: string, field: keyof SkillItem, value: string | number) => {
    onUpdate(
      skills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    );
  };

  return (
    <div>
      {skills.length > 0 && (
        <div className="cosmic-add-button-container flex justify-end mb-4">
          <Button
            onClick={handleAdd}
            className="cosmic-btn-outline cosmic-btn-glow"
            variant="outline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Skill
          </Button>
        </div>
      )}
      
      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <div key={skill.id} className="cosmic-skill-item flex w-full sm:w-auto">
            <Input
              value={skill.name}
              onChange={(e) => handleChange(skill.id, "name", e.target.value)}
              placeholder="Python"
              className="cosmic-form-input min-w-[120px] w-[180px] bg-[#1a2442] border-[#2a325a] focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <div className="relative ml-2">
              <select
                value={skill.proficiency}
                onChange={(e) => handleChange(skill.id, "proficiency", parseInt(e.target.value))}
                className="cosmic-form-input appearance-none pr-8 w-[120px] bg-[#1a2442] border-[#2a325a] focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value={1}>Beginner</option>
                <option value={2}>Intermediate</option>
                <option value={3}>Advanced</option>
                <option value={4}>Expert</option>
                <option value={5}>Master</option>
              </select>
              <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleDelete(skill.id)}
              aria-label="Delete skill"
              className="ml-1 cosmic-experience-delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      
      {skills.length === 0 && (
        <button
          onClick={handleAdd}
          className="w-full py-3 mt-2 cosmic-btn-gradient rounded-md flex items-center justify-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          <span>Add Your First Skill</span>
        </button>
      )}
    </div>
  );
}

export function ResumeProjectsSection({ projects, onUpdate }: ResumeProjectsSectionProps) {
  const [openId, setOpenId] = useState<string | null>(projects[0]?.id || null);

  const handleAdd = () => {
    const newProject: ProjectItem = {
      id: Date.now().toString(),
      title: "",
      description: "",
      technologies: [],
      link: "",
    };
    onUpdate([...projects, newProject]);
    setOpenId(newProject.id);
  };

  const handleDelete = (id: string) => {
    onUpdate(projects.filter((project) => project.id !== id));
    if (openId === id) {
      setOpenId(projects[0]?.id !== id ? projects[0]?.id : null);
    }
  };

  const handleChange = (id: string, field: keyof ProjectItem, value: string | string[]) => {
    onUpdate(
      projects.map((project) =>
        project.id === id ? { ...project, [field]: value } : project
      )
    );
  };

  return (
    <div>
      {projects.length > 0 && (
        <div className="cosmic-add-button-container flex justify-end mb-4">
          <Button
            onClick={handleAdd}
            className="cosmic-btn-outline cosmic-btn-glow"
            variant="outline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Project
          </Button>
        </div>
      )}
      
      {projects.map((project) => (
        <Collapsible
          key={project.id}
          open={openId === project.id}
          onOpenChange={() => setOpenId(openId === project.id ? null : project.id)}
          className="cosmic-projects-item mb-4"
        >
          <div className="cosmic-projects-title-bar">
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-start p-0 hover:bg-transparent"
              >
                <div className="text-left">
                  <div className="cosmic-projects-title-text">
                    {project.title || "Python App Project"} {project.technologies.length > 0 && 
                      `(${project.technologies.slice(0, 3).join(", ")}${project.technologies.length > 3 ? '...' : ''})`
                    }
                  </div>
                </div>
              </Button>
            </CollapsibleTrigger>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(project.id);
              }}
              aria-label="Delete project"
              className="cosmic-experience-delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
            
          <CollapsibleContent className="cosmic-projects-content">
            <div className="cosmic-projects-form">
              <div className="cosmic-form-group">
                <Label htmlFor={`title-${project.id}`} className="cosmic-form-label">Project Title</Label>
                <Input
                  id={`title-${project.id}`}
                  value={project.title}
                  onChange={(e) => handleChange(project.id, "title", e.target.value)}
                  className="cosmic-form-input"
                  placeholder="Python App Project"
                />
              </div>
              
              <div className="cosmic-form-group">
                <Label htmlFor={`description-${project.id}`} className="cosmic-form-label">Description</Label>
                <Textarea
                  id={`description-${project.id}`}
                  value={project.description}
                  onChange={(e) => handleChange(project.id, "description", e.target.value)}
                  className="cosmic-form-input cosmic-form-textarea"
                  placeholder="Developed a Python app for data analysis and visualization, using Pandas, NumPy, and Matplotlib to process and display data. Added features for data cleaning, statistical analysis, and interactive charts for enhanced data insights. Engineered this project in 170 hours, achieving 25% speedup over original requirements."
                  rows={5}
                />
              </div>

              <div className="cosmic-form-group">
                <Label htmlFor={`technologies-${project.id}`} className="cosmic-form-label">Technologies</Label>
                <Input
                  id={`technologies-${project.id}`}
                  value={project.technologies.join(", ")}
                  onChange={(e) => handleChange(project.id, "technologies", e.target.value.split(",").map(t => t.trim()))}
                  className="cosmic-form-input"
                  placeholder="Python, Pandas, NumPy, Matplotlib, SQL"
                />
              </div>

              <div className="cosmic-form-group">
                <Label htmlFor={`link-${project.id}`} className="cosmic-form-label">Project Link (optional)</Label>
                <div className="relative">
                  <Input
                    id={`link-${project.id}`}
                    value={project.link || ""}
                    onChange={(e) => handleChange(project.id, "link", e.target.value)}
                    className="cosmic-form-input pl-8"
                    placeholder="e.g. https://github.com/username/project"
                  />
                  <svg className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
      
      {projects.length === 0 && (
        <button
          onClick={handleAdd}
          className="w-full py-3 mt-2 cosmic-btn-gradient rounded-md flex items-center justify-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          <span>Add Your First Project</span>
        </button>
      )}
    </div>
  );
}
