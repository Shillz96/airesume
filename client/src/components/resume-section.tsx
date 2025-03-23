import React, { useState } from 'react';
import { Button } from "@/components/ui/modern-button";
import { Trash, Plus, PenSquare, ChevronDown, ChevronUp } from 'lucide-react';
import RichTextEditor from "@/components/rich-text-editor";

// Types
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  headline: string;
  summary: string;
}
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

// Experience Section Component
interface ResumeExperienceSectionProps {
  experiences: ExperienceItem[];
  onUpdate: (experiences: ExperienceItem[]) => void;
}

export function ResumeExperienceSection({ experiences, onUpdate }: ResumeExperienceSectionProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const handleAddExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp_${Date.now()}`,
      title: 'New Position',
      company: 'Company Name',
      startDate: '2023-01',
      endDate: 'Present',
      description: 'Describe your responsibilities and achievements in this role.'
    };
    onUpdate([...experiences, newExp]);
    setExpandedItem(newExp.id);
  };

  const handleUpdateExperience = (id: string, field: keyof ExperienceItem, value: string) => {
    const updatedExperiences = experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    onUpdate(updatedExperiences);
  };

  const handleRemoveExperience = (id: string) => {
    const updatedExperiences = experiences.filter(exp => exp.id !== id);
    onUpdate(updatedExperiences);
  };

  const toggleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium text-foreground">Work Experience</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAddExperience}
          iconLeft={<Plus className="h-4 w-4" />}
        >
          Add Experience
        </Button>
      </div>

      <div className="space-y-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="border border-border rounded-lg overflow-hidden bg-card">
            <div 
              className="flex justify-between items-center p-4 cursor-pointer"
              onClick={() => toggleExpand(exp.id)}
            >
              <div>
                <h4 className="font-medium text-foreground">{exp.title}</h4>
                <p className="text-sm text-foreground/70">{exp.company} • {exp.startDate} to {exp.endDate}</p>
              </div>
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveExperience(exp.id);
                  }}
                >
                  <Trash className="h-4 w-4 text-error" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(exp.id);
                  }}
                >
                  {expandedItem === exp.id ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </Button>
              </div>
            </div>

            {expandedItem === exp.id && (
              <div className="p-4 bg-background/50 border-t border-border space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Job Title</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground"
                      value={exp.title}
                      onChange={(e) => handleUpdateExperience(exp.id, 'title', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Company</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground"
                      value={exp.company}
                      onChange={(e) => handleUpdateExperience(exp.id, 'company', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input
                      type="month"
                      className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground"
                      value={exp.startDate}
                      onChange={(e) => handleUpdateExperience(exp.id, 'startDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground"
                        value={exp.endDate}
                        onChange={(e) => handleUpdateExperience(exp.id, 'endDate', e.target.value)}
                        placeholder="Present or YYYY-MM"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <RichTextEditor
                    value={exp.description}
                    onChange={(value) => handleUpdateExperience(exp.id, 'description', value)}
                    rows={5}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Education Section Component
interface ResumeEducationSectionProps {
  education: EducationItem[];
  onUpdate: (education: EducationItem[]) => void;
}

export function ResumeEducationSection({ education, onUpdate }: ResumeEducationSectionProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const handleAddEducation = () => {
    const newEdu: EducationItem = {
      id: `edu_${Date.now()}`,
      degree: 'Degree Name',
      institution: 'Institution Name',
      startDate: '2020-09',
      endDate: '2023-06',
      description: 'Describe your education, achievements, and relevant coursework.'
    };
    onUpdate([...education, newEdu]);
    setExpandedItem(newEdu.id);
  };

  const handleUpdateEducation = (id: string, field: keyof EducationItem, value: string) => {
    const updatedEducation = education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    onUpdate(updatedEducation);
  };

  const handleRemoveEducation = (id: string) => {
    const updatedEducation = education.filter(edu => edu.id !== id);
    onUpdate(updatedEducation);
  };

  const toggleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium text-foreground">Education</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAddEducation}
          iconLeft={<Plus className="h-4 w-4" />}
        >
          Add Education
        </Button>
      </div>

      <div className="space-y-4">
        {education.map((edu) => (
          <div key={edu.id} className="border border-border rounded-lg overflow-hidden bg-card">
            <div 
              className="flex justify-between items-center p-4 cursor-pointer"
              onClick={() => toggleExpand(edu.id)}
            >
              <div>
                <h4 className="font-medium text-foreground">{edu.degree}</h4>
                <p className="text-sm text-foreground/70">{edu.institution} • {edu.startDate} to {edu.endDate}</p>
              </div>
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveEducation(edu.id);
                  }}
                >
                  <Trash className="h-4 w-4 text-error" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(edu.id);
                  }}
                >
                  {expandedItem === edu.id ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </Button>
              </div>
            </div>

            {expandedItem === edu.id && (
              <div className="p-4 bg-background/50 border-t border-border space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Degree</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground"
                      value={edu.degree}
                      onChange={(e) => handleUpdateEducation(edu.id, 'degree', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Institution</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground"
                      value={edu.institution}
                      onChange={(e) => handleUpdateEducation(edu.id, 'institution', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input
                      type="month"
                      className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground"
                      value={edu.startDate}
                      onChange={(e) => handleUpdateEducation(edu.id, 'startDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground"
                      value={edu.endDate}
                      onChange={(e) => handleUpdateEducation(edu.id, 'endDate', e.target.value)}
                      placeholder="Present or YYYY-MM"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <RichTextEditor
                    value={edu.description}
                    onChange={(value) => handleUpdateEducation(edu.id, 'description', value)}
                    rows={4}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Skills Section Component
interface ResumeSkillsSectionProps {
  skills: SkillItem[];
  onUpdate: (skills: SkillItem[]) => void;
}

export function ResumeSkillsSection({ skills, onUpdate }: ResumeSkillsSectionProps) {
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProficiency, setNewSkillProficiency] = useState(3);

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;

    const newSkill: SkillItem = {
      id: `skill_${Date.now()}`,
      name: newSkillName,
      proficiency: newSkillProficiency,
    };
    onUpdate([...skills, newSkill]);
    setNewSkillName('');
    setNewSkillProficiency(3);
  };

  const handleRemoveSkill = (id: string) => {
    const updatedSkills = skills.filter(skill => skill.id !== id);
    onUpdate(updatedSkills);
  };

  const handleUpdateSkillProficiency = (id: string, proficiency: number) => {
    const updatedSkills = skills.map(skill => 
      skill.id === id ? { ...skill, proficiency } : skill
    );
    onUpdate(updatedSkills);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-foreground">Skills</h3>

      <div className="flex space-x-2">
        <input
          type="text"
          className="flex-1 px-3 py-2 border border-border rounded-md bg-card text-foreground"
          placeholder="Add a new skill..."
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAddSkill();
          }}
        />
        <div className="flex items-center space-x-2 min-w-[200px]">
          <span className="text-sm text-foreground/70">Level:</span>
          <input
            type="range"
            min="1"
            max="5"
            value={newSkillProficiency}
            onChange={(e) => setNewSkillProficiency(parseInt(e.target.value))}
            className="w-full"
          />
          <span className="text-sm font-medium w-8 text-center">{newSkillProficiency}/5</span>
        </div>
        <Button 
          variant="outline" 
          onClick={handleAddSkill}
          iconLeft={<Plus className="h-4 w-4" />}
        >
          Add
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {skills.map((skill) => (
          <div 
            key={skill.id} 
            className="group flex items-center justify-between px-4 py-2 border border-border rounded-md bg-card"
          >
            <div className="flex-1">
              <div className="font-medium text-foreground">{skill.name}</div>
              <div className="mt-1 h-2 bg-border rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary"
                  style={{ width: `${(skill.proficiency / 5) * 100}%` }}
                />
              </div>
            </div>
            <div className="ml-4 flex items-center">
              <span className="text-xs font-medium text-foreground/70 mr-2">{skill.proficiency}/5</span>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveSkill(skill.id)}
              >
                <Trash className="h-4 w-4 text-error" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Contact Information Section Component
interface ResumeContactSectionProps {
  personalInfo: PersonalInfo;
  title: string;
  onUpdatePersonalInfo: (updates: Partial<PersonalInfo>) => void;
  onUpdateTitle: (title: string) => void;
}

export function ResumeContactSection({ 
  personalInfo, 
  title, 
  onUpdatePersonalInfo, 
  onUpdateTitle 
}: ResumeContactSectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-foreground">Contact Information</h3>
      
      <div className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">Resume Title</label>
          <input 
            type="text"
            id="title"
            value={title}
            onChange={(e) => onUpdateTitle(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground"
            placeholder="e.g., Software Engineer Resume"
          />
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name</label>
            <input 
              type="text"
              id="firstName"
              value={personalInfo.firstName}
              onChange={(e) => onUpdatePersonalInfo({ firstName: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground"
              placeholder="John"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium mb-1">Last Name</label>
            <input 
              type="text"
              id="lastName"
              value={personalInfo.lastName}
              onChange={(e) => onUpdatePersonalInfo({ lastName: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground"
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email"
              id="email"
              value={personalInfo.email}
              onChange={(e) => onUpdatePersonalInfo({ email: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground"
              placeholder="johndoe@example.com"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
            <input 
              type="text"
              id="phone"
              value={personalInfo.phone}
              onChange={(e) => onUpdatePersonalInfo({ phone: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground"
              placeholder="(123) 456-7890"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="headline" className="block text-sm font-medium mb-1">Professional Headline</label>
          <input 
            type="text"
            id="headline"
            value={personalInfo.headline}
            onChange={(e) => onUpdatePersonalInfo({ headline: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground"
            placeholder="e.g., Senior Software Engineer | Full Stack Developer | Tech Lead"
          />
        </div>
      </div>
    </div>
  );
}

// Professional Summary Section Component
interface ResumeSummarySectionProps {
  summary: string;
  onUpdateSummary: (summary: string) => void;
}

export function ResumeSummarySection({ summary, onUpdateSummary }: ResumeSummarySectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-foreground">Professional Summary</h3>
      <p className="text-muted-foreground">
        Write a compelling summary that highlights your skills, experience, and achievements.
      </p>
      
      <div>
        <label htmlFor="summaryFull" className="block text-sm font-medium mb-1">Professional Summary</label>
        <textarea 
          id="summaryFull"
          value={summary}
          onChange={(e) => onUpdateSummary(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground min-h-[250px]"
          placeholder="Write a short summary of your skills and experience..."
        />
      </div>
    </div>
  );
}

// Projects Section Component
interface ResumeProjectsSectionProps {
  projects: ProjectItem[];
  onUpdate: (projects: ProjectItem[]) => void;
}

export function ResumeProjectsSection({ projects, onUpdate }: ResumeProjectsSectionProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const handleAddProject = () => {
    const newProject: ProjectItem = {
      id: `proj_${Date.now()}`,
      title: 'New Project',
      description: 'Describe your project, including your role and achievements.',
      technologies: ['Technology 1', 'Technology 2'],
      link: ''
    };
    onUpdate([...projects, newProject]);
    setExpandedItem(newProject.id);
  };

  const handleUpdateProject = (id: string, field: keyof ProjectItem, value: any) => {
    const updatedProjects = projects.map(proj => 
      proj.id === id ? { ...proj, [field]: value } : proj
    );
    onUpdate(updatedProjects);
  };

  const handleUpdateTechnologies = (id: string, techString: string) => {
    const technologies = techString.split(',').map(tech => tech.trim()).filter(tech => tech !== '');
    handleUpdateProject(id, 'technologies', technologies);
  };

  const handleRemoveProject = (id: string) => {
    const updatedProjects = projects.filter(proj => proj.id !== id);
    onUpdate(updatedProjects);
  };

  const toggleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium text-foreground">Projects</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAddProject}
          iconLeft={<Plus className="h-4 w-4" />}
        >
          Add Project
        </Button>
      </div>

      <div className="space-y-4">
        {projects.map((proj) => (
          <div key={proj.id} className="border border-border rounded-lg overflow-hidden bg-card">
            <div 
              className="flex justify-between items-center p-4 cursor-pointer"
              onClick={() => toggleExpand(proj.id)}
            >
              <div>
                <h4 className="font-medium text-foreground">{proj.title}</h4>
                <p className="text-sm text-foreground/70">
                  {proj.technologies.join(', ')}
                </p>
              </div>
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveProject(proj.id);
                  }}
                >
                  <Trash className="h-4 w-4 text-error" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(proj.id);
                  }}
                >
                  {expandedItem === proj.id ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </Button>
              </div>
            </div>

            {expandedItem === proj.id && (
              <div className="p-4 bg-background/50 border-t border-border space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Project Title</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground"
                    value={proj.title}
                    onChange={(e) => handleUpdateProject(proj.id, 'title', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <RichTextEditor
                    value={proj.description}
                    onChange={(value) => handleUpdateProject(proj.id, 'description', value)}
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Technologies (comma separated)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground"
                    value={proj.technologies.join(', ')}
                    onChange={(e) => handleUpdateTechnologies(proj.id, e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Project Link (optional)</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground"
                    value={proj.link || ''}
                    onChange={(e) => handleUpdateProject(proj.id, 'link', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}