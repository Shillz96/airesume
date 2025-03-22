import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CosmicButton } from '@/components/cosmic-button';
import { Trash, Plus, GraduationCap } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { EducationItem } from '@/hooks/use-resume-data';
import { cn } from '@/lib/utils';
import { getCosmicColor, getSpacing } from '@/lib/theme-utils';

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
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" style={{ color: getCosmicColor('primary') }} />
          <h3 className="text-lg font-semibold">Education</h3>
        </div>
        <CosmicButton
          size="sm"
          variant="outline"
          iconLeft={<Plus className="h-4 w-4" />}
          onClick={handleAddEducation}
        >
          Add Education
        </CosmicButton>
      </div>

      {education.length === 0 ? (
        <Card className="border border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <GraduationCap className="h-12 w-12 mb-2 opacity-30" />
            <p className="text-center text-sm mb-4">
              Add your educational background, degrees, and certifications
            </p>
            <Button variant="outline" size="sm" onClick={handleAddEducation}>
              Add Education
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
          {education.map((edu) => (
            <AccordionItem
              key={edu.id}
              value={edu.id}
              className={cn(
                "border rounded-md overflow-hidden",
                expandedItem === edu.id ? "ring-1 ring-primary/20" : ""
              )}
            >
              <AccordionTrigger className="px-4 py-3 hover:bg-accent/50 data-[state=open]:bg-accent/60">
                <div className="flex flex-1 justify-between items-center">
                  <div className="text-left">
                    <p className="font-medium">
                      {edu.degree || "New Education Entry"}
                    </p>
                    {edu.institution && (
                      <p className="text-sm opacity-70">{edu.institution}</p>
                    )}
                  </div>
                  <div className="text-sm opacity-70 mr-4">
                    {edu.startDate && edu.endDate
                      ? `${edu.startDate} - ${edu.endDate}`
                      : ""}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <div className="p-4 space-y-4 bg-card rounded-b-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`edu-degree-${edu.id}`}>Degree/Certification</Label>
                      <Input
                        id={`edu-degree-${edu.id}`}
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                        placeholder="e.g., Bachelor of Science in Computer Science"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`edu-institution-${edu.id}`}>Institution</Label>
                      <Input
                        id={`edu-institution-${edu.id}`}
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)}
                        placeholder="e.g., University of Technology"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`edu-start-${edu.id}`}>Start Date</Label>
                      <Input
                        id={`edu-start-${edu.id}`}
                        value={edu.startDate}
                        onChange={(e) => handleEducationChange(edu.id, 'startDate', e.target.value)}
                        placeholder="e.g., Sep 2018"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`edu-end-${edu.id}`}>End Date (or "Present")</Label>
                      <Input
                        id={`edu-end-${edu.id}`}
                        value={edu.endDate}
                        onChange={(e) => handleEducationChange(edu.id, 'endDate', e.target.value)}
                        placeholder="e.g., May 2022 or Present"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`edu-description-${edu.id}`}>Description</Label>
                    <Textarea
                      id={`edu-description-${edu.id}`}
                      value={edu.description}
                      onChange={(e) => handleEducationChange(edu.id, 'description', e.target.value)}
                      placeholder="Describe your academic achievements, relevant coursework, or activities"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end pb-2 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      onClick={() => handleRemoveEducation(edu.id)}
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