import React, { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Check, RefreshCw } from "lucide-react";

export type SkillsCategory = "technical" | "soft" | "industry";

export interface SkillSuggestionsProps {
  resumeId: string;
  jobTitle?: string;
  onApply: (skill: string) => void;
}

export default function SkillSuggestions({
  resumeId,
  jobTitle,
  onApply,
}: SkillSuggestionsProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [lastUsedCategory, setLastUsedCategory] = useState<SkillsCategory>("technical");
  const [generationCount, setGenerationCount] = useState(0);
  const [refreshCount, setRefreshCount] = useState<
    Record<SkillsCategory, number>
  >({
    technical: 0,
    soft: 0,
    industry: 0,
  });

  // Generate AI skills with category options
  const handleGenerateSkills = async (
    category: SkillsCategory = "technical",
  ) => {
    setIsGenerating(true);

    // Reset refresh count if changing category type
    if (lastUsedCategory !== category) {
      setLastUsedCategory(category);
      setGenerationCount((prev) => prev + 1);
      setRefreshCount((prev) => ({ ...prev, [category]: 0 }));
    } else {
      // Increment refresh count for this category type
      const newRefreshCount = refreshCount[category] + 1;

      // Only allow up to 5 refreshes per category type
      if (newRefreshCount <= 5) {
        setRefreshCount((prev) => ({ ...prev, [category]: newRefreshCount }));
        setGenerationCount((prev) => prev + 1);
      } else {
        toast({
          title: "Refresh limit reached",
          description:
            "You've reached the maximum number of refreshes. Try a different category option.",
          variant: "default",
        });
        setIsGenerating(false);
        return;
      }
    }

    // Generate fallback skills based on job title and category
    const getFallbackSkills = (category: SkillsCategory) => {
      const jobTitle_safe = jobTitle || "professional";

      // Technical skills
      if (category === "technical") {
        if (jobTitle_safe.toLowerCase().includes("developer") || 
            jobTitle_safe.toLowerCase().includes("engineer") ||
            jobTitle_safe.toLowerCase().includes("programmer")) {
          return [
            "JavaScript", "TypeScript", "React", "Node.js", "Express", 
            "PostgreSQL", "MongoDB", "GraphQL", "REST API Design", 
            "Docker", "AWS", "GitHub", "CI/CD", "Test-Driven Development"
          ];
        } else if (jobTitle_safe.toLowerCase().includes("data") || 
                  jobTitle_safe.toLowerCase().includes("analyst")) {
          return [
            "SQL", "Python", "R", "Excel", "Tableau", "Power BI", 
            "Data Visualization", "Statistical Analysis", "Machine Learning",
            "Data Cleaning", "ETL Processes", "Regression Analysis"
          ];
        } else if (jobTitle_safe.toLowerCase().includes("design")) {
          return [
            "Figma", "Adobe Creative Suite", "Sketch", "UI/UX Design", 
            "Wireframing", "Prototyping", "Design Systems", "User Research",
            "Information Architecture", "Accessibility Standards"
          ];
        } else {
          return [
            "Microsoft Office Suite", "Project Management", "Data Analysis", 
            "CRM Systems", "Business Intelligence Tools", "Cloud Services",
            "Digital Marketing Platforms", "Presentation Software", 
            "Email Marketing Tools", "Spreadsheet Proficiency"
          ];
        }
      }
      // Soft skills
      else if (category === "soft") {
        return [
          "Communication", "Teamwork", "Leadership", "Problem Solving", 
          "Critical Thinking", "Time Management", "Adaptability",
          "Emotional Intelligence", "Conflict Resolution", "Attention to Detail",
          "Creativity", "Negotiation", "Decision Making", "Active Listening"
        ];
      }
      // Industry skills (default)
      else {
        if (jobTitle_safe.toLowerCase().includes("tech") || 
            jobTitle_safe.toLowerCase().includes("developer") ||
            jobTitle_safe.toLowerCase().includes("engineering")) {
          return [
            "Agile Methodologies", "Scrum", "DevOps", "Cloud Computing", 
            "Microservices Architecture", "Cybersecurity", "API Integration",
            "System Design", "Technical Documentation", "Code Review"
          ];
        } else if (jobTitle_safe.toLowerCase().includes("market") || 
                  jobTitle_safe.toLowerCase().includes("sales")) {
          return [
            "Market Research", "Brand Management", "Social Media Marketing", 
            "Content Strategy", "SEO/SEM", "Email Campaigns", "CRM",
            "Analytics & Reporting", "Customer Segmentation", "Sales Funnel Optimization"
          ];
        } else if (jobTitle_safe.toLowerCase().includes("finance") || 
                  jobTitle_safe.toLowerCase().includes("account")) {
          return [
            "Financial Analysis", "Budgeting", "Forecasting", "Risk Assessment", 
            "Financial Reporting", "Regulatory Compliance", "Tax Planning",
            "Investment Analysis", "Internal Controls", "ERP Systems"
          ];
        } else {
          return [
            "Strategic Planning", "Stakeholder Management", "Process Optimization", 
            "Quality Assurance", "Vendor Management", "Compliance",
            "Cross-functional Coordination", "Operational Excellence", 
            "Resource Allocation", "Business Process Management"
          ];
        }
      }
    };

    // If we have a valid resumeId (not "new" and not null), try to get AI suggestions
    if (resumeId && resumeId !== "new") {
      try {
        const res = await apiRequest(
          "GET",
          `/api/resumes/${resumeId}/suggestions?skillsOnly=true&jobTitle=${encodeURIComponent(
            jobTitle || "",
          )}&category=${category}&seed=${generationCount}`,
        );
        const data = await res.json();

        if (
          data.success &&
          data.suggestions &&
          Array.isArray(data.suggestions)
        ) {
          setSkills(data.suggestions.slice(0, 10));
          setIsGenerating(false);
          return;
        }
      } catch (error) {
        console.error("Error generating skills:", error);
      }
    }

    // Fallback to generated skills
    setSkills(getFallbackSkills(category));
    setIsGenerating(false);
  };

  return (
    <div>
      {skills.length === 0 ? (
        <div className="space-y-4 py-3">
          <div className="text-center">
            <h4 className="text-sm font-medium text-blue-300 mb-2">
              Choose Skill Category
            </h4>
            <div className="flex space-x-2 mb-4">
              <Button
                onClick={() => handleGenerateSkills("technical")}
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="flex-1 border-blue-500/30 text-blue-200 hover:bg-blue-900/30 hover:text-blue-100"
              >
                Technical
              </Button>
              <Button
                onClick={() => handleGenerateSkills("soft")}
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="flex-1 border-blue-500/30 text-blue-200 hover:bg-blue-900/30 hover:text-blue-100"
              >
                Soft Skills
              </Button>
              <Button
                onClick={() => handleGenerateSkills("industry")}
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="flex-1 border-blue-500/30 text-blue-200 hover:bg-blue-900/30 hover:text-blue-100"
              >
                Industry
              </Button>
            </div>
          </div>

          <Button
            onClick={() => handleGenerateSkills("technical")}
            disabled={isGenerating}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 bg-[rgba(20,30,70,0.6)] border-blue-500/30 text-blue-100"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating skills...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate AI skill suggestions
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="bg-[rgba(20,30,70,0.6)] p-2 rounded-md border border-blue-500/30 text-sm relative group backdrop-blur-sm"
              >
                <p className="text-gray-200 text-center mb-2">{skill}</p>
                <Button
                  onClick={() => onApply(skill)}
                  size="sm"
                  className="w-full flex items-center justify-center gap-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0"
                >
                  <Check className="h-3 w-3" />
                  Add
                </Button>
              </div>
            ))}
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => handleGenerateSkills("technical")}
              variant="ghost"
              size="sm"
              className="flex-1 items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Technical
            </Button>
            <Button
              onClick={() => handleGenerateSkills("soft")}
              variant="ghost"
              size="sm"
              className="flex-1 items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Soft Skills
            </Button>
            <Button
              onClick={() => handleGenerateSkills("industry")}
              variant="ghost"
              size="sm"
              className="flex-1 items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Industry
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}