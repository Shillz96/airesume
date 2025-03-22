import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus, CheckCircle, XCircle, User, Mail, Phone, BriefcaseIcon, GraduationCap, Code, FolderKanban } from "lucide-react";

// Define all interfaces
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

// Shared Components
const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center mb-6">
    <div className="mr-2 text-blue-400">
      {icon}
    </div>
    <h2 className="text-lg font-medium text-white">{title}</h2>
  </div>
);

const SectionPanel = ({ children, className = "" }) => (
  <div className={`bg-gray-900/50 rounded-lg border border-blue-500/30 p-4 mb-5 text-white ${className}`}>
    {children}
  </div>
);

const TipPanel = ({ title, tips }) => (
  <div className="bg-gray-900/50 rounded-lg border border-blue-500/30 p-4 mt-4 text-sm text-gray-300">
    <p className="mb-2 text-blue-300 font-medium">{title}</p>
    <ul className="list-disc pl-4 space-y-1">
      {tips.map((tip, index) => (
        <li key={index}>{tip}</li>
      ))}
    </ul>
  </div>
);

const ActionButtons = ({ onEdit, onDelete }) => (
  <div className="flex space-x-1">
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
      onClick={onEdit}
    >
      <Pencil className="h-4 w-4" />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
      onClick={onDelete}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
);

// Form input with proper cosmic styling
const InputField = ({ label, value, onChange, className = "", placeholder = "" }) => (
  <div className={className}>
    <label className="block text-sm text-blue-300 mb-1">{label}</label>
    <div className="bg-black/30 border border-blue-500/30 rounded-md p-2.5 text-white">
      {value || placeholder}
    </div>
  </div>
);

// Form field with edit mode
const EditableField = ({ label, value, isEditing, onChange, className = "", placeholder = "" }) => (
  <div className={className}>
    <label className="block text-sm text-blue-300 mb-1">{label}</label>
    {isEditing ? (
      <input 
        type="text" 
        value={value} 
        onChange={onChange} 
        className="w-full bg-black/30 border border-blue-500/30 rounded-md p-2.5 text-white"
        placeholder={placeholder}
      />
    ) : (
      <div className="bg-black/30 border border-blue-500/30 rounded-md p-2.5 text-white">
        {value || placeholder}
      </div>
    )}
  </div>
);

// Contact Information Section
export const ContactSection = ({ personalInfo, onUpdate }) => {
  return (
    <div className="mb-8">
      <SectionHeader icon={<User className="h-5 w-5" />} title="Contact Information" />
      <SectionPanel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField 
            label="First Name" 
            value={personalInfo.firstName} 
            placeholder="First name" 
          />
          <InputField 
            label="Last Name" 
            value={personalInfo.lastName} 
            placeholder="Last name" 
          />
          <InputField 
            label="Email" 
            value={personalInfo.email} 
            placeholder="Email address" 
          />
          <InputField 
            label="Phone" 
            value={personalInfo.phone} 
            placeholder="Phone number" 
          />
        </div>
      </SectionPanel>
      
      <SectionHeader icon={<BriefcaseIcon className="h-5 w-5" />} title="Professional Headline" />
      <SectionPanel>
        <InputField 
          label="Headline" 
          value={personalInfo.headline} 
          placeholder="e.g. Senior Software Engineer | React & Node.js Expert" 
        />
      </SectionPanel>
      
      <SectionHeader icon={<Mail className="h-5 w-5" />} title="Professional Summary" />
      <SectionPanel>
        <InputField 
          label="Summary" 
          value={personalInfo.summary} 
          placeholder="Write a professional summary that highlights your key strengths and experience..." 
        />
        <TipPanel 
          title="Tips for a great summary:" 
          tips={[
            "Keep it concise (3-5 sentences)",
            "Highlight your most relevant experience",
            "Focus on achievements rather than responsibilities",
            "Include keywords relevant to your target position"
          ]} 
        />
      </SectionPanel>
    </div>
  );
};

// Experience Section
export const ExperienceSection = ({ experiences, onUpdate }) => {
  return (
    <div className="mb-8">
      <SectionHeader icon={<BriefcaseIcon className="h-5 w-5" />} title="Experience" />
      
      {experiences.map((exp) => (
        <SectionPanel key={exp.id}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-white text-lg font-medium">{exp.title || "Job Title"}</h3>
              <p className="text-blue-300 text-sm mt-1">
                {exp.company || "Company"} • {exp.startDate || "Start Date"} - {exp.endDate || "Present"}
              </p>
            </div>
            <ActionButtons 
              onEdit={() => {/* Handle edit */}} 
              onDelete={() => {/* Handle delete */}} 
            />
          </div>
          <div className="mt-3 text-sm text-gray-300">
            {exp.description || "Job description goes here..."}
          </div>
        </SectionPanel>
      ))}
      
      <Button 
        variant="outline" 
        className="w-full border-blue-500/30 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
        onClick={() => {/* Handle add */}}
      >
        <Plus className="h-4 w-4 mr-2" /> Add Experience
      </Button>
    </div>
  );
};

