/**
 * Job feature types
 * Centralizes all type definitions related to job functionality
 */

import { SkillItem } from '../resume/types';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  match?: number;
  postedAt: string;
  isNew?: boolean;
  skills: string[];
  saved: boolean;
  applyUrl: string;
  salary?: string;
  experience?: string;
  level?: string;
  industry?: string;
  remote?: boolean;
  benefits?: string[];
}

export interface JobFilterValues {
  title: string;
  location: string;
  type: string;
  experience: string;
  remote: string;
  salary: string;
  country: string;
}

export interface UserResume {
  id?: number; // Optional ID for authenticated users
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    headline: string;
    summary: string;
  };
  experience: any[];
  skills: SkillItem[];
}

export interface Application {
  id: number;
  userId: number;
  jobId: number;
  resumeId: number;
  status: string;
  notes?: string;
  appliedAt: string;
}

export interface TailoredJobResume {
  personalInfo: {
    summary: string;
    [key: string]: any;
  };
  experience: any[];
  skills: string[] | SkillItem[];
  keywordsIncorporated?: string[]; // ATS keywords added to the resume
  matchAnalysis?: string; // Analysis of how well the resume matches the job
}