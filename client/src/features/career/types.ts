/**
 * Career feature types
 * Centralizes all type definitions related to career path functionality
 */

/**
 * Career path identifiers
 * Represents the different career paths detected and supported by the system
 */
export type CareerPath = 
  | 'software_engineering'
  | 'data_science'
  | 'design'
  | 'marketing'
  | 'sales'
  | 'product_management'
  | 'finance'
  | 'healthcare'
  | 'education'
  | 'customer_service'
  | 'general';

/**
 * Career-specific advice
 * Tailored information and recommendations for a specific career path
 */
export interface CareerSpecificAdvice {
  suggestedSkills: string[];
  industryKeywords: string[];
  resumeTips: string[];
  careerPathDescription: string;
  certifications: string[];
}

/**
 * Response from career path detection API
 */
export interface CareerDetectionResponse {
  success: boolean;
  careerPath: CareerPath;
  advice: CareerSpecificAdvice;
}

/**
 * Career path metadata
 * Additional information about a career path
 */
export interface CareerPathInfo {
  id: CareerPath;
  name: string;
  description: string;
  icon?: string;
  color?: string;
}

/**
 * Career insight
 * Short, actionable tips for career development
 */
export interface CareerInsight {
  id: string;
  careerPath: CareerPath;
  title: string;
  description: string;
  source?: string;
  url?: string;
}

/**
 * Career growth milestone
 * Represents typical progression points in a career path
 */
export interface CareerMilestone {
  id: string;
  careerPath: CareerPath;
  title: string;
  yearsExperience: number;
  description: string;
  typicalRoles: string[];
  keySkills: string[];
}