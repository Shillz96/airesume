import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CosmicButton } from '@/components/cosmic-button-refactored';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { getCosmicColor } from '@/lib/theme-utils';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  CheckIcon,
  Upload,
  Plus,
  Trash2 as Trash,
  Edit,
  Save,
  FolderGit2,
  Link as LinkIcon,
  X,
  GraduationCap,
  Calendar,
  Building,
  School,
  Wrench,
  Star
} from 'lucide-react';

import {
  PersonalInfo,
  ExperienceItem,
  EducationItem,
  SkillItem,
  ProjectItem
} from '@/hooks/use-resume-data';

/* =========================== SHARED COMPONENTS =========================== */

interface SectionHeaderProps {
  title: string;
  icon: React.ReactNode;
  onAdd?: () => void;
  addButtonText?: string;
  className?: string;
}

export function SectionHeader({ title, icon, onAdd, addButtonText = 'Add', className = '' }: SectionHeaderProps) {
  return (
    <div className={`flex justify-between items-center resume-mb-4 ${className}`}>
      <div className="flex items-center resume-gap-2">
        {icon && <span className="text-resume-text-accent">{icon}</span>}
        <h3 className="font-semibold text-lg text-resume-text-primary">{title}</h3>
      </div>
      {onAdd && (
        <CosmicButton
          size="sm"
          variant="outline"
          onClick={onAdd}
          iconLeft={<Plus className="h-4 w-4" />}
          withGlow
        >
          {addButtonText}
        </CosmicButton>
      )}
    </div>
  );
}

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
  isEditing?: boolean;
  withHoverEffect?: boolean;
}

