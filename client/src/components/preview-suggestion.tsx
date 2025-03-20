import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PreviewSuggestionProps {
  suggestion: string;
  onApply: (suggestion: string) => void;
  previewTarget?: string; // ID of the target textarea to preview into
}

export function PreviewSuggestion({ 
  suggestion, 
  onApply,
  previewTarget
}: PreviewSuggestionProps) {
  const [isHovering, setIsHovering] = useState(false);
  
  const handleMouseEnter = () => {
    setIsHovering(true);
    
    if (previewTarget) {
      const targetElement = document.getElementById(previewTarget) as HTMLTextAreaElement;
      if (targetElement) {
        // Store the original value
        targetElement.dataset.originalValue = targetElement.value;
        // Preview the suggestion
        targetElement.value = suggestion;
        // Add a visual indicator
        targetElement.classList.add("bg-primary-50", "text-primary-900");
      }
    }
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    
    if (previewTarget) {
      const targetElement = document.getElementById(previewTarget) as HTMLTextAreaElement;
      if (targetElement && targetElement.dataset.originalValue) {
        // Restore the original value
        targetElement.value = targetElement.dataset.originalValue;
        // Remove visual indicator
        targetElement.classList.remove("bg-primary-50", "text-primary-900");
      }
    }
  };
  
  return (
    <TooltipProvider>
      <div 
        className="bg-white p-3 rounded-md border border-secondary-200 text-sm relative group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="text-secondary-600">
              {suggestion.length > 100 
                ? `${suggestion.substring(0, 100)}...` 
                : suggestion}
            </p>
          </TooltipTrigger>
          <TooltipContent className="max-w-md">
            <p>Hover to preview in the text box</p>
          </TooltipContent>
        </Tooltip>
        <Button
          onClick={() => onApply(suggestion)}
          size="sm"
          className="mt-2 w-full flex items-center justify-center gap-1"
        >
          <Check className="h-3 w-3" />
          {isHovering ? "Apply this suggestion" : "Use this suggestion"}
        </Button>
      </div>
    </TooltipProvider>
  );
}