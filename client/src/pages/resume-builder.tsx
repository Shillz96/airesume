import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import ResumeTips from "@/components/resume-tips";
import Navbar from "@/components/navbar";
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
import { Button } from "@/components/ui/button";
import { CosmicButton } from "@/components/cosmic-button";
import RichTextEditor from "@/components/rich-text-editor";
import {
  FileText,
  GraduationCap,
  Briefcase,
  Code,
  Award,
  FolderKanban,
  FolderOpen,
  Save,
  Upload,
  Loader2,
  Cpu,
  Check,
  RefreshCw,
  Sparkles,
  Plus,
  Maximize2,
  Printer,
  ChevronDown,
  Download,
  Minus,
  User,
  X,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
  const { toast } = useToast();
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
        toast({
          title: "Refresh limit reached",
          description:
            "You've reached the maximum number of refreshes. Try a different style option.",
          variant: "default",
        });
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
                Generate ATS-optimized bullet points
              </>
            )}
          </Button>
          <p className="text-xs text-gray-400 mt-2">
            Creates achievement-focused bullet points with keywords that ATS
            systems scan for
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bulletPoints.map((bulletPoint, index) => (
            <div
              key={index}
              className="bg-[rgba(20,30,70,0.6)] p-3 rounded-md border border-blue-500/30 text-sm relative group backdrop-blur-sm"
            >
              <p className="text-gray-200">{bulletPoint}</p>
              <Button
                onClick={() => onApply(bulletPoint)}
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
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [lastUsedCategory, setLastUsedCategory] =
    useState<SkillsCategory>("technical");
  const [generationCount, setGenerationCount] = useState(0);
  const [refreshCount, setRefreshCount] = useState<
    Record<SkillsCategory, number>
  >({
    technical: 0,
    soft: 0,
    industry: 0,
  });

  // Generate AI skill suggestions with category options
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
      // Increment refresh count for this category
      const newRefreshCount = refreshCount[category] + 1;

      // Only allow up to 5 refreshes per category
      if (newRefreshCount <= 5) {
        setRefreshCount((prev) => ({ ...prev, [category]: newRefreshCount }));
        setGenerationCount((prev) => prev + 1);
      } else {
        toast({
          title: "Refresh limit reached",
          description:
            "You've reached the maximum number of refreshes. Try a different skill category.",
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
        if (
          jobTitle_safe.toLowerCase().includes("developer") ||
          jobTitle_safe.toLowerCase().includes("engineer")
        ) {
          return [
            "JavaScript",
            "React",
            "Node.js",
            "TypeScript",
            "GraphQL",
            "AWS",
            "Docker",
            "CI/CD",
            "Git",
            "Agile Methodologies",
            "Python",
            "RESTful APIs",
            "SQL",
            "NoSQL",
            "Cloud Architecture",
          ];
        } else if (jobTitle_safe.toLowerCase().includes("design")) {
          return [
            "UI/UX Design",
            "Figma",
            "Adobe Creative Suite",
            "Wireframing",
            "Prototyping",
            "User Research",
            "Design Systems",
            "Typography",
            "Responsive Design",
            "Design Thinking",
            "Information Architecture",
          ];
        } else {
          return [
            "Microsoft Office",
            "SQL",
            "Database Management",
            "CRM Systems",
            "Business Intelligence",
            "Data Analysis",
            "Project Management Software",
            "ERP Systems",
            "Cloud Computing",
            "Digital Marketing Tools",
          ];
        }
      }
      // Soft skills
      else if (category === "soft") {
        return [
          "Communication",
          "Leadership",
          "Problem Solving",
          "Critical Thinking",
          "Teamwork",
          "Adaptability",
          "Time Management",
          "Emotional Intelligence",
          "Conflict Resolution",
          "Creativity",
          "Decision Making",
          "Active Listening",
        ];
      }
      // Industry-specific skills
      else {
        if (
          jobTitle_safe.toLowerCase().includes("developer") ||
          jobTitle_safe.toLowerCase().includes("engineer")
        ) {
          return [
            "Machine Learning",
            "Blockchain",
            "AR/VR Development",
            "IoT",
            "Cybersecurity",
            "DevOps",
            "Microservices",
            "Serverless Architecture",
            "API Gateway",
            "Kubernetes",
            "Containerization",
          ];
        } else if (jobTitle_safe.toLowerCase().includes("design")) {
          return [
            "Motion Graphics",
            "Augmented Reality Design",
            "Interaction Design",
            "Design Strategy",
            "Accessibility",
            "Brand Strategy",
            "Visual Identity",
            "UX Writing",
            "Product Design",
            "Design Sprints",
          ];
        } else if (jobTitle_safe.toLowerCase().includes("manager")) {
          return [
            "Agile Management",
            "Strategic Planning",
            "Stakeholder Management",
            "KPI Development",
            "Operational Excellence",
            "Change Management",
            "Risk Management",
            "Vendor Management",
            "Budget Forecasting",
          ];
        } else {
          return [
            "Industry Standards",
            "Regulatory Compliance",
            "Market Analysis",
            "Forecasting",
            "Process Optimization",
            "Quality Assurance",
            "Benchmarking",
            "Continuous Improvement",
            "Six Sigma",
          ];
        }
      }
    };

    // If we have a valid resumeId (not "new" and not null), try to get AI suggestions
    if (resumeId && resumeId !== "new") {
      try {
        // Use the skillsOnly parameter to get ATS-optimized skills
        // Add category parameter and randomSeed to ensure we get different results each time
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
        console.error("Error generating skill suggestions:", error);
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
              Choose Skill Categories
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
                Generate ATS-friendly skills
              </>
            )}
          </Button>
          <p className="text-xs text-gray-400 mt-2">
            Suggests skills that align with your experience and are frequently
            scanned by ATS systems
          </p>
        </div>
      ) : (
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {skills.map((skill, index) => (
              <Badge
                key={index}
                variant="outline"
                className="py-1 px-3 cursor-pointer hover:bg-blue-600/30 flex items-center gap-1 bg-[rgba(20,30,70,0.6)] text-blue-100 border-blue-500/30 backdrop-blur-sm"
                onClick={() => onApply(skill)}
              >
                {skill}
                <span className="text-xs text-blue-400">
                  <Plus className="h-3 w-3" />
                </span>
              </Badge>
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

// ... (previous imports remain unchanged)

// Preview component for the "Preview" section
// This component has been replaced by ResumePreviewComponent

function ResumePreviewComponent({ resume, onTemplateChange }: { resume: Resume; onTemplateChange: (template: string) => void }) {
  // Calculate an initial scale that will fit most resumes in the viewport
  // Starting with 0.85 instead of 1.0 to show more content initially
  const [scale, setScale] = useState(0.85); 
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAutoAdjusting, setIsAutoAdjusting] = useState(false);
  const [editedResume, setEditedResume] = useState<Resume>(resume);
  const [fontScale, setFontScale] = useState(1); // For auto-adjusting font size
  const [spacingScale, setSpacingScale] = useState(1); // For auto-adjusting spacing
  const previewRef = useRef<HTMLDivElement>(null);
  const resumeContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Generate actual PDF file for download
  const downloadResume = async () => {
    try {
      // First set optimal settings for PDF generation
      const originalScale = scale;
      const originalFontScale = fontScale;
      const originalSpacingScale = spacingScale;
      
      // Set to 100% scale, reset font and spacing scales to 1
      setScale(1.0);
      setFontScale(1);
      setSpacingScale(1);
      
      // Add a loading toast to show progress
      toast({
        title: "Preparing PDF",
        description: "Optimizing your resume for PDF download...",
      });
      
      // Wait for the scale changes to apply
      setTimeout(async () => {
        if (!previewRef.current) return;
        
        // Create a virtual link element
        const link = document.createElement('a');
        
        // Generate a filename with the person's name (if available) or a default name
        const name = resume?.personalInfo?.firstName && resume?.personalInfo?.lastName ? 
          `${resume.personalInfo.firstName}_${resume.personalInfo.lastName}` : 
          'Resume';
        const fileName = `${name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
        
        // Try server-side PDF generation first, then fall back to print dialog
        try {
          // Create a form to send to the server for PDF generation
          const formData = new FormData();
          formData.append('resumeData', JSON.stringify(resume));
          formData.append('template', resume.template || 'professional');
          
          // Send the resume data to the server for PDF generation
          const response = await fetch('/api/generate-pdf', {
            method: 'POST',
            body: formData
          });
          
          if (!response.ok) throw new Error('Failed to generate PDF');
          
          // Get the PDF blob from the response
          const blob = await response.blob();
          
          // Create a URL for the blob
          const url = window.URL.createObjectURL(blob);
          
          // Set up the download link
          link.href = url;
          link.download = fileName;
          link.click();
          
          // Clean up
          window.URL.revokeObjectURL(url);
          
          toast({
            title: "PDF Downloaded",
            description: `Your resume has been downloaded as ${fileName}`,
          });
        } catch (error) {
          console.error('Error downloading PDF from server:', error);
          
          // If server-side generation fails, try client-side printing
          toast({
            title: "Using Print Dialog",
            description: "Server PDF generation failed. Using browser print dialog instead.",
          });
          
          // Add print-specific styles to the document
          const style = document.createElement('style');
          style.id = 'print-resume-style';
          style.innerHTML = `
            @media print {
              body * {
                visibility: hidden;
              }
              #${previewRef.current.id || 'resume-preview'}, #${previewRef.current.id || 'resume-preview'} * {
                visibility: visible;
              }
              #${previewRef.current.id || 'resume-preview'} {
                position: absolute;
                left: 0;
                top: 0;
                width: 210mm;
                height: 297mm;
                margin: 0;
                padding: 0;
                transform: scale(1) !important;
              }
            }
          `;
          document.head.appendChild(style);
          
          // Create a unique id for the preview element if it doesn't have one
          if (!previewRef.current.id) {
            previewRef.current.id = 'resume-preview';
          }
          
          // Trigger print dialog after a brief delay
          setTimeout(() => {
            window.print();
            
            // Remove the print styles after printing
            setTimeout(() => {
              const printStyle = document.getElementById('print-resume-style');
              if (printStyle) document.head.removeChild(printStyle);
            }, 1000);
          }, 500);
        }
        
        // Restore the original scales
        setTimeout(() => {
          setScale(originalScale);
          setFontScale(originalFontScale);
          setSpacingScale(originalSpacingScale);
        }, 1000);
      }, 300);
    } catch (error) {
      console.error('Error preparing PDF download:', error);
      
      // Fall back to basic print dialog as last resort
      window.print();
      
      toast({
        title: "Using Print Dialog",
        description: "There was an issue preparing the PDF. Using browser print dialog instead.",
        variant: "destructive"
      });
      
      // Reset the scales
      setScale(0.85);
      setFontScale(1);
      setSpacingScale(1);
    }
  };

  // Toggle fullscreen mode
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Apply changes from editedResume to the actual resume
      onTemplateChange(editedResume.template);
      
      // Dispatch event to update parent component
      const event = new CustomEvent('resumeEdited', {
        detail: { resume: editedResume }
      });
      document.dispatchEvent(event);
    }
  };

  // Handle field changes in the edit mode
  const handleFieldChange = (
    section: string,
    field: string,
    value: string,
    index?: number
  ) => {
    setEditedResume((prev) => {
      const newResume = { ...prev };
      
      if (section === "personalInfo") {
        newResume.personalInfo = { 
          ...newResume.personalInfo, 
          [field]: value 
        };
      } else if (section === "experience" && typeof index === 'number') {
        newResume.experience = [...newResume.experience];
        newResume.experience[index] = { 
          ...newResume.experience[index], 
          [field]: value 
        };
      } else if (section === "education" && typeof index === 'number') {
        newResume.education = [...newResume.education];
        newResume.education[index] = { 
          ...newResume.education[index], 
          [field]: value 
        };
      } else if (section === "skills" && typeof index === 'number') {
        newResume.skills = [...newResume.skills];
        newResume.skills[index] = { 
          ...newResume.skills[index], 
          [field]: value 
        };
      }
      
      return newResume;
    });
  };

  // Auto-adjust feature to fit content on one page
  const autoAdjust = () => {
    setIsAutoAdjusting(true);
    
    // First reset to default scale to get accurate measurements
    setScale(1.0);
    
    // Intelligent scaling algorithm to fit content
    setTimeout(() => {
      if (!previewRef.current) {
        setIsAutoAdjusting(false);
        return;
      }
      
      const contentHeight = previewRef.current.scrollHeight;
      const containerHeight = 297 * 3.78; // A4 height in pixels (297mm converted to px)
      
      // Calculate the required scaling factors
      const heightRatio = containerHeight / contentHeight;
      
      // Log for debugging
      console.log('Content height:', contentHeight, 'Container height:', containerHeight, 'Ratio:', heightRatio);
      
      // Apply the scaling depending on whether content is too large
      if (heightRatio < 1) {
        // Content is too large, scale down the font and spacing gradually
        
        // Calculate optimal font scaling - more gentle reduction for minor overflows
        let newFontScale = 1;
        if (heightRatio >= 0.9) { // Minor overflow (less than 10%)
          newFontScale = Math.max(0.9, heightRatio * 0.98);
        } else if (heightRatio >= 0.8) { // Moderate overflow (10-20%)
          newFontScale = Math.max(0.8, heightRatio * 0.95);
        } else { // Major overflow (>20%)
          newFontScale = Math.max(0.7, heightRatio * 0.9);
        }
        
        // Spacing can be reduced more aggressively than font size
        const newSpacingScale = Math.max(0.7, heightRatio * 0.85);
        
        // Set new scales
        setFontScale(newFontScale);
        setSpacingScale(newSpacingScale);
        
        // Also adjust the view scale for better visibility if content is very large
        if (heightRatio < 0.7) {
          // For very large content, zoom out to see more
          setScale(0.8);
        } else {
          // For moderately large content, keep scale at 0.85
          setScale(0.85);
        }
        
        toast({
          title: "Smart Fit Applied",
          description: `Content adjusted to fit on one page (${Math.round(newFontScale * 100)}% text scale)`,
        });
      } else {
        // Content fits already, reset to default
        setFontScale(1);
        setSpacingScale(1);
        
        // Set view scale to show the full page
        setScale(0.85);
        
        toast({
          title: "Smart Fit Reset",
          description: "Your content already fits on one page. Using default sizes.",
        });
      }
      
      setIsAutoAdjusting(false);
    }, 500);
  };
  
  // Keep editedResume in sync with resume props changes
  useEffect(() => {
    setEditedResume(resume);
  }, [resume]);
  
  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium text-white">Resume Preview</h3>
          <Badge variant="outline" className="text-blue-300 border-blue-300/30">
            {Math.round(scale * 100)}%
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScale(Math.max(0.5, scale - 0.1))}
            disabled={scale <= 0.5}
            className="flex items-center text-white border-white/20 hover:bg-white/10"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScale(Math.min(1.5, scale + 0.1))}
            disabled={scale >= 1.5}
            className="flex items-center text-white border-white/20 hover:bg-white/10"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={autoAdjust}
            disabled={isAutoAdjusting}
            className="flex items-center gap-1 text-white border-white/20 hover:bg-white/10"
            title="Automatically adjust font size and spacing to fit content on one page without changing zoom level"
          >
            {isAutoAdjusting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
            Smart Fit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullScreen}
            className="flex items-center gap-1 text-white border-white/20 hover:bg-white/10"
          >
            <Maximize2 className="h-4 w-4" />
            {isFullScreen ? "Exit Full Screen" : "Full Screen"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleEdit}
            className="flex items-center gap-1 text-white border-white/20 hover:bg-white/10"
          >
            {isEditing ? (
              <>
                <Check className="h-4 w-4" />
                Save
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Edit
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadResume}
            className="flex items-center gap-1 text-white border-white/20 hover:bg-white/10"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Resume Preview */}
      <div
        ref={resumeContainerRef}
        className={cn(
          "bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl overflow-auto scroll-smooth",
          isFullScreen
            ? "fixed inset-0 z-50 m-0 p-8 bg-black/90"
            : "p-4 h-[80vh] flex items-center justify-center" // Center the preview vertically and horizontally
        )}
      >
        <div
          ref={previewRef}
          className="transition-all duration-300 mx-auto bg-white shadow-lg print:shadow-none"
          style={{
            transform: `scale(${scale})`,
            width: "210mm", // A4 width
            minHeight: "297mm", // A4 height (minimum to ensure proper proportions)
            maxHeight: "297mm", // A4 height (maximum to ensure proper proportions)
            transformOrigin: "center", // Center transform origin for better viewing 
            fontSize: `${fontScale * 100}%`, // Dynamic font scaling
            lineHeight: `${spacingScale * 1.5}`, // Dynamic line height scaling
            overflowY: isEditing ? "auto" : "hidden", // Hide overflow when not editing
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.15)", // Add shadow for better visibility
            marginTop: scale < 1 ? "0" : "2rem", // Add margin when zoomed in
            marginBottom: scale < 1 ? "0" : "2rem", // Add margin when zoomed in
          }}
        >
          {isEditing ? (
            <div className="p-6 bg-white text-black h-full">
              {/* Personal Info Section */}
              <div className="mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold mb-2">
                  <Input
                    value={editedResume.personalInfo.firstName + " " + editedResume.personalInfo.lastName}
                    onChange={(e) => {
                      const [firstName, ...lastNameParts] = e.target.value.split(" ");
                      handleFieldChange("personalInfo", "firstName", firstName || "");
                      handleFieldChange("personalInfo", "lastName", lastNameParts.join(" ") || "");
                    }}
                    className="border border-gray-200 p-1 text-2xl font-bold w-full bg-white"
                  />
                </h2>
                <div className="flex flex-wrap gap-3 text-sm mb-4">
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-xs text-gray-500 block mb-1">Email</label>
                    <Input
                      value={editedResume.personalInfo.email}
                      onChange={(e) => handleFieldChange("personalInfo", "email", e.target.value)}
                      className="border border-gray-200 p-1 text-sm w-full bg-white"
                      placeholder="Email"
                    />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-xs text-gray-500 block mb-1">Phone</label>
                    <Input
                      value={editedResume.personalInfo.phone}
                      onChange={(e) => handleFieldChange("personalInfo", "phone", e.target.value)}
                      className="border border-gray-200 p-1 text-sm w-full bg-white"
                      placeholder="Phone"
                    />
                  </div>
                </div>
                <div>
                  <RichTextEditor
                    label="Professional Summary"
                    value={editedResume.personalInfo.summary}
                    onChange={(value) => handleFieldChange("personalInfo", "summary", value)}
                    placeholder="Professional Summary"
                    rows={4}
                  />
                </div>
              </div>
              
              {/* Experience Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Experience</h3>
                {editedResume.experience.map((exp, index) => (
                  <div key={exp.id} className="mb-4 pb-4 border-b border-gray-100">
                    <div className="flex flex-wrap gap-3 mb-2">
                      <div className="flex-1 min-w-[200px]">
                        <label className="text-xs text-gray-500 block mb-1">Job Title</label>
                        <Input
                          value={exp.title}
                          onChange={(e) => handleFieldChange("experience", "title", e.target.value, index)}
                          className="border border-gray-200 p-1 text-sm w-full bg-white"
                        />
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <label className="text-xs text-gray-500 block mb-1">Company</label>
                        <Input
                          value={exp.company}
                          onChange={(e) => handleFieldChange("experience", "company", e.target.value, index)}
                          className="border border-gray-200 p-1 text-sm w-full bg-white"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 mb-2">
                      <div className="flex-1 min-w-[200px]">
                        <label className="text-xs text-gray-500 block mb-1">Start Date</label>
                        <Input
                          value={exp.startDate}
                          onChange={(e) => handleFieldChange("experience", "startDate", e.target.value, index)}
                          className="border border-gray-200 p-1 text-sm w-full bg-white"
                        />
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <label className="text-xs text-gray-500 block mb-1">End Date</label>
                        <Input
                          value={exp.endDate}
                          onChange={(e) => handleFieldChange("experience", "endDate", e.target.value, index)}
                          className="border border-gray-200 p-1 text-sm w-full bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <RichTextEditor
                        label="Description"
                        value={exp.description}
                        onChange={(value) => handleFieldChange("experience", "description", value, index)}
                        placeholder="Job description and achievements"
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Skills Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Skills</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {editedResume.skills.map((skill, index) => (
                    <div key={skill.id} className="border border-gray-200 rounded p-2">
                      <Input
                        value={skill.name}
                        onChange={(e) => handleFieldChange("skills", "name", e.target.value, index)}
                        className="border-none p-0 text-sm w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Education Section - Simplified */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Education</h3>
                {editedResume.education.map((edu, index) => (
                  <div key={edu.id} className="mb-4 pb-4 border-b border-gray-100">
                    <div className="flex flex-wrap gap-3 mb-2">
                      <div className="flex-1 min-w-[200px]">
                        <label className="text-xs text-gray-500 block mb-1">Degree</label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => handleFieldChange("education", "degree", e.target.value, index)}
                          className="border border-gray-200 p-1 text-sm w-full bg-white"
                        />
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <label className="text-xs text-gray-500 block mb-1">Institution</label>
                        <Input
                          value={edu.institution}
                          onChange={(e) => handleFieldChange("education", "institution", e.target.value, index)}
                          className="border border-gray-200 p-1 text-sm w-full bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white text-black p-8">
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
          )}
        </div>
      </div>

      {/* Template Selection */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4 text-white">Choose a Template</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { name: "professional", preview: TemplatePreviewProfessional },
            { name: "creative", preview: TemplatePreviewCreative },
            { name: "executive", preview: TemplatePreviewExecutive },
            { name: "modern", preview: TemplatePreviewModern },
            { name: "minimal", preview: TemplatePreviewMinimal },
            { name: "industry", preview: TemplatePreviewIndustry },
            { name: "bold", preview: TemplatePreviewBold },
          ].map((template) => (
            <div
              key={template.name}
              className={cn(
                "cursor-pointer p-3 rounded-lg transition-all",
                resume.template === template.name
                  ? "border-2 border-blue-500 shadow-lg"
                  : "border border-white/20"
              )}
              onClick={() => onTemplateChange(template.name)}
            >
              <div className="h-32 mb-2">
                <template.preview />
              </div>
              <h4 className="font-medium text-center text-white capitalize">{template.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ResumeBuilder() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useState(
    () => new URLSearchParams(window.location.search),
  );

  const [resumeSaved, setResumeSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("profile");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [isTailoredResume, setIsTailoredResume] = useState<boolean>(
    searchParams.get("tailored") === "true",
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showTips, setShowTips] = useState<
    "summary" | "experience" | "skills" | null
  >(null);

  // Initial resume state
  const [resume, setResume] = useState<Resume>({
    title: "My Professional Resume",
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
    template: "professional",
  });

  // Get all resumes for the load resume dropdown
  const { data: userResumes = [] } = useQuery({
    queryKey: ['/api/resumes'],
    enabled: true,
  });

  // Add a recovery mechanism - check if we have saved resume data in sessionStorage
  // and use it if the current resume is empty
  useEffect(() => {
    if (!resume.personalInfo.firstName && !resume.personalInfo.lastName) {
      try {
        // Try to recover from sessionStorage
        const savedData = sessionStorage.getItem('loadedResumeData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          console.log("Recovering resume data from sessionStorage:", parsedData);
          
          if (parsedData.resumeData) {
            // Apply the recovered data if we don't already have data
            setResume(parsedData.resumeData as Resume);
            
            // If we know the ID, set it
            if (parsedData.resumeData.id) {
              setResumeId(parsedData.resumeData.id);
            }
            
            toast({
              title: "Resume Data Recovered",
              description: "Your resume data has been recovered from a previous session.",
            });
          }
        }
      } catch (error) {
        console.error("Error recovering resume data:", error);
      }
    }
  }, [resume]);

  // Parse URL parameters on component mount
  useEffect(() => {
    // Check for resume ID in URL parameters
    const resumeIdParam = searchParams.get("id");
    const isEditMode = searchParams.get("edit") === "true";
    
    if (resumeIdParam) {
      try {
        const id = parseInt(resumeIdParam, 10);
        if (!isNaN(id)) {
          setResumeId(id);
          
          // Check if we have pre-loaded resume data from editing
          if (isEditMode) {
            const storedResumeData = localStorage.getItem('editingResume');
            if (storedResumeData) {
              try {
                const parsedData = JSON.parse(storedResumeData);
                console.log("Found pre-loaded resume data:", parsedData);
                
                if (parsedData.resumeData) {
                  const resumeData = parsedData.resumeData;
                  
                  // Process the resume data to ensure it has the proper structure
                  // The data comes with a nested 'content' object that contains all resume sections
                  const content = resumeData.content || {};
                  
                  const completeResume = {
                    id: resumeData.id,
                    title: resumeData.title || "Untitled Resume",
                    personalInfo: {
                      firstName: content.personalInfo?.firstName || "",
                      lastName: content.personalInfo?.lastName || "",
                      email: content.personalInfo?.email || "",
                      phone: content.personalInfo?.phone || "",
                      headline: content.personalInfo?.headline || "",
                      summary: content.personalInfo?.summary || ""
                    },
                    experience: Array.isArray(content.experience) ? content.experience.map((exp: any) => ({
                      ...exp,
                      id: exp.id || crypto.randomUUID(),
                    })) : [],
                    education: Array.isArray(content.education) ? content.education.map((edu: any) => ({
                      ...edu,
                      id: edu.id || crypto.randomUUID(),
                    })) : [],
                    skills: Array.isArray(content.skills) ? content.skills.map((skill: any) => ({
                      ...skill,
                      id: skill.id || crypto.randomUUID(),
                    })) : [],
                    projects: Array.isArray(content.projects) ? content.projects.map((project: any) => ({
                      ...project,
                      id: project.id || crypto.randomUUID(),
                    })) : [],
                    template: resumeData.template || "professional"
                  };
                  
                  // Update the resume state directly with the loaded data
                  setResume(completeResume as Resume);
                  setActiveSection("profile");
                  
                  // Show success toast
                  toast({
                    title: "Resume Loaded Successfully",
                    description: `"${completeResume.title}" has been loaded for editing`,
                  });
                  
                  // Clear the localStorage to prevent stale data
                  localStorage.removeItem('editingResume');
                }
              } catch (parseError) {
                console.error("Error parsing stored resume data:", parseError);
              }
            }
          }
        }
      } catch (e) {
        console.error("Error parsing resume ID from URL", e);
      }
    }

    // Check for template in URL parameters
    const templateParam = searchParams.get("template");
    if (templateParam) {
      setResume(prev => ({
        ...prev,
        template: templateParam
      }));
    }
  }, [searchParams]);

  // Fetch resume data if resumeId exists
  const { data: fetchedResume } = useQuery({
    queryKey: ["/api/resumes", resumeId],
    enabled: !!resumeId,
  });

  // Use useEffect to handle the data instead of onSuccess
  useEffect(() => {
    if (fetchedResume) {
      console.log("Resume data fetched:", JSON.stringify(fetchedResume, null, 2));
      
      try {
        // The API returns resume data with a nested 'content' object
        const content = fetchedResume.content || {};
        console.log("Resume content extracted:", content);
        
        // Ensure we have complete data structure for all fields
        const completeResume = {
          id: fetchedResume.id,
          title: fetchedResume.title || "Untitled Resume",
          personalInfo: {
            firstName: content.personalInfo?.firstName || "",
            lastName: content.personalInfo?.lastName || "",
            email: content.personalInfo?.email || "",
            phone: content.personalInfo?.phone || "",
            headline: content.personalInfo?.headline || "",
            summary: content.personalInfo?.summary || ""
          },
          experience: Array.isArray(content.experience) ? content.experience.map((exp: any) => ({
            ...exp,
            id: exp.id || crypto.randomUUID(), // Ensure each experience has an ID
          })) : [],
          education: Array.isArray(content.education) ? content.education.map((edu: any) => ({
            ...edu,
            id: edu.id || crypto.randomUUID(), // Ensure each education has an ID
          })) : [],
          skills: Array.isArray(content.skills) ? content.skills.map((skill: any) => ({
            ...skill,
            id: skill.id || crypto.randomUUID(), // Ensure each skill has an ID
          })) : [],
          projects: Array.isArray(content.projects) ? content.projects.map((project: any) => ({
            ...project,
            id: project.id || crypto.randomUUID(), // Ensure each project has an ID
          })) : [],
          template: fetchedResume.template || "professional"
        };
        
        console.log("Processed resume to load:", JSON.stringify(completeResume, null, 2));
        
        // Force a complete state update by creating a brand new object
        setResume(completeResume as Resume);
        
        // Set a debug flag in local storage to help with diagnostics
        localStorage.setItem('lastLoadedResume', JSON.stringify({
          resumeId: completeResume.id,
          firstName: completeResume.personalInfo.firstName,
          lastName: completeResume.personalInfo.lastName,
          timestamp: new Date().toISOString()
        }));
        
        // Show success toast when resume is fully loaded
        toast({
          title: "Resume Loaded Successfully",
          description: `"${completeResume.title}" has been loaded with ${completeResume.experience.length} experiences, ${completeResume.skills.length} skills, and ${completeResume.education.length} education entries.`,
        });
      } catch (error) {
        console.error("Error processing fetched resume:", error);
        toast({
          title: "Error Loading Resume",
          description: "There was a problem processing the resume data. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [fetchedResume, toast]);

  // Listen for resume edit events from the ResumePreviewComponent
  useEffect(() => {
    const handleResumeEdited = (event: Event) => {
      // Type assertion to access custom event detail
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.resume) {
        setResume(customEvent.detail.resume);
        toast({
          title: "Resume Updated",
          description: "Your changes in the preview have been applied.",
        });
      }
    };

    // Add event listener
    document.addEventListener('resumeEdited', handleResumeEdited);

    // Clean up
    return () => {
      document.removeEventListener('resumeEdited', handleResumeEdited);
    };
  }, []);

  // Handle tailored resume data from localStorage
  useEffect(() => {
    // Only check for tailored resume data on initial component mount
    // to avoid conflicts with other state updates
    const tailoredResumeData = localStorage.getItem("tailoredResume");

    if (tailoredResumeData) {
      try {
        const parsedData = JSON.parse(tailoredResumeData);

        // Immediately switch to profile tab for better UX
        setActiveSection("profile");

        // Create a new resume with the tailored content or update existing
        const hasExistingData =
          resume.personalInfo.firstName ||
          resume.personalInfo.lastName ||
          resume.experience.length > 0 ||
          resume.skills.length > 0;

        if (hasExistingData) {
          // Update existing resume with tailored content
          setResume((currentResume) => ({
            ...currentResume,
            personalInfo: {
              ...currentResume.personalInfo,
              // Only override summary from personalInfo
              summary:
                parsedData.personalInfo?.summary ||
                currentResume.personalInfo.summary,
            },
            // Replace experience and skills completely with tailored content
            experience: parsedData.experience || currentResume.experience,
            skills: parsedData.skills || currentResume.skills,
          }));

          toast({
            title: "Resume Updated",
            description:
              "Your resume has been updated with job-specific tailored content.",
          });
        } else {
          // Create a new resume with the tailored content
          setResume((currentResume) => ({
            ...currentResume,
            personalInfo: {
              ...currentResume.personalInfo,
              ...parsedData.personalInfo,
            },
            experience: parsedData.experience || [],
            skills: parsedData.skills || [],
          }));

          toast({
            title: "Tailored Resume Created",
            description:
              "A new resume has been created with job-specific content.",
          });
        }

        // Clear the localStorage data to prevent reapplying
        localStorage.removeItem("tailoredResume");

        // Remove the tailored parameter from URL
        window.history.replaceState(null, "", window.location.pathname);
      } catch (error) {
        console.error("Error applying tailored resume:", error);
        toast({
          title: "Error",
          description: "Failed to apply tailored resume data.",
          variant: "destructive",
        });
      }
    }
    // Run this effect only once on component mount (empty dependency array)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Auto-save resume to localStorage when user makes changes
  useEffect(() => {
    // Don't auto-save if just initialized with default values
    if (resume.personalInfo.firstName || resume.personalInfo.lastName || resume.experience.length > 0) {
      // Save current resume state to localStorage
      localStorage.setItem('autoSavedResume', JSON.stringify({
        resumeId: resumeId,
        resumeData: resume,
        timestamp: new Date().toISOString()
      }));
      
      console.log("Auto-saved resume to localStorage");
    }
  }, [resume, resumeId]);
  
  // Check for auto-saved resume data when component mounts
  useEffect(() => {
    // Only load from auto-save if we don't already have content in our resume
    if (!resume.personalInfo.firstName && !resume.personalInfo.lastName && resume.experience.length === 0) {
      try {
        const autoSavedData = localStorage.getItem('autoSavedResume');
        if (autoSavedData) {
          const parsedData = JSON.parse(autoSavedData);
          console.log("Found auto-saved resume data:", parsedData);
          
          // Check if the data is not too old (within 24 hours)
          const savedTime = new Date(parsedData.timestamp).getTime();
          const currentTime = new Date().getTime();
          const hoursDiff = (currentTime - savedTime) / (1000 * 60 * 60);
          
          if (hoursDiff < 24) {
            // Apply the auto-saved data
            if (parsedData.resumeData) {
              setResume(parsedData.resumeData as Resume);
              
              // If we have a resumeId saved, use it
              if (parsedData.resumeId) {
                setResumeId(parsedData.resumeId);
              }
              
              toast({
                title: "Recovered Unsaved Changes",
                description: "Your previously unsaved work has been restored.",
              });
            }
          } else {
            // Data is too old, clear it
            localStorage.removeItem('autoSavedResume');
          }
        }
      } catch (error) {
        console.error("Error loading auto-saved resume:", error);
      }
    }
  }, []);

  // Save resume mutation
  const saveResumeMutation = useMutation({
    mutationFn: async (resumeData: Resume) => {
      if (resumeId) {
        const res = await apiRequest(
          "PATCH",
          `/api/resumes/${resumeId}`,
          resumeData,
        );
        return await res.json();
      } else {
        const res = await apiRequest("POST", "/api/resumes", resumeData);
        return await res.json();
      }
    },
    onSuccess: (data) => {
      setResumeId(data.id);
      setResumeSaved(true);

      toast({
        title: "Resume saved",
        description: "Your resume has been saved successfully.",
      });

      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      
      // Clear the auto-saved data since we've now properly saved the resume
      localStorage.removeItem('autoSavedResume');
    },
    onError: (error) => {
      console.error("Error saving resume:", error);
      toast({
        title: "Error saving resume",
        description: "There was an error saving your resume. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Save resume handler
  const handleSaveResume = () => {
    setIsSaving(true);
    saveResumeMutation.mutate(resume);
    setIsSaving(false);
  };

  // Update personal info fields
  const updatePersonalInfo = (field: string, value: string) => {
    setResume({
      ...resume,
      personalInfo: {
        ...resume.personalInfo,
        [field]: value,
      },
    });
  };

  // Template change handler
  const handleTemplateChange = (template: string) => {
    setResume({
      ...resume,
      template,
    });
  };

  // File upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await apiRequest("POST", "/api/resumes/parse", formData);
      const parsedData = await res.json();

      if (parsedData.success) {
        // Update resume state with parsed data
        setResume({
          ...resume,
          personalInfo: {
            ...resume.personalInfo,
            ...parsedData.data.personalInfo,
          },
          experience: parsedData.data.experience || [],
          education: parsedData.data.education || [],
          skills: parsedData.data.skills || [],
        });

        toast({
          title: "Resume uploaded",
          description: "Your resume has been parsed successfully.",
        });
      } else {
        toast({
          title: "Error parsing resume",
          description:
            parsedData.error || "There was an error parsing your resume.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast({
        title: "Error uploading resume",
        description:
          "There was an error uploading your resume. Please try again.",
        variant: "destructive",
      });
    }

    setIsUploading(false);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Apply AI suggestions to experience section
  const handleApplyBulletPoint = (bulletPoint: string) => {
    if (activeSection === "experience" && resume.experience.length > 0) {
      // Apply to the most recent experience item
      const updatedExperience = [...resume.experience];
      const lastIndex = updatedExperience.length - 1;

      // Get the current description
      const currentDescription = updatedExperience[lastIndex].description;

      // Append the new bullet point if not empty
      const newDescription = currentDescription
        ? `${currentDescription}\n• ${bulletPoint}`
        : `• ${bulletPoint}`;

      updatedExperience[lastIndex] = {
        ...updatedExperience[lastIndex],
        description: newDescription,
      };

      setResume({
        ...resume,
        experience: updatedExperience,
      });

      toast({
        title: "Bullet point added",
        description:
          "AI-generated bullet point has been added to your experience.",
      });
    } else {
      // Create a new experience item with the bullet point
      const newExperience: ExperienceItem = {
        id: `exp-${Date.now()}`,
        title: "Position Title",
        company: "Company Name",
        startDate: "2022-01",
        endDate: "Present",
        description: `• ${bulletPoint}`,
      };

      setResume({
        ...resume,
        experience: [...resume.experience, newExperience],
      });

      // Switch to experience tab
      setActiveSection("experience");

      toast({
        title: "Experience added",
        description:
          "New experience with AI-generated bullet point has been added.",
      });
    }
  };

  // Apply AI summary to personal info
  const handleApplySummary = (summary: string) => {
    // Check if we already have content in the summary
    const currentSummary = resume.personalInfo.summary;

    // If the summary is empty, just use the suggestion
    // Otherwise, append the new suggestion with a space
    const newSummary = currentSummary
      ? `${currentSummary} ${summary}`
      : summary;

    updatePersonalInfo("summary", newSummary);

    toast({
      title: "Summary enhanced",
      description: "AI-generated content has been added to your summary.",
    });
  };

  // Apply AI skill to skills section
  const handleApplySkill = (skillName: string) => {
    // Check if skill already exists
    if (
      resume.skills.some(
        (skill) => skill.name.toLowerCase() === skillName.toLowerCase(),
      )
    ) {
      toast({
        title: "Skill already exists",
        description: `"${skillName}" is already in your skills list.`,
        variant: "destructive",
      });
      return;
    }

    const newSkill: SkillItem = {
      id: `skill-${Date.now()}`,
      name: skillName,
      proficiency: 3, // Default to medium proficiency
    };

    setResume({
      ...resume,
      skills: [...resume.skills, newSkill],
    });

    toast({
      title: "Skill added",
      description: `"${skillName}" has been added to your skills.`,
    });
  };

  // Handle file input click
  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen">
      <CosmicBackground />
      <Navbar />

      <main className="container mx-auto pt-12 pb-20 px-4">
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold cosmic-text-gradient mb-2">
              Resume Builder
            </h1>
            <p className="text-gray-300">
              Create a professional resume that passes ATS systems and gets you
              hired.
            </p>
          </div>

          <div className="flex space-x-3">
            {/* Load Saved Resume Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="border-white/10 bg-blue-600/40 text-white hover:bg-blue-600/60"
                >
                  <FolderOpen className="h-4 w-4 mr-2" />
                  <span>Load Resume</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-900/95 border border-gray-800">
                <DropdownMenuLabel className="text-gray-300">Your Saved Resumes</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                {Array.isArray(userResumes) && userResumes.length > 0 ? (
                  userResumes.map((savedResume: any) => (
                    <DropdownMenuItem
                      key={savedResume.id}
                      className="text-gray-300 hover:text-white cursor-pointer focus:text-white focus:bg-blue-700"
                      onClick={async () => {
                        try {
                          // Ensure we have a valid resume ID before using it
                          if (savedResume && typeof savedResume.id === 'number') {
                            console.log("Loading resume with ID:", savedResume.id);
                            
                            // Show loading toast
                            toast({
                              title: "Loading Resume",
                              description: `Loading ${savedResume.title || "Untitled Resume"}...`,
                            });
                            
                            // Directly fetch the resume data instead of relying on useQuery
                            try {
                              const response = await fetch(`/api/resumes/${savedResume.id}`);
                              
                              if (!response.ok) {
                                throw new Error(`Error fetching resume: ${response.status}`);
                              }
                              
                              const resumeData = await response.json();
                              console.log("Direct fetch resume data:", JSON.stringify(resumeData, null, 2));
                              
                              // The API returns resume data with a nested 'content' object
                              const content = resumeData.content || {};
                              console.log("Resume content extracted:", content);
                                
                              // Process the resume data
                              const completeResume = {
                                id: resumeData.id,
                                title: resumeData.title || "Untitled Resume",
                                personalInfo: {
                                  firstName: content.personalInfo?.firstName || "",
                                  lastName: content.personalInfo?.lastName || "",
                                  email: content.personalInfo?.email || "",
                                  phone: content.personalInfo?.phone || "",
                                  headline: content.personalInfo?.headline || "",
                                  summary: content.personalInfo?.summary || ""
                                },
                                experience: Array.isArray(content.experience) ? content.experience.map((exp: any) => ({
                                  ...exp,
                                  id: exp.id || crypto.randomUUID(),
                                })) : [],
                                education: Array.isArray(content.education) ? content.education.map((edu: any) => ({
                                  ...edu,
                                  id: edu.id || crypto.randomUUID(),
                                })) : [],
                                skills: Array.isArray(content.skills) ? content.skills.map((skill: any) => ({
                                  ...skill,
                                  id: skill.id || crypto.randomUUID(),
                                })) : [],
                                projects: Array.isArray(content.projects) ? content.projects.map((project: any) => ({
                                  ...project,
                                  id: project.id || crypto.randomUUID(),
                                })) : [],
                                template: resumeData.template || "professional"
                              };
                              
                              // Preserve the reference to the complete resume for later
                              const finalResumeData = {...completeResume};
                              
                              // Set the resume ID and update the UI state
                              setResumeId(savedResume.id);
                              setActiveSection("profile");
                              
                              // Force a complete state update by creating a brand new object
                              // We wrap this in setTimeout to ensure it runs after other state changes
                              setResume(finalResumeData as Resume);
                              
                              // Add a safety net: store the loaded resume in sessionStorage
                              // so we can recover if state gets lost
                              sessionStorage.setItem('loadedResumeData', JSON.stringify({
                                resumeData: finalResumeData,
                                timestamp: new Date().toISOString()
                              }));
                              
                              // Set a debug flag in local storage
                              localStorage.setItem('lastLoadedResume', JSON.stringify({
                                resumeId: completeResume.id,
                                firstName: completeResume.personalInfo.firstName,
                                lastName: completeResume.personalInfo.lastName,
                                timestamp: new Date().toISOString()
                              }));
                              
                              // Show success toast
                              toast({
                                title: "Resume Loaded Successfully",
                                description: `"${completeResume.title}" has been loaded with ${completeResume.experience.length} experiences, ${completeResume.skills.length} skills, and ${completeResume.education.length} education entries.`,
                              });
                              
                            } catch (fetchError) {
                              console.error("Error fetching resume data:", fetchError);
                              toast({
                                title: "Error Loading Resume",
                                description: "Failed to fetch resume data. Please try again.",
                                variant: "destructive",
                              });
                            }
                          } else {
                            console.error("Invalid resume ID:", savedResume);
                            toast({
                              title: "Error Loading Resume",
                              description: "Invalid resume ID. Please try again.",
                              variant: "destructive",
                            });
                          }
                        } catch (error) {
                          console.error("Error when loading resume:", error);
                          toast({
                            title: "Error Loading Resume",
                            description: "Failed to load the selected resume.",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      {savedResume.title}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled className="text-gray-500">
                    No saved resumes found
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <CosmicButton
              variant="primary"
              onClick={handleSaveResume}
              disabled={isSaving}
              isLoading={isSaving}
              loadingText="Saving..."
              iconLeft={!isSaving ? <Save /> : undefined}
            >
              Save Resume
            </CosmicButton>

            <CosmicButton
              variant="secondary"
              onClick={handleFileInputClick}
              disabled={isUploading}
              isLoading={isUploading}
              loadingText="Uploading..."
              iconLeft={!isUploading ? <Upload /> : undefined}
            >
              Upload Existing Resume
            </CosmicButton>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.docx,.txt"
              className="hidden"
            />
          </div>
        </div>

        {/* Main content area */}
        <div className="cosmic-card border border-white/10 rounded-xl shadow-lg backdrop-blur-md overflow-hidden">
          {/* Horizontal Tab Navigation */}
          <div className="relative">
            <div className="bg-gradient-to-r from-blue-900/80 to-purple-900/80 rounded-t-xl px-6 py-4 border-b border-white/10">
              <Tabs
                value={activeSection}
                onValueChange={setActiveSection}
                className="w-full cosmic-tabs"
              >
                <TabsList className="bg-transparent w-full justify-start mb-1 p-0 space-x-1">
                  <TabsTrigger
                    value="profile"
                    className={`${
                      activeSection === "profile"
                        ? "bg-blue-600/50 text-white border-b-2 border-blue-400"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    } font-medium transition-all duration-200`}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    PROFILE
                  </TabsTrigger>
                  <TabsTrigger
                    value="experience"
                    className={`${
                      activeSection === "experience"
                        ? "bg-blue-600/50 text-white border-b-2 border-blue-400"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    } font-medium transition-all duration-200`}
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    EXPERIENCE
                  </TabsTrigger>
                  <TabsTrigger
                    value="education"
                    className={`${
                      activeSection === "education"
                        ? "bg-blue-600/50 text-white border-b-2 border-blue-400"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    } font-medium transition-all duration-200`}
                  >
                    <GraduationCap className="h-4 w-4 mr-2" />
                    EDUCATION
                  </TabsTrigger>
                  <TabsTrigger
                    value="skills"
                    className={`${
                      activeSection === "skills"
                        ? "bg-blue-600/50 text-white border-b-2 border-blue-400"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    } font-medium transition-all duration-200`}
                  >
                    <Code className="h-4 w-4 mr-2" />
                    SKILLS
                  </TabsTrigger>
                  <TabsTrigger
                    value="projects"
                    className={`${
                      activeSection === "projects"
                        ? "bg-blue-600/50 text-white border-b-2 border-blue-400"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    } font-medium transition-all duration-200`}
                  >
                    <FolderKanban className="h-4 w-4 mr-2" />
                    PROJECTS
                  </TabsTrigger>
                  <TabsTrigger
                    value="preview"
                    className={`${
                      activeSection === "preview"
                        ? "bg-blue-600/50 text-white border-b-2 border-blue-400"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    } font-medium transition-all duration-200`}
                  >
                    <Maximize2 className="h-4 w-4 mr-2" />
                    PREVIEW
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Profile Section */}
              {activeSection === "profile" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Tailored Resume Banner - show briefly when coming from job details */}
                  {isTailoredResume && (
                    <div className="md:col-span-3 mb-4">
                      <div className="cosmic-card border border-green-500/30 bg-green-900/20 p-4 rounded-lg relative overflow-hidden backdrop-blur-sm">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10">
                          <div className="flex items-center mb-2">
                            <Sparkles className="h-5 w-5 mr-2 text-green-400" />
                            <h3 className="font-medium text-xl text-white">
                              Job-Tailored Resume
                            </h3>
                          </div>
                          <p className="text-gray-300 mb-2">
                            Your resume is being updated with tailored content
                            optimized for the job description. Review each
                            section and make any additional adjustments before
                            saving.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Welcome Banner - only show when resume is empty */}
                  {!resume?.personalInfo?.firstName &&
                    !resume?.personalInfo?.lastName && (
                      <div className="md:col-span-3 mb-4">
                        <div className="cosmic-card border border-blue-500/30 bg-blue-900/20 p-6 rounded-lg relative overflow-hidden backdrop-blur-sm">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                          <div className="relative z-10">
                            <div className="flex items-center mb-3">
                              <Upload className="h-5 w-5 mr-2 text-blue-400" />
                              <h3 className="font-medium text-xl text-white">
                                Upload Your Existing Resume
                              </h3>
                            </div>
                            <p className="text-gray-300 mb-4">
                              Skip manual entry by uploading your existing
                              resume. Our AI will automatically extract your
                              information and fill out this form for you.
                            </p>
                            <div className="flex flex-wrap gap-3">
                              <CosmicButton
                                variant="primary"
                                onClick={handleFileInputClick}
                                iconLeft={<Upload />}
                              >
                                Upload PDF, DOCX, or TXT
                              </CosmicButton>
                              <p className="text-sm text-gray-400 flex items-center">
                                <span className="mr-1">or</span> fill out the
                                form manually below
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
                        <User className="h-5 w-5 mr-2 text-blue-400" />
                        Personal Information
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName" className="text-gray-300">
                            First Name
                          </Label>
                          <Input
                            id="firstName"
                            value={resume?.personalInfo?.firstName || ""}
                            onChange={(e) =>
                              updatePersonalInfo("firstName", e.target.value)
                            }
                            className="mt-1 bg-black/60 border-white/10 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="text-gray-300">
                            Last Name
                          </Label>
                          <Input
                            id="lastName"
                            value={resume?.personalInfo?.lastName || ""}
                            onChange={(e) =>
                              updatePersonalInfo("lastName", e.target.value)
                            }
                            className="mt-1 bg-black/60 border-white/10 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-gray-300">
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={resume?.personalInfo?.email || ""}
                            onChange={(e) =>
                              updatePersonalInfo("email", e.target.value)
                            }
                            className="mt-1 bg-black/60 border-white/10 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-gray-300">
                            Phone
                          </Label>
                          <Input
                            id="phone"
                            value={resume?.personalInfo?.phone || ""}
                            onChange={(e) =>
                              updatePersonalInfo("phone", e.target.value)
                            }
                            className="mt-1 bg-black/60 border-white/10 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="headline" className="text-gray-300">
                        Professional Headline
                      </Label>
                      <Input
                        id="headline"
                        value={resume?.personalInfo?.headline || ""}
                        onChange={(e) =>
                          updatePersonalInfo("headline", e.target.value)
                        }
                        className="mt-1 bg-black/60 border-white/10 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="e.g., Senior Software Engineer | Front-End Specialist | React & TypeScript Expert"
                      />
                    </div>

                    <div>
                      <Label htmlFor="summary" className="text-gray-300">
                        Professional Summary
                      </Label>
                      <Textarea
                        id="summary"
                        value={resume?.personalInfo?.summary || ""}
                        onChange={(e) =>
                          updatePersonalInfo("summary", e.target.value)
                        }
                        className="mt-1 min-h-32 bg-black/60 border-white/10 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Write a concise summary of your professional background, key skills, and career achievements."
                      />
                      <div className="mt-2 text-xs text-gray-300 bg-white/5 p-3 rounded-lg">
                        <p className="mb-2 text-blue-300 font-medium">
                          Tips for a great summary:
                        </p>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>Keep it concise (3-5 sentences)</li>
                          <li>Highlight your most relevant experience</li>
                          <li>
                            Focus on achievements rather than responsibilities
                          </li>
                          <li>
                            Include keywords relevant to your target position
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* AI Tips Section */}
                  <div className="md:col-span-1">
                    <div className="cosmic-card border border-white/10 bg-black/40 p-5 rounded-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                      <div className="relative z-10">
                        <div className="flex items-center mb-4">
                          <Cpu className="h-5 w-5 mr-2 text-blue-400 animate-pulse" />
                          <h3 className="font-medium text-white">
                            AI Resume Assistant
                          </h3>
                        </div>

                        <div className="w-full">
                          <ResumeTips
                            resumeId={resumeId}
                            onApplySuggestion={(suggestion) => {
                              // Check if we already have content in the summary
                              const currentSummary =
                                resume?.personalInfo?.summary || "";

                              // If the summary is empty, just use the suggestion
                              // Otherwise, append the new suggestion with a space
                              const newSummary = currentSummary
                                ? `${currentSummary} ${suggestion}`
                                : suggestion;

                              setResume({
                                ...resume,
                                personalInfo: {
                                  ...resume.personalInfo,
                                  summary: newSummary,
                                },
                              });

                              toast({
                                title: "Summary Enhanced",
                                description:
                                  "AI-generated content has been added to your summary.",
                              });
                            }}
                            suggestionType="summary"
                            multiSelect={true}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Experience Section */}
              {activeSection === "experience" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-white flex items-center">
                        <Briefcase className="h-5 w-5 mr-2 text-blue-400" />
                        Work Experience
                      </h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newExperience: ExperienceItem = {
                            id: `exp-${Date.now()}`,
                            title: "Position Title",
                            company: "Company Name",
                            startDate: "",
                            endDate: "",
                            description: "",
                          };

                          setResume({
                            ...resume,
                            experience: [...(resume?.experience || []), newExperience],
                          });
                        }}
                        className="flex items-center space-x-1 border-white/10 text-blue-400 hover:bg-white/10 hover:text-white"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Experience</span>
                      </Button>
                    </div>

                    <ResumeExperienceSection
                      experiences={resume?.experience || []}
                      onUpdate={(experiences) => {
                        setResume({
                          ...resume,
                          experience: experiences,
                        });
                      }}
                    />
                  </div>

                  {/* Tips for Experience */}
                  <div className="md:col-span-1">
                    <div className="cosmic-card border border-white/10 bg-black/40 p-5 rounded-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                      <div className="relative z-10">
                        <div className="flex items-center mb-4">
                          <Cpu className="h-5 w-5 mr-2 text-blue-400 animate-pulse" />
                          <h3 className="font-medium text-white">
                            AI Experience Assistant
                          </h3>
                        </div>

                        <div className="w-full">
                          <ResumeTips
                            resumeId={resumeId}
                            onApplySuggestion={(bulletPoint) => {
                              if (resume?.experience?.length > 0) {
                                // Apply to the most recent experience item
                                const updatedExperience = [
                                  ...resume.experience,
                                ];
                                const lastIndex = updatedExperience.length - 1;

                                // Get the current description
                                const currentDescription =
                                  updatedExperience[lastIndex].description;

                                // Append the new bullet point if not empty
                                const newDescription = currentDescription
                                  ? `${currentDescription}\n• ${bulletPoint}`
                                  : `• ${bulletPoint}`;

                                updatedExperience[lastIndex] = {
                                  ...updatedExperience[lastIndex],
                                  description: newDescription,
                                };

                                setResume({
                                  ...resume,
                                  experience: updatedExperience,
                                });
                              }
                              toast({
                                title: "Bullet point added",
                                description:
                                  "AI-generated bullet point has been added to your experience.",
                              });
                            }}
                            suggestionType="bullet"
                            multiSelect={true}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Education Section */}
              {activeSection === "education" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2 text-blue-400" />
                      Education
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newEducation: EducationItem = {
                          id: `edu-${Date.now()}`,
                          degree: "Degree Name",
                          institution: "Institution Name",
                          startDate: "",
                          endDate: "",
                          description: "",
                        };

                        setResume({
                          ...resume,
                          education: [...(resume?.education || []), newEducation],
                        });
                      }}
                      className="flex items-center space-x-1 border-white/10 text-blue-400 hover:bg-white/10 hover:text-white"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Education</span>
                    </Button>
                  </div>

                  <ResumeEducationSection
                    education={resume?.education || []}
                    onUpdate={(education) => {
                      setResume({
                        ...resume,
                        education,
                      });
                    }}
                  />
                </div>
              )}

              {/* Skills Section */}
              {activeSection === "skills" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-white flex items-center">
                        <Code className="h-5 w-5 mr-2 text-blue-400" />
                        Skills
                      </h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newSkill: SkillItem = {
                            id: `skill-${Date.now()}`,
                            name: "New Skill",
                            proficiency: 3,
                          };

                          setResume({
                            ...resume,
                            skills: [...(resume?.skills || []), newSkill],
                          });
                        }}
                        className="flex items-center space-x-1 border-white/10 text-blue-400 hover:bg-white/10 hover:text-white"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Skill</span>
                      </Button>
                    </div>

                    <ResumeSkillsSection
                      skills={resume?.skills || []}
                      onUpdate={(skills) => {
                        setResume({
                          ...resume,
                          skills,
                        });
                      }}
                    />

                    <div className="mt-2 text-xs text-gray-300 bg-white/5 p-3 rounded-lg">
                      <p className="mb-2 text-blue-300 font-medium">
                        Tips for showcasing skills:
                      </p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Include a mix of technical and soft skills</li>
                        <li>Prioritize skills mentioned in job descriptions</li>
                        <li>Be honest about your proficiency levels</li>
                        <li>Group similar skills together</li>
                      </ul>
                    </div>
                  </div>

                  {/* Tips for Skills */}
                  <div className="md:col-span-1">
                    <div className="cosmic-card border border-white/10 bg-black/40 p-5 rounded-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                      <div className="relative z-10">
                        <div className="flex items-center mb-4">
                          <Cpu className="h-5 w-5 mr-2 text-blue-400 animate-pulse" />
                          <h3 className="font-medium text-white">
                            AI Skills Assistant
                          </h3>
                        </div>

                        <div className="w-full">
                          <ResumeTips
                            resumeId={resumeId}
                            onApplySuggestion={(skill) => {
                              if (
                                !resume?.skills?.some(
                                  (s) =>
                                    s.name.toLowerCase() ===
                                    skill.toLowerCase(),
                                )
                              ) {
                                const newSkill = {
                                  id: `skill-${Date.now()}`,
                                  name: skill,
                                  proficiency: 3,
                                };

                                setResume({
                                  ...resume,
                                  skills: [...(resume?.skills || []), newSkill],
                                });

                                toast({
                                  title: "Skill added",
                                  description: `"${skill}" has been added to your skills.`,
                                });
                              } else {
                                toast({
                                  title: "Skill already exists",
                                  description: `"${skill}" is already in your skills list.`,
                                  variant: "destructive",
                                });
                              }
                            }}
                            suggestionType="skill"
                            multiSelect={true}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Projects Section */}
              {activeSection === "projects" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white flex items-center">
                      <FolderKanban className="h-5 w-5 mr-2 text-blue-400" />
                      Projects
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newProject: ProjectItem = {
                          id: `proj-${Date.now()}`,
                          title: "Project Name",
                          description: "",
                          technologies: [],
                        };

                        setResume({
                          ...resume,
                          projects: [...(resume?.projects || []), newProject],
                        });
                      }}
                      className="flex items-center space-x-1 border-white/10 text-blue-400 hover:bg-white/10 hover:text-white"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Project</span>
                    </Button>
                  </div>

                  <ResumeProjectsSection
                    projects={resume?.projects || []}
                    onUpdate={(projects) => {
                      setResume({
                        ...resume,
                        projects,
                      });
                    }}
                  />
                </div>
              )}

              {/* Preview Section */}
              {activeSection === "preview" && (
                <div className="text-white">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-white flex items-center">
                      <Maximize2 className="h-5 w-5 mr-2 text-blue-400" />
                      Resume Preview
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-400 hover:bg-white/10 hover:text-white border border-white/10"
                      onClick={() => window.print()}
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Print/Save PDF
                    </Button>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 shadow-xl">
                    <ResumePreviewComponent
                      resume={resume || {
                        title: "My Professional Resume",
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
                        template: "professional",
                      }}
                      onTemplateChange={handleTemplateChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Floating AI Assistant Button */}
      <div className="fixed bottom-6 right-6 z-50 group">
        <div className="absolute -inset-0.5 rounded-full bg-blue-500 opacity-75 blur-sm group-hover:opacity-100 transition duration-300 animate-pulse"></div>
        <Button
          onClick={() => setIsDialogOpen(!isDialogOpen)}
          className="relative h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 p-0 shadow-lg group-hover:scale-105 transition duration-300"
          aria-label="Open AI Assistant"
        >
          <div className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-40"></div>
          <Sparkles className="h-5 w-5 text-white" />
        </Button>
        <span className="absolute top-0 right-16 bg-black/80 text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          AI Assistant
        </span>
      </div>

      {/* AI Assistant Chat Box */}
      {isDialogOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-full shadow-xl rounded-lg overflow-hidden transition-all duration-300 ease-in-out">
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-3 flex justify-between items-center border-b border-blue-500/30">
            <div className="flex items-center">
              <Cpu className="h-5 w-5 text-blue-300 mr-2" />
              <h3 className="text-white font-medium">AI Resume Assistant</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDialogOpen(false)}
              className="h-8 w-8 rounded-full hover:bg-white/10"
            >
              <X className="h-4 w-4 text-white" />
            </Button>
          </div>
          <div className="bg-black/90 border-x border-blue-500/30 border-b p-4 h-96 overflow-y-auto">
            <AIAssistant
              resumeId={resumeId?.toString()}
              onApplySummary={handleApplySummary}
              onApplyBulletPoint={handleApplyBulletPoint}
              onApplySkill={handleApplySkill}
              resume={resume || {
                title: "My Professional Resume",
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
                template: "professional",
              }}
              activeTab={activeSection || 'contact'}
            />
          </div>
        </div>
      )}
    </div>
  );
}
