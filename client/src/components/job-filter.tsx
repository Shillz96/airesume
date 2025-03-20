import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export interface JobFilterValues {
  title: string;
  location: string;
  type: string;
  experience: string;
  remote: string;
  salary: string;
}

interface JobFilterProps {
  initialValues?: JobFilterValues;
  onFilter: (values: JobFilterValues) => void;
}

export default function JobFilter({ initialValues, onFilter }: JobFilterProps) {
  const [filterValues, setFilterValues] = useState<JobFilterValues>(
    initialValues || {
      title: "",
      location: "",
      type: "all",
      experience: "all",
      remote: "all",
      salary: "all",
    }
  );
  
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleInputChange("title", value);
    
    // Simulate autocomplete suggestions
    if (value.length > 2) {
      setTitleSuggestions([
        "Software Engineer",
        "Senior Software Engineer",
        "Frontend Developer",
        "Backend Developer",
        "Data Scientist",
        "Product Manager",
        "UX Designer",
      ].filter(suggestion => 
        suggestion.toLowerCase().includes(value.toLowerCase())
      ));
    } else {
      setTitleSuggestions([]);
    }
  };

  const handleInputChange = (field: keyof JobFilterValues, value: string) => {
    setFilterValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filterValues);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Search & Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Label htmlFor="job-title">Job Title</Label>
              <Input
                id="job-title"
                placeholder="e.g. Software Engineer"
                value={filterValues.title}
                onChange={handleTitleChange}
                className="mt-1"
              />
              {titleSuggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto border border-secondary-200">
                  <ul className="py-1">
                    {titleSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 hover:bg-secondary-100 cursor-pointer text-sm"
                        onClick={() => {
                          handleInputChange("title", suggestion);
                          setTitleSuggestions([]);
                        }}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g. New York, NY"
                value={filterValues.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="job-type">Job Type</Label>
              <Select
                value={filterValues.type}
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger id="job-type" className="mt-1">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="experience-level">Experience Level</Label>
              <Select
                value={filterValues.experience}
                onValueChange={(value) => handleInputChange("experience", value)}
              >
                <SelectTrigger id="experience-level" className="mt-1">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="mid">Mid Level</SelectItem>
                  <SelectItem value="senior">Senior Level</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="remote-option">Remote Options</Label>
              <Select
                value={filterValues.remote}
                onValueChange={(value) => handleInputChange("remote", value)}
              >
                <SelectTrigger id="remote-option" className="mt-1">
                  <SelectValue placeholder="Remote Options" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="remote">Remote Only</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="on-site">On-Site Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="salary-range">Salary Range</Label>
              <Select
                value={filterValues.salary}
                onValueChange={(value) => handleInputChange("salary", value)}
              >
                <SelectTrigger id="salary-range" className="mt-1">
                  <SelectValue placeholder="Salary Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ranges</SelectItem>
                  <SelectItem value="50k-75k">$50k-$75k</SelectItem>
                  <SelectItem value="75k-100k">$75k-$100k</SelectItem>
                  <SelectItem value="100k-150k">$100k-$150k</SelectItem>
                  <SelectItem value="150k+">$150k+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button type="submit" className="w-full flex items-center justify-center gap-2 mt-1">
                <Search className="h-4 w-4" />
                Apply Filters
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
