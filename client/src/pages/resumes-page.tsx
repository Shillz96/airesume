import { useState } from 'react';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { 
  FileText, 
  Plus, 
  BarChart2, 
  Search, 
  Calendar, 
  Briefcase,
  Download,
  Edit,
  Copy,
  Trash2,
  Upload
} from 'lucide-react';
// Standard UI components
import { Button } from '@/components/ui/button'; 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Resume as ResumeType } from '@shared/schema';
// Removed unused ResumeTemplate import for now
// import ResumeTemplate from '@/features/resume/components/ResumeTemplate';
import PageHeader from "@/features/layout/components/PageHeader";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useGuestMode } from '@/hooks/use-guest-mode';
import { cn } from '@/lib/utils'; // Import cn

interface Resume extends ResumeType {
  personalInfo?: {
    headline?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    summary?: string;
  };
  experience?: any[];
  education?: any[];
  skills?: any[];
  projects?: any[];
}

export default function ResumesPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { isGuestMode, showGuestModal } = useGuestMode();
  const { toast } = useToast();

  // State for UI
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('my-resumes');

  // Query resumes
  const { data: resumes = [], isLoading, error } = useQuery<Resume[], Error>({
    queryKey: ['/api/resumes'],
    enabled: !!user?.id, // Only fetch if user is authenticated
    retry: 2,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    onError: (error: Error) => {
      toast({
        title: "Error Loading Resumes",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    }
  }) as UseQueryResult<Resume[], Error>;

  // Filter resumes based on search query
  const filteredResumes = searchQuery.trim() !== '' && Array.isArray(resumes)
    ? resumes.filter((resume: Resume) => 
        (resume.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         resume.personalInfo?.headline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         resume.personalInfo?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         resume.personalInfo?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : resumes;

  // Template options (simplified color mapping)
  const resumeTemplates = [
    { id: 'professional', name: 'Professional', description: 'Clean, organized layout for corporate settings', colorClass: 'bg-blue-500' },
    { id: 'creative', name: 'Creative', description: 'Dynamic design for creative industries', colorClass: 'bg-purple-500' },
    { id: 'executive', name: 'Executive', description: 'Sophisticated style for senior positions', colorClass: 'bg-gray-700' },
    { id: 'modern', name: 'Modern', description: 'Contemporary look with balanced elements', colorClass: 'bg-emerald-500' },
    { id: 'minimalist', name: 'Minimalist', description: 'Simple, focused design with essential info', colorClass: 'bg-amber-500' },
    { id: 'industry', name: 'Industry', description: 'Specialized format for technical roles', colorClass: 'bg-indigo-500' },
    { id: 'bold', name: 'Bold', description: 'Strong visual impact with clear hierarchy', colorClass: 'bg-red-500' }
  ];

  // Handle resume creation
  const handleCreateNewResume = (templateType: string) => {
    if (isGuestMode) {
      showGuestModal();
      return;
    }

    // Navigate to resume builder with template type
    navigate(`/resume-builder?template=${templateType}`);
  };

  // Handle resume actions
  const handleResumeAction = async (action: string, id?: string | number) => {
    if (isGuestMode && (action === 'edit' || action === 'delete' || action === 'duplicate')) {
      showGuestModal();
      return;
    }

    switch(action) {
      case 'edit':
        try {
          // Show loading toast
          toast({
            title: "Loading Resume",
            description: "Preparing to edit resume...",
          });
          
          // Directly fetch the resume data before navigating
          const response = await fetch(`/api/resumes/${id}`);
          
          if (!response.ok) {
            throw new Error(`Error fetching resume: ${response.status}`);
          }
          
          const resumeData = await response.json();
          
          // Store resume data in localStorage for resume-builder to use
          try {
            localStorage.setItem('editingResume', JSON.stringify({
              resumeData,
              timestamp: new Date().toISOString()
            }));
          } catch (e) {
            // Silently fail if localStorage is not available
          }
          
          // Navigate to edit page
          navigate(`/resume-builder?id=${id}&edit=true`);
        } catch (error) {
          toast({
            title: "Error Loading Resume",
            description: "Failed to load resume for editing. Please try again.",
            variant: "destructive",
          });
        }
        break;
      case 'download':
        toast({
          title: "Resume Download",
          description: "Your resume is being prepared for download.",
        });
        break;
      case 'duplicate':
        toast({
          title: "Resume Duplicated",
          description: "A copy of your resume has been created.",
        });
        break;
      case 'delete':
        try {
          // Show loading toast
          toast({
            title: "Deleting Resume",
            description: "Please wait while we remove your resume...",
          });
          
          // Call the API to delete the resume
          const response = await fetch(`/api/resumes/${id}`, {
            method: 'DELETE',
          });
          
          if (!response.ok) {
            throw new Error(`Error deleting resume: ${response.status}`);
          }
          
          // Wait a moment before refreshing the page to allow the API to fully process
          setTimeout(() => {
            // Invalidate and refetch the resumes list
            window.location.reload();
          }, 500);
          
          // Show success toast
          toast({
            title: "Resume Deleted",
            description: "Your resume has been permanently removed.",
            variant: "destructive",
          });
        } catch (error) {
          toast({
            title: "Error Deleting Resume",
            description: "Failed to delete the resume. Please try again.",
            variant: "destructive",
          });
        }
        break;
      case 'upload':
        toast({
          title: "Upload Resume",
          description: "This feature is coming soon!",
        });
        break;
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-screen-xl">
        <PageHeader
          title="My Resumes"
          subtitle="Manage and organize all your resumes in one place"
          actions={
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleResumeAction('upload')}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Resume
              </Button>
              <Button onClick={() => handleCreateNewResume('professional')}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Resume
              </Button>
            </div>
          }
        />
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-8 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-screen-xl">
        <PageHeader
          title="My Resumes"
          subtitle="Manage and organize all your resumes in one place"
          actions={
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleResumeAction('upload')}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Resume
              </Button>
              <Button onClick={() => handleCreateNewResume('professional')}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Resume
              </Button>
            </div>
          }
        />
        <div className="mt-8 p-4 bg-destructive/10 rounded-lg text-destructive">
          <p>Error loading resumes. Please try again.</p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Show empty state for no resumes
  if (resumes.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-screen-xl">
        <PageHeader
          title="My Resumes"
          subtitle="Manage and organize all your resumes in one place"
          actions={
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleResumeAction('upload')}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Resume
              </Button>
              <Button onClick={() => handleCreateNewResume('professional')}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Resume
              </Button>
            </div>
          }
        />
        <div className="mt-8 text-center p-8 bg-card rounded-lg border">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No Resumes Yet</h3>
          <p className="mt-2 text-muted-foreground">
            Create your first resume or upload an existing one to get started.
          </p>
          <div className="mt-4 flex gap-2 justify-center">
            <Button variant="outline" onClick={() => handleResumeAction('upload')}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Resume
            </Button>
            <Button onClick={() => handleCreateNewResume('professional')}>
              <Plus className="w-4 h-4 mr-2" />
              Create New Resume
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-screen-xl -mt-4 pb-10 min-h-screen relative z-10">
        <PageHeader 
          title="My Resumes"
          subtitle="Manage and organize all your resumes in one place"
          actions={
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleResumeAction('upload')}
                className="border-border text-muted-foreground hover:bg-muted hover:text-muted-foreground"
              >
                <Upload className="mr-2 h-4 w-4 text-primary" />
                Upload Resume
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="default">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Resume
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle className="text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Create a New Resume</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      Choose a template to start building your new resume
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-2 gap-4 py-4">
                    {resumeTemplates.map((template) => (
                      <div 
                        key={template.id}
                        className="border border-border bg-card rounded-lg overflow-hidden hover:border-primary/50 transition-colors cursor-pointer"
                        onClick={() => handleCreateNewResume(template.id)}
                      >
                        <div className={`h-2 ${template.colorClass}`}></div>
                        <div className="p-4">
                          <h3 className="font-medium text-foreground mb-1">{template.name}</h3>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => handleCreateNewResume('blank')}
                    >
                      Start from Scratch
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          }
        />

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
            <Input
              placeholder="Search your resumes..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs 
          defaultValue="my-resumes" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className=""
        >
          <TabsList className="mb-6">
            <TabsTrigger value="my-resumes" className="no-blur"> 
              <FileText className="h-4 w-4 mr-2" />
              My Resumes
            </TabsTrigger>
            <TabsTrigger value="templates" className="no-blur"> 
              <BarChart2 className="h-4 w-4 mr-2" />
              Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-resumes" className="mt-0">
            {filteredResumes.length === 0 ? (
              <Card className="border-dashed border-border">
                <CardContent className="flex flex-col items-center justify-center p-10 text-center">
                  <FileText className="h-16 w-16 text-primary mb-6 opacity-80" />
                  <h3 className="text-lg font-medium mb-3 text-foreground">No resumes found</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    {searchQuery 
                      ? "No resumes match your search criteria. Try a different search term or clear the search."
                      : "You haven't created any resumes yet. Create your first resume or upload an existing one."}
                  </p>
                  <div className="flex gap-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="default">
                          <Plus className="mr-2 h-4 w-4" />
                          Create New Resume
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        {/* Template content from above could be reused here */}
                      </DialogContent>
                    </Dialog>
                    <Button 
                      variant="outline" 
                      onClick={() => handleResumeAction('upload')}
                    >
                      <Upload className="mr-2 h-4 w-4 text-primary" />
                      Upload Resume
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredResumes.map((resume: Resume) => (
                  <Card key={resume.id} className="overflow-hidden group border-border hover:border-primary/50 transition-all duration-300">
                    <div className={`h-2 ${resumeTemplates.find(t => t.id === resume.template)?.colorClass || 'bg-primary'}`}></div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg truncate text-foreground">{resume.title}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {resume.template?.charAt(0).toUpperCase() + resume.template?.slice(1) || 'Basic'}
                        </Badge>
                      </div>
                      <CardDescription className="truncate text-muted-foreground">
                        {resume.personalInfo?.headline || 'No headline'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="flex items-center text-sm text-muted-foreground space-x-4 mb-4">
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1.5 text-primary" />
                          <span>Updated {new Date().toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="h-3.5 w-3.5 mr-1.5 text-primary" />
                          <span>{resume.experience?.length || 0} jobs</span>
                        </div>
                      </div>
                      <div className="aspect-[11/14] bg-muted/30 rounded border border-border flex items-center justify-center">
                        <div className="text-center p-4">
                          <div className="text-xs text-muted-foreground">Preview</div>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent opacity-0 group-hover:opacity-100 flex items-end justify-center p-4 transition-opacity duration-300">
                        <Button 
                          onClick={() => handleResumeAction('edit', resume.id)}
                          variant="default"
                        >
                          Edit Resume
                        </Button>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t border-border bg-muted/30 pt-3">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleResumeAction('download', resume.id)}
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Download className="h-4 w-4 mr-2 text-primary" />
                        Download
                      </Button>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleResumeAction('edit', resume.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                        >
                          <Edit className="h-4 w-4 text-primary" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleResumeAction('duplicate', resume.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                        >
                          <Copy className="h-4 w-4 text-primary" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleResumeAction('delete', resume.id)}
                          className="h-8 w-8 text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="templates" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resumeTemplates.map((template) => (
                <Card key={template.id} className="overflow-hidden group border-border hover:border-primary/50 transition-all duration-300">
                  <div className={`h-2 ${template.colorClass}`}></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-foreground">{template.name}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="aspect-[11/14] bg-muted/30 rounded border border-border flex items-center justify-center overflow-hidden">
                      <div className={`h-32 w-full flex items-center justify-center ${template.colorClass} rounded-md`}>
                        <span className="text-white font-medium">{template.name}</span>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent opacity-0 group-hover:opacity-100 flex items-end justify-center p-4 transition-opacity duration-300">
                      <Button 
                        onClick={() => handleCreateNewResume(template.id)}
                        variant="default"
                      >
                        Use This Template
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center border-t border-border bg-muted/30 pt-3">
                    <Button 
                      onClick={() => handleCreateNewResume(template.id)}
                      variant="ghost" 
                      size="sm"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Plus className="h-4 w-4 mr-2 text-primary" />
                      Create Resume
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}