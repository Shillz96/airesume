import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, ExternalLink, Building, MapPin, Briefcase, Clock, Star, Heart, Share2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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

  // Generate a mutation for the AI tailor resume feature
  const { mutate: tailorResume } = useMutation({
    mutationFn: async () => {
      toast({
        title: "AI Resume Tailoring",
        description: "This feature would customize your resume for this specific job.",
      });
    }
  });

  return (
    <div className="bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-[rgba(255,255,255,0.2)] rounded-lg p-4 m-2 transition-all hover:shadow-[0_0_10px_rgba(0,212,255,0.2)] hover:scale-[1.01]">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-secondary-900">{job.title}</h3>
          <div className="flex items-center mt-1">
            <Building className="h-4 w-4 text-secondary-400 mr-1.5" />
            <span className="text-sm text-secondary-500">{job.company}</span>
            <MapPin className="h-4 w-4 text-secondary-400 ml-3 mr-1.5" />
            <span className="text-sm text-secondary-500">{job.location}</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center">
            {job.match >= 90 && <Star className="h-5 w-5 text-yellow-400 mr-1" />}
            <Badge className={`${
              job.match >= 85 ? "bg-green-100 text-green-800" : 
              job.match >= 75 ? "bg-blue-100 text-blue-800" : 
              job.match >= 60 ? "bg-yellow-100 text-yellow-800" : 
              "bg-red-100 text-red-800"
            }`}>
              {job.match}% Match
            </Badge>
          </div>
          {job.isNew && (
            <Badge variant="outline" className="mt-1 bg-blue-100 text-blue-800 border-blue-200">
              New
            </Badge>
          )}
        </div>
      </div>
      
      <div className="mt-3">
        <p className="text-sm text-secondary-600 line-clamp-2 mb-2">{job.description}</p>
        
        <div className="flex flex-wrap gap-1.5 mt-3 mb-3">
          {job.skills.slice(0, 5).map((skill, index) => (
            <Badge key={index} variant="outline" className="bg-secondary-100 text-secondary-800 text-xs">
              {skill}
            </Badge>
          ))}
          {job.skills.length > 5 && (
            <Badge variant="outline" className="bg-secondary-100 text-secondary-700 text-xs">
              +{job.skills.length - 5} more
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs text-secondary-600 mt-3">
          <div>
            <span className="font-medium">Posted:</span> {job.postedAt}
          </div>
          <div>
            <span className="font-medium">Type:</span> {job.type}
          </div>
          <div>
            <span className="font-medium">Success Chance:</span> {successChance}%
          </div>
          <div>
            <span className="font-medium">Est. Salary:</span> {salaryRange}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-secondary-200">
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => toggleSaveJob()}
            className="text-secondary-600 hover:text-secondary-900"
          >
            <Heart className={`h-4 w-4 mr-1.5 ${job.saved ? "fill-red-500 text-red-500" : ""}`} />
            {job.saved ? "Saved" : "Save"}
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-secondary-600 hover:text-secondary-900" 
          >
            <Share2 className="h-4 w-4 mr-1.5" />
            Share
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => tailorResume()}
            className="border-accent-300 text-accent-700 hover:bg-accent-50"
          >
            AI-Tailor Resume
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => window.open(job.applyUrl, "_blank")}
            className="bg-accent-600 hover:bg-accent-700"
          >
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
}
