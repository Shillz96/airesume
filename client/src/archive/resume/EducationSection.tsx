import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CosmicButton } from '@/components/cosmic-button-refactored';
import { Trash, Plus, GraduationCap, Calendar } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { EducationItem } from '@/hooks/use-resume-data';
import { cn } from '@/lib/utils';
import { SectionHeader, SectionCard, ItemActions, formatDate } from './ResumeComponentShared';

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
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Handle adding a new education entry
  const handleAddEducation = () => {
    if (onAdd) {
      const newId = onAdd();
      setExpandedItem(newId);
    } else {
      // Fallback if onAdd not provided
      const newEducation = {
        id: crypto.randomUUID(),
        degree: '',
        institution: '',
        startDate: '',
        endDate: '',
        description: ''
      };
      onUpdate([...education, newEducation]);
      setExpandedItem(newEducation.id);
    }
  };

  // Handle removing an education entry
  const handleRemoveEducation = (id: string) => {
    const updatedEducation = education.filter(edu => edu.id !== id);
    onUpdate(updatedEducation);
    if (expandedItem === id) {
      setExpandedItem(null);
    }
  };

  // Handle updating a field in an education entry
  const handleEducationChange = (id: string, field: keyof EducationItem, value: string) => {
    const updatedEducation = education.map(edu => {
      if (edu.id === id) {
        return { ...edu, [field]: value };
      }
      return edu;
    });
    onUpdate(updatedEducation);
  };

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Education"
        icon={<GraduationCap className="h-5 w-5 cosmic-section-icon" />}
        onAdd={handleAddEducation}
        addButtonText="Add Education"
        className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
      />

      {education.length === 0 ? (
        <SectionCard withHoverEffect={false} className="border border-dashed border-white/10">
          <div className="flex flex-col items-center justify-center p-6">
            <GraduationCap className="h-12 w-12 mb-2 opacity-40 cosmic-section-icon" />
            <p className="text-center text-sm mb-4 opacity-80">
              Add your educational background, degrees, and certifications
            </p>
            <CosmicButton 
              variant="outline" 
              size="sm" 
              onClick={handleAddEducation}
              iconLeft={<Plus className="h-4 w-4" />}
              withGlow
            >
              Add Education
            </CosmicButton>
          </div>
        </SectionCard>
      ) : (
        <Accordion
          type="single"
          collapsible
          value={expandedItem || undefined}
          onValueChange={(value) => setExpandedItem(value)}
          className="cosmic-tabs space-y-2"
        >
          {education.map((edu) => (
            <AccordionItem
              key={edu.id}
              value={edu.id}
              className={cn(
                "cosmic-card overflow-hidden border border-white/10 backdrop-blur-sm",
                expandedItem === edu.id ? "ring-1 ring-primary/20 cosmic-card-gradient" : ""
              )}
            >
              <AccordionTrigger className="px-4 py-3 hover:bg-primary/5 data-[state=open]:bg-primary/10 border-white/10">
                <div className="flex flex-1 justify-between items-center">
                  <div className="text-left">
                    <p className={cn("font-medium", expandedItem === edu.id ? "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent" : "")}>
                      {edu.degree || "New Degree"}
                    </p>
                    {edu.institution && (
                      <p className="text-sm opacity-80">{edu.institution}</p>
                    )}
                  </div>
                  <div className="text-sm opacity-80 mr-4">
                    {edu.startDate && edu.endDate
                      ? `${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`
                      : ""}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <div className="p-4 space-y-4 bg-card/10 backdrop-blur-sm rounded-b-md border-t border-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`edu-degree-${edu.id}`} className="cosmic-label">Degree/Certification</Label>
                      <Input
                        id={`edu-degree-${edu.id}`}
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                        placeholder="e.g., Bachelor of Science in Computer Science"
                        className="cosmic-navy-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`edu-institution-${edu.id}`} className="cosmic-label">Institution</Label>
                      <Input
                        id={`edu-institution-${edu.id}`}
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)}
                        placeholder="e.g., University of Technology"
                        className="cosmic-navy-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`edu-start-${edu.id}`} className="cosmic-label">Start Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 cosmic-section-icon" />
                        <Input
                          id={`edu-start-${edu.id}`}
                          value={edu.startDate}
                          onChange={(e) => handleEducationChange(edu.id, 'startDate', e.target.value)}
                          className="pl-10 cosmic-navy-input"
                          placeholder="e.g., Sep 2018"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`edu-end-${edu.id}`} className="cosmic-label">End Date (or "Present")</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 cosmic-section-icon" />
                        <Input
                          id={`edu-end-${edu.id}`}
                          value={edu.endDate}
                          onChange={(e) => handleEducationChange(edu.id, 'endDate', e.target.value)}
                          className="pl-10 cosmic-navy-input"
                          placeholder="e.g., May 2022 or Present"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`edu-description-${edu.id}`} className="cosmic-label">Description</Label>
                    <Textarea
                      id={`edu-description-${edu.id}`}
                      value={edu.description}
                      onChange={(e) => handleEducationChange(edu.id, 'description', e.target.value)}
                      placeholder="Describe your academic achievements, relevant coursework, or activities"
                      rows={3}
                      className="cosmic-navy-input cosmic-form-textarea"
                    />
                    <p className="text-xs text-muted-foreground opacity-80">
                      Include relevant coursework, academic achievements, and extracurricular activities.
                    </p>
                  </div>

                  <div className="flex justify-end pb-2 pt-2">
                    <ItemActions 
                      onDelete={() => handleRemoveEducation(edu.id)}
                    />
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