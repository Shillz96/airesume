import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CosmicButton } from '@/components/cosmic-button';
import { Trash, Plus, FolderGit2, Link as LinkIcon, X } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ProjectItem } from '@/hooks/use-resume-data';
import { cn } from '@/lib/utils';
import { getCosmicColor, getSpacing } from '@/lib/theme-utils';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  resumeId?: string;
  onUpdate: (projects: ProjectItem[]) => void;
  onAdd?: () => string; // Returns the new ID
}

/**
 * ProjectsSection component for managing projects in the resume
 */
export function ProjectsSection({ 
  projects,
  resumeId,
  onUpdate,
  onAdd
}: ProjectsSectionProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [techInput, setTechInput] = useState<string>('');
  const [activeTechProjectId, setActiveTechProjectId] = useState<string | null>(null);

  // Handle adding a new project
  const handleAddProject = () => {
    if (onAdd) {
      const newId = onAdd();
      setExpandedItem(newId);
    } else {
      // Fallback if onAdd not provided
      const newProject = {
        id: crypto.randomUUID(),
        title: '',
        description: '',
        technologies: [],
        link: ''
      };
      onUpdate([...projects, newProject]);
      setExpandedItem(newProject.id);
    }
  };

  // Handle removing a project
  const handleRemoveProject = (id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    onUpdate(updatedProjects);
    if (expandedItem === id) {
      setExpandedItem(null);
    }
  };

  // Handle updating a field in a project
  const handleProjectChange = (id: string, field: keyof ProjectItem, value: any) => {
    const updatedProjects = projects.map(project => {
      if (project.id === id) {
        return { ...project, [field]: value };
      }
      return project;
    });
    onUpdate(updatedProjects);
  };

  // Handle adding a technology to a project
  const handleAddTechnology = (projectId: string) => {
    if (!techInput.trim()) return;
    
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        // Check if tech already exists to avoid duplicates
        if (!project.technologies.includes(techInput.trim())) {
          return {
            ...project,
            technologies: [...project.technologies, techInput.trim()]
          };
        }
      }
      return project;
    });
    
    onUpdate(updatedProjects);
    setTechInput('');
  };

  // Handle removing a technology from a project
  const handleRemoveTechnology = (projectId: string, tech: string) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          technologies: project.technologies.filter(t => t !== tech)
        };
      }
      return project;
    });
    
    onUpdate(updatedProjects);
  };

  // Handle key press in technology input (add on Enter)
  const handleTechKeyPress = (e: React.KeyboardEvent, projectId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTechnology(projectId);
    }
  };

  return (
    <div className="resume-space-y-4">
      <div className="flex justify-between items-center resume-mb-4">
        <div className="flex items-center resume-gap-2">
          <FolderGit2 className="h-5 w-5 text-resume-text-accent" />
          <h3 className="text-lg font-semibold text-resume-text-primary">Projects</h3>
        </div>
        <CosmicButton
          size="sm"
          variant="outline"
          iconLeft={<Plus className="h-4 w-4" />}
          onClick={handleAddProject}
          withGlow
        >
          Add Project
        </CosmicButton>
      </div>

      {projects.length === 0 ? (
        <div className="cosmic-panel resume-p-6 flex flex-col items-center justify-center">
          <FolderGit2 className="h-12 w-12 resume-mb-2 text-resume-text-accent opacity-30" />
          <p className="text-center text-sm resume-mb-4 text-resume-text-secondary">
            Add your notable projects to showcase your practical skills and achievements
          </p>
          <CosmicButton 
            variant="outline" 
            size="sm" 
            onClick={handleAddProject}
            withGlow
          >
            Add Project
          </CosmicButton>
        </div>
      ) : (
        <Accordion
          type="single"
          collapsible
          value={expandedItem || undefined}
          onValueChange={(value) => setExpandedItem(value)}
          className="resume-space-y-2"
        >
          {projects.map((project) => (
            <AccordionItem
              key={project.id}
              value={project.id}
              className={cn(
                "cosmic-panel overflow-hidden",
                expandedItem === project.id ? "ring-1 ring-resume-panel-border" : ""
              )}
            >
              <AccordionTrigger className="resume-p-4 hover:bg-primary/10 data-[state=open]:bg-primary/20">
                <div className="flex flex-1 justify-between items-center">
                  <div className="text-left">
                    <p className="font-medium text-resume-text-primary">
                      {project.title || "New Project"}
                    </p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap resume-gap-1 resume-mt-1 max-w-xs">
                        {project.technologies.slice(0, 3).map((tech, index) => (
                          <Badge key={index} variant="secondary" className="text-xs px-1.5 py-0 bg-primary/20 text-resume-text-accent">
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 3 && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0 text-resume-text-muted border-resume-panel-border">
                            +{project.technologies.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  {project.link && (
                    <div className="resume-mr-4 text-resume-text-accent">
                      <LinkIcon className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <div className="resume-p-4 resume-space-y-4 bg-resume-panel-bg rounded-b-md">
                  <div className="resume-space-y-2">
                    <Label htmlFor={`project-title-${project.id}`} className="text-resume-text-secondary">Project Title</Label>
                    <Input
                      id={`project-title-${project.id}`}
                      value={project.title}
                      onChange={(e) => handleProjectChange(project.id, 'title', e.target.value)}
                      placeholder="e.g., E-commerce Website, Mobile App, Research Paper"
                      className="cosmic-input"
                    />
                  </div>

                  <div className="resume-space-y-2">
                    <Label htmlFor={`project-description-${project.id}`} className="text-resume-text-secondary">Description</Label>
                    <Textarea
                      id={`project-description-${project.id}`}
                      value={project.description}
                      onChange={(e) => handleProjectChange(project.id, 'description', e.target.value)}
                      placeholder="Describe the project, your role, and key achievements"
                      rows={3}
                      className="cosmic-input"
                    />
                  </div>

                  <div className="resume-space-y-2">
                    <Label htmlFor={`project-link-${project.id}`} className="text-resume-text-secondary">Project Link (Optional)</Label>
                    <Input
                      id={`project-link-${project.id}`}
                      value={project.link || ''}
                      onChange={(e) => handleProjectChange(project.id, 'link', e.target.value)}
                      placeholder="e.g., https://github.com/yourusername/project"
                      className="cosmic-input"
                    />
                  </div>

                  <div className="resume-space-y-2">
                    <Label htmlFor={`project-tech-${project.id}`} className="text-resume-text-secondary">Technologies Used</Label>
                    <div className="flex flex-wrap resume-gap-2 resume-mb-2">
                      {project.technologies.map((tech, index) => (
                        <Badge 
                          key={index} 
                          className="flex items-center resume-gap-1 px-2 py-1 bg-primary/20 text-resume-text-accent"
                        >
                          {tech}
                          <X
                            className="h-3 w-3 cursor-pointer ml-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveTechnology(project.id, tech);
                            }}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex resume-gap-2">
                      <Input
                        id={`project-tech-${project.id}`}
                        value={activeTechProjectId === project.id ? techInput : ''}
                        onChange={(e) => setTechInput(e.target.value)}
                        onFocus={() => setActiveTechProjectId(project.id)}
                        onKeyDown={(e) => handleTechKeyPress(e, project.id)}
                        placeholder="e.g., React, TypeScript, Node.js"
                        className="cosmic-input"
                      />
                      <Button 
                        type="button" 
                        size="sm"
                        onClick={() => handleAddTechnology(project.id)}
                        className="bg-primary/20 text-resume-text-accent hover:bg-primary/30 hover:text-resume-text-primary"
                      >
                        Add
                      </Button>
                    </div>
                    <p className="text-xs text-resume-text-muted resume-mt-1">
                      Press Enter after each technology to add it, or click the Add button
                    </p>
                  </div>

                  <div className="flex justify-end resume-pt-2 resume-pb-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 border border-resume-panel-border"
                      onClick={() => handleRemoveProject(project.id)}
                    >
                      <Trash className="h-4 w-4 resume-mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}