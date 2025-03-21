import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Check, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ResumeTipsProps {
  resumeId?: string | number | null;
  onApplySuggestion: (suggestion: string) => void;
  suggestionType: "summary" | "bullet" | "skill";
  multiSelect?: boolean;
}

export default function ResumeTips({ resumeId, onApplySuggestion, suggestionType, multiSelect = false }: ResumeTipsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [appliedSuggestions, setAppliedSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  // Initialize default active tab based on suggestion type
  const getDefaultTab = () => {
    if (suggestionType === "skill") return "technical";
    return "medium"; // Default for summary and bullet
  };
  
  const [activeTab, setActiveTab] = useState<string>(getDefaultTab());
  const { toast } = useToast();

  const generateSuggestions = async (length: string = "medium") => {
    // Always force the generating state to ensure the spinner shows
    setIsGenerating(true);
    setActiveTab(length);
    
    // We no longer clear suggestions immediately as it causes a UI flicker
    // Instead, we'll replace them only when we have new ones
    
    // Set a small timeout to ensure the UI updates before making the API call
    // This helps give a clearer visual indication that the refresh is happening
    setTimeout(async () => {
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
          if (suggestionType === "skill") {
            setSuggestions(getFallbackSuggestions(length as any, suggestionType));
          } else {
            setSuggestions(getFallbackSuggestions(length as "short" | "medium" | "long", suggestionType));
          }
        }
      } catch (error) {
        console.error(`Error generating ${suggestionType} suggestions:`, error);
        // Choose the right fallback based on suggestion type
        if (suggestionType === "skill") {
          setSuggestions(getFallbackSuggestions(length as any, suggestionType));
        } else {
          setSuggestions(getFallbackSuggestions(length as "short" | "medium" | "long", suggestionType));
        }
        toast({
          title: "Couldn't generate suggestions",
          description: "Using sample suggestions instead. Try again later.",
          variant: "destructive",
        });
      } finally {
        setIsGenerating(false);
      }
    }, 500); // Longer delay for better UX and to make the refresh more noticeable
  };

  const getFallbackSuggestions = (length: "short" | "medium" | "long", type: string) => {
    // Create a larger pool of suggestions and randomly select 3 of them
    // This helps ensure we get different suggestions each time
    let suggestionsPool: string[] = [];
    
    if (type === "summary") {
      // Short summaries
      if (length === "short") {
        suggestionsPool = [
          "Skilled professional with a proven track record in delivering high-impact solutions.",
          "Results-oriented professional with expertise in strategic planning and execution.",
          "Dynamic professional with strong technical and communication skills.",
          "Dedicated professional focused on continuous improvement and excellence.",
          "Analytical problem-solver with expertise in optimizing business processes.",
          "Innovative thinker committed to driving organizational success.",
          "Adaptable professional with a diverse skill set and practical experience.",
          "Achievement-focused individual with a history of exceeding targets."
        ];
      }
      // Long summaries
      else if (length === "long") {
        suggestionsPool = [
          "Accomplished professional with extensive experience driving innovation and operational excellence. Demonstrates exceptional ability to identify opportunities for improvement and implement strategic solutions that enhance business performance. Combines technical expertise with strong leadership capabilities to guide teams through complex projects and initiatives.",
          "Results-driven professional with a comprehensive background in developing and implementing strategic initiatives. Skilled at translating business requirements into effective solutions while maintaining a focus on quality and efficiency. Recognized for ability to collaborate across departments and deliver measurable improvements to organizational processes.",
          "Versatile professional with a proven track record of success across multiple domains. Leverages deep technical knowledge and business acumen to drive transformative change and achieve ambitious goals. Excels at building relationships with stakeholders at all levels and communicating complex concepts in accessible terms.",
          "Forward-thinking professional with a strategic mindset and demonstrated success in delivering impactful results. Combines analytical thinking with creative problem-solving to address complex challenges. Known for ability to lead cross-functional initiatives and align diverse stakeholders toward common objectives.",
          "Dedicated professional with extensive expertise in optimizing operations and driving sustainable growth. Utilizes data-driven insights to identify improvement opportunities and implement effective solutions. Proven ability to navigate dynamic environments while maintaining a focus on long-term strategic objectives.",
          "Accomplished leader with a track record of transforming organizational capabilities and enhancing performance metrics. Adept at identifying growth opportunities and implementing scalable solutions. Combines business acumen with technological expertise to deliver measurable improvements across multiple dimensions."
        ];
      }
      // Medium summaries (default)
      else {
        suggestionsPool = [
          "Accomplished professional with a proven track record of delivering innovative solutions. Adept at leveraging expertise to drive business outcomes and optimize processes.",
          "Results-driven professional combining technical knowledge with strong communication skills. Committed to continuous improvement and delivering high-quality work that exceeds expectations.",
          "Versatile and dedicated professional with strong problem-solving abilities. Effectively balances technical excellence with business requirements to create impactful solutions.",
          "Strategic thinker with expertise in identifying opportunities and implementing effective solutions. Demonstrates ability to collaborate across teams to achieve organizational objectives.",
          "Detail-oriented professional with a talent for analyzing complex situations and developing practical approaches. Consistently delivers results that drive business growth and operational excellence.",
          "Dynamic professional with a balanced approach to technical expertise and business acumen. Skilled at translating strategic vision into actionable plans with measurable outcomes."
        ];
      }
    } else if (type === "bullet") {
      // Experience bullet points
      if (length === "short") {
        suggestionsPool = [
          "Implemented process improvements that reduced costs by 15%.",
          "Led cross-functional team of 8 to deliver project ahead of schedule.",
          "Increased customer satisfaction ratings by 22% through service enhancements.",
          "Streamlined workflow resulting in 30% productivity increase.",
          "Developed training materials that improved team efficiency by 25%.",
          "Managed budget of $1.5M with consistent under-budget delivery.",
          "Launched successful marketing campaign that increased sales by 18%.",
          "Resolved critical system issues, reducing downtime by 40%."
        ];
      } else if (length === "long") {
        suggestionsPool = [
          "Spearheaded comprehensive process reengineering initiative that identified and eliminated redundancies, resulting in 15% reduction in operational costs and 30% increase in team productivity over a 6-month period.",
          "Led diverse cross-functional team of 8 professionals to deliver mission-critical project 2 weeks ahead of schedule, earning recognition from senior leadership and establishing new benchmark for project execution excellence.",
          "Conceptualized and implemented customer service enhancement program that increased satisfaction ratings by 22%, reduced complaint volume by 35%, and improved retention rates among high-value clients by 18% within first quarter of implementation.",
          "Pioneered data-driven decision-making approach across three departments, developing customized dashboards and KPI tracking mechanisms that enabled executive leadership to identify $2.3M in cost-saving opportunities within first year of implementation.",
          "Orchestrated complex system migration involving 15,000+ user accounts and 8TB of data with zero unplanned downtime, completing the transition 5 days ahead of schedule and $75,000 under budget while maintaining 99.9% data integrity.",
          "Redesigned customer onboarding process through comprehensive user experience research, resulting in 45% reduction in abandonment rates, 28% faster completion times, and 52% decrease in support tickets related to registration issues."
        ];
      } else {
        suggestionsPool = [
          "Implemented comprehensive process improvements that reduced operational costs by 15% while increasing team productivity by 30%.",
          "Led cross-functional team of 8 professionals to deliver project 2 weeks ahead of schedule, exceeding client expectations.",
          "Developed and implemented customer service enhancements that increased satisfaction ratings by 22% and improved retention rates.",
          "Managed $1.2M budget for departmental operations, consistently delivering under budget while meeting all performance objectives.",
          "Created and delivered training program that improved team efficiency by 25% and reduced onboarding time by two weeks.",
          "Redesigned workflow processes resulting in 35% increase in output quality and 28% reduction in production time."
        ];
      }
    } else if (type === "skill") {
      // Skill suggestions - we use a different set of categories for skills
      const skillLength = length as any; // Cast to any to avoid TypeScript errors
      
      if (skillLength === "technical" || skillLength === "short") {
        suggestionsPool = [
          "Data Analysis",
          "Project Management",
          "Cloud Computing",
          "SQL",
          "Python",
          "JavaScript",
          "Business Intelligence",
          "Microsoft Azure",
          "AWS",
          "System Architecture",
          "UX/UI Design",
          "CI/CD Pipeline Management"
        ];
      } else if (skillLength === "soft" || skillLength === "medium") {
        suggestionsPool = [
          "Strategic Communication",
          "Team Leadership",
          "Problem-solving",
          "Critical Thinking",
          "Negotiation",
          "Conflict Resolution",
          "Time Management",
          "Decision Making",
          "Emotional Intelligence",
          "Adaptability",
          "Active Listening",
          "Stakeholder Management"
        ];
      } else {
        suggestionsPool = [
          "Microsoft Office Suite",
          "Customer Relationship Management",
          "Process Optimization",
          "Budget Management",
          "Marketing Strategy",
          "Content Creation",
          "Social Media Management",
          "Supply Chain Management",
          "Healthcare Administration",
          "Financial Analysis",
          "Regulatory Compliance",
          "Risk Assessment"
        ];
      }
    } else {
      // Default fallback
      suggestionsPool = [
        "Sample suggestion 1",
        "Sample suggestion 2",
        "Sample suggestion 3",
        "Sample suggestion 4",
        "Sample suggestion 5"
      ];
    }
    
    // Randomly select 3 items from the suggestions pool
    // This ensures we get different suggestions each time
    const shuffled = [...suggestionsPool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  // Generate initial suggestions or when component props change
  React.useEffect(() => {
    // Reset state when resumeId or suggestionType changes
    if (!isGenerating) {
      generateSuggestions(activeTab);
    }
  }, [resumeId, suggestionType]);

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
        <TabsList className="grid w-full grid-cols-3 h-7">
          <TabsTrigger className="px-2 py-0 text-xs" value="technical" onClick={() => {
            setActiveTab("technical");
            generateSuggestions("technical");
          }}>Technical</TabsTrigger>
          <TabsTrigger className="px-2 py-0 text-xs" value="soft" onClick={() => {
            setActiveTab("soft");
            generateSuggestions("soft");
          }}>Soft</TabsTrigger>
          <TabsTrigger className="px-2 py-0 text-xs" value="industry" onClick={() => {
            setActiveTab("industry");
            generateSuggestions("industry");
          }}>Industry</TabsTrigger>
        </TabsList>
      );
    }
    
    return (
      <TabsList className="grid w-full grid-cols-3 h-7">
        <TabsTrigger className="px-2 py-0 text-xs" value="short" onClick={() => {
          setActiveTab("short");
          generateSuggestions("short");
        }}>Short</TabsTrigger>
        <TabsTrigger className="px-2 py-0 text-xs" value="medium" onClick={() => {
          setActiveTab("medium");
          generateSuggestions("medium");
        }}>Medium</TabsTrigger>
        <TabsTrigger className="px-2 py-0 text-xs" value="long" onClick={() => {
          setActiveTab("long");
          generateSuggestions("long");
        }}>Long</TabsTrigger>
      </TabsList>
    );
  };

  return (
    <Card className="border border-blue-500/30 shadow-lg bg-gradient-to-r from-blue-950/50 to-purple-950/50 backdrop-blur max-w-full w-full">
      <CardHeader className="p-3 pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-400" />
          <CardTitle className="text-sm text-blue-100">{getTipTitle()}</CardTitle>
        </div>
        <CardDescription className="text-xs text-blue-200/70">{getTipDescription()}</CardDescription>
      </CardHeader>
      
      <CardContent className="p-3 pt-1">
        <Tabs defaultValue={activeTab} value={activeTab}>
          {getLengthOptions()}
          
          <div className="mt-2 space-y-2">
            {isGenerating ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
              </div>
            ) : (
              <>
                {multiSelect && appliedSuggestions.length > 0 && (
                  <div className="mb-2">
                    <h4 className="text-xs font-medium text-blue-300 mb-1">Applied Suggestions</h4>
                    <div className="space-y-1.5">
                      {appliedSuggestions.map((applied, idx) => (
                        <div key={`applied-${idx}`} className="flex items-start p-1.5 rounded-md bg-blue-800/20 border border-blue-500/30">
                          <div className="flex-grow">
                            <p className="text-xs text-blue-100 leading-relaxed">{applied}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 ml-1 text-blue-300 hover:text-blue-100 hover:bg-blue-800/50"
                            onClick={() => {
                              setAppliedSuggestions(appliedSuggestions.filter((_, i) => i !== idx));
                            }}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <h4 className="text-xs font-medium text-blue-300 mb-1">Available Suggestions</h4>
                {suggestions.map((suggestion, index) => {
                  const isApplied = appliedSuggestions.includes(suggestion);
                  return (
                    <div 
                      key={index} 
                      className={`p-2 rounded-md bg-white/10 border transition-all cursor-pointer ${
                        isApplied 
                          ? "border-blue-500/40 bg-blue-800/20" 
                          : "border-blue-500/20 hover:border-blue-500/40"
                      }`}
                      onClick={() => {
                        if (multiSelect) {
                          if (!isApplied) {
                            const newApplied = [...appliedSuggestions, suggestion];
                            setAppliedSuggestions(newApplied);
                            onApplySuggestion(suggestion);
                          }
                        } else {
                          onApplySuggestion(suggestion);
                        }
                      }}
                    >
                      <p className="text-xs text-white leading-relaxed">{suggestion}</p>
                      <div className="flex justify-end mt-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 text-xs text-blue-300 hover:text-blue-100 hover:bg-blue-800/50"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (multiSelect) {
                              if (!isApplied) {
                                const newApplied = [...appliedSuggestions, suggestion];
                                setAppliedSuggestions(newApplied);
                                onApplySuggestion(suggestion);
                              }
                            } else {
                              onApplySuggestion(suggestion);
                            }
                          }}
                        >
                          {multiSelect ? (
                            isApplied ? <Check className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />
                          ) : null}
                          {multiSelect ? (isApplied ? "Added" : "Add") : "Apply"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </Tabs>
      </CardContent>
      
      <CardFooter className="p-3 pt-0">
        <Button 
          variant="outline" 
          className="w-full h-7 text-xs text-blue-300 border-blue-500/30 hover:bg-blue-800/50 hover:text-blue-100"
          onClick={() => generateSuggestions(activeTab)}
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Refresh Suggestions"}
        </Button>
      </CardFooter>
    </Card>
  );
}