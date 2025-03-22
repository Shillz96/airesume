import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Plus, Edit, Trash2, Sparkles } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { ExperienceItem } from "@/hooks/use-resume-data";

interface ExperienceSectionProps {
  experiences: ExperienceItem[];
  resumeId?: string;
  onUpdate: (experiences: ExperienceItem[]) => void;
  onAdd?: () => string; // Returns the new ID
}

/**
 * ExperienceSection component for managing work experience items in the resume
 */
export function ExperienceSection({ 
  experiences, 
  resumeId, 
  onUpdate,
  onAdd
}: ExperienceSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<ExperienceItem>({
    id: "",
    title: "",
    company: "",
    startDate: "",
    endDate: "",
    description: ""
  });

  // Start editing an experience entry
  const startEditing = (item: ExperienceItem) => {
    setFormData({ ...item });
    setEditingId(item.id);
    setIsAdding(false);
  };

  // Start adding a new experience entry
  const startAdding = () => {
    setFormData({
      id: onAdd ? onAdd() : uuidv4(),
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      description: ""
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
  const handleChange = (field: keyof ExperienceItem, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Save the current experience entry being edited or added
  const saveExperience = () => {
    if (isAdding) {
      onUpdate([...experiences, formData]);
    } else if (editingId) {
      onUpdate(experiences.map(item => item.id === editingId ? formData : item));
    }
    setEditingId(null);
    setIsAdding(false);
  };

  // Delete an experience entry
  const deleteExperience = (id: string) => {
    onUpdate(experiences.filter(item => item.id !== id));
  };

  // Generate AI suggestions for bullet points (placeholder function)
  const generateBulletPoints = () => {
    // This would trigger the AI assistant in a real implementation
    console.log("Generating bullet points...");
  };

  return (
    <div className="cosmic-card border border-white/10 bg-black/30 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-blue-400" />
          <h2 className="text-lg font-medium text-white">Experience</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
          onClick={startAdding}
          disabled={isAdding}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Experience
        </Button>
      </div>
      
      {/* Experience Form (editing or adding) */}
      {(isAdding || editingId) && (
        <Card className="mb-6 bg-gray-800/50 border-gray-700">
          <CardContent className="pt-6">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="text-gray-200">Job Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={e => handleChange('title', e.target.value)}
                    className="cosmic-input mt-1"
                    placeholder="e.g., Software Engineer"
                  />
                </div>
                <div>
                  <Label htmlFor="company" className="text-gray-200">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={e => handleChange('company', e.target.value)}
                    className="cosmic-input mt-1"
                    placeholder="e.g., TechCorp Inc."
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate" className="text-gray-200">Start Date</Label>
                  <Input
                    id="startDate"
                    type="month"
                    value={formData.startDate}
                    onChange={e => handleChange('startDate', e.target.value)}
                    className="cosmic-input mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate" className="text-gray-200">End Date</Label>
                  <Input
                    id="endDate"
                    type="month"
                    value={formData.endDate}
                    onChange={e => handleChange('endDate', e.target.value)}
                    className="cosmic-input mt-1"
                    placeholder="Present (if currently employed)"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="description" className="text-gray-200">
                    Description
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="border-blue-500/30 text-blue-400 hover:bg-blue-900/20 px-2 h-7"
                    onClick={generateBulletPoints}
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    Generate Bullet Points
                  </Button>
                </div>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e => handleChange('description', e.target.value)}
                  className="cosmic-textarea mt-1"
                  placeholder="Describe your responsibilities, achievements, and impact. Use bullet points starting with strong action verbs."
                  rows={5}
                />
                <div className="text-xs text-gray-400 mt-1">
                  Pro tip: Use bullet points and quantify achievements with metrics when possible.
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
                  onClick={saveExperience}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* List of Experience Items */}
      <div className="space-y-4">
        {experiences.length === 0 && !isAdding ? (
          <div className="text-center py-6 text-gray-400">
            <Briefcase className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>No work experience added yet. Add your professional experience to strengthen your resume.</p>
          </div>
        ) : (
          experiences.map(item => (
            <div 
              key={item.id} 
              className={`cosmic-experience-item ${editingId === item.id ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <div className="text-blue-400">{item.company}</div>
                  <div className="text-gray-400 text-sm">
                    {item.startDate} - {item.endDate || "Present"}
                  </div>
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
                    onClick={() => deleteExperience(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {item.description && (
                <div className="mt-2 text-gray-300 text-sm whitespace-pre-line">
                  {item.description}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}