import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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
import { SectionHeader, SectionCard, ItemActions } from './ResumeComponentShared';

interface SkillsSectionProps {
  skills: SkillItem[];
  resumeId?: string;
  onUpdate: (skills: SkillItem[]) => void;
  onAdd?: (category?: string) => string; // Returns the new ID
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
      <SectionHeader
        title="Skills"
        icon={<Lightbulb className="h-5 w-5 cosmic-section-icon" />}
        onAdd={handleAddSkill}
        addButtonText="Add Skill"
        className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
      />

      {/* View Toggle and Category filter */}
      {skills.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-4">
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer cosmic-badge"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Badge>
            {SKILL_CATEGORIES.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer cosmic-badge"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCompactView(!compactView)}
            className="cosmic-button-secondary self-end"
          >
            {compactView ? 'Detailed View' : 'Compact View'}
          </Button>
        </div>
      )}

      {skills.length === 0 ? (
        <SectionCard withHoverEffect={false} className="border border-dashed border-white/10">
          <div className="flex flex-col items-center justify-center p-6">
            <Lightbulb className="h-12 w-12 mb-2 opacity-40 cosmic-section-icon" />
            <p className="text-center text-sm mb-4 opacity-80">
              Add your professional skills and rate your proficiency level
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddSkill}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Skill
            </Button>
          </div>
        </SectionCard>
      ) : compactView ? (
        <SectionCard>
          <div className="p-4">
            <div className="flex flex-wrap gap-2">
              {filteredSkills.map((skill) => (
                <TooltipProvider key={skill.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge 
                        className="cursor-pointer px-3 py-1 flex items-center gap-1 cosmic-badge cosmic-badge-glow"
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
                    <TooltipContent className="cosmic-tooltip">
                      <p>{getProficiencyLabel(skill.proficiency)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
              <Badge 
                variant="outline" 
                className="cursor-pointer cosmic-badge-outline"
                onClick={handleAddSkill}
              >
                <Plus className="h-3 w-3 mr-1" /> Add Skill
              </Badge>
            </div>
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
          {filteredSkills.map((skill) => (
            <AccordionItem
              key={skill.id}
              value={skill.id}
              className={cn(
                "cosmic-card overflow-hidden border border-white/10 backdrop-blur-sm",
                expandedItem === skill.id ? "ring-1 ring-primary/20 cosmic-card-gradient" : ""
              )}
            >
              <AccordionTrigger className="px-4 py-3 hover:bg-primary/5 data-[state=open]:bg-primary/10 border-white/10">
                <div className="flex flex-1 justify-between items-center">
                  <div className="text-left">
                    <p className={cn("font-medium", expandedItem === skill.id ? "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent" : "")}>
                      {skill.name || "New Skill"}
                    </p>
                    {skill.category && (
                      <p className="text-sm opacity-80">{skill.category}</p>
                    )}
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
                              : 'rgba(255, 255, 255, 0.1)'
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-sm bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent w-24 text-right">{getProficiencyLabel(skill.proficiency)}</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <div className="p-4 space-y-4 bg-card/10 backdrop-blur-sm rounded-b-md border-t border-white/10">
                  <div className="space-y-2">
                    <Label htmlFor={`skill-name-${skill.id}`} className="cosmic-label">Skill Name</Label>
                    <Input
                      id={`skill-name-${skill.id}`}
                      value={skill.name}
                      onChange={(e) => handleSkillChange(skill.id, 'name', e.target.value)}
                      placeholder="e.g., JavaScript, Leadership, Project Management"
                      className="cosmic-input border-white/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor={`skill-proficiency-${skill.id}`} className="cosmic-label">Proficiency Level</Label>
                      <span className="text-sm bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent w-24 text-right">{getProficiencyLabel(skill.proficiency)}</span>
                    </div>
                    <Slider
                      id={`skill-proficiency-${skill.id}`}
                      value={[skill.proficiency]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(value) => handleSkillChange(skill.id, 'proficiency', value[0])}
                      className="py-4 cosmic-slider"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground opacity-80">
                      <span>Beginner</span>
                      <span>Intermediate</span>
                      <span>Expert</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`skill-category-${skill.id}`} className="cosmic-label">Category (Optional)</Label>
                    <Select
                      value={skill.category}
                      onValueChange={(value) => handleSkillChange(skill.id, 'category', value)}
                    >
                      <SelectTrigger id={`skill-category-${skill.id}`} className="cosmic-select border-white/10">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="cosmic-select-content">
                        {SKILL_CATEGORIES.map(category => (
                          <SelectItem key={category} value={category} className="cosmic-select-item">
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end pb-2 pt-2">
                    <ItemActions 
                      onDelete={() => handleRemoveSkill(skill.id)}
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