import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ResumeTipsProps {
  resumeId?: string | number | null;
  onApplySuggestion: (suggestion: string) => void;
  suggestionType: "summary" | "bullet" | "skill";
}

export default function ResumeTips({ resumeId, onApplySuggestion, suggestionType }: ResumeTipsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("medium");
  const { toast } = useToast();

  const generateSuggestions = async (length: string = "medium") => {
    setIsGenerating(true);
    setActiveTab(length);

    // If we don't have a valid resumeId, use fallback suggestions
    if (!resumeId || resumeId === "new") {
      // For skills, we need to handle different category options
      if (suggestionType === "skill") {
        setSuggestions(getFallbackSuggestions(length as any, suggestionType));
      } else {
        setSuggestions(getFallbackSuggestions(length as "short" | "medium" | "long", suggestionType));
      }
      setIsGenerating(false);
      return;
    }

    try {
      // Add a random seed to get different results each time
      const randomSeed = Math.floor(Math.random() * 10000);
      const endpoint = `/api/resumes/${resumeId}/suggestions?type=${suggestionType}&length=${length}&seed=${randomSeed}`;
      const res = await apiRequest("GET", endpoint);
      const data = await res.json();
      
      if (data.success && data.suggestions && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions.slice(0, 3));
      } else {
        // Fallback if API doesn't return expected format
        setSuggestions(getFallbackSuggestions(length as "short" | "medium" | "long", suggestionType));
      }
    } catch (error) {
      console.error(`Error generating ${suggestionType} suggestions:`, error);
      setSuggestions(getFallbackSuggestions(length as "short" | "medium" | "long", suggestionType));
      toast({
        title: "Couldn't generate suggestions",
        description: "Using sample suggestions instead. Try again later.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getFallbackSuggestions = (length: "short" | "medium" | "long", type: string) => {
    if (type === "summary") {
      // Short summaries
      if (length === "short") {
        return [
          "Skilled professional with a proven track record in delivering high-impact solutions.",
          "Results-oriented professional with expertise in strategic planning and execution.",
          "Dynamic professional with strong technical and communication skills."
        ];
      }
      // Long summaries
      else if (length === "long") {
        return [
          "Accomplished professional with extensive experience driving innovation and operational excellence. Demonstrates exceptional ability to identify opportunities for improvement and implement strategic solutions that enhance business performance. Combines technical expertise with strong leadership capabilities to guide teams through complex projects and initiatives.",
          "Results-driven professional with a comprehensive background in developing and implementing strategic initiatives. Skilled at translating business requirements into effective solutions while maintaining a focus on quality and efficiency. Recognized for ability to collaborate across departments and deliver measurable improvements to organizational processes.",
          "Versatile professional with a proven track record of success across multiple domains. Leverages deep technical knowledge and business acumen to drive transformative change and achieve ambitious goals. Excels at building relationships with stakeholders at all levels and communicating complex concepts in accessible terms."
        ];
      }
      // Medium summaries (default)
      else {
        return [
          "Accomplished professional with a proven track record of delivering innovative solutions. Adept at leveraging expertise to drive business outcomes and optimize processes.",
          "Results-driven professional combining technical knowledge with strong communication skills. Committed to continuous improvement and delivering high-quality work that exceeds expectations.",
          "Versatile and dedicated professional with strong problem-solving abilities. Effectively balances technical excellence with business requirements to create impactful solutions."
        ];
      }
    } else if (type === "bullet") {
      // Experience bullet points
      if (length === "short") {
        return [
          "Implemented process improvements that reduced costs by 15%.",
          "Led cross-functional team of 8 to deliver project ahead of schedule.",
          "Increased customer satisfaction ratings by 22% through service enhancements."
        ];
      } else if (length === "long") {
        return [
          "Spearheaded comprehensive process reengineering initiative that identified and eliminated redundancies, resulting in 15% reduction in operational costs and 30% increase in team productivity over a 6-month period.",
          "Led diverse cross-functional team of 8 professionals to deliver mission-critical project 2 weeks ahead of schedule, earning recognition from senior leadership and establishing new benchmark for project execution excellence.",
          "Conceptualized and implemented customer service enhancement program that increased satisfaction ratings by 22%, reduced complaint volume by 35%, and improved retention rates among high-value clients by 18% within first quarter of implementation."
        ];
      } else {
        return [
          "Implemented comprehensive process improvements that reduced operational costs by 15% while increasing team productivity by 30%.",
          "Led cross-functional team of 8 professionals to deliver project 2 weeks ahead of schedule, exceeding client expectations.",
          "Developed and implemented customer service enhancements that increased satisfaction ratings by 22% and improved retention rates."
        ];
      }
    } else if (type === "skill") {
      // Skill suggestions - we use a different set of categories for skills
      // Note: TypeScript doesn't know this, so we need to handle it properly
      const skillLength = length as any; // Cast to any to avoid TypeScript errors
      
      if (skillLength === "technical" || skillLength === "short") {
        return [
          "Data Analysis",
          "Project Management",
          "Cloud Computing"
        ];
      } else if (skillLength === "soft" || skillLength === "medium") {
        return [
          "Strategic Communication",
          "Team Leadership",
          "Problem-solving"
        ];
      } else {
        return [
          "Microsoft Office Suite",
          "Customer Relationship Management",
          "Process Optimization"
        ];
      }
    }
    
    // Default fallback
    return [
      "Sample suggestion 1",
      "Sample suggestion 2",
      "Sample suggestion 3"
    ];
  };

  // Generate initial suggestions if not already loaded
  React.useEffect(() => {
    if (suggestions.length === 0 && !isGenerating) {
      generateSuggestions(activeTab);
    }
  }, [suggestions, isGenerating]);

  const getTipTitle = () => {
    switch (suggestionType) {
      case "summary":
        return "Professional Summary Suggestions";
      case "bullet":
        return "Experience Bullet Points";
      case "skill":
        return "Skill Suggestions";
      default:
        return "AI Suggestions";
    }
  };

  const getTipDescription = () => {
    switch (suggestionType) {
      case "summary":
        return "Choose a professional summary that highlights your strengths";
      case "bullet":
        return "Powerful bullet points to showcase your achievements";
      case "skill":
        return "Relevant skills for your professional profile";
      default:
        return "AI-generated content for your resume";
    }
  };

  const getLengthOptions = () => {
    if (suggestionType === "skill") {
      return (
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="technical" onClick={() => generateSuggestions("technical")}>Technical</TabsTrigger>
          <TabsTrigger value="soft" onClick={() => generateSuggestions("soft")}>Soft</TabsTrigger>
          <TabsTrigger value="industry" onClick={() => generateSuggestions("industry")}>Industry</TabsTrigger>
        </TabsList>
      );
    }
    
    return (
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="short" onClick={() => generateSuggestions("short")}>Short</TabsTrigger>
        <TabsTrigger value="medium" onClick={() => generateSuggestions("medium")}>Medium</TabsTrigger>
        <TabsTrigger value="long" onClick={() => generateSuggestions("long")}>Long</TabsTrigger>
      </TabsList>
    );
  };

  return (
    <Card className="border border-blue-500/30 shadow-lg bg-gradient-to-r from-blue-950/50 to-purple-950/50 backdrop-blur">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-400" />
          <CardTitle className="text-lg text-blue-100">{getTipTitle()}</CardTitle>
        </div>
        <CardDescription className="text-blue-200/70">{getTipDescription()}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue={activeTab} value={activeTab}>
          {getLengthOptions()}
          
          <div className="mt-4 space-y-3">
            {isGenerating ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
              </div>
            ) : (
              suggestions.map((suggestion, index) => (
                <div 
                  key={index} 
                  className="p-3 rounded-md bg-white/10 border border-blue-500/20 hover:border-blue-500/40 transition-all cursor-pointer"
                  onClick={() => onApplySuggestion(suggestion)}
                >
                  <p className="text-sm text-white leading-relaxed">{suggestion}</p>
                  <div className="flex justify-end mt-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs text-blue-300 hover:text-blue-100 hover:bg-blue-800/50"
                      onClick={(e) => {
                        e.stopPropagation();
                        onApplySuggestion(suggestion);
                      }}
                    >
                      Apply This
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Tabs>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          variant="outline" 
          className="w-full text-blue-300 border-blue-500/30 hover:bg-blue-800/50 hover:text-blue-100"
          onClick={() => generateSuggestions(activeTab)}
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Refresh Suggestions"}
        </Button>
      </CardFooter>
    </Card>
  );
}