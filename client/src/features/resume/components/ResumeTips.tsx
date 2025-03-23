import React, { useState } from 'react';
import { Check, ChevronRight, Lightbulb } from 'lucide-react';
import { Button } from '@/ui/core/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/core/Card';
import { cn } from '@/lib/utils';

interface ResumeTipsProps {
  section?: 'summary' | 'experience' | 'education' | 'skills' | 'projects';
  onApplyTip?: (tip: string) => void;
}

/**
 * ResumeTips component provides contextual tips based on the current section being edited
 * Integrated with the theme system for consistent styling
 */
export default function ResumeTips({ section = 'summary', onApplyTip }: ResumeTipsProps) {
  const [expandedTip, setExpandedTip] = useState<number | null>(null);
  const [appliedTips, setAppliedTips] = useState<string[]>([]);
  
  const resetAppliedTips = () => {
    setAppliedTips([]);
  };
  
  // Tips for each section
  const tipsBySection = {
    summary: [
      "Start with a strong professional headline that includes your job title and years of experience.",
      "Include 3-5 of your most impressive accomplishments with quantifiable results.",
      "Mention your core skills that are most relevant to the job you're applying for.",
      "Keep your summary concise, ideally 3-5 sentences or bullet points.",
      "Tailor your summary to match the specific job description's keywords."
    ],
    experience: [
      "Start each bullet point with a strong action verb (achieved, implemented, led, etc.).",
      "Quantify your achievements with numbers, percentages, or dollar amounts.",
      "Focus on results and impact rather than just listing responsibilities.",
      "Include relevant technologies, methodologies, or tools you used.",
      "Structure your points in the PAR format: Problem, Action, Result."
    ],
    education: [
      "List your degrees in reverse chronological order (most recent first).",
      "Include relevant coursework, projects, or academic achievements.",
      "Mention any honors, scholarships, or high GPA (if 3.5 or above).",
      "Include certifications or continuing education relevant to your field.",
      "Only include high school information if you have no college experience."
    ],
    skills: [
      "Group skills by category (technical, soft skills, languages, etc.).",
      "Prioritize skills mentioned in the job description.",
      "Include proficiency levels for languages or technical skills when relevant.",
      "Focus on quality over quantity - highlight your strongest and most relevant skills.",
      "Include both hard skills (technical) and soft skills (communication, leadership)."
    ],
    projects: [
      "Include a brief description of the project purpose and your role.",
      "Highlight the technologies, tools, or methodologies used.",
      "Describe challenges overcome and solutions implemented.",
      "Include measurable outcomes or results if available.",
      "Add links to live projects, GitHub repositories, or case studies if applicable."
    ]
  };
  
  // Get tips for the current section
  const currentTips = tipsBySection[section] || tipsBySection.summary;
  
  // Handle applying a tip
  const handleApplyTip = (tip: string) => {
    if (onApplyTip) {
      onApplyTip(tip);
    }
    
    // Track which tips have been applied
    setAppliedTips(prev => [...prev, tip]);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
          Resume Tips
        </CardTitle>
        <CardDescription>
          Apply these tips to improve your {section} section
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentTips.map((tip, index) => (
          <div 
            key={index}
            className={cn(
              "border rounded-lg p-3 transition-all",
              expandedTip === index ? "border-primary/50 bg-primary/5" : "border-border",
              appliedTips.includes(tip) && "border-green-500/30 bg-green-500/5"
            )}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start">
                <span className={cn(
                  "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-2 mt-0.5",
                  appliedTips.includes(tip) 
                    ? "bg-green-500 text-white" 
                    : "bg-primary/10 text-primary"
                )}>
                  {appliedTips.includes(tip) 
                    ? <Check className="h-4 w-4" /> 
                    : index + 1
                  }
                </span>
                <div>
                  <p className={cn(
                    "text-sm font-medium",
                    expandedTip === index ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {tip}
                  </p>
                  
                  {expandedTip === index && (
                    <div className="mt-2 flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleApplyTip(tip)}
                        disabled={appliedTips.includes(tip)}
                        className="text-xs"
                      >
                        {appliedTips.includes(tip) ? 'Applied' : 'Apply Tip'}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setExpandedTip(null)}
                        className="text-xs"
                      >
                        Close
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              {expandedTip !== index && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-2 h-6 w-6 p-0"
                  onClick={() => setExpandedTip(index)}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Expand tip</span>
                </Button>
              )}
            </div>
          </div>
        ))}
        
        {appliedTips.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetAppliedTips}
            className="w-full text-xs mt-2"
          >
            Reset Applied Tips
          </Button>
        )}
      </CardContent>
    </Card>
  );
}