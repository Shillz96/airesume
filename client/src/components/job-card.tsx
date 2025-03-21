import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, ExternalLink, Building, MapPin, Briefcase, Clock, Star, Heart, Share2, Cpu, Eye } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useGuestMode } from "@/hooks/use-guest-mode";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  match: number;
  postedAt: string;
  isNew: boolean;
  skills: string[];
  saved: boolean;
  applyUrl: string;
}

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const { toast } = useToast();
  const { isGuestMode, showGuestModal } = useGuestMode();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  const { mutate: toggleSaveJob } = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/jobs/${job.id}/toggle-save`);
    },
    onMutate: async () => {
      // Optimistically update the UI
      const previousJobs = queryClient.getQueryData(["/api/jobs"]);
      
      queryClient.setQueryData(["/api/jobs"], (old: any) => {
        return old.map((j: Job) => 
          j.id === job.id ? { ...j, saved: !j.saved } : j
        );
      });
      
      return { previousJobs };
    },
    onError: (err, _, context) => {
      // Revert to previous state if save fails
      queryClient.setQueryData(["/api/jobs"], context?.previousJobs);
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
    if (job.match >= 85) return "bg-green-500";
    if (job.match >= 70) return "bg-green-500";
    return "bg-yellow-500";
  };

  // Calculate success chance based on match score (for demo purposes)
  const getSuccessChance = (): number => {
    if (job.match >= 90) return Math.floor(85 + Math.random() * 15);
    if (job.match >= 80) return Math.floor(70 + Math.random() * 15);
    if (job.match >= 70) return Math.floor(55 + Math.random() * 15);
    if (job.match >= 60) return Math.floor(40 + Math.random() * 15);
    return Math.floor(20 + Math.random() * 20);
  };

  // Simulate a salary range based on job title and match (for demo purposes)
  const getSalaryRange = (): string => {
    const base = job.title.toLowerCase().includes('senior') ? 120000 : 
                 job.title.toLowerCase().includes('lead') ? 140000 : 
                 job.title.toLowerCase().includes('manager') ? 130000 : 90000;
    
    const min = Math.floor(base * 0.9 / 1000) * 1000;
    const max = Math.floor(base * 1.2 / 1000) * 1000;
    
    return `$${(min/1000).toFixed(0)}k-$${(max/1000).toFixed(0)}k`;
  };
  
  const successChance = getSuccessChance();
  const salaryRange = getSalaryRange();

  // Handler for the AI tailor resume feature
  const handleTailorResume = () => {
    // Navigate to the job details page instead
    setLocation(`/job/${job.id}`);
  };

  return (
    <div className="cosmic-card border border-white/10 p-6 transition-all hover:border-blue-500/50 relative overflow-hidden group">
      {/* Background highlight effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out"></div>
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">{job.title}</h3>
          <div className="flex items-center mt-1">
            <Building className="h-4 w-4 text-blue-400 mr-1.5" />
            <span className="text-sm text-gray-300">{job.company}</span>
            <MapPin className="h-4 w-4 text-purple-400 ml-3 mr-1.5" />
            <span className="text-sm text-gray-300">{job.location}</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center">
            {job.match >= 90 && <Star className="h-5 w-5 text-yellow-400 mr-1 animate-pulse" />}
            <Badge className={`${
              job.match >= 85 ? "bg-gradient-to-r from-green-700/80 to-green-600/80 text-green-100 border-0" : 
              job.match >= 75 ? "bg-gradient-to-r from-blue-700/80 to-blue-600/80 text-blue-100 border-0" : 
              job.match >= 60 ? "bg-gradient-to-r from-yellow-700/80 to-yellow-600/80 text-yellow-100 border-0" : 
              "bg-gradient-to-r from-red-700/80 to-red-600/80 text-red-100 border-0"
            }`}>
              {job.match}% Match
            </Badge>
          </div>
          {job.isNew && (
            <Badge variant="outline" className="mt-1 bg-blue-900/30 text-blue-300 border-blue-500/30">
              New
            </Badge>
          )}
        </div>
      </div>
      
      <div className="mt-4 relative z-10">
        <p className="text-sm text-gray-300 line-clamp-2 mb-3">{job.description}</p>
        
        <div className="flex flex-wrap gap-1.5 mt-4 mb-4">
          {job.skills.slice(0, 5).map((skill, index) => (
            <Badge key={index} variant="outline" className="bg-blue-900/20 text-blue-300 border-blue-500/30 text-xs">
              {skill}
            </Badge>
          ))}
          {job.skills.length > 5 && (
            <Badge variant="outline" className="bg-purple-900/20 text-purple-300 border-purple-500/30 text-xs">
              +{job.skills.length - 5} more
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-xs text-gray-300 mt-4">
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
            <span className="font-medium text-gray-200">Posted:</span> 
            <span className="ml-1">{job.postedAt}</span>
          </div>
          <div className="flex items-center">
            <Briefcase className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
            <span className="font-medium text-gray-200">Type:</span> 
            <span className="ml-1">{job.type}</span>
          </div>
          <div className="flex items-center">
            <Star className="h-3.5 w-3.5 mr-1.5 text-yellow-400" />
            <span className="font-medium text-gray-200">Success:</span> 
            <span className="ml-1 text-green-400">{successChance}%</span>
          </div>
          <div className="flex items-center">
            <Bookmark className="h-3.5 w-3.5 mr-1.5 text-purple-400" />
            <span className="font-medium text-gray-200">Salary:</span> 
            <span className="ml-1">{salaryRange}</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-5 pt-4 border-t border-white/10 relative z-10">
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleAuthRequiredAction(toggleSaveJob)}
            className="text-gray-300 hover:text-white hover:bg-white/10"
          >
            <Heart className={`h-4 w-4 mr-1.5 ${job.saved ? "fill-red-500 text-red-500" : "text-red-400"}`} />
            {job.saved ? "Saved" : "Save"}
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-300 hover:text-white hover:bg-white/10" 
          >
            <Share2 className="h-4 w-4 mr-1.5 text-blue-400" />
            Share
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setLocation(`/job/${job.id}`)}
            className="text-gray-300 hover:text-white hover:bg-white/10" 
          >
            <Eye className="h-4 w-4 mr-1.5 text-blue-400" />
            View Details
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleAuthRequiredAction(tailorResume)}
            className="border-blue-500/30 text-blue-300 hover:bg-blue-900/30 hover:border-blue-500/50"
          >
            <Cpu className="h-4 w-4 mr-1.5 animate-pulse" />
            AI-Tailor Resume
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => handleAuthRequiredAction(() => window.open(job.applyUrl, "_blank"))}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <ExternalLink className="h-4 w-4 mr-1.5" />
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
}