// Education Section
export const EducationSection = ({ education, onUpdate }) => {
  return (
    <div className="mb-8">
      <SectionHeader icon={<GraduationCap className="h-5 w-5" />} title="Education" />
      
      {education.map((edu) => (
        <SectionPanel key={edu.id}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-white text-lg font-medium">{edu.degree || "Degree"}</h3>
              <p className="text-blue-300 text-sm mt-1">
                {edu.institution || "Institution"} • {edu.startDate || "Start Date"} - {edu.endDate || "End Date"}
              </p>
            </div>
            <ActionButtons 
              onEdit={() => {/* Handle edit */}} 
              onDelete={() => {/* Handle delete */}} 
            />
          </div>
          <div className="mt-3 text-sm text-gray-300">
            {edu.description || "Education description goes here..."}
          </div>
        </SectionPanel>
      ))}
      
      <Button 
        variant="outline" 
        className="w-full border-blue-500/30 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
        onClick={() => {/* Handle add */}}
      >
        <Plus className="h-4 w-4 mr-2" /> Add Education
      </Button>
      
      <TipPanel 
        title="Tips for education section:" 
        tips={[
          "List your most recent education first",
          "Include relevant coursework and achievements",
          "Mention academic honors and awards",
          "Only include GPA if it strengthens your profile"
        ]} 
      />
    </div>
  );
};

// Skills Section
export const SkillsSection = ({ skills, onUpdate }) => {
  return (
    <div className="mb-8">
      <SectionHeader icon={<Code className="h-5 w-5" />} title="Skills" />
      
      <SectionPanel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {skills.map((skill) => (
            <div 
              key={skill.id} 
              className="flex justify-between items-center p-2.5 bg-black/30 border border-blue-500/30 rounded-md"
            >
              <span className="text-white">{skill.name}</span>
              <div className="flex items-center">
                <div className="flex space-x-1 mr-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div 
                      key={i}
                      className={`h-1.5 w-5 rounded-full ${i < skill.proficiency ? 'bg-blue-500' : 'bg-gray-700'}`}
                    />
                  ))}
                </div>
                <ActionButtons 
                  onEdit={() => {/* Handle edit */}} 
                  onDelete={() => {/* Handle delete */}} 
                />
              </div>
            </div>
          ))}
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-4 border-blue-500/30 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
          onClick={() => {/* Handle add */}}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Skill
        </Button>
      </SectionPanel>
      
      <TipPanel 
        title="Tips for showcasing skills:" 
        tips={[
          "Include a mix of technical and soft skills",
          "Prioritize skills mentioned in job descriptions",
          "Be honest about your proficiency levels",
          "Group similar skills together"
        ]} 
      />
    </div>
  );
};

// Projects Section
export const ProjectsSection = ({ projects, onUpdate }) => {
  return (
    <div className="mb-8">
      <SectionHeader icon={<FolderKanban className="h-5 w-5" />} title="Projects" />
      
      {projects.map((project) => (
        <SectionPanel key={project.id}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-white text-lg font-medium">{project.title || "Project Title"}</h3>
              <div className="flex flex-wrap mt-2 gap-2">
                {project.technologies.map((tech, index) => (
                  <span 
                    key={index} 
                    className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <ActionButtons 
              onEdit={() => {/* Handle edit */}} 
              onDelete={() => {/* Handle delete */}} 
            />
          </div>
          <div className="mt-3 text-sm text-gray-300">
            {project.description || "Project description goes here..."}
          </div>
          {project.link && (
            <div className="mt-3">
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-sm inline-flex items-center"
              >
                View Project <span className="ml-1">→</span>
              </a>
            </div>
          )}
        </SectionPanel>
      ))}
      
      <Button 
        variant="outline" 
        className="w-full border-blue-500/30 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
        onClick={() => {/* Handle add */}}
      >
        <Plus className="h-4 w-4 mr-2" /> Add Project
      </Button>
      
      <TipPanel 
        title="Tips for adding projects:" 
        tips={[
          "Include personal projects or significant academic/work initiatives",
          "Highlight technologies and methodologies used",
          "Detail your specific contributions to team projects",
          "Add links to repositories or live demos when available"
        ]} 
      />
    </div>
  );
};

// AI Assistant Suggestion Item
export const SuggestionItem = ({ text, onClick }) => (
  <div 
    className="p-2 rounded bg-gray-900/50 border border-blue-500/30 hover:bg-blue-500/10 transition-colors cursor-pointer"
    onClick={onClick}
  >
    {text}
  </div>
);

// AI Assistant Panel
export const AIAssistantPanel = ({ title, description, suggestions, icon, onGetSuggestions }) => (
  <div className="bg-gradient-to-b from-gray-800/90 to-gray-900/95 rounded-lg border border-blue-500/30 overflow-hidden min-h-[300px]">
    <div className="relative z-10 p-4">
      <div className="flex items-center gap-2 mb-5">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="font-medium text-white text-lg">
          {title}
        </h3>
      </div>
      
      <div className="space-y-4">
        <p className="text-sm text-blue-100">{description}</p>
        
        <div className="space-y-2 text-sm">
          {suggestions.map((suggestion, index) => (
            <SuggestionItem 
              key={index}
              text={suggestion}
              onClick={() => {/* Handle click */}}
            />
          ))}
        </div>
        
        <Button 
          className="w-full mt-4 py-2 px-3 bg-blue-600/30 hover:bg-blue-600/50 rounded-md text-white text-sm transition-colors"
          onClick={onGetSuggestions}
        >
          Get AI suggestions
        </Button>
      </div>
    </div>
  </div>
);