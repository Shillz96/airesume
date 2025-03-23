import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

import JobListing from "@/features/job/components/JobListing";
import { Job } from "@/features/job/types";
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
import { UnifiedContainer, UnifiedPageHeader } from "@/components/unified";


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
      <UnifiedContainer className="pb-10 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-gray-300">Loading job details...</p>
        </div>
      </UnifiedContainer>
    );
  }
  
  // Show error state
  if (error || !job) {
    return (
      <UnifiedContainer className="pb-10 min-h-screen">
        <UnifiedPageHeader
          title="Job Not Found"
          subtitle="The job you're looking for doesn't exist or was removed"
          variant="cosmic"
          borderStyle="gradient"
        />
        <div className="cosmic-card border border-white/10 rounded-lg p-8 text-center mt-8">
          <Briefcase className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-300 mb-6">Please try searching for another job position.</p>
          <Button 
            onClick={() => setLocation("/job-finder")}
            className="cosmic-glow bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>
        </div>
      </UnifiedContainer>
    );
  }

  return (
    <UnifiedContainer className="pb-10 min-h-screen">
      <UnifiedPageHeader
        title={job.title}
        subtitle={`${job.company} · ${job.location}`}
        variant="cosmic"
        borderStyle="gradient"
        actions={
          <Button 
            onClick={() => setLocation("/job-finder")}
            variant="outline"
            className="cosmic-gradient-border text-gray-200 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>
        }
      />
      
      <div className="mt-6">
        <JobListing 
          job={job} 
          userResume={resume}
          onTailoredResumeApplied={handleTailoredResumeApplied}
        />
      </div>
    </UnifiedContainer>
  );
}