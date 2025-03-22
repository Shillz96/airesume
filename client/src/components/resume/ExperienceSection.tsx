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
    <div className="cosmic-section p-6 rounded-lg" style={{ padding: 'var(--space-6)' }}>
      <div className="flex justify-between items-center mb-6" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="cosmic-profile-header flex items-center gap-2" style={{ gap: 'var(--space-2)' }}>
          <Briefcase className="h-5 w-5 text-cosmic-accent" />
          <h2 className="text-lg font-medium text-cosmic-text">Experience</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="cosmic-button-outline border-cosmic-accent/30 bg-cosmic-accent/10 text-cosmic-accent hover:bg-cosmic-accent/20"
          onClick={startAdding}
          disabled={isAdding}
        >
          <Plus className="h-4 w-4 mr-1" style={{ marginRight: 'var(--space-1)' }} />
          Add Experience
        </Button>
      </div>
      
      {/* Experience Form (editing or adding) */}
      {(isAdding || editingId) && (
        <Card className="cosmic-card mb-6 bg-cosmic-card-bg border-cosmic-border" style={{ marginBottom: 'var(--space-6)' }}>
          <CardContent className="cosmic-card-content pt-6" style={{ paddingTop: 'var(--space-6)' }}>
            <div className="grid gap-4" style={{ gap: 'var(--space-4)' }}>
              <div className="grid grid-cols-2 gap-4" style={{ gap: 'var(--space-4)' }}>
                <div className="cosmic-form-group">
                  <Label htmlFor="title" className="cosmic-form-label text-cosmic-text-secondary mb-1" style={{ marginBottom: 'var(--space-1)' }}>Job Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={e => handleChange('title', e.target.value)}
                    className="cosmic-form-input w-full bg-cosmic-input-bg border-cosmic-border text-cosmic-text"
                    placeholder="e.g., Software Engineer"
                  />
                </div>
                <div className="cosmic-form-group">
                  <Label htmlFor="company" className="cosmic-form-label text-cosmic-text-secondary mb-1" style={{ marginBottom: 'var(--space-1)' }}>Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={e => handleChange('company', e.target.value)}
                    className="cosmic-form-input w-full bg-cosmic-input-bg border-cosmic-border text-cosmic-text"
                    placeholder="e.g., TechCorp Inc."
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4" style={{ gap: 'var(--space-4)' }}>
                <div className="cosmic-form-group">
                  <Label htmlFor="startDate" className="cosmic-form-label text-cosmic-text-secondary mb-1" style={{ marginBottom: 'var(--space-1)' }}>Start Date</Label>
                  <Input
                    id="startDate"
                    type="month"
                    value={formData.startDate}
                    onChange={e => handleChange('startDate', e.target.value)}
                    className="cosmic-form-input w-full bg-cosmic-input-bg border-cosmic-border text-cosmic-text"
                  />
                </div>
                <div className="cosmic-form-group">
                  <Label htmlFor="endDate" className="cosmic-form-label text-cosmic-text-secondary mb-1" style={{ marginBottom: 'var(--space-1)' }}>End Date</Label>
                  <Input
                    id="endDate"
                    type="month"
                    value={formData.endDate}
                    onChange={e => handleChange('endDate', e.target.value)}
                    className="cosmic-form-input w-full bg-cosmic-input-bg border-cosmic-border text-cosmic-text"
                    placeholder="Present (if currently employed)"
                  />
                </div>
              </div>
              
              <div className="cosmic-form-group">
                <div className="flex justify-between items-center mb-1" style={{ marginBottom: 'var(--space-1)' }}>
                  <Label htmlFor="description" className="cosmic-form-label text-cosmic-text-secondary">
                    Description
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="cosmic-button-outline text-cosmic-accent hover:bg-cosmic-accent/10 px-2 h-7"
                    onClick={generateBulletPoints}
                    style={{ padding: '0 var(--space-2)', height: '1.75rem' }}
                  >
                    <Sparkles className="h-4 w-4 mr-1" style={{ marginRight: 'var(--space-1)' }} />
                    Generate Bullet Points
                  </Button>
                </div>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e => handleChange('description', e.target.value)}
                  className="cosmic-form-textarea w-full bg-cosmic-input-bg border-cosmic-border text-cosmic-text"
                  placeholder="Describe your responsibilities, achievements, and impact. Use bullet points starting with strong action verbs."
                  rows={5}
                />
                <div className="text-xs text-cosmic-text-secondary mt-1" style={{ marginTop: 'var(--space-1)' }}>
                  Pro tip: Use bullet points and quantify achievements with metrics when possible.
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-4" style={{ gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
                <Button 
                  variant="outline" 
                  onClick={cancelEditing}
                  className="cosmic-button-subtle border-cosmic-border text-cosmic-text-secondary hover:bg-cosmic-hover"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={saveExperience}
                  className="cosmic-button bg-cosmic-accent hover:bg-cosmic-accent-hover text-white"
                >
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* List of Experience Items */}
      <div className="cosmic-experience-list space-y-4" style={{ '--space-y': 'var(--space-4)' } as React.CSSProperties}>
        {experiences.length === 0 && !isAdding ? (
          <div className="cosmic-empty-state text-center py-6 text-cosmic-text-secondary" style={{ padding: 'var(--space-6) 0' }}>
            <Briefcase className="h-10 w-10 mx-auto mb-2 opacity-50" style={{ margin: '0 auto', marginBottom: 'var(--space-2)' }} />
            <p>No work experience added yet. Add your professional experience to strengthen your resume.</p>
          </div>
        ) : (
          experiences.map(item => (
            <div 
              key={item.id} 
              className={`cosmic-experience-item bg-cosmic-card-secondary/20 border border-cosmic-border rounded-md p-4 hover:bg-cosmic-card-hover transition-colors ${editingId === item.id ? 'ring-2 ring-cosmic-accent' : ''}`}
              style={{ padding: 'var(--space-4)' }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-cosmic-text">{item.title}</h3>
                  <div className="text-cosmic-accent">{item.company}</div>
                  <div className="text-cosmic-text-secondary text-sm">
                    {item.startDate} - {item.endDate || "Present"}
                  </div>
                </div>
                <div className="cosmic-item-actions flex space-x-1" style={{ gap: 'var(--space-1)' }}>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="cosmic-item-button h-7 w-7 rounded-full hover:bg-cosmic-hover"
                    onClick={() => startEditing(item)}
                    style={{ height: '1.75rem', width: '1.75rem' }}
                  >
                    <Edit className="h-3.5 w-3.5 text-cosmic-accent" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="cosmic-item-button h-7 w-7 rounded-full hover:bg-cosmic-hover"
                    onClick={() => deleteExperience(item.id)}
                    style={{ height: '1.75rem', width: '1.75rem' }}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-cosmic-destructive" />
                  </Button>
                </div>
              </div>
              {item.description && (
                <div className="mt-2 text-cosmic-text-secondary text-sm whitespace-pre-line" style={{ marginTop: 'var(--space-2)' }}>
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