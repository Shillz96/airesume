import React, { useState } from 'react';
import { ExperienceItem } from '@/hooks/use-resume-data';
import { Button } from '@/components/ui/button';
import { CosmicButton } from '@/components/cosmic-button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Briefcase, Plus, ChevronDown, ChevronUp, X } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import AIAssistant from '@/components/ai-assistant';

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
  const [openId, setOpenId] = useState<string | null>(experiences[0]?.id || null);

  // Handler for adding a new experience item
  const handleAdd = () => {
    if (onAdd) {
      const newId = onAdd();
      setOpenId(newId);
    } else {
      // Fallback if onAdd is not provided
      const newExp: ExperienceItem = {
        id: crypto.randomUUID(),
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        description: '',
      };
      onUpdate([...experiences, newExp]);
      setOpenId(newExp.id);
    }
  };

  // Handler for deleting an experience item
  const handleDelete = (id: string) => {
    onUpdate(experiences.filter((exp) => exp.id !== id));
    if (openId === id) {
      setOpenId(experiences[0]?.id !== id ? experiences[0]?.id : null);
    }
  };

  // Handler for updating a field in an experience item
  const handleChange = (id: string, field: keyof ExperienceItem, value: string) => {
    onUpdate(
      experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  // Handler for applying a suggestion to a specific experience item
  const handleApplyBulletPoint = (bulletPoint: string) => {
    if (openId) {
      const currentExp = experiences.find(exp => exp.id === openId);
      if (currentExp) {
        handleChange(openId, 'description', 
          currentExp.description 
            ? `${currentExp.description}\n\n${bulletPoint}` 
            : bulletPoint
        );
      }
    }
  };

  return (
    <div className="cosmic-resume-section">
      <div className="main-content">
        <div className="cosmic-section-header">
          <h2 className="cosmic-section-title">
            <Briefcase className="w-5 h-5" />
            Work Experience
          </h2>
          {experiences.length > 0 && (
            <CosmicButton 
              variant="primary" 
              size="sm" 
              withGlow
              onClick={handleAdd}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Experience
            </CosmicButton>
          )}
        </div>

        {/* List of experience items */}
        {experiences.map((exp) => (
          <Collapsible
            key={exp.id}
            open={openId === exp.id}
            onOpenChange={() => setOpenId(openId === exp.id ? null : exp.id)}
            className="mb-4 border border-gray-700 rounded-lg overflow-hidden"
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 transition-colors">
              <div className="flex items-center">
                <Briefcase className="w-4 h-4 mr-2 text-blue-400" />
                <div className="text-left">
                  <span className="font-medium text-white">
                    {exp.title || "New Position"}
                  </span>
                  {exp.company && (
                    <span className="text-gray-400 ml-2">
                      at {exp.company}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(exp.id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-400 focus:outline-none mr-2"
                >
                  <X className="h-4 w-4" />
                </button>
                {openId === exp.id ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="p-4 bg-gray-900">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="cosmic-form-group">
                  <Label htmlFor={`title-${exp.id}`} className="cosmic-form-label">Job Title</Label>
                  <Input
                    id={`title-${exp.id}`}
                    value={exp.title}
                    onChange={(e) => handleChange(exp.id, 'title', e.target.value)}
                    className="cosmic-form-input"
                    placeholder="Software Engineer"
                  />
                </div>

                <div className="cosmic-form-group">
                  <Label htmlFor={`company-${exp.id}`} className="cosmic-form-label">Company</Label>
                  <Input
                    id={`company-${exp.id}`}
                    value={exp.company}
                    onChange={(e) => handleChange(exp.id, 'company', e.target.value)}
                    className="cosmic-form-input"
                    placeholder="Acme Corp"
                  />
                </div>

                <div className="cosmic-form-group">
                  <Label htmlFor={`start-date-${exp.id}`} className="cosmic-form-label">Start Date</Label>
                  <Input
                    id={`start-date-${exp.id}`}
                    value={exp.startDate}
                    onChange={(e) => handleChange(exp.id, 'startDate', e.target.value)}
                    className="cosmic-form-input"
                    placeholder="2021-03"
                  />
                </div>

                <div className="cosmic-form-group">
                  <Label htmlFor={`end-date-${exp.id}`} className="cosmic-form-label">End Date</Label>
                  <Input
                    id={`end-date-${exp.id}`}
                    value={exp.endDate}
                    onChange={(e) => handleChange(exp.id, 'endDate', e.target.value)}
                    className="cosmic-form-input"
                    placeholder="Present"
                  />
                </div>

                <div className="cosmic-form-group cosmic-experience-form-full md:col-span-2">
                  <Label htmlFor={`description-${exp.id}`} className="cosmic-form-label">Responsibilities & Achievements</Label>
                  <Textarea
                    id={`description-${exp.id}`}
                    value={exp.description}
                    onChange={(e) => handleChange(exp.id, 'description', e.target.value)}
                    placeholder="Utilized Python automation to streamline client-specified tasks, efficiently reducing time commitments by 30%. Utilized Git for version control and project management, ensuring code quality and collaboration with other developers."
                    className="cosmic-form-input cosmic-form-textarea"
                    rows={5}
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
        
        {/* Empty state - show when there are no experiences */}
        {experiences.length === 0 && (
          <button
            onClick={handleAdd}
            className="w-full py-3 mt-2 bg-blue-600/30 hover:bg-blue-600/50 text-white border border-blue-500/30 rounded-md flex items-center justify-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            <span>Add Your First Experience</span>
          </button>
        )}
      </div>

      {/* AI Assistant sidebar */}
      <div className="assistant-content">
        <div className="cosmic-assistant-card">
          <div className="cosmic-glow"></div>
          <div className="content">
            <div className="cosmic-assistant-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <h3>AI Experience Assistant</h3>
            </div>
            
            <AIAssistant 
              resumeId={resumeId}
              onApplyBulletPoint={handleApplyBulletPoint}
              activeTab="experience"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExperienceSection;