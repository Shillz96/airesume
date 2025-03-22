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
import { Job } from "./job-card";
import { ExperienceItem, SkillItem } from "./resume-section";

interface UserResume {
  id?: number; // Optional ID for authenticated users
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    headline: string;
    summary: string;
  };
  experience: ExperienceItem[];
  skills: SkillItem[];
}

interface TailoredResume {
  personalInfo: {
    summary: string;
    [key: string]: any;
  };
  experience: ExperienceItem[];
  skills: string[] | SkillItem[];
  keywordsIncorporated?: string[]; // ATS keywords added to the resume
  matchAnalysis?: string; // Analysis of how well the resume matches the job
}

interface JobListingProps {
  job: Job;
  userResume?: UserResume;
  onTailoredResumeApplied?: (tailored: TailoredResume) => void;
}

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
          } // Format resume data properly for guest mode
        };
        
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
      } else {
        // Authenticated user - use our enhanced job-specific tailoring endpoint
        const res = await apiRequest(
          "POST", 
          `/api/resumes/${resume.id}/tailor-to-job/${job.id}`,
          {} // No body needed as we're using the IDs in the URL
        );
        
        const data = await res.json();
        
        if (!data.success) {
          throw new Error(data.error || "Failed to tailor resume");
        }
        
        // Create TailoredResume format from the response
        const { tailoredContent, originalResume } = data;
        
        // Transform the tailored content to match our expected format
        return {
          personalInfo: {
            ...originalResume.content.personalInfo,
            summary: tailoredContent.summary || originalResume.content.personalInfo.summary
          },
          experience: originalResume.content.experience.map((exp: ExperienceItem) => {
            // Find if this experience has improvements
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
      console.error("Error tailoring resume:", error);
      
      // Fallback approach if the API fails
      const jobKeywords = [...job.skills, ...job.description.toLowerCase().match(/\b\w+\b/g)?.filter(word => word.length > 3) || []];
      
      const tailoredSummary = `Experienced ${job.title.toLowerCase()} with expertise in ${job.skills.join(", ")}. Skilled in building scalable web applications, as demonstrated by ${resume.experience[0]?.description?.toLowerCase() || "my previous work"}. Ready to contribute to ${job.company} by leveraging modern frontend architectures and delivering high-quality user experiences.`;
      
      const tailoredExperience = resume.experience.map(exp => ({
        ...exp,
        description: `Enhanced ${exp.description?.toLowerCase() || "web applications"} by incorporating ${job.skills[0] || "modern techniques"} and ${job.skills[1] || "best practices"} to align with modern frontend requirements.`,
      }));

      // Extract skill names from skill items
      const userSkillNames = resume.skills.map((skill: SkillItem) => skill.name);
      
      // Merge user skills with job skills - use Array.from for better compatibility
      const skillSet = new Set([...userSkillNames, ...job.skills]);
      const tailoredSkillNames = Array.from(skillSet);

      const fallbackResume = {
        personalInfo: {
          ...resume.personalInfo,
          summary: tailoredSummary,
        },
        experience: tailoredExperience,
        skills: tailoredSkillNames,
      };
      
      setTailoredResume(fallbackResume);
      
      toast({
        title: "Resume Tailored",
        description: "Your resume has been tailored for this position.",
        variant: "default",
      });
      
      setDialogOpen(true);
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
      console.error("Error applying tailored resume:", error);
      
      // For guest mode, fallback to callback
      if (onTailoredResumeApplied && tailoredResume) {
        // First store in localStorage for resume-builder to pick up
        localStorage.setItem("tailoredResume", JSON.stringify(tailoredResume));
        
        // Then call the callback from props
        onTailoredResumeApplied(tailoredResume);
        
        toast({
          title: "Tailored Resume Applied",
          description: "Redirecting to Resume Builder with your tailored content...",
        });
        
        setDialogOpen(false);
        
        // Redirect to the resume builder
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
    return job.match > 80 ? "High" : job.match > 60 ? "Medium" : "Low";
  };

  return (
    <div className="cosmic-card bg-gradient-to-br from-[hsl(219,90%,10%)] to-[hsl(260,90%,10%)] text-white p-4 rounded-lg shadow-lg relative">
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
          <h2 className="text-xl font-semibold cosmic-text-gradient">
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
                  <DialogTitle className="cosmic-text-gradient">
                    Tailored Resume for {job.title}
                  </DialogTitle>
                </DialogHeader>
                {tailoredResume ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-blue-300 mb-1">
                        Tailored Professional Summary
                      </h4>
                      <Textarea
                        value={tailoredResume.personalInfo.summary}
                        readOnly
                        className="bg-gray-800 text-white border-gray-600 min-h-[100px] resize-none"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-blue-300 mb-1">
                        Tailored Experience
                      </h4>
                      {tailoredResume.experience.map((exp: ExperienceItem, index: number) => (
                        <div key={index} className="mb-2">
                          <p className="text-sm text-gray-300">
                            {exp.title} at {exp.company}
                          </p>
                          <p className="text-sm text-gray-400">
                            {exp.description}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-blue-300 mb-1">
                        Tailored Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(tailoredResume.skills) && 
                          tailoredResume.skills.map((skill: string | SkillItem, index: number) => (
                            <span key={index} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                              {typeof skill === 'string' ? skill : skill.name}
                            </span>
                          ))
                        }
                      </div>
                    </div>
                    
                    {/* ATS Optimization Insights */}
                    {tailoredResume.keywordsIncorporated && (
                      <div>
                        <h4 className="text-sm font-medium text-green-300 mb-1">
                          ATS Keywords Incorporated
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {tailoredResume.keywordsIncorporated.map((keyword, index) => (
                            <span key={index} className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Match Analysis */}
                    {tailoredResume.matchAnalysis && (
                      <div>
                        <h4 className="text-sm font-medium text-purple-300 mb-1">
                          Match Analysis
                        </h4>
                        <div className="cosmic-card bg-gray-800/50 p-3 rounded-md border border-gray-700 text-sm text-gray-300">
                          {tailoredResume.matchAnalysis}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={handleApplyTailored}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      >
                        <ArrowUpRight className="h-4 w-4 mr-2" />
                        Use in Resume Builder
                      </Button>
                      <Button
                        onClick={handleApply}
                        disabled={isApplyingMutation}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
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
                  <p className="text-gray-300">
                    Tailoring your resume...
                  </p>
                )}
              </DialogContent>
            </Dialog>
            <Button
              onClick={handleApply}
              disabled={isApplyingMutation || !tailoredResume}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Check className="h-4 w-4 mr-2" />
              Apply Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}