import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CosmicButton } from '@/components/cosmic-button';
import { Trash, Plus, Briefcase, Calendar } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ExperienceItem } from '@/hooks/use-resume-data';
import { cn } from '@/lib/utils';
import { getCosmicColor, getSpacing } from '@/lib/theme-utils';

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
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Handle adding a new experience entry
  const handleAddExperience = () => {
    if (onAdd) {
      const newId = onAdd();
      setExpandedItem(newId);
    } else {
      // Fallback if onAdd not provided
      const newExperience = {
        id: crypto.randomUUID(),
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        description: ''
      };
      onUpdate([...experiences, newExperience]);
      setExpandedItem(newExperience.id);
    }
  };

  // Handle removing an experience entry
  const handleRemoveExperience = (id: string) => {
    const updatedExperiences = experiences.filter(exp => exp.id !== id);
    onUpdate(updatedExperiences);
    if (expandedItem === id) {
      setExpandedItem(null);
    }
  };

  // Handle updating a field in an experience entry
  const handleExperienceChange = (id: string, field: keyof ExperienceItem, value: string) => {
    const updatedExperiences = experiences.map(exp => {
      if (exp.id === id) {
        return { ...exp, [field]: value };
      }
      return exp;
    });
    onUpdate(updatedExperiences);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" style={{ color: getCosmicColor('primary') }} />
          <h3 className="text-lg font-semibold">Work Experience</h3>
        </div>
        <CosmicButton
          size="sm"
          variant="outline"
          iconLeft={<Plus className="h-4 w-4" />}
          onClick={handleAddExperience}
        >
          Add Experience
        </CosmicButton>
      </div>

      {experiences.length === 0 ? (
        <Card className="border border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Briefcase className="h-12 w-12 mb-2 opacity-30" />
            <p className="text-center text-sm mb-4">
              Add your work history including internships and relevant experience
            </p>
            <Button variant="outline" size="sm" onClick={handleAddExperience}>
              Add Experience
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
          {experiences.map((experience) => (
            <AccordionItem
              key={experience.id}
              value={experience.id}
              className={cn(
                "border rounded-md overflow-hidden",
                expandedItem === experience.id ? "ring-1 ring-primary/20" : ""
              )}
            >
              <AccordionTrigger className="px-4 py-3 hover:bg-accent/50 data-[state=open]:bg-accent/60">
                <div className="flex flex-1 justify-between items-center">
                  <div className="text-left">
                    <p className="font-medium">
                      {experience.title || "New Position"}
                    </p>
                    {experience.company && (
                      <p className="text-sm opacity-70">{experience.company}</p>
                    )}
                  </div>
                  <div className="text-sm opacity-70 mr-4">
                    {experience.startDate && experience.endDate
                      ? `${experience.startDate} - ${experience.endDate}`
                      : ""}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <div className="p-4 space-y-4 bg-card rounded-b-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`exp-title-${experience.id}`}>Job Title</Label>
                      <Input
                        id={`exp-title-${experience.id}`}
                        value={experience.title}
                        onChange={(e) => handleExperienceChange(experience.id, 'title', e.target.value)}
                        placeholder="e.g., Senior Developer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`exp-company-${experience.id}`}>Company</Label>
                      <Input
                        id={`exp-company-${experience.id}`}
                        value={experience.company}
                        onChange={(e) => handleExperienceChange(experience.id, 'company', e.target.value)}
                        placeholder="e.g., Acme Inc."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`exp-start-${experience.id}`}>Start Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id={`exp-start-${experience.id}`}
                          value={experience.startDate}
                          onChange={(e) => handleExperienceChange(experience.id, 'startDate', e.target.value)}
                          className="pl-10"
                          placeholder="e.g., Jan 2020"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`exp-end-${experience.id}`}>End Date (or "Present")</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id={`exp-end-${experience.id}`}
                          value={experience.endDate}
                          onChange={(e) => handleExperienceChange(experience.id, 'endDate', e.target.value)}
                          className="pl-10"
                          placeholder="e.g., Dec 2022 or Present"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`exp-description-${experience.id}`}>Description</Label>
                    <Textarea
                      id={`exp-description-${experience.id}`}
                      value={experience.description}
                      onChange={(e) => handleExperienceChange(experience.id, 'description', e.target.value)}
                      placeholder="Describe your responsibilities, achievements, and skills used..."
                      rows={5}
                    />
                    <p className="text-xs text-muted-foreground">
                      Use bullet points for better readability. Start with strong action verbs.
                    </p>
                  </div>

                  <div className="space-y-2 mt-4 border-t pt-4">
                    <h4 className="text-sm font-medium">Formatting Tips:</h4>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• Start with strong action verbs (e.g., "Developed", "Led", "Managed")</li>
                      <li>• Include quantifiable achievements (e.g., "Increased sales by 20%")</li>
                      <li>• Use bullet points for better readability</li>
                      <li>• Highlight skills relevant to the job you're applying for</li>
                    </ul>
                  </div>

                  <div className="flex justify-end pb-2 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      onClick={() => handleRemoveExperience(experience.id)}
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