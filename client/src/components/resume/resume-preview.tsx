import React, { useEffect, useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Resume,
  ProfessionalTemplate,
  CreativeTemplate,
  ExecutiveTemplate,
  ModernTemplate,
  MinimalTemplate,
  IndustryTemplate,
  BoldTemplate,
} from "@/components/resume-template";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Download,
  ChevronLeft,
  ChevronRight,
  Printer,
  Eye,
  ListFilter,
  CircleDot,
  Sparkles,
  Edit,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

// Memoized Template Renderer to prevent unnecessary re-renders
const MemoizedTemplate = React.memo(
  ({ template, resume }: { template: string; resume: Resume }) => {
    switch (template) {
      case "professional":
        return <ProfessionalTemplate resume={resume} />;
      case "creative":
        return <CreativeTemplate resume={resume} />;
      case "executive":
        return <ExecutiveTemplate resume={resume} />;
      case "modern":
        return <ModernTemplate resume={resume} />;
      case "minimal":
        return <MinimalTemplate resume={resume} />;
      case "industry":
        return <IndustryTemplate resume={resume} />;
      case "bold":
        return <BoldTemplate resume={resume} />;
      default:
        return <ProfessionalTemplate resume={resume} />;
    }
  }
);

interface ResumePreviewComponentProps {
  resume: Resume;
  onTemplateChange: (template: string) => void;
  onDownload?: () => void;
  onToggleSkillsDisplay?: () => void;
  onSmartAdjust?: (adjustedResume: Resume) => void;
  onEdit?: () => void; // Added edit functionality
}

