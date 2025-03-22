import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Resume as ResumeType } from '@shared/schema';
import { 
  TemplatePreviewProfessional,
  TemplatePreviewCreative,
  TemplatePreviewExecutive,
  TemplatePreviewModern,
  TemplatePreviewMinimal,
  TemplatePreviewIndustry,
  TemplatePreviewBold
} from '@/components/resume-template';

import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useGuestMode } from '@/hooks/use-guest-mode';

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
  const { data: resumes = [], isLoading, error } = useQuery<Resume[]>({
    queryKey: ['/api/resumes'],
    enabled: true,
  });

  // Filter resumes based on search query
  const filteredResumes = searchQuery.trim() !== '' 
    ? resumes.filter((resume: Resume) => 
        (resume.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         resume.personalInfo?.headline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         resume.personalInfo?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         resume.personalInfo?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : resumes;

  // Template options for new resume
  const resumeTemplates = [
    {
      id: 'professional',
      name: 'Professional',
      description: 'Clean, organized layout for corporate settings',
      color: 'bg-gradient-to-r from-blue-500 to-blue-700'
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Dynamic design for creative industries',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    {
      id: 'executive',
      name: 'Executive',
      description: 'Sophisticated style for senior positions',
      color: 'bg-gradient-to-r from-gray-700 to-gray-900'
    },
    {
      id: 'modern',
      name: 'Modern',
      description: 'Contemporary look with balanced elements',
      color: 'bg-gradient-to-r from-emerald-500 to-teal-700'
    },
    {
      id: 'minimalist',
      name: 'Minimalist',
      description: 'Simple, focused design with essential info',
      color: 'bg-gradient-to-r from-amber-500 to-orange-600'
    },
    {
      id: 'industry',
      name: 'Industry',
      description: 'Specialized format for technical roles',
      color: 'bg-gradient-to-r from-indigo-500 to-indigo-700'
    },
    {
      id: 'bold',
      name: 'Bold',
      description: 'Strong visual impact with clear hierarchy',
      color: 'bg-gradient-to-r from-red-500 to-rose-700'
    }
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
          console.log("Resume to edit:", resumeData);
          
          // Store resume data in localStorage for resume-builder to use
          localStorage.setItem('editingResume', JSON.stringify({
            resumeData,
            timestamp: new Date().toISOString()
          }));
          
          // Navigate to edit page
          navigate(`/resume-builder?id=${id}&edit=true`);
        } catch (error) {
          console.error("Error loading resume for editing:", error);
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
          console.error("Error deleting resume:", error);
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

  return (
    <>
      
      <div className="container pt-4 pb-10 px-4 md:px-6 max-w-7xl mx-auto min-h-screen relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight cosmic-text-gradient">My Resumes</h1>
            <p className="text-muted-foreground">
              Manage and organize all your resumes in one place
            </p>
          </div>

          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleResumeAction('upload')}
              className="border-white/10 text-gray-200 hover:bg-white/10 hover:text-white"
            >
              <Upload className="mr-2 h-4 w-4 text-blue-400" />
              Upload Resume
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Resume
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] cosmic-card border-white/10">
                <DialogHeader>
                  <DialogTitle className="cosmic-text-gradient text-xl">Create a New Resume</DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Choose a template to start building your new resume
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-4">
                  {resumeTemplates.map((template) => (
                    <div 
                      key={template.id}
                      className="border border-white/10 bg-black/40 rounded-lg overflow-hidden hover:border-blue-500 transition-colors cursor-pointer cosmic-card-hover"
                      onClick={() => handleCreateNewResume(template.id)}
                    >
                      <div className={`h-6 ${template.color}`}></div>
                      <div className="p-4">
                        <h3 className="font-medium text-white mb-1">{template.name}</h3>
                        <p className="text-sm text-gray-300">{template.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => handleCreateNewResume('blank')}
                    className="border-white/10 text-gray-200 hover:bg-white/10 hover:text-white"
                  >
                    Start from Scratch
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" />
            <Input
              placeholder="Search your resumes..."
              className="pl-10 bg-black/30 border-white/10 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs 
          defaultValue="my-resumes" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="cosmic-tabs"
        >
          <div className="border-b border-white/10 mb-6">
            <TabsList className="bg-transparent mb-[-1px]">
              <TabsTrigger 
                value="my-resumes" 
                className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-400 text-gray-300"
              >
                <FileText className="h-4 w-4 mr-2" />
                My Resumes
              </TabsTrigger>
              <TabsTrigger 
                value="templates" 
                className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-400 text-gray-300"
              >
                <BarChart2 className="h-4 w-4 mr-2" />
                Templates
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="my-resumes" className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden cosmic-card border-white/10">
                    <CardHeader className="pb-2">
                      <Skeleton className="h-6 w-2/3 bg-white/10" />
                      <Skeleton className="h-4 w-full mt-2 bg-white/10" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-24 w-full bg-white/10" />
                    </CardContent>
                    <CardFooter>
                      <div className="flex justify-between w-full">
                        <Skeleton className="h-9 w-1/3 bg-white/10" />
                        <Skeleton className="h-9 w-1/3 bg-white/10" />
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <Card className="cosmic-card border-white/10">
                <CardContent className="flex items-center justify-center p-6">
                  <p className="text-red-400">Error loading resumes. Please try again.</p>
                </CardContent>
              </Card>
            ) : filteredResumes.length === 0 ? (
              <Card className="border-dashed cosmic-card border-white/10">
                <CardContent className="flex flex-col items-center justify-center p-10 text-center">
                  <FileText className="h-16 w-16 text-blue-400 mb-6 opacity-80" />
                  <h3 className="text-lg font-medium mb-3 text-white">No resumes found</h3>
                  <p className="text-gray-300 mb-6 max-w-md">
                    {searchQuery 
                      ? "No resumes match your search criteria. Try a different search term or clear the search."
                      : "You haven't created any resumes yet. Create your first resume or upload an existing one."}
                  </p>
                  <div className="flex gap-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                          <Plus className="mr-2 h-4 w-4" />
                          Create New Resume
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="cosmic-card border-white/10">
                        {/* Template content is the same as above */}
                      </DialogContent>
                    </Dialog>
                    <Button 
                      variant="outline" 
                      onClick={() => handleResumeAction('upload')}
                      className="border-white/10 text-gray-200 hover:bg-white/10 hover:text-white"
                    >
                      <Upload className="mr-2 h-4 w-4 text-blue-400" />
                      Upload Resume
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredResumes.map((resume: Resume) => (
                  <Card key={resume.id} className="overflow-hidden group cosmic-card border-white/10 hover:border-blue-500/50 transition-all duration-300">
                    <div className={`h-2 ${
                      resume.template === 'professional' ? 'bg-gradient-to-r from-blue-500 to-blue-700' :
                      resume.template === 'creative' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                      resume.template === 'executive' ? 'bg-gradient-to-r from-gray-700 to-gray-900' :
                      resume.template === 'modern' ? 'bg-gradient-to-r from-emerald-500 to-teal-700' :
                      resume.template === 'minimalist' ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-gradient-to-r from-blue-500 to-purple-600'
                    }`}></div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg truncate text-white">{resume.title}</CardTitle>
                        <Badge variant="outline" className="text-xs border-white/20 text-blue-300 bg-blue-900/20">
                          {resume.template?.charAt(0).toUpperCase() + resume.template?.slice(1) || 'Basic'}
                        </Badge>
                      </div>
                      <CardDescription className="truncate text-gray-300">
                        {resume.personalInfo?.headline || 'No headline'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="flex items-center text-sm text-gray-400 space-x-4 mb-4">
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
                          <span>Updated {new Date().toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
                          <span>{resume.experience?.length || 0} jobs</span>
                        </div>
                      </div>
                      <div className="aspect-[11/14] bg-black/50 rounded border border-white/10 flex items-center justify-center cosmic-glow-subtle">
                        <div className="text-center p-4">
                          <div className="text-xs text-gray-400">Preview</div>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 flex items-end justify-center p-4 transition-opacity duration-300">
                        <Button 
                          onClick={() => handleResumeAction('edit', resume.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Edit Resume
                        </Button>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t border-white/5 bg-black/20 pt-3">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleResumeAction('download', resume.id)}
                        className="text-gray-300 hover:text-white hover:bg-blue-800/20"
                      >
                        <Download className="h-4 w-4 mr-2 text-blue-400" />
                        Download
                      </Button>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleResumeAction('edit', resume.id)}
                          className="h-8 w-8 text-gray-300 hover:text-white hover:bg-blue-800/20"
                        >
                          <Edit className="h-4 w-4 text-blue-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleResumeAction('duplicate', resume.id)}
                          className="h-8 w-8 text-gray-300 hover:text-white hover:bg-blue-800/20"
                        >
                          <Copy className="h-4 w-4 text-blue-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleResumeAction('delete', resume.id)}
                          className="h-8 w-8 text-gray-300 hover:text-white hover:bg-red-800/20"
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
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
                <Card key={template.id} className="overflow-hidden group cosmic-card border-white/10 hover:border-blue-500/50 transition-all duration-300">
                  <div className={`h-2 ${template.color}`}></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-white">{template.name}</CardTitle>
                    <CardDescription className="text-gray-300">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="aspect-[11/14] bg-black/50 rounded border border-white/10 flex items-center justify-center cosmic-glow-subtle overflow-hidden">
                      {template.id === 'professional' && <TemplatePreviewProfessional />}
                      {template.id === 'creative' && <TemplatePreviewCreative />}
                      {template.id === 'executive' && <TemplatePreviewExecutive />}
                      {template.id === 'modern' && <TemplatePreviewModern />}
                      {template.id === 'minimalist' && <TemplatePreviewMinimal />}
                      {template.id === 'industry' && <TemplatePreviewIndustry />}
                      {template.id === 'bold' && <TemplatePreviewBold />}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 flex items-end justify-center p-4 transition-opacity duration-300">
                      <Button 
                        onClick={() => handleCreateNewResume(template.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Use This Template
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center border-t border-white/5 bg-black/20 pt-3">
                    <Button 
                      onClick={() => handleCreateNewResume(template.id)}
                      variant="ghost" 
                      size="sm"
                      className="text-gray-300 hover:text-white hover:bg-blue-800/20"
                    >
                      <Plus className="h-4 w-4 mr-2 text-blue-400" />
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