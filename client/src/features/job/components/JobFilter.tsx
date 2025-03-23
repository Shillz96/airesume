import React from 'react';
import { Search, MapPin, BriefcaseBusiness, Filter, Graduation, Wifi, DollarSign, Globe } from 'lucide-react';
import { Button } from '@/ui/core/Button';
import { JobFilterValues } from '../types';
import { cn } from '@/lib/utils';

interface JobFilterProps {
  initialValues?: JobFilterValues;
  onFilter: (values: JobFilterValues) => void;
}

/**
 * JobFilter component for filtering job search results
 * Integrated with the theme system for consistent styling
 */
export default function JobFilter({ initialValues, onFilter }: JobFilterProps) {
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
    setValues(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(values);
  };
  
  const handleReset = () => {
    const resetValues = {
      title: '',
      location: '',
      type: '',
      experience: '',
      remote: '',
      salary: '',
      country: 'us'
    };
    setValues(resetValues);
    onFilter(resetValues);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Job Title Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              name="title"
              value={values.title}
              onChange={handleChange}
              className={cn(
                "w-full pl-10 py-2 pr-4 rounded-md border border-border bg-background",
                "focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              )}
              placeholder="Job title or keyword"
            />
          </div>
          
          {/* Location */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              name="location"
              value={values.location}
              onChange={handleChange}
              className={cn(
                "w-full pl-10 py-2 pr-4 rounded-md border border-border bg-background",
                "focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              )}
              placeholder="City, state, or zip"
            />
          </div>
          
          {/* Country */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-4 w-4 text-muted-foreground" />
            </div>
            <select
              name="country"
              value={values.country}
              onChange={handleChange}
              className={cn(
                "w-full pl-10 py-2 pr-4 rounded-md border border-border bg-background",
                "focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary",
                "appearance-none"
              )}
            >
              <option value="us">United States</option>
              <option value="ca">Canada</option>
              <option value="uk">United Kingdom</option>
              <option value="au">Australia</option>
              <option value="de">Germany</option>
              <option value="fr">France</option>
              <option value="in">India</option>
            </select>
          </div>
          
          {/* Job Type */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />
            </div>
            <select
              name="type"
              value={values.type}
              onChange={handleChange}
              className={cn(
                "w-full pl-10 py-2 pr-4 rounded-md border border-border bg-background",
                "focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary",
                "appearance-none"
              )}
            >
              <option value="">Job Type</option>
              <option value="full_time">Full-Time</option>
              <option value="part_time">Part-Time</option>
              <option value="contract">Contract</option>
              <option value="temporary">Temporary</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          
          {/* Experience Level */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Graduation className="h-4 w-4 text-muted-foreground" />
            </div>
            <select
              name="experience"
              value={values.experience}
              onChange={handleChange}
              className={cn(
                "w-full pl-10 py-2 pr-4 rounded-md border border-border bg-background",
                "focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary",
                "appearance-none"
              )}
            >
              <option value="">Experience Level</option>
              <option value="entry_level">Entry Level</option>
              <option value="mid_level">Mid Level</option>
              <option value="senior_level">Senior Level</option>
              <option value="manager">Manager</option>
              <option value="executive">Executive</option>
            </select>
          </div>
          
          {/* Remote/Onsite */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Wifi className="h-4 w-4 text-muted-foreground" />
            </div>
            <select
              name="remote"
              value={values.remote}
              onChange={handleChange}
              className={cn(
                "w-full pl-10 py-2 pr-4 rounded-md border border-border bg-background",
                "focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary",
                "appearance-none"
              )}
            >
              <option value="">Workplace Type</option>
              <option value="remote">Remote</option>
              <option value="onsite">On-site</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          
          {/* Salary Range */}
          <div className="relative md:col-span-2 lg:col-span-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
            <select
              name="salary"
              value={values.salary}
              onChange={handleChange}
              className={cn(
                "w-full pl-10 py-2 pr-4 rounded-md border border-border bg-background",
                "focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary",
                "appearance-none"
              )}
            >
              <option value="">Salary Range</option>
              <option value="0-30000">Under $30,000</option>
              <option value="30000-50000">$30,000 - $50,000</option>
              <option value="50000-70000">$50,000 - $70,000</option>
              <option value="70000-100000">$70,000 - $100,000</option>
              <option value="100000-150000">$100,000 - $150,000</option>
              <option value="150000-9999999">$150,000+</option>
            </select>
          </div>
          
          {/* Action Buttons */}
          <div className="md:col-span-2 lg:col-span-2 flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="px-4"
            >
              Reset
            </Button>
            <Button
              type="submit"
              iconLeft={<Filter className="h-4 w-4" />}
              className="px-4"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

// Map icon component for location searches
function MapIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}