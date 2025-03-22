import React, { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { RefreshCw, PlusCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AIResumeAssistantProps {
  resumeId?: string;
  onApplySuggestion?: (suggestion: string) => void;
  suggestionType?: "summary" | "bullet" | "skill";
  activeTab?: string;
}

interface Suggestion {
  id: string;
  text: string;
  type: "summary" | "bullet" | "skill";
}

/**
 * AI Resume Assistant component that provides contextual suggestions based on the current tab
 * and allows users to apply them directly to their resume
 */
export default function AIResumeAssistant({
  resumeId,
  onApplySuggestion,
  suggestionType = "summary",
  activeTab = "profile"
}: AIResumeAssistantProps) {
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      id: '1',
      text: 'Accomplished professional with a proven track record of delivering innovative solutions. Adept at leveraging expertise to drive business outcomes and optimize processes.',
      type: 'summary'
    },
    {
      id: '2',
      text: 'Detail-oriented professional with a talent for analyzing complex situations and developing practical approaches. Consistently delivers results that drive business growth and operational excellence.',
      type: 'summary'
    },
    {
      id: '3',
      text: 'Dynamic professional with a balanced approach to technical expertise and business acumen. Skilled at handling strategic vision into actionable plans with measurable outcomes.',
      type: 'summary'
    }
  ]);

  // Get title for current suggestion type
  const getSuggestionTitle = () => {
    switch (suggestionType) {
      case "summary":
        return "Professional Summary Suggestions";
      case "bullet":
        return "Achievement Bullet Points";
      case "skill":
        return "Relevant Skills";
      default:
        return "AI Suggestions";
    }
  };

  // Get description for current suggestion type
  const getSuggestionDescription = () => {
    switch (suggestionType) {
      case "summary":
        return "Choose a professional summary that highlights your strengths";
      case "bullet":
        return "Select an achievement-focused bullet point for your experience";
      case "skill":
        return "Add relevant skills that match your target roles";
      default:
        return "Select a suggestion to add to your resume";
    }
  };

  // Add suggestion to resume
  const handleApplySuggestion = (suggestion: string) => {
    if (onApplySuggestion) {
      onApplySuggestion(suggestion);
      toast({
        title: "Suggestion applied",
        description: "The suggestion has been added to your resume.",
        variant: "default",
      });
    } else {
      toast({
        title: "Cannot apply suggestion",
        description: "There was an issue applying the suggestion.",
        variant: "destructive",
      });
    }
  };

  // Refresh suggestions mutation
  const { mutate: refreshSuggestions, isPending: isRefreshing } = useMutation({
    mutationFn: async () => {
      if (!resumeId) return null;
      
      let endpoint = `/api/resumes/${resumeId}/suggestions?`;
      
      // Add query param based on suggestion type
      switch (suggestionType) {
        case "summary":
          endpoint += "summaryOnly=true";
          break;
        case "bullet":
          endpoint += "experienceOnly=true";
          break;
        case "skill":
          endpoint += "skillsOnly=true";
          break;
      }
      
      const res = await apiRequest("GET", endpoint);
      return await res.json();
    },
    onSuccess: (data) => {
      if (data?.success && data.suggestions && Array.isArray(data.suggestions)) {
        // Map API response to our Suggestion format
        const newSuggestions = data.suggestions.map((text: string, index: number) => ({
          id: `api-${index}`,
          text,
          type: suggestionType || "summary"
        }));
        setSuggestions(newSuggestions);
      } else {
        // If API fails, use fallback suggestions
        const fallbackSuggestions = [
          {
            id: 'fallback-1',
            text: suggestionType === "summary" 
              ? 'Accomplished professional with a proven track record of delivering innovative solutions.'
              : suggestionType === "bullet"
              ? 'Increased operational efficiency by 25% through implementation of streamlined processes.'
              : 'Project Management, Team Leadership, Strategic Planning',
            type: suggestionType || "summary"
          },
          {
            id: 'fallback-2',
            text: suggestionType === "summary"
              ? 'Results-driven professional with expertise in developing innovative solutions.'
              : suggestionType === "bullet"
              ? 'Led cross-functional team of 10 to successfully deliver project under budget and ahead of schedule.'
              : 'Data Analysis, Problem Solving, Communication',
            type: suggestionType || "summary"
          }
        ];
        setSuggestions(fallbackSuggestions);
        
        toast({
          title: "Using generic suggestions",
          description: "Could not get personalized suggestions. Using general suggestions instead.",
          variant: "default",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error refreshing suggestions",
        description: "Could not get new suggestions. Please try again later.",
        variant: "destructive",
      });
    }
  });

  return (
    <div className="cosmic-ai-resume-assistant h-full bg-cosmic-card-bg border-cosmic-border border rounded-lg overflow-hidden"> 
      <div className="ai-assistant-header bg-cosmic-card-secondary/50 px-4 py-3 border-b border-cosmic-border">
        <h3 className="text-cosmic-text font-medium flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 text-cosmic-accent"
          >
            <path d="M12 2c1.7 0 3 1.3 3 3v2h.3c1.5 0 2.7 1.2 2.7 2.7v7.6c0 1.5-1.2 2.7-2.7 2.7H8.7C7.2 20 6 18.8 6 17.3V9.7C6 8.2 7.2 7 8.7 7H9V5c0-1.7 1.3-3 3-3zm3.1 7H8.9c-.5 0-.9.4-.9.9v6.2c0 .5.4.9.9.9h6.2c.5 0 .9-.4.9-.9V9.9c0-.5-.4-.9-.9-.9zM12 15c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zm2-7V5c0-.6-.4-1-1-1s-1 .4-1 1v3h2z" />
          </svg>
          AI Resume Assistant
        </h3>
      </div>
      
      <div className="ai-assistant-content p-4">
        <div className="suggestion-header mb-3">
          <div className="flex items-center gap-2 mb-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-cosmic-accent"
            >
              <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0H5m14 0l-4-4H9l-4 4M9 7h1m-1 4h5" />
            </svg>
            <span className="text-cosmic-text text-sm font-medium">{getSuggestionTitle()}</span>
          </div>
          <p className="text-cosmic-text-secondary text-xs">{getSuggestionDescription()}</p>
        </div>
        
        <div className="levels-indicator flex justify-between mb-2 text-xs">
          <span className="text-cosmic-accent">Short</span>
          <span className="text-cosmic-text-secondary">Medium</span>
          <span className="text-cosmic-text-secondary">Long</span>
        </div>
        
        <div className="level-bar h-1 w-full bg-cosmic-card-tertiary rounded-full mb-4">
          <div className="h-full w-1/3 bg-cosmic-accent rounded-full"></div>
        </div>
        
        <div className="suggestions-container space-y-4">
          <h4 className="text-xs text-cosmic-text-secondary">Available Suggestions:</h4>
          
          {suggestions.map((suggestion) => (
            <div 
              key={suggestion.id} 
              className="suggestion-item bg-cosmic-card-secondary/20 border border-cosmic-border rounded-md p-3 text-cosmic-text-secondary text-sm"
            >
              {suggestion.text}
              <div className="flex justify-end mt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-cosmic-accent hover:bg-cosmic-accent/10 hover:text-cosmic-accent"
                  onClick={() => handleApplySuggestion(suggestion.text)}
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            className="w-full border-cosmic-border text-cosmic-text-secondary hover:bg-cosmic-card-hover"
            onClick={() => refreshSuggestions()}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Suggestions
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}