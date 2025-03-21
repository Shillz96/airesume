import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import ResumeTips from "@/components/resume-tips";
import Navbar from "@/components/navbar";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { 
  Download, Loader2, Plus, Minus, Maximize2, FileText, 
  Check, Zap, EyeOff, Eye, FileImage, X, Move,
  GraduationCap, Briefcase, Code, Award, FolderKanban,
  FolderOpen, Save, Upload, Cpu, ChevronDown, User,
  Sparkles, RefreshCw, Printer, ChevronLeft, ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ResumeTemplate, {
  ProfessionalTemplate,
  CreativeTemplate,
  ExecutiveTemplate,
  ModernTemplate,
  MinimalTemplate,
  IndustryTemplate,
  BoldTemplate,
  TemplatePreviewProfessional,
  TemplatePreviewCreative,
  TemplatePreviewExecutive,
  TemplatePreviewModern,
  TemplatePreviewMinimal,
  TemplatePreviewIndustry,
  TemplatePreviewBold,
} from "@/components/resume-template";
import {
  ResumeExperienceSection,
  ResumeEducationSection,
  ResumeSkillsSection,
  ResumeProjectsSection,
  ExperienceItem,
  EducationItem,
  SkillItem,
  ProjectItem,
} from "@/components/resume-section";
import { Resume } from "@/components/resume-template";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CosmicButton } from "@/components/cosmic-button";
import RichTextEditor from "@/components/rich-text-editor";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Import refactored component files
import SummarySuggestions from "@/components/resume/summary-suggestions";
import ExperienceSuggestions from "@/components/resume/experience-suggestions";
import SkillSuggestions from "@/components/resume/skills-suggestions";
import ResumePreviewComponent from "@/components/resume/resume-preview";
import ResumeUpload from "@/components/resume/resume-upload";

import AIAssistant from "@/components/ai-assistant";
import CosmicBackground from "@/components/cosmic-background";

/**
 * The main Resume Builder page component
 * Allows users to create and edit resumes with sections for personal info, experience, education, skills, and projects
 * Includes AI-powered suggestions and template switching
 */
