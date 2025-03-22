import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Folder, Plus, Edit, Trash2, LinkIcon, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { ProjectItem } from "@/hooks/use-resume-data";

interface ProjectsSectionProps {
  projects: ProjectItem[];
  resumeId?: string;
  onUpdate: (projects: ProjectItem[]) => void;
  onAdd?: () => string; // Returns the new ID
}

/**
 * ProjectsSection component for managing project items in the resume
 */
export function ProjectsSection({ 
  projects, 
  resumeId, 
  onUpdate,
  onAdd
}: ProjectsSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<ProjectItem>({
    id: "",
    title: "",
    description: "",
    technologies: [],
    link: ""
  });
  const [newTechnology, setNewTechnology] = useState("");

  // Start editing a project
  const startEditing = (item: ProjectItem) => {
    setFormData({ ...item });
    setEditingId(item.id);
    setIsAdding(false);
  };

  // Start adding a new project
  const startAdding = () => {
    setFormData({
      id: onAdd ? onAdd() : uuidv4(),
      title: "",
      description: "",
      technologies: [],
      link: ""
    });
    setEditingId(null);
    setIsAdding(true);
  };

  // Cancel editing or adding
  const cancelEditing = () => {
    setEditingId(null);
    setIsAdding(false);
  };

  // Handle form input changes
  const handleChange = (field: keyof ProjectItem, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Save the current project being edited or added
  const saveProject = () => {
    if (isAdding) {
      onUpdate([...projects, formData]);
    } else if (editingId) {
      onUpdate(projects.map(item => item.id === editingId ? formData : item));
    }
    setEditingId(null);
    setIsAdding(false);
  };

  // Delete a project
  const deleteProject = (id: string) => {
    onUpdate(projects.filter(item => item.id !== id));
  };

  // Add a technology to the project
  const addTechnology = () => {
    if (newTechnology.trim() === "") return;
    
    setFormData(prev => ({
      ...prev,
      technologies: [...prev.technologies, newTechnology.trim()]
    }));
    
    setNewTechnology("");
  };

  // Remove a technology from the project
  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  return (
    <div className="cosmic-card border border-white/10 bg-black/30 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Folder className="h-5 w-5 text-blue-400" />
          <h2 className="text-lg font-medium text-white">Projects</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
          onClick={startAdding}
          disabled={isAdding}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Project
        </Button>
      </div>
      
      {/* Project Form (editing or adding) */}
      {(isAdding || editingId) && (
        <Card className="mb-6 bg-gray-800/50 border-gray-700">
          <CardContent className="pt-6">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="title" className="text-gray-200">Project Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={e => handleChange('title', e.target.value)}
                  className="cosmic-input mt-1"
                  placeholder="e.g., E-commerce Website"
                />
              </div>
              
              <div>
                <Label htmlFor="description" className="text-gray-200">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e => handleChange('description', e.target.value)}
                  className="cosmic-textarea mt-1"
                  placeholder="Describe the project, your role, and its impact..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="link" className="text-gray-200">Project Link (Optional)</Label>
                <Input
                  id="link"
                  value={formData.link || ""}
                  onChange={e => handleChange('link', e.target.value)}
                  className="cosmic-input mt-1"
                  placeholder="e.g., https://github.com/username/project"
                />
              </div>
              
              <div>
                <Label className="text-gray-200">Technologies Used</Label>
                <div className="flex mt-1 mb-2">
                  <Input
                    value={newTechnology}
                    onChange={e => setNewTechnology(e.target.value)}
                    className="cosmic-input flex-1"
                    placeholder="e.g., React, Node.js"
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTechnology();
                      }
                    }}
                  />
                  <Button
                    className="ml-2 bg-blue-600 hover:bg-blue-700"
                    onClick={addTechnology}
                  >
                    Add
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.technologies.map((tech, index) => (
                    <div 
                      key={index} 
                      className="flex items-center bg-blue-900/20 border border-blue-900/30 rounded-md py-1 px-2"
                    >
                      <span className="text-blue-300 text-sm">{tech}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 ml-1 text-gray-400 hover:text-white"
                        onClick={() => removeTechnology(tech)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  
                  {formData.technologies.length === 0 && (
                    <div className="text-gray-400 text-sm italic">
                      No technologies added yet
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-2">
                <Button 
                  variant="outline" 
                  onClick={cancelEditing}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={saveProject}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* List of Project Items */}
      <div className="space-y-4">
        {projects.length === 0 && !isAdding ? (
          <div className="text-center py-6 text-gray-400">
            <Folder className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>No projects added yet. Add projects to showcase your work and technical abilities.</p>
          </div>
        ) : (
          projects.map(item => (
            <div 
              key={item.id} 
              className={`cosmic-experience-item ${editingId === item.id ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  {item.link && (
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 text-sm flex items-center hover:underline"
                    >
                      <LinkIcon className="h-3 w-3 mr-1" />
                      {item.link.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
                <div className="cosmic-item-actions">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="cosmic-item-button"
                    onClick={() => startEditing(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="cosmic-item-button cosmic-item-button-delete"
                    onClick={() => deleteProject(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-2 text-gray-300 text-sm">
                {item.description}
              </div>
              
              {item.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {item.technologies.map((tech, index) => (
                    <span 
                      key={index}
                      className="inline-block bg-blue-900/30 text-blue-300 px-2 py-0.5 rounded text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}