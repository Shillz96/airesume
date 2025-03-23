import React from 'react';
import { useLocation } from 'wouter';
import { Bookmark, Clock, MapPin, Star, Award, Building, CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '@/ui/core/Button';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
}

/**
 * JobCard component displays information about a job posting with actions
 * Consistent with the theme system for uniform styling
 */
export default function JobCard({ job }: JobCardProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Format the posted date
  const formattedDate = job.postedAt ? format(parseISO(job.postedAt), 'MMM d, yyyy') : 'Recently';
  
  // Handle saving/unsaving a job
  const toggleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await apiRequest(`/api/jobs/${job.id}/save`, {
        method: 'POST'
      });
      
      // Update the local state optimistically
      queryClient.setQueryData(['/api/jobs'], (old: Job[] | undefined) => {
        if (!old) return undefined;
        return old.map((j: Job) => 
          j.id === job.id ? { ...j, saved: !j.saved } : j
        );
      });
      
      toast({
        title: job.saved ? 'Job removed from saved' : 'Job saved',
        description: job.saved 
          ? 'The job has been removed from your saved jobs.' 
          : 'The job has been added to your saved jobs.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error saving the job. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Handle clicking on a job card to view details
  const handleClick = () => {
    navigate(`/job/${job.id}`);
  };

  return (
    <div 
      className={cn(
        "p-4 rounded-lg border border-border cursor-pointer transition-all",
        "hover:shadow-md hover:border-primary/30 bg-card"
      )}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground truncate">{job.title}</h3>
              <p className="text-sm text-muted-foreground">{job.company}</p>
            </div>
            {typeof job.match === 'number' && (
              <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                <Star className="h-3.5 w-3.5" />
                <span>{job.match}% match</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2 mb-3">
            {job.location && (
              <div className="flex items-center text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                <span>{job.location}</span>
              </div>
            )}
            {job.type && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Building className="h-3.5 w-3.5 mr-1" />
                <span>{job.type}</span>
              </div>
            )}
            {job.salary && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Award className="h-3.5 w-3.5 mr-1" />
                <span>{job.salary}</span>
              </div>
            )}
            {job.postedAt && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5 mr-1" />
                <span>{formattedDate}</span>
              </div>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {job.description}
          </p>
          
          {job.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {job.skills.slice(0, 3).map((skill, index) => (
                <span 
                  key={index} 
                  className="px-2 py-0.5 bg-background text-foreground rounded-full text-xs border border-border"
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 3 && (
                <span className="px-2 py-0.5 bg-background text-muted-foreground rounded-full text-xs border border-border">
                  +{job.skills.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
        <div className="flex items-center space-x-2">
          {job.isNew && (
            <span className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded-full text-xs font-medium">
              New
            </span>
          )}
          {job.remote && (
            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded-full text-xs font-medium">
              Remote
            </span>
          )}
          {job.saved && (
            <div className="flex items-center text-xs text-primary">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              <span>Saved</span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSave}
            iconLeft={<Bookmark className={cn("h-4 w-4", job.saved && "fill-primary text-primary")} />}
            className="text-xs"
          >
            {job.saved ? 'Saved' : 'Save'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            iconRight={<ChevronRight className="h-4 w-4" />}
            className="text-xs"
          >
            View
          </Button>
        </div>
      </div>
    </div>
  );
}