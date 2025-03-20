import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { PreviewSuggestion } from "@/components/preview-suggestion";

interface SummarySuggestionsProps {
  resumeId: string;
  onApply: (summary: string) => void;
}

export default function SummarySuggestions({ resumeId, onApply }: SummarySuggestionsProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [summaries, setSummaries] = useState<string[]>([]);
  
  const generateSummaries = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    
    try {
      const res = await apiRequest(
        "GET", 
        `/api/resumes/${resumeId}/suggestions?summaryOnly=true`
      );
      const data = await res.json();
      
      if (data.success && Array.isArray(data.suggestions)) {
        setSummaries(data.suggestions);
      } else {
        console.error("Error generating summaries:", data);
        setSummaries([
          "Experienced professional with proven expertise in project delivery and technical implementation. Adept at leading cross-functional teams and driving continuous improvement initiatives that enhance operational efficiency."
        ]);
      }
    } catch (error) {
      console.error("Error generating summaries:", error);
      setSummaries([
        "Experienced professional with proven expertise in project delivery and technical implementation. Adept at leading cross-functional teams and driving continuous improvement initiatives that enhance operational efficiency."
      ]);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="space-y-4">
      {summaries.length === 0 ? (
        <div>
          <Button
            onClick={generateSummaries}
            disabled={isGenerating}
            className="w-full"
            variant="outline"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generating summaries...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate AI summaries
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {summaries.map((summary, index) => (
            <PreviewSuggestion
              key={index}
              suggestion={summary}
              onApply={onApply}
              previewTarget="summary-textarea"
            />
          ))}
        </div>
      )}
    </div>
  );
}