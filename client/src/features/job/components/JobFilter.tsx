import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/ui/core/Button';
import { JobFilterValues } from '../types';

interface JobFilterProps {
  initialValues?: JobFilterValues;
  onFilter: (values: JobFilterValues) => void;
}

/**
 * JobFilter component for filtering job search results
 * Integrated with the theme system for consistent styling
 */
export default function JobFilter({ initialValues, onFilter }: JobFilterProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [values, setValues] = React.useState<JobFilterValues>({
    title: initialValues?.title || '',
    location: initialValues?.location || '',
    type: initialValues?.type || '',
    experience: initialValues?.experience || '',
    remote: initialValues?.remote || '',
    salary: initialValues?.salary || '',
    country: initialValues?.country || 'us'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(values);
  };

  const handleReset = () => {
    setValues({
      title: '',
      location: '',
      type: '',
      experience: '',
      remote: '',
      salary: '',
      country: 'us'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-5 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              name="title"
              value={values.title}
              onChange={handleChange}
              placeholder="Job title, keywords, or company"
              className="bg-background border border-border rounded-md py-2 pl-10 pr-3 w-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              name="location"
              value={values.location}
              onChange={handleChange}
              placeholder="City, state, or remote"
              className="bg-background border border-border rounded-md py-2 pl-10 pr-3 w-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          
          <Button 
            type="submit" 
            className="shrink-0"
          >
            Find Jobs
          </Button>
          
          <Button
            type="button"
            variant="outline"
            className="shrink-0 flex md:hidden"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
        
        {/* Advanced filters */}
        <div className={`grid md:grid-cols-3 gap-4 ${isExpanded ? 'block' : 'hidden md:grid'}`}>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Job Type</label>
            <select
              name="type"
              value={values.type}
              onChange={handleChange}
              className="bg-background border border-border rounded-md py-2 px-3 w-full text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Experience Level</label>
            <select
              name="experience"
              value={values.experience}
              onChange={handleChange}
              className="bg-background border border-border rounded-md py-2 px-3 w-full text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              <option value="">All Levels</option>
              <option value="Entry level">Entry level</option>
              <option value="Mid level">Mid level</option>
              <option value="Senior level">Senior level</option>
              <option value="Director">Director</option>
              <option value="Executive">Executive</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Remote Options</label>
            <select
              name="remote"
              value={values.remote}
              onChange={handleChange}
              className="bg-background border border-border rounded-md py-2 px-3 w-full text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              <option value="">All Locations</option>
              <option value="remote">Remote only</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site only</option>
            </select>
          </div>
        </div>
        
        {/* Filter actions on mobile */}
        {isExpanded && (
          <div className="flex justify-between mt-4 md:hidden">
            <Button
              type="button"
              variant="ghost"
              onClick={handleReset}
            >
              <X className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button type="submit">
              Apply Filters
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}

// Map Icon Component
function MapIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2a6 6 0 0 0-6 6c0 3.5 6 12 6 12s6-8.5 6-12a6 6 0 0 0-6-6z" />
      <circle cx="12" cy="8" r="2" />
    </svg>
  );
}