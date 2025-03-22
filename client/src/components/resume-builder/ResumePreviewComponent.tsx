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
    <div className="cosmic-preview-container h-full flex flex-col">
      {/* Preview Header */}
      <div className="bg-cosmic-card-secondary border-b border-cosmic-border p-3 flex items-center justify-between" style={{ padding: 'var(--space-3)' }}>
        <h3 className="text-sm font-medium text-cosmic-text">Preview</h3>
        <div className="flex items-center gap-2" style={{ gap: 'var(--space-2)' }}>
          <Button
            variant="ghost"
            size="sm"
            className="cosmic-button-ghost h-7 w-7 p-0 text-cosmic-text-secondary hover:text-cosmic-text"
            onClick={() => window.print()}
            title="Print Resume"
          >
            <Printer className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="cosmic-button-ghost h-7 w-7 p-0 text-cosmic-text-secondary hover:text-cosmic-text"
            onClick={() => onDownload && onDownload()}
            title="Download Resume"
          >
            <Download className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="cosmic-button-ghost h-7 w-7 p-0 text-cosmic-text-secondary hover:text-cosmic-text"
            onClick={() => setIsFullScreenPreview(true)}
            title="Fullscreen Preview"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Resume Preview */}
      <div className="flex-1 overflow-auto bg-cosmic-background-alt">
        <div className="mx-auto w-full h-full max-w-[612px] shadow-lg">
          {renderSelectedTemplate()}
        </div>
      </div>
      
      {/* Fullscreen Preview Dialog */}
      <Dialog 
        open={isFullScreenPreview} 
        onOpenChange={setIsFullScreenPreview}
      >
        <DialogContent className="max-w-[90vw] w-[850px] max-h-[90vh] p-0 overflow-hidden cosmic-dialog">
          <div className="bg-cosmic-card-secondary p-3 flex items-center justify-between border-b border-cosmic-border" style={{ padding: 'var(--space-3)' }}>
            <h3 className="text-sm font-medium text-cosmic-text">Resume Preview</h3>
            <div className="flex items-center gap-2" style={{ gap: 'var(--space-2)' }}>
              <Button
                variant="ghost"
                size="sm"
                className="cosmic-button-ghost h-7 w-7 p-0 text-cosmic-text-secondary hover:text-cosmic-text"
                onClick={() => window.print()}
                title="Print Resume"
              >
                <Printer className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="cosmic-button-ghost h-7 w-7 p-0 text-cosmic-text-secondary hover:text-cosmic-text"
                onClick={() => onDownload && onDownload()}
                title="Download Resume"
              >
                <Download className="h-4 w-4" />
              </Button>
              
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="cosmic-button-ghost h-7 p-1 text-cosmic-text-secondary hover:text-cosmic-text"
                >
                  Close
                </Button>
              </DialogClose>
            </div>
          </div>
          
          <div className="overflow-auto bg-cosmic-background-alt h-[calc(90vh-52px)]">
            <div className="mx-auto my-8 w-full max-w-[850px] bg-white shadow-xl" style={{ margin: 'var(--space-8) auto' }}>
              {renderSelectedTemplate()}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}