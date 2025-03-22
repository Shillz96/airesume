import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  Pencil,
  Trash2,
  Plus,
  CheckCircle,
  XCircle,
  GripVertical,
  Calculator,
} from "lucide-react";
import RichTextEditor from "@/components/rich-text-editor";

// Shared Components
export const SectionHeader = ({
  title,
  subtitle,
  actions,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}) => (
  <div className="cosmic-section-header flex justify-between items-center mb-space-4 text-white">
    <div>
      <h3 className="text-lg font-medium text-white flex items-center">
        {title}
      </h3>
      {subtitle && <p className="text-sm text-blue-300 mt-1">{subtitle}</p>}
    </div>
    {actions && <div className="flex space-x-2">{actions}</div>}
  </div>
);

export const ItemActions = ({
  onEdit,
  onDelete,
  isEditing = false,
  onCancel,
  onSave,
}: {
  onEdit?: () => void;
  onDelete?: () => void;
  isEditing?: boolean;
  onCancel?: () => void;
  onSave?: () => void;
}) => (
  <div className="flex items-center space-x-1">
    {isEditing ? (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-green-500/10"
          onClick={onSave}
        >
          <CheckCircle className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
          onClick={onCancel}
        >
          <XCircle className="h-4 w-4" />
        </Button>
      </>
    ) : (
      <>
        {onEdit && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </>
    )}
  </div>
);

export const ResumePanel = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "cosmic-resume-panel p-space-5 rounded-lg bg-gray-900/50 border border-blue-500/30 mb-space-4",
      className
    )}
  >
    {children}
  </div>
);

// Personal Info Section
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  headline: string;
  summary: string;
}

export function PersonalInfoSection({
  personalInfo,
  onUpdate,
}: {
  personalInfo: PersonalInfo;
  onUpdate: (info: PersonalInfo) => void;
}) {
  const [info, setInfo] = useState<PersonalInfo>(personalInfo);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
    onUpdate({
      ...personalInfo,
      [name]: value,
    });
  };

  const handleSummaryChange = (value: string) => {
    setInfo((prev) => ({
      ...prev,
      summary: value,
    }));
    onUpdate({
      ...personalInfo,
      summary: value,
    });
  };

  return (
    <div className="space-y-space-5">
      <ResumePanel>
        <SectionHeader title="Contact Information" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-3">
          <div>
            <label className="text-sm text-blue-300 block mb-1">
              First Name
            </label>
            <Input
              name="firstName"
              value={info.firstName}
              onChange={handleChange}
              className="cosmic-input bg-black/30 border-blue-500/30 text-white"
              placeholder="First Name"
            />
          </div>
          <div>
            <label className="text-sm text-blue-300 block mb-1">Last Name</label>
            <Input
              name="lastName"
              value={info.lastName}
              onChange={handleChange}
              className="cosmic-input bg-black/30 border-blue-500/30 text-white"
              placeholder="Last Name"
            />
          </div>
          <div>
            <label className="text-sm text-blue-300 block mb-1">Email</label>
            <Input
              name="email"
              value={info.email}
              onChange={handleChange}
              className="cosmic-input bg-black/30 border-blue-500/30 text-white"
              placeholder="Email Address"
              type="email"
            />
          </div>
          <div>
            <label className="text-sm text-blue-300 block mb-1">Phone</label>
            <Input
              name="phone"
              value={info.phone}
              onChange={handleChange}
              className="cosmic-input bg-black/30 border-blue-500/30 text-white"
              placeholder="Phone Number"
            />
          </div>
        </div>
      </ResumePanel>

      <ResumePanel>
        <SectionHeader title="Professional Headline" />
        <Input
          name="headline"
          value={info.headline}
          onChange={handleChange}
          className="cosmic-input bg-black/30 border-blue-500/30 text-white"
          placeholder="e.g. Senior Software Engineer | React & Node.js Expert"
        />
      </ResumePanel>

      <ResumePanel>
        <SectionHeader title="Professional Summary" />
        <RichTextEditor
          value={info.summary}
          onChange={handleSummaryChange}
          className="cosmic-textarea bg-black/30 border-blue-500/30 text-white min-h-20 p-3"
          placeholder="Write a professional summary that highlights your key strengths and experience..."
          rows={6}
        />
      </ResumePanel>
    </div>
  );
}

