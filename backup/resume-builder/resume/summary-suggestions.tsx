import React, { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Loader2, Check, Sparkles, RefreshCw } from "lucide-react";

// Component for professional summary AI suggestions
export interface SummarySuggestionsProps {
  resumeId: string;
  onApply: (summary: string) => void;
}

export type SummaryLength = "short" | "medium" | "long";

export default function SummarySuggestions({ resumeId, onApply }: SummarySuggestionsProps) {
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
        console.log("Refresh limit reached. Try a different length option.");
        setIsGenerating(false);
        return;
      }
    }

    // Generate sample summaries based on resume content
    const getFallbackSummaries = (length: SummaryLength) => {
      // Short summaries
      if (length === "short") {
        return [
          "Skilled professional with a proven track record in delivering high-impact solutions.",
          "Results-oriented professional with expertise in strategic planning and execution.",
          "Dynamic professional with strong technical and communication skills.",
        ];
      }
      // Long summaries
      else if (length === "long") {
        return [
          "Accomplished professional with extensive experience driving innovation and operational excellence. Demonstrates exceptional ability to identify opportunities for improvement and implement strategic solutions that enhance business performance. Combines technical expertise with strong leadership capabilities to guide teams through complex projects and initiatives.",
          "Results-driven professional with a comprehensive background in developing and implementing strategic initiatives. Skilled at translating business requirements into effective solutions while maintaining a focus on quality and efficiency. Recognized for ability to collaborate across departments and deliver measurable improvements to organizational processes.",
          "Versatile professional with a proven track record of success across multiple domains. Leverages deep technical knowledge and business acumen to drive transformative change and achieve ambitious goals. Excels at building relationships with stakeholders at all levels and communicating complex concepts in accessible terms.",
        ];
      }
      // Medium summaries (default)
      else {
        return [
          "Accomplished professional with a proven track record of delivering innovative solutions. Adept at leveraging expertise to drive business outcomes and optimize processes.",
          "Results-driven professional combining technical knowledge with strong communication skills. Committed to continuous improvement and delivering high-quality work that exceeds expectations.",
          "Versatile and dedicated professional with strong problem-solving abilities. Effectively balances technical excellence with business requirements to create impactful solutions.",
        ];
      }
    };

    // If we have a valid resumeId (not "new" and not null), try to get AI suggestions
    if (resumeId && resumeId !== "new") {
      try {
        // Use the summaryOnly parameter to get complete summary rewrites
        // Add length parameter and randomSeed to ensure we get different results each time
        const res = await apiRequest(
          "GET",
          `/api/resumes/${resumeId}/suggestions?summaryOnly=true&length=${length}&seed=${generationCount}`,
        );
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
    // Use the fallback summaries
    setSummaries(getFallbackSummaries(length));
    setIsGenerating(false);
  };

  return (
    <div>
      {summaries.length === 0 ? (
        <div className="space-y-4 py-3">
          <div className="text-center">
            <h4 className="text-sm font-medium text-blue-300 mb-2">
              Choose Summary Length
            </h4>
            <div className="flex space-x-2 mb-4">
              <Button
                onClick={() => handleGenerateSummaries("short")}
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="flex-1 border-blue-500/30 text-blue-200 hover:bg-blue-900/30 hover:text-blue-100"
              >
                Short
              </Button>
              <Button
                onClick={() => handleGenerateSummaries("medium")}
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="flex-1 border-blue-500/30 text-blue-200 hover:bg-blue-900/30 hover:text-blue-100"
              >
                Medium
              </Button>
              <Button
                onClick={() => handleGenerateSummaries("long")}
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="flex-1 border-blue-500/30 text-blue-200 hover:bg-blue-900/30 hover:text-blue-100"
              >
                Long
              </Button>
            </div>
          </div>

          <Button
            onClick={() => handleGenerateSummaries("medium")}
            disabled={isGenerating}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 bg-[rgba(20,30,70,0.6)] border-blue-500/30 text-blue-100"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating summaries...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
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
              className="bg-[rgba(20,30,70,0.6)] p-3 rounded-md border border-blue-500/30 text-sm relative group backdrop-blur-sm"
            >
              <p className="text-gray-200">{summary}</p>
              <Button
                onClick={() => onApply(summary)}
                size="sm"
                className="mt-2 w-full flex items-center justify-center gap-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0"
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
              className="flex-1 items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Short
            </Button>
            <Button
              onClick={() => handleGenerateSummaries("medium")}
              variant="ghost"
              size="sm"
              className="flex-1 items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Medium
            </Button>
            <Button
              onClick={() => handleGenerateSummaries("long")}
              variant="ghost"
              size="sm"
              className="flex-1 items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Long
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}