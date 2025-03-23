import React, { useState } from 'react';
import { Trash, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/ui/core/Button';
import RichTextEditor from '@/ui/core/RichTextEditor';
import { 
  PersonalInfo, 
  ExperienceItem, 
  EducationItem, 
  SkillItem, 
  ProjectItem 
} from '../types';

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

// Contact Section Component
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
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Resume Title</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground"
            value={title}
            onChange={(e) => onUpdateTitle(e.target.value)}
            placeholder="e.g., Software Developer Resume"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground"
              value={personalInfo.firstName}
              onChange={(e) => onUpdatePersonalInfo({ firstName: e.target.value })}
              placeholder="Your first name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground"
              value={personalInfo.lastName}
              onChange={(e) => onUpdatePersonalInfo({ lastName: e.target.value })}
              placeholder="Your last name"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Professional Headline</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground"
            value={personalInfo.headline}
            onChange={(e) => onUpdatePersonalInfo({ headline: e.target.value })}
            placeholder="e.g., Senior Software Engineer with 5+ years experience"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground"
              value={personalInfo.email}
              onChange={(e) => onUpdatePersonalInfo({ email: e.target.value })}
              placeholder="your.email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground"
              value={personalInfo.phone}
              onChange={(e) => onUpdatePersonalInfo({ phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Summary Section Component
interface ResumeSummarySectionProps {
  summary: string;
  onUpdateSummary: (summary: string) => void;
}

export function ResumeSummarySection({ summary, onUpdateSummary }: ResumeSummarySectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-foreground">Professional Summary</h3>
      
      <div>
        <RichTextEditor
          value={summary}
          onChange={onUpdateSummary}
          placeholder="Write a compelling summary that highlights your skills, experience, and career goals..."
          rows={6}
        />
        <p className="text-xs text-foreground/70 mt-2">
          A strong summary highlights your most relevant qualifications and sets you apart from other candidates.
        </p>
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
  const [newTech, setNewTech] = useState('');

  const handleAddProject = () => {
    const newProject: ProjectItem = {
      id: `project_${Date.now()}`,
      title: 'New Project',
      description: 'Describe your project, its purpose, and your contribution.',
      technologies: [],
      link: '',
    };
    onUpdate([...projects, newProject]);
    setExpandedItem(newProject.id);
  };

  const handleUpdateProject = (id: string, field: keyof ProjectItem, value: any) => {
    const updatedProjects = projects.map(project => 
      project.id === id ? { ...project, [field]: value } : project
    );
    onUpdate(updatedProjects);
  };

  const handleRemoveProject = (id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    onUpdate(updatedProjects);
  };

  const toggleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const handleAddTechnology = (projectId: string) => {
    if (!newTech.trim()) return;
    
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          technologies: [...project.technologies, newTech.trim()]
        };
      }
      return project;
    });
    
    onUpdate(updatedProjects);
    setNewTech('');
  };

  const handleRemoveTechnology = (projectId: string, techIndex: number) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        const updatedTechnologies = [...project.technologies];
        updatedTechnologies.splice(techIndex, 1);
        return {
          ...project,
          technologies: updatedTechnologies
        };
      }
      return project;
    });
    
    onUpdate(updatedProjects);
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
        {projects.map((project) => (
          <div key={project.id} className="border border-border rounded-lg overflow-hidden bg-card">
            <div 
              className="flex justify-between items-center p-4 cursor-pointer"
              onClick={() => toggleExpand(project.id)}
            >
              <div>
                <h4 className="font-medium text-foreground">{project.title}</h4>
                {project.technologies.length > 0 && (
                  <p className="text-sm text-foreground/70">
                    {project.technologies.slice(0, 3).join(', ')}
                    {project.technologies.length > 3 && '...'}
                  </p>
                )}
              </div>
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveProject(project.id);
                  }}
                >
                  <Trash className="h-4 w-4 text-error" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(project.id);
                  }}
                >
                  {expandedItem === project.id ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </Button>
              </div>
            </div>

            {expandedItem === project.id && (
              <div className="p-4 bg-background/50 border-t border-border space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Project Title</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground"
                    value={project.title}
                    onChange={(e) => handleUpdateProject(project.id, 'title', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Project Link (Optional)</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground"
                    value={project.link || ''}
                    onChange={(e) => handleUpdateProject(project.id, 'link', e.target.value)}
                    placeholder="https://example.com/project"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <RichTextEditor
                    value={project.description}
                    onChange={(value) => handleUpdateProject(project.id, 'description', value)}
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Technologies Used</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.technologies.map((tech, index) => (
                      <div key={index} className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm flex items-center">
                        {tech}
                        <button
                          type="button"
                          className="ml-1 text-foreground/70 hover:text-foreground"
                          onClick={() => handleRemoveTechnology(project.id, index)}
                        >
                          <span className="sr-only">Remove</span>
                          <span aria-hidden="true">×</span>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-border rounded-l-md bg-card text-foreground"
                      placeholder="Add a technology..."
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTechnology(project.id);
                        }
                      }}
                    />
                    <Button 
                      variant="outline"
                      className="rounded-l-none"
                      onClick={() => handleAddTechnology(project.id)}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}