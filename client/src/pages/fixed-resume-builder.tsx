import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  User,
  BriefcaseIcon,
  GraduationCap,
  Code,
  FolderKanban,
  Maximize2,
  Download,
  Plus,
  Check,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  ContactSection,
  ExperienceSection,
  EducationSection,
  SkillsSection,
  ProjectsSection,
  AIAssistantPanel
} from "@/components/resume/ResumeComponentFixed";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function FixedResumeBuilder() {
  const { toast } = useToast();
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [resume, setResume] = useState({
    title: "My Professional Resume",
    personalInfo: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "(555) 123-4567",
      headline: "Frontend Developer | React & TypeScript Specialist",
      summary: "Experienced frontend developer with expertise in React and TypeScript. Passionate about creating intuitive user experiences and writing clean, maintainable code. Strong focus on accessibility and responsive design.",
    },
    experience: [
      {
        id: "exp-1",
        title: "Frontend Developer",
        company: "WebTech Solutions",
        startDate: "2020-01",
        endDate: "Present",
        description: "Enhanced staff professional development through the design and implementation of innovative training programs, increasing nurse competency and engagement by 25%, to foster high-quality healthcare and maintain a compassionate caregiving environment at Complete Care at Harrington Court.",
      },
    ],
    education: [
      {
        id: "edu-1",
        degree: "B.S. Computer Science",
        institution: "University of Technology",
        startDate: "2015",
        endDate: "2019",
        description: "Focused on web development and user interface design. Completed a senior project on accessible web design patterns.",
      },
    ],
    skills: [
      {
        id: "skill-1",
        name: "React",
        proficiency: 5,
      },
      {
        id: "skill-2",
        name: "TypeScript",
        proficiency: 4,
      },
      {
        id: "skill-3",
        name: "CSS/SCSS",
        proficiency: 4,
      },
      {
        id: "skill-4",
        name: "Node.js",
        proficiency: 3,
      },
    ],
    projects: [
      {
        id: "proj-1",
        title: "E-commerce Redesign",
        description: "Led the frontend redesign of an e-commerce platform, improving mobile conversions by 35% and reducing bounce rate by 20%.",
        technologies: ["React", "TypeScript", "Redux", "Styled Components"],
        link: "https://example.com/project",
      },
    ],
    template: "professional",
  });

  // Mock auto-save functionality
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Auto-saved resume to localStorage");
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [resume]);

  const handleTemplateChange = (template: string) => {
    setResume((prev) => ({
      ...prev,
      template,
    }));
  };

  const downloadResume = () => {
    toast({
      title: "Resume Downloaded",
      description: "Your resume has been downloaded as a PDF.",
    });
  };

  return (
    <div className="min-h-screen pb-20 bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white mb-2">
            Resume Builder
          </h1>
          <p className="text-gray-400">
            Create and customize your professional resume
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <Tabs
              defaultValue="contact"
              orientation="vertical"
              className="w-full"
            >
              <TabsList className="flex flex-col h-auto bg-gray-900/50 p-1 rounded-lg border border-gray-800">
                <TabsTrigger
                  value="contact"
                  className="justify-start data-[state=active]:bg-blue-600/20 data-[state=active]:text-white text-gray-400 hover:text-white"
                >
                  <User className="h-4 w-4 mr-2" />
                  Personal Info
                </TabsTrigger>
                <TabsTrigger
                  value="experience"
                  className="justify-start data-[state=active]:bg-blue-600/20 data-[state=active]:text-white text-gray-400 hover:text-white"
                >
                  <BriefcaseIcon className="h-4 w-4 mr-2" />
                  Experience
                </TabsTrigger>
                <TabsTrigger
                  value="education"
                  className="justify-start data-[state=active]:bg-blue-600/20 data-[state=active]:text-white text-gray-400 hover:text-white"
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Education
                </TabsTrigger>
                <TabsTrigger
                  value="skills"
                  className="justify-start data-[state=active]:bg-blue-600/20 data-[state=active]:text-white text-gray-400 hover:text-white"
                >
                  <Code className="h-4 w-4 mr-2" />
                  Skills
                </TabsTrigger>
                <TabsTrigger
                  value="projects"
                  className="justify-start data-[state=active]:bg-blue-600/20 data-[state=active]:text-white text-gray-400 hover:text-white"
                >
                  <FolderKanban className="h-4 w-4 mr-2" />
                  Projects
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className="justify-start data-[state=active]:bg-blue-600/20 data-[state=active]:text-white text-gray-400 hover:text-white"
                >
                  <Maximize2 className="h-4 w-4 mr-2" />
                  Preview
                </TabsTrigger>
              </TabsList>

              <div className="mt-8 bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                <h3 className="text-sm font-medium text-white mb-2">Resume Title</h3>
                <input
                  type="text"
                  value={resume.title}
                  onChange={(e) => setResume({ ...resume, title: e.target.value })}
                  className="w-full bg-black/30 border border-blue-500/30 rounded-md p-2 text-white text-sm"
                />
                
                <div className="mt-4">
                  <Button
                    variant="default"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      toast({
                        title: "Resume Saved",
                        description: "Your resume has been saved successfully.",
                      });
                    }}
                  >
                    Save Resume
                  </Button>
                </div>
              </div>
            </Tabs>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <Tabs defaultValue="contact">
              <TabsContent value="contact" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <ContactSection 
                      personalInfo={resume.personalInfo}
                      onUpdate={(personalInfo) => {
                        setResume({
                          ...resume,
                          personalInfo,
                        });
                      }}
                    />
                  </div>
                  
                  <div className="md:col-span-1">
                    <AIAssistantPanel
                      title="AI Resume Assistant"
                      description="Get AI-powered suggestions to enhance your professional summary:"
                      suggestions={[
                        "Craft a concise overview of your career achievements",
                        "Highlight your industry-specific expertise",
                        "Showcase your leadership and communication skills",
                        "Tailor your summary for your target role"
                      ]}
                      icon={<Cpu className="h-4 w-4 text-white" />}
                      onGetSuggestions={() => {
                        toast({
                          title: "Generating suggestions",
                          description: "AI is analyzing your profile to provide personalized suggestions.",
                        });
                      }}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="experience" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <ExperienceSection
                      experiences={resume.experience}
                      onUpdate={(experience) => {
                        setResume({
                          ...resume,
                          experience,
                        });
                      }}
                    />
                  </div>
                  
                  <div className="md:col-span-1">
                    <AIAssistantPanel
                      title="Experience Assistant"
                      description="Enhance your work experience with these AI suggestions:"
                      suggestions={[
                        "Use action verbs to begin each bullet point",
                        "Include measurable achievements and results",
                        "Highlight skills relevant to your target job",
                        "Focus on your unique contributions"
                      ]}
                      icon={<BriefcaseIcon className="h-4 w-4 text-white" />}
                      onGetSuggestions={() => {
                        toast({
                          title: "Generating suggestions",
                          description: "AI is analyzing your experience to provide personalized suggestions.",
                        });
                      }}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="education" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <EducationSection
                      education={resume.education}
                      onUpdate={(education) => {
                        setResume({
                          ...resume,
                          education,
                        });
                      }}
                    />
                  </div>
                  
                  <div className="md:col-span-1">
                    <AIAssistantPanel
                      title="Education Assistant"
                      description="Enhance your education section with these tips:"
                      suggestions={[
                        "Focus on relevant coursework that aligns with your target job",
                        "Highlight leadership roles in student organizations",
                        "Include special projects, research, or thesis work",
                        "List certifications or specialized training programs"
                      ]}
                      icon={<GraduationCap className="h-4 w-4 text-white" />}
                      onGetSuggestions={() => {
                        toast({
                          title: "Generating suggestions",
                          description: "AI is analyzing your education to provide personalized suggestions.",
                        });
                      }}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="skills" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <SkillsSection
                      skills={resume.skills}
                      onUpdate={(skills) => {
                        setResume({
                          ...resume,
                          skills,
                        });
                      }}
                    />
                  </div>
                  
                  <div className="md:col-span-1">
                    <AIAssistantPanel
                      title="Skills Assistant"
                      description="Add relevant skills to make your resume stand out:"
                      suggestions={[
                        "Technical: Redux, Next.js, GraphQL, Webpack",
                        "Soft: Project Management, Team Leadership",
                        "Domain: UX/UI Design, Responsive Layouts",
                        "Tools: Git, Jest, Docker, CI/CD Pipelines"
                      ]}
                      icon={<Code className="h-4 w-4 text-white" />}
                      onGetSuggestions={() => {
                        toast({
                          title: "Generating suggestions",
                          description: "AI is analyzing job market trends to suggest relevant skills.",
                        });
                      }}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="projects" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <ProjectsSection
                      projects={resume.projects}
                      onUpdate={(projects) => {
                        setResume({
                          ...resume,
                          projects,
                        });
                      }}
                    />
                  </div>
                  
                  <div className="md:col-span-1">
                    <AIAssistantPanel
                      title="Projects Assistant"
                      description="Enhance your projects section with these formatting tips:"
                      suggestions={[
                        "Use action verbs to describe your contributions",
                        "Quantify achievements with metrics when possible",
                        "Showcase problem-solving and technical skills",
                        "Include the business impact of your project"
                      ]}
                      icon={<FolderKanban className="h-4 w-4 text-white" />}
                      onGetSuggestions={() => {
                        toast({
                          title: "Generating suggestions",
                          description: "AI is analyzing your projects to provide improvement suggestions.",
                        });
                      }}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="preview" className="mt-0">
                <div className="flex justify-end mb-4">
                  <Button
                    variant="default"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={downloadResume}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
                
                <div className="bg-white rounded-lg p-8 text-black min-h-[800px]">
                  <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">{resume.personalInfo.firstName} {resume.personalInfo.lastName}</h1>
                    <p className="text-gray-600 mt-1">{resume.personalInfo.headline}</p>
                    <div className="flex justify-center mt-2 text-sm text-gray-600">
                      <span>{resume.personalInfo.email}</span>
                      <span className="mx-2">•</span>
                      <span>{resume.personalInfo.phone}</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2">Summary</h2>
                    <p className="text-gray-700">{resume.personalInfo.summary}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2">Experience</h2>
                    {resume.experience.map((exp) => (
                      <div key={exp.id} className="mb-4">
                        <div className="flex justify-between">
                          <h3 className="font-bold text-gray-800">{exp.title}</h3>
                          <span className="text-gray-600 text-sm">{exp.startDate} - {exp.endDate}</span>
                        </div>
                        <p className="text-gray-700 font-medium">{exp.company}</p>
                        <p className="text-gray-700 mt-1">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2">Education</h2>
                    {resume.education.map((edu) => (
                      <div key={edu.id} className="mb-4">
                        <div className="flex justify-between">
                          <h3 className="font-bold text-gray-800">{edu.degree}</h3>
                          <span className="text-gray-600 text-sm">{edu.startDate} - {edu.endDate}</span>
                        </div>
                        <p className="text-gray-700 font-medium">{edu.institution}</p>
                        <p className="text-gray-700 mt-1">{edu.description}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {resume.skills.map((skill) => (
                        <span key={skill.id} className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm">
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2">Projects</h2>
                    {resume.projects.map((project) => (
                      <div key={project.id} className="mb-4">
                        <h3 className="font-bold text-gray-800">{project.title}</h3>
                        <div className="flex flex-wrap gap-1 my-1">
                          {project.technologies.map((tech, i) => (
                            <span key={i} className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-sm text-xs">
                              {tech}
                            </span>
                          ))}
                        </div>
                        <p className="text-gray-700 mt-1">{project.description}</p>
                        {project.link && (
                          <a 
                            href={project.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm mt-1 inline-block"
                          >
                            View Project →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-white text-lg font-medium mb-4">Select a Template</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {["professional", "modern", "creative"].map((template) => (
                      <div
                        key={template}
                        onClick={() => handleTemplateChange(template)}
                        className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                          resume.template === template
                            ? "border-blue-500 ring-2 ring-blue-500/30"
                            : "border-gray-700 hover:border-gray-500"
                        }`}
                      >
                        <div className="h-32 bg-gray-800">
                          {/* Thumbnail preview of template */}
                        </div>
                        <div className="p-2 bg-gray-900/80 flex justify-between items-center">
                          <span className="text-sm capitalize text-white">
                            {template}
                          </span>
                          {resume.template === template && (
                            <Check className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}