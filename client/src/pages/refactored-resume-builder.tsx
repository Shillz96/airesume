import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useResumeData, Resume } from '@/hooks/use-resume-data';
import { PersonalInfo } from '@/hooks/use-resume-data';

// Resume Section Components
import { PersonalInfoSection } from '@/components/resume/PersonalInfoSection';
import { ExperienceSection } from '@/components/resume/ExperienceSection';
import { EducationSection } from '@/components/resume/EducationSection';
import { SkillsSection } from '@/components/resume/SkillsSection';
import { ProjectsSection } from '@/components/resume/ProjectsSection';

// Resume Builder Components
import ResumeBuilderHeader from '@/components/resume-builder/ResumeBuilderHeader';
import ResumePreviewComponent from '@/components/resume-builder/ResumePreviewComponent';
import AIAssistantDialog from '@/components/resume-builder/AIAssistantDialog';
import TemplateSelector from '@/components/resume-builder/TemplateSelector';

// Icons
import {
  User,
  Briefcase,
  GraduationCap,
  Code,
  Folder,
  FileText,
  Sparkles,
} from 'lucide-react';

/**
 * ResumeBuilder is a comprehensive editor for creating and editing resumes.
 * It features section-by-section editing, AI assistance, and live preview.
 */
export default function ResumeBuilder() {
  // Resume data management
  const {
    resume,
    resumeId,
    activeSection,
    setActiveSection,
    isLoading,
    isDirty,
    updatePersonalInfo,
    updateExperienceList,
    updateEducationList,
    updateSkillsList,
    updateProjectsList,
    updateResumeTemplate,
    updateResumeTitle,
    saveResume
  } = useResumeData();
  
  const { toast } = useToast();
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [location] = useLocation();
  
  // Handle resume download
  const handleDownload = () => {
    // In a real implementation, this would generate a PDF
    toast({
      title: "Preparing Download",
      description: "Your resume is being prepared for download as PDF.",
    });
    // Download functionality would be implemented here
  };
  
  // Handle section tab change
  const handleSectionChange = (value: string) => {
    setActiveSection(value);
  };
  
  // Handle personal info updates
  const handlePersonalInfoUpdate = (field: keyof PersonalInfo, value: string) => {
    updatePersonalInfo(field, value);
  };
  
  // Handle AI suggestions for summary
  const handleApplySummary = (summary: string) => {
    updatePersonalInfo('summary', summary);
  };
  
  // Handle AI suggestions for bullet points
  const handleApplyBulletPoint = (bulletPoint: string) => {
    // This would need logic to append to the right experience item
    // For now, we'll just show a toast
    toast({
      title: "Bullet Point Added",
      description: "The bullet point has been added to your experience.",
    });
  };
  
  // Handle AI suggestions for skills
  const handleApplySkill = (skill: string) => {
    const newSkill = {
      id: `skill-${Date.now()}`,
      name: skill,
      proficiency: 3 // Medium proficiency as default
    };
    
    const updatedSkills = [...resume.skills, newSkill];
    updateSkillsList(updatedSkills);
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header with controls */}
      <ResumeBuilderHeader
        resumeTitle={resume.title}
        onTitleChange={updateResumeTitle}
        onSave={saveResume}
        onDownload={handleDownload}
        onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        isSaving={isLoading}
        isDirty={isDirty}
      />
      
      <main className="container mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <Tabs
          className="cosmic-tabs"
          value={activeSection}
          onValueChange={handleSectionChange}
        >
          <TabsList className="cosmic-tab-list mb-6">
            <TabsTrigger value="profile" className="cosmic-tab-trigger">
              <User className="h-4 w-4 mr-1" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="experience" className="cosmic-tab-trigger">
              <Briefcase className="h-4 w-4 mr-1" />
              Experience
            </TabsTrigger>
            <TabsTrigger value="project" className="cosmic-tab-trigger">
              <Folder className="h-4 w-4 mr-1" />
              Project
            </TabsTrigger>
            <TabsTrigger value="education" className="cosmic-tab-trigger">
              <GraduationCap className="h-4 w-4 mr-1" />
              Education
            </TabsTrigger>
            <TabsTrigger value="skills" className="cosmic-tab-trigger">
              <Code className="h-4 w-4 mr-1" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="summary" className="cosmic-tab-trigger">
              <FileText className="h-4 w-4 mr-1" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="preview" className="cosmic-tab-trigger">
              <Sparkles className="h-4 w-4 mr-1" />
              Finish Up & Preview
            </TabsTrigger>
          </TabsList>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-2 space-y-6">
              {/* Content for each tab */}
              <TabsContent value="profile" className="mt-0">
                <PersonalInfoSection
                  personalInfo={resume.personalInfo}
                  resumeId={resumeId || undefined}
                  onUpdate={handlePersonalInfoUpdate}
                />
              </TabsContent>
              
              <TabsContent value="experience" className="mt-0">
                <ExperienceSection
                  experiences={resume.experience}
                  resumeId={resumeId || undefined}
                  onUpdate={updateExperienceList}
                />
              </TabsContent>
              
              <TabsContent value="project" className="mt-0">
                <ProjectsSection
                  projects={resume.projects}
                  resumeId={resumeId || undefined}
                  onUpdate={updateProjectsList}
                />
              </TabsContent>
              
              <TabsContent value="education" className="mt-0">
                <EducationSection
                  education={resume.education}
                  resumeId={resumeId || undefined}
                  onUpdate={updateEducationList}
                />
              </TabsContent>
              
              <TabsContent value="skills" className="mt-0">
                <SkillsSection
                  skills={resume.skills}
                  resumeId={resumeId || undefined}
                  onUpdate={updateSkillsList}
                />
              </TabsContent>
              
              <TabsContent value="summary" className="mt-0">
                <div className="cosmic-card border border-white/10 bg-black/30 p-6 rounded-lg">
                  <h2 className="text-lg font-medium mb-4 text-white">Resume Summary</h2>
                  <p className="text-gray-300 mb-4">
                    Write a compelling summary that highlights your key qualifications, skills, and career goals.
                  </p>
                  <textarea
                    value={resume.personalInfo.summary}
                    onChange={(e) => handlePersonalInfoUpdate('summary', e.target.value)}
                    className="w-full h-32 p-3 bg-black/50 border border-blue-900/50 rounded-lg text-white"
                    placeholder="Enter a professional summary..."
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="preview" className="mt-0">
                <TemplateSelector
                  selectedTemplate={resume.template}
                  onTemplateChange={updateResumeTemplate}
                />
              </TabsContent>
            </div>
            
            {/* Preview - Right Side */}
            <div className="lg:col-span-1 h-[calc(100vh-220px)] sticky top-20">
              <ResumePreviewComponent
                resume={resume}
                onTemplateChange={updateResumeTemplate}
                onDownload={handleDownload}
              />
            </div>
          </div>
        </Tabs>
      </main>
      
      {/* AI Assistant Dialog */}
      <AIAssistantDialog
        resumeId={resumeId || undefined}
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        onApplySummary={handleApplySummary}
        onApplyBulletPoint={handleApplyBulletPoint}
        onApplySkill={handleApplySkill}
        resume={resume}
        activeTab={activeSection}
      />
    </div>
  );
}