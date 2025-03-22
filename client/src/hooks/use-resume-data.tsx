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
  location?: string;
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
    summary: '',
    location: ''
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  template: 'professional'
};

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
            console.error('Error parsing stored resume data:', parseError);
          }
        }
      } catch (e) {
        console.error('Error parsing resume ID from URL', e);
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
  const { data: fetchedResume, error: fetchError } = useQuery({
    queryKey: ['/api/resumes', resumeId],
    enabled: !!resumeId,
  });

  // Process fetched resume data
  useEffect(() => {
    if (fetchedResume) {
      try {
        // The API returns resume data with a nested 'content' object
        const content = fetchedResume.content || {};
        
        // Ensure we have complete data structure for all fields
        const completeResume = {
          id: fetchedResume.id,
          title: fetchedResume.title || 'Untitled Resume',
          personalInfo: {
            firstName: content.personalInfo?.firstName || '',
            lastName: content.personalInfo?.lastName || '',
            email: content.personalInfo?.email || '',
            phone: content.personalInfo?.phone || '',
            headline: content.personalInfo?.headline || '',
            summary: content.personalInfo?.summary || '',
            location: content.personalInfo?.location || ''
          },
          experience: Array.isArray(content.experience) ? content.experience.map((exp: any) => ({
            ...exp,
            id: exp.id || crypto.randomUUID(), // Ensure each experience has an ID
          })) : [],
          education: Array.isArray(content.education) ? content.education.map((edu: any) => ({
            ...edu,
            id: edu.id || crypto.randomUUID(), // Ensure each education has an ID
          })) : [],
          skills: Array.isArray(content.skills) ? content.skills.map((skill: any) => ({
            ...skill,
            id: skill.id || crypto.randomUUID(), // Ensure each skill has an ID
          })) : [],
          projects: Array.isArray(content.projects) ? content.projects.map((project: any) => ({
            ...project,
            id: project.id || crypto.randomUUID(), // Ensure each project has an ID
          })) : [],
          template: fetchedResume.template || 'professional'
        };
        
        // Force a complete state update by creating a brand new object
        setResume(completeResume as Resume);
        
        toast({
          title: 'Resume Loaded',
          description: `"${completeResume.title}" has been loaded for editing`,
        });
      } catch (error) {
        console.error('Error processing resume data:', error);
        toast({
          title: 'Error Loading Resume',
          description: 'There was a problem loading your resume data.',
          variant: 'destructive',
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

  // Save Resume Mutation
  const saveMutation = useMutation({
    mutationFn: async (resumeData: Resume) => {
      setIsLoading(true);
      try {
        // Determine if we're creating a new resume or updating an existing one
        const method = resumeData.id ? 'PATCH' : 'POST';
        const endpoint = resumeData.id 
          ? `/api/resumes/${resumeData.id}` 
          : '/api/resumes';
        
        // Convert the resume state to the API expected format
        const apiResumeData = {
          title: resumeData.title,
          content: {
            personalInfo: resumeData.personalInfo,
            experience: resumeData.experience,
            education: resumeData.education,
            skills: resumeData.skills,
            projects: resumeData.projects
          },
          template: resumeData.template
        };
        
        const result = await apiRequest(endpoint, {
          method,
          body: JSON.stringify(apiResumeData),
        });
        
        setIsDirty(false);
        return result;
      } catch (error) {
        console.error('Error saving resume:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: (data) => {
      // Update the resume with the response data (in case of new resume creation)
      if (data && data.id) {
        setResumeId(data.id);
        setResume(prev => ({ ...prev, id: data.id }));
        
        // Update the URL without page reload
        const url = new URL(window.location.href);
        url.searchParams.set('id', data.id);
        window.history.pushState({}, '', url.toString());
      }
      
      toast({
        title: 'Resume Saved',
        description: 'Your resume has been saved successfully.',
      });
      
      // Invalidate the resumes query to refresh list views
      queryClient.invalidateQueries({ queryKey: ['/api/resumes'] });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({
        title: 'Error Saving Resume',
        description: 'Failed to save your resume. Please try again.',
        variant: 'destructive',
      });
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

  // Save the resume
  const saveResume = () => {
    saveMutation.mutate(resume);
  };

  return {
    resume,
    setResume,
    resumeId,
    activeSection,
    setActiveSection,
    isLoading: isLoading || saveMutation.isPending,
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
    saveResume
  };
}