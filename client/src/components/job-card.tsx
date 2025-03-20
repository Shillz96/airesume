import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, ExternalLink, Building, MapPin, Briefcase, Clock } from "lucide-react";
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

  return (
    <Card className="border-b">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h3 className="text-sm font-medium text-primary-600 truncate">{job.title}</h3>
            {job.isNew && (
              <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 text-xs">
                New
              </Badge>
            )}
          </div>
          <div className="ml-2 flex-shrink-0 flex items-center">
            <div className="flex items-center">
              <span className="text-xs font-medium text-secondary-500 mr-2">Match:</span>
              <div className="h-2 w-24 bg-secondary-200 rounded-full overflow-hidden">
                <div className={`h-full ${getMatchColor()} rounded-full`} style={{ width: `${job.match}%` }}></div>
              </div>
              <span className={`ml-2 text-xs font-medium ${
                job.match >= 85 ? "text-green-800" : job.match >= 70 ? "text-green-800" : "text-yellow-800"
              }`}>{job.match}%</span>
            </div>
          </div>
        </div>
        
        <div className="mt-2 sm:flex sm:justify-between">
          <div className="sm:flex flex-wrap gap-y-2">
            <p className="flex items-center text-sm text-secondary-500">
              <Building className="flex-shrink-0 mr-1.5 h-4 w-4 text-secondary-400" />
              {job.company}
            </p>
            <p className="mt-2 flex items-center text-sm text-secondary-500 sm:mt-0 sm:ml-6">
              <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-secondary-400" />
              {job.location}
            </p>
            <p className="mt-2 flex items-center text-sm text-secondary-500 sm:mt-0 sm:ml-6">
              <Briefcase className="flex-shrink-0 mr-1.5 h-4 w-4 text-secondary-400" />
              {job.type}
            </p>
          </div>
          <div className="mt-2 flex items-center text-sm text-secondary-500 sm:mt-0">
            <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-secondary-400" />
            <p>{job.postedAt}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-secondary-500 line-clamp-2">{job.description}</p>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {job.skills.map((skill, index) => (
            <Badge key={index} variant="outline" className="bg-blue-100 text-blue-800 text-xs">
              {skill}
            </Badge>
          ))}
        </div>
        
        <div className="mt-4 flex justify-end space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => toggleSaveJob()} 
            className={job.saved ? "text-primary-600 border-primary-200 bg-primary-50" : ""}
          >
            <Bookmark className={`h-4 w-4 mr-1 ${job.saved ? "fill-primary-600" : ""}`} />
            {job.saved ? "Saved" : "Save"}
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => window.open(job.applyUrl, "_blank")}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Apply
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
