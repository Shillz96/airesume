import React from "react";
import { CosmicButton } from "@/components/cosmic-button-refactored";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Save,
  FileText,
  Loader2,
  Download,
  Cpu
} from "lucide-react";

interface ResumeBuilderHeaderProps {
  resumeTitle: string;
  onTitleChange: (value: string) => void;
  onSave: () => void;
  onDownload: () => void;
  onOpenAIAssistant: () => void;
  isSaving: boolean;
  isDirty: boolean;
}

export default function ResumeBuilderHeader({
  resumeTitle,
  onTitleChange,
  onSave,
  onDownload,
  onOpenAIAssistant,
  isSaving,
  isDirty
}: ResumeBuilderHeaderProps) {
  return (
    <div className="cosmic-header border-b border-white/10 backdrop-blur-md p-4 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <FileText className="cosmic-section-icon h-5 w-5 mr-2" />
          <Input
            value={resumeTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            className="max-w-xs cosmic-input border-white/10 focus:border-blue-400 placeholder:text-blue-300/50"
            placeholder="Resume Title"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="cosmic-button cosmic-button-outline border-white/10 hover:bg-blue-900/30 hover:text-blue-100"
          onClick={onOpenAIAssistant}
        >
          <Cpu className="h-4 w-4 mr-1" />
          AI Assistant
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="cosmic-button cosmic-button-outline border-white/10 hover:bg-blue-900/30 hover:text-blue-100"
          onClick={onDownload}
        >
          <Download className="h-4 w-4 mr-1" />
          Download PDF
        </Button>
        
        <CosmicButton
          variant="primary"
          size="sm"
          disabled={isSaving || !isDirty}
          onClick={onSave}
          className="cosmic-button cosmic-button-primary cosmic-button-glow"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-1" />
              Save Resume
            </>
          )}
        </CosmicButton>
      </div>
    </div>
  );
}