export function SectionCard({ 
  children, 
  className = '', 
  isEditing = false, 
  withHoverEffect = true 
}: SectionCardProps) {
  return (
    <div 
      className={`cosmic-panel resume-p-4 resume-mb-4 backdrop-blur-sm ${withHoverEffect ? 'cosmic-card-hoverable cosmic-card-gradient' : ''} ${
        isEditing ? 'border-primary/30 bg-primary/10' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface ItemActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onCopy?: () => void;
  onSave?: () => void;
  isEditing?: boolean;
  className?: string;
}

export function ItemActions({ 
  onEdit, 
  onDelete, 
  onCopy, 
  onSave, 
  isEditing = false,
  className = '' 
}: ItemActionsProps) {
  return (
    <div className={`flex resume-gap-2 ${className}`}>
      {!isEditing && onEdit && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onEdit} 
          className="h-8 w-8 p-0 border border-resume-panel-border hover:bg-primary/20 hover:text-primary"
          title="Edit"
        >
          <Edit className="h-4 w-4 text-resume-text-accent" />
        </Button>
      )}
      
      {isEditing && onSave && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onSave} 
          className="h-8 w-8 p-0 border border-resume-panel-border hover:bg-primary/20 hover:text-primary"
          title="Save changes"
        >
          <Save className="h-4 w-4 text-resume-text-accent" />
        </Button>
      )}
      
      {onDelete && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onDelete} 
          className="h-8 w-8 p-0 border border-resume-panel-border hover:bg-destructive/20 hover:text-destructive"
          title="Delete"
        >
          <Trash className="h-4 w-4 text-resume-text-accent" />
        </Button>
      )}
    </div>
  );
}

/* ============================= PERSONAL INFO SECTION ============================= */

interface PersonalInfoSectionProps {
  personalInfo: PersonalInfo;
  resumeId?: string;
  onUpdate: (field: keyof PersonalInfo, value: string) => void;
  onFileUpload?: () => void;
  showUploadCard?: boolean;
}

export function PersonalInfoSection({
  personalInfo,
  resumeId,
  onUpdate,
  onFileUpload,
  showUploadCard = false
}: PersonalInfoSectionProps) {
  return (
    <div className="resume-space-y-4">
      <SectionHeader 
        title="Personal Information" 
        icon={<User className="h-5 w-5" />}
      />

      {showUploadCard && onFileUpload && (
        <SectionCard withHoverEffect={true} className="resume-mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-lg text-resume-text-accent">Import from Existing Resume</h4>
              <p className="text-sm text-resume-text-secondary resume-mt-1">
                Upload your existing resume to extract your information automatically
              </p>
            </div>
            <CosmicButton
              variant="outline"
              onClick={onFileUpload}
              iconLeft={<Upload className="h-4 w-4 resume-mr-2" />}
              withGlow
            >
              Upload Resume
            </CosmicButton>
          </div>
        </SectionCard>
      )}

      <SectionCard className="transition-all duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 resume-gap-6">
          {/* First column */}
          <div className="resume-space-y-4">
            <div className="resume-space-y-2">
              <Label htmlFor="firstName" className="text-resume-text-secondary">First Name</Label>
              <Input
                id="firstName"
                value={personalInfo.firstName}
                onChange={(e) => onUpdate('firstName', e.target.value)}
                placeholder="Your first name"
                className="cosmic-input"
              />
            </div>

            <div className="resume-space-y-2">
              <Label htmlFor="lastName" className="text-resume-text-secondary">Last Name</Label>
              <Input
                id="lastName"
                value={personalInfo.lastName}
                onChange={(e) => onUpdate('lastName', e.target.value)}
                placeholder="Your last name"
                className="cosmic-input"
              />
            </div>

            <div className="resume-space-y-2">
              <Label htmlFor="email" className="text-resume-text-secondary">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-resume-text-accent" />
                <Input
                  id="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => onUpdate('email', e.target.value)}
                  className="cosmic-input pl-10"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="resume-space-y-2">
              <Label htmlFor="phone" className="text-resume-text-secondary">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-resume-text-accent" />
                <Input
                  id="phone"
                  value={personalInfo.phone}
                  onChange={(e) => onUpdate('phone', e.target.value)}
                  className="cosmic-input pl-10"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Second column */}
          <div className="resume-space-y-4">
            <div className="resume-space-y-2">
              <Label htmlFor="headline" className="text-resume-text-secondary">Professional Headline</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 h-4 w-4 text-resume-text-accent" />
                <Input
                  id="headline"
                  value={personalInfo.headline}
                  onChange={(e) => onUpdate('headline', e.target.value)}
                  className="cosmic-input pl-10"
                  placeholder="e.g., Senior Software Engineer | React Specialist"
                />
              </div>
              <p className="resume-mt-2 text-xs text-resume-text-muted">
                A short headline that appears below your name
              </p>
            </div>

            <div className="resume-space-y-2">
              <Label htmlFor="summary" className="text-resume-text-secondary">Professional Summary</Label>
              <Textarea
                id="summary"
                value={personalInfo.summary}
                onChange={(e) => onUpdate('summary', e.target.value)}
                rows={8}
                className="cosmic-input"
                placeholder="Briefly introduce yourself, highlighting your expertise, experience, and unique value proposition..."
              />
              <p className="resume-mt-2 text-xs text-resume-text-muted">
                Aim for 3-5 sentences that highlight your professional strengths and career goals
              </p>
            </div>
          </div>
        </div>

        <div className="resume-mt-6 resume-pt-4 border-t border-resume-panel-border">
          <h4 className="text-sm font-medium text-resume-text-secondary resume-mb-3">Recommendations:</h4>
          <ul className="resume-space-y-2 text-sm">
            <li className="flex items-start resume-gap-2">
              <div className="rounded-full bg-primary/20 text-resume-text-accent p-0.5 mt-0.5">
                <CheckIcon size={12} />
              </div>
              <span className="text-resume-text-secondary">Keep your summary concise and impactful - aim for 3-5 sentences</span>
            </li>
            <li className="flex items-start resume-gap-2">
              <div className="rounded-full bg-primary/20 text-resume-text-accent p-0.5 mt-0.5">
                <CheckIcon size={12} />
              </div>
              <span className="text-resume-text-secondary">Include relevant keywords from job descriptions you're targeting</span>
            </li>
            <li className="flex items-start resume-gap-2">
              <div className="rounded-full bg-primary/20 text-resume-text-accent p-0.5 mt-0.5">
                <CheckIcon size={12} />
              </div>
              <span className="text-resume-text-secondary">Your professional headline should be specific and include your specialty</span>
            </li>
            <li className="flex items-start resume-gap-2">
              <div className="rounded-full bg-primary/20 text-resume-text-accent p-0.5 mt-0.5">
                <CheckIcon size={12} />
              </div>
              <span className="text-resume-text-secondary">Use a professional email address, ideally with your name</span>
            </li>
          </ul>
        </div>
      </SectionCard>
    </div>
  );
}

/* ============================= EXPERIENCE SECTION ============================= */

interface ExperienceSectionProps {
  experiences: ExperienceItem[];
  resumeId?: string;
  onUpdate: (experiences: ExperienceItem[]) => void;
  onAdd?: () => string; // Returns the new ID
}

export function ExperienceSection({
  experiences,
  resumeId,
  onUpdate,
  onAdd
}: ExperienceSectionProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const handleAddExperience = () => {
    if (onAdd) {
      const newId = onAdd();
      setExpandedItem(newId);
      setEditingItemId(newId);
    } else {
      // Fallback if onAdd not provided
      const newExperience = {
        id: crypto.randomUUID(),
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        description: ''
      };
      onUpdate([...experiences, newExperience]);
      setExpandedItem(newExperience.id);
      setEditingItemId(newExperience.id);
    }
  };

  const handleRemoveExperience = (id: string) => {
    const updatedExperiences = experiences.filter(exp => exp.id !== id);
    onUpdate(updatedExperiences);
    if (expandedItem === id) {
      setExpandedItem(null);
    }
    if (editingItemId === id) {
      setEditingItemId(null);
    }
  };

  const handleExperienceChange = (id: string, field: keyof ExperienceItem, value: string) => {
    const updatedExperiences = experiences.map(exp => {
      if (exp.id === id) {
        return { ...exp, [field]: value };
      }
      return exp;
    });
    onUpdate(updatedExperiences);
  };

  return (
    <div className="resume-space-y-4">
      <SectionHeader 
        title="Work Experience" 
        icon={<Briefcase className="h-5 w-5" />}
        onAdd={handleAddExperience}
        addButtonText="Add Experience"
      />

      {experiences.length === 0 ? (
        <div className="cosmic-panel resume-p-6 flex flex-col items-center justify-center">
          <Briefcase className="h-12 w-12 resume-mb-2 text-resume-text-accent opacity-30" />
          <p className="text-center text-sm resume-mb-4 text-resume-text-secondary">
            Add your work experience to showcase your professional journey and accomplishments
          </p>
          <CosmicButton 
            variant="outline" 
            size="sm" 
            onClick={handleAddExperience}
            withGlow
          >
            Add Experience
          </CosmicButton>
        </div>
      ) : (
        <Accordion
          type="single"
          collapsible
          value={expandedItem || undefined}
          onValueChange={(value) => setExpandedItem(value)}
          className="resume-space-y-2"
        >
          {experiences.map((experience) => (
            <AccordionItem
              key={experience.id}
              value={experience.id}
              className={cn(
                "cosmic-panel overflow-hidden",
                expandedItem === experience.id ? "ring-1 ring-resume-panel-border" : ""
              )}
            >
              <AccordionTrigger className="resume-p-4 hover:bg-primary/10 data-[state=open]:bg-primary/20">
                <div className="flex flex-1 justify-between items-center">
                  <div className="text-left">
                    <p className="font-medium text-resume-text-primary">
                      {experience.title || "New Position"}
                    </p>
                    {experience.company && (
                      <div className="flex items-center resume-gap-1 resume-mt-1 text-sm text-resume-text-secondary">
                        <Building className="h-3 w-3" />
                        <span>{experience.company}</span>
                        {(experience.startDate || experience.endDate) && (
                          <>
                            <span className="mx-1">•</span>
                            <Calendar className="h-3 w-3" />
                            <span>
                              {experience.startDate || 'Start'} - {experience.endDate || 'Present'}
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <div className="resume-p-4 resume-space-y-4 bg-resume-panel-bg rounded-b-md">
                  <div className="resume-space-y-2">
                    <Label htmlFor={`exp-title-${experience.id}`} className="text-resume-text-secondary">Job Title</Label>
                    <Input
                      id={`exp-title-${experience.id}`}
                      value={experience.title}
                      onChange={(e) => handleExperienceChange(experience.id, 'title', e.target.value)}
                      placeholder="e.g., Senior Software Engineer"
                      className="cosmic-input"
                    />
                  </div>

                  <div className="resume-space-y-2">
                    <Label htmlFor={`exp-company-${experience.id}`} className="text-resume-text-secondary">Company</Label>
                    <Input
                      id={`exp-company-${experience.id}`}
                      value={experience.company}
                      onChange={(e) => handleExperienceChange(experience.id, 'company', e.target.value)}
                      placeholder="e.g., Acme Corporation"
                      className="cosmic-input"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 resume-gap-4">
                    <div className="resume-space-y-2">
                      <Label htmlFor={`exp-start-${experience.id}`} className="text-resume-text-secondary">Start Date</Label>
                      <Input
                        id={`exp-start-${experience.id}`}
                        value={experience.startDate}
                        onChange={(e) => handleExperienceChange(experience.id, 'startDate', e.target.value)}
                        placeholder="e.g., Jun 2020 or 2020-06"
                        className="cosmic-input"
                      />
                    </div>

                    <div className="resume-space-y-2">
                      <Label htmlFor={`exp-end-${experience.id}`} className="text-resume-text-secondary">End Date</Label>
                      <Input
                        id={`exp-end-${experience.id}`}
                        value={experience.endDate}
                        onChange={(e) => handleExperienceChange(experience.id, 'endDate', e.target.value)}
                        placeholder="e.g., Present or 2023-08"
                        className="cosmic-input"
                      />
                    </div>
                  </div>

                  <div className="resume-space-y-2">
                    <Label htmlFor={`exp-description-${experience.id}`} className="text-resume-text-secondary">Description</Label>
                    <Textarea
                      id={`exp-description-${experience.id}`}
                      value={experience.description}
                      onChange={(e) => handleExperienceChange(experience.id, 'description', e.target.value)}
                      placeholder="Describe your responsibilities, achievements, and key contributions..."
                      rows={6}
                      className="cosmic-input"
                    />
                    <p className="resume-mt-2 text-xs text-resume-text-muted">
                      Use bullet points starting with strong action verbs to highlight your accomplishments
                    </p>
                  </div>

                  <div className="flex justify-end resume-pt-2 resume-pb-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 border border-resume-panel-border"
                      onClick={() => handleRemoveExperience(experience.id)}
                    >
                      <Trash className="h-4 w-4 resume-mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}

/* ============================= EDUCATION SECTION ============================= */

interface EducationSectionProps {
  education: EducationItem[];
  resumeId?: string;
  onUpdate: (education: EducationItem[]) => void;
  onAdd?: () => string; // Returns the new ID
}

export function EducationSection({
  education,
  resumeId,
  onUpdate,
  onAdd
}: EducationSectionProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const handleAddEducation = () => {
    if (onAdd) {
      const newId = onAdd();
      setExpandedItem(newId);
      setEditingItemId(newId);
    } else {
      // Fallback if onAdd not provided
      const newEducation = {
        id: crypto.randomUUID(),
        degree: '',
        institution: '',
        startDate: '',
        endDate: '',
        description: ''
      };
      onUpdate([...education, newEducation]);
      setExpandedItem(newEducation.id);
      setEditingItemId(newEducation.id);
    }
  };

  const handleRemoveEducation = (id: string) => {
    const updatedEducation = education.filter(edu => edu.id !== id);
    onUpdate(updatedEducation);
    if (expandedItem === id) {
      setExpandedItem(null);
    }
    if (editingItemId === id) {
      setEditingItemId(null);
    }
  };

  const handleEducationChange = (id: string, field: keyof EducationItem, value: string) => {
    const updatedEducation = education.map(edu => {
      if (edu.id === id) {
        return { ...edu, [field]: value };
      }
      return edu;
    });
    onUpdate(updatedEducation);
  };

  return (
    <div className="resume-space-y-4">
      <SectionHeader 
        title="Education" 
        icon={<GraduationCap className="h-5 w-5" />}
        onAdd={handleAddEducation}
        addButtonText="Add Education"
      />

      {education.length === 0 ? (
        <div className="cosmic-panel resume-p-6 flex flex-col items-center justify-center">
          <GraduationCap className="h-12 w-12 resume-mb-2 text-resume-text-accent opacity-30" />
          <p className="text-center text-sm resume-mb-4 text-resume-text-secondary">
            Add your educational background to showcase your academic achievements and qualifications
          </p>
          <CosmicButton 
            variant="outline" 
            size="sm" 
            onClick={handleAddEducation}
            withGlow
          >
            Add Education
          </CosmicButton>
        </div>
      ) : (
        <Accordion
          type="single"
          collapsible
          value={expandedItem || undefined}
          onValueChange={(value) => setExpandedItem(value)}
          className="resume-space-y-2"
        >
          {education.map((edu) => (
            <AccordionItem
              key={edu.id}
              value={edu.id}
              className={cn(
                "cosmic-panel overflow-hidden",
                expandedItem === edu.id ? "ring-1 ring-resume-panel-border" : ""
              )}
            >
              <AccordionTrigger className="resume-p-4 hover:bg-primary/10 data-[state=open]:bg-primary/20">
                <div className="flex flex-1 justify-between items-center">
                  <div className="text-left">
                    <p className="font-medium text-resume-text-primary">
                      {edu.degree || "New Degree"}
                    </p>
                    {edu.institution && (
                      <div className="flex items-center resume-gap-1 resume-mt-1 text-sm text-resume-text-secondary">
                        <School className="h-3 w-3" />
                        <span>{edu.institution}</span>
                        {(edu.startDate || edu.endDate) && (
                          <>
                            <span className="mx-1">•</span>
                            <Calendar className="h-3 w-3" />
                            <span>
                              {edu.startDate || 'Start'} - {edu.endDate || 'Present'}
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <div className="resume-p-4 resume-space-y-4 bg-resume-panel-bg rounded-b-md">
                  <div className="resume-space-y-2">
                    <Label htmlFor={`edu-degree-${edu.id}`} className="text-resume-text-secondary">Degree / Certification</Label>
                    <Input
                      id={`edu-degree-${edu.id}`}
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                      placeholder="e.g., Bachelor of Science in Computer Science"
                      className="cosmic-input"
                    />
                  </div>

                  <div className="resume-space-y-2">
                    <Label htmlFor={`edu-institution-${edu.id}`} className="text-resume-text-secondary">Institution</Label>
                    <Input
                      id={`edu-institution-${edu.id}`}
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)}
                      placeholder="e.g., University of California, Berkeley"
                      className="cosmic-input"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 resume-gap-4">
                    <div className="resume-space-y-2">
                      <Label htmlFor={`edu-start-${edu.id}`} className="text-resume-text-secondary">Start Date</Label>
                      <Input
                        id={`edu-start-${edu.id}`}
                        value={edu.startDate}
                        onChange={(e) => handleEducationChange(edu.id, 'startDate', e.target.value)}
                        placeholder="e.g., 2016 or 2016-09"
                        className="cosmic-input"
                      />
                    </div>

                    <div className="resume-space-y-2">
                      <Label htmlFor={`edu-end-${edu.id}`} className="text-resume-text-secondary">End Date (or Expected)</Label>
                      <Input
                        id={`edu-end-${edu.id}`}
                        value={edu.endDate}
                        onChange={(e) => handleEducationChange(edu.id, 'endDate', e.target.value)}
                        placeholder="e.g., 2020 or Present"
                        className="cosmic-input"
                      />
                    </div>
                  </div>

                  <div className="resume-space-y-2">
                    <Label htmlFor={`edu-description-${edu.id}`} className="text-resume-text-secondary">Description (Optional)</Label>
                    <Textarea
                      id={`edu-description-${edu.id}`}
                      value={edu.description}
                      onChange={(e) => handleEducationChange(edu.id, 'description', e.target.value)}
                      placeholder="Include relevant coursework, achievements, GPA if notable, extracurricular activities..."
                      rows={4}
                      className="cosmic-input"
                    />
                  </div>

                  <div className="flex justify-end resume-pt-2 resume-pb-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 border border-resume-panel-border"
                      onClick={() => handleRemoveEducation(edu.id)}
                    >
                      <Trash className="h-4 w-4 resume-mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}

/* ============================= SKILLS SECTION ============================= */

interface SkillsSectionProps {
  skills: SkillItem[];
  resumeId?: string;
  onUpdate: (skills: SkillItem[]) => void;
  onAdd?: () => string; // Returns the new ID
}

export function SkillsSection({
  skills,
  resumeId,
  onUpdate,
  onAdd
}: SkillsSectionProps) {
  const [skillInput, setSkillInput] = useState('');
  const [editingSkill, setEditingSkill] = useState<string | null>(null);

  // Handle adding a new skill
  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    
    // Check if skill already exists
    if (skills.some(s => s.name.toLowerCase() === skillInput.trim().toLowerCase())) {
      return; // Skip if duplicate
    }

    const newSkill: SkillItem = {
      id: crypto.randomUUID(),
      name: skillInput.trim(),
      proficiency: 3, // Default to medium proficiency
    };
    
    onUpdate([...skills, newSkill]);
    setSkillInput('');
  };

  // Handle removing a skill
  const handleRemoveSkill = (id: string) => {
    const updatedSkills = skills.filter(skill => skill.id !== id);
    onUpdate(updatedSkills);
    
    if (editingSkill === id) {
      setEditingSkill(null);
    }
  };

  // Handle updating a skill
  const handleSkillChange = (id: string, field: keyof SkillItem, value: any) => {
    const updatedSkills = skills.map(skill => {
      if (skill.id === id) {
        return { ...skill, [field]: value };
      }
      return skill;
    });
    onUpdate(updatedSkills);
  };

  // Handle key press in skill input (add on Enter)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="resume-space-y-4">
      <SectionHeader 
        title="Skills" 
        icon={<Wrench className="h-5 w-5" />}
      />

      <SectionCard>
        <div className="resume-space-y-4">
          <div className="resume-space-y-2">
            <Label htmlFor="skill-input" className="text-resume-text-secondary">Add a Skill</Label>
            <div className="flex resume-gap-2">
              <Input
                id="skill-input"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="e.g., JavaScript, Project Management, Data Analysis"
                className="cosmic-input"
              />
              <Button 
                type="button" 
                size="sm"
                onClick={handleAddSkill}
                className="bg-primary/20 text-resume-text-accent hover:bg-primary/30 hover:text-resume-text-primary"
              >
                Add
              </Button>
            </div>
            <p className="resume-mt-1 text-xs text-resume-text-muted">
              Press Enter after typing a skill to add it, or click the Add button
            </p>
          </div>

          {skills.length > 0 ? (
            <div>
              <Label className="text-resume-text-secondary resume-mb-2 block">Your Skills</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 resume-gap-3">
                {skills.map((skill) => (
                  <div 
                    key={skill.id} 
                    className="flex items-center justify-between bg-resume-panel-bg border border-resume-panel-border p-2 rounded-md"
                  >
                    <div className="flex items-center resume-gap-2">
                      <Star className="h-4 w-4 text-resume-text-accent" />
                      <span className="text-resume-text-primary">{skill.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSkill(skill.id)}
                      className="h-6 w-6 p-0 text-resume-text-muted hover:text-destructive hover:bg-destructive/10 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="resume-mt-4 bg-primary/5 p-3 rounded-md border border-resume-panel-border">
                <p className="text-xs text-resume-text-secondary">
                  <span className="text-resume-text-accent font-medium">Tip:</span> Group similar skills together and list the most relevant skills for your target job first.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center resume-p-6 bg-resume-panel-bg rounded-md border border-resume-panel-border">
              <Wrench className="h-10 w-10 resume-mb-2 text-resume-text-accent opacity-30" />
              <p className="text-center text-sm resume-mb-2 text-resume-text-secondary">
                Add skills that are relevant to your target job
              </p>
              <p className="text-center text-xs text-resume-text-muted">
                Include technical skills, soft skills, and industry-specific expertise
              </p>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}

/* ============================= PROJECTS SECTION ============================= */

interface ProjectsSectionProps {
  projects: ProjectItem[];
  resumeId?: string;
  onUpdate: (projects: ProjectItem[]) => void;
  onAdd?: () => string; // Returns the new ID
}

export function ProjectsSection({ 
  projects,
  resumeId,
  onUpdate,
  onAdd
}: ProjectsSectionProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [techInput, setTechInput] = useState<string>('');
  const [activeTechProjectId, setActiveTechProjectId] = useState<string | null>(null);

  // Handle adding a new project
  const handleAddProject = () => {
    if (onAdd) {
      const newId = onAdd();
      setExpandedItem(newId);
    } else {
      // Fallback if onAdd not provided
      const newProject = {
        id: crypto.randomUUID(),
        title: '',
        description: '',
        technologies: [],
        link: ''
      };
      onUpdate([...projects, newProject]);
      setExpandedItem(newProject.id);
    }
  };

  // Handle removing a project
  const handleRemoveProject = (id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    onUpdate(updatedProjects);
    if (expandedItem === id) {
      setExpandedItem(null);
    }
  };

  // Handle updating a field in a project
  const handleProjectChange = (id: string, field: keyof ProjectItem, value: any) => {
    const updatedProjects = projects.map(project => {
      if (project.id === id) {
        return { ...project, [field]: value };
      }
      return project;
    });
    onUpdate(updatedProjects);
  };

  // Handle adding a technology to a project
  const handleAddTechnology = (projectId: string) => {
    if (!techInput.trim()) return;
    
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        // Check if tech already exists to avoid duplicates
        if (!project.technologies.includes(techInput.trim())) {
          return {
            ...project,
            technologies: [...project.technologies, techInput.trim()]
          };
        }
      }
      return project;
    });
    
    onUpdate(updatedProjects);
    setTechInput('');
  };

  // Handle removing a technology from a project
  const handleRemoveTechnology = (projectId: string, tech: string) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          technologies: project.technologies.filter(t => t !== tech)
        };
      }
      return project;
    });
    
    onUpdate(updatedProjects);
  };

  // Handle key press in technology input (add on Enter)
  const handleTechKeyPress = (e: React.KeyboardEvent, projectId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTechnology(projectId);
    }
  };

  return (
    <div className="resume-space-y-4">
      <SectionHeader 
        title="Projects" 
        icon={<FolderGit2 className="h-5 w-5" />}
        onAdd={handleAddProject}
        addButtonText="Add Project"
      />

      {projects.length === 0 ? (
        <div className="cosmic-panel resume-p-6 flex flex-col items-center justify-center">
          <FolderGit2 className="h-12 w-12 resume-mb-2 text-resume-text-accent opacity-30" />
          <p className="text-center text-sm resume-mb-4 text-resume-text-secondary">
            Add your notable projects to showcase your practical skills and achievements
          </p>
          <CosmicButton 
            variant="outline" 
            size="sm" 
            onClick={handleAddProject}
            withGlow
          >
            Add Project
          </CosmicButton>
        </div>
      ) : (
        <Accordion
          type="single"
          collapsible
          value={expandedItem || undefined}
          onValueChange={(value) => setExpandedItem(value)}
          className="resume-space-y-2"
        >
          {projects.map((project) => (
            <AccordionItem
              key={project.id}
              value={project.id}
              className={cn(
                "cosmic-panel overflow-hidden",
                expandedItem === project.id ? "ring-1 ring-resume-panel-border" : ""
              )}
            >
              <AccordionTrigger className="resume-p-4 hover:bg-primary/10 data-[state=open]:bg-primary/20">
                <div className="flex flex-1 justify-between items-center">
                  <div className="text-left">
                    <p className="font-medium text-resume-text-primary">
                      {project.title || "New Project"}
                    </p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap resume-gap-1 resume-mt-1 max-w-xs">
                        {project.technologies.slice(0, 3).map((tech, index) => (
                          <Badge key={index} variant="secondary" className="text-xs px-1.5 py-0 bg-primary/20 text-resume-text-accent">
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 3 && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0 text-resume-text-muted border-resume-panel-border">
                            +{project.technologies.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  {project.link && (
                    <div className="resume-mr-4 text-resume-text-accent">
                      <LinkIcon className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <div className="resume-p-4 resume-space-y-4 bg-resume-panel-bg rounded-b-md">
                  <div className="resume-space-y-2">
                    <Label htmlFor={`project-title-${project.id}`} className="text-resume-text-secondary">Project Title</Label>
                    <Input
                      id={`project-title-${project.id}`}
                      value={project.title}
                      onChange={(e) => handleProjectChange(project.id, 'title', e.target.value)}
                      placeholder="e.g., E-commerce Website, Mobile App, Research Paper"
                      className="cosmic-input"
                    />
                  </div>

                  <div className="resume-space-y-2">
                    <Label htmlFor={`project-description-${project.id}`} className="text-resume-text-secondary">Description</Label>
                    <Textarea
                      id={`project-description-${project.id}`}
                      value={project.description}
                      onChange={(e) => handleProjectChange(project.id, 'description', e.target.value)}
                      placeholder="Describe the project, your role, and key achievements"
                      rows={3}
                      className="cosmic-input"
                    />
                  </div>

                  <div className="resume-space-y-2">
                    <Label htmlFor={`project-link-${project.id}`} className="text-resume-text-secondary">Project Link (Optional)</Label>
                    <Input
                      id={`project-link-${project.id}`}
                      value={project.link || ''}
                      onChange={(e) => handleProjectChange(project.id, 'link', e.target.value)}
                      placeholder="e.g., https://github.com/yourusername/project"
                      className="cosmic-input"
                    />
                  </div>

                  <div className="resume-space-y-2">
                    <Label htmlFor={`project-tech-${project.id}`} className="text-resume-text-secondary">Technologies Used</Label>
                    <div className="flex flex-wrap resume-gap-2 resume-mb-2">
                      {project.technologies.map((tech, index) => (
                        <Badge 
                          key={index} 
                          className="flex items-center resume-gap-1 px-2 py-1 bg-primary/20 text-resume-text-accent"
                        >
                          {tech}
                          <X
                            className="h-3 w-3 cursor-pointer ml-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveTechnology(project.id, tech);
                            }}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex resume-gap-2">
                      <Input
                        id={`project-tech-${project.id}`}
                        value={activeTechProjectId === project.id ? techInput : ''}
                        onChange={(e) => setTechInput(e.target.value)}
                        onFocus={() => setActiveTechProjectId(project.id)}
                        onKeyDown={(e) => handleTechKeyPress(e, project.id)}
                        placeholder="e.g., React, TypeScript, Node.js"
                        className="cosmic-input"
                      />
                      <Button 
                        type="button" 
                        size="sm"
                        onClick={() => handleAddTechnology(project.id)}
                        className="bg-primary/20 text-resume-text-accent hover:bg-primary/30 hover:text-resume-text-primary"
                      >
                        Add
                      </Button>
                    </div>
                    <p className="text-xs text-resume-text-muted resume-mt-1">
                      Press Enter after each technology to add it, or click the Add button
                    </p>
                  </div>

                  <div className="flex justify-end resume-pt-2 resume-pb-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 border border-resume-panel-border"
                      onClick={() => handleRemoveProject(project.id)}
                    >
                      <Trash className="h-4 w-4 resume-mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}