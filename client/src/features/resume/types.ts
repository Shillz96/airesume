/**
 * Resume feature types
 * Centralizes all type definitions related to resume functionality
 */

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
  category?: string; // Optional category for skill grouping
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
  personalInfo: PersonalInfo;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  template: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TailoredResume {
  personalInfo: {
    summary: string;
    [key: string]: any;
  };
  experience: ExperienceItem[];
  skills: string[] | SkillItem[];
  keywordsIncorporated?: string[]; // ATS keywords added to the resume
  matchAnalysis?: string; // Analysis of how well the resume matches the job
}

export interface ResumeSuggestions {
  suggestions: string[];
}