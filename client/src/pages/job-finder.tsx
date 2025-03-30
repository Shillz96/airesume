import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Job, JobFilterValues } from "@/features/job/types";
import JobFilter from "@/features/job/components/JobFilter";
import { 
  AlertTriangle, Calendar, Clock, Filter, Search, Star, 
  Building, Briefcase, Sparkles, X, XCircle, 
  Cpu, Heart, Share2
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
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
import { getQueryFn } from "@/lib/queryClient";
import AIAssistant from "@/features/ai/components/AIAssistant";
import PageHeader from "@/features/layout/components/PageHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";

export default function JobFinder() {
  const { user } = useAuth();
  const { isGuestMode } = useGuestMode();
  
  // State for UI
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  
  // State for job filters
  const [filterValues, setFilterValues] = useState<JobFilterValues>({
    title: "",
    location: "",
    type: "",
    experience: "",
    remote: "",
    salary: "",
    country: "us",
  });
  
  // Query jobs with filters
  const { data: jobs = [], isLoading, error } = useQuery<Job[]>({
    queryKey: [`/api/jobs`, filterValues],
    queryFn: async ({ signal }) => {
      const params = new URLSearchParams();
      
      if (filterValues.title) params.append("title", filterValues.title);
      if (filterValues.location) params.append("location", filterValues.location);
      if (filterValues.type) params.append("type", filterValues.type);
      if (filterValues.experience) params.append("experience", filterValues.experience);
      if (filterValues.remote) params.append("remote", filterValues.remote);
      if (filterValues.salary) params.append("salary", filterValues.salary);
      if (filterValues.country) params.append("country", filterValues.country);
      
      const queryFn = getQueryFn({ on401: "returnNull" });
      return queryFn({ 
        queryKey: [`/api/jobs?${params.toString()}`],
        signal,
        meta: {}
      }) as Promise<Job[]>;
    },
    enabled: !isGuestMode, // Only fetch if not in guest mode
  });
  
  // Handle filter changes
  const handleFilter = (values: JobFilterValues) => {
    setFilterValues(values);
    setCurrentPage(1);
  };
  
  // Filter jobs by status (saved, applied, etc.)
  const filteredJobs = jobs && Array.isArray(jobs) 
    ? jobs.filter((job) => {
        if (statusFilter === "all") return true;
        if (statusFilter === "saved") return job.saved;
        // For demo purposes we'll simulate other statuses based on the job ID
        if (statusFilter === "applied") return parseInt(job.id.toString()) % 3 === 0;
        if (statusFilter === "interviewing") return parseInt(job.id.toString()) % 5 === 0;
        if (statusFilter === "rejected") return parseInt(job.id.toString()) % 7 === 0;
        return true;
      })
    : [];
  
  const handleJobSelect = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      setSelectedJob(job);
      setShowDetailDrawer(true);
    }
  };
  
  return (
    <>
      <PageHeader
        title="Job Finder"
        subtitle="Search and apply for your next opportunity"
        actions={
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-primary/10 text-primary border-gray-800"
          >
            <Filter className="h-4 w-4" />
            Quick Filter
          </Button>
        }
        variant="cosmic"
        borderStyle="gradient"
      />
      
      {/* Job Search and Filters */}
      <JobFilter initialValues={filterValues} onFilter={handleFilter} />
        
      {/* AI Match Score Section */}
      <Card className="my-8 p-4 solid-card overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/10 to-transparent" />
        <div className="flex relative z-10">
          <div className="flex-shrink-0">
            <Cpu className="h-6 w-6 text-blue-400 animate-pulse" />
          </div>
          <div className="ml-4 no-blur">
            <h3 className="text-lg font-medium text-blue-300">AI-Powered Job Matching with Adzuna API</h3>
            <div className="mt-2 text-sm text-gray-300">
              <p>This job finder is now powered by the Adzuna API for real job listings. Search for jobs by title, location, and other filters to find opportunities matching your skills and experience.</p>
              <p className="mt-2">Our AI matches your resume with available job listings to help you find the best opportunities. Jobs with higher match scores align better with your profile.</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Job Status Tabs */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter} className="mb-8">
        <TabsList className="solid-card">
          <TabsTrigger 
            value="all" 
            className="no-blur"
          >
            All Jobs
          </TabsTrigger>
          <TabsTrigger 
            value="saved" 
            className="no-blur"
          >
            <Heart className="h-4 w-4 mr-2" />
            Saved
          </TabsTrigger>
          <TabsTrigger 
            value="applied" 
            className="no-blur"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Applied
          </TabsTrigger>
          <TabsTrigger 
            value="interviewing" 
            className="no-blur"
          >
            <Building className="h-4 w-4 mr-2" />
            Interviewing
          </TabsTrigger>
          <TabsTrigger 
            value="rejected" 
            className="no-blur"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Rejected
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Recommended Jobs Section */}
      {!isLoading && Array.isArray(jobs) && jobs.length > 0 && statusFilter === "all" && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            <Star className="h-5 w-5 mr-2 text-yellow-400" />
            Recommended for You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs
              .filter((job: Job): job is Job & { match: number } => typeof job.match === 'number')
              .filter((job) => job.match >= 85)
              .slice(0, 2)
              .map((job: Job) => (
                <Card 
                  key={job.id}
                  className="p-5 solid-card hover:border-primary/50 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="no-blur">
                      <h3 className="font-medium text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{job.title}</h3>
                      <p className="text-sm text-gray-300">{job.company} · {job.location}</p>
                    </div>
                    <Badge className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30">
                      {job.match}% Match
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-2 mb-3 no-blur">{job.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock className="h-3 w-3 mr-1 text-blue-400" />
                      <span>{job.postedAt}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant="outline" className="text-xs border-white/10 text-primary bg-primary/10">
                        {job.type}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* Job Listings */}
      <Card className="border-white/10 rounded-lg overflow-hidden bg-transparent">
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
              <ul className="divide-y divide-white/10 space-y-2">
                {filteredJobs.map((job) => (
                  <Card 
                    className="p-5 solid-card hover:border-primary/50 transition-all duration-300 cursor-pointer" 
                    key={job.id}
                    onClick={() => handleJobSelect(job.id)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="no-blur">
                        <h3 className="font-medium text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{job.title}</h3>
                        <p className="text-sm text-gray-300">{job.company} · {job.location}</p>
                      </div>
                      
                      {job.match && (
                        <Badge className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30">
                          {job.match}% Match
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2 mb-3 no-blur">{job.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-400">
                        <Clock className="h-3 w-3 mr-1 text-blue-400" />
                        <span>{job.postedAt}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant="outline" className="text-xs border-white/10 text-primary bg-primary/10">
                          {job.type}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </ul>
            </CardContent>
            
            <div className="border-t border-white/10 px-6 py-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <button 
                      onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                      disabled={currentPage === 1}
                      className="text-gray-300 hover:text-white border border-white/10 px-2.5 py-1.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                  </PaginationItem>
                  
                  {Array.from({ length: 3 }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 border rounded-md flex items-center justify-center ${
                          currentPage === page
                            ? 'bg-primary/20 text-primary border-primary/50'
                            : 'text-gray-300 border-white/10 hover:border-primary/30'
                        }`}
                      >
                        {page}
                      </button>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="text-gray-300 hover:text-white border border-white/10 px-2.5 py-1.5 rounded-md"
                    >
                      Next
                    </button>
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

      {/* Floating AI Assistant Button */}
      <div className="fixed bottom-6 right-6 z-50 group">
        <div className="absolute -inset-0.5 rounded-full bg-blue-500 opacity-75 blur-sm group-hover:opacity-100 transition duration-300 animate-pulse"></div>
        <Button
          onClick={() => setIsDialogOpen(!isDialogOpen)}
          className="relative h-14 w-14 rounded-full p-0 shadow-lg group-hover:scale-105 transition duration-300"
          aria-label="Open AI Job Assistant"
        >
          <div className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-40"></div>
          <Sparkles className="h-5 w-5 text-white" />
        </Button>
        <span className="absolute top-0 right-16 bg-black/80 text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">AI Job Assistant</span>
      </div>

      {/* AI Assistant Chat Box */}
      {isDialogOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-96 max-w-full shadow-xl rounded-lg overflow-hidden transition-all duration-300 ease-in-out border-white/10">
          <div className="bg-card/90 p-3 flex justify-between items-center border-b border-white/10">
            <div className="flex items-center">
              <Cpu className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">AI Job Assistant</h3>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsDialogOpen(false)} 
              className="h-8 w-8 rounded-full hover:bg-white/10"
            >
              <X className="h-4 w-4 text-white" />
            </Button>
          </div>
          <div className="bg-card/90 p-4 h-96 overflow-y-auto border-x border-white/10 border-b">
            <AIAssistant 
              activeTab="jobs"
            />
          </div>
        </Card>
      )}

      {/* Job Detail Drawer */}
      {selectedJob && (
        <JobDetailDrawer job={selectedJob} open={showDetailDrawer} onClose={() => setShowDetailDrawer(false)} />
      )}
    </>
  );
}

interface JobDetailDrawerProps {
  job: Job | null;
  open: boolean;
  onClose: () => void;
}

const JobDetailDrawer: React.FC<JobDetailDrawerProps> = ({ job, open, onClose }) => {
  if (!job) return null;
  
  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="bg-gray-900/95 border-t border-gray-800">
        <DrawerHeader>
          <DrawerTitle className="text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {job.title}
          </DrawerTitle>
          <DrawerDescription className="text-gray-300">
            {job.company} · {job.location}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DrawerClose>
        <div className="px-4">
          {job.match && (
            <div className="mb-4">
              <Badge className="bg-primary/20 text-primary border border-primary/30">
                {job.match}% Match
              </Badge>
            </div>
          )}
        </div>
        <DrawerFooter className="pt-2">
          <div className="space-y-4 px-2">
            <div className="solid-card p-4 rounded-lg">
              <h3 className="font-medium mb-2 text-white">Job Description</h3>
              <p className="text-sm text-gray-300 no-blur">{job.description}</p>
            </div>
            <div className="solid-card p-4 rounded-lg">
              <h3 className="font-medium mb-2 text-white">Requirements</h3>
              <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 no-blur">
                <li>3+ years of experience in relevant field</li>
                <li>Bachelor's degree or equivalent experience</li>
                <li>Strong communication and teamwork skills</li>
                <li>Ability to work in a fast-paced environment</li>
              </ul>
            </div>
            <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white">
              Apply Now
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};