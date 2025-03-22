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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FolderGit2 className="h-5 w-5" style={{ color: getCosmicColor('primary') }} />
          <h3 className="text-lg font-semibold">Projects</h3>
        </div>
        <CosmicButton
          size="sm"
          variant="outline"
          iconLeft={<Plus className="h-4 w-4" />}
          onClick={handleAddProject}
        >
          Add Project
        </CosmicButton>
      </div>

      {projects.length === 0 ? (
        <Card className="border border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <FolderGit2 className="h-12 w-12 mb-2 opacity-30" />
            <p className="text-center text-sm mb-4">
              Add your notable projects to showcase your practical skills and achievements
            </p>
            <Button variant="outline" size="sm" onClick={handleAddProject}>
              Add Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Accordion
          type="single"
          collapsible
          value={expandedItem || undefined}
          onValueChange={(value) => setExpandedItem(value)}
          className="space-y-2"
        >
          {projects.map((project) => (
            <AccordionItem
              key={project.id}
              value={project.id}
              className={cn(
                "border rounded-md overflow-hidden",
                expandedItem === project.id ? "ring-1 ring-primary/20" : ""
              )}
            >
              <AccordionTrigger className="px-4 py-3 hover:bg-accent/50 data-[state=open]:bg-accent/60">
                <div className="flex flex-1 justify-between items-center">
                  <div className="text-left">
                    <p className="font-medium">
                      {project.title || "New Project"}
                    </p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1 max-w-xs">
                        {project.technologies.slice(0, 3).map((tech, index) => (
                          <Badge key={index} variant="secondary" className="text-xs px-1.5 py-0">
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 3 && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0">
                            +{project.technologies.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  {project.link && (
                    <div className="mr-4 opacity-70">
                      <LinkIcon className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <div className="p-4 space-y-4 bg-card rounded-b-md">
                  <div className="space-y-2">
                    <Label htmlFor={`project-title-${project.id}`}>Project Title</Label>
                    <Input
                      id={`project-title-${project.id}`}
                      value={project.title}
                      onChange={(e) => handleProjectChange(project.id, 'title', e.target.value)}
                      placeholder="e.g., E-commerce Website, Mobile App, Research Paper"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`project-description-${project.id}`}>Description</Label>
                    <Textarea
                      id={`project-description-${project.id}`}
                      value={project.description}
                      onChange={(e) => handleProjectChange(project.id, 'description', e.target.value)}
                      placeholder="Describe the project, your role, and key achievements"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`project-link-${project.id}`}>Project Link (Optional)</Label>
                    <Input
                      id={`project-link-${project.id}`}
                      value={project.link || ''}
                      onChange={(e) => handleProjectChange(project.id, 'link', e.target.value)}
                      placeholder="e.g., https://github.com/yourusername/project"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`project-tech-${project.id}`}>Technologies Used</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {project.technologies.map((tech, index) => (
                        <Badge 
                          key={index} 
                          className="flex items-center gap-1 px-2 py-1"
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
                    <div className="flex gap-2">
                      <Input
                        id={`project-tech-${project.id}`}
                        value={activeTechProjectId === project.id ? techInput : ''}
                        onChange={(e) => setTechInput(e.target.value)}
                        onFocus={() => setActiveTechProjectId(project.id)}
                        onKeyDown={(e) => handleTechKeyPress(e, project.id)}
                        placeholder="e.g., React, TypeScript, Node.js"
                      />
                      <Button 
                        type="button" 
                        size="sm"
                        onClick={() => handleAddTechnology(project.id)}
                      >
                        Add
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Press Enter after each technology to add it, or click the Add button
                    </p>
                  </div>

                  <div className="flex justify-end pb-2 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      onClick={() => handleRemoveProject(project.id)}
                    >
                      <Trash className="h-4 w-4 mr-1" />
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