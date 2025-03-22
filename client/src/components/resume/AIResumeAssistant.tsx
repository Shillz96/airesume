import React, { useState, useEffect } from 'react';
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, RefreshCw, Loader2, Check, Cpu, Zap, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { v4 as uuidv4 } from 'uuid';

interface AIResumeAssistantProps {
  resumeId?: string;
  activeSection: string;
  onApplySummary?: (summary: string) => void;
  onApplyBulletPoint?: (bulletPoint: string) => void;
  onApplySkill?: (skill: string) => void;
  onApplyTailoredContent?: (content: any) => void;
}

type SummaryLength = "short" | "medium" | "long";
type BulletLength = "short" | "medium" | "long";
type SkillsCategory = "technical" | "soft" | "industry";

export default function AIResumeAssistant({
  resumeId,
  activeSection,
  onApplySummary,
  onApplyBulletPoint,
  onApplySkill,
  onApplyTailoredContent
}: AIResumeAssistantProps) {
  const { toast } = useToast();
  
  // State for different suggestion types
  const [summaries, setSummaries] = useState<string[]>([]);
  const [bulletPoints, setBulletPoints] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [educationSuggestions, setEducationSuggestions] = useState<string[]>([]);
  const [projectSuggestions, setProjectSuggestions] = useState<string[]>([]);

  // Generation options state
  const [summaryLength, setSummaryLength] = useState<SummaryLength>("medium");
  const [bulletLength, setBulletLength] = useState<BulletLength>("medium");
  const [skillsCategory, setSkillsCategory] = useState<SkillsCategory>("technical");
  
  // Refresh counters to limit API calls
  const [refreshCounts, setRefreshCounts] = useState({
    summary: 0,
    bullet: 0,
    skill: 0,
    education: 0,
    project: 0
  });

  // Generation state
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingBullets, setIsGeneratingBullets] = useState(false);
  const [isGeneratingSkills, setIsGeneratingSkills] = useState(false);
  const [isGeneratingEducation, setIsGeneratingEducation] = useState(false);
  const [isGeneratingProjects, setIsGeneratingProjects] = useState(false);

  // Generate appropriate title for current section
  const getSectionTitle = () => {
    switch (activeSection) {
      case 'profile':
        return 'Professional Summary Suggestions';
      case 'experience':
        return 'Experience Bullet Points';
      case 'skills':
        return 'Relevant Skills Suggestions';
      case 'education':
        return 'Education Section Tips';
      case 'projects':
        return 'Project Description Ideas';
      default:
        return 'AI Resume Suggestions';
    }
  };

  // Handle summary generation with length option
  const handleGenerateSummaries = async (length: SummaryLength = "medium") => {
    setSummaryLength(length);
    setIsGeneratingSummary(true);
    
    // Limit refreshes to 5 per length type
    if (refreshCounts.summary >= 5) {
      toast({
        title: "Refresh limit reached",
        description: "You've reached the maximum number of refreshes. Try a different length option.",
        variant: "default",
      });
      setIsGeneratingSummary(false);
      return;
    }
    
    setRefreshCounts(prev => ({...prev, summary: prev.summary + 1}));

    // Generate sample summaries based on resume content and length
    const getFallbackSummaries = (length: SummaryLength) => {
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
    };

    // If we have a valid resumeId (not "new" and not null), try to get AI suggestions
    if (resumeId && resumeId !== "new") {
      try {
        // Use the summaryOnly parameter to get complete summary rewrites
        // Add length parameter and randomSeed to ensure we get different results each time
        const res = await apiRequest(
          "GET",
          `/api/resumes/${resumeId}/suggestions?summaryOnly=true&length=${length}&seed=${refreshCounts.summary}`
        );
        const data = await res.json();

        if (data.success && data.suggestions && Array.isArray(data.suggestions)) {
          setSummaries(data.suggestions.slice(0, 3));
          setIsGeneratingSummary(false);
          return;
        }
      } catch (error) {
        console.error("Error generating summaries:", error);
      }
    }

    // If we get here, either the API call failed or we don't have a valid resumeId
    // Use the fallback summaries
    setSummaries(getFallbackSummaries(length));
    setIsGeneratingSummary(false);
  };

  // Handle bullet point generation with length option
  const handleGenerateBulletPoints = async (length: BulletLength = "medium") => {
    setBulletLength(length);
    setIsGeneratingBullets(true);
    
    // Limit refreshes to 5 per length type
    if (refreshCounts.bullet >= 5) {
      toast({
        title: "Refresh limit reached",
        description: "You've reached the maximum number of refreshes. Try a different length option.",
        variant: "default",
      });
      setIsGeneratingBullets(false);
      return;
    }
    
    setRefreshCounts(prev => ({...prev, bullet: prev.bullet + 1}));

    // Generate fallback bullet points based on length
    const getFallbackBulletPoints = (length: BulletLength) => {
      // Short bullet points
      if (length === "short") {
        return [
          "Improved departmental processes by 30%.",
          "Led cross-functional teams to deliver key projects.",
          "Reduced costs by 25% through strategic optimization.",
          "Increased customer satisfaction scores to 95%.",
          "Implemented innovative solutions with measurable results."
        ];
      }
      // Long bullet points
      else if (length === "long") {
        return [
          "Spearheaded a comprehensive overhaul of departmental processes, resulting in a 30% increase in operational efficiency while simultaneously reducing implementation costs by $150,000 annually and improving team morale through more streamlined workflows.",
          "Led cross-functional team of 12 professionals in the successful delivery of 5 high-priority projects valued at $2.3M collectively, consistently meeting or exceeding stakeholder expectations while maintaining budget constraints and aggressive timeline requirements.",
          "Implemented innovative technical solutions that dramatically improved data processing capabilities by 45%, resulting in faster decision-making processes and enabling the business to respond more effectively to rapidly changing market conditions.",
          "Developed and executed strategic initiatives that increased departmental productivity by 37% within the first quarter, recognized by senior leadership for exceptional performance and promoted to lead advanced projects with greater scope and complexity.",
          "Redesigned critical infrastructure components, resulting in 99.9% uptime, a 28% reduction in maintenance costs, and significantly enhanced user experience as measured by a 40-point improvement in Net Promoter Score."
        ];
      }
      // Medium bullet points (default)
      else {
        return [
          "Implemented innovative solutions resulting in 35% efficiency improvement and $120K annual savings.",
          "Led key projects, delivering results ahead of schedule and under budget while maintaining high quality standards.",
          "Collaborated with cross-functional teams to enhance processes, improving workflow efficiency by 28%.",
          "Increased performance metrics by 40% through optimization of processes and implementation of best practices.",
          "Developed and executed strategic plan that increased departmental productivity by 25% within six months."
        ];
      }
    };

    // If we have a valid resumeId (not "new" and not null), try to get AI suggestions
    if (resumeId && resumeId !== "new") {
      try {
        const res = await apiRequest(
          "GET",
          `/api/resumes/${resumeId}/suggestions?experienceOnly=true&length=${length}&seed=${refreshCounts.bullet}`
        );
        const data = await res.json();

        if (data.success && data.suggestions && Array.isArray(data.suggestions)) {
          setBulletPoints(data.suggestions.slice(0, 5));
          setIsGeneratingBullets(false);
          return;
        }
      } catch (error) {
        console.error("Error generating bullet points:", error);
      }
    }

    // If we get here, either the API call failed or we don't have a valid resumeId
    // Use the fallback bullet points
    setBulletPoints(getFallbackBulletPoints(length));
    setIsGeneratingBullets(false);
  };

  // Handle skills generation with category option
  const handleGenerateSkills = async (category: SkillsCategory = "technical") => {
    setSkillsCategory(category);
    setIsGeneratingSkills(true);
    
    // Limit refreshes to 5 per category
    if (refreshCounts.skill >= 5) {
      toast({
        title: "Refresh limit reached",
        description: "You've reached the maximum number of refreshes. Try a different category.",
        variant: "default",
      });
      setIsGeneratingSkills(false);
      return;
    }
    
    setRefreshCounts(prev => ({...prev, skill: prev.skill + 1}));

    // Generate fallback skills based on category
    const getFallbackSkills = (category: SkillsCategory) => {
      // Technical skills
      if (category === "technical") {
        return [
          "JavaScript",
          "Python",
          "React",
          "SQL",
          "AWS",
          "Docker",
          "TypeScript",
          "Node.js",
          "Git",
          "RESTful APIs"
        ];
      }
      // Soft skills
      else if (category === "soft") {
        return [
          "Communication",
          "Leadership",
          "Problem-solving",
          "Time management",
          "Teamwork",
          "Critical thinking",
          "Adaptability",
          "Emotional intelligence",
          "Conflict resolution",
          "Creativity"
        ];
      }
      // Industry-specific skills
      else {
        return [
          "Agile methodologies",
          "Project management",
          "Business analysis",
          "UX/UI design",
          "Data analytics",
          "Digital marketing",
          "Content strategy",
          "SEO optimization",
          "Customer relationship management",
          "Financial analysis"
        ];
      }
    };

    // If we have a valid resumeId (not "new" and not null), try to get AI suggestions
    if (resumeId && resumeId !== "new") {
      try {
        const res = await apiRequest(
          "GET",
          `/api/resumes/${resumeId}/suggestions?skillsOnly=true&category=${category}&seed=${refreshCounts.skill}`
        );
        const data = await res.json();

        if (data.success && data.suggestions && Array.isArray(data.suggestions)) {
          setSkills(data.suggestions.slice(0, 10));
          setIsGeneratingSkills(false);
          return;
        }
      } catch (error) {
        console.error("Error generating skills:", error);
      }
    }

    // If we get here, either the API call failed or we don't have a valid resumeId
    // Use the fallback skills
    setSkills(getFallbackSkills(category));
    setIsGeneratingSkills(false);
  };

  // Handle education suggestions generation
  const handleGenerateEducationSuggestions = async () => {
    setIsGeneratingEducation(true);
    
    // Limit refreshes
    if (refreshCounts.education >= 5) {
      toast({
        title: "Refresh limit reached",
        description: "You've reached the maximum number of refreshes.",
        variant: "default",
      });
      setIsGeneratingEducation(false);
      return;
    }
    
    setRefreshCounts(prev => ({...prev, education: prev.education + 1}));

    // Fallback education suggestions
    const fallbackEducationSuggestions = [
      "Add relevant coursework that aligns with your target job",
      "Include your GPA if it's 3.5 or higher",
      "Mention academic honors and awards",
      "List relevant student organizations or leadership roles",
      "Include certifications or continuing education"
    ];

    // If we have a valid resumeId (not "new" and not null), try to get AI suggestions
    if (resumeId && resumeId !== "new") {
      try {
        const res = await apiRequest(
          "GET",
          `/api/resumes/${resumeId}/suggestions?educationOnly=true&seed=${refreshCounts.education}`
        );
        const data = await res.json();

        if (data.success && data.suggestions && Array.isArray(data.suggestions)) {
          setEducationSuggestions(data.suggestions.slice(0, 5));
          setIsGeneratingEducation(false);
          return;
        }
      } catch (error) {
        console.error("Error generating education suggestions:", error);
      }
    }

    // If we get here, either the API call failed or we don't have a valid resumeId
    // Use the fallback education suggestions
    setEducationSuggestions(fallbackEducationSuggestions);
    setIsGeneratingEducation(false);
  };

  // Handle project suggestions generation
  const handleGenerateProjectSuggestions = async () => {
    setIsGeneratingProjects(true);
    
    // Limit refreshes
    if (refreshCounts.project >= 5) {
      toast({
        title: "Refresh limit reached",
        description: "You've reached the maximum number of refreshes.",
        variant: "default",
      });
      setIsGeneratingProjects(false);
      return;
    }
    
    setRefreshCounts(prev => ({...prev, project: prev.project + 1}));

    // Fallback project suggestions
    const fallbackProjectSuggestions = [
      "Quantify the impact of your project with metrics",
      "Highlight technologies and methodologies used",
      "Describe your specific role and contributions",
      "Mention collaboration with cross-functional teams",
      "Include links to project repositories or demos"
    ];

    // If we have a valid resumeId (not "new" and not null), try to get AI suggestions
    if (resumeId && resumeId !== "new") {
      try {
        const res = await apiRequest(
          "GET",
          `/api/resumes/${resumeId}/suggestions?projectsOnly=true&seed=${refreshCounts.project}`
        );
        const data = await res.json();

        if (data.success && data.suggestions && Array.isArray(data.suggestions)) {
          setProjectSuggestions(data.suggestions.slice(0, 5));
          setIsGeneratingProjects(false);
          return;
        }
      } catch (error) {
        console.error("Error generating project suggestions:", error);
      }
    }

    // If we get here, either the API call failed or we don't have a valid resumeId
    // Use the fallback project suggestions
    setProjectSuggestions(fallbackProjectSuggestions);
    setIsGeneratingProjects(false);
  };

  // Load appropriate suggestions when active section changes
  useEffect(() => {
    // Clear previous suggestions
    setSummaries([]);
    setBulletPoints([]);
    setSkills([]);
    setEducationSuggestions([]);
    setProjectSuggestions([]);
    
    // Generate new suggestions based on the active section
    switch (activeSection) {
      case 'profile':
        handleGenerateSummaries(summaryLength);
        break;
      case 'experience':
        handleGenerateBulletPoints(bulletLength);
        break;
      case 'skills':
        handleGenerateSkills(skillsCategory);
        break;
      case 'education':
        handleGenerateEducationSuggestions();
        break;
      case 'projects':
        handleGenerateProjectSuggestions();
        break;
    }
  }, [activeSection]);

  // Render suggestions based on active section
  const renderSuggestions = () => {
    switch (activeSection) {
      case 'profile':
        return renderSummaries();
      case 'experience':
        return renderBulletPoints();
      case 'skills':
        return renderSkills();
      case 'education':
        return renderEducationSuggestions();
      case 'projects':
        return renderProjectSuggestions();
      default:
        return (
          <div className="p-4 text-center">
            <p className="text-blue-200">Select a section to view tailored AI suggestions</p>
          </div>
        );
    }
  };

  // Render professional summary suggestions
  const renderSummaries = () => {
    if (summaries.length === 0) {
      return (
        <div className="space-y-4 py-3">
          <div className="text-center">
            <h4 className="text-sm font-medium text-blue-300 mb-2">
              Choose Summary Length
            </h4>
            <div className="flex space-x-2 mb-4">
              <Button
                onClick={() => handleGenerateSummaries("short")}
                disabled={isGeneratingSummary}
                variant="outline"
                size="sm"
                className="flex-1 border-blue-500/30 text-blue-200 hover:bg-blue-900/30 hover:text-blue-100"
              >
                Short
              </Button>
              <Button
                onClick={() => handleGenerateSummaries("medium")}
                disabled={isGeneratingSummary}
                variant="outline"
                size="sm"
                className="flex-1 border-blue-500/30 text-blue-200 hover:bg-blue-900/30 hover:text-blue-100"
              >
                Medium
              </Button>
              <Button
                onClick={() => handleGenerateSummaries("long")}
                disabled={isGeneratingSummary}
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
            disabled={isGeneratingSummary}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 bg-[rgba(20,30,70,0.6)] border-blue-500/30 text-blue-100"
          >
            {isGeneratingSummary ? (
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
      );
    }

    return (
      <div className="space-y-3">
        {summaries.map((summary, index) => (
          <div
            key={index}
            className="cosmic-card-glass p-3 rounded-md border border-blue-500/30 text-sm relative group backdrop-blur-sm"
          >
            <p className="text-gray-200">{summary}</p>
            <Button
              onClick={() => onApplySummary && onApplySummary(summary)}
              size="sm"
              className="mt-2 w-full cosmic-button-primary flex items-center justify-center gap-1"
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
    );
  };

  // Render experience bullet point suggestions
  const renderBulletPoints = () => {
    if (bulletPoints.length === 0) {
      return (
        <div className="space-y-4 py-3">
          <div className="text-center">
            <h4 className="text-sm font-medium text-blue-300 mb-2">
              Choose Bullet Point Length
            </h4>
            <div className="flex space-x-2 mb-4">
              <Button
                onClick={() => handleGenerateBulletPoints("short")}
                disabled={isGeneratingBullets}
                variant="outline"
                size="sm"
                className="flex-1 border-blue-500/30 text-blue-200 hover:bg-blue-900/30 hover:text-blue-100"
              >
                Short
              </Button>
              <Button
                onClick={() => handleGenerateBulletPoints("medium")}
                disabled={isGeneratingBullets}
                variant="outline"
                size="sm"
                className="flex-1 border-blue-500/30 text-blue-200 hover:bg-blue-900/30 hover:text-blue-100"
              >
                Medium
              </Button>
              <Button
                onClick={() => handleGenerateBulletPoints("long")}
                disabled={isGeneratingBullets}
                variant="outline"
                size="sm"
                className="flex-1 border-blue-500/30 text-blue-200 hover:bg-blue-900/30 hover:text-blue-100"
              >
                Long
              </Button>
            </div>
          </div>

          <Button
            onClick={() => handleGenerateBulletPoints("medium")}
            disabled={isGeneratingBullets}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 bg-[rgba(20,30,70,0.6)] border-blue-500/30 text-blue-100"
          >
            {isGeneratingBullets ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating bullet points...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate achievement bullets
              </>
            )}
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {bulletPoints.map((bullet, index) => (
          <div
            key={index}
            className="cosmic-card-glass p-3 rounded-md border border-blue-500/30 text-sm relative group backdrop-blur-sm"
          >
            <p className="text-gray-200">{bullet}</p>
            <Button
              onClick={() => onApplyBulletPoint && onApplyBulletPoint(bullet)}
              size="sm"
              className="mt-2 w-full cosmic-button-primary flex items-center justify-center gap-1"
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
            Short
          </Button>
          <Button
            onClick={() => handleGenerateBulletPoints("medium")}
            variant="ghost"
            size="sm"
            className="flex-1 items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Medium
          </Button>
          <Button
            onClick={() => handleGenerateBulletPoints("long")}
            variant="ghost"
            size="sm"
            className="flex-1 items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Long
          </Button>
        </div>
      </div>
    );
  };

  // Render skills suggestions
  const renderSkills = () => {
    if (skills.length === 0) {
      return (
        <div className="space-y-4 py-3">
          <div className="text-center">
            <h4 className="text-sm font-medium text-blue-300 mb-2">
              Choose Skills Category
            </h4>
            <div className="flex space-x-2 mb-4">
              <Button
                onClick={() => handleGenerateSkills("technical")}
                disabled={isGeneratingSkills}
                variant="outline"
                size="sm"
                className="flex-1 border-blue-500/30 text-blue-200 hover:bg-blue-900/30 hover:text-blue-100"
              >
                Technical
              </Button>
              <Button
                onClick={() => handleGenerateSkills("soft")}
                disabled={isGeneratingSkills}
                variant="outline"
                size="sm"
                className="flex-1 border-blue-500/30 text-blue-200 hover:bg-blue-900/30 hover:text-blue-100"
              >
                Soft
              </Button>
              <Button
                onClick={() => handleGenerateSkills("industry")}
                disabled={isGeneratingSkills}
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
            disabled={isGeneratingSkills}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 bg-[rgba(20,30,70,0.6)] border-blue-500/30 text-blue-100"
          >
            {isGeneratingSkills ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating skills...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate in-demand skills
              </>
            )}
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge
              key={index}
              className="cursor-pointer bg-blue-900/30 text-blue-100 hover:bg-blue-800/50 border border-blue-500/20 transition-all"
              onClick={() => onApplySkill && onApplySkill(skill)}
            >
              {skill} <Plus className="ml-1 h-3 w-3" />
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
    );
  };

  // Render education suggestions
  const renderEducationSuggestions = () => {
    if (educationSuggestions.length === 0) {
      return (
        <div className="space-y-4 py-3">
          <Button
            onClick={handleGenerateEducationSuggestions}
            disabled={isGeneratingEducation}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 bg-[rgba(20,30,70,0.6)] border-blue-500/30 text-blue-100"
          >
            {isGeneratingEducation ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating suggestions...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate education tips
              </>
            )}
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {educationSuggestions.map((suggestion, index) => (
          <div
            key={index}
            className="cosmic-card-glass p-3 rounded-md border border-blue-500/30 text-sm relative group backdrop-blur-sm"
          >
            <p className="text-gray-200">{suggestion}</p>
          </div>
        ))}
        <Button
          onClick={handleGenerateEducationSuggestions}
          variant="ghost"
          size="sm"
          className="w-full items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Generate more tips
        </Button>
      </div>
    );
  };

  // Render project suggestions
  const renderProjectSuggestions = () => {
    if (projectSuggestions.length === 0) {
      return (
        <div className="space-y-4 py-3">
          <Button
            onClick={handleGenerateProjectSuggestions}
            disabled={isGeneratingProjects}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 bg-[rgba(20,30,70,0.6)] border-blue-500/30 text-blue-100"
          >
            {isGeneratingProjects ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating suggestions...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate project tips
              </>
            )}
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {projectSuggestions.map((suggestion, index) => (
          <div
            key={index}
            className="cosmic-card-glass p-3 rounded-md border border-blue-500/30 text-sm relative group backdrop-blur-sm"
          >
            <p className="text-gray-200">{suggestion}</p>
          </div>
        ))}
        <Button
          onClick={handleGenerateProjectSuggestions}
          variant="ghost"
          size="sm"
          className="w-full items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Generate more tips
        </Button>
      </div>
    );
  };

  return (
    <div className="cosmic-card-gradient border border-white/10 rounded-lg shadow-lg overflow-hidden h-full">
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 py-3 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Cpu className="h-5 w-5 text-blue-300 mr-2" />
          <h3 className="text-white font-medium">{getSectionTitle()}</h3>
        </div>
        <Badge className="bg-blue-600/40 text-blue-100 flex items-center gap-1">
          <Zap className="h-3 w-3" /> AI Powered
        </Badge>
      </div>
      <div className="p-4 max-h-[600px] overflow-y-auto">
        {renderSuggestions()}
      </div>
    </div>
  );
}