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
    }
  );

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
            <div>
              <Label htmlFor="job-title">Job Title</Label>
              <Input
                id="job-title"
                placeholder="e.g. Software Engineer"
                value={filterValues.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="mt-1"
              />
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
                  <SelectItem value="remote">Remote</SelectItem>
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
          
          <div className="mt-4 flex justify-end">
            <Button type="submit" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
