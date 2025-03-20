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
import { useGuestMode } from "@/hooks/use-guest-mode";
import { useAuth } from "@/hooks/use-auth";
import { getQueryFn } from "@/lib/queryClient";

export default function JobFinder() {
  const { isGuestMode } = useGuestMode();
  const { user } = useAuth();
  const [filterValues, setFilterValues] = useState<JobFilterValues>({
    title: "",
    location: "",
    type: "all",
    experience: "all",
    remote: "all",
    salary: "all",
  });
  
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Modified to support guest mode access to jobs
  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ["/api/jobs", filterValues, statusFilter, isGuestMode],
    queryFn: isGuestMode && !user 
      ? () => getQueryFn({ on401: "returnNull" })({
          queryKey: ["/api/jobs", { ...filterValues, guest: true }],
        })
      : undefined,
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
    <div className="min-h-screen bg-black cosmic-background">
      <Navbar />
      
      <main className="pt-24">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
              <h1 className="text-3xl font-bold cosmic-text-gradient">Job Finder</h1>
              <p className="mt-2 text-gray-300">
                AI-matched job opportunities based on your resume profile and skills.
              </p>
            </div>
            
            {/* Job Search and Filters */}
            <JobFilter initialValues={filterValues} onFilter={handleFilter} />
            
            {/* AI Match Score Section */}
            <div className="my-8 p-4 cosmic-card border border-white/10 rounded-lg overflow-hidden relative">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/10 to-transparent" />
              <div className="flex relative z-10">
                <div className="flex-shrink-0">
                  <Cpu className="h-6 w-6 text-blue-400 animate-pulse" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-blue-300">AI-Powered Job Matching</h3>
                  <div className="mt-2 text-sm text-gray-300">
                    <p>Based on your resume, our AI has found jobs that match your skills and experience. Jobs with higher match scores align better with your profile and have greater potential for success.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Status Tabs */}
            <Tabs value={statusFilter} onValueChange={setStatusFilter} className="mb-8 cosmic-tabs">
              <TabsList className="w-full bg-black/40 border border-white/10 p-1 rounded-lg">
                <TabsTrigger 
                  value="all" 
                  className="flex-1 data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300 text-gray-300"
                >
                  All Jobs
                </TabsTrigger>
                <TabsTrigger 
                  value="saved" 
                  className="flex-1 data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300 text-gray-300"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Saved
                </TabsTrigger>
                <TabsTrigger 
                  value="applied" 
                  className="flex-1 data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300 text-gray-300"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Applied
                </TabsTrigger>
                <TabsTrigger 
                  value="interviewing" 
                  className="flex-1 data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300 text-gray-300"
                >
                  <Building className="h-4 w-4 mr-2" />
                  Interviewing
                </TabsTrigger>
                <TabsTrigger 
                  value="rejected" 
                  className="flex-1 data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300 text-gray-300"
                >
                  Rejected
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Recommended Jobs Section */}
            {!isLoading && Array.isArray(jobs) && jobs.length > 0 && statusFilter === "all" && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-400" />
                  Recommended for You
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobs
                    .filter((job: Job) => job.match >= 85)
                    .slice(0, 2)
                    .map((job: Job) => (
                      <div 
                        key={job.id}
                        className="cosmic-card border border-white/10 p-5 rounded-lg hover:border-blue-500/50 transition-all duration-300"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-medium text-white text-lg">{job.title}</h3>
                            <p className="text-sm text-gray-300">{job.company} · {job.location}</p>
                          </div>
                          <Badge className="bg-gradient-to-r from-green-700/80 to-green-600/80 text-green-100 hover:from-green-600/80 hover:to-green-500/80 border-0">
                            {job.match}% Match
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-300 line-clamp-2 mb-3">{job.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-gray-400">
                            <Clock className="h-3 w-3 mr-1 text-blue-400" />
                            <span>{job.postedAt}</span>
                          </div>
                          <div className="flex space-x-2">
                            <Badge variant="outline" className="text-xs border-white/20 text-blue-300 bg-blue-900/20">
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
            <Card className="cosmic-card border-white/10 rounded-lg overflow-hidden bg-transparent">
              {isLoading ? (
                <CardContent className="p-0">
                  <div className="divide-y divide-white/5">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <Skeleton className="h-5 w-1/3 bg-white/10" />
                          <Skeleton className="h-5 w-24 bg-white/10" />
                        </div>
                        <div className="flex mb-4 space-x-6">
                          <Skeleton className="h-4 w-24 bg-white/10" />
                          <Skeleton className="h-4 w-24 bg-white/10" />
                          <Skeleton className="h-4 w-24 bg-white/10" />
                        </div>
                        <Skeleton className="h-16 w-full mb-4 bg-white/10" />
                        <div className="flex space-x-2 mb-4">
                          <Skeleton className="h-6 w-16 rounded-full bg-white/10" />
                          <Skeleton className="h-6 w-16 rounded-full bg-white/10" />
                          <Skeleton className="h-6 w-16 rounded-full bg-white/10" />
                        </div>
                        <div className="flex justify-end space-x-3">
                          <Skeleton className="h-8 w-20 bg-white/10" />
                          <Skeleton className="h-8 w-20 bg-white/10" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              ) : error ? (
                <CardContent className="p-6 text-center">
                  <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-red-400 mb-2">Error loading jobs</h3>
                  <p className="text-gray-300">{(error as Error).message}</p>
                </CardContent>
              ) : filteredJobs.length > 0 ? (
                <>
                  <CardContent className="p-0">
                    <ul className="divide-y divide-white/10">
                      {filteredJobs.map((job: Job) => (
                        <li key={job.id}>
                          <JobCard job={job} />
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  
                  <div className="border-t border-white/10 px-6 py-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious href="#" className="text-gray-300 hover:text-white border-white/10 hover:border-blue-400 hover:bg-blue-900/20" />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink 
                            href="#" 
                            isActive
                            className="data-[active=true]:bg-blue-900/30 data-[active=true]:text-blue-300 data-[active=true]:border-blue-500 text-gray-300 border-white/10"
                          >
                            1
                          </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink 
                            href="#"
                            className="text-gray-300 hover:text-white border-white/10 hover:border-blue-400 hover:bg-blue-900/20"
                          >
                            2
                          </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink 
                            href="#"
                            className="text-gray-300 hover:text-white border-white/10 hover:border-blue-400 hover:bg-blue-900/20"
                          >
                            3
                          </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationEllipsis className="text-gray-400" />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext href="#" className="text-gray-300 hover:text-white border-white/10 hover:border-blue-400 hover:bg-blue-900/20" />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </>
              ) : (
                <CardContent className="py-16 text-center">
                  <Briefcase className="h-16 w-16 text-blue-400/40 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">
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
