import React from "react";
import { CosmicButton } from "@/components/cosmic-button-refactored";
import { Input } from "@/components/ui/input";
import {
  Save,
  FileText,
  Loader2,
  Download,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="border-b border-white/10 backdrop-blur-md p-4 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <FileText className="text-primary h-5 w-5 mr-2" />
          <Input
            value={resumeTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            className={cn(
              "max-w-xs bg-card/30 border-white/10",
              "focus:border-primary/50 focus:ring-primary/25",
              "placeholder:text-muted"
            )}
            placeholder="Resume Title"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <CosmicButton
          variant="outline"
          size="sm"
          onClick={onOpenAIAssistant}
          iconLeft={<Cpu className="h-4 w-4" />}
        >
          AI Assistant
        </CosmicButton>
        
        <CosmicButton
          variant="outline"
          size="sm"
          onClick={onDownload}
          iconLeft={<Download className="h-4 w-4" />}
        >
          Download PDF
        </CosmicButton>
        
        <CosmicButton
          variant="primary"
          size="sm"
          withGlow
          disabled={isSaving || !isDirty}
          onClick={onSave}
          iconLeft={isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        >
          {isSaving ? "Saving..." : "Save Resume"}
        </CosmicButton>
      </div>
    </div>
  );
}