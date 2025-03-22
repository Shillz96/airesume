import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Code, Plus, Edit, Trash2, Sparkles } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { SkillItem } from "@/hooks/use-resume-data";

// For the proficiency slider
import { Slider } from "@/components/ui/slider";

interface SkillsSectionProps {
  skills: SkillItem[];
  resumeId?: string;
  onUpdate: (skills: SkillItem[]) => void;
  onAdd?: () => string; // Returns the new ID
}

/**
 * SkillsSection component for managing skills in the resume
 */
export function SkillsSection({ 
  skills, 
  resumeId, 
  onUpdate,
  onAdd
}: SkillsSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<SkillItem>({
    id: "",
    name: "",
    proficiency: 3, // Default to medium proficiency (1-5 scale)
    category: "technical" // Default category
  });

  // Start editing a skill
  const startEditing = (item: SkillItem) => {
    setFormData({ ...item });
    setEditingId(item.id);
    setIsAdding(false);
  };

  // Start adding a new skill
  const startAdding = () => {
    setFormData({
      id: onAdd ? onAdd() : uuidv4(),
      name: "",
      proficiency: 3,
      category: "technical"
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
  const handleChange = (field: keyof SkillItem, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Save the current skill being edited or added
  const saveSkill = () => {
    if (isAdding) {
      onUpdate([...skills, formData]);
    } else if (editingId) {
      onUpdate(skills.map(item => item.id === editingId ? formData : item));
    }
    setEditingId(null);
    setIsAdding(false);
  };

  // Delete a skill
  const deleteSkill = (id: string) => {
    onUpdate(skills.filter(item => item.id !== id));
  };

  // Get proficiency label based on numeric value
  const getProficiencyLabel = (value: number): string => {
    const labels = ["Beginner", "Novice", "Intermediate", "Advanced", "Expert"];
    return labels[value - 1] || "Intermediate";
  };

  // Generate categorized skills for display
  const categorizedSkills = skills.reduce<Record<string, SkillItem[]>>((acc, skill) => {
    const category = skill.category || "technical";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

  // Categories for the UI
  const CATEGORIES = [
    { id: "technical", label: "Technical" },
    { id: "soft", label: "Soft Skills" },
    { id: "language", label: "Languages" },
    { id: "other", label: "Other" }
  ];

  // Get AI suggestions for skills (placeholder function)
  const getSuggestedSkills = () => {
    // This would trigger the AI assistant in a real implementation
    console.log("Getting skill suggestions...");
  };

  return (
    <div className="cosmic-section p-6 rounded-lg" style={{ padding: 'var(--space-6)' }}>
      <div className="flex justify-between items-center mb-6" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="cosmic-profile-header flex items-center gap-2" style={{ gap: 'var(--space-2)' }}>
          <Code className="h-5 w-5 text-cosmic-accent" />
          <h2 className="text-lg font-medium text-cosmic-text">Skills</h2>
        </div>
        <div className="flex gap-2" style={{ gap: 'var(--space-2)' }}>
          <Button
            variant="outline"
            size="sm"
            className="cosmic-button-outline border-cosmic-accent/30 bg-cosmic-accent/10 text-cosmic-accent hover:bg-cosmic-accent/20"
            onClick={getSuggestedSkills}
          >
            <Sparkles className="h-4 w-4 mr-1" style={{ marginRight: 'var(--space-1)' }} />
            Get AI Suggestions
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="cosmic-button-outline border-cosmic-accent/30 bg-cosmic-accent/10 text-cosmic-accent hover:bg-cosmic-accent/20"
            onClick={startAdding}
            disabled={isAdding}
          >
            <Plus className="h-4 w-4 mr-1" style={{ marginRight: 'var(--space-1)' }} />
            Add Skill
          </Button>
        </div>
      </div>
      
      {/* Skill Form (editing or adding) */}
      {(isAdding || editingId) && (
        <Card className="cosmic-card mb-6 bg-cosmic-card-bg border-cosmic-border" style={{ marginBottom: 'var(--space-6)' }}>
          <CardContent className="cosmic-card-content pt-6" style={{ paddingTop: 'var(--space-6)' }}>
            <div className="grid gap-4" style={{ gap: 'var(--space-4)' }}>
              <div className="grid grid-cols-2 gap-4" style={{ gap: 'var(--space-4)' }}>
                <div className="cosmic-form-group">
                  <Label htmlFor="skillName" className="cosmic-form-label text-cosmic-text-secondary mb-1" style={{ marginBottom: 'var(--space-1)' }}>Skill Name</Label>
                  <Input
                    id="skillName"
                    value={formData.name}
                    onChange={e => handleChange('name', e.target.value)}
                    className="cosmic-form-input w-full bg-cosmic-input-bg border-cosmic-border text-cosmic-text"
                    placeholder="e.g., JavaScript, Project Management"
                  />
                </div>
                <div className="cosmic-form-group">
                  <Label htmlFor="category" className="cosmic-form-label text-cosmic-text-secondary mb-1" style={{ marginBottom: 'var(--space-1)' }}>Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={e => handleChange('category', e.target.value)}
                    className="cosmic-form-select w-full h-10 bg-cosmic-input-bg border-cosmic-border text-cosmic-text px-3 py-2"
                    style={{ padding: 'var(--space-2) var(--space-3)' }}
                  >
                    {CATEGORIES.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="cosmic-form-group">
                <div className="flex justify-between items-center mb-2" style={{ marginBottom: 'var(--space-2)' }}>
                  <Label htmlFor="proficiency" className="cosmic-form-label text-cosmic-text-secondary">Proficiency Level</Label>
                  <span className="cosmic-badge text-sm text-cosmic-accent">
                    {getProficiencyLabel(formData.proficiency)}
                  </span>
                </div>
                
                <div className="px-1" style={{ padding: '0 var(--space-1)' }}>
                  <Slider
                    defaultValue={[formData.proficiency]}
                    value={[formData.proficiency]}
                    min={1}
                    max={5}
                    step={1}
                    onValueChange={values => handleChange('proficiency', values[0])}
                    className="cosmic-slider w-full"
                  />
                </div>
                
                <div className="flex justify-between text-xs text-cosmic-text-secondary mt-1 px-1" style={{ marginTop: 'var(--space-1)', padding: '0 var(--space-1)' }}>
                  <span>Beginner</span>
                  <span>Expert</span>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-2" style={{ gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                <Button 
                  variant="outline" 
                  onClick={cancelEditing}
                  className="cosmic-button-subtle border-cosmic-border text-cosmic-text-secondary hover:bg-cosmic-hover"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={saveSkill}
                  className="cosmic-button bg-cosmic-accent hover:bg-cosmic-accent-hover text-white"
                >
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Skills List - Categorized */}
      <div className="cosmic-skills-list">
        {skills.length === 0 && !isAdding ? (
          <div className="cosmic-empty-state text-center py-6 text-cosmic-text-secondary" style={{ padding: 'var(--space-6) 0' }}>
            <Code className="h-10 w-10 mx-auto mb-2 opacity-50" style={{ margin: '0 auto', marginBottom: 'var(--space-2)' }} />
            <p>No skills added yet. Add your key skills to highlight your expertise.</p>
          </div>
        ) : (
          <div className="space-y-6" style={{ '--space-y': 'var(--space-6)' } as React.CSSProperties}>
            {Object.entries(categorizedSkills).map(([category, categorySkills]) => (
              <div key={category} className="cosmic-skill-category space-y-3" style={{ '--space-y': 'var(--space-3)' } as React.CSSProperties}>
                <h3 className="cosmic-category-title text-sm font-medium text-cosmic-text-secondary uppercase tracking-wider">
                  {CATEGORIES.find(c => c.id === category)?.label || 'Other'}
                </h3>
                <div className="cosmic-skills-grid flex flex-wrap gap-2" style={{ gap: 'var(--space-2)' }}>
                  {categorySkills.map(skill => (
                    <div 
                      key={skill.id} 
                      className="cosmic-skill-chip group relative inline-flex items-center bg-cosmic-card-secondary/60 border border-cosmic-border rounded-md py-1 px-3"
                      style={{ padding: 'var(--space-1) var(--space-3)' }}
                    >
                      <span className="text-cosmic-text">
                        {skill.name}
                      </span>
                      <div className="ml-2 flex space-x-1 items-center" style={{ marginLeft: 'var(--space-2)', gap: 'var(--space-1)' }}>
                        <div className="cosmic-skill-level flex">
                          {[...Array(5)].map((_, i) => (
                            <div 
                              key={i} 
                              className={`w-1 h-1 rounded-full mx-px ${
                                i < skill.proficiency 
                                  ? 'bg-cosmic-accent' 
                                  : 'bg-cosmic-border'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="hidden group-hover:flex absolute right-0 top-0 -mt-2 -mr-2" style={{ marginTop: '-0.5rem', marginRight: '-0.5rem' }}>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5 p-0 bg-cosmic-accent text-white rounded-full hover:bg-cosmic-accent-hover shadow-md"
                          onClick={() => startEditing(skill)}
                          style={{ padding: 0 }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5 p-0 bg-cosmic-destructive text-white rounded-full hover:bg-cosmic-destructive-hover shadow-md ml-1"
                          onClick={() => deleteSkill(skill.id)}
                          style={{ padding: 0, marginLeft: 'var(--space-1)' }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}