import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import ResumeTips from "@/components/resume-tips";
import Navbar from "@/components/navbar";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { 
  Download, Loader2, Plus, Minus, Maximize2, FileText, 
  Check, Zap, EyeOff, Eye, FileImage, X, Move,
  GraduationCap, Briefcase, Code, Award, FolderKanban,
  FolderOpen, Save, Upload, Cpu, RefreshCw, Sparkles,
  Printer, ChevronDown, User, Columns, LayoutGrid, Copy, Rows
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ResumeTemplate, {
  ProfessionalTemplate,
  CreativeTemplate,
  ExecutiveTemplate,
  ModernTemplate,
  MinimalTemplate,
  IndustryTemplate,
  BoldTemplate,
  TemplatePreviewProfessional,
  TemplatePreviewCreative,
  TemplatePreviewExecutive,
  TemplatePreviewModern,
  TemplatePreviewMinimal,
  TemplatePreviewIndustry,
  TemplatePreviewBold,
} from "@/components/resume-template";
import {
  ResumeExperienceSection,
  ResumeEducationSection,
  ResumeSkillsSection,
  ResumeProjectsSection,
  ExperienceItem,
  EducationItem,
  SkillItem,
  ProjectItem,
} from "@/components/resume-section";
import { Resume } from "@/components/resume-template";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CosmicButton } from "@/components/cosmic-button";
import RichTextEditor from "@/components/rich-text-editor";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import AIAssistant from "@/components/ai-assistant";
import CosmicBackground from "@/components/cosmic-background";

// Component for professional summary AI suggestions
interface SummarySuggestionsProps {
  resumeId: string;
  onApply: (summary: string) => void;
}

type SummaryLength = "short" | "medium" | "long";

