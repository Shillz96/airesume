import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

// Resume and related types
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
  category?: string; // Added optional category property
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
}

// Initial blank resume state
const initialResume: Resume = {
  title: 'Untitled Resume',
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    headline: '',
    summary: ''
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  template: 'professional'
};

// Types for API responses
interface ResumeApiResponse {
  id: string;
  title: string;
  content: {
    personalInfo?: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      headline?: string;
      summary?: string;
    };
    experience?: Array<{
      id?: string;
      title: string;
      company: string;
      startDate: string;
      endDate: string;
      description: string;
    }>;
    education?: Array<{
      id?: string;
      degree: string;
      institution: string;
      startDate: string;
      endDate: string;
      description: string;
    }>;
    skills?: Array<{
      id?: string;
      name: string;
      proficiency: number;
      category?: string;
    }>;
    projects?: Array<{
      id?: string;
      title: string;
      description: string;
      technologies: string[];
      link?: string;
    }>;
  };
  template?: string;
}

/**
 * Custom hook to manage resume data loading, saving, and updating
 */
export function useResumeData() {
  const { toast } = useToast();
  const [location] = useLocation();
  
  // Parse search parameters manually since wouter doesn't have useSearchParams
  const getSearchParams = () => {
    const url = new URL(window.location.href);
    return {
      get: (param: string) => url.searchParams.get(param)
    };
  };
  const searchParams = getSearchParams();

  // State for the resume data
  const [resume, setResume] = useState<Resume>(initialResume);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  // Extract resumeId from URL parameters
  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl) {
      try {
        setResumeId(idFromUrl);
        
        // Try to load from localStorage first (for recovering from sessions)
        const savedResumeData = localStorage.getItem('editingResume');
        if (savedResumeData) {
          try {
            const savedResume = JSON.parse(savedResumeData);
            if (savedResume.id === idFromUrl) {
              setResume(savedResume as Resume);
              setActiveSection('profile');
              toast({
                title: 'Resume Loaded Successfully',
                description: `"${savedResume.title}" has been loaded for editing`,
              });
              localStorage.removeItem('editingResume');
            }
          } catch (parseError) {
            // Silent error handling with user feedback
            toast({
              title: 'Session Recovery Failed',
              description: 'Unable to recover your last editing session. Starting fresh.',
              variant: 'default',
            });
            localStorage.removeItem('editingResume');
          }
        }
      } catch (e) {
        // Silent error handling with user feedback
        toast({
          title: 'Invalid Resume ID',
          description: 'The resume ID in the URL is invalid. Please check the URL.',
          variant: 'destructive',
        });
      }
    }

    // Check for template in URL parameters
    const templateParam = searchParams.get('template');
    if (templateParam) {
      setResume(prev => ({
        ...prev,
        template: templateParam
      }));
    }
  }, [location, toast]);

  // Fetch resume data if resumeId exists
  const { data: fetchedResume, error: fetchError } = useQuery<ResumeApiResponse>({
    queryKey: ['/api/resumes', resumeId],
    enabled: !!resumeId,
  });

  // Process fetched resume data
  useEffect(() => {
    if (fetchedResume) {
      try {
        // The API returns resume data with a nested 'content' object
        const content = fetchedResume.content;
        
        // Ensure we have complete data structure for all fields
        const completeResume: Resume = {
          id: fetchedResume.id,
          title: fetchedResume.title || 'Untitled Resume',
          personalInfo: {
            firstName: content.personalInfo?.firstName || '',
            lastName: content.personalInfo?.lastName || '',
            email: content.personalInfo?.email || '',
            phone: content.personalInfo?.phone || '',
            headline: content.personalInfo?.headline || '',
            summary: content.personalInfo?.summary || ''
          },
          experience: Array.isArray(content.experience) ? content.experience.map((exp) => ({
            ...exp,
            id: exp.id || crypto.randomUUID(), // Ensure each experience has an ID
          })) : [],
          education: Array.isArray(content.education) ? content.education.map((edu) => ({
            ...edu,
            id: edu.id || crypto.randomUUID(), // Ensure each education has an ID
          })) : [],
          skills: Array.isArray(content.skills) ? content.skills.map((skill) => ({
            ...skill,
            id: skill.id || crypto.randomUUID(), // Ensure each skill has an ID
          })) : [],
          projects: Array.isArray(content.projects) ? content.projects.map((project) => ({
            ...project,
            id: project.id || crypto.randomUUID(), // Ensure each project has an ID
          })) : [],
          template: fetchedResume.template || 'professional'
        };
        
        // Force a complete state update by creating a brand new object
        setResume(completeResume);
        
        toast({
          title: 'Resume Loaded',
          description: `"${completeResume.title}" has been loaded for editing`,
        });
      } catch (error) {
        // Silent error handling with user feedback
        toast({
          title: 'Error Loading Resume',
          description: 'There was a problem loading your resume data. Please try refreshing the page.',
          variant: 'destructive',
        });
        
        // Set a basic resume structure to prevent UI errors
        setResume({
          ...initialResume,
          id: fetchedResume.id,
          title: fetchedResume.title || 'Untitled Resume',
        });
      }
    }
  }, [fetchedResume, toast]);

  // Handle errors from the query
  useEffect(() => {
    if (fetchError) {
      toast({
        title: 'Error Loading Resume',
        description: 'Failed to load the resume. Please try again.',
        variant: 'destructive',
      });
    }
  }, [fetchError, toast]);

  // Save resume data
  const { mutate: saveResumeMutation, isPending: isSaving } = useMutation<ResumeApiResponse, Error, Resume>({
    mutationFn: async (data: Resume) => {
      try {
        const response = await apiRequest('POST', '/api/resumes', {
          body: JSON.stringify(data)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response.json();
      } catch (error) {
        // Silent error handling with user feedback
        toast({
          title: 'Error Saving Resume',
          description: 'Failed to save your resume. Please try again.',
          variant: 'destructive',
        });
        throw error; // Re-throw to trigger error handling in onError
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/resumes'] });
      setIsDirty(false);
      toast({
        title: 'Resume Saved',
        description: 'Your resume has been saved successfully.',
      });
      
      // Store the resume ID in localStorage for recovery
      if (data.id) {
        setResumeId(data.id);
        try {
          localStorage.setItem('lastSavedResumeId', data.id);
        } catch (storageError) {
          // Silent error handling - not critical
          toast({
            title: 'Session Storage Failed',
            description: 'Unable to store resume ID for recovery. Your resume is still saved.',
            variant: 'default',
          });
        }
      }
    },
    onError: (error) => {
      // Silent error handling with user feedback
      toast({
        title: 'Save Failed',
        description: 'Unable to save your resume. Please check your connection and try again.',
        variant: 'destructive',
      });
      
      // Try to store current state in localStorage for recovery
      try {
        if (resumeId) {
          localStorage.setItem('editingResume', JSON.stringify(resume));
        }
      } catch (storageError) {
        // Silent error handling - not critical
        toast({
          title: 'Backup Failed',
          description: 'Unable to create a backup of your changes.',
          variant: 'default',
        });
      }
    }
  });

  // Update functions for resume sections
  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setResume(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
    setIsDirty(true);
  };

  const updateExperienceList = (experiences: ExperienceItem[]) => {
    setResume(prev => ({
      ...prev,
      experience: experiences
    }));
    setIsDirty(true);
  };

  const updateEducationList = (education: EducationItem[]) => {
    setResume(prev => ({
      ...prev,
      education: education
    }));
    setIsDirty(true);
  };

  const updateSkillsList = (skills: SkillItem[]) => {
    setResume(prev => ({
      ...prev,
      skills: skills
    }));
    setIsDirty(true);
  };

  const updateProjectsList = (projects: ProjectItem[]) => {
    setResume(prev => ({
      ...prev,
      projects: projects
    }));
    setIsDirty(true);
  };

  const updateResumeTemplate = (template: string) => {
    setResume(prev => ({
      ...prev,
      template: template
    }));
    setIsDirty(true);
  };

  const updateResumeTitle = (title: string) => {
    setResume(prev => ({
      ...prev,
      title: title
    }));
    setIsDirty(true);
  };

  // Helper functions for adding new items
  const addExperience = () => {
    const newExperience: ExperienceItem = {
      id: crypto.randomUUID(),
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    updateExperienceList([...resume.experience, newExperience]);
    return newExperience.id;
  };

  const addEducation = () => {
    const newEducation: EducationItem = {
      id: crypto.randomUUID(),
      degree: '',
      institution: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    updateEducationList([...resume.education, newEducation]);
    return newEducation.id;
  };

  const addSkill = (category?: string) => {
    const newSkill: SkillItem = {
      id: crypto.randomUUID(),
      name: '',
      proficiency: 3,
      category: category
    };
    updateSkillsList([...resume.skills, newSkill]);
    return newSkill.id;
  };

  const addProject = () => {
    const newProject: ProjectItem = {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      technologies: []
    };
    updateProjectsList([...resume.projects, newProject]);
    return newProject.id;
  };

  return {
    resume,
    setResume,
    resumeId,
    activeSection,
    setActiveSection,
    isLoading: isLoading || isSaving,
    isDirty,
    updatePersonalInfo,
    updateExperienceList,
    updateEducationList,
    updateSkillsList,
    updateProjectsList,
    updateResumeTemplate,
    updateResumeTitle,
    addExperience,
    addEducation,
    addSkill,
    addProject,
    saveResume: () => saveResumeMutation(resume)
  };
}