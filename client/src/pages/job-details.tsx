import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import JobListing from "@/components/job-listing";
import { Job } from "@/components/job-card";
import { getQueryFn } from "@/lib/queryClient";
import { 
  ArrowLeft, 
  Briefcase, 
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useGuestMode } from "@/hooks/use-guest-mode";
import { useAuth } from "@/hooks/use-auth";

export default function JobDetails() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute<{ id: string }>("/job/:id");
  const { isGuestMode, showGuestModal } = useGuestMode();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Redirect if no ID in params
  useEffect(() => {
    if (!params?.id) {
      setLocation("/job-finder");
    }
  }, [params, setLocation]);
  
  // Fetch job details
  const { data: job, isLoading, error } = useQuery<Job>({
    queryKey: [`/api/jobs/${params?.id}`],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!params?.id,
  });
  
  // Fetch user's resumes
  const { data: resume } = useQuery({
    queryKey: ["/api/resumes/active"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user,
  });
  
  const handleTailoredResumeApplied = (tailoredResume: any) => {
    // Check if user is in guest mode, prompt to log in
    if (isGuestMode || !user) {
      showGuestModal();
      toast({
        title: "Login Required",
        description: "Please log in to save and apply with a tailored resume.",
      });
      return;
    }
    
    // First, store the tailored resume data in localStorage
    localStorage.setItem("tailoredResume", JSON.stringify(tailoredResume));
    
    // Add a success toast before redirecting
    toast({
      title: "Resume Tailored Successfully",
      description: "Redirecting to Resume Builder with your tailored content...",
    });
    
    // Use a slight delay before redirecting to ensure the toast is seen
    // and localStorage has time to update
    setTimeout(() => {
      // Redirect to the resume builder with the tailored flag
      setLocation("/resume-builder?tailored=true");
    }, 1000);
  };
  
  if (isLoading) {
    return (
      <div className="cosmic-page">
        <Navbar />
        <main className="pt-24 relative z-10 cosmic-nebula flex-1">
          <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center min-h-[50vh]">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  if (error || !job) {
    return (
      <div className="cosmic-page">
        <Navbar />
        <main className="pt-24 relative z-10 cosmic-nebula flex-1">
          <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-red-400 mb-4">Error Loading Job</h2>
                <p className="text-gray-300 mb-8">
                  {error ? (error as Error).message : "Job not found"}
                </p>
                <Button 
                  onClick={() => setLocation("/job-finder")}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Job Finder
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="cosmic-page">
      <Navbar />
      
      <main className="pt-24 relative z-10 cosmic-nebula flex-1">
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-6">
              <Button 
                variant="ghost" 
                onClick={() => setLocation("/job-finder")}
                className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Job Finder
              </Button>
            </div>
            
            <div className="flex items-center mb-8">
              <Briefcase className="h-6 w-6 text-blue-400 mr-3" />
              <h1 className="text-2xl font-bold cosmic-text-gradient">Job Details</h1>
            </div>
            
            <JobListing 
              job={job} 
              userResume={resume}
              onTailoredResumeApplied={handleTailoredResumeApplied} 
            />
            
            <div className="mt-12 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">Why This Job Matches Your Profile</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-blue-400 font-medium mb-2">Skills Match</h3>
                  <p className="text-gray-300">
                    Your resume shows proficiency in {job.skills.slice(0, 2).join(", ")}, 
                    which aligns with the key requirements for this position.
                  </p>
                </div>
                <div>
                  <h3 className="text-blue-400 font-medium mb-2">Experience Alignment</h3>
                  <p className="text-gray-300">
                    Your background in {job.title.split(" ")[0]} roles provides a strong foundation 
                    for success in this position at {job.company}.
                  </p>
                </div>
                <div>
                  <h3 className="text-blue-400 font-medium mb-2">Growth Opportunity</h3>
                  <p className="text-gray-300">
                    This {job.type} role offers a chance to expand your expertise in {job.skills[0]} 
                    and gain experience in a {job.location.includes("Remote") ? "remote" : "dynamic"} environment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}