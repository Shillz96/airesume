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
    <div className="border-b border-blue-500/20 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 backdrop-blur-md p-4 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <FileText className="h-5 w-5 text-blue-300 mr-2" />
          <Input
            value={resumeTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            className="max-w-xs bg-slate-800/50 border-blue-500/30 text-blue-50 focus:border-blue-400 placeholder:text-blue-300/50"
            placeholder="Resume Title"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="border-blue-500/30 text-blue-300 hover:bg-blue-900/30 hover:text-blue-100"
          onClick={onOpenAIAssistant}
        >
          <Cpu className="h-4 w-4 mr-1" />
          AI Assistant
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="border-blue-500/30 text-blue-300 hover:bg-blue-900/30 hover:text-blue-100"
          onClick={onDownload}
        >
          <Download className="h-4 w-4 mr-1" />
          Download PDF
        </Button>
        
        <CosmicButton
          variant="default"
          size="sm"
          disabled={isSaving || !isDirty}
          onClick={onSave}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0"
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