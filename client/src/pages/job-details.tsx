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
import CosmicBackground from "@/components/cosmic-background";

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
    queryKey: ['/api/jobs', params?.id],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!params?.id,
  });
  
  // Fetch user's resumes
  const { data: resume } = useQuery({
    queryKey: ['/api/resumes/latest'],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user,
  });
  
  const handleTailoredResumeApplied = (tailoredResume: any) => {
    // Check if user is in guest mode, prompt to log in
    if (isGuestMode) {
      showGuestModal();
      return;
    }
    
    // First, store the tailored resume data in localStorage
    localStorage.setItem("tailoredResume", JSON.stringify(tailoredResume));
    
    // Navigate to resume editor with a signal to load from tailored data
    setLocation("/resume-builder?tailored=true");
    
    // Show success toast
    toast({
      title: "Resume tailored successfully",
      description: "Your resume has been optimized for this job.",
    });
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <>
        <CosmicBackground />
        <Navbar />
        <div className="container pt-24 pb-10 px-4 md:px-6 max-w-4xl mx-auto min-h-screen relative z-10">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="text-center">
              <Loader2 className="h-10 w-10 animate-spin text-blue-400 mx-auto mb-4" />
              <p className="text-gray-300">Loading job details...</p>
            </div>
          </div>
        </div>
      </>
    );
  }
  
  // Show error state
  if (error || !job) {
    return (
      <>
        <CosmicBackground />
        <Navbar />
        <div className="container pt-24 pb-10 px-4 md:px-6 max-w-4xl mx-auto min-h-screen relative z-10">
          <div className="px-4 py-6 sm:px-0">
            <div className="cosmic-card border border-white/10 rounded-lg p-8 text-center">
              <Briefcase className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Job Not Found</h3>
              <p className="text-gray-300 mb-6">The job you're looking for doesn't exist or was removed.</p>
              <Button 
                onClick={() => setLocation("/job-finder")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Jobs
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <CosmicBackground />
      <Navbar />
      <div className="container pt-24 pb-10 px-4 md:px-6 max-w-4xl mx-auto min-h-screen relative z-10">
        <div className="mb-6">
          <Button 
            onClick={() => setLocation("/job-finder")}
            variant="outline"
            className="mb-6 border-white/10 text-gray-200 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>
          
          <JobListing 
            job={job} 
            userResume={resume}
            onTailoredResumeApplied={handleTailoredResumeApplied}
          />
        </div>
      </div>
    </>
  );
}