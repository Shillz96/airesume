import React from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { 
  Bookmark, ExternalLink, Building, MapPin, 
  Briefcase, Clock, Star, Heart, Share2, 
  Cpu, Eye 
} from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useGuestMode } from '@/hooks/use-guest-mode';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/ui/core/Button';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
}

/**
 * JobCard component displays information about a job posting with actions
 * Consistent with the theme system for uniform styling
 */
export default function JobCard({ job }: JobCardProps) {
  const { toast } = useToast();
  const { isGuestMode, showGuestModal } = useGuestMode();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  const { mutate: toggleSaveJob } = useMutation({
    mutationFn: async () => {
      await apiRequest(`/api/jobs/${job.id}/toggle-save`, {
        method: 'POST'
      });
    },
    onMutate: async () => {
      // Optimistically update the UI
      const previousJobs = queryClient.getQueryData(['/api/jobs']);
      
      queryClient.setQueryData(['/api/jobs'], (old: any) => {
        return old.map((j: Job) => 
          j.id === job.id ? { ...j, saved: !j.saved } : j
        );
      });
      
      return { previousJobs };
    },
    onError: (err, _, context) => {
      // Revert to previous state if save fails
      queryClient.setQueryData(['/api/jobs'], context?.previousJobs);
      toast({
        title: "Error",
        description: "Failed to save job. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Handler for actions that require authentication
  const handleAuthRequiredAction = (action: () => void) => {
    if (isGuestMode && !user) {
      showGuestModal();
    } else {
      action();
    }
  };

  const getMatchColor = () => {
    if (job.match && job.match >= 85) return "bg-green-500";
    if (job.match && job.match >= 70) return "bg-green-500";
    return "bg-yellow-500";
  };

  // Calculate success chance based on match score
  const getSuccessChance = (): number => {
    if (!job.match) return 50;
    if (job.match >= 90) return Math.floor(85 + Math.random() * 15);
    if (job.match >= 80) return Math.floor(70 + Math.random() * 15);
    if (job.match >= 70) return Math.floor(55 + Math.random() * 15);
    if (job.match >= 60) return Math.floor(40 + Math.random() * 15);
    return Math.floor(20 + Math.random() * 20);
  };

  // Format salary information if available
  const getSalaryDisplay = (): string => {
    if (job.salary) return job.salary;
    
    // If no salary provided, generate based on title (for UI purposes only)
    const base = job.title.toLowerCase().includes('senior') ? 120000 : 
                job.title.toLowerCase().includes('lead') ? 140000 : 
                job.title.toLowerCase().includes('manager') ? 130000 : 90000;
    
    const min = Math.floor(base * 0.9 / 1000) * 1000;
    const max = Math.floor(base * 1.2 / 1000) * 1000;
    
    return `$${(min/1000).toFixed(0)}k-$${(max/1000).toFixed(0)}k`;
  };
  
  const successChance = getSuccessChance();
  const salaryDisplay = getSalaryDisplay();

  // Handler for the AI tailor resume feature
  const handleTailorResume = () => {
    // Navigate to the job details page
    setLocation(`/job/${job.id}`);
  };

  return (
    <div className="cosmic-card border border-border p-6 transition-all hover:border-primary/50 relative overflow-hidden group bg-card rounded-lg">
      {/* Background highlight effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out"></div>
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2">{job.title}</h3>
          <div className="flex items-center mt-1">
            <Building className="h-4 w-4 text-primary mr-1.5" />
            <span className="text-sm text-muted-foreground">{job.company}</span>
            <MapPin className="h-4 w-4 text-accent ml-3 mr-1.5" />
            <span className="text-sm text-muted-foreground">{job.location}</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center">
            {job.match && job.match >= 90 && <Star className="h-5 w-5 text-warning mr-1 animate-pulse" />}
            {job.match && (
              <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                job.match >= 85 ? "bg-success/80 text-success-foreground" : 
                job.match >= 75 ? "bg-info/80 text-info-foreground" : 
                job.match >= 60 ? "bg-warning/80 text-warning-foreground" : 
                "bg-destructive/80 text-destructive-foreground"
              }`}>
                {job.match}% Match
              </div>
            )}
          </div>
          {job.isNew && (
            <div className="mt-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
              New
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 relative z-10">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{job.description}</p>
        
        <div className="flex flex-wrap gap-1.5 mt-4 mb-4">
          {job.skills.slice(0, 5).map((skill, index) => (
            <div key={index} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
              {skill}
            </div>
          ))}
          {job.skills.length > 5 && (
            <div className="bg-secondary/20 text-secondary text-xs px-2 py-1 rounded-full">
              +{job.skills.length - 5} more
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground mt-4">
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1.5 text-primary" />
            <span className="font-medium text-foreground">Posted:</span> 
            <span className="ml-1">{job.postedAt}</span>
          </div>
          <div className="flex items-center">
            <Briefcase className="h-3.5 w-3.5 mr-1.5 text-primary" />
            <span className="font-medium text-foreground">Type:</span> 
            <span className="ml-1">{job.type}</span>
          </div>
          <div className="flex items-center">
            <Star className="h-3.5 w-3.5 mr-1.5 text-warning" />
            <span className="font-medium text-foreground">Success:</span> 
            <span className="ml-1 text-success">{successChance}%</span>
          </div>
          <div className="flex items-center">
            <Bookmark className="h-3.5 w-3.5 mr-1.5 text-accent" />
            <span className="font-medium text-foreground">Salary:</span> 
            <span className="ml-1">{salaryDisplay}</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-5 pt-4 border-t border-border relative z-10">
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleAuthRequiredAction(toggleSaveJob)}
            iconLeft={<Heart className={`h-4 w-4 ${job.saved ? "fill-destructive text-destructive" : "text-destructive"}`} />}
          >
            {job.saved ? "Saved" : "Save"}
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            iconLeft={<Share2 className="h-4 w-4 text-primary" />}
          >
            Share
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setLocation(`/job/${job.id}`)}
            iconLeft={<Eye className="h-4 w-4 text-primary" />}
          >
            View Details
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleAuthRequiredAction(handleTailorResume)}
            iconLeft={<Cpu className="h-4 w-4 animate-pulse" />}
          >
            AI-Tailor Resume
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => handleAuthRequiredAction(() => window.open(job.applyUrl, "_blank"))}
            iconLeft={<ExternalLink className="h-4 w-4" />}
          >
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
}