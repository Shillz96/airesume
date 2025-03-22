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
  onSmartAdjust?: () => void;
  onEdit?: () => void;
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
            margin: "0 auto", // Center the preview
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
    <div className="flex flex-col space-y-6 p-4">
      {/* Hidden div to measure content height */}
      <div
        ref={contentRef}
        style={{ position: "absolute", visibility: "hidden", width: "595px" }}
      >
        <MemoizedTemplate template={resume.template} resume={resume} />
      </div>

      {/* Control Panel: Template Selection and Formatting Options */}
      <div className="bg-[rgba(10,15,25,0.5)] p-4 rounded-lg backdrop-blur-lg border border-indigo-800/30 shadow-lg">
        <Tabs
          defaultValue={resume.template}
          onValueChange={onTemplateChange}
          className="w-full mb-4"
        >
          <div className="mb-3">
            <h3 className="text-blue-100 font-medium mb-2 text-center">Choose Template</h3>
            <TabsList className="w-full grid grid-cols-4 md:grid-cols-7 h-auto p-2 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-md border border-blue-800/30 overflow-x-auto">
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
                    "py-2 px-3 text-sm capitalize hover:text-blue-300 transition-all duration-200",
                    "data-[state=active]:bg-gradient-to-b from-blue-700/80 to-blue-900/80 border-t border-t-blue-600/50",
                    "data-[state=active]:text-blue-50 data-[state=active]:shadow-md rounded-md mx-1"
                  )}
                >
                  {template}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        {/* Formatting Options */}
        <div className="flex flex-wrap gap-4 p-3 bg-[rgba(20,30,60,0.5)] rounded-md">
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
                    className="cursor-pointer text-sm text-blue-300"
                  >
                    {resume.skillsDisplayMode === "bubbles" ? (
                      <div className="flex items-center gap-1">
                        <CircleDot className="w-4 h-4" />
                        <span>Bubbles</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <ListFilter className="w-4 h-4" />
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
                  onClick={onSmartAdjust}
                  className="h-9 px-4 text-sm gap-2 bg-gradient-to-r from-blue-700/80 to-indigo-700/80 hover:from-blue-600/80 hover:to-indigo-600/80 border-blue-500/50 text-blue-100 font-medium shadow-md transition-all duration-200 transform hover:scale-105"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  Smart Adjust
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-900/90 border-blue-500/50 text-blue-100">
                <p>Automatically adjust content to fit on one page</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Preview Controls: Pagination, Zoom, View Mode */}
      <div className="flex justify-between items-center w-full mb-4 px-4">
        {/* Pagination Controls (single mode only) */}
        {viewMode === "single" && totalPages > 1 && (
          <div className="flex items-center gap-3 bg-blue-900/70 p-2 rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-transparent hover:bg-blue-800/50 text-gray-300"
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="text-sm text-gray-300">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-transparent hover:bg-blue-800/50 text-gray-300"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Zoom and View Mode Controls */}
        <div className="flex items-center gap-3 bg-blue-900/70 p-2 rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-transparent hover:bg-blue-800/50 text-gray-300"
            onClick={zoomOut}
            aria-label="Zoom out"
          >
            <ZoomOut className="h-5 w-5" />
          </Button>
          <span className="text-sm text-gray-300">{Math.round(previewScale * 100)}%</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-transparent hover:bg-blue-800/50 text-gray-300"
            onClick={zoomIn}
            aria-label="Zoom in"
          >
            <ZoomIn className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            className="text-sm text-gray-300 hover:bg-blue-800/50 px-3 py-1"
            onClick={() =>
              setViewMode(viewMode === "single" ? "sideBySide" : "single")
            }
          >
            {viewMode === "single" ? "All Pages" : "Single Page"}
          </Button>
        </div>
      </div>

      {/* Preview Container */}
      <div className="relative flex flex-col items-center space-y-6">
        {/* Resume Preview */}
        <div className="p-4 mb-4 bg-[rgba(10,20,40,0.3)] border border-blue-900/40 rounded-lg shadow-xl">
          {renderPages()}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <Button
            variant="outline"
            className="bg-[rgba(30,40,70,0.6)] text-blue-300 hover:text-blue-200 hover:bg-blue-800/50 border-blue-700/30 px-4 py-2"
            onClick={handlePrint}
          >
            <Printer className="h-5 w-5 mr-2" />
            Print / Save PDF
          </Button>
          <Button
            variant="outline"
            className="bg-[rgba(30,40,70,0.6)] text-blue-300 hover:text-blue-200 hover:bg-blue-800/50 border-blue-700/30 px-4 py-2"
            onClick={onDownload}
            disabled={!onDownload}
          >
            <Download className="h-5 w-5 mr-2" />
            Download
          </Button>
          <Button
            variant="outline"
            className="bg-[rgba(30,40,70,0.6)] text-blue-300 hover:text-blue-200 hover:bg-blue-800/50 border-blue-700/30 px-4 py-2"
            onClick={() => window.open("/preview", "_blank")}
          >
            <Eye className="h-5 w-5 mr-2" />
            Full Preview
          </Button>
          {onEdit && (
            <Button
              variant="outline"
              className="bg-[rgba(30,40,70,0.6)] text-blue-300 hover:text-blue-200 hover:bg-blue-800/50 border-blue-700/30 px-4 py-2"
              onClick={onEdit}
            >
              <Edit className="h-5 w-5 mr-2" />
              Edit Resume
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}