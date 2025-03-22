import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CosmicButton } from '@/components/cosmic-button';
import { Trash, Plus, Lightbulb, X } from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { SkillItem } from '@/hooks/use-resume-data';
import { cn } from '@/lib/utils';
import { getCosmicColor, getSpacing } from '@/lib/theme-utils';

interface SkillsSectionProps {
  skills: SkillItem[];
  resumeId?: string;
  onUpdate: (skills: SkillItem[]) => void;
  onAdd?: () => string; // Returns the new ID
}

const SKILL_CATEGORIES = [
  'Technical', 'Soft', 'Languages', 'Tools', 'Frameworks', 'Databases', 'Other'
];

/**
 * SkillsSection component for managing skills in the resume
 */
export function SkillsSection({ 
  skills,
  resumeId,
  onUpdate,
  onAdd
}: SkillsSectionProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [compactView, setCompactView] = useState(skills.length > 5);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get filtered skills based on selected category
  const filteredSkills = selectedCategory 
    ? skills.filter(skill => {
        // You may want to add a category field to your SkillItem type
        const category = skill.category || 'Other';
        return category === selectedCategory;
      })
    : skills;

  // Handle adding a new skill
  const handleAddSkill = () => {
    if (onAdd) {
      const newId = onAdd(selectedCategory || undefined);
      setExpandedItem(newId);
      setCompactView(false);
    } else {
      // Fallback if onAdd not provided
      const newSkill = {
        id: crypto.randomUUID(),
        name: '',
        proficiency: 3,
        category: selectedCategory || undefined
      };
      onUpdate([...skills, newSkill]);
      setExpandedItem(newSkill.id);
      setCompactView(false);
    }
  };

  // Handle removing a skill
  const handleRemoveSkill = (id: string) => {
    const updatedSkills = skills.filter(skill => skill.id !== id);
    onUpdate(updatedSkills);
    if (expandedItem === id) {
      setExpandedItem(null);
    }
  };

  // Handle updating a field in a skill
  const handleSkillChange = (id: string, field: keyof SkillItem, value: any) => {
    const updatedSkills = skills.map(skill => {
      if (skill.id === id) {
        return { ...skill, [field]: value };
      }
      return skill;
    });
    onUpdate(updatedSkills);
  };

  // Get proficiency level label
  const getProficiencyLabel = (level: number): string => {
    switch (level) {
      case 1: return 'Beginner';
      case 2: return 'Intermediate';
      case 3: return 'Advanced';
      case 4: return 'Expert';
      case 5: return 'Master';
      default: return 'Intermediate';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" style={{ color: getCosmicColor('primary') }} />
          <h3 className="text-lg font-semibold">Skills</h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCompactView(!compactView)}
          >
            {compactView ? 'Detailed View' : 'Compact View'}
          </Button>
          <CosmicButton
            size="sm"
            variant="outline"
            iconLeft={<Plus className="h-4 w-4" />}
            onClick={handleAddSkill}
          >
            Add Skill
          </CosmicButton>
        </div>
      </div>

      {/* Category filter */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge 
            variant={selectedCategory === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Badge>
          {SKILL_CATEGORIES.map(category => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      )}

      {skills.length === 0 ? (
        <Card className="border border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Lightbulb className="h-12 w-12 mb-2 opacity-30" />
            <p className="text-center text-sm mb-4">
              Add your professional skills and rate your proficiency level
            </p>
            <Button variant="outline" size="sm" onClick={handleAddSkill}>
              Add Skill
            </Button>
          </CardContent>
        </Card>
      ) : compactView ? (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {filteredSkills.map((skill) => (
                <TooltipProvider key={skill.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge 
                        className="cursor-pointer px-3 py-1 flex items-center gap-1"
                        onClick={() => {
                          setExpandedItem(skill.id);
                          setCompactView(false);
                        }}
                      >
                        {skill.name || 'Unnamed Skill'}
                        <span className="inline-block w-2 h-2 rounded-full ml-1" 
                          style={{ 
                            backgroundColor: getProgressColor(skill.proficiency) 
                          }}
                        />
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{getProficiencyLabel(skill.proficiency)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
              <Badge 
                variant="outline" 
                className="cursor-pointer"
                onClick={handleAddSkill}
              >
                <Plus className="h-3 w-3 mr-1" /> Add Skill
              </Badge>
            </div>
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
          {filteredSkills.map((skill) => (
            <AccordionItem
              key={skill.id}
              value={skill.id}
              className={cn(
                "border rounded-md overflow-hidden",
                expandedItem === skill.id ? "ring-1 ring-primary/20" : ""
              )}
            >
              <AccordionTrigger className="px-4 py-3 hover:bg-accent/50 data-[state=open]:bg-accent/60">
                <div className="flex flex-1 justify-between items-center">
                  <div className="text-left font-medium">
                    {skill.name || "New Skill"}
                  </div>
                  <div className="flex items-center gap-2 mr-4">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div 
                          key={i}
                          className="w-2 h-4 mx-px rounded-sm" 
                          style={{ 
                            backgroundColor: i < skill.proficiency 
                              ? getProgressColor(skill.proficiency) 
                              : 'rgba(0,0,0,0.1)'
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs opacity-70">
                      {getProficiencyLabel(skill.proficiency)}
                    </span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <div className="p-4 space-y-4 bg-card rounded-b-md">
                  <div className="space-y-2">
                    <Label htmlFor={`skill-name-${skill.id}`}>Skill Name</Label>
                    <Input
                      id={`skill-name-${skill.id}`}
                      value={skill.name}
                      onChange={(e) => handleSkillChange(skill.id, 'name', e.target.value)}
                      placeholder="e.g., JavaScript, Leadership, Project Management"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor={`skill-proficiency-${skill.id}`}>Proficiency Level</Label>
                      <span className="text-sm">{getProficiencyLabel(skill.proficiency)}</span>
                    </div>
                    <Slider
                      id={`skill-proficiency-${skill.id}`}
                      value={[skill.proficiency]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(value) => handleSkillChange(skill.id, 'proficiency', value[0])}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Beginner</span>
                      <span>Intermediate</span>
                      <span>Expert</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`skill-category-${skill.id}`}>Category (Optional)</Label>
                    <Select
                      value={skill.category}
                      onValueChange={(value) => handleSkillChange(skill.id, 'category', value)}
                    >
                      <SelectTrigger id={`skill-category-${skill.id}`}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {SKILL_CATEGORIES.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end pb-2 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      onClick={() => handleRemoveSkill(skill.id)}
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

// Helper function to get progress color based on proficiency level
function getProgressColor(level: number): string {
  switch(level) {
    case 1: return '#94a3b8'; // slate-400
    case 2: return '#60a5fa'; // blue-400
    case 3: return '#34d399'; // emerald-400
    case 4: return '#f59e0b'; // amber-500
    case 5: return '#ef4444'; // red-500
    default: return '#60a5fa'; // blue-400
  }
}