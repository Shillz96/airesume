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
    <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-500/20 rounded-lg overflow-hidden h-full flex flex-col">
      <div className="p-3 border-b border-blue-500/20 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 flex justify-between items-center">
        <h3 className="text-blue-50 font-medium text-sm">Resume Preview</h3>
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
      
      <div className="flex-grow overflow-auto bg-white p-4">
        <div className="max-w-[800px] mx-auto shadow-md">
          {renderSelectedTemplate()}
        </div>
      </div>

      {/* Full Screen Preview Dialog */}
      <Dialog open={isFullScreenPreview} onOpenChange={setIsFullScreenPreview}>
        <DialogContent className="max-w-[900px] h-[90vh] p-0 bg-white">
          <div className="h-full overflow-auto p-6">
            {renderSelectedTemplate()}
          </div>
          <DialogClose className="absolute top-4 right-4" />
        </DialogContent>
      </Dialog>
    </div>
  );
}