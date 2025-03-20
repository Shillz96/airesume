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

// Extended Resume type to include properties we need
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
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('my-resumes');

  // Fetch user's resumes
  const { data: resumes, isLoading, error } = useQuery({
    queryKey: ['/api/resumes'],
    retry: false,
  });

  // Template options for creating a new resume
  const resumeTemplates = [
    {
      id: 'professional',
      name: 'Professional',
      description: 'Clean and modern design with a traditional layout. Perfect for most industries.',
      preview: '/professional-resume-preview.png',
      color: 'bg-blue-500',
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Unique and eye-catching design with a modern twist. Great for creative fields.',
      preview: '/creative-resume-preview.png',
      color: 'bg-purple-500',
    },
    {
      id: 'executive',
      name: 'Executive',
      description: 'Sophisticated and elegant design for senior positions and leadership roles.',
      preview: '/executive-resume-preview.png',
      color: 'bg-gray-700',
    },
    {
      id: 'modern',
      name: 'Modern',
      description: 'Contemporary minimal design with clean typography and bold elements.',
      preview: '/modern-resume-preview.png',
      color: 'bg-emerald-500',
    },
    {
      id: 'minimalist',
      name: 'Minimalist',
      description: 'Simple, clean design with ample white space for clarity and readability.',
      preview: '/minimalist-resume-preview.png',
      color: 'bg-amber-500',
    },
  ];

  // Filter resumes based on search query
  const filteredResumes = Array.isArray(resumes)
    ? resumes.filter((resume: Resume) => 
        resume.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (resume.personalInfo?.headline?.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const handleCreateNewResume = (templateId: string) => {
    navigate('/resume-builder?template=' + templateId);
  };

  const handleResumeAction = (action: string, resumeId?: number | string) => {
    switch (action) {
      case 'edit':
        if (resumeId) navigate(`/resume-builder?id=${resumeId.toString()}`);
        break;
      case 'duplicate':
        // This would clone the resume and create a new one
        console.log('Duplicate resume', resumeId);
        break;
      case 'delete':
        // This would delete the resume
        console.log('Delete resume', resumeId);
        break;
      case 'upload':
        // This would handle the resume upload flow
        console.log('Upload resume');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 pt-16">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Resumes</h1>
            <p className="text-muted-foreground mt-1">
              Manage and organize all your resumes in one place
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleResumeAction('upload')}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Resume
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Resume
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create a New Resume</DialogTitle>
                  <DialogDescription>
                    Choose a template to start building your new resume
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-2 gap-4 py-4">
                  {resumeTemplates.map((template) => (
                    <div 
                      key={template.id}
                      className="border rounded-lg overflow-hidden hover:border-primary transition-colors cursor-pointer"
                      onClick={() => handleCreateNewResume(template.id)}
                    >
                      <div className={`h-6 ${template.color}`}></div>
                      <div className="p-3">
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => handleCreateNewResume('blank')}>
                    Start from Scratch
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search your resumes..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue="my-resumes" value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b mb-4">
            <TabsList className="bg-transparent mb-[-1px]">
              <TabsTrigger value="my-resumes" className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                <FileText className="h-4 w-4 mr-2" />
                My Resumes
              </TabsTrigger>
              <TabsTrigger value="templates" className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                <BarChart2 className="h-4 w-4 mr-2" />
                Templates
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="my-resumes" className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <Skeleton className="h-6 w-2/3" />
                      <Skeleton className="h-4 w-full mt-2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-24 w-full" />
                    </CardContent>
                    <CardFooter>
                      <div className="flex justify-between w-full">
                        <Skeleton className="h-9 w-1/3" />
                        <Skeleton className="h-9 w-1/3" />
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <Card>
                <CardContent className="flex items-center justify-center p-6">
                  <p className="text-muted-foreground">Error loading resumes. Please try again.</p>
                </CardContent>
              </Card>
            ) : filteredResumes.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-10 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No resumes found</h3>
                  <p className="text-muted-foreground mb-4 max-w-md">
                    {searchQuery 
                      ? "No resumes match your search criteria. Try a different search term or clear the search."
                      : "You haven't created any resumes yet. Create your first resume or upload an existing one."}
                  </p>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Create New Resume
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        {/* Template content is the same as above */}
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" onClick={() => handleResumeAction('upload')}>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Resume
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResumes.map((resume: Resume) => (
                  <Card key={resume.id} className="overflow-hidden group">
                    <div className={`h-2 ${
                      resume.template === 'professional' ? 'bg-blue-500' :
                      resume.template === 'creative' ? 'bg-purple-500' :
                      resume.template === 'executive' ? 'bg-gray-700' :
                      resume.template === 'modern' ? 'bg-emerald-500' :
                      resume.template === 'minimalist' ? 'bg-amber-500' : 'bg-primary'
                    }`}></div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg truncate">{resume.title}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {resume.template?.charAt(0).toUpperCase() + resume.template?.slice(1) || 'Basic'}
                        </Badge>
                      </div>
                      <CardDescription className="truncate">
                        {resume.personalInfo?.headline || 'No headline'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="flex items-center text-sm text-muted-foreground space-x-4 mb-4">
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1.5" />
                          <span>Updated {new Date().toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="h-3.5 w-3.5 mr-1.5" />
                          <span>{resume.experience?.length || 0} jobs</span>
                        </div>
                      </div>
                      <div className="aspect-[11/14] bg-card/20 rounded border border-dashed flex items-center justify-center">
                        <div className="text-center p-4">
                          <div className="text-xs text-muted-foreground">Preview</div>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-100 flex items-end justify-center p-4 transition-opacity">
                        <Button onClick={() => navigate(`/resume-builder?id=${resume.id?.toString()}`)}>
                          Edit Resume
                        </Button>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-3 flex justify-between">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleResumeAction('duplicate', resume.id?.toString())}>
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Duplicate</span>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleResumeAction('delete', resume.id?.toString())}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          PDF
                        </Button>
                        <Button size="sm" onClick={() => handleResumeAction('edit', resume.id?.toString())}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="templates" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumeTemplates.map((template) => (
                <Card key={template.id} className="overflow-hidden">
                  <div className={`h-2 ${template.color}`}></div>
                  <CardHeader>
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-[11/14] bg-card/20 rounded border border-dashed flex items-center justify-center">
                      <div className="text-center p-4">
                        <div className="text-xs text-muted-foreground">Template Preview</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      onClick={() => handleCreateNewResume(template.id)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Use This Template
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}