import React, { useState, useEffect, useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { CosmicButton } from "@/components/cosmic-button";
import CosmicBackground from "@/components/cosmic-background";
import Navbar from "@/components/navbar";
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  FileText, 
  Save, 
  Upload, 
  Eye, 
  Download, 
  PlusCircle, 
  Brain, 
  Sparkles, 
  EyeOff, 
  Lightbulb,
  Package,
  ListFilter,
  CircleDot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  ResumeExperienceSection,
  ResumeEducationSection,
  ResumeSkillsSection,
  ResumeProjectsSection,
  ExperienceItem,
  EducationItem,
  SkillItem,
  ProjectItem
} from "@/components/resume-section";
import { 
  DndContext, 
  closestCenter, 
  MouseSensor,
  TouchSensor,
  DragOverlay,
  useSensor, 
  useSensors,
  DragStartEvent,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { useToast } from "@/hooks/use-toast";
import ResumeUpload from "@/components/resume/resume-upload";
import ResumePreviewComponent from "@/components/resume/resume-preview";
import AIAssistant from "@/components/ai-assistant";
import SummarySuggestions from "@/components/resume/summary-suggestions";
import ExperienceSuggestions from "@/components/resume/experience-suggestions";
import SkillSuggestions from "@/components/resume/skills-suggestions";
import RichTextEditor from "@/components/rich-text-editor";

/**
 * The main Resume Builder page component
 * Allows users to create and edit resumes with sections for personal info, experience, education, skills, and projects
 * Includes AI-powered suggestions and template switching
 */
export default function ResumeBuilder() {
  // Extract resume ID from URL if editing an existing resume
  const params = useParams();
  const resumeId = params?.id;

  // State for the resume data
  const [resume, setResume] = useState({
    id: resumeId || "",
    title: "My Professional Resume",
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      headline: "",
      summary: ""
    },
    experience: [] as ExperienceItem[],
    education: [] as EducationItem[],
    skills: [] as SkillItem[],
    projects: [] as ProjectItem[],
    template: "professional", // Default template
    skillsDisplayMode: "bubbles" // 'bubbles' or 'bullets'
  });

  // UI state
  const [currentTab, setCurrentTab] = useState("contact");
  const [showPersonalInfo, setShowPersonalInfo] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [draggedItemType, setDraggedItemType] = useState<"experience" | "education" | "skills" | "projects" | null>(null);
  
  const { toast } = useToast();
  
  // Sensors for drag and drop functionality
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    })
  );

  // Fetch resume data if editing an existing resume
  const { isLoading: isLoadingResume } = useQuery({
    queryKey: ["resume", resumeId],
    enabled: !!resumeId,
    queryFn: async () => {
      const data = await apiRequest(`/api/resumes/${resumeId}`);
      if (data) {
        setResume({
          ...resume,
          ...data,
          id: data.id || resumeId || "",
          title: data.title || "My Professional Resume",
          personalInfo: {
            ...resume.personalInfo,
            ...(data.personalInfo || {})
          },
          experience: Array.isArray(data.experience) ? data.experience : [],
          education: Array.isArray(data.education) ? data.education : [],
          skills: Array.isArray(data.skills) ? data.skills : [],
          projects: Array.isArray(data.projects) ? data.projects : [],
          template: data.template || "professional",
          skillsDisplayMode: data.skillsDisplayMode || "bubbles"
        });
      }
      return data;
    }
  });

  // Mutation for saving the resume
  const { mutate, isLoading } = useMutation({
    mutationFn: async (resumeData: Resume) => {
      // If we have a resume ID, update it, otherwise create a new one
      const endpoint = resumeId 
        ? `/api/resumes/${resumeId}` 
        : '/api/resumes';
      
      return await apiRequest(endpoint, {
        method: resumeId ? 'PUT' : 'POST',
        data: resumeData
      });
    },
    onSuccess: (data) => {
      // If this was a new resume, update the URL to include the new ID
      if (!resumeId && data?.id) {
        window.history.pushState(null, '', `/resume-builder/${data.id}`);
      }
      
      toast({
        title: "Resume saved successfully",
        description: "Your resume has been saved to your account.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to save resume",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Mutation for downloading the resume as PDF
  const { mutate: downloadResume, isLoading: isDownloading } = useMutation({
    mutationFn: async () => {
      return await apiRequest(`/api/resumes/${resumeId || 'temp'}/download`, {
        method: 'POST',
        data: resumeId ? { id: resumeId } : resume,
        responseType: 'blob' // Important for binary data
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to download resume",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Load resume from localStorage on initial render
  useEffect(() => {
    if (!resumeId) {
      try {
        const savedData = localStorage.getItem('resumeBuilderSessionData');
        if (savedData) {
          const { resume: savedResume, timestamp, resumeId: savedId } = JSON.parse(savedData);
          
          // Only load if the saved resume is for the same ID or if this is a new resume
          if (!resumeId || savedId === resumeId) {
            // Check if the data is recent (within the last 24 hours)
            const savedDate = new Date(timestamp);
            const now = new Date();
            const hoursSinceSaved = (now.getTime() - savedDate.getTime()) / (1000 * 60 * 60);
            
            if (hoursSinceSaved < 24) {
              setResume(savedResume);
              console.log('Loaded resume from session storage');
            }
          }
        }
      } catch (err) {
        console.error('Failed to load resume from session storage:', err);
      }
    }
  }, [resumeId]);
  
  // Update a single field in the resume
  const updateResumeLocally = useCallback((updates: Partial<Resume>) => {
    setResume(prev => {
      const updated = { ...prev, ...updates };
      
      // Save to localStorage for session persistence
      try {
        const sessionData = {
          resume: updated,
          timestamp: new Date().toISOString(),
          resumeId
        };
        localStorage.setItem('resumeBuilderSessionData', JSON.stringify(sessionData));
      } catch (err) {
        console.error('Failed to save resume to session storage:', err);
      }
      
      return updated;
    });
  }, [resumeId]);
  
  // Update personal info fields
  const updatePersonalInfo = useCallback((field: string, value: string) => {
    setResume(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  }, []);
  
  // Add new items to different sections
  const addExperience = useCallback(() => {
    const newExperience: ExperienceItem = {
      id: crypto.randomUUID(),
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      description: ""
    };
    
    setResume(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
  }, []);
  
  const addEducation = useCallback(() => {
    const newEducation: EducationItem = {
      id: crypto.randomUUID(),
      degree: "",
      institution: "",
      startDate: "",
      endDate: "",
      description: ""
    };
    
    setResume(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  }, []);
  
  const addSkill = useCallback(() => {
    const newSkill: SkillItem = {
      id: crypto.randomUUID(),
      name: "",
      proficiency: 80
    };
    
    setResume(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  }, []);
  
  const addProject = useCallback(() => {
    const newProject: ProjectItem = {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      technologies: []
    };
    
    setResume(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  }, []);
  
  // Handle saving the resume
  const handleSaveResume = useCallback(() => {
    mutate(resume);
  }, [mutate, resume]);
  
  // Handle downloading the resume as PDF
  const handleDownloadResume = useCallback(() => {
    // If we don't have a resume ID yet, save first and then download
    if (!resumeId) {
      toast({
        title: "Saving resume first",
        description: "Please save your resume before downloading.",
      });
      return;
    }
    
    downloadResume(undefined, {
      onSuccess: (data) => {
        // Create a temporary link and click it to download the file
        const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${resume.title || 'resume'}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Resume downloaded",
          description: "Your resume has been downloaded as a PDF.",
        });
      }
    });
  }, [downloadResume, resumeId, resume.title, toast]);
  
  // Toggle between edit and preview modes
  const togglePreviewMode = useCallback(() => {
    setShowPreview(prev => !prev);
  }, []);
  
  // Handle template changes
  const handleTemplateChange = useCallback((template: string) => {
    updateResumeLocally({ template });
  }, [updateResumeLocally]);
  
  // Toggle skills display mode between bubbles and bullets
  const toggleSkillsDisplay = useCallback(() => {
    const newMode = resume.skillsDisplayMode === "bubbles" ? "bullets" : "bubbles";
    
    // Update the resume with the new skills display mode
    updateResumeLocally({ 
      skillsDisplayMode: newMode 
    });
    
    // Show feedback toast
    toast({
      title: `Skills now displaying as ${newMode}`,
      description: `Your skills will be displayed as ${newMode} in the resume.`,
    });
  }, [resume.skillsDisplayMode, updateResumeLocally, toast]);
  
  // Kept for backward compatibility with the sidebar display toggle
  const toggleSkillsDisplayMode = toggleSkillsDisplay;
  
  // Smart adjust resume content to fit optimally on page(s)
  const handleSmartAdjust = useCallback(() => {
    console.log("Smart Adjust triggered");
    toast({ 
      title: "Smart Adjust Started", 
      description: "Processing your resume..." 
    });
    
    // Create a copy of resume to work with
    const resumeCopy = { ...resume };
    
    // 1. Experience: Concise, prioritized, and professional
    const adjustedExperience = resumeCopy.experience.map(exp => {
      let newDescription = exp.description || '';
      
      if (newDescription.includes('•')) {
        const bullets = newDescription.split('•').filter(Boolean);
        const keptBullets = bullets.slice(0, Math.min(2, bullets.length)); // Limit to 2 bullets for brevity
        
        newDescription = keptBullets
          .map((bullet: any) => {
            const trimmed = bullet.trim();
            return trimmed.length > 60 // Shorter max length for tight fit
              ? `• ${trimmed.substring(0, 55)}...`
              : `• ${trimmed}`;
          })
          .join('\n');
      } else {
        // Non-bullets get shortened more aggressively
        newDescription = newDescription.length > 100
          ? newDescription.substring(0, 95) + '...'
          : newDescription;
      }
      
      return { 
        ...exp, 
        description: newDescription 
      };
    });
    
    // Limit to 3 most recent experiences
    const limitedExperience = adjustedExperience.slice(0, 3);
    
    // 2. Education: Minimal but clear
    const adjustedEducation = resumeCopy.education.map(edu => {
      const description = edu.description || '';
      return {
        ...edu,
        description: description.length > 50 // Very short for education
          ? description.substring(0, 45) + '...'
          : description,
      };
    });
    
    // Limit to 2 most recent education entries
    const limitedEducation = adjustedEducation.slice(0, 2);
    
    // 3. Skills: Top 10, sorted by proficiency if available
    let adjustedSkills = [...resumeCopy.skills];
    if (adjustedSkills.length > 10) {
      // Sort by proficiency if available, otherwise just take first 10
      if (adjustedSkills[0] && typeof adjustedSkills[0] === 'object' && 'proficiency' in adjustedSkills[0]) {
        adjustedSkills = adjustedSkills
          .sort((a: any, b: any) => b.proficiency - a.proficiency)
          .slice(0, 10);
      } else {
        adjustedSkills = adjustedSkills.slice(0, 10);
      }
    }
    
    // 4. Summary: Crisp and professional
    let adjustedPersonalInfo = { ...resumeCopy.personalInfo };
    if (adjustedPersonalInfo.summary) {
      const maxSummaryLength = 200; // Short but readable summary
      adjustedPersonalInfo = {
        ...adjustedPersonalInfo,
        summary: adjustedPersonalInfo.summary.length > maxSummaryLength
          ? adjustedPersonalInfo.summary.substring(0, 195) + '...'
          : adjustedPersonalInfo.summary
      };
    }
    
    // 5. Projects: Concise and limited
    const adjustedProjects = resumeCopy.projects
      ? resumeCopy.projects.map(proj => {
          const description = proj.description || '';
          return {
            ...proj,
            description: description.length > 80
              ? description.substring(0, 75) + '...'
              : description,
          };
        })
      : [];
    const limitedProjects = adjustedProjects.slice(0, 2); // Max 2 projects
    
    // 6. Dynamic Adjustments: Scale based on total content
    // Calculate approximate total content length to determine if more aggressive cuts are needed
    const totalContentLength = 
      limitedExperience.reduce((sum, exp) => sum + (exp.description ? exp.description.length : 0), 0) +
      limitedEducation.reduce((sum, edu) => sum + (edu.description ? edu.description.length : 0), 0) +
      adjustedSkills.reduce((sum, skill) => sum + (skill.name ? skill.name.length : 0), 0) +
      (adjustedPersonalInfo.summary ? adjustedPersonalInfo.summary.length : 0) +
      limitedProjects.reduce((sum, proj) => sum + (proj.description ? proj.description.length : 0), 0);
    
    console.log("Total content length after initial adjustments:", totalContentLength);
    
    // If still too much content, make further aggressive cuts
    if (totalContentLength > 2000) { // Arbitrary threshold for "too long"
      console.log("Content still too long, applying extra cuts");
      
      // Further limit experiences to single bullet points if they have bullets
      const furtherReducedExperience = limitedExperience.map(exp => {
        let desc = exp.description || '';
        if (desc.includes('•')) {
          // Take only the first bullet point
          const firstBullet = desc.split('•')[1]; // Skip the empty first part
          desc = firstBullet ? `• ${firstBullet.trim()}` : desc;
        }
        return { ...exp, description: desc };
      });
      
      // Even shorter summary
      adjustedPersonalInfo = {
        ...adjustedPersonalInfo,
        summary: adjustedPersonalInfo.summary
          ? adjustedPersonalInfo.summary.substring(0, 150) + '...'
          : ''
      };
      
      // Update with more aggressive cuts
      limitedExperience.splice(0, limitedExperience.length, ...furtherReducedExperience);
    }
    
    // Apply all changes at once to minimize re-renders
    const optimizedResume = {
      ...resumeCopy,
      experience: limitedExperience,
      education: limitedEducation,
      skills: adjustedSkills,
      projects: limitedProjects,
      personalInfo: adjustedPersonalInfo
    };
    
    // Update the state with all changes
    setResume(optimizedResume);
    
    // Show success feedback
    toast({
      title: "Smart Adjust Complete",
      description: "Your resume is now optimized for one page.",
    });
  }, [resume, setResume, toast]);
  
  // Handle resume upload and parsed data
  const handleResumeUpload = (uploadedResumeData: Partial<Resume>) => {
    console.log("Resume builder received data:", uploadedResumeData);
    
    // Process skills array to ensure it has the correct structure
    let processedSkills = uploadedResumeData.skills || [];
    if (Array.isArray(processedSkills)) {
      // Convert string arrays to SkillItem objects if needed
      processedSkills = processedSkills.map((skill, index) => {
        if (typeof skill === 'string') {
          return {
            id: crypto.randomUUID(),
            name: skill,
            proficiency: 85
          };
        } else if (typeof skill === 'object' && skill !== null) {
          // Ensure skill object has the correct structure
          return {
            id: skill.id || crypto.randomUUID(),
            name: skill.name || `Skill ${index + 1}`,
            proficiency: skill.proficiency || 85
          };
        }
        // Default fallback
        return {
          id: crypto.randomUUID(),
          name: `Skill ${index + 1}`,
          proficiency: 85
        };
      });
    }
    
    // Build the new resume with the uploaded data
    const updatedResume = {
      ...resume,
      title: uploadedResumeData.title || resume.title,
      personalInfo: {
        ...resume.personalInfo,
        ...(uploadedResumeData.personalInfo || {}),
      },
      experience: (uploadedResumeData.experience || []).map(exp => ({
        ...exp,
        id: exp.id || crypto.randomUUID()
      })),
      education: (uploadedResumeData.education || []).map(edu => ({
        ...edu,
        id: edu.id || crypto.randomUUID()
      })),
      skills: processedSkills,
      projects: (uploadedResumeData.projects || []).map(proj => ({
        ...proj,
        id: proj.id || crypto.randomUUID(),
        technologies: Array.isArray(proj.technologies) ? proj.technologies : []
      })),
    };
    
    // Update state
    setResume(updatedResume);
    
    // Save to localStorage for session persistence
    try {
      // Store with a timestamp to know when it was last updated
      const sessionData = {
        resume: updatedResume,
        timestamp: new Date().toISOString(),
        resumeId: resumeId
      };
      localStorage.setItem('resumeBuilderSessionData', JSON.stringify(sessionData));
      console.log('Resume saved to session storage');
    } catch (err) {
      console.error('Failed to save resume to session storage:', err);
    }
    
    // Show feedback toast
    toast({
      title: "Resume uploaded successfully",
      description: "Your resume has been parsed and loaded. You can now edit and enhance it.",
    });
    
    // Switch to personal info tab
    setCurrentTab("contact");
    setShowPersonalInfo(true);
  };

  // Handle drag start event for section items
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveDragId(active.id as string);
    
    const id = active.id as string;
    
    // Determine which section the dragged item belongs to
    if (resume.experience.find(item => item.id === id)) {
      setDraggedItemType("experience");
    } else if (resume.education.find(item => item.id === id)) {
      setDraggedItemType("education");
    } else if (resume.skills.find(item => item.id === id)) {
      setDraggedItemType("skills");
    } else if (resume.projects.find(item => item.id === id)) {
      setDraggedItemType("projects");
    }
  };
  
  // Handle drag end event for section items (reorder)
  const handleDragEnd = (result: DragEndEvent) => {
    const { active, over } = result;
    
    if (!over) {
      setActiveDragId(null);
      setDraggedItemType(null);
      return;
    }
    
    if (active.id !== over.id) {
      // Reorder based on the section type
      if (draggedItemType === "experience") {
        setResume(prev => {
          const oldIndex = prev.experience.findIndex(item => item.id === active.id);
          const newIndex = prev.experience.findIndex(item => item.id === over.id);
          
          return {
            ...prev,
            experience: arrayMove(prev.experience, oldIndex, newIndex)
          };
        });
      } else if (draggedItemType === "education") {
        setResume(prev => {
          const oldIndex = prev.education.findIndex(item => item.id === active.id);
          const newIndex = prev.education.findIndex(item => item.id === over.id);
          
          return {
            ...prev,
            education: arrayMove(prev.education, oldIndex, newIndex)
          };
        });
      } else if (draggedItemType === "skills") {
        setResume(prev => {
          const oldIndex = prev.skills.findIndex(item => item.id === active.id);
          const newIndex = prev.skills.findIndex(item => item.id === over.id);
          
          return {
            ...prev,
            skills: arrayMove(prev.skills, oldIndex, newIndex)
          };
        });
      } else if (draggedItemType === "projects") {
        setResume(prev => {
          const oldIndex = prev.projects.findIndex(item => item.id === active.id);
          const newIndex = prev.projects.findIndex(item => item.id === over.id);
          
          return {
            ...prev,
            projects: arrayMove(prev.projects, oldIndex, newIndex)
          };
        });
      }
    }
    
    // Reset drag state
    setActiveDragId(null);
    setDraggedItemType(null);
  };
  
  // Generate HTML for a printable version of the resume
  function generatePrintableHTML(resumeData: Resume): string {
    // This would be implemented to convert the resume data to HTML
    // based on the selected template
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${resumeData.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
            .resume-container { max-width: 8.5in; margin: 0 auto; padding: 0.5in; }
            .header { text-align: center; margin-bottom: 20px; }
            .name { font-size: 24px; font-weight: bold; }
            .contact-info { font-size: 12px; color: #666; }
            .section { margin-bottom: 15px; }
            .section-title { font-size: 16px; font-weight: bold; border-bottom: 1px solid #ccc; margin-bottom: 8px; }
            .item { margin-bottom: 10px; }
            .item-header { display: flex; justify-content: space-between; }
            .item-title { font-weight: bold; }
            .item-subtitle { color: #666; }
            .item-date { color: #666; font-size: 12px; }
            .item-description { font-size: 12px; margin-top: 5px; }
            .skills-list { display: flex; flex-wrap: wrap; gap: 5px; }
            .skill-item { background: #f0f0f0; padding: 3px 8px; border-radius: 3px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="resume-container">
            <div class="header">
              <div class="name">${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}</div>
              <div class="contact-info">
                ${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone}
              </div>
              <div class="headline">${resumeData.personalInfo.headline}</div>
            </div>
            
            <div class="section">
              <div class="section-title">Summary</div>
              <div class="item-description">${resumeData.personalInfo.summary}</div>
            </div>
            
            <div class="section">
              <div class="section-title">Experience</div>
              ${resumeData.experience.map(exp => `
                <div class="item">
                  <div class="item-header">
                    <div class="item-title">${exp.title} - <span class="item-subtitle">${exp.company}</span></div>
                    <div class="item-date">${exp.startDate} - ${exp.endDate}</div>
                  </div>
                  <div class="item-description">${exp.description}</div>
                </div>
              `).join('')}
            </div>
            
            <div class="section">
              <div class="section-title">Education</div>
              ${resumeData.education.map(edu => `
                <div class="item">
                  <div class="item-header">
                    <div class="item-title">${edu.degree} - <span class="item-subtitle">${edu.institution}</span></div>
                    <div class="item-date">${edu.startDate} - ${edu.endDate}</div>
                  </div>
                  <div class="item-description">${edu.description}</div>
                </div>
              `).join('')}
            </div>
            
            <div class="section">
              <div class="section-title">Skills</div>
              <div class="skills-list">
                ${resumeData.skills.map(skill => `
                  <div class="skill-item">${skill.name}</div>
                `).join('')}
              </div>
            </div>
            
            ${resumeData.projects.length > 0 ? `
              <div class="section">
                <div class="section-title">Projects</div>
                ${resumeData.projects.map(project => `
                  <div class="item">
                    <div class="item-title">${project.title}</div>
                    <div class="item-description">${project.description}</div>
                    ${project.technologies && project.technologies.length > 0 ? `
                      <div class="item-description">Technologies: ${project.technologies.join(', ')}</div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </body>
      </html>
    `;
  }

  return (
    <div className="min-h-screen cosmic-page text-gray-100 flex flex-col">
      <Navbar />
      <CosmicBackground />

      <div className="container mx-auto flex-1 py-6 px-4 relative z-10 flex flex-col">
        <header className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-blue-400" />
                <input
                  type="text"
                  value={resume.title}
                  onChange={(e) => updateResumeLocally({ title: e.target.value })}
                  className="bg-transparent text-2xl font-bold focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-2 py-1 w-full md:w-auto"
                  placeholder="Resume Title"
                />
              </div>
              <p className="text-gray-400 text-sm mt-1 ml-9 hidden sm:block">
                Create and customize your resume with AI-powered suggestions
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 self-end md:self-center">
              <Button
                variant="outline"
                className="gap-2 bg-blue-900/20 border-blue-800/30 text-blue-300 hover:bg-blue-900/30 hover:text-blue-200"
                onClick={togglePreviewMode}
              >
                {showPreview ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    Exit Preview
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Preview
                  </>
                )}
              </Button>
              <CosmicButton
                variant="primary"
                onClick={handleSaveResume}
                isLoading={isLoading}
                loadingText="Saving..."
                iconLeft={<Save className="h-4 w-4" />}
              >
                Save Resume
              </CosmicButton>
            </div>
          </div>

          {/* Only show progress bar during editing */}
          {!showPreview && (
            <div className="bg-[rgba(30,40,80,0.3)] h-2 rounded-full overflow-hidden mt-4">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full"
                style={{
                  width: `${Math.min(
                    Math.max(
                      // Calculate completion percentage based on filled fields
                      (Object.values(resume.personalInfo).filter(Boolean).length / 6) * 25 +
                      (resume.experience.length > 0 ? 25 : 0) +
                      (resume.education.length > 0 ? 25 : 0) +
                      (resume.skills.length > 0 ? 25 : 0),
                      10
                    ),
                    100
                  )}%`,
                }}
              />
            </div>
          )}
        </header>

        {showPreview ? (
          // Preview mode
          <div className="flex-1 flex flex-col items-center">
            <ResumePreviewComponent 
              resume={resume} 
              onTemplateChange={handleTemplateChange}
              onDownload={handleDownloadResume}
              onToggleSkillsDisplay={toggleSkillsDisplay}
              onSmartAdjust={handleSmartAdjust}
              onEdit={() => togglePreviewMode()}
            />
          </div>
        ) : (
          // Edit mode
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Left sidebar with resume sections navigation */}
            <div className="xl:w-64 shrink-0">
              <div className="cosmic-card p-6 sticky top-24 shadow-lg shadow-blue-900/10">
                <h3 className="text-xl font-semibold mb-5 text-blue-300 border-b border-blue-800/50 pb-2">Resume Sections</h3>
                <div className="space-y-3">
                  <Button
                    variant={currentTab === "contact" ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      currentTab === "contact"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "text-blue-300 hover:text-blue-200 hover:bg-blue-900/30"
                    )}
                    onClick={() => {
                      setCurrentTab("contact");
                      setShowPersonalInfo(true);
                    }}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Personal Info
                  </Button>
                  <Button
                    variant={currentTab === "summary" ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      currentTab === "summary"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "text-blue-300 hover:text-blue-200 hover:bg-blue-900/30"
                    )}
                    onClick={() => {
                      setCurrentTab("summary");
                      setShowPersonalInfo(true);
                    }}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Professional Summary
                  </Button>
                  <Button
                    variant={currentTab === "experience" ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      currentTab === "experience"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "text-blue-300 hover:text-blue-200 hover:bg-blue-900/30"
                    )}
                    onClick={() => {
                      setCurrentTab("experience");
                      setShowPersonalInfo(false);
                    }}
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    Experience
                    {resume.experience.length > 0 && (
                      <Badge className="ml-auto bg-blue-700">{resume.experience.length}</Badge>
                    )}
                  </Button>
                  <Button
                    variant={currentTab === "education" ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      currentTab === "education"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "text-blue-300 hover:text-blue-200 hover:bg-blue-900/30"
                    )}
                    onClick={() => {
                      setCurrentTab("education");
                      setShowPersonalInfo(false);
                    }}
                  >
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Education
                    {resume.education.length > 0 && (
                      <Badge className="ml-auto bg-blue-700">{resume.education.length}</Badge>
                    )}
                  </Button>
                  <Button
                    variant={currentTab === "skills" ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      currentTab === "skills"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "text-blue-300 hover:text-blue-200 hover:bg-blue-900/30"
                    )}
                    onClick={() => {
                      setCurrentTab("skills");
                      setShowPersonalInfo(false);
                    }}
                  >
                    <Code className="mr-2 h-4 w-4" />
                    Skills
                    {resume.skills.length > 0 && (
                      <Badge className="ml-auto bg-blue-700">{resume.skills.length}</Badge>
                    )}
                  </Button>
                  <Button
                    variant={currentTab === "projects" ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      currentTab === "projects"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "text-blue-300 hover:text-blue-200 hover:bg-blue-900/30"
                    )}
                    onClick={() => {
                      setCurrentTab("projects");
                      setShowPersonalInfo(false);
                    }}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Projects
                    {resume.projects.length > 0 && (
                      <Badge className="ml-auto bg-blue-700">{resume.projects.length}</Badge>
                    )}
                  </Button>
                </div>

                <div className="mt-6 space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-blue-900/20 border-blue-800/30 text-blue-300 hover:bg-blue-900/30 hover:text-blue-200"
                    onClick={() => setShowAIAssistant(!showAIAssistant)}
                  >
                    <Brain className="mr-2 h-4 w-4" />
                    {showAIAssistant ? "Hide AI Assistant" : "Show AI Assistant"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-blue-900/20 border-blue-800/30 text-blue-300 hover:bg-blue-900/30 hover:text-blue-200"
                    onClick={togglePreviewMode}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview Resume
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-blue-900/20 border-blue-800/30 text-blue-300 hover:bg-blue-900/30 hover:text-blue-200"
                    onClick={handleSmartAdjust}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Smart Adjust
                  </Button>
                </div>
              </div>
              
              {/* Resume Upload Section */}
              <div className="cosmic-card p-4 mt-6">
                <h3 className="text-lg font-medium mb-3 text-blue-300">Import Resume</h3>
                <p className="text-sm text-gray-400 mb-3">
                  Upload an existing resume to import content
                </p>
                <ResumeUpload onUploadSuccess={handleResumeUpload} />
              </div>
            </div>

            {/* Main content area */}
            <div className="flex-1">
              {/* 2-column layout for content */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left column: Resume Editor */}
                <div className={cn(
                  "lg:col-span-8",
                  showAIAssistant ? "xl:col-span-7" : "xl:col-span-12"
                )}>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    {/* Personal Info Section */}
                    {showPersonalInfo && (
                      <div className="cosmic-card p-6 mb-6">
                        {currentTab === "contact" ? (
                          <>
                            <h2 className="text-xl font-semibold mb-6 text-blue-300">Personal Information</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <Label className="mb-2 text-gray-300">First Name</Label>
                                <Input
                                  type="text"
                                  className="cosmic-input"
                                  placeholder="John"
                                  value={resume.personalInfo.firstName}
                                  onChange={(e) => updatePersonalInfo("firstName", e.target.value)}
                                />
                              </div>
                              <div>
                                <Label className="mb-2 text-gray-300">Last Name</Label>
                                <Input
                                  type="text"
                                  className="cosmic-input"
                                  placeholder="Doe"
                                  value={resume.personalInfo.lastName}
                                  onChange={(e) => updatePersonalInfo("lastName", e.target.value)}
                                />
                              </div>
                              <div>
                                <Label className="mb-2 text-gray-300">Email Address</Label>
                                <Input
                                  type="email"
                                  className="cosmic-input"
                                  placeholder="johndoe@example.com"
                                  value={resume.personalInfo.email}
                                  onChange={(e) => updatePersonalInfo("email", e.target.value)}
                                />
                              </div>
                              <div>
                                <Label className="mb-2 text-gray-300">Phone Number</Label>
                                <Input
                                  type="tel"
                                  className="cosmic-input"
                                  placeholder="(123) 456-7890"
                                  value={resume.personalInfo.phone}
                                  onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                                />
                              </div>
                              <div className="md:col-span-2">
                                <Label className="mb-2 text-gray-300">Professional Headline</Label>
                                <Input
                                  type="text"
                                  className="cosmic-input"
                                  placeholder="Senior Software Engineer | React | Node.js | TypeScript"
                                  value={resume.personalInfo.headline}
                                  onChange={(e) => updatePersonalInfo("headline", e.target.value)}
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center justify-between mb-6">
                              <h2 className="text-xl font-semibold text-blue-300">Professional Summary</h2>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-300 hover:text-blue-200 hover:bg-blue-900/30"
                                onClick={() => setCurrentTab("contact")}
                              >
                                Edit Contact Info
                              </Button>
                            </div>
                            <div className="mb-4">
                              <Label className="mb-2 text-gray-300">
                                Summary (Aim for 3-5 sentences that showcase your value)
                              </Label>
                              <RichTextEditor
                                value={resume.personalInfo.summary}
                                onChange={(value) => updatePersonalInfo("summary", value)}
                                placeholder="Experienced software engineer with 5+ years developing scalable web applications. Proficient in React, Node.js, and cloud technologies. Passionate about creating intuitive user experiences and optimizing application performance."
                                rows={6}
                              />
                            </div>

                            {/* AI Summary Suggestions */}
                            <div className="mt-6 border-t border-blue-900/30 pt-4">
                              <div className="flex items-center gap-2 mb-4">
                                <Lightbulb className="h-4 w-4 text-yellow-400" />
                                <h3 className="text-sm font-medium text-blue-300">
                                  AI-Powered Summary Suggestions
                                </h3>
                              </div>
                              <SummarySuggestions
                                resumeId={resumeId || "temp"}
                                onApply={(summary) =>
                                  updatePersonalInfo("summary", summary)
                                }
                              />
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Experience Section */}
                    {currentTab === "experience" && (
                      <div className="cosmic-card p-6 mb-6">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-xl font-semibold text-blue-300">
                            Work Experience
                          </h2>
                          <CosmicButton
                            variant="primary"
                            size="sm"
                            onClick={addExperience}
                            iconLeft={<PlusCircle className="h-4 w-4" />}
                          >
                            Add Experience
                          </CosmicButton>
                        </div>
                        
                        <SortableContext
                          items={resume.experience.map(exp => exp.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-6">
                            {resume.experience.length === 0 ? (
                              <div className="text-center py-6 text-gray-400">
                                <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                                <p className="mb-2">No work experience added yet</p>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={addExperience}
                                  className="bg-blue-900/20 border-blue-800/30 text-blue-300 hover:bg-blue-900/30 hover:text-blue-200"
                                >
                                  <PlusCircle className="h-4 w-4 mr-2" />
                                  Add your first experience
                                </Button>
                              </div>
                            ) : (
                              <ResumeExperienceSection
                                experiences={resume.experience}
                                onUpdate={(updatedExperiences) =>
                                  updateResumeLocally({ experience: updatedExperiences })
                                }
                              />
                            )}
                          </div>
                        </SortableContext>
                        
                        {resume.experience.length > 0 && (
                          <div className="mt-6 border-t border-blue-900/30 pt-4">
                            <div className="flex items-center gap-2 mb-4">
                              <Lightbulb className="h-4 w-4 text-yellow-400" />
                              <h3 className="text-sm font-medium text-blue-300">
                                AI-Powered Bullet Point Suggestions
                              </h3>
                            </div>
                            <ExperienceSuggestions
                              resumeId={resumeId || "temp"}
                              jobTitle={resume.experience[0]?.title}
                              onApply={(bullet) => {
                                // Add the bullet to the most recent experience's description
                                if (resume.experience.length > 0) {
                                  const updatedExperiences = [...resume.experience];
                                  const latestExp = updatedExperiences[0];
                                  
                                  // Append bullet point to existing description or create new one
                                  latestExp.description = latestExp.description 
                                    ? `${latestExp.description}\n• ${bullet}` 
                                    : `• ${bullet}`;
                                  
                                  updateResumeLocally({ experience: updatedExperiences });
                                }
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Education Section */}
                    {currentTab === "education" && (
                      <div className="cosmic-card p-6 mb-6">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-xl font-semibold text-blue-300">
                            Education
                          </h2>
                          <CosmicButton
                            variant="primary"
                            size="sm"
                            onClick={addEducation}
                            iconLeft={<PlusCircle className="h-4 w-4" />}
                          >
                            Add Education
                          </CosmicButton>
                        </div>
                        
                        <SortableContext
                          items={resume.education.map(edu => edu.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-6">
                            {resume.education.length === 0 ? (
                              <div className="text-center py-6 text-gray-400">
                                <GraduationCap className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                                <p className="mb-2">No education entries added yet</p>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={addEducation}
                                  className="bg-blue-900/20 border-blue-800/30 text-blue-300 hover:bg-blue-900/30 hover:text-blue-200"
                                >
                                  <PlusCircle className="h-4 w-4 mr-2" />
                                  Add your first education
                                </Button>
                              </div>
                            ) : (
                              <ResumeEducationSection
                                education={resume.education}
                                onUpdate={(updatedEducation) =>
                                  updateResumeLocally({ education: updatedEducation })
                                }
                              />
                            )}
                          </div>
                        </SortableContext>
                      </div>
                    )}

                    {/* Skills Section */}
                    {currentTab === "skills" && (
                      <div className="cosmic-card p-6 mb-6">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-xl font-semibold text-blue-300">
                            Skills
                          </h2>
                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={toggleSkillsDisplayMode}
                              className="bg-blue-900/20 border-blue-800/30 text-blue-300 hover:bg-blue-900/30 hover:text-blue-200"
                            >
                              {resume.skillsDisplayMode === "bubbles" ? (
                                <>
                                  <ListFilter className="h-4 w-4 mr-2" />
                                  Switch to Bullets
                                </>
                              ) : (
                                <>
                                  <CircleDot className="h-4 w-4 mr-2" />
                                  Switch to Bubbles
                                </>
                              )}
                            </Button>
                            <CosmicButton
                              variant="primary"
                              size="sm"
                              onClick={addSkill}
                              iconLeft={<PlusCircle className="h-4 w-4" />}
                            >
                              Add Skill
                            </CosmicButton>
                          </div>
                        </div>
                        
                        <SortableContext
                          items={resume.skills.map(skill => skill.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-6">
                            {resume.skills.length === 0 ? (
                              <div className="text-center py-6 text-gray-400">
                                <Code className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                                <p className="mb-2">No skills added yet</p>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={addSkill}
                                  className="bg-blue-900/20 border-blue-800/30 text-blue-300 hover:bg-blue-900/30 hover:text-blue-200"
                                >
                                  <PlusCircle className="h-4 w-4 mr-2" />
                                  Add your first skill
                                </Button>
                              </div>
                            ) : (
                              <ResumeSkillsSection
                                skills={resume.skills}
                                onUpdate={(updatedSkills) =>
                                  updateResumeLocally({ skills: updatedSkills })
                                }
                              />
                            )}
                          </div>
                        </SortableContext>
                        
                        {resume.skills.length > 0 && (
                          <div className="mt-6 border-t border-blue-900/30 pt-4">
                            <div className="flex items-center gap-2 mb-4">
                              <Lightbulb className="h-4 w-4 text-yellow-400" />
                              <h3 className="text-sm font-medium text-blue-300">
                                AI-Powered Skill Suggestions
                              </h3>
                            </div>
                            <SkillSuggestions
                              resumeId={resumeId || "temp"}
                              jobTitle={resume.personalInfo.headline}
                              onApply={(skill) => {
                                const newSkill: SkillItem = {
                                  id: crypto.randomUUID(),
                                  name: skill,
                                  proficiency: 85
                                };
                                
                                updateResumeLocally({ 
                                  skills: [...resume.skills, newSkill] 
                                });
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Projects Section */}
                    {currentTab === "projects" && (
                      <div className="cosmic-card p-6 mb-6">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-xl font-semibold text-blue-300">
                            Projects
                          </h2>
                          <CosmicButton
                            variant="primary"
                            size="sm"
                            onClick={addProject}
                            iconLeft={<PlusCircle className="h-4 w-4" />}
                          >
                            Add Project
                          </CosmicButton>
                        </div>
                        
                        <SortableContext
                          items={resume.projects.map(proj => proj.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-6">
                            {resume.projects.length === 0 ? (
                              <div className="text-center py-6 text-gray-400">
                                <Package className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                                <p className="mb-2">No projects added yet</p>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={addProject}
                                  className="bg-blue-900/20 border-blue-800/30 text-blue-300 hover:bg-blue-900/30 hover:text-blue-200"
                                >
                                  <PlusCircle className="h-4 w-4 mr-2" />
                                  Add your first project
                                </Button>
                              </div>
                            ) : (
                              <ResumeProjectsSection
                                projects={resume.projects}
                                onUpdate={(updatedProjects) =>
                                  updateResumeLocally({ projects: updatedProjects })
                                }
                              />
                            )}
                          </div>
                        </SortableContext>
                      </div>
                    )}

                    {/* Optional overlay for drag and drop */}
                    <DragOverlay>
                      {activeDragId && draggedItemType === "experience" && (
                        <div className="cosmic-card p-4 bg-blue-900/50 border-blue-600/50 w-full opacity-80">
                          {resume.experience.find(exp => exp.id === activeDragId)?.title || "Experience item"}
                        </div>
                      )}
                      {activeDragId && draggedItemType === "education" && (
                        <div className="cosmic-card p-4 bg-blue-900/50 border-blue-600/50 w-full opacity-80">
                          {resume.education.find(edu => edu.id === activeDragId)?.degree || "Education item"}
                        </div>
                      )}
                      {activeDragId && draggedItemType === "skills" && (
                        <div className="cosmic-card p-4 bg-blue-900/50 border-blue-600/50 w-full opacity-80">
                          {resume.skills.find(skill => skill.id === activeDragId)?.name || "Skill item"}
                        </div>
                      )}
                      {activeDragId && draggedItemType === "projects" && (
                        <div className="cosmic-card p-4 bg-blue-900/50 border-blue-600/50 w-full opacity-80">
                          {resume.projects.find(proj => proj.id === activeDragId)?.title || "Project item"}
                        </div>
                      )}
                    </DragOverlay>
                  </DndContext>
                </div>

                {/* Right column: AI Assistant */}
                {showAIAssistant && (
                  <div className="lg:col-span-4 xl:col-span-5">
                    <div className="sticky top-24">
                      <AIAssistant
                        resumeId={resumeId || "temp"}
                        resume={resume}
                        activeTab={currentTab}
                        onApplySummary={(summary) => updatePersonalInfo("summary", summary)}
                        onApplyBulletPoint={(bulletPoint) => {
                          // Add bullet point to most recent experience
                          if (resume.experience.length > 0) {
                            const updatedExperiences = [...resume.experience];
                            const latestExp = updatedExperiences[0];
                            latestExp.description = latestExp.description 
                              ? `${latestExp.description}\n• ${bulletPoint}` 
                              : `• ${bulletPoint}`;
                            updateResumeLocally({ experience: updatedExperiences });
                          }
                        }}
                        onApplySkill={(skill) => {
                          const newSkill: SkillItem = {
                            id: crypto.randomUUID(),
                            name: skill,
                            proficiency: 85
                          };
                          updateResumeLocally({ skills: [...resume.skills, newSkill] });
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Define Resume type for TypeScript
export interface Resume {
  id?: string;
  title: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    headline: string;
    summary: string;
  };
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  template: string;
  skillsDisplayMode?: 'bubbles' | 'bullets';
}