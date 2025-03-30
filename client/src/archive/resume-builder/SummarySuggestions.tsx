import React, { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Check, RefreshCw } from "lucide-react";

export type SummaryLength = "short" | "medium" | "long";

export interface SummarySuggestionsProps {
  resumeId: string;
  jobTitle?: string;
  existingSummary?: string; // Added to avoid repetition
  onApply: (summary: string) => void;
}

export default function SummarySuggestions({ 
  resumeId, 
  jobTitle,
  existingSummary,
  onApply 
}: SummarySuggestionsProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [summaries, setSummaries] = useState<string[]>([]);
  const [lastUsedLength, setLastUsedLength] = useState<SummaryLength>("medium");
  const [generationCount, setGenerationCount] = useState(0);
  const [refreshCount, setRefreshCount] = useState<
    Record<SummaryLength, number>
  >({
    short: 0,
    medium: 0,
    long: 0,
  });

  // Generate AI summaries with length option
  const handleGenerateSummaries = async (length: SummaryLength = "medium") => {
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
            "You've reached the maximum number of refreshes. Try a different length option.",
          variant: "default",
        });
        setIsGenerating(false);
        return;
      }
    }

    // Generate sample summaries based on resume content and job title
    const getFallbackSummaries = (length: SummaryLength) => {
      const jobTitle_safe = jobTitle || "professional";
      
      // Short summaries with job-specific focus
      if (length === "short") {
        return [
          `Results-driven ${jobTitle_safe} with a proven track record of delivering impactful solutions and exceeding performance targets.`,
          `Innovative ${jobTitle_safe} skilled in leveraging cutting-edge technologies to drive operational excellence and business growth.`,
          `Dynamic ${jobTitle_safe} combining technical expertise with strategic vision to transform challenges into opportunities.`,
        ];
      }
      // Long summaries with quantifiable achievements
      else if (length === "long") {
        return [
          `Accomplished ${jobTitle_safe} with over 5 years of experience spearheading cross-functional teams to achieve strategic goals. Proven ability to optimize processes, resulting in a 30% increase in efficiency and $200K in cost savings. Recognized for exceptional leadership and problem-solving skills in fast-paced environments.`,
          `Results-oriented ${jobTitle_safe} with a strong background in data-driven decision-making. Successfully implemented innovative solutions that improved customer satisfaction by 25% and reduced operational costs by 15%. Adept at collaborating with stakeholders across all levels to deliver measurable results and drive continuous improvement.`,
          `Strategic ${jobTitle_safe} with expertise in project management and process optimization. Led multiple high-impact initiatives, including a $1M digital transformation project that increased revenue by 20%. Known for strong communication skills and ability to translate complex technical concepts into actionable business strategies.`,
        ];
      }
      // Medium summaries with industry-specific language
      else {
        return [
          `Experienced ${jobTitle_safe} with a track record of delivering innovative solutions that drive business value. Skilled in process optimization and team leadership, resulting in significant efficiency gains and improved stakeholder satisfaction.`,
          `Dedicated ${jobTitle_safe} with expertise in strategic planning and execution. Proven ability to leverage data-driven insights and cross-functional collaboration to achieve measurable outcomes that exceed expectations.`,
          `Forward-thinking ${jobTitle_safe} with strong problem-solving abilities and technical acumen. Successfully led initiatives that improved key performance metrics by 25% and enhanced organizational effectiveness through thoughtful implementation of best practices.`,
        ];
      }
    };

    // If we have a valid resumeId (not "new" and not null), try to get AI suggestions
    if (resumeId && resumeId !== "new") {
      try {
        // Build URL with all relevant parameters
        let url = `/api/resumes/${resumeId}/suggestions?summaryOnly=true&length=${length}&seed=${generationCount}`;
        
        // Add job title if available for more tailored results
        if (jobTitle) {
          url += `&jobTitle=${encodeURIComponent(jobTitle)}`;
        }
        
        // Add existing summary to avoid repetition and ensure complementary suggestions
        if (existingSummary) {
          url += `&existingSummary=${encodeURIComponent(existingSummary)}`;
        }
        
        const res = await apiRequest("GET", url);
        const data = await res.json();

        if (
          data.success &&
          data.suggestions &&
          Array.isArray(data.suggestions)
        ) {
          setSummaries(data.suggestions.slice(0, 3));
          setIsGenerating(false);
          return;
        }
      } catch (error) {
        console.error("Error generating summaries:", error);
      }
    }

    // If we get here, either the API call failed or we don't have a valid resumeId
    // Filter fallback summaries to avoid similar content to existing summary
    if (existingSummary) {
      const normalize = (text: string) => text.toLowerCase().replace(/[^\w\s]/g, '').trim();
      const existingSummaryNormalized = normalize(existingSummary);
      
      // Get fallback summaries
      const fallbackSummaries = getFallbackSummaries(length).filter(summary => {
        const summaryNormalized = normalize(summary);
        
        // Simple similarity check - if they share too many words, filter out
        const existingWords = existingSummaryNormalized.split(' ');
        const summaryWords = summaryNormalized.split(' ');
        
        // Count common words
        const commonWords = existingWords.filter(word => 
          word.length > 3 && summaryWords.includes(word)
        ).length;
        
        // If more than 30% of words are common, consider it too similar
        return commonWords / Math.min(existingWords.length, summaryWords.length) < 0.3;
      });
      
      // Use filtered summaries if available, otherwise use all fallbacks
      setSummaries(fallbackSummaries.length > 0 ? fallbackSummaries : getFallbackSummaries(length));
    } else {
      // No existing summary, use all fallbacks
      setSummaries(getFallbackSummaries(length));
    }
    setIsGenerating(false);
  };

  return (
    <div>
      {summaries.length === 0 ? (
        <div className="space-y-4 py-3">
          <div className="text-center">
            <h4 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-sm font-medium mb-2">
              Choose Summary Length
            </h4>
            <div className="flex space-x-2 mb-4">
              <Button
                onClick={() => handleGenerateSummaries("short")}
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="flex-1 cosmic-button cosmic-button-outline border-white/10 hover:bg-blue-900/30 hover:text-blue-100"
              >
                Short
              </Button>
              <Button
                onClick={() => handleGenerateSummaries("medium")}
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="flex-1 cosmic-button cosmic-button-outline border-white/10 hover:bg-blue-900/30 hover:text-blue-100"
              >
                Medium
              </Button>
              <Button
                onClick={() => handleGenerateSummaries("long")}
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="flex-1 cosmic-button cosmic-button-outline border-white/10 hover:bg-blue-900/30 hover:text-blue-100"
              >
                Long
              </Button>
            </div>
          </div>

          <Button
            onClick={() => handleGenerateSummaries("medium")}
            disabled={isGenerating}
            variant="outline"
            className="w-full cosmic-button cosmic-button-glow flex items-center justify-center gap-2 border-white/10 text-blue-100"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin cosmic-section-icon" />
                Generating summaries...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 cosmic-section-icon" />
                Generate AI summaries
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {summaries.map((summary, index) => (
            <div
              key={index}
              className="cosmic-card cosmic-card-gradient p-3 rounded-md border border-white/10 text-sm relative group backdrop-blur-sm"
            >
              <p className="text-gray-200">{summary}</p>
              <Button
                onClick={() => onApply(summary)}
                size="sm"
                className="cosmic-button cosmic-button-primary cosmic-button-glow mt-2 w-full flex items-center justify-center gap-1"
              >
                <Check className="h-3 w-3" />
                Use this summary
              </Button>
            </div>
          ))}
          <div className="flex space-x-2">
            <Button
              onClick={() => handleGenerateSummaries("short")}
              variant="ghost"
              size="sm"
              className="flex-1 cosmic-button cosmic-button-outline items-center justify-center border-white/10 hover:text-blue-300 hover:bg-blue-900/30"
            >
              <RefreshCw className="h-3 w-3 mr-1 cosmic-section-icon" />
              Short
            </Button>
            <Button
              onClick={() => handleGenerateSummaries("medium")}
              variant="ghost"
              size="sm"
              className="flex-1 cosmic-button cosmic-button-outline items-center justify-center border-white/10 hover:text-blue-300 hover:bg-blue-900/30"
            >
              <RefreshCw className="h-3 w-3 mr-1 cosmic-section-icon" />
              Medium
            </Button>
            <Button
              onClick={() => handleGenerateSummaries("long")}
              variant="ghost"
              size="sm"
              className="flex-1 cosmic-button cosmic-button-outline items-center justify-center border-white/10 hover:text-blue-300 hover:bg-blue-900/30"
            >
              <RefreshCw className="h-3 w-3 mr-1 cosmic-section-icon" />
              Long
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}