import React, { useState, useRef } from "react";
import { useResumeData } from "@/hooks/use-resume-data";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar";
import CosmicBackground from "@/components/cosmic-background";
import { CosmicButton } from "@/components/cosmic-button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FileText,
  GraduationCap,
  Briefcase,
  Code,
  FolderKanban,
  Save,
  Upload,
  Loader2,
  Maximize2,
  Printer,
  Download,
  User,
} from "lucide-react";

// Import our modular resume section components
import { PersonalInfoSection } from "@/components/resume/PersonalInfoSection";
import { ExperienceSection } from "@/components/resume/ExperienceSection";
import { EducationSection } from "@/components/resume/EducationSection";
import { SkillsSection } from "@/components/resume/SkillsSection";
import { ProjectsSection } from "@/components/resume/ProjectsSection";
import ResumeTemplate from "@/components/resume-template";

// Only importing the resume preview component until we refactor the others
function ResumePreviewComponent({ resume, onTemplateChange, onDownload }: { 
  resume: any; 
  onTemplateChange: (template: string) => void; 
  onDownload?: () => void; 
}) {
  return (
    <div className="relative flex flex-col h-full">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <FileText className="w-5 h-5 mr-2 text-blue-400" />
          <h2 className="text-white text-xl font-semibold">Resume Preview</h2>
        </div>
        
        <div className="flex space-x-2">
          <CosmicButton
            variant="outline"
            size="sm"
            onClick={onDownload}
            iconLeft={<Download className="w-4 h-4" />}
          >
            Download
          </CosmicButton>
          <CosmicButton
            variant="outline"
            size="sm"
            onClick={() => window.open('/resume-print', '_blank')}
            iconLeft={<Printer className="w-4 h-4" />}
          >
            Print
          </CosmicButton>
          <CosmicButton
            variant="outline"
            size="sm"
            onClick={() => window.open('/resume-view', '_blank')}
            iconLeft={<Maximize2 className="w-4 h-4" />}
          >
            Full Screen
          </CosmicButton>
        </div>
      </div>
      
      <div className="p-6 bg-white rounded-lg overflow-hidden flex-grow overflow-y-auto">
        <ResumeTemplate 
          resume={resume} 
          onTemplateChange={onTemplateChange} 
        />
      </div>
    </div>
  );
}

