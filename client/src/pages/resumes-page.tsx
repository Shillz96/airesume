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
    <div className="min-h-screen bg-black cosmic-background">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 pt-24">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold cosmic-text-gradient">My Resumes</h1>
            <p className="text-gray-300 mt-2">
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
                          onClick={() => navigate(`/resume-builder?id=${resume.id?.toString()}`)}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          Edit Resume
                        </Button>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t border-white/10 px-6 py-3 flex justify-between">
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleResumeAction('duplicate', resume.id?.toString())}
                          className="text-gray-300 hover:text-white hover:bg-white/10"
                        >
                          <Copy className="h-4 w-4 text-blue-400" />
                          <span className="sr-only">Duplicate</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleResumeAction('delete', resume.id?.toString())}
                          className="text-gray-300 hover:text-white hover:bg-white/10"
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-white/10 text-gray-200 hover:bg-white/10 hover:text-white"
                        >
                          <Download className="h-4 w-4 mr-2 text-blue-400" />
                          PDF
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleResumeAction('edit', resume.id?.toString())}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resumeTemplates.map((template) => (
                <Card key={template.id} className="overflow-hidden cosmic-card border-white/10 hover:border-blue-500/50 transition-all duration-300">
                  <div className={`h-2 ${
                      template.id === 'professional' ? 'bg-gradient-to-r from-blue-500 to-blue-700' :
                      template.id === 'creative' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                      template.id === 'executive' ? 'bg-gradient-to-r from-gray-700 to-gray-900' :
                      template.id === 'modern' ? 'bg-gradient-to-r from-emerald-500 to-teal-700' :
                      template.id === 'minimalist' ? 'bg-gradient-to-r from-amber-500 to-orange-600' : template.color
                  }`}></div>
                  <CardHeader>
                    <CardTitle className="text-white">{template.name}</CardTitle>
                    <CardDescription className="text-gray-300">{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-[11/14] bg-black/50 rounded border border-white/10 flex items-center justify-center cosmic-glow-subtle">
                      <div className="text-center p-4">
                        <div className="text-xs text-gray-400">Template Preview</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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