export default function ResumePreviewComponent({
  resume,
  onTemplateChange,
  onDownload,
  onToggleSkillsDisplay,
  onSmartAdjust,
  onEdit,
}: ResumePreviewComponentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [previewScale, setPreviewScale] = useState(1.0);
  const [viewMode, setViewMode] = useState<"single" | "sideBySide">("single");
  const contentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Measure total content height to calculate number of pages
  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      const pageHeight = 841; // A4 height in pixels
      setTotalPages(Math.ceil(height / pageHeight));
      setCurrentPage(1); // Reset to first page when resume changes
    }
  }, [resume]);

  // Navigation handlers
  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  }, [currentPage, totalPages]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  }, [currentPage]);

  // Zoom handlers
  const zoomIn = useCallback(() => setPreviewScale((prev) => Math.min(prev + 0.1, 1.2)), []);
  const zoomOut = useCallback(() => setPreviewScale((prev) => Math.max(prev - 0.1, 0.5)), []);

  // Handle print/save PDF
  const handlePrint = useCallback(() => {
    if (onDownload) {
      onDownload();
    } else {
      toast({
        title: "Print functionality",
        description: "Opening the print dialog to save as PDF",
      });
      window.print();
    }
  }, [onDownload, toast]);

  // Handle smart adjust
  const handleSmartAdjust = useCallback(() => {
    if (onSmartAdjust) {
      // First check if we need adjustment based on content length
      const contentNeedsAdjustment = totalPages > 1;
      
      if (contentNeedsAdjustment) {
        // Create a deep copy of the current resume
        const adjustedResume = JSON.parse(JSON.stringify(resume));
        
        // Calculate the severity of adjustment needed based on content volume
        // 1.0 = minimal adjustment, 3.0 = aggressive adjustment
        const adjustmentSeverity = Math.min(totalPages, 3);
        
        // Adjust personal summary based on severity
        if (adjustedResume.personalInfo?.summary) {
          const maxSummaryLength = Math.floor(300 / adjustmentSeverity);
          if (adjustedResume.personalInfo.summary.length > maxSummaryLength) {
            adjustedResume.personalInfo.summary = adjustedResume.personalInfo.summary
              .substring(0, maxSummaryLength)
              .replace(/\s+[^\s]*$/, ''); // Cut at word boundary
            adjustedResume.personalInfo.summary += '...';
          }
        }
        
        // Adjust experience entries
        if (adjustedResume.experience && adjustedResume.experience.length > 0) {
          // Limit number of experiences based on severity
          const maxExperiences = Math.max(2, Math.floor(5 / adjustmentSeverity));
          if (adjustedResume.experience.length > maxExperiences) {
            adjustedResume.experience = adjustedResume.experience.slice(0, maxExperiences);
          }
          
          // Limit description length for each experience
          adjustedResume.experience = adjustedResume.experience.map((exp: any) => {
            if (exp.description) {
              const maxDescLength = Math.floor(250 / adjustmentSeverity);
              
              // Handle bullet point format (if description contains bullet points)
              if (exp.description.includes('•')) {
                const bullets = exp.description.split('•').filter((b: string) => b.trim());
                // Keep only top few bullet points
                const maxBullets = Math.max(2, Math.floor(5 / adjustmentSeverity));
                const trimmedBullets = bullets.slice(0, maxBullets);
                
                // Trim each bullet point if needed
                const processedBullets = trimmedBullets.map((bullet: string) => {
                  const trimmed = bullet.trim();
                  if (trimmed.length > maxDescLength / maxBullets) {
                    return trimmed.substring(0, maxDescLength / maxBullets).replace(/\s+[^\s]*$/, '') + '...';
                  }
                  return trimmed;
                });
                
                exp.description = processedBullets.map((b: string) => `• ${b}`).join('\n');
              } else {
                // Handle paragraph format
                if (exp.description.length > maxDescLength) {
                  exp.description = exp.description
                    .substring(0, maxDescLength)
                    .replace(/\s+[^\s]*$/, '') + '...';
                }
              }
            }
            return exp;
          });
        }
        
        // Adjust education entries
        if (adjustedResume.education && adjustedResume.education.length > 0) {
          const maxEducation = Math.max(1, Math.floor(3 / adjustmentSeverity));
          if (adjustedResume.education.length > maxEducation) {
            adjustedResume.education = adjustedResume.education.slice(0, maxEducation);
          }
          
          // Trim description
          adjustedResume.education = adjustedResume.education.map((edu: any) => {
            if (edu.description && edu.description.length > 100 / adjustmentSeverity) {
              edu.description = edu.description
                .substring(0, 100 / adjustmentSeverity)
                .replace(/\s+[^\s]*$/, '') + '...';
            }
            return edu;
          });
        }
        
        // Adjust skills
        if (adjustedResume.skills && adjustedResume.skills.length > 0) {
          const maxSkills = Math.max(6, Math.floor(15 / adjustmentSeverity));
          if (adjustedResume.skills.length > maxSkills) {
            adjustedResume.skills = adjustedResume.skills.slice(0, maxSkills);
          }
        }
        
        // Adjust projects
        if (adjustedResume.projects && adjustedResume.projects.length > 0) {
          const maxProjects = Math.max(1, Math.floor(3 / adjustmentSeverity));
          if (adjustedResume.projects.length > maxProjects) {
            adjustedResume.projects = adjustedResume.projects.slice(0, maxProjects);
          }
          
          // Trim project descriptions
          adjustedResume.projects = adjustedResume.projects.map((project: any) => {
            if (project.description && project.description.length > 120 / adjustmentSeverity) {
              project.description = project.description
                .substring(0, 120 / adjustmentSeverity)
                .replace(/\s+[^\s]*$/, '') + '...';
            }
            return project;
          });
        }
        
        // Apply a second optimization pass if still too long
        if (totalPages > 2) {
          // More aggressive secondary optimization
          // Further reduce descriptions
          if (adjustedResume.personalInfo?.summary) {
            adjustedResume.personalInfo.summary = adjustedResume.personalInfo.summary
              .substring(0, 150)
              .replace(/\s+[^\s]*$/, '') + '...';
          }
          
          // More aggressive trimming of experience descriptions
          if (adjustedResume.experience) {
            adjustedResume.experience = adjustedResume.experience.map((exp: any) => {
              if (exp.description && exp.description.length > 120) {
                exp.description = exp.description
                  .substring(0, 120)
                  .replace(/\s+[^\s]*$/, '') + '...';
              }
              return exp;
            });
          }
        }
        
        // Pass the adjusted resume back to the parent component
        onSmartAdjust(adjustedResume);
      } else {
        // No adjustment needed
        toast({
          title: "No adjustment needed",
          description: "Your resume already fits on a single page",
        });
      }
    }
  }, [onSmartAdjust, resume, totalPages, toast]);

  // Render the resume pages based on view mode
  const renderPages = useCallback(() => {
    if (viewMode === "single") {
      return (
        <div
          className="resume-preview-wrapper border border-blue-900/50 bg-white shadow-xl relative"
          style={{
            width: `${595 * previewScale}px`,
            height: `${841 * previewScale}px`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              transform: `scale(${previewScale}) translateY(-${(currentPage - 1) * 841}px)`,
              transformOrigin: "top left",
              width: "595px",
              height: `${totalPages * 841}px`,
            }}
          >
            <MemoizedTemplate template={resume.template} resume={resume} />
          </div>
          <div className="absolute bottom-2 right-2 text-xs text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      );
    } else {
      return (
        <div
          className="flex flex-row gap-4 overflow-x-auto pb-4"
          style={{
            width: "100%",
            maxWidth: `${(595 * previewScale + 16) * totalPages}px`, // 16px gap
          }}
        >
          {Array.from({ length: totalPages }, (_, index) => (
            <div
              key={index}
              className="resume-page border border-gray-200 shadow-lg relative flex-shrink-0"
              style={{
                width: `${595 * previewScale}px`,
                height: `${841 * previewScale}px`,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  transform: `scale(${previewScale}) translateY(-${index * 841}px)`,
                  transformOrigin: "top left",
                  width: "595px",
                  height: `${totalPages * 841}px`,
                }}
              >
                <MemoizedTemplate template={resume.template} resume={resume} />
              </div>
              <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                Page {index + 1}
              </div>
            </div>
          ))}
        </div>
      );
    }
  }, [viewMode, previewScale, currentPage, totalPages, resume]);

  return (
    <div className="flex flex-col space-y-4">
      {/* Hidden div to measure content height */}
      <div
        ref={contentRef}
        style={{ position: "absolute", visibility: "hidden", width: "595px" }}
      >
        <MemoizedTemplate template={resume.template} resume={resume} />
      </div>

      {/* Control Panel: Template Selection and Formatting Options */}
      <div className="bg-[rgba(10,15,25,0.5)] p-3 rounded-lg backdrop-blur-lg border border-indigo-800/30">
        <Tabs
          defaultValue={resume.template}
          onValueChange={onTemplateChange}
          className="w-full mb-3"
        >
          <TabsList className="w-full grid grid-cols-4 md:grid-cols-7 h-auto p-1 bg-[rgba(30,40,80,0.3)] overflow-x-auto">
            {[
              "professional",
              "modern",
              "minimal",
              "creative",
              "executive",
              "industry",
              "bold",
            ].map((template) => (
              <TabsTrigger
                key={template}
                value={template}
                className={cn(
                  "py-1 px-2 text-xs capitalize hover:text-blue-300 data-[state=active]:bg-blue-900/50",
                  "data-[state=active]:text-blue-50 data-[state=active]:shadow-none"
                )}
              >
                {template}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Formatting Options */}
        <div className="flex flex-wrap gap-4 p-2 bg-[rgba(20,30,60,0.5)] rounded-md">
          {/* Skills Display Mode Toggle */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="skills-display-mode"
                    checked={resume.skillsDisplayMode === "bubbles"}
                    onCheckedChange={onToggleSkillsDisplay}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <Label
                    htmlFor="skills-display-mode"
                    className="cursor-pointer text-xs text-blue-300"
                  >
                    {resume.skillsDisplayMode === "bubbles" ? (
                      <div className="flex items-center gap-1">
                        <CircleDot className="w-3 h-3" />
                        <span>Bubbles</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <ListFilter className="w-3 h-3" />
                        <span>Bullets</span>
                      </div>
                    )}
                  </Label>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle between bubbles or bullets for skills display</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Smart Adjust Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSmartAdjust}
                  className="h-7 px-2 text-xs gap-1 bg-[rgba(30,40,80,0.5)] hover:bg-blue-800/50 border-blue-800/30 text-blue-300"
                >
                  <Sparkles className="w-3 h-3" />
                  Smart Adjust
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Automatically adjust content for optimal fit</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Preview Controls: Pagination, Zoom, View Mode */}
      <div className="flex justify-between items-center w-full mb-3 px-2">
        {/* Pagination Controls (single mode only) */}
        {viewMode === "single" && totalPages > 1 ? (
          <div className="flex items-center gap-2 bg-blue-900/70 p-1 rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 bg-transparent hover:bg-blue-800/50 text-gray-300"
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-gray-300">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 bg-transparent hover:bg-blue-800/50 text-gray-300"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div></div> // Empty div to maintain flex layout
        )}

        {/* Zoom and View Mode Controls */}
        <div className="flex items-center gap-2 bg-blue-900/70 p-1 rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 bg-transparent hover:bg-blue-800/50 text-gray-300"
            onClick={zoomOut}
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs text-gray-300">
            {Math.round(previewScale * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 bg-transparent hover:bg-blue-800/50 text-gray-300"
            onClick={zoomIn}
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="text-xs text-gray-300 hover:bg-blue-800/50"
            onClick={() =>
              setViewMode(viewMode === "single" ? "sideBySide" : "single")
            }
          >
            {viewMode === "single" ? "All Pages" : "Single Page"}
          </Button>
        </div>
      </div>

      {/* Preview Container */}
      <div className="relative flex flex-col items-center">
        {/* Resume Preview */}
        <div className="mb-2">{renderPages()}</div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-2">
          <Button
            variant="outline"
            className="bg-[rgba(30,40,70,0.6)] text-blue-300 hover:text-blue-200 hover:bg-blue-800/50 border-blue-700/30"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print / Save PDF
          </Button>
          <Button
            variant="outline"
            className="bg-[rgba(30,40,70,0.6)] text-blue-300 hover:text-blue-200 hover:bg-blue-800/50 border-blue-700/30"
            onClick={onDownload}
            disabled={!onDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button
            variant="outline"
            className="bg-[rgba(30,40,70,0.6)] text-blue-300 hover:text-blue-200 hover:bg-blue-800/50 border-blue-700/30"
            onClick={() => window.open("/preview", "_blank")}
          >
            <Eye className="h-4 w-4 mr-2" />
            Full Preview
          </Button>
          {onEdit && (
            <Button
              variant="outline"
              className="bg-[rgba(30,40,70,0.6)] text-blue-300 hover:text-blue-200 hover:bg-blue-800/50 border-blue-700/30"
              onClick={onEdit}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Resume
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}