export default function ResumeBuilder() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showPersonalInfo, setShowPersonalInfo] = useState(true);
  const [currentTab, setCurrentTab] = useState("contact");
  const resumeContentRef = useRef<HTMLDivElement>(null);
  const { id: resumeId } = useParams<{ id: string }>();
  const history = useLocation()[1];

  const printTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize empty resume data
  const [resume, setResume] = useState<Resume>({
    id: '',
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
    template: 'professional',
    skillsDisplayMode: 'bubbles',
    sectionOrder: ['experience', 'education', 'skills', 'projects'], // Default section order
  });

  // Optimistically update resume in UI
  const updateResumeLocally = (updates: Partial<Resume>) => {
    setResume((prev) => ({ ...prev, ...updates }));
  };

  // Resume save mutation
  const saveResumeMutation = useMutation({
    mutationFn: async (resumeData: Resume) => {
      setIsLoading(true);
      try {
        // If we have an ID, update the existing resume
        if (resumeId && resumeId !== 'new') {
          const res = await apiRequest('PATCH', `/api/resumes/${resumeId}`, resumeData);
          return res.json();
        } 
        // Otherwise create a new resume
        else {
          const res = await apiRequest('POST', '/api/resumes', resumeData);
          return res.json();
        }
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: (data) => {
      if (data.id && resumeId === 'new') {
        // Navigate to the edit page for the newly created resume
        toast({
          title: 'Resume created successfully',
          description: 'Your resume has been saved.',
        });
        history(`/resume-builder/${data.id}`);
      } else {
        toast({
          title: 'Resume saved successfully',
          description: 'Your changes have been saved.',
        });
      }
      queryClient.invalidateQueries({ queryKey: ['/api/resumes'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error saving resume',
        description: error.message || 'An error occurred while saving your resume.',
        variant: 'destructive',
      });
    },
  });

  // Load resume data if editing an existing resume
  const { isLoading: isLoadingResume } = useQuery({
    queryKey: ['/api/resumes', resumeId],
    queryFn: async () => {
      if (resumeId === 'new') {
        // For new resumes, check for session data first
        try {
          const sessionDataStr = localStorage.getItem('resumeBuilderSessionData');
          if (sessionDataStr) {
            const sessionData = JSON.parse(sessionDataStr);
            
            // Only restore session data for new resumes
            if (sessionData.resumeId === 'new' && sessionData.resume) {
              console.log('Found session data for new resume, restoring state');
              
              // Ensure we have all required properties
              const resumeData = {
                ...sessionData.resume,
                experience: sessionData.resume.experience || [],
                education: sessionData.resume.education || [],
                skills: sessionData.resume.skills || [],
                projects: sessionData.resume.projects || [],
                template: sessionData.resume.template || 'professional',
                skillsDisplayMode: sessionData.resume.skillsDisplayMode || 'bubbles',
                sectionOrder: sessionData.resume.sectionOrder || ['experience', 'education', 'skills', 'projects'],
              };
              
              // Only restore if there's actual content
              const hasContent = resumeData.experience.length > 0 || 
                resumeData.education.length > 0 || 
                resumeData.skills.length > 0 ||
                (resumeData.personalInfo?.firstName || resumeData.personalInfo?.summary);
              
              if (hasContent) {
                setResume(resumeData);
                
                toast({
                  title: 'Resume restored from session',
                  description: 'Your previous unsaved work has been loaded.',
                });
              }
            }
          }
        } catch (err) {
          console.error('Failed to load session data:', err);
        }
        return null;
      }
      
      // For existing resumes, fetch from server
      const res = await apiRequest('GET', `/api/resumes/${resumeId}`);
      const data = await res.json();
      
      if (data && data.id) {
        // Initialize empty arrays for sections that might be missing
        const resumeData = {
          ...data,
          experience: data.experience || [],
          education: data.education || [],
          skills: data.skills || [],
          projects: data.projects || [],
          template: data.template || 'professional',
          skillsDisplayMode: data.skillsDisplayMode || 'bubbles',
          sectionOrder: data.sectionOrder || ['experience', 'education', 'skills', 'projects'],
        };
        setResume(resumeData);
      }
      
      return data;
    },
    enabled: !!resumeId,
    onError: (error: Error) => {
      toast({
        title: 'Error loading resume',
        description: error.message || 'An error occurred while loading your resume.',
        variant: 'destructive',
      });
    },
  });
  
  // Save resume to localStorage whenever it changes
  useEffect(() => {
    // Don't save if it's the initial empty resume with no content
    const hasContent = resume.experience.length > 0 || 
      resume.education.length > 0 || 
      resume.skills.length > 0 || 
      resume.projects.length > 0 ||
      resume.personalInfo.firstName || 
      resume.personalInfo.lastName || 
      resume.personalInfo.summary;
      
    if (!hasContent) {
      return;
    }
    
    try {
      const sessionData = {
        resume,
        timestamp: new Date().toISOString(),
        resumeId
      };
      localStorage.setItem('resumeBuilderSessionData', JSON.stringify(sessionData));
      console.log('Resume automatically saved to session storage');
    } catch (err) {
      console.error('Failed to save resume to session storage:', err);
    }
  }, [resume, resumeId]);

  // Handle adding a new experience entry
  const handleAddExperience = () => {
    const newExperience: ExperienceItem = {
      id: crypto.randomUUID(),
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    
    setResume({
      ...resume,
      experience: [...resume.experience, newExperience],
    });
  };

  // Handle adding a new education entry
  const handleAddEducation = () => {
    const newEducation: EducationItem = {
      id: crypto.randomUUID(),
      degree: '',
      institution: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    
    setResume({
      ...resume,
      education: [...resume.education, newEducation],
    });
  };

  // Handle adding a new skill
  const handleAddSkill = (skillName: string) => {
    // Check if skill already exists
    const skillExists = resume.skills.some(
      (s) => s.name.toLowerCase() === skillName.toLowerCase()
    );
    
    if (skillExists) {
      toast({
        title: 'Skill already exists',
        description: 'This skill is already in your resume.',
      });
      return;
    }
    
    const newSkill: SkillItem = {
      id: crypto.randomUUID(),
      name: skillName,
      proficiency: 85,
    };
    
    setResume({
      ...resume,
      skills: [...resume.skills, newSkill],
    });
  };

  // Handle adding a new project
  const handleAddProject = () => {
    const newProject: ProjectItem = {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      technologies: [],
    };
    
    setResume({
      ...resume,
      projects: [...resume.projects, newProject],
    });
  };

  // Update the resume when sections are changed by their respective components
  const handleExperienceUpdate = (experiences: ExperienceItem[]) => {
    setResume({ ...resume, experience: experiences });
  };

  const handleEducationUpdate = (education: EducationItem[]) => {
    setResume({ ...resume, education });
  };

  const handleSkillsUpdate = (skills: SkillItem[]) => {
    setResume({ ...resume, skills });
  };

  const handleProjectsUpdate = (projects: ProjectItem[]) => {
    setResume({ ...resume, projects });
  };

  // Handle drag and drop reordering of sections
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    // Skip if item didn't move
    if (sourceIndex === destinationIndex) return;
    
    const updatedResume = { ...resume };
    
    // Handle main section reordering (changing the order of entire sections)
    if (result.type === 'main-section') {
      const newSectionOrder = [...(updatedResume.sectionOrder || ['experience', 'education', 'skills', 'projects'])];
      const [removed] = newSectionOrder.splice(sourceIndex, 1);
      newSectionOrder.splice(destinationIndex, 0, removed);
      updatedResume.sectionOrder = newSectionOrder;
      
      toast({
        title: "Sections reordered",
        description: "The order of your resume sections has been updated.",
      });
    }
    // Handle reordering for items within different section types
    else if (result.type === 'experience') {
      const items = [...updatedResume.experience];
      const [removed] = items.splice(sourceIndex, 1);
      items.splice(destinationIndex, 0, removed);
      updatedResume.experience = items;
    } else if (result.type === 'education') {
      const items = [...updatedResume.education];
      const [removed] = items.splice(sourceIndex, 1);
      items.splice(destinationIndex, 0, removed);
      updatedResume.education = items;
    } else if (result.type === 'skills') {
      const items = [...updatedResume.skills];
      const [removed] = items.splice(sourceIndex, 1);
      items.splice(destinationIndex, 0, removed);
      updatedResume.skills = items;
    } else if (result.type === 'projects') {
      const items = [...updatedResume.projects];
      const [removed] = items.splice(sourceIndex, 1);
      items.splice(destinationIndex, 0, removed);
      updatedResume.projects = items;
    }
    
    setResume(updatedResume);
  };

  // Save resume function
  const handleSaveResume = () => {
    saveResumeMutation.mutate(resume);
  };

  // Generate a printable HTML version of the resume for downloading
  function generatePrintableHTML(resumeData: Resume): string {
    // Determine which template to use
    let templateContent;
    switch (resumeData.template) {
      case 'creative':
        templateContent = `<div id="resume-template-creative">${document.getElementById('resume-preview')?.innerHTML || ''}</div>`;
        break;
      case 'executive':
        templateContent = `<div id="resume-template-executive">${document.getElementById('resume-preview')?.innerHTML || ''}</div>`;
        break;
      case 'modern':
        templateContent = `<div id="resume-template-modern">${document.getElementById('resume-preview')?.innerHTML || ''}</div>`;
        break;
      case 'minimal':
        templateContent = `<div id="resume-template-minimal">${document.getElementById('resume-preview')?.innerHTML || ''}</div>`;
        break;
      case 'industry':
        templateContent = `<div id="resume-template-industry">${document.getElementById('resume-preview')?.innerHTML || ''}</div>`;
        break;
      case 'bold':
        templateContent = `<div id="resume-template-bold">${document.getElementById('resume-preview')?.innerHTML || ''}</div>`;
        break;
      case 'professional':
      default:
        templateContent = `<div id="resume-template-professional">${document.getElementById('resume-preview')?.innerHTML || ''}</div>`;
        break;
    }

    // Create the full HTML document with styling
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${resumeData.title || 'Resume'}</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            
            body {
              font-family: 'Inter', sans-serif;
              margin: 0;
              padding: 0;
              background: white;
              color: #374151;
              font-size: 10pt;
              line-height: 1.4;
            }
            
            * {
              box-sizing: border-box;
            }
            
            h1, h2, h3, h4, h5, h6 {
              margin-top: 0;
              font-weight: 600;
              color: #111827;
            }
            
            h1 {
              font-size: 18pt;
              margin-bottom: 4pt;
            }
            
            h2 {
              font-size: 14pt;
              margin-bottom: 4pt;
              color: #1f2937;
            }
            
            h3 {
              font-size: 12pt;
              margin-bottom: 2pt;
            }
            
            h4 {
              font-size: 11pt;
              margin-bottom: 2pt;
            }
            
            p {
              margin: 0 0 8pt;
            }
            
            a {
              color: #2563eb;
              text-decoration: none;
            }
            
            ul, ol {
              margin-top: 0;
              padding-left: 16pt;
            }
            
            li {
              margin-bottom: 2pt;
            }
            
            .skill-tag {
              display: inline-block;
              background: #e5e7eb;
              border-radius: 4pt;
              padding: 2pt 6pt;
              margin-right: 4pt;
              margin-bottom: 4pt;
              font-size: 9pt;
            }
            
            .page {
              width: 8.5in;
              height: 11in;
              padding: 0.5in;
              box-shadow: none;
              background: white;
              position: relative;
              page-break-after: always;
            }
            
            .section {
              margin-bottom: 12pt;
            }
            
            .section-title {
              margin-bottom: 6pt;
              font-weight: 600;
              font-size: 12pt;
              color: #1f2937;
              border-bottom: 1pt solid #e5e7eb;
              padding-bottom: 2pt;
            }
            
            .header {
              margin-bottom: 16pt;
              text-align: center;
            }
            
            .name {
              font-size: 18pt;
              font-weight: 700;
              margin-bottom: 2pt;
              color: #111827;
            }
            
            .contact-info {
              display: flex;
              justify-content: center;
              flex-wrap: wrap;
              gap: 8pt;
              margin-bottom: 8pt;
              font-size: 9pt;
            }
            
            .contact-item {
              display: inline-flex;
              align-items: center;
            }
            
            .summary {
              margin-bottom: 16pt;
              text-align: center;
              font-size: 10pt;
              color: #4b5563;
              max-width: 80%;
              margin-left: auto;
              margin-right: auto;
            }
            
            .item {
              margin-bottom: 10pt;
            }
            
            .item-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 2pt;
            }
            
            .item-title {
              font-weight: 600;
              font-size: 11pt;
              color: #111827;
            }
            
            .item-subtitle {
              font-weight: 500;
              font-size: 10pt;
              color: #4b5563;
            }
            
            .item-date {
              font-size: 9pt;
              color: #6b7280;
              white-space: nowrap;
            }
            
            .item-content {
              font-size: 10pt;
              color: #4b5563;
            }
            
            .skills-container {
              display: flex;
              flex-wrap: wrap;
              gap: 4pt;
              margin-bottom: 12pt;
            }
            
            /* Template-specific styling */
            #resume-template-modern .header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              text-align: left;
              padding-bottom: 10pt;
              border-bottom: 2pt solid #3b82f6;
            }
            
            #resume-template-modern .name {
              font-size: 20pt;
              margin-bottom: 0;
            }
            
            #resume-template-modern .contact-info {
              justify-content: flex-start;
              flex-direction: column;
              align-items: flex-end;
              gap: 2pt;
            }
            
            #resume-template-modern .section-title {
              border-bottom: none;
              color: #3b82f6;
              font-size: 12pt;
            }
            
            #resume-template-executive .header {
              text-align: left;
              border-bottom: 3pt double #111827;
              padding-bottom: 10pt;
              margin-bottom: 20pt;
            }
            
            #resume-template-executive .name {
              font-size: 20pt;
              text-transform: uppercase;
              letter-spacing: 1pt;
            }
            
            #resume-template-executive .contact-info {
              justify-content: flex-start;
              gap: 16pt;
            }
            
            #resume-template-executive .section-title {
              font-size: 14pt;
              text-transform: uppercase;
              letter-spacing: 1pt;
              border-bottom: 1pt solid #111827;
            }
            
            #resume-template-executive .summary {
              text-align: left;
              max-width: 100%;
              font-style: italic;
            }
            
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
              
              .page {
                box-shadow: none;
                margin: 0;
                padding: 0.5in;
                width: 8.5in;
                height: 11in;
              }
            }
          </style>
        </head>
        <body>
          <div class="page">
            ${templateContent}
          </div>
        </body>
      </html>
    `;
  }

  // Handle downloading the resume
  const handleDownloadResume = () => {
    const title = resume.title || 'resume';
    const fileName = `${title.replace(/\s+/g, '_').toLowerCase()}.pdf`;
    
    // First make sure to save any pending changes
    if (resumeId !== 'new') {
      saveResumeMutation.mutate(resume);
    }

    try {
      // If we have a valid resumeId, use the server-side PDF generation
      if (resumeId && resumeId !== 'new') {
        window.open(`/api/resumes/${resumeId}/download?filename=${fileName}`, '_blank');
      } else {
        // Otherwise use client-side HTML generation and browser print dialog
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(generatePrintableHTML(resume));
          printWindow.document.close();
          
          // Allow time for styles to load, then print
          if (printTimeoutRef.current) {
            clearTimeout(printTimeoutRef.current);
          }
          
          printTimeoutRef.current = setTimeout(() => {
            printWindow.print();
            // printWindow.close();
          }, 500);
        } else {
          toast({
            title: 'Popup blocked',
            description: 'Please allow popups for this site to download your resume.',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast({
        title: 'Error downloading resume',
        description: 'An error occurred while downloading your resume. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Handle template change
  const handleTemplateChange = (template: string) => {
    setResume({ ...resume, template });
    // Save template choice if we're editing an existing resume
    if (resumeId && resumeId !== 'new') {
      const templateUpdate = { ...resume, template };
      saveResumeMutation.mutate(templateUpdate);
    }
  };

  // Toggle between edit and preview modes
  const togglePreviewMode = () => {
    setShowPreview(!showPreview);
  };

  // Toggle skills display mode (bubbles or bullets)
  const toggleSkillsDisplay = () => {
    const newMode = resume.skillsDisplayMode === 'bubbles' ? 'bullets' : 'bubbles';
    setResume({ ...resume, skillsDisplayMode: newMode });
    
    // Show feedback toast
    toast({
      title: `Skills now displaying as ${newMode}`,
      description: `Your skills will be displayed as ${newMode} in the resume.`,
    });
  };
  
  // Kept for backward compatibility with the sidebar display toggle
  const toggleSkillsDisplayMode = toggleSkillsDisplay;
  
  // Smart adjust resume content to fit optimally on page(s)
  const handleSmartAdjust = () => {
    console.log("Smart Adjust triggered");
    
    // Immediate feedback to show processing has started
    toast({
      title: "Smart Adjust Started",
      description: "Processing your resume...",
    });
    
    // Create a copy of resume to work with
    const resumeCopy = { ...resume };
    let contentAdjusted = false;
    
    // 1. Adjust experience descriptions in a single update
    const adjustedExperience = resumeCopy.experience.map(exp => {
      // If description is too long, truncate it
      if (exp.description && exp.description.length > 500) {
        contentAdjusted = true;
        // Make each bullet point shorter if possible
        let newDescription = exp.description;
        
        // If it has bullet points, shorten each one
        if (exp.description.includes('•')) {
          const bullets = exp.description.split('•').filter(Boolean);
          newDescription = bullets
            .map(bullet => {
              // Trim and shorten long bullet points
              const trimmed = bullet.trim();
              return trimmed.length > 100 ? 
                `• ${trimmed.substring(0, 95)}...` : 
                `• ${trimmed}`;
            })
            .join('\n');
        } else {
          // Just trim the whole description
          newDescription = exp.description.substring(0, 490) + '...';
        }
        
        return {
          ...exp,
          description: newDescription
        };
      }
      return exp;
    });
    
    // 2. Adjust education descriptions
    const adjustedEducation = resumeCopy.education.map(edu => {
      if (edu.description && edu.description.length > 300) {
        contentAdjusted = true;
        return {
          ...edu,
          description: edu.description.substring(0, 290) + '...'
        };
      }
      return edu;
    });
    
    // 3. Prioritize skills by proficiency
    let adjustedSkills = [...resumeCopy.skills];
    if (adjustedSkills.length > 10) {
      contentAdjusted = true;
      // Sort skills by proficiency and take the top skills
      adjustedSkills = adjustedSkills
        .sort((a, b) => b.proficiency - a.proficiency)
        .slice(0, 10);
    }
    
    // 4. Truncate lengthy summaries
    let adjustedPersonalInfo = { ...resumeCopy.personalInfo };
    if (adjustedPersonalInfo.summary && adjustedPersonalInfo.summary.length > 600) {
      contentAdjusted = true;
      adjustedPersonalInfo = {
        ...adjustedPersonalInfo,
        summary: adjustedPersonalInfo.summary.substring(0, 590) + '...'
      };
    }
    
    // Apply all changes at once to minimize re-renders
    const adjustedResume = {
      ...resumeCopy,
      experience: adjustedExperience,
      education: adjustedEducation,
      skills: adjustedSkills,
      personalInfo: adjustedPersonalInfo
    };
    
    // Update the state with all changes
    if (contentAdjusted) {
      setResume(adjustedResume);
      // Show success feedback
      toast({
        title: "Smart Adjust Complete",
        description: "Your resume has been optimized for better page fit.",
      });
    } else {
      // No changes needed
      toast({
        title: "Resume Already Optimized",
        description: "Your resume content is already well-balanced.",
        variant: "default"
      });
    }
  };
  
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

  return (
    <div className="min-h-screen bg-[#050A24] text-gray-100 flex flex-col">
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
          <div className="flex flex-col xl:flex-row gap-6">
            {/* Left sidebar with resume sections navigation */}
            <div className="xl:w-64 shrink-0">
              <div className="bg-[rgba(10,15,40,0.5)] backdrop-blur-sm rounded-lg border border-indigo-900/30 p-4 sticky top-24">
                <h3 className="text-lg font-medium mb-4 text-blue-300">Resume Sections</h3>
                <div className="space-y-2">
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
                    <FolderKanban className="mr-2 h-4 w-4" />
                    Projects
                    {resume.projects.length > 0 && (
                      <Badge className="ml-auto bg-blue-700">{resume.projects.length}</Badge>
                    )}
                  </Button>
                </div>

                <div className="mt-6 pt-4 border-t border-indigo-900/30">
                  <h3 className="text-sm font-medium mb-2 text-blue-300">Template</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between bg-[rgba(30,40,80,0.5)] border-blue-800/20 text-blue-300">
                        <span className="capitalize">{resume.template}</span>
                        <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-[rgba(20,30,60,0.95)] backdrop-blur-md border-blue-900/40">
                      <DropdownMenuLabel className="text-gray-400">Choose Template</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-blue-900/40" />
                      <DropdownMenuItem
                        className={cn(
                          "flex items-center gap-2 cursor-pointer",
                          resume.template === "professional" && "bg-blue-600/20 text-blue-200"
                        )}
                        onClick={() => handleTemplateChange("professional")}
                      >
                        <div className="w-4 h-4 bg-blue-600 rounded-sm" />
                        Professional
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={cn(
                          "flex items-center gap-2 cursor-pointer",
                          resume.template === "modern" && "bg-blue-600/20 text-blue-200"
                        )}
                        onClick={() => handleTemplateChange("modern")}
                      >
                        <div className="w-4 h-4 bg-indigo-500 rounded-sm" />
                        Modern
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={cn(
                          "flex items-center gap-2 cursor-pointer",
                          resume.template === "minimal" && "bg-blue-600/20 text-blue-200"
                        )}
                        onClick={() => handleTemplateChange("minimal")}
                      >
                        <div className="w-4 h-4 bg-gray-500 rounded-sm" />
                        Minimal
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={cn(
                          "flex items-center gap-2 cursor-pointer",
                          resume.template === "creative" && "bg-blue-600/20 text-blue-200"
                        )}
                        onClick={() => handleTemplateChange("creative")}
                      >
                        <div className="w-4 h-4 bg-purple-500 rounded-sm" />
                        Creative
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={cn(
                          "flex items-center gap-2 cursor-pointer",
                          resume.template === "executive" && "bg-blue-600/20 text-blue-200"
                        )}
                        onClick={() => handleTemplateChange("executive")}
                      >
                        <div className="w-4 h-4 bg-slate-900 rounded-sm" />
                        Executive
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={cn(
                          "flex items-center gap-2 cursor-pointer",
                          resume.template === "industry" && "bg-blue-600/20 text-blue-200"
                        )}
                        onClick={() => handleTemplateChange("industry")}
                      >
                        <div className="w-4 h-4 bg-cyan-600 rounded-sm" />
                        Industry
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={cn(
                          "flex items-center gap-2 cursor-pointer",
                          resume.template === "bold" && "bg-blue-600/20 text-blue-200"
                        )}
                        onClick={() => handleTemplateChange("bold")}
                      >
                        <div className="w-4 h-4 bg-amber-600 rounded-sm" />
                        Bold
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Skills display toggle moved to preview component */}

                  <div className="mt-6">
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      onClick={handleDownloadResume}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main editing area */}
            <div className="flex-1 flex flex-col-reverse xl:flex-row gap-6">
              {/* Resume form */}
              <div className="flex-1">
                {/* Only show upload option for new resumes */}
                {resumeId === 'new' && !resume.experience.length && !resume.education.length && !resume.skills.length && (
                  <div className="mb-6">
                    <ResumeUpload onUploadSuccess={handleResumeUpload} />
                  </div>
                )}
                <div className="bg-[rgba(10,15,40,0.5)] backdrop-blur-sm rounded-lg border border-indigo-900/30 p-5">
                  {/* Personal Info Section */}
                  {showPersonalInfo && (
                    <Tabs 
                      defaultValue={currentTab} 
                      value={currentTab}
                      onValueChange={value => setCurrentTab(value)}
                      className="w-full"
                    >
                      <TabsList className="grid grid-cols-2 mb-4">
                        <TabsTrigger value="contact" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                          Contact Information
                        </TabsTrigger>
                        <TabsTrigger value="summary" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                          Professional Summary
                        </TabsTrigger>
                      </TabsList>

                      {/* Contact Information Tab */}
                      <TabsContent value="contact" className="space-y-4 mt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={resume.personalInfo.firstName || ''}
                              onChange={(e) =>
                                updateResumeLocally({
                                  personalInfo: { ...resume.personalInfo, firstName: e.target.value },
                                })
                              }
                              placeholder="John"
                              className="bg-[rgba(30,40,80,0.4)] border-blue-900/30 focus:border-blue-500 text-gray-200"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={resume.personalInfo.lastName || ''}
                              onChange={(e) =>
                                updateResumeLocally({
                                  personalInfo: { ...resume.personalInfo, lastName: e.target.value },
                                })
                              }
                              placeholder="Doe"
                              className="bg-[rgba(30,40,80,0.4)] border-blue-900/30 focus:border-blue-500 text-gray-200"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="headline">Professional Headline</Label>
                          <Input
                            id="headline"
                            value={resume.personalInfo.headline || ''}
                            onChange={(e) =>
                              updateResumeLocally({
                                personalInfo: { ...resume.personalInfo, headline: e.target.value },
                              })
                            }
                            placeholder="Senior Software Engineer | Full Stack Developer | JavaScript Expert"
                            className="bg-[rgba(30,40,80,0.4)] border-blue-900/30 focus:border-blue-500 text-gray-200"
                          />
                          <p className="text-xs text-gray-400">
                            A brief tagline that appears under your name
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={resume.personalInfo.email || ''}
                              onChange={(e) =>
                                updateResumeLocally({
                                  personalInfo: { ...resume.personalInfo, email: e.target.value },
                                })
                              }
                              placeholder="john.doe@example.com"
                              className="bg-[rgba(30,40,80,0.4)] border-blue-900/30 focus:border-blue-500 text-gray-200"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={resume.personalInfo.phone || ''}
                              onChange={(e) =>
                                updateResumeLocally({
                                  personalInfo: { ...resume.personalInfo, phone: e.target.value },
                                })
                              }
                              placeholder="(123) 456-7890"
                              className="bg-[rgba(30,40,80,0.4)] border-blue-900/30 focus:border-blue-500 text-gray-200"
                            />
                          </div>
                        </div>

                        <Button 
                          onClick={() => setCurrentTab('summary')}
                          className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          Continue to Summary
                        </Button>
                      </TabsContent>

                      {/* Professional Summary Tab */}
                      <TabsContent value="summary" className="space-y-4 mt-2">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label htmlFor="summary">Professional Summary</Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 gap-1 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
                              onClick={() =>
                                updateResumeLocally({
                                  personalInfo: { ...resume.personalInfo, summary: "" },
                                })
                              }
                            >
                              <X className="h-3 w-3" />
                              Clear
                            </Button>
                          </div>
                          <Textarea
                            id="summary"
                            value={resume.personalInfo.summary || ''}
                            onChange={(e) =>
                              updateResumeLocally({
                                personalInfo: { ...resume.personalInfo, summary: e.target.value },
                              })
                            }
                            placeholder="Experienced software engineer with a passion for developing innovative solutions that deliver exceptional user experiences..."
                            className="min-h-[120px] bg-[rgba(30,40,80,0.4)] border-blue-900/30 focus:border-blue-500 text-gray-200"
                          />
                          <p className="text-xs text-gray-400">
                            A concise overview of your professional background, skills, and career objectives
                          </p>
                        </div>

                        <div className="bg-[rgba(20,30,60,0.6)] border border-blue-900/30 rounded-lg p-4 mt-4">
                          <h3 className="text-sm font-medium text-blue-300 mb-1">AI-Powered Summary Suggestions</h3>
                          <p className="text-xs text-gray-400 mb-3">
                            Get professionally crafted summaries based on your resume content
                          </p>
                          
                          <SummarySuggestions
                            resumeId={resumeId || ""}
                            onApply={(summary) =>
                              updateResumeLocally({
                                personalInfo: { ...resume.personalInfo, summary },
                              })
                            }
                          />
                        </div>

                        <div className="flex justify-between mt-4">
                          <Button 
                            onClick={() => setCurrentTab('contact')}
                            variant="outline"
                            className="border-blue-800/30 text-blue-300 hover:bg-blue-900/30 hover:text-blue-200"
                          >
                            Back to Contact Info
                          </Button>
                          <Button 
                            onClick={() => {
                              setCurrentTab('experience');
                              setShowPersonalInfo(false);
                            }}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            Continue to Experience
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  )}

                  {/* Experience Section */}
                  {currentTab === "experience" && !showPersonalInfo && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-blue-300 flex items-center gap-2">
                          <Briefcase className="h-5 w-5" />
                          Work Experience
                        </h2>
                        <Button
                          onClick={handleAddExperience}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Experience
                        </Button>
                      </div>

                      {resume.experience.length === 0 ? (
                        <div className="text-center py-8 border border-dashed border-blue-900/40 rounded-lg bg-blue-950/20">
                          <Briefcase className="h-10 w-10 text-blue-800/60 mx-auto mb-3" />
                          <h3 className="text-lg font-medium text-blue-300 mb-1">No work experience added yet</h3>
                          <p className="text-gray-400 text-sm max-w-md mx-auto mb-4">
                            Add your work history to highlight your professional accomplishments and career progression
                          </p>
                          <Button
                            onClick={handleAddExperience}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Experience
                          </Button>
                        </div>
                      ) : (
                        <DragDropContext onDragEnd={handleDragEnd}>
                          <Droppable droppableId="experience" type="experience">
                            {(provided) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="space-y-4"
                              >
                                <ResumeExperienceSection
                                  experiences={resume.experience}
                                  onUpdate={handleExperienceUpdate}
                                />
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>
                      )}

                      {resume.experience.length > 0 && (
                        <div className="bg-[rgba(20,30,60,0.6)] border border-blue-900/30 rounded-lg p-4 mt-6">
                          <h3 className="text-sm font-medium text-blue-300 mb-1">AI-Powered Experience Suggestions</h3>
                          <p className="text-xs text-gray-400 mb-3">
                            Get ATS-optimized bullet points for your experience section
                          </p>
                          
                          <ExperienceSuggestions
                            resumeId={resumeId || ""}
                            jobTitle={resume.experience[0]?.title}
                            onApply={(bulletPoint) => {
                              // Add the bullet point to the first experience entry
                              if (resume.experience.length > 0) {
                                const updatedExperiences = [...resume.experience];
                                const firstExp = { ...updatedExperiences[0] };
                                firstExp.description = firstExp.description
                                  ? `${firstExp.description}\n• ${bulletPoint}`
                                  : `• ${bulletPoint}`;
                                updatedExperiences[0] = firstExp;
                                handleExperienceUpdate(updatedExperiences);
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Education Section */}
                  {currentTab === "education" && !showPersonalInfo && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-blue-300 flex items-center gap-2">
                          <GraduationCap className="h-5 w-5" />
                          Education
                        </h2>
                        <Button
                          onClick={handleAddEducation}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Education
                        </Button>
                      </div>

                      {resume.education.length === 0 ? (
                        <div className="text-center py-8 border border-dashed border-blue-900/40 rounded-lg bg-blue-950/20">
                          <GraduationCap className="h-10 w-10 text-blue-800/60 mx-auto mb-3" />
                          <h3 className="text-lg font-medium text-blue-300 mb-1">No education added yet</h3>
                          <p className="text-gray-400 text-sm max-w-md mx-auto mb-4">
                            Add your academic background to showcase your qualifications and credentials
                          </p>
                          <Button
                            onClick={handleAddEducation}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Education
                          </Button>
                        </div>
                      ) : (
                        <DragDropContext onDragEnd={handleDragEnd}>
                          <Droppable droppableId="education" type="education">
                            {(provided) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="space-y-4"
                              >
                                <ResumeEducationSection
                                  education={resume.education}
                                  onUpdate={handleEducationUpdate}
                                />
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>
                      )}
                    </div>
                  )}

                  {/* Skills Section */}
                  {currentTab === "skills" && !showPersonalInfo && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-blue-300 flex items-center gap-2">
                          <Code className="h-5 w-5" />
                          Skills
                        </h2>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="border-blue-900/30 text-blue-300 hover:bg-blue-900/30"
                            onClick={toggleSkillsDisplayMode}
                          >
                            Display: {resume.skillsDisplayMode === 'bubbles' ? 'Bubbles' : 'Bullets'}
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                <Plus className="h-4 w-4 mr-1" />
                                Add Skill
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[rgba(15,20,50,0.95)] backdrop-blur-lg border-blue-900/40 text-gray-200">
                              <DialogHeader>
                                <DialogTitle>Add a New Skill</DialogTitle>
                                <DialogDescription className="text-gray-400">
                                  Enter your skill name below. Use AI suggestions for industry-relevant skills.
                                </DialogDescription>
                              </DialogHeader>

                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="skillName">Skill Name</Label>
                                  <Input
                                    id="skillName"
                                    placeholder="e.g., React.js, Project Management"
                                    className="bg-[rgba(30,40,80,0.4)] border-blue-900/30"
                                  />
                                </div>
                              </div>

                              <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                  <Button variant="outline" className="border-blue-900/30">
                                    Cancel
                                  </Button>
                                </DialogClose>
                                <DialogClose asChild>
                                  <Button
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    onClick={() => {
                                      const input = document.getElementById("skillName") as HTMLInputElement;
                                      if (input && input.value.trim()) {
                                        handleAddSkill(input.value.trim());
                                      }
                                    }}
                                  >
                                    Add Skill
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>

                      {resume.skills.length === 0 ? (
                        <div className="text-center py-8 border border-dashed border-blue-900/40 rounded-lg bg-blue-950/20">
                          <Code className="h-10 w-10 text-blue-800/60 mx-auto mb-3" />
                          <h3 className="text-lg font-medium text-blue-300 mb-1">No skills added yet</h3>
                          <p className="text-gray-400 text-sm max-w-md mx-auto mb-4">
                            Add your technical and soft skills to highlight your capabilities and expertise
                          </p>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                <Plus className="h-4 w-4 mr-1" />
                                Add Skill
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[rgba(15,20,50,0.95)] backdrop-blur-lg border-blue-900/40 text-gray-200">
                              <DialogHeader>
                                <DialogTitle>Add a New Skill</DialogTitle>
                                <DialogDescription className="text-gray-400">
                                  Enter your skill name below. Use AI suggestions for industry-relevant skills.
                                </DialogDescription>
                              </DialogHeader>

                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="skillName">Skill Name</Label>
                                  <Input
                                    id="skillName"
                                    placeholder="e.g., React.js, Project Management"
                                    className="bg-[rgba(30,40,80,0.4)] border-blue-900/30"
                                  />
                                </div>
                              </div>

                              <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                  <Button variant="outline" className="border-blue-900/30">
                                    Cancel
                                  </Button>
                                </DialogClose>
                                <DialogClose asChild>
                                  <Button
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    onClick={() => {
                                      const input = document.getElementById("skillName") as HTMLInputElement;
                                      if (input && input.value.trim()) {
                                        handleAddSkill(input.value.trim());
                                      }
                                    }}
                                  >
                                    Add Skill
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      ) : (
                        <DragDropContext onDragEnd={handleDragEnd}>
                          <Droppable droppableId="skills" type="skills">
                            {(provided) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="space-y-4"
                              >
                                <ResumeSkillsSection
                                  skills={resume.skills}
                                  onUpdate={handleSkillsUpdate}
                                />
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>
                      )}

                      <div className="bg-[rgba(20,30,60,0.6)] border border-blue-900/30 rounded-lg p-4 mt-6">
                        <h3 className="text-sm font-medium text-blue-300 mb-1">AI-Powered Skills Suggestions</h3>
                        <p className="text-xs text-gray-400 mb-3">
                          Get industry-relevant skills to enhance your resume
                        </p>
                        
                        <SkillSuggestions
                          resumeId={resumeId || ""}
                          jobTitle={resume.personalInfo.headline}
                          onApply={handleAddSkill}
                        />
                      </div>
                    </div>
                  )}

                  {/* Projects Section */}
                  {currentTab === "projects" && !showPersonalInfo && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-blue-300 flex items-center gap-2">
                          <FolderKanban className="h-5 w-5" />
                          Projects
                        </h2>
                        <Button
                          onClick={handleAddProject}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Project
                        </Button>
                      </div>

                      {resume.projects.length === 0 ? (
                        <div className="text-center py-8 border border-dashed border-blue-900/40 rounded-lg bg-blue-950/20">
                          <FolderKanban className="h-10 w-10 text-blue-800/60 mx-auto mb-3" />
                          <h3 className="text-lg font-medium text-blue-300 mb-1">No projects added yet</h3>
                          <p className="text-gray-400 text-sm max-w-md mx-auto mb-4">
                            Showcase your personal or professional projects to demonstrate your capabilities
                          </p>
                          <Button
                            onClick={handleAddProject}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Project
                          </Button>
                        </div>
                      ) : (
                        <DragDropContext onDragEnd={handleDragEnd}>
                          <Droppable droppableId="projects" type="projects">
                            {(provided) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="space-y-4"
                              >
                                <ResumeProjectsSection
                                  projects={resume.projects}
                                  onUpdate={handleProjectsUpdate}
                                />
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* AI Assistant Sidebar */}
              <div className="w-full xl:w-72 shrink-0">
                <div className="sticky top-24">
                  <AIAssistant
                    resumeId={resumeId}
                    onApplySummary={(summary) =>
                      updateResumeLocally({
                        personalInfo: { ...resume.personalInfo, summary },
                      })
                    }
                    onApplyBulletPoint={(bulletPoint) => {
                      if (resume.experience.length > 0) {
                        const updatedExperiences = [...resume.experience];
                        const firstExp = { ...updatedExperiences[0] };
                        firstExp.description = firstExp.description
                          ? `${firstExp.description}\n• ${bulletPoint}`
                          : `• ${bulletPoint}`;
                        updatedExperiences[0] = firstExp;
                        handleExperienceUpdate(updatedExperiences);
                      }
                    }}
                    onApplySkill={handleAddSkill}
                    resume={resume}
                    activeTab={currentTab}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Utility function to get URL parameters
function useParams<T extends Record<string, string>>(): T {
  const [location] = useLocation();
  const params = {} as T;
  
  // Extract the path parameters
  const pathParts = location.split('/').filter(Boolean);
  if (pathParts.length > 1 && pathParts[0] === 'resume-builder') {
    params['id' as keyof T] = pathParts[1] as T[keyof T];
  } else {
    params['id' as keyof T] = 'new' as T[keyof T];
  }
  
  return params;
}