import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  Save,
  Download,
  Sparkles,
  Loader2
} from 'lucide-react';

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
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  
  return (
    <header className="sticky top-0 z-10 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-blue-900/30 shadow-md py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/resumes" className="text-gray-300 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          
          {isEditingTitle ? (
            <div className="flex items-center space-x-2">
              <Input
                value={resumeTitle}
                onChange={(e) => onTitleChange(e.target.value)}
                className="h-8 bg-gray-800 border-blue-600/30 text-white"
                placeholder="Resume title"
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setIsEditingTitle(false);
                  }
                }}
                autoFocus
              />
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsEditingTitle(false)}
                className="h-8 px-2 text-gray-400 hover:text-white"
              >
                Done
              </Button>
            </div>
          ) : (
            <div 
              className="text-lg font-medium text-white cursor-pointer hover:underline" 
              onClick={() => setIsEditingTitle(true)}
            >
              {resumeTitle || "Untitled Resume"}
            </div>
          )}
          
          {isDirty && !isSaving && (
            <span className="text-amber-400 text-xs">Unsaved changes</span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline" 
            size="sm"
            className="text-white bg-blue-900/20 border-blue-900/50 hover:bg-blue-900/30"
            onClick={onOpenAIAssistant}
          >
            <Sparkles className="h-4 w-4 mr-1 text-blue-400" />
            AI Assist
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="text-white bg-blue-900/20 border-blue-900/50 hover:bg-blue-900/30"
            onClick={onDownload}
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
          
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onSave}
            disabled={isSaving || !isDirty}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-1" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}