function SummarySuggestions({ resumeId, onApply }: SummarySuggestionsProps) {
  // Toast notifications are removed
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

// Component for experience bullet point AI suggestions
interface ExperienceSuggestionsProps {
  resumeId: string;
  jobTitle?: string;
  onApply: (bulletPoint: string) => void;
}

type BulletLength = "short" | "medium" | "long";

function ExperienceSuggestions({
  resumeId,
  jobTitle,
  onApply,
}: ExperienceSuggestionsProps) {
  // Toast notifications removed
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

// Component for skills AI suggestions
interface SkillSuggestionsProps {
  resumeId: string;
  jobTitle?: string;
  onApply: (skill: string) => void;
}

type SkillsCategory = "technical" | "soft" | "industry";

function SkillSuggestions({
  resumeId,
  jobTitle,
  onApply,
}: SkillSuggestionsProps) {
  // Toast notifications removed
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

// Main component for Resume Preview with Template Selection
function ResumePreviewComponent({ 
  resume, 
  onTemplateChange, 
  onDownload 
}: { 
  resume: Resume; 
  onTemplateChange: (template: string) => void; 
  onDownload?: () => void; 
}) {
  const [previewMode, setPreviewMode] = useState<"scroll" | "pages">("scroll");
  const [currentPage, setCurrentPage] = useState(1);
  const previewRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [isViewMode, setIsViewMode] = useState(false);

  useEffect(() => {
    // Determine number of pages for pagination
    if (previewRef.current) {
      const height = previewRef.current.scrollHeight;
      const pageHeight = 1056; // Standard A4 page height in pixels at 96 DPI
      const calculatedPages = Math.ceil(height / pageHeight);
      setNumPages(calculatedPages > 0 ? calculatedPages : 1);
    }
  }, [resume, previewMode]);

  // Generate printable HTML for downloading
  function generatePrintableHTML(resumeData: Resume): string {
    let templateComponent;
    switch (resumeData.template) {
      case "creative":
        templateComponent = <CreativeTemplate resume={resumeData} />;
        break;
      case "executive":
        templateComponent = <ExecutiveTemplate resume={resumeData} />;
        break;
      case "modern":
        templateComponent = <ModernTemplate resume={resumeData} />;
        break;
      case "minimal":
        templateComponent = <MinimalTemplate resume={resumeData} />;
        break;
      case "industry":
        templateComponent = <IndustryTemplate resume={resumeData} />;
        break;
      case "bold":
        templateComponent = <BoldTemplate resume={resumeData} />;
        break;
      default:
        templateComponent = <ProfessionalTemplate resume={resumeData} />;
    }

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${resumeData.personalInfo?.firstName || ''} ${resumeData.personalInfo?.lastName || ''} - Resume</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            body {
              font-family: 'Inter', sans-serif;
              margin: 0;
              padding: 0;
              background: white;
              color: #333;
            }
            .resume-container {
              max-width: 8.5in;
              margin: 0 auto;
              padding: 0.5in;
              box-sizing: border-box;
            }
            /* Additional styles based on template */
            ${resumeData.template === 'professional' ? `
              h1, h2, h3 { color: #2563eb; }
              .section-title { border-bottom: 2px solid #2563eb; }
            ` : ''}
            ${resumeData.template === 'creative' ? `
              h1, h2, h3 { color: #8b5cf6; }
              .accent { color: #8b5cf6; }
            ` : ''}
            ${resumeData.template === 'minimal' ? `
              h1, h2, h3 { font-weight: 400; }
              .section-title { letter-spacing: 1px; }
            ` : ''}
            /* Common styles */
            .header { margin-bottom: 20px; }
            .section { margin-bottom: 15px; }
            .skills-list { display: flex; flex-wrap: wrap; gap: 5px; }
            .skill-item { 
              background: #f3f4f6; 
              padding: 3px 8px;
              border-radius: 4px;
              font-size: 0.85rem;
            }
            @media print {
              body { -webkit-print-color-adjust: exact; }
              .page-break { page-break-after: always; }
            }
          </style>
        </head>
        <body>
          <div class="resume-container">
            ${templateComponent}
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Template selection and controls */}
      <div className="flex justify-between items-center mb-4 py-2 px-4 bg-gray-900/60 rounded-lg backdrop-blur-sm">
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-1 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
              >
                <FileText className="h-4 w-4" />
                Templates
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-60 bg-gray-900 border-gray-800"
            >
              <DropdownMenuLabel className="text-gray-400">
                Select Template
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-800" />
              <div className="grid grid-cols-1 gap-1 p-1">
                <DropdownMenuItem
                  className={cn(
                    "flex flex-col items-start rounded-md p-2 hover:bg-gray-800",
                    resume.template === "professional" &&
                      "bg-blue-900/30 hover:bg-blue-900/40"
                  )}
                  onClick={() => onTemplateChange("professional")}
                >
                  <span className="font-medium text-gray-200">Professional</span>
                  <span className="text-xs text-gray-400">
                    Classic and traditional format
                  </span>
                  <div className="mt-2 w-full">
                    <TemplatePreviewProfessional />
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className={cn(
                    "flex flex-col items-start rounded-md p-2 hover:bg-gray-800",
                    resume.template === "creative" &&
                      "bg-blue-900/30 hover:bg-blue-900/40"
                  )}
                  onClick={() => onTemplateChange("creative")}
                >
                  <span className="font-medium text-gray-200">Creative</span>
                  <span className="text-xs text-gray-400">
                    Modern design with personality
                  </span>
                  <div className="mt-2 w-full">
                    <TemplatePreviewCreative />
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className={cn(
                    "flex flex-col items-start rounded-md p-2 hover:bg-gray-800",
                    resume.template === "executive" &&
                      "bg-blue-900/30 hover:bg-blue-900/40"
                  )}
                  onClick={() => onTemplateChange("executive")}
                >
                  <span className="font-medium text-gray-200">Executive</span>
                  <span className="text-xs text-gray-400">
                    Sophisticated and authoritative
                  </span>
                  <div className="mt-2 w-full">
                    <TemplatePreviewExecutive />
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className={cn(
                    "flex flex-col items-start rounded-md p-2 hover:bg-gray-800",
                    resume.template === "modern" &&
                      "bg-blue-900/30 hover:bg-blue-900/40"
                  )}
                  onClick={() => onTemplateChange("modern")}
                >
                  <span className="font-medium text-gray-200">Modern</span>
                  <span className="text-xs text-gray-400">
                    Contemporary and clean design
                  </span>
                  <div className="mt-2 w-full">
                    <TemplatePreviewModern />
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className={cn(
                    "flex flex-col items-start rounded-md p-2 hover:bg-gray-800",
                    resume.template === "minimal" &&
                      "bg-blue-900/30 hover:bg-blue-900/40"
                  )}
                  onClick={() => onTemplateChange("minimal")}
                >
                  <span className="font-medium text-gray-200">Minimal</span>
                  <span className="text-xs text-gray-400">
                    Simple and elegant presentation
                  </span>
                  <div className="mt-2 w-full">
                    <TemplatePreviewMinimal />
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className={cn(
                    "flex flex-col items-start rounded-md p-2 hover:bg-gray-800",
                    resume.template === "industry" &&
                      "bg-blue-900/30 hover:bg-blue-900/40"
                  )}
                  onClick={() => onTemplateChange("industry")}
                >
                  <span className="font-medium text-gray-200">Industry</span>
                  <span className="text-xs text-gray-400">
                    Professional with skill emphasis
                  </span>
                  <div className="mt-2 w-full">
                    <TemplatePreviewIndustry />
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className={cn(
                    "flex flex-col items-start rounded-md p-2 hover:bg-gray-800",
                    resume.template === "bold" &&
                      "bg-blue-900/30 hover:bg-blue-900/40"
                  )}
                  onClick={() => onTemplateChange("bold")}
                >
                  <span className="font-medium text-gray-200">Bold</span>
                  <span className="text-xs text-gray-400">
                    Stand out with confident styling
                  </span>
                  <div className="mt-2 w-full">
                    <TemplatePreviewBold />
                  </div>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="icon"
            className={cn(
              "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700",
              previewMode === "scroll" && "text-blue-400"
            )}
            onClick={() => setPreviewMode("scroll")}
            title="Continuous scroll mode"
          >
            <Rows className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className={cn(
              "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700",
              previewMode === "pages" && "text-blue-400"
            )}
            onClick={() => setPreviewMode("pages")}
            title="Page view mode"
          >
            <Columns className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
            onClick={() => {
              const newScale = Math.max(0.5, scale - 0.1);
              setScale(newScale);
            }}
            title="Zoom out"
          >
            <Minus className="h-4 w-4" />
          </Button>

          <div className="text-gray-400 text-xs flex items-center min-w-[60px] justify-center">
            {Math.round(scale * 100)}%
          </div>

          <Button
            variant="outline"
            size="icon"
            className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
            onClick={() => {
              const newScale = Math.min(2, scale + 0.1);
              setScale(newScale);
            }}
            title="Zoom in"
          >
            <Plus className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
            onClick={() => setScale(1)}
            title="Reset zoom"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-1 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
            onClick={() => onDownload && onDownload()}
            title="Download resume as PDF"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download</span>
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-1 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
            onClick={() => {
              // Open print dialog with formatted resume
              const printWindow = window.open("", "_blank");
              if (printWindow) {
                const htmlContent = generatePrintableHTML(resume);
                printWindow.document.write(htmlContent);
                printWindow.document.close();
              } else {
                console.log("Popup blocked. Please allow popups to print.");
              }
            }}
            title="Print resume"
          >
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Print</span>
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-1 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
            onClick={() => setIsViewMode(!isViewMode)}
          >
            {isViewMode ? (
              <>
                <EyeOff className="h-4 w-4" />
                <span className="hidden sm:inline">Edit</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">View</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Resume preview area */}
      <div
        className={cn(
          "flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 rounded-lg",
          previewMode === "pages" && "flex flex-col items-center py-8 space-y-8"
        )}
      >
        {previewMode === "scroll" ? (
          <div
            ref={previewRef}
            className="min-h-[11in] w-[8.5in] bg-white mx-auto shadow-lg my-8 overflow-hidden"
            style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}
          >
            {/* Resume template based on selected type */}
            {resume.template === "creative" ? (
              <CreativeTemplate resume={resume} />
            ) : resume.template === "executive" ? (
              <ExecutiveTemplate resume={resume} />
            ) : resume.template === "modern" ? (
              <ModernTemplate resume={resume} />
            ) : resume.template === "minimal" ? (
              <MinimalTemplate resume={resume} />
            ) : resume.template === "industry" ? (
              <IndustryTemplate resume={resume} />
            ) : resume.template === "bold" ? (
              <BoldTemplate resume={resume} />
            ) : (
              <ProfessionalTemplate resume={resume} />
            )}
          </div>
        ) : (
          // Paged view - show pagination controls
          <>
            <div className="flex items-center justify-center mb-4 space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-400">
                Page {currentPage} of {numPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                onClick={() =>
                  setCurrentPage(Math.min(numPages, currentPage + 1))
                }
                disabled={currentPage === numPages}
              >
                Next
              </Button>
            </div>

            <div
              ref={previewRef}
              className="min-h-[11in] w-[8.5in] bg-white shadow-lg overflow-hidden relative"
              style={{ 
                transform: `scale(${scale})`,
                transformOrigin: "top center",
                height: "11in", // Fixed A4 height
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 11 * numPages + "in",
                  transform: `translateY(-${(currentPage - 1) * 11}in)`,
                  transition: "transform 0.3s ease-in-out",
                }}
              >
                {resume.template === "creative" ? (
                  <CreativeTemplate resume={resume} />
                ) : resume.template === "executive" ? (
                  <ExecutiveTemplate resume={resume} />
                ) : resume.template === "modern" ? (
                  <ModernTemplate resume={resume} />
                ) : resume.template === "minimal" ? (
                  <MinimalTemplate resume={resume} />
                ) : resume.template === "industry" ? (
                  <IndustryTemplate resume={resume} />
                ) : resume.template === "bold" ? (
                  <BoldTemplate resume={resume} />
                ) : (
                  <ProfessionalTemplate resume={resume} />
                )}
              </div>
              <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white px-2 py-1 rounded shadow">
                Page {currentPage}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ResumeBuilder() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useState(
    () => new URLSearchParams(window.location.search),
  );
  const resumeIdParam = searchParams.get("id") || "new";
  const templateParam = searchParams.get("template") || "professional";
  const [resumeId, setResumeId] = useState<string>(resumeIdParam);
  const [activeSection, setActiveSection] = useState<string>("contact");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Create state for resume data with default values
  const [resume, setResume] = useState<Resume>({
    id: resumeId === "new" ? undefined : resumeId,
    title: "My Resume",
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      headline: "",
      summary: "",
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    template: templateParam,
    skillsDisplayMode: "bubbles",
  });

  const [isEditMode, setIsEditMode] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isTailoredResume, setIsTailoredResume] = useState(false);

  // Get resume data from API if resumeId is provided (not "new")
  const { data: userResumes } = useQuery({
    queryKey: ["/api/resumes"],
    enabled: false, // We handle manual fetching below
  });

  // Query for specific resume when resumeId is provided
  const { data: fetchedResume } = useQuery({
    queryKey: ["/api/resumes", resumeId],
    enabled: resumeId !== "new",
  });

  useEffect(() => {
    // Update resume data when fetchedResume changes
    if (fetchedResume && resumeId !== "new") {
      setResume({
        ...fetchedResume,
        template: fetchedResume.template || templateParam,
      });
    }
  }, [fetchedResume, resumeId, templateParam]);

  // Update URL when resumeId changes
  useEffect(() => {
    const url = new URL(window.location.href);
    if (resumeId) {
      url.searchParams.set("id", resumeId);
    }
    if (resume.template) {
      url.searchParams.set("template", resume.template);
    }
    window.history.replaceState({}, "", url.toString());
  }, [resumeId, resume.template]);

  // Mutation for creating a new resume
  const createResumeMutation = useMutation({
    mutationFn: async (resumeData: Resume) => {
      const res = await apiRequest("POST", "/api/resumes", {
        title: resumeData.title || "My Resume",
        data: resumeData,
      });
      return res.json();
    },
    onSuccess: (data) => {
      // Update the resume ID and invalidate queries
      setResumeId(data.id.toString());
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      console.log("Resume created successfully!");
    },
    onError: (error) => {
      console.error("Error creating resume:", error);
      console.log("Please try again or check your connection.");
    },
  });

  // Mutation for updating an existing resume
  const updateResumeMutation = useMutation({
    mutationFn: async (resumeData: Resume) => {
      const res = await apiRequest(
        "PATCH",
        `/api/resumes/${resumeData.id}`,
        {
          title: resumeData.title || "My Resume",
          data: resumeData,
        },
      );
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes", resumeId] });
      console.log("Resume updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating resume:", error);
      console.log("Please try again or check your connection.");
    },
  });

  // Save resume (create or update)
  const handleSaveResume = async () => {
    setIsSaving(true);
    try {
      // Determine if we need to create a new resume or update existing
      if (resumeId === "new" || !resume.id) {
        await createResumeMutation.mutateAsync(resume);
      } else {
        await updateResumeMutation.mutateAsync(resume);
      }
    } catch (error) {
      console.error("Error saving resume:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle resume upload from file
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("resumeFile", file);

    try {
      const res = await apiRequest("POST", "/api/resumes/parse", formData, {
        isFormData: true,
      });
      const parsedData = await res.json();

      if (parsedData.success) {
        // Create a new resume with the parsed data
        setResume((prev) => ({
          ...prev,
          personalInfo: parsedData.data.personalInfo || prev.personalInfo,
          experience: parsedData.data.experience || prev.experience,
          education: parsedData.data.education || prev.education,
          skills: parsedData.data.skills || prev.skills,
        }));
        console.log("Resume uploaded and parsed successfully!");
      } else {
        console.log("Could not parse resume. Please try a different file format (PDF, DOCX, or TXT).");
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      console.log("Failed to upload resume. Please try again or use a different file.");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle file input click
  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Download the resume as PDF
  const downloadResume = async () => {
    try {
      const res = await apiRequest(
        "GET",
        `/api/resumes/${resumeId}/download?template=${resume.template}`,
        null,
        { responseType: "blob" }
      );
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resume.personalInfo.firstName || "My"}_${resume.personalInfo.lastName || "Resume"}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log("Resume downloaded successfully!");
    } catch (error) {
      console.error("Error downloading resume:", error);
      console.log("Failed to download resume. Please try again.");
    }
  };

  // Update personal information
  const updatePersonalInfo = (field: string, value: string) => {
    setResume((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  // Handle template change
  const handleTemplateChange = (template: string) => {
    setResume((prev) => ({ ...prev, template }));
  };

  // Handle bullet point application from AI suggestions
  const handleApplyBulletPoint = (
    bulletPoint: string,
    experienceId?: string,
    currentDescription?: string
  ) => {
    if (experienceId) {
      // Update specific experience item
      setResume((prev) => ({
        ...prev,
        experience: prev.experience.map((exp) => {
          if (exp.id === experienceId) {
            // If there's existing content, add a new line
            const updatedDescription = currentDescription
              ? `${currentDescription}\n• ${bulletPoint}`
              : `• ${bulletPoint}`;
            
            return { ...exp, description: updatedDescription };
          }
          return exp;
        }),
      }));
      console.log("Bullet point added to experience!");
    } else {
      // Add to most recent experience item if none specified
      setResume((prev) => {
        if (prev.experience.length > 0) {
          const lastIndex = prev.experience.length - 1;
          const lastExp = prev.experience[lastIndex];
          const updatedExperience = [...prev.experience];
          
          updatedExperience[lastIndex] = {
            ...lastExp,
            description: lastExp.description
              ? `${lastExp.description}\n• ${bulletPoint}`
              : `• ${bulletPoint}`,
          };
          
          return { ...prev, experience: updatedExperience };
        }
        return prev;
      });
      console.log("Bullet point added to most recent experience!");
    }
  };

  // Handle summary application from AI suggestions
  const handleApplySummary = (summary: string) => {
    const currentSummary = resume.personalInfo.summary;
    updatePersonalInfo("summary", summary);
    console.log("Summary updated with AI suggestion!");
  };

  // Handle skill application from AI suggestions
  const handleApplySkill = (skillName: string) => {
    // Check if the skill already exists to avoid duplicates
    const skillExists = resume.skills.some(
      (s) => s.name.toLowerCase() === skillName.toLowerCase()
    );
    
    if (!skillExists) {
      setResume((prev) => ({
        ...prev,
        skills: [
          ...prev.skills,
          {
            id: `skill-${Date.now()}`,
            name: skillName,
            proficiency: 3, // Default to medium proficiency
          },
        ],
      }));
      console.log(`Skill "${skillName}" added!`);
    } else {
      console.log(`Skill "${skillName}" already exists in your resume.`);
    }
  };

  // Handle file input click for resume upload
  const handleResumeUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <CosmicBackground />
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold cosmic-text-gradient">
              Resume Builder
            </h1>
            <p className="text-gray-400 max-w-2xl">
              Create a professional resume with our intuitive builder. Add your
              details, choose a template, and download your perfect resume.
            </p>
          </div>

          <div className="flex gap-2">
            <CosmicButton
              variant="outline"
              onClick={handleFileInputClick}
              isLoading={isUploading}
              loadingText="Uploading..."
              iconLeft={<Upload className="h-4 w-4" />}
              className="text-purple-200 border-purple-800/50 hover:bg-purple-900/30"
            >
              Upload Resume
            </CosmicButton>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf,.docx,.doc,.txt"
              onChange={handleFileUpload}
            />

            <CosmicButton
              onClick={handleSaveResume}
              isLoading={isSaving}
              loadingText="Saving..."
              iconLeft={<Save className="h-4 w-4" />}
            >
              Save Resume
            </CosmicButton>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Resume editing sections */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-gray-900/60 border border-gray-800 rounded-lg overflow-hidden backdrop-blur-sm">
              <Tabs defaultValue={activeSection} className="w-full">
                <TabsList className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 h-auto p-1 bg-gray-950/50">
                  <TabsTrigger
                    value="contact"
                    className="py-2 data-[state=active]:bg-blue-900/30"
                    onClick={() => setActiveSection("contact")}
                  >
                    <User className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Contact</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="summary"
                    className="py-2 data-[state=active]:bg-blue-900/30"
                    onClick={() => setActiveSection("summary")}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Summary</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="experience"
                    className="py-2 data-[state=active]:bg-blue-900/30"
                    onClick={() => setActiveSection("experience")}
                  >
                    <Briefcase className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Experience</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="education"
                    className="py-2 data-[state=active]:bg-blue-900/30"
                    onClick={() => setActiveSection("education")}
                  >
                    <GraduationCap className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Education</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="skills"
                    className="py-2 data-[state=active]:bg-blue-900/30"
                    onClick={() => setActiveSection("skills")}
                  >
                    <Code className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Skills</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="projects"
                    className="py-2 data-[state=active]:bg-blue-900/30"
                    onClick={() => setActiveSection("projects")}
                  >
                    <FolderKanban className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Projects</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="contact" className="p-4 space-y-4">
                  <h2 className="text-xl font-semibold text-blue-200">
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-gray-300">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        value={resume.personalInfo.firstName}
                        onChange={(e) =>
                          updatePersonalInfo("firstName", e.target.value)
                        }
                        className="bg-gray-800/70 border-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-gray-300">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        value={resume.personalInfo.lastName}
                        onChange={(e) =>
                          updatePersonalInfo("lastName", e.target.value)
                        }
                        className="bg-gray-800/70 border-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={resume.personalInfo.email}
                        onChange={(e) =>
                          updatePersonalInfo("email", e.target.value)
                        }
                        className="bg-gray-800/70 border-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-300">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        value={resume.personalInfo.phone}
                        onChange={(e) =>
                          updatePersonalInfo("phone", e.target.value)
                        }
                        className="bg-gray-800/70 border-gray-700"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="headline" className="text-gray-300">
                        Headline / Job Title
                      </Label>
                      <Input
                        id="headline"
                        value={resume.personalInfo.headline}
                        onChange={(e) =>
                          updatePersonalInfo("headline", e.target.value)
                        }
                        className="bg-gray-800/70 border-gray-700"
                        placeholder="e.g. Senior Software Developer"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="summary" className="p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-blue-200">
                      Professional Summary
                    </h2>
                    {/* Badge for active section */}
                    {activeSection === "summary" && (
                      <div className="flex items-center">
                        <Badge variant="outline" className="bg-blue-900/30 border-blue-500/30 text-blue-200">
                          <Zap className="w-3 h-3 mr-1" />
                          AI Available
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label
                        htmlFor="summary"
                        className="text-gray-300 flex justify-between"
                      >
                        <span>Professional Summary</span>
                        <span className="text-gray-500 text-xs">
                          {resume.personalInfo.summary?.length || 0}/500
                        </span>
                      </Label>
                      <RichTextEditor
                        value={resume.personalInfo.summary || ""}
                        onChange={(value) => updatePersonalInfo("summary", value)}
                        className="min-h-[100px] bg-gray-800/70 border-gray-700"
                        placeholder="Write a compelling summary of your qualifications, experience, and career goals..."
                        rows={4}
                      />
                    </div>
                  </div>

                  {/* AI assistant for summary */}
                  {resumeId && (
                    <div className="mt-8">
                      <Collapsible
                        defaultOpen={activeSection === "summary"}
                        className="w-full"
                      >
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-blue-900/20 border border-blue-900/30 rounded-lg text-left">
                          <div className="flex items-center">
                            <Cpu className="h-4 w-4 mr-2 text-blue-400" />
                            <span className="font-medium text-blue-200">
                              AI Summary Suggestions
                            </span>
                          </div>
                          <ChevronDown className="h-4 w-4 text-blue-400" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-3 p-3 bg-blue-900/10 border border-blue-900/30 rounded-lg">
                          <SummarySuggestions
                            resumeId={resumeId}
                            onApply={handleApplySummary}
                          />
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="experience" className="p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-blue-200">
                      Work Experience
                    </h2>
                    {/* Badge for active section */}
                    {activeSection === "experience" && (
                      <div className="flex items-center">
                        <Badge variant="outline" className="bg-blue-900/30 border-blue-500/30 text-blue-200">
                          <Zap className="w-3 h-3 mr-1" />
                          AI Available
                        </Badge>
                      </div>
                    )}
                  </div>

                  <ResumeExperienceSection
                    experiences={resume.experience}
                    onUpdate={(experiences) =>
                      setResume((prev) => ({ ...prev, experience: experiences }))
                    }
                  />

                  {/* AI assistant for experience bullet points */}
                  {resumeId && activeSection === "experience" && (
                    <div className="mt-4">
                      <Collapsible
                        defaultOpen={activeSection === "experience"}
                        className="w-full"
                      >
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-blue-900/20 border border-blue-900/30 rounded-lg text-left">
                          <div className="flex items-center">
                            <Cpu className="h-4 w-4 mr-2 text-blue-400" />
                            <span className="font-medium text-blue-200">
                              AI Bullet Point Suggestions
                            </span>
                          </div>
                          <ChevronDown className="h-4 w-4 text-blue-400" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-3 p-3 bg-blue-900/10 border border-blue-900/30 rounded-lg">
                          <ExperienceSuggestions
                            resumeId={resumeId}
                            jobTitle={resume.personalInfo.headline}
                            onApply={(bulletPoint) =>
                              handleApplyBulletPoint(bulletPoint)
                            }
                          />
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="education" className="p-4 space-y-4">
                  <h2 className="text-xl font-semibold text-blue-200">
                    Education
                  </h2>

                  <ResumeEducationSection
                    education={resume.education}
                    onUpdate={(education) =>
                      setResume((prev) => ({ ...prev, education }))
                    }
                  />
                </TabsContent>

                <TabsContent value="skills" className="p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-blue-200">
                      Skills
                    </h2>
                    {/* Badge for active section */}
                    {activeSection === "skills" && (
                      <div className="flex items-center">
                        <Badge variant="outline" className="bg-blue-900/30 border-blue-500/30 text-blue-200">
                          <Zap className="w-3 h-3 mr-1" />
                          AI Available
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Display as:</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "bg-gray-800/50 border-gray-700 hover:bg-gray-700/50",
                          resume.skillsDisplayMode === "bubbles" &&
                            "bg-blue-900/30 border-blue-500/30 text-blue-200"
                        )}
                        onClick={() =>
                          setResume((prev) => ({
                            ...prev,
                            skillsDisplayMode: "bubbles",
                          }))
                        }
                      >
                        Bubbles
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "bg-gray-800/50 border-gray-700 hover:bg-gray-700/50",
                          resume.skillsDisplayMode === "bullets" &&
                            "bg-blue-900/30 border-blue-500/30 text-blue-200"
                        )}
                        onClick={() =>
                          setResume((prev) => ({
                            ...prev,
                            skillsDisplayMode: "bullets",
                          }))
                        }
                      >
                        Bullets
                      </Button>
                    </div>
                  </div>

                  <ResumeSkillsSection
                    skills={resume.skills}
                    onUpdate={(skills) =>
                      setResume((prev) => ({ ...prev, skills }))
                    }
                  />

                  {/* AI assistant for skills */}
                  {resumeId && activeSection === "skills" && (
                    <div className="mt-4">
                      <Collapsible
                        defaultOpen={activeSection === "skills"}
                        className="w-full"
                      >
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-blue-900/20 border border-blue-900/30 rounded-lg text-left">
                          <div className="flex items-center">
                            <Cpu className="h-4 w-4 mr-2 text-blue-400" />
                            <span className="font-medium text-blue-200">
                              AI Skill Suggestions
                            </span>
                          </div>
                          <ChevronDown className="h-4 w-4 text-blue-400" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-3 p-3 bg-blue-900/10 border border-blue-900/30 rounded-lg">
                          <SkillSuggestions
                            resumeId={resumeId}
                            jobTitle={resume.personalInfo.headline}
                            onApply={handleApplySkill}
                          />
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="projects" className="p-4 space-y-4">
                  <h2 className="text-xl font-semibold text-blue-200">
                    Projects
                  </h2>

                  <ResumeProjectsSection
                    projects={resume.projects}
                    onUpdate={(projects) =>
                      setResume((prev) => ({ ...prev, projects }))
                    }
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* AI assistant component - only visible in view mode or when component is floating */}
            {resumeId && activeSection && !isTailoredResume && (
              <div className="mt-4 bg-gray-900/60 border border-gray-800 rounded-lg p-4 backdrop-blur-sm">
                <AIAssistant
                  resumeId={resumeId}
                  onApplySummary={handleApplySummary}
                  onApplyBulletPoint={handleApplyBulletPoint}
                  onApplySkill={handleApplySkill}
                  resume={resume}
                  activeTab={activeSection}
                />
              </div>
            )}
          </div>

          {/* Right column: Resume preview */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/60 border border-gray-800 rounded-lg overflow-hidden backdrop-blur-sm h-full">
              <ResumePreviewComponent
                resume={resume}
                onTemplateChange={handleTemplateChange}
                onDownload={downloadResume}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}