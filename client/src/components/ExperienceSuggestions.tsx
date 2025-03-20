import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { PreviewSuggestion } from "@/components/preview-suggestion";

interface ExperienceSuggestionsProps {
  resumeId: string;
  jobTitle?: string;
  onApply: (bulletPoint: string) => void;
  previewTargetId?: string;
}

export default function ExperienceSuggestions({ 
  resumeId, 
  jobTitle, 
  onApply,
  previewTargetId
}: ExperienceSuggestionsProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [bulletPoints, setBulletPoints] = useState<string[]>([]);
  
  const generateBulletPoints = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    
    try {
      let url = `/api/resumes/${resumeId}/suggestions?experienceOnly=true`;
      if (jobTitle) {
        url += `&jobTitle=${encodeURIComponent(jobTitle)}`;
      }
      
      const res = await apiRequest("GET", url);
      const data = await res.json();
      
      if (data.success && Array.isArray(data.suggestions)) {
        setBulletPoints(data.suggestions);
      } else {
        console.error("Error generating experience bullet points:", data);
        setBulletPoints([
          "Increased website performance by 40% through optimization of front-end code and implementation of caching strategies.",
          "Developed and implemented automated testing protocols that reduced QA time by 25% while improving code quality."
        ]);
      }
    } catch (error) {
      console.error("Error generating experience bullet points:", error);
      setBulletPoints([
        "Increased website performance by 40% through optimization of front-end code and implementation of caching strategies.",
        "Developed and implemented automated testing protocols that reduced QA time by 25% while improving code quality."
      ]);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="space-y-4">
      {bulletPoints.length === 0 ? (
        <div>
          <Button
            onClick={generateBulletPoints}
            disabled={isGenerating}
            className="w-full"
            variant="outline"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generating bullet points...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate bullet points
                {jobTitle ? ` for ${jobTitle}` : ''}
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {bulletPoints.map((bulletPoint, index) => (
            <PreviewSuggestion
              key={index}
              suggestion={bulletPoint}
              onApply={onApply}
              previewTarget={previewTargetId}
            />
          ))}
        </div>
      )}
    </div>
  );
}