// Experience Section
export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

export function ExperienceSection({
  experience,
  onUpdate,
}: {
  experience: ExperienceItem[];
  onUpdate: (experience: ExperienceItem[]) => void;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<ExperienceItem | null>(null);

  const handleEdit = (item: ExperienceItem) => {
    setEditing(item.id);
    setCurrentItem({ ...item });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!currentItem) return;

    const { name, value } = e.target;
    setCurrentItem({
      ...currentItem,
      [name]: value,
    });
  };

  const handleDescriptionChange = (value: string) => {
    if (!currentItem) return;
    setCurrentItem({
      ...currentItem,
      description: value,
    });
  };

  const handleSave = () => {
    if (!currentItem) return;

    const updated = experience.map((item) =>
      item.id === currentItem.id ? currentItem : item
    );
    onUpdate(updated);
    setEditing(null);
    setCurrentItem(null);
  };

  const handleCancel = () => {
    setEditing(null);
    setCurrentItem(null);
  };

  const handleDelete = (id: string) => {
    onUpdate(experience.filter((item) => item.id !== id));
  };

  const handleAdd = () => {
    const newItem: ExperienceItem = {
      id: `exp-${Date.now()}`,
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    onUpdate([...experience, newItem]);
    handleEdit(newItem);
  };

  return (
    <div className="space-y-space-4">
      {experience.map((item) => (
        <ResumePanel key={item.id}>
          {editing === item.id ? (
            // Edit Mode
            <div className="space-y-space-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">Edit Experience</h3>
                <ItemActions
                  isEditing={true}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-3">
                <div>
                  <label className="text-sm text-blue-300 block mb-1">Job Title</label>
                  <Input
                    name="title"
                    value={currentItem?.title || ""}
                    onChange={handleChange}
                    className="cosmic-input bg-black/30 border-blue-500/30 text-white"
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>
                <div>
                  <label className="text-sm text-blue-300 block mb-1">Company</label>
                  <Input
                    name="company"
                    value={currentItem?.company || ""}
                    onChange={handleChange}
                    className="cosmic-input bg-black/30 border-blue-500/30 text-white"
                    placeholder="e.g. Acme Inc."
                  />
                </div>
                <div>
                  <label className="text-sm text-blue-300 block mb-1">Start Date</label>
                  <Input
                    name="startDate"
                    value={currentItem?.startDate || ""}
                    onChange={handleChange}
                    className="cosmic-input bg-black/30 border-blue-500/30 text-white"
                    placeholder="e.g. Jan 2020"
                  />
                </div>
                <div>
                  <label className="text-sm text-blue-300 block mb-1">End Date</label>
                  <Input
                    name="endDate"
                    value={currentItem?.endDate || ""}
                    onChange={handleChange}
                    className="cosmic-input bg-black/30 border-blue-500/30 text-white"
                    placeholder="e.g. Present"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-blue-300 block mb-1">Description</label>
                <RichTextEditor
                  value={currentItem?.description || ""}
                  onChange={handleDescriptionChange}
                  className="cosmic-textarea bg-black/30 border-blue-500/30 text-white min-h-20 p-3"
                  placeholder="Describe your responsibilities and achievements..."
                  rows={6}
                />
              </div>
            </div>
          ) : (
            // View Mode
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-white">{item.title || "Job Title"}</h3>
                  <p className="text-sm text-blue-300 mt-1">
                    {item.company || "Company"}
                    {item.company && (item.startDate || item.endDate) && " • "}
                    {item.startDate && (
                      <span>
                        {item.startDate} - {item.endDate || "Present"}
                      </span>
                    )}
                  </p>
                </div>
                <ItemActions
                  onEdit={() => handleEdit(item)}
                  onDelete={() => handleDelete(item.id)}
                />
              </div>

              <div 
                className="mt-3 text-sm text-gray-300 space-y-2 rich-text-content"
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            </div>
          )}
        </ResumePanel>
      ))}

      <Button
        variant="outline"
        className="w-full mt-2 border-blue-500/30 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
        onClick={handleAdd}
      >
        <Plus className="h-4 w-4 mr-2" /> Add Experience
      </Button>
    </div>
  );
}

// Education Section
export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  description: string;
}

