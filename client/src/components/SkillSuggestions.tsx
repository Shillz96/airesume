import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, PlusCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";

interface SkillSuggestionsProps {
  resumeId: string;
  jobTitle?: string;
  onApply: (skill: string) => void;
}

export default function SkillSuggestions({ 
  resumeId, 
  jobTitle, 
  onApply 
}: SkillSuggestionsProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  
  const generateSkills = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    
    try {
      let url = `/api/resumes/${resumeId}/suggestions?skillsOnly=true`;
      if (jobTitle) {
        url += `&jobTitle=${encodeURIComponent(jobTitle)}`;
      }
      
      const res = await apiRequest("GET", url);
      const data = await res.json();
      
      if (data.success && Array.isArray(data.suggestions)) {
        setSkills(data.suggestions);
      } else {
        console.error("Error generating skills:", data);
        setSkills([
          "JavaScript", "TypeScript", "React", "Node.js", "CI/CD",
          "Problem Solving", "Communication", "Team Leadership"
        ]);
      }
    } catch (error) {
      console.error("Error generating skills:", error);
      setSkills([
        "JavaScript", "TypeScript", "React", "Node.js", "CI/CD",
        "Problem Solving", "Communication", "Team Leadership"
      ]);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="space-y-4">
      {skills.length === 0 ? (
        <div>
          <Button
            onClick={generateSkills}
            disabled={isGenerating}
            className="w-full"
            variant="outline"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generating skills...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate suggested skills
                {jobTitle ? ` for ${jobTitle}` : ''}
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge 
              key={index}
              className="cursor-pointer hover:bg-primary-100 flex items-center gap-1"
              variant="outline"
              onClick={() => onApply(skill)}
            >
              {skill}
              <PlusCircle className="h-3 w-3 ml-1" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}