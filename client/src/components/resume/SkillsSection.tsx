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
    <div className="cosmic-card border border-white/10 bg-black/30 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-blue-400" />
          <h2 className="text-lg font-medium text-white">Skills</h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
            onClick={getSuggestedSkills}
          >
            <Sparkles className="h-4 w-4 mr-1" />
            Get AI Suggestions
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
            onClick={startAdding}
            disabled={isAdding}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Skill
          </Button>
        </div>
      </div>
      
      {/* Skill Form (editing or adding) */}
      {(isAdding || editingId) && (
        <Card className="mb-6 bg-gray-800/50 border-gray-700">
          <CardContent className="pt-6">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="skillName" className="text-gray-200">Skill Name</Label>
                  <Input
                    id="skillName"
                    value={formData.name}
                    onChange={e => handleChange('name', e.target.value)}
                    className="cosmic-input mt-1"
                    placeholder="e.g., JavaScript, Project Management"
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="text-gray-200">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={e => handleChange('category', e.target.value)}
                    className="cosmic-input mt-1 w-full h-10 px-3 py-2"
                  >
                    {CATEGORIES.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="proficiency" className="text-gray-200">Proficiency Level</Label>
                  <span className="text-sm text-blue-400">
                    {getProficiencyLabel(formData.proficiency)}
                  </span>
                </div>
                
                <div className="px-1">
                  <Slider
                    defaultValue={[formData.proficiency]}
                    value={[formData.proficiency]}
                    min={1}
                    max={5}
                    step={1}
                    onValueChange={values => handleChange('proficiency', values[0])}
                    className="w-full"
                  />
                </div>
                
                <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
                  <span>Beginner</span>
                  <span>Expert</span>
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
                  onClick={saveSkill}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Skills List - Categorized */}
      <div>
        {skills.length === 0 && !isAdding ? (
          <div className="text-center py-6 text-gray-400">
            <Code className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>No skills added yet. Add your key skills to highlight your expertise.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(categorizedSkills).map(([category, categorySkills]) => (
              <div key={category} className="space-y-3">
                <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                  {CATEGORIES.find(c => c.id === category)?.label || 'Other'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categorySkills.map(skill => (
                    <div 
                      key={skill.id} 
                      className="group relative inline-flex items-center bg-gray-800/70 border border-blue-900/30 rounded-md py-1 px-3"
                    >
                      <span className="text-white">
                        {skill.name}
                      </span>
                      <div className="ml-2 flex space-x-1 items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <div 
                              key={i} 
                              className={`w-1 h-1 rounded-full mx-px ${
                                i < skill.proficiency 
                                  ? 'bg-blue-400' 
                                  : 'bg-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="hidden group-hover:flex absolute right-0 top-0 -mt-2 -mr-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5 p-0 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-md"
                          onClick={() => startEditing(skill)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5 p-0 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-md ml-1"
                          onClick={() => deleteSkill(skill.id)}
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