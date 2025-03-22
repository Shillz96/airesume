import React, { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Sparkles, RefreshCw } from "lucide-react";

/**
 * Component for skills AI suggestions
 */
export interface SkillSuggestionsProps {
  resumeId: string;
  jobTitle?: string;
  onApply: (skill: string) => void;
}

export type SkillsCategory = "technical" | "soft" | "industry";

export default function SkillSuggestions({
  resumeId,
  jobTitle,
  onApply,
}: SkillSuggestionsProps) {
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

  // Generate AI skill suggestions for skills section with category options
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
        console.log("Refresh limit reached. Try a different category option.");
        setIsGenerating(false);
        return;
      }
    }

    // Generate fallback skills based on job title and category
    const getFallbackSkills = (category: SkillsCategory) => {
      const jobTitle_safe = jobTitle || "professional";

      // Technical skills
      if (category === "technical") {
        if (jobTitle_safe.toLowerCase().includes("develop")) {
          return [
            "React", "TypeScript", "Node.js", "Express", "PostgreSQL",
            "RESTful API Design", "GraphQL", "Microservices Architecture",
            "CI/CD Pipelines", "Cloud Infrastructure (AWS/Azure/GCP)",
            "Docker", "Kubernetes", "Git Version Control", "Jest/Mocha Testing",
          ];
        } else if (jobTitle_safe.toLowerCase().includes("data")) {
          return [
            "Python", "R", "SQL", "Pandas", "NumPy", "Matplotlib",
            "Tableau", "Power BI", "Data Warehousing", "ETL Processes",
            "Statistical Analysis", "Machine Learning Algorithms", 
            "Data Visualization", "Predictive Modeling",
          ];
        } else {
          return [
            "Microsoft Office Suite", "Project Management Tools", "CRM Systems",
            "Data Analysis", "Process Optimization", "Workflow Automation",
            "Business Intelligence Tools", "Technical Documentation",
            "Database Management", "ERP Systems", "Digital Marketing Platforms",
            "Content Management Systems", "Agile Methodologies",
          ];
        }
      }
      // Soft skills
      else if (category === "soft") {
        return [
          "Communication", "Leadership", "Problem-solving", "Critical Thinking",
          "Time Management", "Teamwork", "Adaptability", "Conflict Resolution",
          "Creativity", "Attention to Detail", "Interpersonal Skills",
          "Strategic Planning", "Negotiation", "Decision Making",
        ];
      }
      // Industry skills
      else {
        if (jobTitle_safe.toLowerCase().includes("market")) {
          return [
            "SEO Strategy", "Social Media Marketing", "Content Creation",
            "Email Marketing", "PPC Advertising", "Market Research",
            "Brand Development", "Customer Segmentation", "Analytics Tracking",
            "Campaign Management", "A/B Testing", "Conversion Optimization",
            "Competitive Analysis", "CRM Strategy",
          ];
        } else if (jobTitle_safe.toLowerCase().includes("finance")) {
          return [
            "Financial Analysis", "Budget Management", "Forecasting",
            "Risk Assessment", "Investment Analysis", "Financial Reporting",
            "Regulatory Compliance", "Tax Planning", "Cash Flow Management",
            "Cost Reduction Strategies", "Performance Metrics", "Due Diligence",
            "Financial Modeling", "Portfolio Management",
          ];
        } else {
          return [
            "Industry Best Practices", "Competitive Analysis", "Market Trends",
            "Strategic Planning", "Customer Engagement", "Product Development",
            "Vendor Management", "Resource Allocation", "Quality Assurance",
            "Regulatory Compliance", "Performance Metrics", "Process Improvement",
            "Operational Excellence", "Business Development",
          ];
        }
      }
    };

    // If we have a valid resumeId (not "new" and not null), try to get AI suggestions
    if (resumeId && resumeId !== "new") {
      try {
        // Use the skillsOnly parameter to get ATS-optimized skills
        let url = `/api/resumes/${resumeId}/suggestions?skillsOnly=true&category=${category}&seed=${generationCount}`;
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
          setSkills(data.suggestions);
          setIsGenerating(false);
          return;
        }
      } catch (error) {
        console.error("Error generating skills:", error);
      }
    }

    // If we get here, either the API call failed or we don't have a valid resumeId
    setSkills(getFallbackSkills(category));
    setIsGenerating(false);
  };

  return (
    <div>
      {skills.length === 0 ? (
        <div className="space-y-4 py-3">
          <div className="text-center">
            <h4 className="text-sm font-medium text-blue-300 mb-2">
              Choose Skills Category
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
                Soft
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
                Generate AI skills
              </>
            )}
          </Button>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="bg-[rgba(20,30,70,0.6)] p-2 rounded-md border border-blue-500/30 text-sm relative group backdrop-blur-sm"
              >
                <p className="text-gray-200 mb-2">{skill}</p>
                <Button
                  onClick={() => onApply(skill)}
                  size="sm"
                  className="w-full flex items-center justify-center gap-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 text-xs py-1"
                >
                  <Plus className="h-3 w-3" />
                  Add skill
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
              Soft
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