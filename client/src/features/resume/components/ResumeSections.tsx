import React, { useState } from 'react';
import { Trash, PlusCircle, ChevronUp, ChevronDown, Save, Globe, GripVertical } from 'lucide-react';
import { Button } from '@/ui/core/Button';
import RichTextEditor from '@/ui/core/RichTextEditor';
import { cn } from '@/lib/utils';
import { ExperienceItem, EducationItem, SkillItem, ProjectItem, PersonalInfo } from '../types';

// Experience Section Component
interface ResumeExperienceSectionProps {
  experiences: ExperienceItem[];
  onUpdate: (experiences: ExperienceItem[]) => void;
}

export function ResumeExperienceSection({ experiences, onUpdate }: ResumeExperienceSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(experiences.length > 0 ? experiences[0].id : null);
  
  const handleChange = (id: string, field: keyof ExperienceItem, value: string) => {
    const updatedExperiences = experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    onUpdate(updatedExperiences);
  };
  
  const handleDelete = (id: string) => {
    onUpdate(experiences.filter(exp => exp.id !== id));
  };
  
  const handleAdd = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    onUpdate([...experiences, newExp]);
    setExpandedId(newExp.id);
  };
  
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium text-foreground">Professional Experience</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAdd}
          iconLeft={<PlusCircle className="h-4 w-4" />}
        >
          Add Experience
        </Button>
      </div>
      
      <div className="space-y-4">
        {experiences.length === 0 ? (
          <div className="text-center p-6 border border-dashed border-border rounded-md">
            <p className="text-muted-foreground">No experience added yet. Click the button to add your work experience.</p>
          </div>
        ) : (
          experiences.map((exp, index) => (
            <div 
              key={exp.id} 
              className={cn(
                "border border-border rounded-md overflow-hidden transition-all", 
                expandedId === exp.id ? "bg-background/50" : "bg-background/20"
              )}
            >
              <div 
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => toggleExpand(exp.id)}
              >
                <div className="flex items-center">
                  <GripVertical className="h-5 w-5 text-primary mr-2 cursor-grab" />
                  <div>
                    <h4 className="font-medium text-foreground">
                      {exp.title || "Untitled Position"}
                      {exp.company && <span> at {exp.company}</span>}
                    </h4>
                    {(exp.startDate || exp.endDate) && (
                      <p className="text-sm text-muted-foreground">
                        {exp.startDate} {exp.startDate && exp.endDate && "–"} {exp.endDate}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(exp.id);
                    }}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                  {expandedId === exp.id ? (
                    <ChevronUp className="h-5 w-5 text-primary" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-primary" />
                  )}
                </div>
              </div>
              
              {expandedId === exp.id && (
                <div className="p-4 pt-0 border-t border-border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => handleChange(exp.id, 'title', e.target.value)}
                        className="w-full p-2 border border-border rounded-md bg-background"
                        placeholder="E.g. Software Engineer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleChange(exp.id, 'company', e.target.value)}
                        className="w-full p-2 border border-border rounded-md bg-background"
                        placeholder="E.g. Acme Corp"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Start Date
                      </label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => handleChange(exp.id, 'startDate', e.target.value)}
                        className="w-full p-2 border border-border rounded-md bg-background"
                        placeholder="E.g. Jan 2020"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        End Date
                      </label>
                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={(e) => handleChange(exp.id, 'endDate', e.target.value)}
                        className="w-full p-2 border border-border rounded-md bg-background"
                        placeholder="E.g. Present"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <RichTextEditor
                      label="Description"
                      value={exp.description}
                      onChange={(value) => handleChange(exp.id, 'description', value)}
                      placeholder="Describe your responsibilities, achievements, and technologies used..."
                      rows={5}
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
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
  const [expandedId, setExpandedId] = useState<string | null>(education.length > 0 ? education[0].id : null);
  
  const handleChange = (id: string, field: keyof EducationItem, value: string) => {
    const updatedEducation = education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    onUpdate(updatedEducation);
  };
  
  const handleDelete = (id: string) => {
    onUpdate(education.filter(edu => edu.id !== id));
  };
  
  const handleAdd = () => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      degree: '',
      institution: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    onUpdate([...education, newEdu]);
    setExpandedId(newEdu.id);
  };
  
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium text-foreground">Education</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAdd}
          iconLeft={<PlusCircle className="h-4 w-4" />}
        >
          Add Education
        </Button>
      </div>
      
      <div className="space-y-4">
        {education.length === 0 ? (
          <div className="text-center p-6 border border-dashed border-border rounded-md">
            <p className="text-muted-foreground">No education added yet. Click the button to add your education.</p>
          </div>
        ) : (
          education.map((edu, index) => (
            <div 
              key={edu.id} 
              className={cn(
                "border border-border rounded-md overflow-hidden transition-all", 
                expandedId === edu.id ? "bg-background/50" : "bg-background/20"
              )}
            >
              <div 
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => toggleExpand(edu.id)}
              >
                <div className="flex items-center">
                  <GripVertical className="h-5 w-5 text-primary mr-2 cursor-grab" />
                  <div>
                    <h4 className="font-medium text-foreground">
                      {edu.degree || "Untitled Degree"}
                      {edu.institution && <span> at {edu.institution}</span>}
                    </h4>
                    {(edu.startDate || edu.endDate) && (
                      <p className="text-sm text-muted-foreground">
                        {edu.startDate} {edu.startDate && edu.endDate && "–"} {edu.endDate}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(edu.id);
                    }}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                  {expandedId === edu.id ? (
                    <ChevronUp className="h-5 w-5 text-primary" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-primary" />
                  )}
                </div>
              </div>
              
              {expandedId === edu.id && (
                <div className="p-4 pt-0 border-t border-border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Degree
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleChange(edu.id, 'degree', e.target.value)}
                        className="w-full p-2 border border-border rounded-md bg-background"
                        placeholder="E.g. Bachelor of Science"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Institution
                      </label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleChange(edu.id, 'institution', e.target.value)}
                        className="w-full p-2 border border-border rounded-md bg-background"
                        placeholder="E.g. University of California"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Start Date
                      </label>
                      <input
                        type="text"
                        value={edu.startDate}
                        onChange={(e) => handleChange(edu.id, 'startDate', e.target.value)}
                        className="w-full p-2 border border-border rounded-md bg-background"
                        placeholder="E.g. Sep 2016"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        End Date
                      </label>
                      <input
                        type="text"
                        value={edu.endDate}
                        onChange={(e) => handleChange(edu.id, 'endDate', e.target.value)}
                        className="w-full p-2 border border-border rounded-md bg-background"
                        placeholder="E.g. Jun 2020"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <RichTextEditor
                      label="Description"
                      value={edu.description}
                      onChange={(value) => handleChange(edu.id, 'description', value)}
                      placeholder="Describe your degree, achievements, relevant coursework, etc..."
                      rows={4}
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
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
  const [newSkillName, setNewSkillName] = useState<string>('');
  
  const handleChange = (id: string, field: keyof SkillItem, value: any) => {
    const updatedSkills = skills.map(skill => 
      skill.id === id ? { ...skill, [field]: field === 'proficiency' ? parseInt(value) || 0 : value } : skill
    );
    onUpdate(updatedSkills);
  };
  
  const handleDelete = (id: string) => {
    onUpdate(skills.filter(skill => skill.id !== id));
  };
  
  const handleAdd = () => {
    if (!newSkillName.trim()) return;
    
    const newSkill: SkillItem = {
      id: `skill-${Date.now()}`,
      name: newSkillName,
      proficiency: 3,
      category: ''
    };
    
    onUpdate([...skills, newSkill]);
    setNewSkillName('');
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-foreground">Skills</h3>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            className="flex-1 p-2 border border-border rounded-md bg-background"
            placeholder="Add a new skill..."
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button 
            onClick={handleAdd}
            disabled={!newSkillName.trim()}
          >
            Add Skill
          </Button>
        </div>
        
        {skills.length === 0 ? (
          <div className="text-center p-6 border border-dashed border-border rounded-md">
            <p className="text-muted-foreground">No skills added yet. Type a skill name and click Add Skill.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {skills.map((skill) => (
              <div 
                key={skill.id} 
                className="flex items-center justify-between p-3 border border-border rounded-md bg-background/20"
              >
                <div className="flex-1 mr-2">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => handleChange(skill.id, 'name', e.target.value)}
                    className="w-full bg-transparent border-none p-0 focus:outline-none text-foreground"
                    placeholder="Skill name"
                  />
                  <div className="flex items-center mt-1">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={skill.proficiency}
                      onChange={(e) => handleChange(skill.id, 'proficiency', e.target.value)}
                      className="flex-1 h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <span className="ml-2 text-xs text-muted-foreground">
                      {['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'][skill.proficiency - 1] || 'Intermediate'}
                    </span>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0 ml-2"
                  onClick={() => handleDelete(skill.id)}
                >
                  <Trash className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Contact Section Component
interface ResumeContactSectionProps {
  personalInfo: PersonalInfo;
  title: string;
  onUpdatePersonalInfo: (updates: PersonalInfo) => void;
  onUpdateTitle: (title: string) => void;
}

export function ResumeContactSection({ 
  personalInfo, 
  title, 
  onUpdatePersonalInfo, 
  onUpdateTitle 
}: ResumeContactSectionProps) {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onUpdatePersonalInfo({
      ...personalInfo,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-foreground">Contact Information</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Resume Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => onUpdateTitle(e.target.value)}
            className="w-full p-2 border border-border rounded-md bg-background"
            placeholder="E.g. Senior Software Developer Resume"
          />
          <p className="text-xs text-muted-foreground mt-1">
            This is for your reference only and won't appear on the resume
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              First Name
            </label>
            <input
              type="text"
              value={personalInfo.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className="w-full p-2 border border-border rounded-md bg-background"
              placeholder="First Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={personalInfo.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className="w-full p-2 border border-border rounded-md bg-background"
              placeholder="Last Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Professional Title
            </label>
            <input
              type="text"
              value={personalInfo.headline}
              onChange={(e) => handleChange('headline', e.target.value)}
              className="w-full p-2 border border-border rounded-md bg-background"
              placeholder="E.g. Senior Software Engineer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <input
              type="email"
              value={personalInfo.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full p-2 border border-border rounded-md bg-background"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={personalInfo.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full p-2 border border-border rounded-md bg-background"
              placeholder="(123) 456-7890"
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
      
      <div className="space-y-4">
        <RichTextEditor
          value={summary}
          onChange={onUpdateSummary}
          placeholder="Write a compelling summary of your skills and experience..."
          rows={6}
        />
        
        <div className="text-sm text-muted-foreground">
          <p>Tips for an effective summary:</p>
          <ul className="list-disc ml-5 mt-1">
            <li>Keep it brief (3-5 sentences)</li>
            <li>Highlight your most relevant skills and achievements</li>
            <li>Tailor it to match the jobs you're applying to</li>
            <li>Use strong action verbs and quantify results when possible</li>
          </ul>
        </div>
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
  const [expandedId, setExpandedId] = useState<string | null>(projects.length > 0 ? projects[0].id : null);
  
  const handleChange = (id: string, field: keyof ProjectItem, value: any) => {
    const updatedProjects = projects.map(project => {
      if (project.id !== id) return project;
      
      if (field === 'technologies') {
        // If updating technologies, handle as array
        if (typeof value === 'string') {
          return { ...project, technologies: value.split(',').map(tech => tech.trim()) };
        }
        return { ...project, technologies: value };
      }
      
      return { ...project, [field]: value };
    });
    onUpdate(updatedProjects);
  };
  
  const handleDelete = (id: string) => {
    onUpdate(projects.filter(project => project.id !== id));
  };
  
  const handleAdd = () => {
    const newProject: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: '',
      description: '',
      technologies: [],
      link: ''
    };
    onUpdate([...projects, newProject]);
    setExpandedId(newProject.id);
  };
  
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium text-foreground">Projects</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAdd}
          iconLeft={<PlusCircle className="h-4 w-4" />}
        >
          Add Project
        </Button>
      </div>
      
      <div className="space-y-4">
        {projects.length === 0 ? (
          <div className="text-center p-6 border border-dashed border-border rounded-md">
            <p className="text-muted-foreground">No projects added yet. Click the button to add a project.</p>
          </div>
        ) : (
          projects.map((project, index) => (
            <div 
              key={project.id} 
              className={cn(
                "border border-border rounded-md overflow-hidden transition-all", 
                expandedId === project.id ? "bg-background/50" : "bg-background/20"
              )}
            >
              <div 
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => toggleExpand(project.id)}
              >
                <div className="flex items-center">
                  <GripVertical className="h-5 w-5 text-primary mr-2 cursor-grab" />
                  <div>
                    <h4 className="font-medium text-foreground">
                      {project.title || "Untitled Project"}
                    </h4>
                    {project.technologies.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        {project.technologies.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(project.id);
                    }}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                  {expandedId === project.id ? (
                    <ChevronUp className="h-5 w-5 text-primary" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-primary" />
                  )}
                </div>
              </div>
              
              {expandedId === project.id && (
                <div className="p-4 pt-0 border-t border-border">
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Project Title
                      </label>
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) => handleChange(project.id, 'title', e.target.value)}
                        className="w-full p-2 border border-border rounded-md bg-background"
                        placeholder="E.g. E-commerce Website"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Technologies Used
                      </label>
                      <input
                        type="text"
                        value={project.technologies.join(', ')}
                        onChange={(e) => handleChange(project.id, 'technologies', e.target.value)}
                        className="w-full p-2 border border-border rounded-md bg-background"
                        placeholder="E.g. React, Node.js, MongoDB"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Separate technologies with commas
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Project URL
                      </label>
                      <div className="flex">
                        <div className="flex items-center px-3 bg-muted border border-r-0 border-border rounded-l-md">
                          <Globe className="h-4 w-4 text-primary" />
                        </div>
                        <input
                          type="text"
                          value={project.link || ''}
                          onChange={(e) => handleChange(project.id, 'link', e.target.value)}
                          className="flex-1 p-2 border border-border rounded-r-md bg-background"
                          placeholder="https://example.com/project"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <RichTextEditor
                      label="Description"
                      value={project.description}
                      onChange={(value) => handleChange(project.id, 'description', value)}
                      placeholder="Describe the project, your role, and key achievements..."
                      rows={4}
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}