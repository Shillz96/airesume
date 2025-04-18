import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

import JobListing from "@/features/job/components/JobListing";
import { Job, UserResume } from "@/features/job/types";
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
import PageHeader from "@/features/layout/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";


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
  const { data: resume } = useQuery<UserResume | null>({
    queryKey: ['/api/resumes/latest'],
    queryFn: ({ signal, meta }) => {
      const internalQueryFn = getQueryFn({ on401: "returnNull" });
      return internalQueryFn({
        queryKey: ['/api/resumes/latest'], 
        signal, 
        meta 
      }) as Promise<UserResume | null>;
    },
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
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-screen-xl -mt-4 pb-10 min-h-screen relative z-10 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-gray-300">Loading job details...</p>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error || !job) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-screen-xl -mt-4 pb-10 min-h-screen relative z-10">
        <PageHeader
          title="Job Not Found"
          subtitle="The job you're looking for doesn't exist or was removed"
        />
        <Card className="border-white/10 rounded-lg p-8 text-center mt-8">
          <CardContent className="p-0">
            <Briefcase className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-gray-300 mb-6">Please try searching for another job position.</p>
            <Button 
              onClick={() => setLocation("/job-finder")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-screen-xl -mt-4 pb-10 min-h-screen relative z-10">
      <PageHeader
        title={job.title}
        subtitle={`${job.company} · ${job.location}`}
        actions={
          <Button 
            onClick={() => setLocation("/job-finder")}
            variant="outline"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>
        }
      />

      {/* Rest of the component content */}
    </div>
  );
}