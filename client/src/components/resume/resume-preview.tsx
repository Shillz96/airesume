import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Resume, 
  ProfessionalTemplate, 
  CreativeTemplate, 
  ExecutiveTemplate,
  ModernTemplate,
  MinimalTemplate,
  IndustryTemplate,
  BoldTemplate
} from "@/components/resume-template";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Printer,
  Eye
} from "lucide-react";

interface ResumePreviewComponentProps {
  resume: Resume;
  onTemplateChange: (template: string) => void;
  onDownload?: () => void;
}

/**
 * Component for displaying a preview of the resume with template selection and pagination
 */
export default function ResumePreviewComponent({ 
  resume, 
  onTemplateChange, 
  onDownload 
}: ResumePreviewComponentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [previewScale, setPreviewScale] = useState(0.8);
  const { toast } = useToast();

  // Determine total pages based on resume content
  useEffect(() => {
    // A simple heuristic: 
    // 1 page by default + additional pages based on content length
    let estimatedPages = 1;
    
    // Add pages based on experience items (roughly 3 items per page)
    if (resume.experience && resume.experience.length > 0) {
      estimatedPages += Math.ceil(resume.experience.length / 3) - 1;
    }
    
    // Add pages based on education items (roughly 4 items per page)
    if (resume.education && resume.education.length > 4) {
      estimatedPages += Math.ceil((resume.education.length - 4) / 4);
    }
    
    // Add pages based on projects (roughly 3 projects per page)
    if (resume.projects && resume.projects.length > 3) {
      estimatedPages += Math.ceil((resume.projects.length - 3) / 3);
    }
    
    // Cap at a reasonable maximum
    const maxPages = 3;
    setTotalPages(Math.min(Math.max(estimatedPages, 1), maxPages));
    
    // Reset to first page when resume changes
    setCurrentPage(1);
  }, [resume]);

  // Handle page navigation
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Render the appropriate template based on resume.template
  const renderTemplate = () => {
    switch (resume.template) {
      case "professional":
        return <ProfessionalTemplate resume={resume} />;
      case "creative":
        return <CreativeTemplate resume={resume} />;
      case "executive":
        return <ExecutiveTemplate resume={resume} />;
      case "modern":
        return <ModernTemplate resume={resume} />;
      case "minimal":
        return <MinimalTemplate resume={resume} />;
      case "industry":
        return <IndustryTemplate resume={resume} />;
      case "bold":
        return <BoldTemplate resume={resume} />;
      default:
        return <ProfessionalTemplate resume={resume} />;
    }
  };

  // Handle print/save PDF functionality
  const handlePrint = () => {
    if (onDownload) {
      onDownload();
    } else {
      toast({
        title: "Print functionality",
        description: "Opening the print dialog to save as PDF",
      });
      window.print();
    }
  };

  // Zoom in/out controls
  const zoomIn = () => {
    setPreviewScale(prev => Math.min(prev + 0.1, 1.2));
  };

  const zoomOut = () => {
    setPreviewScale(prev => Math.max(prev - 0.1, 0.5));
  };

  return (
    <div>
      <div className="flex flex-col space-y-2">
        <div className="bg-[rgba(10,15,25,0.5)] p-3 rounded-lg backdrop-blur-lg border border-indigo-800/30">
          <Tabs defaultValue={resume.template} onValueChange={onTemplateChange} className="w-full">
            <TabsList className="w-full grid grid-cols-4 md:grid-cols-7 h-auto p-1 bg-[rgba(30,40,80,0.3)]">
              <TabsTrigger 
                value="professional"
                className={cn(
                  "py-1 px-2 text-xs hover:text-blue-300 data-[state=active]:bg-blue-900/50",
                  "data-[state=active]:text-blue-50 data-[state=active]:shadow-none"
                )}
              >
                Professional
              </TabsTrigger>
              <TabsTrigger 
                value="modern"
                className={cn(
                  "py-1 px-2 text-xs hover:text-blue-300 data-[state=active]:bg-blue-900/50",
                  "data-[state=active]:text-blue-50 data-[state=active]:shadow-none"
                )}
              >
                Modern
              </TabsTrigger>
              <TabsTrigger 
                value="minimal"
                className={cn(
                  "py-1 px-2 text-xs hover:text-blue-300 data-[state=active]:bg-blue-900/50",
                  "data-[state=active]:text-blue-50 data-[state=active]:shadow-none"
                )}
              >
                Minimal
              </TabsTrigger>
              <TabsTrigger 
                value="creative"
                className={cn(
                  "py-1 px-2 text-xs hover:text-blue-300 data-[state=active]:bg-blue-900/50",
                  "data-[state=active]:text-blue-50 data-[state=active]:shadow-none"
                )}
              >
                Creative
              </TabsTrigger>
              <TabsTrigger 
                value="executive"
                className={cn(
                  "py-1 px-2 text-xs hover:text-blue-300 data-[state=active]:bg-blue-900/50",
                  "data-[state=active]:text-blue-50 data-[state=active]:shadow-none"
                )}
              >
                Executive
              </TabsTrigger>
              <TabsTrigger 
                value="industry"
                className={cn(
                  "py-1 px-2 text-xs hover:text-blue-300 data-[state=active]:bg-blue-900/50",
                  "data-[state=active]:text-blue-50 data-[state=active]:shadow-none"
                )}
              >
                Industry
              </TabsTrigger>
              <TabsTrigger 
                value="bold"
                className={cn(
                  "py-1 px-2 text-xs hover:text-blue-300 data-[state=active]:bg-blue-900/50",
                  "data-[state=active]:text-blue-50 data-[state=active]:shadow-none"
                )}
              >
                Bold
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="relative flex flex-col items-center">
          {/* Multi-page navigation controls */}
          {totalPages > 1 && (
            <div className="absolute top-2 left-2 z-10 flex items-center gap-2 bg-blue-900/70 p-1 rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 bg-transparent hover:bg-blue-800/50 text-gray-300"
                onClick={goToPrevPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs text-gray-300">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 bg-transparent hover:bg-blue-800/50 text-gray-300"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Zoom controls */}
          <div className="absolute top-2 right-2 z-10 flex items-center gap-2 bg-blue-900/70 p-1 rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 bg-transparent hover:bg-blue-800/50 text-gray-300"
              onClick={zoomOut}
            >
              <span className="text-xs">-</span>
            </Button>
            <span className="text-xs text-gray-300">
              {Math.round(previewScale * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 bg-transparent hover:bg-blue-800/50 text-gray-300"
              onClick={zoomIn}
            >
              <span className="text-xs">+</span>
            </Button>
          </div>

          {/* Resume preview */}
          <div 
            className="resume-preview-wrapper border border-blue-900/50 bg-white shadow-xl mt-4 mb-2"
            style={{
              transform: `scale(${previewScale})`,
              transformOrigin: 'top center',
              height: `${841 * previewScale}px`,
              width: `${595 * previewScale}px`,
              overflow: 'hidden'
            }}
          >
            <div 
              className="resume-page"
              style={{
                display: currentPage === 1 ? 'block' : 'none',
                width: '595px',
                height: '841px',
                position: 'absolute',
                overflow: 'hidden',
                backgroundColor: 'white'
              }}
              data-page="1"
            >
              {renderTemplate()}
            </div>
            {/* Additional pages would be conditionally rendered here */}
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              className="bg-[rgba(30,40,70,0.6)] text-blue-300 hover:text-blue-200 hover:bg-blue-800/50 border-blue-700/30"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print / Save PDF
            </Button>
            <Button
              variant="outline"
              className="bg-[rgba(30,40,70,0.6)] text-blue-300 hover:text-blue-200 hover:bg-blue-800/50 border-blue-700/30"
              onClick={onDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              className="bg-[rgba(30,40,70,0.6)] text-blue-300 hover:text-blue-200 hover:bg-blue-800/50 border-blue-700/30"
              onClick={() => window.open('/preview', '_blank')}
            >
              <Eye className="h-4 w-4 mr-2" />
              Full Preview
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}