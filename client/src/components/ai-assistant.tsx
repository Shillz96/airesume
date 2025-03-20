import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cpu, Lightbulb, Briefcase, ArrowRight, Sparkles, RefreshCw } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface AIAssistantProps {
  resumeId?: string;
  onApplySuggestions?: (suggestions: string[]) => void;
  onApplySummary?: (summary: string) => void;
  onApplyTailoredContent?: (content: TailoredContent) => void;
  resume?: any;
}

interface TailoredContent {
  summary?: string;
  skills?: string[];
  experienceImprovements?: Array<{
    id: string;
    improvedDescription: string;
  }>;
}

export default function AIAssistant({ 
  resumeId, 
  onApplySuggestions, 
  onApplySummary,
  onApplyTailoredContent,
  resume 
}: AIAssistantProps) {
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tailoredContent, setTailoredContent] = useState<TailoredContent | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  
  // General suggestions
  const { mutate: generateSuggestions, isPending: isGeneratingSuggestions } = useMutation({
    mutationFn: async () => {
      if (!resumeId) return null;
      const res = await apiRequest("GET", `/api/resumes/${resumeId}/suggestions`);
      return await res.json();
    },
    onSuccess: (data) => {
      if (data?.success && data.suggestions) {
        setSuggestions(data.suggestions);
      } else if (data?.fallbackSuggestions) {
        // Use fallback suggestions if available (in case of API limitations)
        setSuggestions(data.fallbackSuggestions);
        toast({
          title: "Using generic suggestions",
          description: data.error || "AI service unavailable. Using general resume tips.",
          variant: "default",
        });
      } else if (!data?.success) {
        toast({
          title: "Could not generate suggestions",
          description: data?.error || "Something went wrong. Please try again later.",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to generate suggestions",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Tailor resume for specific company or job
  const { mutate: tailorResume, isPending: isTailoring } = useMutation({
    mutationFn: async (data: { company?: string; jobDescription?: string }) => {
      if (!resumeId) return null;
      const res = await apiRequest("POST", `/api/resumes/${resumeId}/tailor`, data);
      return await res.json();
    },
    onSuccess: (data) => {
      if (data?.success && data.tailoredContent) {
        setTailoredContent(data.tailoredContent);
      } else if (!data?.success) {
        toast({
          title: "Could not tailor resume",
          description: data?.error || "Something went wrong. Please try again later.",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to tailor resume",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleApplySuggestions = () => {
    if (onApplySuggestions && suggestions.length > 0) {
      onApplySuggestions(suggestions);
      toast({
        title: "Suggestions applied",
        description: "Your resume has been updated with AI suggestions.",
      });
    }
  };

  const handleApplyTailoredContent = () => {
    if (onApplyTailoredContent && tailoredContent) {
      onApplyTailoredContent(tailoredContent);
      toast({
        title: "Tailored content applied",
        description: "Your resume has been updated for the target position.",
      });
    } else if (tailoredContent?.summary && onApplySummary) {
      // If only the summary handler is provided
      onApplySummary(tailoredContent.summary);
      toast({
        title: "Summary updated",
        description: "Your professional summary has been tailored for the target position.",
      });
    }
  };

  const handleTailorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company && !jobDescription) {
      toast({
        title: "Information needed",
        description: "Please provide either a company name or job description.",
        variant: "destructive",
      });
      return;
    }
    
    tailorResume({ 
      company: company.trim() || undefined, 
      jobDescription: jobDescription.trim() || undefined 
    });
  };

  return (
    <Card className="bg-accent-50 border-accent-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-medium text-accent-800">
          <Cpu className="h-5 w-5 text-accent-700 mr-2" />
          AI Resume Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="general" className="text-sm">
              <Sparkles className="h-4 w-4 mr-1" /> General Improvements
            </TabsTrigger>
            <TabsTrigger value="job-specific" className="text-sm">
              <Briefcase className="h-4 w-4 mr-1" /> Job Targeting
            </TabsTrigger>
          </TabsList>
          
          {/* General suggestions tab */}
          <TabsContent value="general" className="mt-0">
            {isGeneratingSuggestions ? (
              <div className="flex flex-col items-center justify-center py-4">
                <RefreshCw className="h-8 w-8 text-accent-600 animate-spin mb-2" />
                <p className="text-sm text-accent-700">
                  Analyzing your resume...
                </p>
              </div>
            ) : suggestions.length > 0 ? (
              <>
                <p className="text-sm text-accent-700 mb-3">
                  I've analyzed your resume and have some suggestions to improve it:
                </p>
                <ul className="text-sm text-accent-700 space-y-2 mb-4">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                      <Lightbulb className="h-4 w-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between mt-2">
                  <Button 
                    onClick={() => generateSuggestions()}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Refresh
                  </Button>
                  <Button 
                    onClick={handleApplySuggestions}
                    size="sm"
                    className="text-xs"
                    disabled={!onApplySuggestions}
                  >
                    Apply Suggestions
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-accent-700 mb-4">
                  Let me analyze your resume and suggest improvements to make it more effective.
                </p>
                <Button 
                  onClick={() => generateSuggestions()}
                  className="w-full text-sm"
                  disabled={!resumeId || isGeneratingSuggestions}
                >
                  Generate Suggestions
                </Button>
              </>
            )}
          </TabsContent>
          
          {/* Job targeting tab */}
          <TabsContent value="job-specific" className="mt-0">
            {tailoredContent ? (
              <>
                <div className="space-y-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Improved Professional Summary:</h4>
                    <p className="text-sm p-2 bg-accent-100 rounded-md">{tailoredContent.summary}</p>
                  </div>
                  
                  {tailoredContent.skills && tailoredContent.skills.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Highlighted Skills:</h4>
                      <div className="flex flex-wrap gap-1">
                        {tailoredContent.skills.map((skill, index) => (
                          <span key={index} className="text-xs bg-accent-200 text-accent-800 px-2 py-1 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {tailoredContent.experienceImprovements && tailoredContent.experienceImprovements.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Experience Improvements:</h4>
                      <div className="space-y-2">
                        {tailoredContent.experienceImprovements.map((exp, index) => (
                          <div key={index} className="text-xs p-2 bg-accent-100 rounded-md">
                            {exp.improvedDescription}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between mt-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs"
                    onClick={() => setTailoredContent(null)}
                  >
                    Try again
                  </Button>
                  <Button 
                    onClick={handleApplyTailoredContent}
                    size="sm"
                    className="text-xs"
                    disabled={!onApplyTailoredContent && !onApplySummary}
                  >
                    Apply Changes
                  </Button>
                </div>
              </>
            ) : (
              <form onSubmit={handleTailorSubmit}>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="company" className="text-sm font-medium block mb-1">
                      Target Company (optional)
                    </label>
                    <Input 
                      id="company"
                      placeholder="e.g., Google, Amazon, Microsoft" 
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="jobDescription" className="text-sm font-medium block mb-1">
                      Job Description (optional)
                    </label>
                    <Textarea 
                      id="jobDescription"
                      placeholder="Paste the job description here..." 
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="text-sm min-h-[100px]"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Provide either a company name or job description to tailor your resume.
                    </p>
                  </div>
                </div>
                
                <Button 
                  type="submit"
                  className="w-full mt-4 text-sm"
                  disabled={(!company && !jobDescription) || isTailoring || !resumeId}
                >
                  {isTailoring ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Tailoring Resume...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Tailor Resume
                    </>
                  )}
                </Button>
              </form>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
