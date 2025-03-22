import React, { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Loader2, Check, Sparkles, RefreshCw } from "lucide-react";

/**
 * Component for experience bullet point AI suggestions
 */
export interface ExperienceSuggestionsProps {
  resumeId: string;
  jobTitle?: string;
  onApply: (bulletPoint: string) => void;
}

export type BulletLength = "short" | "medium" | "long";

export default function ExperienceSuggestions({
  resumeId,
  jobTitle,
  onApply,
}: ExperienceSuggestionsProps) {
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
        console.log("Refresh limit reached. Try a different style option.");
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
          `Implemented innovative solutions for ${jobTitle_safe} role, resulting in 35% efficiency improvement and $120K annual savings.`,
          `Led key projects as ${jobTitle_safe}, delivering results ahead of schedule and under budget while maintaining high quality standards.`,
          `Collaborated with cross-functional teams to enhance ${jobTitle_safe}-related processes, improving workflow efficiency by 28%.`,
          `Increased performance metrics by 40% through optimization of processes and implementation of best practices in the ${jobTitle_safe} department.`,
          `Developed and implemented testing protocols that reduced time by 25% while improving quality outcomes and customer satisfaction.`,
        ];
      }
    };

    // If we have a valid resumeId (not "new" and not null), try to get AI suggestions
    if (resumeId && resumeId !== "new") {
      try {
        // Use the experienceOnly parameter to get ATS-optimized bullet points
        let url = `/api/resumes/${resumeId}/suggestions?experienceOnly=true&length=${length}&seed=${generationCount}`;
        if (jobTitle) {
          url += `&jobTitle=${encodeURIComponent(jobTitle)}`;
        }

        const res = await apiRequest("GET", url);
        const data = await res.json();

        if (
          data.success &&
          data.suggestions &&
          Array.isArray(data.suggestions)
        ) {
          setBulletPoints(data.suggestions);
          setIsGenerating(false);
          return;
        }
      } catch (error) {
        console.error("Error generating experience bullet points:", error);
      }
    }

    // If we get here, either the API call failed or we don't have a valid resumeId
    setBulletPoints(getFallbackBulletPoints(length));
    setIsGenerating(false);
  };

  return (
    <div>
      {bulletPoints.length === 0 ? (
        <div className="space-y-4 py-3">
          <div className="text-center">
            <h4 className="text-sm font-medium text-blue-300 mb-2">
              Choose Bullet Point Style
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
                Standard
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
              Standard
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