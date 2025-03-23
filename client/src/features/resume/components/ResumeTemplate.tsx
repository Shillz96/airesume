import React, { useState, useRef, useEffect } from 'react';
import { Resume } from '@/features/resume/types';
import { Button } from "@/ui/core/Button";
import { 
  Download, Mail, Phone, Globe, MapPin, 
  ZoomIn, ZoomOut, Maximize, Minimize, 
  ArrowUp, ArrowDown, Dices, PanelLeftClose, PanelRightClose,
  ChevronLeft, ChevronRight, FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ResumeTemplateProps {
  resume: Resume;
  onDownload?: () => void;
  editable?: boolean;
  onResumeEdit?: (field: string, value: string) => void;
}

/**
 * Enhanced Resume Template component that displays a full page preview
 * with standard paper size, even when resume data is blank.
 * 
 * Features:
 * - Displays as full US Letter size (8.5" x 11")
 * - Shows template structure even with blank data
 * - Smart adjust button to optimize spacing and layout
 * - Direct content editing when in edit mode
 * - Zoom controls for better visibility
 */
export default function ResumeTemplate({ 
  resume, 
  onDownload,
  editable = false,
  onResumeEdit
}: ResumeTemplateProps) {
  const { personalInfo, experience = [], education = [], skills = [], projects = [] } = resume;
  const resumeRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [compact, setCompact] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showPlaceholders, setShowPlaceholders] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Check for content overflow and calculate pages
  useEffect(() => {
    if (contentRef.current) {
      // Get the dimensions of the content
      const contentHeight = contentRef.current.scrollHeight;
      const pageHeight = 11 * 96; // 11 inches in pixels (96 DPI)
      
      // Calculate how many pages are needed
      const pages = Math.max(1, Math.ceil(contentHeight / pageHeight));
      
      if (pages !== totalPages) {
        setTotalPages(pages);
        
        // Show toast for multi-page resumes
        if (pages > 1) {
          toast({
            title: `Multi-page resume detected`,
            description: `Your resume content spans ${pages} pages. Use page navigation controls to view all pages.`,
            duration: 3000
          });
        }
      }
    }
  }, [experience, education, skills, projects, compact, zoom]);

  // Function to navigate to the next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to navigate to the previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to apply smart spacing adjustments
  const applySmartAdjust = () => {
    setCompact(!compact);
    toast({
      title: compact ? "Standard spacing applied" : "Compact layout applied",
      description: compact ? 
        "Resume now uses standard spacing for a professional appearance." : 
        "Resume spacing optimized to fit more content on a single page."
    });
  };
  
  // Function to strip HTML tags for plain text representation
  const stripHtml = (html: string) => {
    if (!html) return '';
    if (typeof window !== 'undefined') {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.textContent || '';
    }
    return html.replace(/<[^>]*>/g, '');
  };

  // Helper function to handle content edits when in editable mode
  const handleContentEdit = (section: string, field: string, value: string) => {
    if (!editable || !onResumeEdit) return;
    
    // Construct the path to update the correct field
    const path = `${section}.${field}`;
    onResumeEdit(path, value);
  };

  // Placeholders for empty sections to maintain layout structure
  const placeholders = {
    personalInfo: {
      firstName: "Your",
      lastName: "Name",
      headline: "Professional Title",
      email: "email@example.com",
      phone: "(555) 123-4567",
      summary: "Professional summary highlighting your expertise, experience, and career aspirations."
    },
    experienceItem: {
      title: "Position Title",
      company: "Company Name",
      startDate: "Start Date",
      endDate: "End Date",
      description: "Describe your responsibilities and achievements in this role."
    },
    educationItem: {
      degree: "Degree Name",
      institution: "Institution Name",
      startDate: "Start Date",
      endDate: "End Date",
      description: "Describe your studies, achievements, or relevant coursework."
    },
    skillItem: {
      name: "Skill Name"
    },
    projectItem: {
      title: "Project Title",
      technologies: ["Technology"],
      description: "Describe the project, your role, and the technologies used.",
      link: "https://example.com"
    }
  };

  return (
    <div className="relative bg-card border border-border rounded-lg overflow-hidden shadow-sm">
      {/* Template header with controls - Better mobile optimization */}
      <div className="p-2 sm:p-4 border-b border-border bg-muted/30">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <h3 className="font-medium text-foreground text-sm sm:text-base">Resume Preview</h3>
            {totalPages > 1 && (
              <div className="ml-2 sm:ml-4 flex items-center gap-1 text-xs">
                <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 text-gray-500" />
                <span className="font-medium">Page {currentPage} of {totalPages}</span>
              </div>
            )}
          </div>
          
          {/* Download button - always visible */}
          {onDownload && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              className="h-8 w-8 sm:h-8 sm:w-auto sm:px-3"
            >
              <Download className="h-3.5 w-3.5 sm:mr-2" />
              <span className="hidden sm:inline">Download</span>
            </Button>
          )}
        </div>
        
        {/* Mobile-friendly controls with reduced spacing and optimized layout */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1 sm:gap-2 mt-2">
          {/* Grid area 1: Page Controls - only shown when multiple pages */}
          {totalPages > 1 ? (
            <div className="flex items-center justify-start gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                aria-label="First page"
                title="First page"
                className="h-7 w-7 p-0"
              >
                <ChevronLeft className="h-3 w-3 mr-[-3px]" />
                <ChevronLeft className="h-3 w-3" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={prevPage}
                disabled={currentPage === 1}
                aria-label="Previous page"
                title="Previous page"
                className="h-7 w-7 p-0"
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              
              <span className="text-xs px-1 min-w-[30px] text-center">
                {currentPage}/{totalPages}
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={nextPage}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                title="Next page"
                className="h-7 w-7 p-0"
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                aria-label="Last page"
                title="Last page"
                className="h-7 w-7 p-0"
              >
                <ChevronRight className="h-3 w-3 ml-[-3px]" />
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="flex-1 sm:hidden"></div>
          )}
          
          {/* Grid area 2: Zoom controls */}
          <div className="flex items-center justify-end sm:justify-start gap-1">
            <Button
              variant="ghost"
              size="sm" 
              onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              aria-label="Zoom out"
              title="Zoom out"
              className="h-7 w-7 p-0"
            >
              <ZoomOut className="h-3 w-3" />
            </Button>
            
            <span className="text-xs font-mono px-1 py-0.5 rounded bg-muted">{Math.round(zoom * 100)}%</span>
            
            <Button
              variant="ghost"
              size="sm" 
              onClick={() => setZoom(Math.min(2, zoom + 0.1))}
              aria-label="Zoom in"
              title="Zoom in"
              className="h-7 w-7 p-0"
            >
              <ZoomIn className="h-3 w-3" />
            </Button>
          </div>
          
          {/* Grid area 3: Main action buttons - first row on mobile */}
          <div className="flex items-center justify-start col-span-2 sm:col-span-1 gap-1 mt-1 sm:mt-0 sm:ml-auto">
            <Button
              variant="ghost"
              size="sm" 
              onClick={() => setFullscreen(!fullscreen)}
              aria-label="Toggle fullscreen"
              title={fullscreen ? "Exit fullscreen" : "Fullscreen view"}
              className="h-7 w-7 p-0 flex-1 sm:flex-none"
            >
              {fullscreen ? <Minimize className="h-3 w-3" /> : <Maximize className="h-3 w-3" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm" 
              onClick={applySmartAdjust}
              aria-label="Smart adjust"
              title="Smart adjust (optimize layout)"
              className="relative h-7 w-7 p-0 flex-1 sm:flex-none"
            >
              <Dices className="h-3 w-3" />
              <span className="absolute -top-1 -right-1 bg-primary h-1.5 w-1.5 rounded-full"></span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm" 
              onClick={() => setShowPlaceholders(!showPlaceholders)}
              aria-label="Toggle placeholders"
              title={showPlaceholders ? "Hide placeholders" : "Show placeholders"}
              className="h-7 w-7 p-0 flex-1 sm:flex-none"
            >
              {showPlaceholders ? <PanelLeftClose className="h-3 w-3" /> : <PanelRightClose className="h-3 w-3" />}
            </Button>
            
            {/* Test pages button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setTotalPages(Math.max(2, totalPages));
                toast({
                  title: "Multi-page mode activated",
                  description: "The resume preview now shows multiple pages for testing.",
                  duration: 3000
                });
              }}
              title="Test multi-page view"
              className="h-7 w-7 p-0 flex-1 sm:flex-none"
            >
              <FileText className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {/* Feature tooltips - Only shown on larger screens */}
        <div className="hidden md:flex items-center gap-2 mt-3 text-xs text-muted-foreground">
          <div className="flex items-center">
            <Dices className="h-3.5 w-3.5 mr-1 text-primary" />
            <span>Smart Adjust: Optimize spacing</span>
          </div>
          <div className="h-3 w-[1px] bg-muted-foreground/30"></div>
          <div className="flex items-center">
            <FileText className="h-3.5 w-3.5 mr-1" />
            <span>Test Pages: Try pagination</span>
          </div>
        </div>
      </div>

      {/* Resume container with standard US Letter dimensions */}
      <div 
        className={cn(
          "flex justify-center p-4 overflow-auto bg-gray-100 dark:bg-gray-900",
          fullscreen ? "fixed inset-0 z-50 p-8" : "max-h-[800px]"
        )}
      >
        {/* US Letter paper size is 8.5" x 11" (215.9mm x 279.4mm) */}
        <div 
          ref={resumeRef}
          className={cn(
            "w-[8.5in] h-[11in] bg-white text-black shadow-lg transition-transform duration-200",
            "origin-top mx-auto"
          )}
          style={{ 
            transform: `scale(${zoom})`,
            marginTop: fullscreen ? '1rem' : '0',
            marginBottom: fullscreen ? '4rem' : '0'
          }}
        >
          {/* Resume content with adjustable spacing */}
          <div 
            ref={contentRef}
            className={cn(
              "h-full p-6 overflow-hidden",
              compact ? "space-y-3" : "space-y-6"
            )}
            style={{
              // Show correct page based on currentPage (simulate pagination)
              transform: `translateY(-${(currentPage - 1) * 100}%)`,
              transition: 'transform 0.3s ease-in-out'
            }}
          >
            {/* Personal information section */}
            <header className={cn(
              "border-b border-gray-200",
              compact ? "pb-2" : "pb-4"
            )}>
              <h1 className={cn(
                "font-bold", 
                compact ? "text-xl mb-0.5" : "text-2xl mb-1"
              )}>
                {personalInfo?.firstName || (showPlaceholders && placeholders.personalInfo.firstName)} {personalInfo?.lastName || (showPlaceholders && placeholders.personalInfo.lastName)}
              </h1>
              
              <p className={cn(
                "text-gray-700", 
                compact ? "text-sm mb-1" : "mb-2"
              )}>
                {personalInfo?.headline || (showPlaceholders && placeholders.personalInfo.headline)}
              </p>
              
              <div className={cn(
                "flex flex-wrap text-gray-600",
                compact ? "gap-2 text-xs" : "gap-3 text-sm"
              )}>
                <div className="flex items-center">
                  <Mail className={compact ? "h-3 w-3 mr-1" : "h-4 w-4 mr-1"} />
                  <span>{personalInfo?.email || (showPlaceholders && placeholders.personalInfo.email)}</span>
                </div>
                
                <div className="flex items-center">
                  <Phone className={compact ? "h-3 w-3 mr-1" : "h-4 w-4 mr-1"} />
                  <span>{personalInfo?.phone || (showPlaceholders && placeholders.personalInfo.phone)}</span>
                </div>
              </div>
              
              <p className={cn(
                "leading-relaxed",
                compact ? "mt-2 text-xs" : "mt-3 text-sm"
              )}>
                {stripHtml(personalInfo?.summary || '') || (showPlaceholders && placeholders.personalInfo.summary)}
              </p>
            </header>

            {/* Experience section - always shown */}
            <section className={cn(
              compact ? "space-y-2" : "space-y-4"
            )}>
              <h2 className={cn(
                "font-bold border-b border-gray-200 pb-1",
                compact ? "text-base" : "text-lg"
              )}>
                Experience
              </h2>
              
              {experience.length > 0 ? (
                experience.map((exp) => (
                  <div key={exp.id} className={compact ? "space-y-0.5" : "space-y-1"}>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold">{exp.title}</h3>
                      <span className={cn(
                        "text-gray-600",
                        compact ? "text-xs" : "text-sm"
                      )}>
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                    <div className={cn(
                      "font-medium text-gray-700",
                      compact ? "text-xs" : "text-sm"
                    )}>
                      {exp.company}
                    </div>
                    <p className={compact ? "text-xs" : "text-sm"}>
                      {stripHtml(exp.description)}
                    </p>
                  </div>
                ))
              ) : showPlaceholders ? (
                // Placeholder experience item
                <div className={compact ? "space-y-0.5" : "space-y-1"}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold">{placeholders.experienceItem.title}</h3>
                    <span className={cn(
                      "text-gray-600",
                      compact ? "text-xs" : "text-sm"
                    )}>
                      {placeholders.experienceItem.startDate} - {placeholders.experienceItem.endDate}
                    </span>
                  </div>
                  <div className={cn(
                    "font-medium text-gray-700",
                    compact ? "text-xs" : "text-sm"
                  )}>
                    {placeholders.experienceItem.company}
                  </div>
                  <p className={cn(
                    "text-gray-500 italic",
                    compact ? "text-xs" : "text-sm"
                  )}>
                    {placeholders.experienceItem.description}
                  </p>
                </div>
              ) : null}
            </section>

            {/* Education section - always shown */}
            <section className={compact ? "space-y-2" : "space-y-4"}>
              <h2 className={cn(
                "font-bold border-b border-gray-200 pb-1",
                compact ? "text-base" : "text-lg"
              )}>
                Education
              </h2>
              
              {education.length > 0 ? (
                education.map((edu) => (
                  <div key={edu.id} className={compact ? "space-y-0.5" : "space-y-1"}>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold">{edu.degree}</h3>
                      <span className={cn(
                        "text-gray-600",
                        compact ? "text-xs" : "text-sm"
                      )}>
                        {edu.startDate} - {edu.endDate}
                      </span>
                    </div>
                    <div className={cn(
                      "font-medium text-gray-700",
                      compact ? "text-xs" : "text-sm"
                    )}>
                      {edu.institution}
                    </div>
                    <p className={compact ? "text-xs" : "text-sm"}>
                      {stripHtml(edu.description)}
                    </p>
                  </div>
                ))
              ) : showPlaceholders ? (
                // Placeholder education item
                <div className={compact ? "space-y-0.5" : "space-y-1"}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold">{placeholders.educationItem.degree}</h3>
                    <span className={cn(
                      "text-gray-600",
                      compact ? "text-xs" : "text-sm"
                    )}>
                      {placeholders.educationItem.startDate} - {placeholders.educationItem.endDate}
                    </span>
                  </div>
                  <div className={cn(
                    "font-medium text-gray-700",
                    compact ? "text-xs" : "text-sm"
                  )}>
                    {placeholders.educationItem.institution}
                  </div>
                  <p className={cn(
                    "text-gray-500 italic",
                    compact ? "text-xs" : "text-sm"
                  )}>
                    {placeholders.educationItem.description}
                  </p>
                </div>
              ) : null}
            </section>

            {/* Skills section - always shown */}
            <section className={compact ? "space-y-1" : "space-y-2"}>
              <h2 className={cn(
                "font-bold border-b border-gray-200 pb-1",
                compact ? "text-base" : "text-lg"
              )}>
                Skills
              </h2>
              
              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map((skill) => (
                    <span 
                      key={skill.id} 
                      className={cn(
                        "px-2 py-1 bg-gray-100 text-gray-800 rounded-md",
                        compact ? "text-xs" : "text-sm"
                      )}
                    >
                      {skill.name}
                    </span>
                  ))
                ) : showPlaceholders ? (
                  // Placeholder skills
                  Array(5).fill(0).map((_, index) => (
                    <span 
                      key={index} 
                      className={cn(
                        "px-2 py-1 bg-gray-100 text-gray-500 rounded-md italic",
                        compact ? "text-xs" : "text-sm"
                      )}
                    >
                      {placeholders.skillItem.name} {index + 1}
                    </span>
                  ))
                ) : null}
              </div>
            </section>

            {/* Projects section - always shown */}
            <section className={compact ? "space-y-2" : "space-y-4"}>
              <h2 className={cn(
                "font-bold border-b border-gray-200 pb-1",
                compact ? "text-base" : "text-lg"
              )}>
                Projects
              </h2>
              
              {projects.length > 0 ? (
                projects.map((project) => (
                  <div key={project.id} className={compact ? "space-y-0.5" : "space-y-1"}>
                    <h3 className="font-bold">{project.title}</h3>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-1">
                        {project.technologies.map((tech, index) => (
                          <span 
                            key={index} 
                            className={cn(
                              "px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded",
                              compact ? "text-[10px]" : "text-xs"
                            )}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className={compact ? "text-xs" : "text-sm"}>
                      {stripHtml(project.description)}
                    </p>
                    {project.link && (
                      <a 
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className={cn(
                          "text-blue-600 hover:underline inline-flex items-center",
                          compact ? "text-xs" : "text-sm"
                        )}
                      >
                        <Globe className={compact ? "h-2.5 w-2.5 mr-1" : "h-3 w-3 mr-1"} />
                        View Project
                      </a>
                    )}
                  </div>
                ))
              ) : showPlaceholders ? (
                // Placeholder project item
                <div className={compact ? "space-y-0.5" : "space-y-1"}>
                  <h3 className="font-bold">{placeholders.projectItem.title}</h3>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {placeholders.projectItem.technologies.map((tech, index) => (
                      <span 
                        key={index} 
                        className={cn(
                          "px-1.5 py-0.5 bg-gray-100 text-gray-500 italic rounded",
                          compact ? "text-[10px]" : "text-xs"
                        )}
                      >
                        {tech} {index + 1}
                      </span>
                    ))}
                  </div>
                  <p className={cn(
                    "text-gray-500 italic",
                    compact ? "text-xs" : "text-sm"
                  )}>
                    {placeholders.projectItem.description}
                  </p>
                  <a 
                    className={cn(
                      "text-blue-400 hover:underline inline-flex items-center italic",
                      compact ? "text-xs" : "text-sm"
                    )}
                  >
                    <Globe className={compact ? "h-2.5 w-2.5 mr-1" : "h-3 w-3 mr-1"} />
                    View Project
                  </a>
                </div>
              ) : null}
            </section>
          </div>
        </div>
      </div>
      
      {/* Enhanced Multi-page navigation footer */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center justify-center mt-4 space-y-2 py-3">
          <div className="flex items-center justify-center space-x-2 bg-black/20 px-4 py-2 rounded-full shadow-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              title="First page"
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
              <ChevronLeft className="h-4 w-4 -ml-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              title="Previous page"
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="px-2 py-1 rounded-md bg-black/40 min-w-[80px] text-center">
              <span className="text-sm font-medium">
                {currentPage} / {totalPages}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              title="Next page"
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              title="Last page"
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
              <ChevronRight className="h-4 w-4 -ml-3" />
            </Button>
          </div>
          
          {/* Visual page indicators */}
          <div className="flex space-x-1 mt-1">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all ${
                  currentPage === index + 1 
                    ? 'w-6 bg-primary' 
                    : 'w-2 bg-gray-400 hover:bg-gray-300'
                }`}
                onClick={() => setCurrentPage(index + 1)}
                title={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}