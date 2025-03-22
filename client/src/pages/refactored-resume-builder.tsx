import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2, X, ChevronDown, ChevronUp, Save, Download, PenSquare, Star, Plus, Trash, FilePlus, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Resume, useResumeData } from "@/hooks/use-resume-data";
import { useTheme } from "@/contexts/ThemeContext";
import AIAssistantDialog from "@/components/resume-builder/AIAssistantDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Navbar from "@/components/navbar";
import PageHeader from "@/components/page-header";
import { 
  ResumeExperienceSection, 
  ResumeEducationSection, 
  ResumeSkillsSection, 
  ResumeProjectsSection 
} from "@/components/resume-section";
import ResumePreviewComponent from "@/components/resume-builder/ResumePreviewComponent";
import ResumeBuilderHeader from "@/components/resume-builder/ResumeBuilderHeader";

// Function component
export default function ResumeBuilder() {
  // States for resume data and UI controls
  const [activeSection, setActiveSection] = useState<string>("contact");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { 
    resume, 
    isLoading, 
    updateResume, 
    saveResume, 
    isSaving, 
    isDirty,
    addExperience,
    removeExperience,
    addEducation,
    removeEducation,
    addSkill,
    removeSkill,
    addProject,
    removeProject
  } = useResumeData();

  // Function to handle download
  const handleDownload = () => {
    toast({
      title: "Resume downloaded",
      description: "Your resume has been downloaded successfully."
    });
  };

  // Function to handle save
  const handleSaveResume = async () => {
    try {
      await saveResume();
      toast({
        title: "Resume saved",
        description: "Your resume has been saved successfully."
      });
    } catch (error) {
      toast({
        title: "Error saving resume",
        description: "There was an error saving your resume. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="cosmic-app-container flex flex-col min-h-screen">
      <Navbar />
      <div className="cosmic-main-content container pt-12 pb-20 px-4 md:px-6 max-w-7xl mx-auto relative z-10">
        {/* Page Header */}
        <PageHeader 
          title={<span className="cosmic-text-gradient">Resume Builder</span>}
          subtitle="Create a professional resume that passes ATS systems and gets you hired."
          actions={
            <div className="flex space-x-3">
              {/* Simple actions */}
              <Button variant="outline" onClick={handleSaveResume} disabled={isSaving || !isDirty}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save
              </Button>
              <Button variant="default" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          }
        />

        {/* Main Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resume Editor Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resume Builder Header */}
            <ResumeBuilderHeader
              resumeTitle={resume.title}
              onTitleChange={(value) => updateResume({...resume, title: value})}
              onSave={handleSaveResume}
              onDownload={handleDownload}
              onOpenAIAssistant={() => setIsDialogOpen(true)}
              isSaving={isSaving}
              isDirty={isDirty}
            />

            {/* Tabs Navigation */}
            <Tabs 
              defaultValue="contact" 
              value={activeSection} 
              onValueChange={setActiveSection}
              className="space-y-4"
            >
              <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2">
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>

              {/* Contact/Personal Info Tab */}
              <TabsContent value="contact" className="space-y-4 p-4 bg-card rounded-lg border">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <input
                      type="text"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={resume.personalInfo.firstName || ""}
                      onChange={(e) => updateResume({
                        ...resume,
                        personalInfo: {
                          ...resume.personalInfo,
                          firstName: e.target.value
                        }
                      })}
                      placeholder="First Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <input
                      type="text"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={resume.personalInfo.lastName || ""}
                      onChange={(e) => updateResume({
                        ...resume,
                        personalInfo: {
                          ...resume.personalInfo,
                          lastName: e.target.value
                        }
                      })}
                      placeholder="Last Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <input
                      type="email"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={resume.personalInfo.email || ""}
                      onChange={(e) => updateResume({
                        ...resume,
                        personalInfo: {
                          ...resume.personalInfo,
                          email: e.target.value
                        }
                      })}
                      placeholder="Email"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <input
                      type="tel"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={resume.personalInfo.phone || ""}
                      onChange={(e) => updateResume({
                        ...resume,
                        personalInfo: {
                          ...resume.personalInfo,
                          phone: e.target.value
                        }
                      })}
                      placeholder="Phone"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Professional Headline</label>
                    <input
                      type="text"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={resume.personalInfo.headline || ""}
                      onChange={(e) => updateResume({
                        ...resume,
                        personalInfo: {
                          ...resume.personalInfo,
                          headline: e.target.value
                        }
                      })}
                      placeholder="e.g., Senior Software Engineer | AI Specialist | Project Manager"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Summary Tab */}
              <TabsContent value="summary" className="space-y-4 p-4 bg-card rounded-lg border">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Professional Summary</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Bot className="h-4 w-4 mr-2" />
                    Get AI Suggestions
                  </Button>
                </div>
                <div className="space-y-4">
                  <textarea
                    className="w-full min-h-[200px] rounded-md border border-input bg-background px-3 py-2"
                    value={resume.personalInfo.summary || ""}
                    onChange={(e) => updateResume({
                      ...resume,
                      personalInfo: {
                        ...resume.personalInfo,
                        summary: e.target.value
                      }
                    })}
                    placeholder="Write a compelling professional summary that highlights your expertise, experience, and key strengths."
                  />
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-200 dark:border-blue-800">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Star className="h-4 w-4 mr-2 text-blue-500" />
                      Pro Tips for a Great Summary
                    </h4>
                    <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-300">
                      <li>• Keep it between 3-5 sentences for optimal ATS scanning</li>
                      <li>• Mention years of experience and key specializations</li>
                      <li>• Include notable achievements with measurable results</li>
                      <li>• Tailor it to match the job descriptions you're targeting</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              {/* Experience Tab */}
              <TabsContent value="experience" className="space-y-4 p-4 bg-card rounded-lg border">
                <ResumeExperienceSection
                  experiences={resume.experience}
                  onUpdate={(experiences) => updateResume({...resume, experience: experiences})}
                />
              </TabsContent>

              {/* Education Tab */}
              <TabsContent value="education" className="space-y-4 p-4 bg-card rounded-lg border">
                <ResumeEducationSection
                  education={resume.education}
                  onUpdate={(education) => updateResume({...resume, education: education})}
                />
              </TabsContent>

              {/* Skills Tab */}
              <TabsContent value="skills" className="space-y-4 p-4 bg-card rounded-lg border">
                <ResumeSkillsSection
                  skills={resume.skills}
                  onUpdate={(skills) => updateResume({...resume, skills: skills})}
                />
              </TabsContent>

              {/* Projects Tab */}
              <TabsContent value="projects" className="space-y-4 p-4 bg-card rounded-lg border">
                <ResumeProjectsSection
                  projects={resume.projects}
                  onUpdate={(projects) => updateResume({...resume, projects: projects})}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Resume Preview Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <h3 className="text-lg font-medium mb-4">Resume Preview</h3>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <ResumePreviewComponent
                  resume={resume}
                  onTemplateChange={(template) => updateResume({...resume, template})}
                  onDownload={handleDownload}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Floating AI Assistant Button */}
        <div className="fixed bottom-6 right-6 z-50 group">
          <div className="absolute -inset-0.5 rounded-full bg-blue-500 opacity-75 blur-sm group-hover:opacity-100 transition duration-300 animate-pulse"></div>
          <Button
            variant="default"
            onClick={() => setIsDialogOpen(!isDialogOpen)}
            className="relative h-14 w-14 rounded-full p-0 shadow-lg group-hover:scale-105 transition duration-300"
            aria-label="Open AI Assistant"
          >
            <Bot className="h-6 w-6" />
          </Button>
        </div>

        {/* AI Assistant Dialog */}
        <AIAssistantDialog
          resumeId={resume.id}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          resume={resume}
          activeTab={activeSection}
          onApplySummary={(summary) => {
            updateResume({
              ...resume,
              personalInfo: {
                ...resume.personalInfo,
                summary
              }
            });
            setActiveSection("summary");
          }}
        />
      </div>
    </div>
  );
}