export default function ResumeBuilder() {
  // Use our custom hook for resume data and operations
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
    addExperience,
    addEducation,
    addSkill,
    addProject,
    saveResume
  } = useResumeData();
  
  const { toast } = useToast();
  
  // State for dialogs, file upload, etc.
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [resumeTitle, setResumeTitle] = useState(resume.title || "Untitled Resume");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Currently not refactored functions 
  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    // Show loading toast
    toast({
      title: "Parsing Resume",
      description: "Analyzing your resume file...",
    });
    
    // Create FormData object
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/resumes/parse', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Resume parsing failed');
      }
      
      const data = await response.json();
      
      if (data && data.success) {
        // Update the resume with the parsed data
        // This would need to be handled by our hook in a real implementation
        toast({
          title: "Resume Parsed Successfully",
          description: "Your resume information has been extracted.",
        });
      } else {
        throw new Error(data.message || 'Resume parsing failed');
      }
    } catch (error) {
      console.error('Error parsing resume:', error);
      toast({
        title: "Error Parsing Resume",
        description: "We couldn't extract information from your resume file.",
        variant: "destructive",
      });
    } finally {
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleSave = () => {
    updateResumeTitle(resumeTitle);
    saveResume();
    setSaveDialogOpen(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />
      <div className="container px-4 py-8 mx-auto max-w-7xl flex-grow relative z-10">
        {/* Background cosmic effect */}
        <div className="fixed inset-0 z-0">
          <CosmicBackground />
        </div>
        
        {/* Page Title */}
        <div className="mb-6 flex justify-between items-center relative z-10">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Resume Builder
          </h1>
          
          <CosmicButton
            onClick={() => setSaveDialogOpen(true)}
            variant="primary"
            withGlow
            isLoading={isLoading}
            iconLeft={isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          >
            {isDirty ? "Save Resume*" : "Save Resume"}
          </CosmicButton>
        </div>
        
        {/* Main content with tabs */}
        <div className="mt-6 relative z-10 bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-800 overflow-hidden">
          <Tabs 
            value={activeSection} 
            onValueChange={setActiveSection}
            className="cosmic-tabs"
          >
            <TabsList className="cosmic-tabs-list">
              <TabsTrigger value="profile" className="cosmic-tab-trigger">
                <User className="h-4 w-4 mr-2" />
                Contact
              </TabsTrigger>
              <TabsTrigger value="experience" className="cosmic-tab-trigger">
                <Briefcase className="h-4 w-4 mr-2" />
                Experience
              </TabsTrigger>
              <TabsTrigger value="education" className="cosmic-tab-trigger">
                <GraduationCap className="h-4 w-4 mr-2" />
                Education
              </TabsTrigger>
              <TabsTrigger value="skills" className="cosmic-tab-trigger">
                <Code className="h-4 w-4 mr-2" />
                Skills
              </TabsTrigger>
              <TabsTrigger value="projects" className="cosmic-tab-trigger">
                <FolderKanban className="h-4 w-4 mr-2" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="preview" className="cosmic-tab-trigger">
                <FileText className="h-4 w-4 mr-2" />
                Preview
              </TabsTrigger>
            </TabsList>
            
            {/* Tab content */}
            <div className="p-6">
              {/* Personal Info Section */}
              <TabsContent value="profile">
                <PersonalInfoSection 
                  personalInfo={resume.personalInfo} 
                  resumeId={resumeId || undefined}
                  onUpdate={updatePersonalInfo}
                  onFileUpload={handleFileInputClick}
                  showUploadCard={true}
                />
                
                {/* Hidden file input for resume upload */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.docx,.doc,.txt"
                  className="hidden"
                />
              </TabsContent>
              
              {/* Experience Section */}
              <TabsContent value="experience">
                <ExperienceSection 
                  experiences={resume.experience}
                  resumeId={resumeId || undefined}
                  onUpdate={updateExperienceList}
                  onAdd={addExperience}
                />
              </TabsContent>
              
              {/* Education Section */}
              <TabsContent value="education">
                <EducationSection
                  education={resume.education}
                  resumeId={resumeId || undefined}
                  onUpdate={updateEducationList}
                  onAdd={addEducation}
                />
              </TabsContent>
              
              {/* Skills Section */}
              <TabsContent value="skills">
                <SkillsSection
                  skills={resume.skills}
                  resumeId={resumeId || undefined}
                  onUpdate={updateSkillsList}
                  onAdd={addSkill}
                />
              </TabsContent>
              
              {/* Projects Section */}
              <TabsContent value="projects">
                <ProjectsSection
                  projects={resume.projects}
                  resumeId={resumeId || undefined}
                  onUpdate={updateProjectsList}
                  onAdd={addProject}
                />
              </TabsContent>
              
              {/* Preview Section */}
              <TabsContent value="preview">
                <ResumePreviewComponent
                  resume={resume}
                  onTemplateChange={updateResumeTemplate}
                  onDownload={() => {
                    // Would implement download functionality here
                    toast({
                      title: "Download Started",
                      description: "Your resume is being prepared for download.",
                    });
                  }}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
      
      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">Save Resume</DialogTitle>
            <DialogDescription className="text-gray-400">
              Give your resume a name before saving.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="resume-title" className="text-white">Resume Title</Label>
            <Input
              id="resume-title"
              value={resumeTitle}
              onChange={(e) => setResumeTitle(e.target.value)}
              placeholder="e.g., Software Engineer Resume"
              className="mt-2 bg-gray-800 border-gray-700 text-white"
            />
          </div>
          
          <DialogFooter>
            <CosmicButton
              variant="outline"
              onClick={() => setSaveDialogOpen(false)}
            >
              Cancel
            </CosmicButton>
            <CosmicButton
              variant="primary"
              onClick={handleSave}
            >
              Save Resume
            </CosmicButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}