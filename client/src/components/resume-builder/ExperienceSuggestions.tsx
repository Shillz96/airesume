import React, { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Check, RefreshCw } from "lucide-react";

export type BulletLength = "short" | "medium" | "long";

export interface ExperienceSuggestionsProps {
  resumeId: string;
  jobTitle?: string;
  currentRole?: string; // Current role/title for more targeted suggestions
  existingBulletPoints?: string[]; // Current bullet points to avoid duplicates
  onApply: (bulletPoint: string) => void;
}

export default function ExperienceSuggestions({
  resumeId,
  jobTitle,
  currentRole = '',
  existingBulletPoints = [],
  onApply,
}: ExperienceSuggestionsProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [bulletPoints, setBulletPoints] = useState<string[]>([]);
  const [lastUsedLength, setLastUsedLength] = useState<BulletLength>("medium");
  const [generationCount, setGenerationCount] = useState(0);
  const [refreshCount, setRefreshCount] = useState<
    Record<BulletLength, number>
  >({
    short: 0,
    medium: 0,
    long: 0,
  });

  // Generate AI bullet points for experience section with length options
  const handleGenerateBulletPoints = async (
    length: BulletLength = "medium",
  ) => {
    setIsGenerating(true);

    // Reset refresh count if changing length type
    if (lastUsedLength !== length) {
      setLastUsedLength(length);
      setGenerationCount((prev) => prev + 1);
      setRefreshCount((prev) => ({ ...prev, [length]: 0 }));
    } else {
      // Increment refresh count for this length type
      const newRefreshCount = refreshCount[length] + 1;

      // Only allow up to 5 refreshes per length type
      if (newRefreshCount <= 5) {
        setRefreshCount((prev) => ({ ...prev, [length]: newRefreshCount }));
        setGenerationCount((prev) => prev + 1);
      } else {
        toast({
          title: "Refresh limit reached",
          description:
            "You've reached the maximum number of refreshes. Try a different style option.",
          variant: "default",
        });
        setIsGenerating(false);
        return;
      }
    }

    // Generate fallback bullet points based on job title and length
    const getFallbackBulletPoints = (length: BulletLength) => {
      const jobTitle_safe = jobTitle || "professional";

      // Short bullet points
      if (length === "short") {
        return [
          `Improved ${jobTitle_safe} processes by 30%.`,
          `Led cross-functional teams to deliver key projects.`,
          `Reduced costs by 25% through strategic optimization.`,
          `Increased customer satisfaction scores to 95%.`,
          `Implemented innovative solutions with measurable results.`,
        ];
      }
      // Long bullet points
      else if (length === "long") {
        return [
          `Spearheaded a comprehensive overhaul of ${jobTitle_safe} processes, resulting in a 30% increase in operational efficiency while simultaneously reducing implementation costs by $150,000 annually and improving team morale through more streamlined workflows.`,
          `Led cross-functional team of 12 professionals in the successful delivery of 5 high-priority projects valued at $2.3M collectively, consistently meeting or exceeding stakeholder expectations while maintaining budget constraints and aggressive timeline requirements.`,
          `Implemented innovative ${jobTitle_safe} solutions that dramatically improved data processing capabilities by 45%, resulting in faster decision-making processes and enabling the business to respond more effectively to rapidly changing market conditions.`,
          `Developed and executed strategic initiatives that increased departmental productivity by 37% within the first quarter, recognized by senior leadership for exceptional performance and promoted to lead advanced projects with greater scope and complexity.`,
          `Redesigned critical ${jobTitle_safe} infrastructure, resulting in 99.9% uptime, a 28% reduction in maintenance costs, and significantly enhanced user experience as measured by a 40-point improvement in Net Promoter Score.`,
        ];
      }
      // Medium bullet points (default)
      else {
        return [
          `Improved ${jobTitle_safe} processes by 30%, resulting in time savings of 15 hours per week and enhanced team productivity.`,
          `Led cross-functional team of 8 professionals to successfully deliver key projects on time and 10% under budget.`,
          `Implemented innovative solutions that reduced operational costs by 25% while improving service quality metrics.`,
          `Developed and executed optimization strategies that increased efficiency by 40% and reduced turnaround times by half.`,
          `Created comprehensive documentation and training materials that improved onboarding efficiency by 35% for new team members.`,
        ];
      }
    };

    // If we have a valid resumeId (not "new" and not null), try to get AI suggestions
    if (resumeId && resumeId !== "new") {
      try {
        // Create query string parameters including context information
        const existingBulletPointsParam = existingBulletPoints.length > 0 
          ? `&existingBulletPoints=${encodeURIComponent(existingBulletPoints.join('||'))}` 
          : '';
        
        const currentRoleParam = currentRole 
          ? `&currentRole=${encodeURIComponent(currentRole)}` 
          : '';
          
        const res = await apiRequest(
          "GET",
          `/api/resumes/${resumeId}/suggestions?experienceOnly=true&jobTitle=${encodeURIComponent(
            jobTitle || "",
          )}&length=${length}&seed=${generationCount}${currentRoleParam}${existingBulletPointsParam}`,
        );
        const data = await res.json();

        if (
          data.success &&
          data.suggestions &&
          Array.isArray(data.suggestions)
        ) {
          // Filter out any bullet points that might duplicate existing ones
          // Perform similarity check - here we're just checking if they start with the same words
          const filteredBulletPoints = data.suggestions.filter(bullet => {
            // Function to normalize text for comparison (lowercase, remove punctuation)
            const normalize = (text: string) => text.toLowerCase().replace(/[^\w\s]/g, '').trim();
            
            // Get first 5 words for similarity comparison
            const bulletStart = normalize(bullet).split(' ').slice(0, 5).join(' ');
            
            // Check if any existing bullet points start similarly
            return !existingBulletPoints.some(existing => {
              const existingStart = normalize(existing).split(' ').slice(0, 5).join(' ');
              return existingStart.includes(bulletStart) || bulletStart.includes(existingStart);
            });
          });
          
          setBulletPoints(filteredBulletPoints.length > 0 
            ? filteredBulletPoints.slice(0, 5) 
            : data.suggestions.slice(0, 5));
          setIsGenerating(false);
          return;
        }
      } catch (error) {
        console.error("Error generating experience bullet points:", error);
      }
    }

    // Fallback to generated bullet points, but filter out any duplicates
    const fallbackBulletPoints = getFallbackBulletPoints(length).filter(bullet => {
      // Simple check for duplicate bullet points
      const normalize = (text: string) => text.toLowerCase().replace(/[^\w\s]/g, '').trim();
      const bulletNormalized = normalize(bullet);
      
      return !existingBulletPoints.some(existing => {
        const existingNormalized = normalize(existing);
        return existingNormalized.includes(bulletNormalized) || bulletNormalized.includes(existingNormalized);
      });
    });
    
    setBulletPoints(fallbackBulletPoints.length > 0 
      ? fallbackBulletPoints 
      : getFallbackBulletPoints(length));
    setIsGenerating(false);
  };

  return (
    <div>
      {bulletPoints.length === 0 ? (
        <div className="space-y-4 py-3">
          <div className="text-center">
            <h4 className="text-sm font-medium text-blue-300 mb-2">
              Choose Bullet Point Length
            </h4>
            <div className="flex space-x-2 mb-4">
              <Button
                onClick={() => handleGenerateBulletPoints("short")}
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="flex-1 border-blue-500/30 text-blue-200 hover:bg-blue-900/30 hover:text-blue-100"
              >
                Concise
              </Button>
              <Button
                onClick={() => handleGenerateBulletPoints("medium")}
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="flex-1 border-blue-500/30 text-blue-200 hover:bg-blue-900/30 hover:text-blue-100"
              >
                Balanced
              </Button>
              <Button
                onClick={() => handleGenerateBulletPoints("long")}
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="flex-1 border-blue-500/30 text-blue-200 hover:bg-blue-900/30 hover:text-blue-100"
              >
                Detailed
              </Button>
            </div>
          </div>

          <Button
            onClick={() => handleGenerateBulletPoints("medium")}
            disabled={isGenerating}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 bg-[rgba(20,30,70,0.6)] border-blue-500/30 text-blue-100"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating bullet points...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate AI bullet points
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {bulletPoints.map((bullet, index) => (
            <div
              key={index}
              className="bg-[rgba(20,30,70,0.6)] p-3 rounded-md border border-blue-500/30 text-sm relative group backdrop-blur-sm"
            >
              <p className="text-gray-200">{bullet}</p>
              <Button
                onClick={() => onApply(bullet)}
                size="sm"
                className="mt-2 w-full flex items-center justify-center gap-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0"
              >
                <Check className="h-3 w-3" />
                Use this bullet point
              </Button>
            </div>
          ))}
          <div className="flex space-x-2">
            <Button
              onClick={() => handleGenerateBulletPoints("short")}
              variant="ghost"
              size="sm"
              className="flex-1 items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Concise
            </Button>
            <Button
              onClick={() => handleGenerateBulletPoints("medium")}
              variant="ghost"
              size="sm"
              className="flex-1 items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Balanced
            </Button>
            <Button
              onClick={() => handleGenerateBulletPoints("long")}
              variant="ghost"
              size="sm"
              className="flex-1 items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Detailed
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}