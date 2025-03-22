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
    <div className="pt-4">
      {experiences.map((exp) => (
        <Collapsible
          key={exp.id}
          open={openId === exp.id}
          onOpenChange={() => setOpenId(openId === exp.id ? null : exp.id)}
          className="mb-4 rounded-lg border border-indigo-900/30 bg-[rgba(20,30,60,0.4)] hover:bg-[rgba(25,35,65,0.5)]"
        >
          <div className="p-4">
            <div className="flex justify-between items-center">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="p-0 hover:bg-transparent justify-start text-left font-medium text-blue-300">
                  {exp.title ? exp.title : "New Experience"}
                  {exp.company && ` - ${exp.company}`}
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
                className="text-blue-400 hover:text-red-400 hover:bg-blue-950/50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <CollapsibleContent className="mt-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <Label htmlFor={`job-title-${exp.id}`} className="text-blue-200">Job Title</Label>
                  <Input
                    id={`job-title-${exp.id}`}
                    value={exp.title}
                    onChange={(e) => handleChange(exp.id, "title", e.target.value)}
                    className="mt-1 bg-[rgba(30,40,80,0.4)] border-blue-900/30 focus:border-blue-500 text-gray-200"
                  />
                </div>
                
                <div className="sm:col-span-3">
                  <Label htmlFor={`company-${exp.id}`} className="text-blue-200">Company</Label>
                  <Input
                    id={`company-${exp.id}`}
                    value={exp.company}
                    onChange={(e) => handleChange(exp.id, "company", e.target.value)}
                    className="mt-1 bg-[rgba(30,40,80,0.4)] border-blue-900/30 focus:border-blue-500 text-gray-200"
                  />
                </div>

                <div className="sm:col-span-3">
                  <Label htmlFor={`start-date-${exp.id}`} className="text-blue-200">Start Date</Label>
                  <Input
                    id={`start-date-${exp.id}`}
                    value={exp.startDate}
                    onChange={(e) => handleChange(exp.id, "startDate", e.target.value)}
                    placeholder="e.g. January 2020"
                    className="mt-1 bg-[rgba(30,40,80,0.4)] border-blue-900/30 focus:border-blue-500 text-gray-200"
                  />
                </div>

                <div className="sm:col-span-3">
                  <Label htmlFor={`end-date-${exp.id}`} className="text-blue-200">End Date</Label>
                  <Input
                    id={`end-date-${exp.id}`}
                    value={exp.endDate}
                    onChange={(e) => handleChange(exp.id, "endDate", e.target.value)}
                    placeholder="e.g. Present"
                    className="mt-1 bg-[rgba(30,40,80,0.4)] border-blue-900/30 focus:border-blue-500 text-gray-200"
                  />
                </div>

                <div className="sm:col-span-6">
                  <Label htmlFor={`description-${exp.id}`} className="text-blue-200">Responsibilities & Achievements</Label>
                  <Textarea
                    id={`description-${exp.id}`}
                    value={exp.description}
                    onChange={(e) => handleChange(exp.id, "description", e.target.value)}
                    placeholder="List your key responsibilities and achievements. Use bullet points starting with • for better formatting."
                    className="mt-1 bg-[rgba(30,40,80,0.4)] border-blue-900/30 focus:border-blue-500 text-gray-200"
                    rows={4}
                  />
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      ))}
      
      <Button
        variant="outline"
        onClick={handleAdd}
        className="flex gap-2 mt-2 border-blue-800/30 text-blue-300 hover:bg-blue-900/30 hover:text-blue-200"
      >
        <span className="text-lg">+</span> Add Experience
      </Button>
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
    <div className="pt-4">
      {education.map((edu) => (
        <Collapsible
          key={edu.id}
          open={openId === edu.id}
          onOpenChange={() => setOpenId(openId === edu.id ? null : edu.id)}
          className="mb-4 rounded-lg border border-indigo-900/30 bg-[rgba(20,30,60,0.4)] hover:bg-[rgba(25,35,65,0.5)]"
        >
          <div className="p-4">
            <div className="flex justify-between items-center">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="p-0 hover:bg-transparent justify-start text-left font-medium text-blue-300">
                  {edu.degree ? edu.degree : "New Education"}
                  {edu.institution && ` - ${edu.institution}`}
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
                className="text-blue-400 hover:text-red-400 hover:bg-blue-950/50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <CollapsibleContent className="mt-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <Label htmlFor={`degree-${edu.id}`} className="text-blue-200">Degree</Label>
                  <Input
                    id={`degree-${edu.id}`}
                    value={edu.degree}
                    onChange={(e) => handleChange(edu.id, "degree", e.target.value)}
                    className="mt-1 bg-[rgba(30,40,80,0.4)] border-blue-900/30 focus:border-blue-500 text-gray-200"
                  />
                </div>
                
                <div className="sm:col-span-3">
                  <Label htmlFor={`institution-${edu.id}`} className="text-blue-200">Institution</Label>
                  <Input
                    id={`institution-${edu.id}`}
                    value={edu.institution}
                    onChange={(e) => handleChange(edu.id, "institution", e.target.value)}
                    className="mt-1 bg-[rgba(30,40,80,0.4)] border-blue-900/30 focus:border-blue-500 text-gray-200"
                  />
                </div>

                <div className="sm:col-span-3">
                  <Label htmlFor={`start-date-${edu.id}`} className="text-blue-200">Start Date</Label>
                  <Input
                    id={`start-date-${edu.id}`}
                    value={edu.startDate}
                    onChange={(e) => handleChange(edu.id, "startDate", e.target.value)}
                    placeholder="e.g. September 2018"
                    className="mt-1 bg-[rgba(30,40,80,0.4)] border-blue-900/30 focus:border-blue-500 text-gray-200"
                  />
                </div>

                <div className="sm:col-span-3">
                  <Label htmlFor={`end-date-${edu.id}`} className="text-blue-200">End Date</Label>
                  <Input
                    id={`end-date-${edu.id}`}
                    value={edu.endDate}
                    onChange={(e) => handleChange(edu.id, "endDate", e.target.value)}
                    placeholder="e.g. May 2022"
                    className="mt-1 bg-[rgba(30,40,80,0.4)] border-blue-900/30 focus:border-blue-500 text-gray-200"
                  />
                </div>

                <div className="sm:col-span-6">
                  <Label htmlFor={`description-${edu.id}`} className="text-blue-200">Description</Label>
                  <Textarea
                    id={`description-${edu.id}`}
                    value={edu.description}
                    onChange={(e) => handleChange(edu.id, "description", e.target.value)}
                    placeholder="Provide additional information about your studies, achievements, etc."
                    className="mt-1 bg-[rgba(30,40,80,0.4)] border-blue-900/30 focus:border-blue-500 text-gray-200"
                    rows={3}
                  />
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      ))}
      
      <Button
        variant="outline"
        onClick={handleAdd}
        className="flex gap-2 mt-2 border-blue-800/30 text-blue-300 hover:bg-blue-900/30 hover:text-blue-200"
      >
        <span className="text-lg">+</span> Add Education
      </Button>
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
    <div className="pt-4">
      <Card className="bg-[rgba(20,30,60,0.4)] border border-indigo-900/30">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skill) => (
              <div key={skill.id} className="flex items-center space-x-2">
                <Input
                  value={skill.name}
                  onChange={(e) => handleChange(skill.id, "name", e.target.value)}
                  placeholder="Skill name"
                  className="flex-grow bg-[rgba(30,40,80,0.4)] border-blue-900/30 focus:border-blue-500 text-gray-200"
                />
                <select
                  value={skill.proficiency}
                  onChange={(e) => handleChange(skill.id, "proficiency", parseInt(e.target.value))}
                  className="h-10 rounded-md border border-blue-900/30 bg-[rgba(30,40,80,0.4)] px-3 py-2 text-sm text-gray-200"
                >
                  <option value={1}>Beginner</option>
                  <option value={2}>Intermediate</option>
                  <option value={3}>Advanced</option>
                  <option value={4}>Expert</option>
                  <option value={5}>Master</option>
                </select>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDelete(skill.id)}
                  aria-label="Delete skill"
                  className="text-blue-400 hover:text-red-400 hover:bg-blue-950/50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          {skills.length === 0 && (
            <p className="text-sm text-blue-400 py-2">No skills added yet. Add your first skill below.</p>
          )}
          
          <Button
            variant="outline"
            onClick={handleAdd}
            className="flex gap-2 mt-4 border-blue-800/30 text-blue-300 hover:bg-blue-900/30 hover:text-blue-200"
          >
            <span className="text-lg">+</span> Add Skill
          </Button>
        </CardContent>
      </Card>
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
    <div className="pt-4">
      {projects.map((project) => (
        <Collapsible
          key={project.id}
          open={openId === project.id}
          onOpenChange={() => setOpenId(openId === project.id ? null : project.id)}
          className="mb-4 rounded-lg border border-indigo-900/30 bg-[rgba(20,30,60,0.4)] hover:bg-[rgba(25,35,65,0.5)]"
        >
          <div className="p-4">
            <div className="flex justify-between items-center">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="p-0 hover:bg-transparent justify-start text-left font-medium text-blue-300">
                  {project.title ? project.title : "New Project"}
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
                className="text-blue-400 hover:text-red-400 hover:bg-blue-950/50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <CollapsibleContent className="mt-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <Label htmlFor={`title-${project.id}`} className="text-blue-200">Project Title</Label>
                  <Input
                    id={`title-${project.id}`}
                    value={project.title}
                    onChange={(e) => handleChange(project.id, "title", e.target.value)}
                    className="mt-1 bg-[rgba(30,40,80,0.4)] border-blue-900/30 focus:border-blue-500 text-gray-200"
                  />
                </div>
                
                <div className="sm:col-span-6">
                  <Label htmlFor={`description-${project.id}`} className="text-blue-200">Description</Label>
                  <Textarea
                    id={`description-${project.id}`}
                    value={project.description}
                    onChange={(e) => handleChange(project.id, "description", e.target.value)}
                    placeholder="Describe the project, your role, and key achievements"
                    className="mt-1 bg-[rgba(30,40,80,0.4)] border-blue-900/30 focus:border-blue-500 text-gray-200"
                    rows={3}
                  />
                </div>

                <div className="sm:col-span-6">
                  <Label htmlFor={`technologies-${project.id}`} className="text-blue-200">Technologies</Label>
                  <Input
                    id={`technologies-${project.id}`}
                    value={project.technologies.join(", ")}
                    onChange={(e) => handleChange(project.id, "technologies", e.target.value.split(",").map(t => t.trim()))}
                    placeholder="e.g. React, Node.js, MongoDB (comma separated)"
                    className="mt-1 bg-[rgba(30,40,80,0.4)] border-blue-900/30 focus:border-blue-500 text-gray-200"
                  />
                </div>

                <div className="sm:col-span-6">
                  <Label htmlFor={`link-${project.id}`} className="text-blue-200">Project Link (optional)</Label>
                  <Input
                    id={`link-${project.id}`}
                    value={project.link || ""}
                    onChange={(e) => handleChange(project.id, "link", e.target.value)}
                    placeholder="e.g. https://github.com/username/project"
                    className="mt-1 bg-[rgba(30,40,80,0.4)] border-blue-900/30 focus:border-blue-500 text-gray-200"
                  />
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      ))}
      
      <Button
        variant="outline"
        onClick={handleAdd}
        className="flex gap-2 mt-2 border-blue-800/30 text-blue-300 hover:bg-blue-900/30 hover:text-blue-200"
      >
        <span className="text-lg">+</span> Add Project
      </Button>
    </div>
  );
}
