import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Resume, ExperienceItem, EducationItem, SkillItem, ProjectItem, PersonalInfo } from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Initial resume template with empty values
 */
const initialResume: Resume = {
  title: 'My Resume',
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    headline: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  template: 'modern',
};

/**
 * Custom hook to manage resume data loading, saving, and updating
 */
export function useResumeData(resumeId?: string | number) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentResumeData, setCurrentResumeData] = useState<Resume>(initialResume);

  // Fetch the user's resumes or a specific resume
  const { 
    data: resumeData, 
    isLoading: isLoadingResume,
    error: resumeError 
  } = useQuery({
    queryKey: resumeId ? ['resumes', resumeId] : ['resumes'],
    queryFn: async () => {
      if (!user) return null;
      
      if (resumeId) {
        const data = await apiRequest<Resume>(`/api/resumes/${resumeId}`);
        return data;
      } else {
        const data = await apiRequest<Resume[]>('/api/resumes');
        return data && data.length > 0 ? data[0] : null; // Return the first resume or null
      }
    },
    enabled: !!user,
    onSuccess: (data) => {
      if (data) {
        setCurrentResumeData(data);
      }
    }
  });

  // Save resume mutation
  const saveResumeMutation = useMutation({
    mutationFn: async (resumeData: Resume) => {
      if (!user) throw new Error('User not authenticated');
      
      if (resumeData.id) {
        // Update existing resume
        return apiRequest<Resume>(`/api/resumes/${resumeData.id}`, {
          method: 'PUT',
          body: JSON.stringify(resumeData),
        });
      } else {
        // Create new resume
        return apiRequest<Resume>('/api/resumes', {
          method: 'POST',
          body: JSON.stringify(resumeData),
        });
      }
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Resume saved successfully!',
      });
      // Invalidate the resumes query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to save resume: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  // Update the entire resume (used when applying template changes)
  const updateResume = useCallback((newResumeData: Resume) => {
    setCurrentResumeData(newResumeData);
  }, []);

  // Update personal info section
  const updatePersonalInfo = useCallback((updates: Partial<PersonalInfo>) => {
    setCurrentResumeData(prevData => ({
      ...prevData,
      personalInfo: {
        ...prevData.personalInfo,
        ...updates
      }
    }));
  }, []);

  // Update resume title
  const updateTitle = useCallback((title: string) => {
    setCurrentResumeData(prevData => ({
      ...prevData,
      title
    }));
  }, []);

  // Update professional summary
  const updateSummary = useCallback((summary: string) => {
    setCurrentResumeData(prevData => ({
      ...prevData,
      personalInfo: {
        ...prevData.personalInfo,
        summary
      }
    }));
  }, []);

  // Add a new experience item
  const addExperience = useCallback(() => {
    const newExperience: ExperienceItem = {
      id: `exp_${uuidv4()}`,
      title: 'New Position',
      company: 'Company Name',
      startDate: '2023-01',
      endDate: 'Present',
      description: 'Describe your responsibilities and achievements...'
    };
    
    setCurrentResumeData(prevData => ({
      ...prevData,
      experience: [...prevData.experience, newExperience]
    }));

    return newExperience.id;
  }, []);

  // Update experience items
  const updateExperience = useCallback((experiences: ExperienceItem[]) => {
    setCurrentResumeData(prevData => ({
      ...prevData,
      experience: experiences
    }));
  }, []);

  // Add a new education item
  const addEducation = useCallback(() => {
    const newEducation: EducationItem = {
      id: `edu_${uuidv4()}`,
      degree: 'Degree Name',
      institution: 'Institution Name',
      startDate: '2020-09',
      endDate: '2023-06',
      description: 'Describe your education, achievements, and relevant coursework...'
    };
    
    setCurrentResumeData(prevData => ({
      ...prevData,
      education: [...prevData.education, newEducation]
    }));

    return newEducation.id;
  }, []);

  // Update education items
  const updateEducation = useCallback((education: EducationItem[]) => {
    setCurrentResumeData(prevData => ({
      ...prevData,
      education
    }));
  }, []);

  // Add a new skill item
  const addSkill = useCallback((name: string, proficiency: number = 3) => {
    const newSkill: SkillItem = {
      id: `skill_${uuidv4()}`,
      name,
      proficiency
    };
    
    setCurrentResumeData(prevData => ({
      ...prevData,
      skills: [...prevData.skills, newSkill]
    }));

    return newSkill.id;
  }, []);

  // Update skills items
  const updateSkills = useCallback((skills: SkillItem[]) => {
    setCurrentResumeData(prevData => ({
      ...prevData,
      skills
    }));
  }, []);

  // Add a new project item
  const addProject = useCallback(() => {
    const newProject: ProjectItem = {
      id: `proj_${uuidv4()}`,
      title: 'New Project',
      description: 'Describe your project, its purpose, and your contribution...',
      technologies: [],
    };
    
    setCurrentResumeData(prevData => ({
      ...prevData,
      projects: [...prevData.projects, newProject]
    }));

    return newProject.id;
  }, []);

  // Update projects items
  const updateProjects = useCallback((projects: ProjectItem[]) => {
    setCurrentResumeData(prevData => ({
      ...prevData,
      projects
    }));
  }, []);

  // Change template
  const changeTemplate = useCallback((template: string) => {
    setCurrentResumeData(prevData => ({
      ...prevData,
      template
    }));
  }, []);

  // Save current resume
  const saveResume = useCallback(() => {
    saveResumeMutation.mutate(currentResumeData);
  }, [saveResumeMutation, currentResumeData]);

  // Create a new resume
  const createNewResume = useCallback(() => {
    setCurrentResumeData(initialResume);
  }, []);

  return {
    resumeData: currentResumeData,
    isLoading: isLoadingResume,
    error: resumeError,
    isSaving: saveResumeMutation.isPending,
    updateResume,
    updatePersonalInfo,
    updateTitle,
    updateSummary,
    addExperience,
    updateExperience,
    addEducation,
    updateEducation,
    addSkill,
    updateSkills,
    addProject,
    updateProjects,
    changeTemplate,
    saveResume,
    createNewResume
  };
}