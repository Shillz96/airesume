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
    <header className="sticky top-0 z-10 cosmic-header border-b border-cosmic-border shadow-md" style={{ padding: 'var(--space-4) 0' }}>
      <div className="container mx-auto px-4 flex items-center justify-between" style={{ padding: '0 var(--space-4)' }}>
        <div className="flex items-center" style={{ gap: 'var(--space-4)' }}>
          <Link href="/resumes" className="text-cosmic-text-secondary hover:text-cosmic-text">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          
          {isEditingTitle ? (
            <div className="flex items-center" style={{ gap: 'var(--space-2)' }}>
              <Input
                value={resumeTitle}
                onChange={(e) => onTitleChange(e.target.value)}
                className="cosmic-input h-8 bg-cosmic-input-bg border-cosmic-border text-cosmic-text"
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
                className="cosmic-button-ghost h-8 px-2 text-cosmic-text-secondary hover:text-cosmic-text"
              >
                Done
              </Button>
            </div>
          ) : (
            <div 
              className="text-lg font-medium text-cosmic-text cursor-pointer hover:underline" 
              onClick={() => setIsEditingTitle(true)}
            >
              {resumeTitle || "Untitled Resume"}
            </div>
          )}
          
          {isDirty && !isSaving && (
            <span className="text-cosmic-warning text-xs">Unsaved changes</span>
          )}
        </div>
        
        <div className="flex items-center" style={{ gap: 'var(--space-2)' }}>
          <Button
            variant="outline" 
            size="sm"
            className="cosmic-button-outline text-cosmic-text border-cosmic-border hover:bg-cosmic-card-hover"
            onClick={onOpenAIAssistant}
          >
            <Sparkles className="h-4 w-4 mr-1 text-cosmic-accent" />
            AI Assist
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="cosmic-button-outline text-cosmic-text border-cosmic-border hover:bg-cosmic-card-hover"
            onClick={onDownload}
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
          
          <Button
            size="sm"
            className="cosmic-button bg-cosmic-accent hover:bg-cosmic-accent-hover text-white"
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