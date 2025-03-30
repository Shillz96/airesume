import React from 'react';
import { useLocation } from 'wouter';
import { Bookmark, Clock, MapPin, Star, Award, Building, CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      await apiRequest(
        'POST',
        `/api/jobs/${job.id}/save`
      );
      
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
      className="solid-card cursor-pointer transition-all p-4"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="no-blur">
              <h3 className="text-lg font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent truncate">{job.title}</h3>
              <p className="text-sm text-gray-300 truncate">{job.company} · {job.location}</p>
            </div>
            {typeof job.match === 'number' && (
              <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium no-blur">
                <Star className="h-3.5 w-3.5" />
                <span>{job.match}% match</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2 mb-3 no-blur">
            {job.location && (
              <div className="flex items-center text-xs text-gray-400">
                <MapPin className="h-3.5 w-3.5 mr-1 text-primary" />
                <span>{job.location}</span>
              </div>
            )}
            {job.type && (
              <div className="flex items-center text-xs text-gray-400">
                <Building className="h-3.5 w-3.5 mr-1 text-primary" />
                <span>{job.type}</span>
              </div>
            )}
            {job.salary && (
              <div className="flex items-center text-xs text-gray-400">
                <Award className="h-3.5 w-3.5 mr-1 text-primary" />
                <span>{job.salary}</span>
              </div>
            )}
            {job.postedAt && (
              <div className="flex items-center text-xs text-gray-400">
                <Clock className="h-3.5 w-3.5 mr-1 text-primary" />
                <span>{formattedDate}</span>
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-400 line-clamp-2 mb-3 no-blur">
            {job.description}
          </p>
          
          {job.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {job.skills.slice(0, 3).map((skill, index) => (
                <span 
                  key={index} 
                  className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs border border-primary/30 no-blur"
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 3 && (
                <span className="px-2 py-0.5 bg-card/90 text-gray-400 rounded-full text-xs border-white/10 no-blur">
                  +{job.skills.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10 dark:border-gray-700/30">
        <Button variant="outline" size="sm" onClick={toggleSave} className="gap-1">
          {job.saved ? <Bookmark size={14} fill="currentColor" /> : <Bookmark size={14} />}
          {job.saved ? 'Saved' : 'Save Job'}
        </Button>
        <Button variant="secondary" size="sm" className="font-semibold gap-1.5">
          Apply Now
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}