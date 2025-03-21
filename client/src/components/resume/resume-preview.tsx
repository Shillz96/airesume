import React, { useEffect, useState, useRef } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Switch 
} from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Download,
  ChevronLeft,
  ChevronRight,
  FileText,
  Printer,
  Eye,
  ListFilter,
  CircleDashed,
  Sparkles,
  LayoutList,
  CircleDot,
  Edit,
} from "lucide-react";

interface ResumePreviewComponentProps {
  resume: Resume;
  onTemplateChange: (template: string) => void;
  onDownload?: () => void;
  onToggleSkillsDisplay?: () => void;
  onSmartAdjust?: (adjustedResume: Resume) => void;
  onEdit?: () => void; // Added edit functionality
}

/**
 * Component for displaying a preview of the resume with template selection,
 * pagination, and view mode toggle.
 */
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
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // Zoom handlers
  const zoomIn = () => setPreviewScale((prev) => Math.min(prev + 0.1, 1.2));
  const zoomOut = () => setPreviewScale((prev) => Math.max(prev - 0.1, 0.5));

  // Render the selected template
  const renderTemplate = () => {
    switch (resume.template) {
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
  };

  // Handle print/save PDF
  const handlePrint = () => {
    if (onDownload) {
      onDownload();
    } else {
      toast({
        title: "Print functionality",
        description: "Opening the print dialog to save as PDF",
      });
      window.print();
    }
  };
  
  // Force recalculation of preview after template changes or content adjustments
  useEffect(() => {
    // Force recalculation of content height
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      const pageHeight = 841; // A4 height in pixels
      setTotalPages(Math.ceil(height / pageHeight));
      
      // Force reflow by slightly changing scale and then reverting
      const currentScale = previewScale;
      setPreviewScale(currentScale - 0.01);
      setTimeout(() => setPreviewScale(currentScale), 50);
    }
  }, [resume.template, resume.experience, resume.skills, resume.education, resume.personalInfo]);

  // Render the resume pages based on view mode
  const renderPages = () => {
    if (viewMode === "single") {
      return (
        <div
          className="resume-preview-wrapper border border-blue-900/50 bg-white shadow-xl"
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
            {renderTemplate()}
          </div>
          <div className="absolute bottom-2 right-2 text-xs text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      );
    } else {
      // Side-by-side mode
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
                {renderTemplate()}
              </div>
              <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                Page {index + 1}
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Hidden div to measure content height */}
      <div
        ref={contentRef}
        style={{ position: "absolute", visibility: "hidden", width: "595px" }}
      >
        {renderTemplate()}
      </div>

      {/* Template selection tabs */}
      <div className="bg-[rgba(10,15,25,0.5)] p-3 rounded-lg backdrop-blur-lg border border-indigo-800/30">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-3">
          <Tabs
            defaultValue={resume.template}
            onValueChange={onTemplateChange}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-4 md:grid-cols-7 h-auto p-1 bg-[rgba(30,40,80,0.3)]">
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
        </div>
        
        {/* Resume formatting options */}
        <div className="flex flex-wrap gap-4 p-2 bg-[rgba(20,30,60,0.5)] rounded-md">
          {/* Skills display mode toggle */}
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="skills-display-mode" 
                      checked={resume.skillsDisplayMode === 'bubbles'}
                      onCheckedChange={onToggleSkillsDisplay}
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <Label 
                      htmlFor="skills-display-mode" 
                      className="cursor-pointer text-xs text-blue-300"
                    >
                      {resume.skillsDisplayMode === 'bubbles' ? (
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
          </div>
          
          {/* Smart adjust button */}
          <div className="flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      console.log('Smart Adjust button clicked');
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
                            adjustedResume.experience = adjustedResume.experience.map(exp => {
                              if (exp.description) {
                                const maxDescLength = Math.floor(250 / adjustmentSeverity);
                                
                                // Handle bullet point format (if description contains bullet points)
                                if (exp.description.includes('•')) {
                                  const bullets = exp.description.split('•').filter(b => b.trim());
                                  // Keep only top few bullet points
                                  const maxBullets = Math.max(2, Math.floor(5 / adjustmentSeverity));
                                  const trimmedBullets = bullets.slice(0, maxBullets);
                                  
                                  // Trim each bullet point if needed
                                  const processedBullets = trimmedBullets.map(bullet => {
                                    const trimmed = bullet.trim();
                                    if (trimmed.length > maxDescLength / maxBullets) {
                                      return trimmed.substring(0, maxDescLength / maxBullets).replace(/\s+[^\s]*$/, '') + '...';
                                    }
                                    return trimmed;
                                  });
                                  
                                  exp.description = processedBullets.map(b => `• ${b}`).join('\n');
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
                            adjustedResume.education = adjustedResume.education.map(edu => {
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
                            adjustedResume.projects = adjustedResume.projects.map(project => {
                              if (project.description && project.description.length > 100 / adjustmentSeverity) {
                                project.description = project.description
                                  .substring(0, 100 / adjustmentSeverity)
                                  .replace(/\s+[^\s]*$/, '') + '...';
                              }
                              
                              // Limit technologies to a few
                              if (project.technologies && project.technologies.length > 4 / adjustmentSeverity) {
                                project.technologies = project.technologies.slice(0, Math.floor(4 / adjustmentSeverity));
                              }
                              
                              return project;
                            });
                          }
                          
                          // Apply the adjustments
                          onSmartAdjust(adjustedResume);
                          
                          // Notify the user
                          toast({
                            title: "Smart Adjust Applied",
                            description: `Content optimized to fit on a single page (${adjustmentSeverity.toFixed(1)}x compression).`,
                            variant: "default",
                          });
                        } else {
                          // No adjustment needed
                          toast({
                            title: "Resume Already Optimized",
                            description: "Your resume already fits on a single page.",
                            variant: "default",
                          });
                        }
                      } else {
                        console.error('Smart Adjust function is not defined');
                      }
                    }}
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
      </div>

      {/* Controls above the preview */}
      <div className="flex justify-between items-center w-full mb-3 px-2">
        {/* Page navigation controls (single mode only) */}
        <div className="flex items-center gap-2">
          {viewMode === "single" && totalPages > 1 && (
            <div className="flex items-center gap-2 bg-blue-900/70 p-1 rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 bg-transparent hover:bg-blue-800/50 text-gray-300"
                onClick={goToPrevPage}
                disabled={currentPage === 1}
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
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Zoom and view mode controls */}
        <div className="flex items-center gap-2 bg-blue-900/70 p-1 rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 bg-transparent hover:bg-blue-800/50 text-gray-300"
            onClick={zoomOut}
          >
            <span className="text-xs">-</span>
          </Button>
          <span className="text-xs text-gray-300">
            {Math.round(previewScale * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 bg-transparent hover:bg-blue-800/50 text-gray-300"
            onClick={zoomIn}
          >
            <span className="text-xs">+</span>
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

      {/* Preview container */}
      <div className="relative flex flex-col items-center">
        {/* Resume preview */}
        <div className="mb-2">{renderPages()}</div>

        {/* Action buttons */}
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