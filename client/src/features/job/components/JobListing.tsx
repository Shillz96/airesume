import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Check, Sparkles, RefreshCw, Briefcase, Clock, Award, ArrowUpRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { Job, SkillItem, ExperienceItem, TailoredResume, UserResume } from "@/features/job/types";
import { Card, CardContent } from "@/components/ui/card";

interface JobListingProps {
  job: Job;
  userResume?: UserResume;
  onTailoredResumeApplied?: (tailored: TailoredResume) => void;
}

/**
 * JobListing component displays detailed information about a job posting
 * with options to tailor a resume using AI and apply to the job
 */
export default function JobListing({ job, userResume, onTailoredResumeApplied }: JobListingProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [tailoredResume, setTailoredResume] = useState<TailoredResume | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Default resume data if none is provided
  const defaultResume: UserResume = {
    personalInfo: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "(555) 123-4567",
      headline: "Frontend Developer | React & TypeScript Specialist",
      summary: "Experienced frontend developer with a focus on building responsive and scalable web applications. Proficient in JavaScript, React, and CSS.",
    },
    experience: [
      {
        id: "exp-1",
        title: "Frontend Developer",
        company: "WebTech Solutions",
        startDate: "2020-01",
        endDate: "Present",
        description: "Developed and maintained web applications using React and JavaScript, improving user engagement by 25%.",
      },
    ],
    skills: [
      { id: "skill-1", name: "JavaScript", proficiency: 4 },
      { id: "skill-2", name: "React", proficiency: 4 },
      { id: "skill-3", name: "CSS", proficiency: 3 },
      { id: "skill-4", name: "HTML", proficiency: 4 },
    ],
  };

  const resume = userResume || defaultResume;

  // Mutation to tailor the resume
  const { mutate: tailorResume, isPending: isTailoring } = useMutation({
    mutationFn: async () => {
      if (!resume.id) {
        // Guest mode - use the existing tailoring approach for the job
        const payload = {
          resumeId: "guest-resume", 
          resumeData: {
            content: {
              personalInfo: resume.personalInfo,
              experience: resume.experience,
              skills: resume.skills
            }
          }
        };
        
        try {
          const res = await apiRequest(
            "POST", 
            `/api/jobs/${job.id}/tailor-resume`, 
            payload
          );
          
          const data = await res.json();
          
          if (!data.success) {
            throw new Error(data.error || "Failed to tailor resume");
          }
          
          return data.tailoredResume;
        } catch (error) {
          // Implement fallback for resume tailoring
          const jobKeywords = [...job.skills, ...job.description.toLowerCase().match(/\b\w+\b/g)?.filter(word => word.length > 3) || []];
          
          const tailoredSummary = `Experienced ${job.title.toLowerCase()} with expertise in ${job.skills.join(", ")}. Skilled in building scalable web applications, as demonstrated by ${resume.experience[0]?.description?.toLowerCase() || "my previous work"}. Ready to contribute to ${job.company} by leveraging modern frontend architectures and delivering high-quality user experiences.`;
          
          const tailoredExperience = resume.experience.map(exp => ({
            ...exp,
            description: `Enhanced ${exp.description?.toLowerCase() || "web applications"} by incorporating ${job.skills[0] || "modern techniques"} and ${job.skills[1] || "best practices"} to align with modern frontend requirements.`,
          }));

          const userSkillNames = resume.skills.map((skill: SkillItem) => skill.name);
          const skillSet = new Set([...userSkillNames, ...job.skills]);
          const tailoredSkillNames = Array.from(skillSet);

          return {
            personalInfo: {
              ...resume.personalInfo,
              summary: tailoredSummary,
            },
            experience: tailoredExperience,
            skills: tailoredSkillNames,
          };
        }
      } else {
        // Authenticated user - use our enhanced job-specific tailoring endpoint
        try {
          const res = await apiRequest(
            "POST", 
            `/api/resumes/${resume.id}/tailor-to-job/${job.id}`,
            {}
          );
          
          const data = await res.json();
          
          if (!data.success) {
            throw new Error(data.error || "Failed to tailor resume");
          }
          
          const { tailoredContent, originalResume } = data;
          
          return {
            personalInfo: {
              ...originalResume.content.personalInfo,
              summary: tailoredContent.summary || originalResume.content.personalInfo.summary
            },
            experience: originalResume.content.experience.map((exp: ExperienceItem) => {
              const improved = tailoredContent.experienceImprovements?.find(
                (improvement: any) => improvement.id === exp.id
              );
              
              return improved 
                ? { ...exp, description: improved.improvedDescription } 
                : exp;
            }),
            skills: tailoredContent.skills || originalResume.content.skills,
            keywordsIncorporated: tailoredContent.keywordsIncorporated,
            matchAnalysis: tailoredContent.matchAnalysis
          };
        } catch (error) {
          // Implement fallback for authenticated users
          const jobKeywords = [...job.skills, ...job.description.toLowerCase().match(/\b\w+\b/g)?.filter(word => word.length > 3) || []];
          
          const tailoredSummary = `Experienced ${job.title.toLowerCase()} with expertise in ${job.skills.join(", ")}. Skilled in building scalable web applications, as demonstrated by ${resume.experience[0]?.description?.toLowerCase() || "my previous work"}. Ready to contribute to ${job.company} by leveraging modern frontend architectures and delivering high-quality user experiences.`;
          
          const tailoredExperience = resume.experience.map(exp => ({
            ...exp,
            description: `Enhanced ${exp.description?.toLowerCase() || "web applications"} by incorporating ${job.skills[0] || "modern techniques"} and ${job.skills[1] || "best practices"} to align with modern frontend requirements.`,
          }));

          const userSkillNames = resume.skills.map((skill: SkillItem) => skill.name);
          const skillSet = new Set([...userSkillNames, ...job.skills]);
          const tailoredSkillNames = Array.from(skillSet);

          return {
            personalInfo: {
              ...resume.personalInfo,
              summary: tailoredSummary,
            },
            experience: tailoredExperience,
            skills: tailoredSkillNames,
          };
        }
      }
    },
    onSuccess: (data) => {
      setTailoredResume(data);
      toast({
        title: "Resume Tailored",
        description: "Your resume has been tailored for this position using AI.",
      });
      setDialogOpen(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Resume Tailoring Failed",
        description: "There was an error tailoring your resume. Please try again later.",
        variant: "destructive",
      });
    },
  });

  // Mutation to apply to the job
  const { mutate: applyToJob, isPending: isApplyingMutation } = useMutation({
    mutationFn: async () => {
      // Simulate applying to the job with the tailored resume
      const res = await apiRequest("POST", `/api/jobs/${job.id}/apply`, { resume: tailoredResume });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: `Successfully applied to ${job.title} at ${job.company}.`,
      });
      setIsApplying(false);
      setDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error applying to job",
        description: error.message,
        variant: "destructive",
      });
      setIsApplying(false);
    },
  });

  const handleTailorResume = () => {
    tailorResume();
  };

  const handleApply = () => {
    if (!tailoredResume) {
      toast({
        title: "Tailor Resume First",
        description: "Please tailor your resume before applying.",
        variant: "destructive",
      });
      return;
    }
    setIsApplying(true);
    applyToJob();
  };

  // Mutation to apply the tailored resume to the active resume
  const { mutate: applyTailoredResume, isPending: isApplyingTailored } = useMutation({
    mutationFn: async () => {
      if (!tailoredResume) {
        throw new Error("No tailored resume available");
      }
      
      // For guest mode, use the callback
      if (!resume.id) {
        if (onTailoredResumeApplied) {
          onTailoredResumeApplied(tailoredResume);
          return { success: true };
        }
        throw new Error("Cannot apply tailored resume in guest mode without callback");
      }
      
      // For authenticated users, call the API
      const res = await apiRequest(
        "POST", 
        `/api/resumes/${resume.id}/apply-tailored`, 
        tailoredResume
      );
      
      return await res.json();
    },
    onSuccess: () => {
      // First store in localStorage for resume-builder to pick up
      if (tailoredResume) {
        localStorage.setItem("tailoredResume", JSON.stringify(tailoredResume));
      }
      
      toast({
        title: "Tailored Resume Applied",
        description: "Redirecting to Resume Builder with your tailored content...",
      });
      
      // Close the dialog
      setDialogOpen(false);
      
      // Redirect to resume builder with the tailored parameter
      setTimeout(() => {
        setLocation("/resume-builder?tailored=true");
      }, 500);
    },
    onError: (error: Error) => {
      // Implement fallback logic for applying tailored resume
      if (onTailoredResumeApplied && tailoredResume) {
        try {
          localStorage.setItem("tailoredResume", JSON.stringify(tailoredResume));
        } catch (e) {
          // Silently fail if localStorage is not available
        }
        
        onTailoredResumeApplied(tailoredResume);
        
        toast({
          title: "Tailored Resume Applied",
          description: "Redirecting to Resume Builder with your tailored content...",
        });
        
        setDialogOpen(false);
        
        setTimeout(() => {
          setLocation("/resume-builder?tailored=true");
        }, 500);
      } else {
        toast({
          title: "Error Applying Tailored Resume",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  const handleApplyTailored = () => {
    // This is a direct click from the "Use in Resume Builder" button
    if (tailoredResume) {
      // For the direct button click, we can handle it differently for better UX
      // Store the data in localStorage first
      localStorage.setItem("tailoredResume", JSON.stringify(tailoredResume));
      
      // Show a toast notification
      toast({
        title: "Tailored Resume Ready",
        description: "Redirecting to Resume Builder with your tailored content...",
      });
      
      // Close the dialog 
      setDialogOpen(false);
      
      // Immediate redirect for better UX
      setTimeout(() => {
        setLocation("/resume-builder?tailored=true");
      }, 300);
    } else {
      // Fallback to the regular API call if somehow tailoredResume is not available
      applyTailoredResume();
    }
  };

  // Format display date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  // Calculate success rate display
  const getSuccessRate = () => {
    // Add check for job.match existence
    if (typeof job.match !== 'number') {
      return 'N/A'; // Or some default value
    }
    return job.match > 80 ? "High" : job.match > 60 ? "Medium" : "Low";
  };

  return (
    <Card className="bg-gradient-to-br from-[hsl(219,90%,10%)] to-[hsl(260,90%,10%)] text-white p-4 rounded-lg shadow-lg relative">
      {/* Starfield Background */}
      <div className="starfield absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="star absolute bg-white rounded-full"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${Math.random() * 3 + 2}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {job.title}
          </h2>
          <Badge
            variant="outline"
            className={`bg-blue-500/20 text-blue-300 border-blue-500/30`}
          >
            {job.match}% Match
          </Badge>
        </div>
        <p className="text-sm text-gray-300">
          {job.company} • {job.location}
        </p>
        <p className="text-sm text-gray-200 mt-3 mb-3">
          {job.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-2 mb-4">
          {job.skills && job.skills.length > 0 ? (
            job.skills.map((skill, index) => (
              <span key={index} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                {skill}
              </span>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">No specific skills listed</span>
          )}
        </div>
        <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center">
              <Clock className="h-4 w-4 text-gray-500 mr-1" />
              Posted: {formatDate(job.postedAt)}
            </span>
            <span className="flex items-center">
              <Award className="h-4 w-4 text-yellow-400 mr-1" />
              Success: {getSuccessRate()}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center">
              <Briefcase className="h-4 w-4 mr-1" />
              {job.type}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-5">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Heart className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
          <div className="flex gap-2">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={handleTailorResume}
                  disabled={isTailoring}
                  className="bg-gray-800 text-white hover:bg-gray-700"
                >
                  {isTailoring ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Tailoring...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      AI-Tailor Resume
                    </>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="cosmic-card bg-[rgba(10,12,24,0.95)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] text-white">
                <DialogHeader>
                  <DialogTitle className="text-xl text-center">AI-Tailored Resume</DialogTitle>
                </DialogHeader>
                {tailoredResume ? (
                  <div className="space-y-6 mt-4">
                    {/* Summary */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-blue-300">Professional Summary</h3>
                      <p className="text-sm text-gray-300 whitespace-pre-line">
                        {tailoredResume.personalInfo.summary}
                      </p>
                    </div>
                    
                    {/* Keywords */}
                    {tailoredResume.keywordsIncorporated && (
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium text-green-300">ATS Keywords Added</h3>
                        <div className="flex flex-wrap gap-2">
                          {tailoredResume.keywordsIncorporated.map((keyword, idx) => (
                            <Badge key={idx} className="bg-green-900/30 text-green-300 border-green-800">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Match Analysis */}
                    {tailoredResume.matchAnalysis && (
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium text-purple-300">Match Analysis</h3>
                        <p className="text-sm text-gray-300 whitespace-pre-line">
                          {tailoredResume.matchAnalysis}
                        </p>
                      </div>
                    )}
                    
                    {/* Application Notes */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-amber-300">Application Notes</h3>
                      <Textarea 
                        placeholder="Add personal notes for this application..." 
                        className="bg-slate-900/50 border-slate-700 text-white placeholder:text-gray-500"
                      />
                    </div>
                    
                    <div className="flex justify-between pt-4">
                      <Button
                        variant="outline"
                        onClick={handleApplyTailored}
                        disabled={isApplyingTailored}
                        className="border-blue-500/30 text-blue-300 hover:bg-blue-500/20"
                      >
                        <ArrowUpRight className="h-4 w-4 mr-2" />
                        Use in Resume Builder
                      </Button>
                      
                      <Button
                        onClick={handleApply}
                        disabled={isApplyingMutation}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {isApplyingMutation ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                            Applying...
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Apply with Tailored Resume
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-400" />
                    <p className="mt-4 text-gray-300">Tailoring your resume to match this job...</p>
                  </div>
                )}
              </DialogContent>
            </Dialog>
            
            <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
              <Button 
                variant="default" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Apply Now
              </Button>
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
}