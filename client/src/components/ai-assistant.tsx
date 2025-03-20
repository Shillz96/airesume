import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cpu, Lightbulb } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface AIAssistantProps {
  resumeId?: string;
  onApplySuggestions?: (suggestions: string[]) => void;
}

export default function AIAssistant({ resumeId, onApplySuggestions }: AIAssistantProps) {
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const { mutate: generateSuggestions, isPending } = useMutation({
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

  const handleApplySuggestions = () => {
    if (onApplySuggestions && suggestions.length > 0) {
      onApplySuggestions(suggestions);
      toast({
        title: "Suggestions applied",
        description: "Your resume has been updated with AI suggestions.",
      });
    }
  };

  return (
    <Card className="bg-accent-50 border-accent-200">
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <div className="bg-accent-200 p-2 rounded-full">
            <Cpu className="h-5 w-5 text-accent-700" />
          </div>
          <h3 className="ml-2 text-md font-medium text-accent-800">AI Assistant</h3>
        </div>
        
        {isPending ? (
          <p className="text-sm text-accent-700 mb-3">
            Analyzing your resume...
          </p>
        ) : suggestions.length > 0 ? (
          <>
            <p className="text-sm text-accent-700 mb-3">
              I've analyzed your resume and have some suggestions to improve it:
            </p>
            <ul className="text-sm text-accent-700 space-y-2 mb-3">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <Lightbulb className="h-4 w-4 text-yellow-500 mr-1 mt-1" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
            <Button 
              onClick={handleApplySuggestions}
              className="w-full text-sm bg-accent-100 hover:bg-accent-200 text-accent-700 font-medium py-2 px-4 rounded transition"
            >
              Apply Suggestions
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-accent-700 mb-3">
              Let me help you improve your resume with AI-powered suggestions.
            </p>
            <Button 
              onClick={() => generateSuggestions()}
              className="w-full text-sm bg-accent-100 hover:bg-accent-200 text-accent-700 font-medium py-2 px-4 rounded transition"
              disabled={!resumeId || isPending}
            >
              Generate Suggestions
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
