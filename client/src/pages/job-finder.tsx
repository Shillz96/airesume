import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import JobCard, { Job } from "@/components/job-card";
import JobFilter, { JobFilterValues } from "@/components/job-filter";
import { AlertTriangle, Cpu, Star, Share2, Heart, Briefcase, Clock, Building } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

export default function JobFinder() {
  const [filterValues, setFilterValues] = useState<JobFilterValues>({
    title: "",
    location: "",
    type: "all",
    experience: "all",
    remote: "all",
    salary: "all",
  });
  
  const [statusFilter, setStatusFilter] = useState("all");
  
  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ["/api/jobs", filterValues, statusFilter],
    refetchInterval: false,
  });
  
  const handleFilter = (values: JobFilterValues) => {
    setFilterValues(values);
  };
  
  // Filter jobs based on status (all, saved, applied, interviewing, rejected)
  const filteredJobs = Array.isArray(jobs) && jobs.length > 0 
    ? jobs.filter((job: Job) => {
        if (statusFilter === "all") return true;
        if (statusFilter === "saved") return job.saved;
        // For demo purposes we'll simulate other statuses based on the job ID
        if (statusFilter === "applied") return parseInt(job.id.toString()) % 3 === 0;
        if (statusFilter === "interviewing") return parseInt(job.id.toString()) % 5 === 0;
        if (statusFilter === "rejected") return parseInt(job.id.toString()) % 7 === 0;
        return true;
      })
    : [];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E2A44] to-[#121212] text-white">
      <Navbar />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white">Job Finder</h1>
              <p className="mt-1 text-sm text-gray-300">AI-matched job opportunities based on your resume.</p>
            </div>
            
            {/* Job Search and Filters */}
            <JobFilter initialValues={filterValues} onFilter={handleFilter} />
            
            {/* AI Match Score Section */}
            <div className="my-6 p-4 bg-white shadow rounded-lg border-l-4 border-accent-500">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Cpu className="h-5 w-5 text-accent-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-secondary-900">AI-Powered Job Matching</h3>
                  <div className="mt-2 text-sm text-secondary-500">
                    <p>Based on your resume, our AI has found jobs that match your skills and experience. Jobs with higher match scores align better with your profile.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Status Tabs */}
            <Tabs value={statusFilter} onValueChange={setStatusFilter} className="mb-6">
              <TabsList className="w-full bg-white border border-secondary-200 p-1 rounded-lg">
                <TabsTrigger 
                  value="all" 
                  className="flex-1 data-[state=active]:bg-accent-100 data-[state=active]:text-accent-700"
                >
                  All Jobs
                </TabsTrigger>
                <TabsTrigger 
                  value="saved" 
                  className="flex-1 data-[state=active]:bg-accent-100 data-[state=active]:text-accent-700"
                >
                  Saved
                </TabsTrigger>
                <TabsTrigger 
                  value="applied" 
                  className="flex-1 data-[state=active]:bg-accent-100 data-[state=active]:text-accent-700"
                >
                  Applied
                </TabsTrigger>
                <TabsTrigger 
                  value="interviewing" 
                  className="flex-1 data-[state=active]:bg-accent-100 data-[state=active]:text-accent-700"
                >
                  Interviewing
                </TabsTrigger>
                <TabsTrigger 
                  value="rejected" 
                  className="flex-1 data-[state=active]:bg-accent-100 data-[state=active]:text-accent-700"
                >
                  Rejected
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Recommended Jobs Section */}
            {!isLoading && Array.isArray(jobs) && jobs.length > 0 && statusFilter === "all" && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-secondary-900 mb-4">Recommended for You</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobs
                    .filter((job: Job) => job.match >= 85)
                    .slice(0, 2)
                    .map((job: Job) => (
                      <div 
                        key={job.id}
                        className="bg-white p-4 rounded-lg border border-secondary-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-medium text-secondary-900">{job.title}</h3>
                            <p className="text-sm text-secondary-600">{job.company} · {job.location}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                            {job.match}% Match
                          </Badge>
                        </div>
                        <p className="text-sm text-secondary-600 line-clamp-2 mb-3">{job.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-secondary-500">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{job.postedAt}</span>
                          </div>
                          <div className="flex space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {job.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Job Listings */}
            <Card className="bg-white shadow rounded-lg overflow-hidden">
              {isLoading ? (
                <CardContent className="p-0">
                  <div className="divide-y divide-secondary-200">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <Skeleton className="h-5 w-1/3" />
                          <Skeleton className="h-5 w-24" />
                        </div>
                        <div className="flex mb-4 space-x-6">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-16 w-full mb-4" />
                        <div className="flex space-x-2 mb-4">
                          <Skeleton className="h-6 w-16 rounded-full" />
                          <Skeleton className="h-6 w-16 rounded-full" />
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                        <div className="flex justify-end space-x-3">
                          <Skeleton className="h-8 w-20" />
                          <Skeleton className="h-8 w-20" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              ) : error ? (
                <CardContent className="p-6 text-center">
                  <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-destructive mb-2">Error loading jobs</h3>
                  <p className="text-secondary-600">{(error as Error).message}</p>
                </CardContent>
              ) : filteredJobs.length > 0 ? (
                <>
                  <CardContent className="p-0">
                    <ul className="divide-y divide-secondary-200">
                      {filteredJobs.map((job: Job) => (
                        <li key={job.id}>
                          <JobCard job={job} />
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  
                  <div className="border-t border-secondary-200 px-4 py-3">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#" isActive>1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext href="#" />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </>
              ) : (
                <CardContent className="py-12 text-center">
                  <p className="text-secondary-500">
                    {statusFilter === "all" 
                      ? "No jobs found matching your criteria." 
                      : `No ${statusFilter} jobs found.`}
                  </p>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
