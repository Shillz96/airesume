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
    <Card className="cosmic-card border border-white/10 bg-black/40 shadow-lg backdrop-blur-md relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 opacity-70"></div>
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center">
          <Search className="mr-2 h-5 w-5 text-blue-400" />
          Search & Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Label htmlFor="job-title" className="text-gray-300">Job Title</Label>
              <Input
                id="job-title"
                placeholder="e.g. Software Engineer"
                value={filterValues.title}
                onChange={handleTitleChange}
                className="mt-1 bg-black/60 border-white/10 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              {titleSuggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-black/90 rounded-md shadow-lg max-h-60 overflow-auto border border-white/10">
                  <ul className="py-1">
                    {titleSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 hover:bg-blue-900/30 cursor-pointer text-sm text-gray-300 hover:text-white"
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
              <Label htmlFor="location" className="text-gray-300">Location</Label>
              <Input
                id="location"
                placeholder="e.g. New York, NY"
                value={filterValues.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="mt-1 bg-black/60 border-white/10 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <Label htmlFor="job-type" className="text-gray-300">Job Type</Label>
              <Select
                value={filterValues.type}
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger 
                  id="job-type" 
                  className="mt-1 bg-black/60 border-white/10 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                >
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border border-white/10 text-gray-200">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="experience-level" className="text-gray-300">Experience Level</Label>
              <Select
                value={filterValues.experience}
                onValueChange={(value) => handleInputChange("experience", value)}
              >
                <SelectTrigger 
                  id="experience-level" 
                  className="mt-1 bg-black/60 border-white/10 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                >
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border border-white/10 text-gray-200">
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
              <Label htmlFor="remote-option" className="text-gray-300">Remote Options</Label>
              <Select
                value={filterValues.remote}
                onValueChange={(value) => handleInputChange("remote", value)}
              >
                <SelectTrigger 
                  id="remote-option" 
                  className="mt-1 bg-black/60 border-white/10 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                >
                  <SelectValue placeholder="Remote Options" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border border-white/10 text-gray-200">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="remote">Remote Only</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="on-site">On-Site Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="salary-range" className="text-gray-300">Salary Range</Label>
              <Select
                value={filterValues.salary}
                onValueChange={(value) => handleInputChange("salary", value)}
              >
                <SelectTrigger 
                  id="salary-range" 
                  className="mt-1 bg-black/60 border-white/10 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                >
                  <SelectValue placeholder="Salary Range" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border border-white/10 text-gray-200">
                  <SelectItem value="all">All Ranges</SelectItem>
                  <SelectItem value="50k-75k">$50k-$75k</SelectItem>
                  <SelectItem value="75k-100k">$75k-$100k</SelectItem>
                  <SelectItem value="100k-150k">$100k-$150k</SelectItem>
                  <SelectItem value="150k+">$150k+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                type="submit" 
                className="w-full flex items-center justify-center gap-2 mt-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0"
              >
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