export function EducationSection({
  education,
  onUpdate,
}: {
  education: EducationItem[];
  onUpdate: (education: EducationItem[]) => void;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<EducationItem | null>(null);

  const handleEdit = (item: EducationItem) => {
    setEditing(item.id);
    setCurrentItem({ ...item });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!currentItem) return;

    const { name, value } = e.target;
    setCurrentItem({
      ...currentItem,
      [name]: value,
    });
  };

  const handleDescriptionChange = (value: string) => {
    if (!currentItem) return;
    setCurrentItem({
      ...currentItem,
      description: value,
    });
  };

  const handleSave = () => {
    if (!currentItem) return;

    const updated = education.map((item) =>
      item.id === currentItem.id ? currentItem : item
    );
    onUpdate(updated);
    setEditing(null);
    setCurrentItem(null);
  };

  const handleCancel = () => {
    setEditing(null);
    setCurrentItem(null);
  };

  const handleDelete = (id: string) => {
    onUpdate(education.filter((item) => item.id !== id));
  };

  const handleAdd = () => {
    const newItem: EducationItem = {
      id: `edu-${Date.now()}`,
      degree: "",
      institution: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    onUpdate([...education, newItem]);
    handleEdit(newItem);
  };

  return (
    <div className="space-y-space-4">
      {education.map((item) => (
        <ResumePanel key={item.id}>
          {editing === item.id ? (
            // Edit Mode
            <div className="space-y-space-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">Edit Education</h3>
                <ItemActions
                  isEditing={true}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-3">
                <div>
                  <label className="text-sm text-blue-300 block mb-1">Degree</label>
                  <Input
                    name="degree"
                    value={currentItem?.degree || ""}
                    onChange={handleChange}
                    className="cosmic-input bg-black/30 border-blue-500/30 text-white"
                    placeholder="e.g. B.S. Computer Science"
                  />
                </div>
                <div>
                  <label className="text-sm text-blue-300 block mb-1">Institution</label>
                  <Input
                    name="institution"
                    value={currentItem?.institution || ""}
                    onChange={handleChange}
                    className="cosmic-input bg-black/30 border-blue-500/30 text-white"
                    placeholder="e.g. University of California"
                  />
                </div>
                <div>
                  <label className="text-sm text-blue-300 block mb-1">Start Date</label>
                  <Input
                    name="startDate"
                    value={currentItem?.startDate || ""}
                    onChange={handleChange}
                    className="cosmic-input bg-black/30 border-blue-500/30 text-white"
                    placeholder="e.g. 2016"
                  />
                </div>
                <div>
                  <label className="text-sm text-blue-300 block mb-1">End Date</label>
                  <Input
                    name="endDate"
                    value={currentItem?.endDate || ""}
                    onChange={handleChange}
                    className="cosmic-input bg-black/30 border-blue-500/30 text-white"
                    placeholder="e.g. 2020"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-blue-300 block mb-1">Description</label>
                <RichTextEditor
                  value={currentItem?.description || ""}
                  onChange={handleDescriptionChange}
                  className="cosmic-textarea bg-black/30 border-blue-500/30 text-white min-h-20 p-3"
                  placeholder="List relevant coursework, achievements, activities..."
                  rows={4}
                />
              </div>
            </div>
          ) : (
            // View Mode
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-white">{item.degree || "Degree"}</h3>
                  <p className="text-sm text-blue-300 mt-1">
                    {item.institution || "Institution"}
                    {item.institution && (item.startDate || item.endDate) && " • "}
                    {item.startDate && (
                      <span>
                        {item.startDate} - {item.endDate || "Present"}
                      </span>
                    )}
                  </p>
                </div>
                <ItemActions
                  onEdit={() => handleEdit(item)}
                  onDelete={() => handleDelete(item.id)}
                />
              </div>

              <div 
                className="mt-3 text-sm text-gray-300 space-y-2 rich-text-content"
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            </div>
          )}
        </ResumePanel>
      ))}

      <Button
        variant="outline"
        className="w-full mt-2 border-blue-500/30 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
        onClick={handleAdd}
      >
        <Plus className="h-4 w-4 mr-2" /> Add Education
      </Button>
    </div>
  );
}

// Skills Section
export interface SkillItem {
  id: string;
  name: string;
  proficiency: number;
  category?: string;
}

export function SkillsSection({
  skills,
  onUpdate,
}: {
  skills: SkillItem[];
  onUpdate: (skills: SkillItem[]) => void;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<SkillItem | null>(null);

  const handleEdit = (item: SkillItem) => {
    setEditing(item.id);
    setCurrentItem({ ...item });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!currentItem) return;

    const { name, value } = e.target;
    setCurrentItem({
      ...currentItem,
      [name]: value,
    });
  };

  const handleProficiencyChange = (value: number[]) => {
    if (!currentItem) return;
    setCurrentItem({
      ...currentItem,
      proficiency: value[0],
    });
  };

  const handleSave = () => {
    if (!currentItem) return;

    const updated = skills.map((item) =>
      item.id === currentItem.id ? currentItem : item
    );
    onUpdate(updated);
    setEditing(null);
    setCurrentItem(null);
  };

  const handleCancel = () => {
    setEditing(null);
    setCurrentItem(null);
  };

  const handleDelete = (id: string) => {
    onUpdate(skills.filter((item) => item.id !== id));
  };

  const handleAdd = () => {
    const newItem: SkillItem = {
      id: `skill-${Date.now()}`,
      name: "",
      proficiency: 3,
    };
    onUpdate([...skills, newItem]);
    handleEdit(newItem);
  };

  const getProficiencyLabel = (proficiency: number) => {
    switch (proficiency) {
      case 1:
        return "Beginner";
      case 2:
        return "Intermediate";
      case 3:
        return "Advanced";
      case 4:
        return "Expert";
      case 5:
        return "Master";
      default:
        return "Advanced";
    }
  };

  const getProficiencyColor = (proficiency: number) => {
    switch (proficiency) {
      case 1:
        return "bg-blue-900/50";
      case 2:
        return "bg-blue-800/50";
      case 3:
        return "bg-blue-700/50";
      case 4:
        return "bg-blue-600/50";
      case 5:
        return "bg-blue-500/50";
      default:
        return "bg-blue-700/50";
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {skills.map((item) => (
          <ResumePanel
            key={item.id}
            className={`${
              editing === item.id ? "col-span-full" : ""
            } transition-all duration-300`}
          >
            {editing === item.id ? (
              // Edit Mode
              <div className="space-y-space-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-white">Edit Skill</h3>
                  <ItemActions
                    isEditing={true}
                    onSave={handleSave}
                    onCancel={handleCancel}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-3">
                  <div>
                    <label className="text-sm text-blue-300 block mb-1">Skill Name</label>
                    <Input
                      name="name"
                      value={currentItem?.name || ""}
                      onChange={handleChange}
                      className="cosmic-input bg-black/30 border-blue-500/30 text-white"
                      placeholder="e.g. React.js"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-blue-300 block mb-1">Category (Optional)</label>
                    <Input
                      name="category"
                      value={currentItem?.category || ""}
                      onChange={handleChange}
                      className="cosmic-input bg-black/30 border-blue-500/30 text-white"
                      placeholder="e.g. Programming Languages"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm text-blue-300">Proficiency</label>
                    <span className="text-xs text-gray-400">
                      {getProficiencyLabel(currentItem?.proficiency || 3)}
                    </span>
                  </div>
                  <Slider
                    value={[currentItem?.proficiency || 3]}
                    min={1}
                    max={5}
                    step={1}
                    onValueChange={handleProficiencyChange}
                    className="py-space-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Beginner</span>
                    <span>Master</span>
                  </div>
                </div>
              </div>
            ) : (
              // View Mode
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-md font-medium text-white">{item.name || "Skill Name"}</h3>
                    {item.category && (
                      <p className="text-xs text-blue-400 mt-0.5">{item.category}</p>
                    )}
                  </div>
                  <ItemActions
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item.id)}
                  />
                </div>

                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-400">
                      {getProficiencyLabel(item.proficiency)}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getProficiencyColor(item.proficiency)} rounded-full`}
                      style={{ width: `${(item.proficiency / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </ResumePanel>
        ))}
      </div>

      <Button
        variant="outline"
        className="w-full mt-space-4 border-blue-500/30 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
        onClick={handleAdd}
      >
        <Plus className="h-4 w-4 mr-2" /> Add Skill
      </Button>
    </div>
  );
}

// Projects Section
export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
}

export function ProjectsSection({
  projects,
  onUpdate,
}: {
  projects: ProjectItem[];
  onUpdate: (projects: ProjectItem[]) => void;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<ProjectItem | null>(null);

  const handleEdit = (item: ProjectItem) => {
    setEditing(item.id);
    setCurrentItem({ ...item });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!currentItem) return;

    const { name, value } = e.target;
    setCurrentItem({
      ...currentItem,
      [name]: value,
    });
  };

  const handleDescriptionChange = (value: string) => {
    if (!currentItem) return;
    setCurrentItem({
      ...currentItem,
      description: value,
    });
  };

  const handleTechnologiesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!currentItem) return;
    const techArray = e.target.value
      .split(",")
      .map((tech) => tech.trim())
      .filter((tech) => tech);
    setCurrentItem({
      ...currentItem,
      technologies: techArray,
    });
  };

  const handleSave = () => {
    if (!currentItem) return;

    const updated = projects.map((item) =>
      item.id === currentItem.id ? currentItem : item
    );
    onUpdate(updated);
    setEditing(null);
    setCurrentItem(null);
  };

  const handleCancel = () => {
    setEditing(null);
    setCurrentItem(null);
  };

  const handleDelete = (id: string) => {
    onUpdate(projects.filter((item) => item.id !== id));
  };

  const handleAdd = () => {
    const newItem: ProjectItem = {
      id: `project-${Date.now()}`,
      title: "",
      description: "",
      technologies: [],
    };
    onUpdate([...projects, newItem]);
    handleEdit(newItem);
  };

  return (
    <div className="space-y-space-4">
      {projects.map((item) => (
        <ResumePanel key={item.id}>
          {editing === item.id ? (
            // Edit Mode
            <div className="space-y-space-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">Edit Project</h3>
                <ItemActions
                  isEditing={true}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-3">
                <div className="md:col-span-2">
                  <label className="text-sm text-blue-300 block mb-1">Project Title</label>
                  <Input
                    name="title"
                    value={currentItem?.title || ""}
                    onChange={handleChange}
                    className="cosmic-input bg-black/30 border-blue-500/30 text-white"
                    placeholder="e.g. E-commerce Platform"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-blue-300 block mb-1">Project Link (Optional)</label>
                  <Input
                    name="link"
                    value={currentItem?.link || ""}
                    onChange={handleChange}
                    className="cosmic-input bg-black/30 border-blue-500/30 text-white"
                    placeholder="e.g. https://github.com/username/project"
                    type="url"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-blue-300 block mb-1">Technologies Used</label>
                <Input
                  value={currentItem?.technologies?.join(", ") || ""}
                  onChange={handleTechnologiesChange}
                  className="cosmic-input bg-black/30 border-blue-500/30 text-white"
                  placeholder="e.g. React, Node.js, MongoDB (comma separated)"
                />
              </div>

              <div>
                <label className="text-sm text-blue-300 block mb-1">Description</label>
                <RichTextEditor
                  value={currentItem?.description || ""}
                  onChange={handleDescriptionChange}
                  className="cosmic-textarea bg-black/30 border-blue-500/30 text-white min-h-20 p-3"
                  placeholder="Describe your project, your role, and achievements..."
                  rows={6}
                />
              </div>
            </div>
          ) : (
            // View Mode
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-white flex items-center">
                    {item.title || "Project Title"}
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-400 hover:text-blue-300"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    )}
                  </h3>
                  {item.technologies && item.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {item.technologies.map((tech, index) => (
                        <Badge
                          key={index}
                          className="bg-blue-900/60 text-blue-200 border-blue-700/50 text-xs"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <ItemActions
                  onEdit={() => handleEdit(item)}
                  onDelete={() => handleDelete(item.id)}
                />
              </div>

              <div 
                className="mt-3 text-sm text-gray-300 space-y-2 rich-text-content"
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            </div>
          )}
        </ResumePanel>
      ))}

      <Button
        variant="outline"
        className="w-full mt-2 border-blue-500/30 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
        onClick={handleAdd}
      >
        <Plus className="h-4 w-4 mr-2" /> Add Project
      </Button>
    </div>
  );
}