import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar";
import ResumeTemplate, { 
  ProfessionalTemplate, 
  CreativeTemplate, 
  ExecutiveTemplate,
  ModernTemplate,
  MinimalTemplate,
  IndustryTemplate,
  BoldTemplate
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
import { 
  FileText, 
  GraduationCap, 
  Briefcase, 
  Code, 
  Award, 
  FolderKanban,
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

import AIAssistant from "@/components/ai-assistant";

// Component for professional summary AI suggestions
interface SummarySuggestionsProps {
  resumeId: string;
  onApply: (summary: string) => void;
}

type SummaryLength = 'short' | 'medium' | 'long';

function SummarySuggestions({ resumeId, onApply }: SummarySuggestionsProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [summaries, setSummaries] = useState<string[]>([]);
  const [lastUsedLength, setLastUsedLength] = useState<SummaryLength>('medium');
  const [generationCount, setGenerationCount] = useState(0);
  const [refreshCount, setRefreshCount] = useState<Record<SummaryLength, number>>({
    short: 0,
    medium: 0,
    long: 0
  });
  
  // Generate AI summaries with length option
  const handleGenerateSummaries = async (length: SummaryLength = 'medium') => {
    setIsGenerating(true);
    
    // Reset refresh count if changing length type
    if (lastUsedLength !== length) {
      setLastUsedLength(length);
      setGenerationCount(prev => prev + 1);
      setRefreshCount(prev => ({...prev, [length]: 0}));
    } else {
      // Increment refresh count for this length type
      const newRefreshCount = refreshCount[length] + 1;
      
      // Only allow up to 5 refreshes per length type
      if (newRefreshCount <= 5) {
        setRefreshCount(prev => ({...prev, [length]: newRefreshCount}));
        setGenerationCount(prev => prev + 1);
      } else {
        toast({
          title: "Refresh limit reached",
          description: "You've reached the maximum number of refreshes. Try a different length option.",
          variant: "default",
        });
        setIsGenerating(false);
        return;
      }
    }
    
    // Generate sample summaries based on resume content
    const getFallbackSummaries = (length: SummaryLength) => {
      // Short summaries
      if (length === 'short') {
        return [
          "Skilled professional with a proven track record in delivering high-impact solutions.",
          "Results-oriented professional with expertise in strategic planning and execution.",
          "Dynamic professional with strong technical and communication skills."
        ];
      }
      // Long summaries
      else if (length === 'long') {
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
    };
    
    // If we have a valid resumeId (not "new" and not null), try to get AI suggestions
    if (resumeId && resumeId !== "new") {
      try {
        // Use the summaryOnly parameter to get complete summary rewrites
        // Add length parameter and randomSeed to ensure we get different results each time
        const res = await apiRequest("GET", `/api/resumes/${resumeId}/suggestions?summaryOnly=true&length=${length}&seed=${generationCount}`);
        const data = await res.json();
        
        if (data.success && data.suggestions && Array.isArray(data.suggestions)) {
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
            <h4 className="text-sm font-medium text-blue-300 mb-2">Choose Summary Length</h4>
            <div className="flex space-x-2 mb-4">
              <Button
                onClick={() => handleGenerateSummaries('short')}
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="flex-1 border-blue-500/30 text-blue-200 hover:bg-blue-900/30 hover:text-blue-100"
              >
                Short
              </Button>
              <Button
                onClick={() => handleGenerateSummaries('medium')}
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="flex-1 border-blue-500/30 text-blue-200 hover:bg-blue-900/30 hover:text-blue-100"
              >
                Medium
              </Button>
              <Button
                onClick={() => handleGenerateSummaries('long')}
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
            onClick={() => handleGenerateSummaries('medium')}
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
              onClick={() => handleGenerateSummaries('short')}
              variant="ghost" 
              size="sm"
              className="flex-1 items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Short
            </Button>
            <Button
              onClick={() => handleGenerateSummaries('medium')}
              variant="ghost"
              size="sm"
              className="flex-1 items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Medium
            </Button>
            <Button
              onClick={() => handleGenerateSummaries('long')}
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

type BulletLength = 'short' | 'medium' | 'long';

function ExperienceSuggestions({ resumeId, jobTitle, onApply }: ExperienceSuggestionsProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [bulletPoints, setBulletPoints] = useState<string[]>([]);
  const [lastUsedLength, setLastUsedLength] = useState<BulletLength>('medium');
  const [generationCount, setGenerationCount] = useState(0);
  const [refreshCount, setRefreshCount] = useState<Record<BulletLength, number>>({
    short: 0,
    medium: 0,
    long: 0
  });
  
  // Generate AI bullet points for experience section with length options
  const handleGenerateBulletPoints = async (length: BulletLength = 'medium') => {
    setIsGenerating(true);
    
    // Reset refresh count if changing length type
    if (lastUsedLength !== length) {
      setLastUsedLength(length);
      setGenerationCount(prev => prev + 1);
      setRefreshCount(prev => ({...prev, [length]: 0}));
    } else {
      // Increment refresh count for this length type
      const newRefreshCount = refreshCount[length] + 1;
      
      // Only allow up to 5 refreshes per length type
      if (newRefreshCount <= 5) {
        setRefreshCount(prev => ({...prev, [length]: newRefreshCount}));
        setGenerationCount(prev => prev + 1);
      } else {
        toast({
          title: "Refresh limit reached",
          description: "You've reached the maximum number of refreshes. Try a different style option.",
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
      if (length === 'short') {
        return [
          `Improved ${jobTitle_safe} processes by 30%.`,
          `Led cross-functional teams to deliver key projects.`,
          `Reduced costs by 25% through strategic optimization.`,
          `Increased customer satisfaction scores to 95%.`,
          `Implemented innovative solutions with measurable results.`
        ];
      }
      // Long bullet points
      else if (length === 'long') {
        return [
          `Spearheaded a comprehensive overhaul of ${jobTitle_safe} processes, resulting in a 30% increase in operational efficiency while simultaneously reducing implementation costs by $150,000 annually and improving team morale through more streamlined workflows.`,
          `Led cross-functional team of 12 professionals in the successful delivery of 5 high-priority projects valued at $2.3M collectively, consistently meeting or exceeding stakeholder expectations while maintaining budget constraints and aggressive timeline requirements.`,
          `Implemented innovative ${jobTitle_safe} solutions that dramatically improved data processing capabilities by 45%, resulting in faster decision-making processes and enabling the business to respond more effectively to rapidly changing market conditions.`,
          `Developed and executed strategic initiatives that increased departmental productivity by 37% within the first quarter, recognized by senior leadership for exceptional performance and promoted to lead advanced projects with greater scope and complexity.`,
          `Redesigned critical ${jobTitle_safe} infrastructure, resulting in 99.9% uptime, a 28% reduction in maintenance costs, and significantly enhanced user experience as measured by a 40-point improvement in Net Promoter Score.`
        ];
      }
      // Medium bullet points (default)
      else {
        return [
          `Implemented innovative solutions for ${jobTitle_safe} role, resulting in 35% efficiency improvement and $120K annual savings.`,
          `Led key projects as ${jobTitle_safe}, delivering results ahead of schedule and under budget while maintaining high quality standards.`,
          `Collaborated with cross-functional teams to enhance ${jobTitle_safe}-related processes, improving workflow efficiency by 28%.`,
          `Increased performance metrics by 40% through optimization of processes and implementation of best practices in the ${jobTitle_safe} department.`,
          `Developed and implemented testing protocols that reduced time by 25% while improving quality outcomes and customer satisfaction.`
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
        
        if (data.success && data.suggestions && Array.isArray(data.suggestions)) {
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
            <h4 className="text-sm font-medium text-blue-300 mb-2">Choose Bullet Point Style</h4>
            <div className="flex space-x-2 mb-4">
              <Button
                onClick={() => handleGenerateBulletPoints('short')}
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="flex-1 border-blue-500/30 text-blue-200 hover:bg-blue-900/30 hover:text-blue-100"
              >
                Concise
              </Button>
              <Button
                onClick={() => handleGenerateBulletPoints('medium')}
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="flex-1 border-blue-500/30 text-blue-200 hover:bg-blue-900/30 hover:text-blue-100"
              >
                Standard
              </Button>
              <Button
                onClick={() => handleGenerateBulletPoints('long')}
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
            onClick={() => handleGenerateBulletPoints('medium')}
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
            Creates achievement-focused bullet points with keywords that ATS systems scan for
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
              onClick={() => handleGenerateBulletPoints('short')}
              variant="ghost" 
              size="sm"
              className="flex-1 items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Concise
            </Button>
            <Button
              onClick={() => handleGenerateBulletPoints('medium')}
              variant="ghost"
              size="sm"
              className="flex-1 items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Standard
            </Button>
            <Button
              onClick={() => handleGenerateBulletPoints('long')}
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

type SkillsCategory = 'technical' | 'soft' | 'industry';

function SkillSuggestions({ resumeId, jobTitle, onApply }: SkillSuggestionsProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [lastUsedCategory, setLastUsedCategory] = useState<SkillsCategory>('technical');
  const [generationCount, setGenerationCount] = useState(0);
  const [refreshCount, setRefreshCount] = useState<Record<SkillsCategory, number>>({
    technical: 0,
    soft: 0,
    industry: 0
  });
  
  // Generate AI skill suggestions with category options
  const handleGenerateSkills = async (category: SkillsCategory = 'technical') => {
    setIsGenerating(true);
    
    // Reset refresh count if changing category type
    if (lastUsedCategory !== category) {
      setLastUsedCategory(category);
      setGenerationCount(prev => prev + 1);
      setRefreshCount(prev => ({...prev, [category]: 0}));
    } else {
      // Increment refresh count for this category
      const newRefreshCount = refreshCount[category] + 1;
      
      // Only allow up to 5 refreshes per category
      if (newRefreshCount <= 5) {
        setRefreshCount(prev => ({...prev, [category]: newRefreshCount}));
        setGenerationCount(prev => prev + 1);
      } else {
        toast({
          title: "Refresh limit reached",
          description: "You've reached the maximum number of refreshes. Try a different skill category.",
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
      if (category === 'technical') {
        if (jobTitle_safe.toLowerCase().includes("developer") || 
            jobTitle_safe.toLowerCase().includes("engineer")) {
          return [
            "JavaScript", "React", "Node.js", "TypeScript", "GraphQL", 
            "AWS", "Docker", "CI/CD", "Git", "Agile Methodologies",
            "Python", "RESTful APIs", "SQL", "NoSQL", "Cloud Architecture"
          ];
        } else if (jobTitle_safe.toLowerCase().includes("design")) {
          return [
            "UI/UX Design", "Figma", "Adobe Creative Suite", "Wireframing", 
            "Prototyping", "User Research", "Design Systems", "Typography",
            "Responsive Design", "Design Thinking", "Information Architecture"
          ];
        } else {
          return [
            "Microsoft Office", "SQL", "Database Management", "CRM Systems",
            "Business Intelligence", "Data Analysis", "Project Management Software",
            "ERP Systems", "Cloud Computing", "Digital Marketing Tools"
          ];
        }
      }
      // Soft skills
      else if (category === 'soft') {
        return [
          "Communication", "Leadership", "Problem Solving", "Critical Thinking",
          "Teamwork", "Adaptability", "Time Management", "Emotional Intelligence", 
          "Conflict Resolution", "Creativity", "Decision Making", "Active Listening"
        ];
      }
      // Industry-specific skills
      else {
        if (jobTitle_safe.toLowerCase().includes("developer") || 
            jobTitle_safe.toLowerCase().includes("engineer")) {
          return [
            "Machine Learning", "Blockchain", "AR/VR Development", "IoT",
            "Cybersecurity", "DevOps", "Microservices", "Serverless Architecture",
            "API Gateway", "Kubernetes", "Containerization"
          ];
        } else if (jobTitle_safe.toLowerCase().includes("design")) {
          return [
            "Motion Graphics", "Augmented Reality Design", "Interaction Design",
            "Design Strategy", "Accessibility", "Brand Strategy", "Visual Identity",
            "UX Writing", "Product Design", "Design Sprints"
          ];
        } else if (jobTitle_safe.toLowerCase().includes("manager")) {
          return [
            "Agile Management", "Strategic Planning", "Stakeholder Management",
            "KPI Development", "Operational Excellence", "Change Management",
            "Risk Management", "Vendor Management", "Budget Forecasting"
          ];
        } else {
          return [
            "Industry Standards", "Regulatory Compliance", "Market Analysis",
            "Forecasting", "Process Optimization", "Quality Assurance",
            "Benchmarking", "Continuous Improvement", "Six Sigma"
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
        
        if (data.success && data.suggestions && Array.isArray(data.suggestions)) {
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
            <h4 className="text-sm font-medium text-blue-300 mb-2">Choose Skill Categories</h4>
            <div className="flex space-x-2 mb-4">
              <Button
                onClick={() => handleGenerateSkills('technical')}
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="flex-1 border-blue-500/30 text-blue-200 hover:bg-blue-900/30 hover:text-blue-100"
              >
                Technical
              </Button>
              <Button
                onClick={() => handleGenerateSkills('soft')}
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="flex-1 border-blue-500/30 text-blue-200 hover:bg-blue-900/30 hover:text-blue-100"
              >
                Soft Skills
              </Button>
              <Button
                onClick={() => handleGenerateSkills('industry')}
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
            onClick={() => handleGenerateSkills('technical')}
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
            Suggests skills that align with your experience and are frequently scanned by ATS systems
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
              onClick={() => handleGenerateSkills('technical')}
              variant="ghost" 
              size="sm"
              className="flex-1 items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Technical
            </Button>
            <Button
              onClick={() => handleGenerateSkills('soft')}
              variant="ghost"
              size="sm"
              className="flex-1 items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Soft Skills
            </Button>
            <Button
              onClick={() => handleGenerateSkills('industry')}
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

// Preview component for the "Preview" section
function ResumePreview({ resume }: { resume: Resume }) {
  const [scale, setScale] = useState(1);
  
  // Function to download the resume
  const downloadResume = () => {
    window.print(); // Simplified for demo; replace with actual PDF generation in production
  };
  
  // Get the appropriate template component based on resume.template
  const TemplateComponent = 
    resume.template === "creative" ? CreativeTemplate :
    resume.template === "executive" ? ExecutiveTemplate :
    resume.template === "modern" ? ModernTemplate :
    resume.template === "minimal" ? MinimalTemplate :
    resume.template === "industry" ? IndustryTemplate :
    resume.template === "bold" ? BoldTemplate :
    ProfessionalTemplate; // Default to professional
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-secondary-900">Resume Preview</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setScale(Math.max(0.5, scale - 0.1))}
            disabled={scale <= 0.5}
            className="flex items-center"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="flex items-center text-sm px-2">{Math.round(scale * 100)}%</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setScale(Math.min(1.5, scale + 0.1))}
            disabled={scale >= 1.5}
            className="flex items-center"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={downloadResume}
            className="flex items-center gap-1 ml-2"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>
      
      <div className="bg-white border border-secondary-200 rounded-lg overflow-hidden shadow-lg p-8">
        <div 
          className="transition-all duration-300 origin-top"
          style={{ transform: `scale(${scale})` }}
        >
          <TemplateComponent resume={resume} />
        </div>
      </div>
      
      {/* Template selection */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Choose a Template</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Template options would go here */}
        </div>
      </div>
    </div>
  );
}

export default function ResumeBuilder() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useState(() => new URLSearchParams(window.location.search));
  
  const [resumeSaved, setResumeSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("profile");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [isTailoredResume, setIsTailoredResume] = useState<boolean>(
    searchParams.get('tailored') === 'true'
  );

  
  // Initial resume state
  const [resume, setResume] = useState<Resume>({
    title: "My Professional Resume",
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      headline: "",
      summary: ""
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    template: "professional"
  });
  
  // Fetch resume data if resumeId exists
  const { data: fetchedResume } = useQuery({
    queryKey: ["/api/resumes", resumeId],
    enabled: !!resumeId
  });
  
  // Use useEffect to handle the data instead of onSuccess
  useEffect(() => {
    if (fetchedResume) {
      setResume(fetchedResume as Resume);
    }
  }, [fetchedResume]);
  
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
        const hasExistingData = resume.personalInfo.firstName || 
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
              summary: parsedData.personalInfo?.summary || currentResume.personalInfo.summary
            },
            // Replace experience and skills completely with tailored content
            experience: parsedData.experience || currentResume.experience,
            skills: parsedData.skills || currentResume.skills
          }));
          
          toast({
            title: "Resume Updated",
            description: "Your resume has been updated with job-specific tailored content.",
          });
        } else {
          // Create a new resume with the tailored content
          setResume((currentResume) => ({
            ...currentResume,
            personalInfo: {
              ...currentResume.personalInfo,
              ...parsedData.personalInfo
            },
            experience: parsedData.experience || [],
            skills: parsedData.skills || []
          }));
          
          toast({
            title: "Tailored Resume Created",
            description: "A new resume has been created with job-specific content.",
          });
        }
        
        // Clear the localStorage data to prevent reapplying
        localStorage.removeItem("tailoredResume");
        
        // Remove the tailored parameter from URL
        window.history.replaceState(null, '', window.location.pathname);
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
  
  // Save resume mutation
  const saveResumeMutation = useMutation({
    mutationFn: async (resumeData: Resume) => {
      if (resumeId) {
        const res = await apiRequest("PATCH", `/api/resumes/${resumeId}`, resumeData);
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
    },
    onError: (error) => {
      console.error("Error saving resume:", error);
      toast({
        title: "Error saving resume",
        description: "There was an error saving your resume. Please try again.",
        variant: "destructive",
      });
    }
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
        [field]: value
      }
    });
  };
  
  // Template change handler
  const handleTemplateChange = (template: string) => {
    setResume({
      ...resume,
      template
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
            ...parsedData.data.personalInfo
          },
          experience: parsedData.data.experience || [],
          education: parsedData.data.education || [],
          skills: parsedData.data.skills || []
        });
        
        toast({
          title: "Resume uploaded",
          description: "Your resume has been parsed successfully.",
        });
      } else {
        toast({
          title: "Error parsing resume",
          description: parsedData.error || "There was an error parsing your resume.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast({
        title: "Error uploading resume",
        description: "There was an error uploading your resume. Please try again.",
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
      
      updatedExperience[lastIndex] = {
        ...updatedExperience[lastIndex],
        description: bulletPoint
      };
      
      setResume({
        ...resume,
        experience: updatedExperience
      });
      
      toast({
        title: "Bullet point applied",
        description: "AI-generated bullet point has been applied to your experience.",
      });
    } else {
      // Create a new experience item with the bullet point
      const newExperience: ExperienceItem = {
        id: `exp-${Date.now()}`,
        title: "Position Title",
        company: "Company Name",
        startDate: "2022-01",
        endDate: "Present",
        description: bulletPoint
      };
      
      setResume({
        ...resume,
        experience: [...resume.experience, newExperience]
      });
      
      // Switch to experience tab
      setActiveSection("experience");
      
      toast({
        title: "Experience added",
        description: "New experience with AI-generated bullet point has been added.",
      });
    }
  };
  
  // Apply AI summary to personal info
  const handleApplySummary = (summary: string) => {
    updatePersonalInfo("summary", summary);
    
    toast({
      title: "Summary applied",
      description: "AI-generated summary has been applied to your resume.",
    });
  };
  
  // Apply AI skill to skills section
  const handleApplySkill = (skillName: string) => {
    // Check if skill already exists
    if (resume.skills.some(skill => skill.name.toLowerCase() === skillName.toLowerCase())) {
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
      proficiency: 3 // Default to medium proficiency
    };
    
    setResume({
      ...resume,
      skills: [...resume.skills, newSkill]
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
    <div className="min-h-screen bg-black cosmic-background">
      <Navbar />
      
      {/* AI Assistant Floating Chatbot */}
      <AIAssistant 
        resumeId={resumeId?.toString()}
        onApplySummary={handleApplySummary}
        onApplyBulletPoint={handleApplyBulletPoint}
        onApplySkill={handleApplySkill}
        resume={resume}
        activeTab={activeSection}
      />
      
      <main className="container mx-auto pt-24 pb-20 px-4">
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold cosmic-text-gradient mb-2">Resume Builder</h1>
            <p className="text-gray-300">
              Create a professional resume that passes ATS systems and gets you hired.
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button
              onClick={handleSaveResume}
              disabled={isSaving}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Resume</span>
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleFileInputClick}
              disabled={isUploading}
              className="flex items-center space-x-2 border-white/10 bg-blue-600/40 text-white hover:bg-blue-600/60"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 text-white" />
                  <span>Upload Existing Resume</span>
                </>
              )}
            </Button>
            
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
                    className={`${activeSection === "profile" 
                      ? "bg-blue-600/50 text-white border-b-2 border-blue-400" 
                      : "text-gray-300 hover:text-white hover:bg-white/5"} font-medium transition-all duration-200`}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    PROFILE
                  </TabsTrigger>
                  <TabsTrigger 
                    value="experience" 
                    className={`${activeSection === "experience" 
                      ? "bg-blue-600/50 text-white border-b-2 border-blue-400" 
                      : "text-gray-300 hover:text-white hover:bg-white/5"} font-medium transition-all duration-200`}
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    EXPERIENCE
                  </TabsTrigger>
                  <TabsTrigger 
                    value="education" 
                    className={`${activeSection === "education" 
                      ? "bg-blue-600/50 text-white border-b-2 border-blue-400" 
                      : "text-gray-300 hover:text-white hover:bg-white/5"} font-medium transition-all duration-200`}
                  >
                    <GraduationCap className="h-4 w-4 mr-2" />
                    EDUCATION
                  </TabsTrigger>
                  <TabsTrigger 
                    value="skills" 
                    className={`${activeSection === "skills" 
                      ? "bg-blue-600/50 text-white border-b-2 border-blue-400" 
                      : "text-gray-300 hover:text-white hover:bg-white/5"} font-medium transition-all duration-200`}
                  >
                    <Code className="h-4 w-4 mr-2" />
                    SKILLS
                  </TabsTrigger>
                  <TabsTrigger 
                    value="projects" 
                    className={`${activeSection === "projects" 
                      ? "bg-blue-600/50 text-white border-b-2 border-blue-400" 
                      : "text-gray-300 hover:text-white hover:bg-white/5"} font-medium transition-all duration-200`}
                  >
                    <FolderKanban className="h-4 w-4 mr-2" />
                    PROJECTS
                  </TabsTrigger>
                  <TabsTrigger 
                    value="preview" 
                    className={`${activeSection === "preview" 
                      ? "bg-blue-600/50 text-white border-b-2 border-blue-400" 
                      : "text-gray-300 hover:text-white hover:bg-white/5"} font-medium transition-all duration-200`}
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
                            <h3 className="font-medium text-xl text-white">Job-Tailored Resume</h3>
                          </div>
                          <p className="text-gray-300 mb-2">
                            Your resume is being updated with tailored content optimized for the job description. Review each section and make any additional adjustments before saving.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                
                  {/* Welcome Banner - only show when resume is empty */}
                  {!resume.personalInfo.firstName && !resume.personalInfo.lastName && (
                    <div className="md:col-span-3 mb-4">
                      <div className="cosmic-card border border-blue-500/30 bg-blue-900/20 p-6 rounded-lg relative overflow-hidden backdrop-blur-sm">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10">
                          <div className="flex items-center mb-3">
                            <Upload className="h-5 w-5 mr-2 text-blue-400" />
                            <h3 className="font-medium text-xl text-white">Upload Your Existing Resume</h3>
                          </div>
                          <p className="text-gray-300 mb-4">
                            Skip manual entry by uploading your existing resume. Our AI will automatically extract your information and fill out this form for you.
                          </p>
                          <div className="flex flex-wrap gap-3">
                            <Button
                              onClick={handleFileInputClick}
                              className="bg-blue-600 text-white hover:bg-blue-700 flex items-center space-x-2"
                            >
                              <Upload className="h-4 w-4" />
                              <span>Upload PDF, DOCX, or TXT</span>
                            </Button>
                            <p className="text-sm text-gray-400 flex items-center">
                              <span className="mr-1">or</span> fill out the form manually below
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
                          <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                          <Input 
                            id="firstName"
                            value={resume.personalInfo.firstName}
                            onChange={e => updatePersonalInfo("firstName", e.target.value)}
                            className="mt-1 bg-black/60 border-white/10 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                          <Input 
                            id="lastName"
                            value={resume.personalInfo.lastName}
                            onChange={e => updatePersonalInfo("lastName", e.target.value)}
                            className="mt-1 bg-black/60 border-white/10 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-gray-300">Email</Label>
                          <Input 
                            id="email"
                            type="email"
                            value={resume.personalInfo.email}
                            onChange={e => updatePersonalInfo("email", e.target.value)}
                            className="mt-1 bg-black/60 border-white/10 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-gray-300">Phone</Label>
                          <Input 
                            id="phone"
                            value={resume.personalInfo.phone}
                            onChange={e => updatePersonalInfo("phone", e.target.value)}
                            className="mt-1 bg-black/60 border-white/10 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="headline" className="text-gray-300">Professional Headline</Label>
                      <Input 
                        id="headline"
                        value={resume.personalInfo.headline}
                        onChange={e => updatePersonalInfo("headline", e.target.value)}
                        className="mt-1 bg-black/60 border-white/10 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="e.g., Senior Software Engineer | Front-End Specialist | React & TypeScript Expert"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="summary" className="text-gray-300">Professional Summary</Label>
                      <Textarea 
                        id="summary"
                        value={resume.personalInfo.summary}
                        onChange={e => updatePersonalInfo("summary", e.target.value)}
                        className="mt-1 min-h-32 bg-black/60 border-white/10 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Write a concise summary of your professional background, key skills, and career achievements."
                      />
                      <Button 
                        type="button" 
                        onClick={() => {
                          setActiveSection("profile");
                          // Scroll to the AI Resume Assistant section
                          document.querySelector('.cosmic-card .flex .text-blue-400')?.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'center'
                          });
                        }}
                        className="mt-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 flex items-center"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Help me generate a summary
                      </Button>
                    </div>
                  </div>
                  
                  {/* AI Assistant Section */}
                  <div className="md:col-span-1">
                    <div className="cosmic-card border border-white/10 bg-black/40 p-5 rounded-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                      <div className="relative z-10">
                        <div className="flex items-center mb-4">
                          <Cpu className="h-5 w-5 mr-2 text-blue-400 animate-pulse" />
                          <h3 className="font-medium text-white">AI Resume Assistant</h3>
                        </div>
                        
                        <Collapsible className="mb-4">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-medium text-blue-300 mb-2">
                              Generate Professional Summary
                            </h4>
                            <CollapsibleTrigger className="text-xs text-gray-400 hover:text-gray-200">
                              <ChevronDown className="h-4 w-4" />
                            </CollapsibleTrigger>
                          </div>
                          <CollapsibleContent>
                            <div className="mt-2">
                              <SummarySuggestions 
                                resumeId={resumeId?.toString() || "new"}
                                onApply={handleApplySummary}
                              />
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                        
                        <div className="text-xs text-gray-300 mt-3 bg-white/5 p-3 rounded-lg">
                          <p className="mb-2 text-blue-300 font-medium">Tips for a great summary:</p>
                          <ul className="list-disc pl-4 space-y-1">
                            <li>Keep it concise (3-5 sentences)</li>
                            <li>Highlight your most relevant experience</li>
                            <li>Focus on achievements rather than responsibilities</li>
                            <li>Include keywords relevant to your target position</li>
                          </ul>
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
                            description: ""
                          };
                          
                          setResume({
                            ...resume,
                            experience: [...resume.experience, newExperience]
                          });
                        }}
                        className="flex items-center space-x-1 border-white/10 text-blue-400 hover:bg-white/10 hover:text-white"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Experience</span>
                      </Button>
                    </div>
                    
                    <ResumeExperienceSection 
                      experiences={resume.experience} 
                      onUpdate={(experiences) => {
                        setResume({
                          ...resume,
                          experience: experiences
                        });
                      }}
                    />
                  </div>
                  
                  {/* AI Assistant for Experience */}
                  <div className="md:col-span-1">
                    <div className="cosmic-card border border-white/10 bg-black/40 p-5 rounded-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                      <div className="relative z-10">
                        <div className="flex items-center mb-4">
                          <Cpu className="h-5 w-5 mr-2 text-blue-400 animate-pulse" />
                          <h3 className="font-medium text-white">AI Resume Assistant</h3>
                        </div>
                        
                        <Collapsible className="mb-4">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-medium text-blue-300 mb-2">
                              Generate Achievement Bullets
                            </h4>
                            <CollapsibleTrigger className="text-xs text-gray-400 hover:text-gray-200">
                              <ChevronDown className="h-4 w-4" />
                            </CollapsibleTrigger>
                          </div>
                          <CollapsibleContent>
                            <div className="mt-2">
                              <ExperienceSuggestions 
                                resumeId={resumeId?.toString() || "new"}
                                jobTitle={resume.experience.length > 0 ? resume.experience[resume.experience.length - 1].title : undefined}
                                onApply={handleApplyBulletPoint}
                              />
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                        
                        <div className="text-xs text-gray-300 mt-3 bg-white/5 p-3 rounded-lg">
                          <p className="mb-2 text-blue-300 font-medium">Tips for effective bullet points:</p>
                          <ul className="list-disc pl-4 space-y-1">
                            <li>Start with strong action verbs</li>
                            <li>Include metrics and achievements</li>
                            <li>Use industry-specific keywords</li>
                            <li>Highlight results, not just responsibilities</li>
                          </ul>
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
                          description: ""
                        };
                        
                        setResume({
                          ...resume,
                          education: [...resume.education, newEducation]
                        });
                      }}
                      className="flex items-center space-x-1 border-white/10 text-blue-400 hover:bg-white/10 hover:text-white"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Education</span>
                    </Button>
                  </div>
                  
                  <ResumeEducationSection 
                    education={resume.education} 
                    onUpdate={(education) => {
                      setResume({
                        ...resume,
                        education
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
                            proficiency: 3
                          };
                          
                          setResume({
                            ...resume,
                            skills: [...resume.skills, newSkill]
                          });
                        }}
                        className="flex items-center space-x-1 border-white/10 text-blue-400 hover:bg-white/10 hover:text-white"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Skill</span>
                      </Button>
                    </div>
                    
                    <ResumeSkillsSection 
                      skills={resume.skills} 
                      onUpdate={(skills) => {
                        setResume({
                          ...resume,
                          skills
                        });
                      }}
                    />
                  </div>
                  
                  {/* AI Assistant for Skills */}
                  <div className="md:col-span-1">
                    <div className="cosmic-card border border-white/10 bg-black/40 p-5 rounded-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                      <div className="relative z-10">
                        <div className="flex items-center mb-4">
                          <Cpu className="h-5 w-5 mr-2 text-blue-400 animate-pulse" />
                          <h3 className="font-medium text-white">AI Resume Assistant</h3>
                        </div>
                        
                        <Collapsible className="mb-4">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-medium text-blue-300 mb-2">
                              Suggested Skills
                            </h4>
                            <CollapsibleTrigger className="text-xs text-gray-400 hover:text-gray-200">
                              <ChevronDown className="h-4 w-4" />
                            </CollapsibleTrigger>
                          </div>
                          <CollapsibleContent>
                            <div className="mt-2">
                              <SkillSuggestions 
                                resumeId={resumeId?.toString() || "new"}
                                jobTitle={resume.experience.length > 0 ? resume.experience[0].title : undefined}
                                onApply={handleApplySkill}
                              />
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                        
                        <div className="text-xs text-gray-300 mt-3 bg-white/5 p-3 rounded-lg">
                          <p className="mb-2 text-blue-300 font-medium">Tips for showcasing skills:</p>
                          <ul className="list-disc pl-4 space-y-1">
                            <li>Include a mix of technical and soft skills</li>
                            <li>Prioritize skills mentioned in job descriptions</li>
                            <li>Be honest about your proficiency levels</li>
                            <li>Group similar skills together</li>
                          </ul>
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
                          technologies: []
                        };
                        
                        setResume({
                          ...resume,
                          projects: [...resume.projects, newProject]
                        });
                      }}
                      className="flex items-center space-x-1 border-white/10 text-blue-400 hover:bg-white/10 hover:text-white"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Project</span>
                    </Button>
                  </div>
                  
                  <ResumeProjectsSection 
                    projects={resume.projects} 
                    onUpdate={(projects) => {
                      setResume({
                        ...resume,
                        projects
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
                    <ResumePreview resume={resume} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}