import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2, X, ChevronDown, ChevronUp, Save, Download, PenSquare, Star, Plus, Trash, FilePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Resume, useResumeData } from "@/hooks/use-resume-data";
import { useTheme } from "@/contexts/ThemeContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import PageHeader from "@/components/page-header";
import { 
  ResumeExperienceSection, 
  ResumeEducationSection, 
  ResumeSkillsSection, 
  ResumeProjectsSection 
} from "@/components/resume-section";
import ResumePreviewComponent from "@/components/resume-builder/ResumePreviewComponent";

// Function component
export default function ResumeBuilder() {
  // States for resume data and UI controls
  const [activeSection, setActiveSection] = useState<string>("contact");
  const { toast } = useToast();
  const { 
    resume, 
    setResume,
    isLoading, 
    saveResume, 
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
    addProject
  } = useResumeData();
  
  // Helper function to update the entire resume at once
  const updateResume = (newResumeData: Resume) => {
    setResume(newResumeData);
  };

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
      
      <div className="cosmic-main-content container  pb-20 px-4 md:px-6 max-w-7xl mx-auto relative z-10">
        {/* Page Header */}
        <PageHeader 
          title={<span className="cosmic-text-gradient">Resume Builder</span>}
          subtitle="Create a professional resume that passes ATS systems and gets you hired."
          actions={
            <div className="flex space-x-3">
              {/* Simple actions */}
              <Button 
                variant="outline" 
                onClick={handleSaveResume} 
                disabled={isLoading || !isDirty}
                className="border-white/10 text-gray-200 hover:bg-white/10 hover:text-white"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save
              </Button>
              <Button 
                onClick={handleDownload}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
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

            {/* Tabs Navigation */}
            <Tabs 
              defaultValue="contact" 
              value={activeSection} 
              onValueChange={setActiveSection}
              className="space-y-4"
            >
              <TabsList className="w-full max-w-full flex-nowrap bg-[#131c36] border-b border-[#2a325a] flex justify-between overflow-hidden">
                <TabsTrigger className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none bg-transparent hover:bg-[#212b52] text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent transition-colors" value="contact">Contact</TabsTrigger>
                <TabsTrigger className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none bg-transparent hover:bg-[#212b52] text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent transition-colors" value="summary">Summary</TabsTrigger>
                <TabsTrigger className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none bg-transparent hover:bg-[#212b52] text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent transition-colors" value="experience">Experience</TabsTrigger>
                <TabsTrigger className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none bg-transparent hover:bg-[#212b52] text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent transition-colors" value="education">Education</TabsTrigger>
                <TabsTrigger className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none bg-transparent hover:bg-[#212b52] text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent transition-colors" value="skills">Skills</TabsTrigger>
                <TabsTrigger className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none bg-transparent hover:bg-[#212b52] text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent transition-colors" value="projects">Projects</TabsTrigger>
                <TabsTrigger className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none bg-transparent hover:bg-[#212b52] text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent transition-colors" value="preview">Preview</TabsTrigger>
              </TabsList>

              {/* Contact/Personal Info Tab */}
              <TabsContent value="contact" className="space-y-4 p-6 bg-[#161f36] rounded-md border border-[#2a325a] mt-4 shadow-md">
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
              <TabsContent value="summary" className="space-y-4 p-6 bg-[#161f36] rounded-md border border-[#2a325a] mt-4 shadow-md">
                <div className="mb-4">
                  <h3 className="text-lg font-medium">Professional Summary</h3>
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
                  <div className="bg-[#1a2442] border border-[#2a325a] p-5 rounded-md shadow-inner">
                    <h4 className="text-sm font-medium mb-3 flex items-center text-white">
                      <Star className="h-4 w-4 mr-2 text-blue-400" />
                      Pro Tips for a Great Summary
                    </h4>
                    <ul className="text-xs space-y-2 text-gray-300">
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        <span>Keep it between 3-5 sentences for optimal ATS scanning</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        <span>Mention years of experience and key specializations</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        <span>Include notable achievements with measurable results</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        <span>Tailor it to match the job descriptions you're targeting</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              {/* Experience Tab */}
              <TabsContent value="experience" className="space-y-4 p-6 bg-[#161f36] rounded-md border border-[#2a325a] mt-4 shadow-md">
                <ResumeExperienceSection
                  experiences={resume.experience}
                  onUpdate={(experiences) => updateResume({...resume, experience: experiences})}
                />
              </TabsContent>

              {/* Education Tab */}
              <TabsContent value="education" className="space-y-4 p-6 bg-[#161f36] rounded-md border border-[#2a325a] mt-4 shadow-md">
                <ResumeEducationSection
                  education={resume.education}
                  onUpdate={(education) => updateResume({...resume, education: education})}
                />
              </TabsContent>

              {/* Skills Tab */}
              <TabsContent value="skills" className="space-y-4 p-6 bg-[#161f36] rounded-md border border-[#2a325a] mt-4 shadow-md">
                <ResumeSkillsSection
                  skills={resume.skills}
                  onUpdate={(skills) => updateResume({...resume, skills: skills})}
                />
              </TabsContent>

              {/* Projects Tab */}
              <TabsContent value="projects" className="space-y-4 p-6 bg-[#161f36] rounded-md border border-[#2a325a] mt-4 shadow-md">
                <ResumeProjectsSection
                  projects={resume.projects}
                  onUpdate={(projects) => updateResume({...resume, projects: projects})}
                />
              </TabsContent>
              
              {/* Preview Tab */}
              <TabsContent value="preview" className="space-y-4 p-6 bg-[#161f36] rounded-md border border-[#2a325a] mt-4 shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Resume Preview</h3>
                  <Button 
                    onClick={handleDownload} 
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <ResumePreviewComponent
                    resume={resume}
                    onTemplateChange={(template) => updateResume({...resume, template})}
                    onDownload={handleDownload}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - Only visible on large screens */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-4">
              <h3 className="text-lg font-medium mb-4">Quick Preview</h3>
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




      </div>
    </div>
  );
}