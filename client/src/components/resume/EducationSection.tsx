import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Plus, Edit, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { EducationItem } from "@/hooks/use-resume-data";

interface EducationSectionProps {
  education: EducationItem[];
  resumeId?: string;
  onUpdate: (education: EducationItem[]) => void;
  onAdd?: () => string; // Returns the new ID
}

/**
 * EducationSection component for managing education history in the resume
 */
export function EducationSection({ 
  education, 
  resumeId, 
  onUpdate,
  onAdd 
}: EducationSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<EducationItem>({
    id: "",
    degree: "",
    institution: "",
    startDate: "",
    endDate: "",
    description: ""
  });

  // Start editing an education entry
  const startEditing = (item: EducationItem) => {
    setFormData({ ...item });
    setEditingId(item.id);
    setIsAdding(false);
  };

  // Start adding a new education entry
  const startAdding = () => {
    setFormData({
      id: onAdd ? onAdd() : uuidv4(),
      degree: "",
      institution: "",
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
  const handleChange = (field: keyof EducationItem, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Save the current education entry being edited or added
  const saveEducation = () => {
    if (isAdding) {
      onUpdate([...education, formData]);
    } else if (editingId) {
      onUpdate(education.map(item => item.id === editingId ? formData : item));
    }
    setEditingId(null);
    setIsAdding(false);
  };

  // Delete an education entry
  const deleteEducation = (id: string) => {
    onUpdate(education.filter(item => item.id !== id));
  };

  return (
    <div className="cosmic-card border border-white/10 bg-black/30 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-blue-400" />
          <h2 className="text-lg font-medium text-white">Education</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
          onClick={startAdding}
          disabled={isAdding}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Education
        </Button>
      </div>
      
      {/* Education Form (editing or adding) */}
      {(isAdding || editingId) && (
        <Card className="mb-6 bg-gray-800/50 border-gray-700">
          <CardContent className="pt-6">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="degree" className="text-gray-200">Degree/Certificate</Label>
                  <Input
                    id="degree"
                    value={formData.degree}
                    onChange={e => handleChange('degree', e.target.value)}
                    className="cosmic-input mt-1"
                    placeholder="e.g., Bachelor of Science"
                  />
                </div>
                <div>
                  <Label htmlFor="institution" className="text-gray-200">Institution</Label>
                  <Input
                    id="institution"
                    value={formData.institution}
                    onChange={e => handleChange('institution', e.target.value)}
                    className="cosmic-input mt-1"
                    placeholder="e.g., University of California"
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
                    placeholder="Present (if still studying)"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description" className="text-gray-200">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e => handleChange('description', e.target.value)}
                  className="cosmic-textarea mt-1"
                  placeholder="Additional details about your education, honors, relevant coursework, etc."
                  rows={4}
                />
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
                  onClick={saveEducation}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* List of Education Items */}
      <div className="space-y-4">
        {education.length === 0 && !isAdding ? (
          <div className="text-center py-6 text-gray-400">
            <GraduationCap className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>No education added yet. Add your education to enhance your resume.</p>
          </div>
        ) : (
          education.map(item => (
            <div 
              key={item.id} 
              className={`cosmic-experience-item ${editingId === item.id ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-white">{item.degree}</h3>
                  <div className="text-blue-400">{item.institution}</div>
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
                    onClick={() => deleteEducation(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {item.description && (
                <div className="mt-2 text-gray-300 text-sm">
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