import React, { useState } from "react";
import { 
  ProfessionalTemplate,
  CreativeTemplate,
  ExecutiveTemplate,
  ModernTemplate,
  MinimalTemplate,
  IndustryTemplate,
  BoldTemplate
} from "@/components/resume-template";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Printer, 
  Maximize2 
} from "lucide-react";
import { 
  Dialog, 
  DialogContent,
  DialogClose 
} from "@/components/ui/dialog";
import { Resume } from "@/hooks/use-resume-data";

interface ResumePreviewComponentProps {
  resume: Resume;
  onTemplateChange: (template: string) => void;
  onDownload?: () => void;
}

export default function ResumePreviewComponent({ 
  resume, 
  onTemplateChange, 
  onDownload 
}: ResumePreviewComponentProps) {
  const [isFullScreenPreview, setIsFullScreenPreview] = useState(false);

  // Render the appropriate resume template based on the selected template
  const renderSelectedTemplate = () => {
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

  return (
    <div className="cosmic-card border border-white/10 backdrop-blur-sm rounded-lg overflow-hidden h-full flex flex-col">
      <div className="cosmic-card-header p-3 border-b border-white/10 flex justify-between items-center">
        <h3 className="cosmic-text-gradient font-medium text-sm">Resume Preview</h3>
        <div className="flex space-x-1">
          {onDownload && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 text-blue-300 hover:text-blue-100 hover:bg-blue-800/50"
              onClick={onDownload}
              title="Download as PDF"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 text-blue-300 hover:text-blue-100 hover:bg-blue-800/50"
            onClick={() => {
              if (onDownload) onDownload(); // Print
            }}
            title="Print resume"
          >
            <Printer className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 text-blue-300 hover:text-blue-100 hover:bg-blue-800/50"
            onClick={() => setIsFullScreenPreview(true)}
            title="View in full screen"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="cosmic-card-body flex-grow overflow-auto bg-white p-4">
        <div className="max-w-[800px] mx-auto shadow-md">
          {renderSelectedTemplate()}
        </div>
      </div>

      {/* Full Screen Preview Dialog */}
      <Dialog open={isFullScreenPreview} onOpenChange={setIsFullScreenPreview}>
        <DialogContent className="max-w-[900px] h-[90vh] p-0 bg-white overflow-hidden">
          <div className="h-full overflow-auto p-6 cosmic-scroll-area">
            {renderSelectedTemplate()}
          </div>
          <DialogClose className="absolute top-4 right-4 rounded-full hover:bg-blue-500/10 transition-colors" />
        </DialogContent>
      </Dialog>
    </div>
  );
}