import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/core/Card';
import { Button } from '@/ui/core/Button';
import { Lightbulb, ExternalLink, Check, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResumeTipsProps {
  section?: 'summary' | 'experience' | 'education' | 'skills' | 'projects';
  onApplyTip?: (tip: string) => void;
}

export default function ResumeTips({ section = 'summary', onApplyTip }: ResumeTipsProps) {
  const [appliedTips, setAppliedTips] = useState<Set<number>>(new Set());
  
  const getTipsForSection = (section: string): string[] => {
    switch (section) {
      case 'summary':
        return [
          'Start with a powerful statement that captures who you are professionally.',
          'Quantify your years of experience and highlight your top 2-3 skills.',
          'Tailor your summary to match the job description, using similar keywords.',
          'Keep it concise — aim for 3-4 impactful sentences.',
          'Include your career goals and what you bring to the company.'
        ];
      case 'experience':
        return [
          'Start each bullet point with strong action verbs (e.g., "Developed," "Led," "Implemented").',
          'Quantify your achievements with numbers and percentages when possible.',
          'Focus on achievements and results rather than just responsibilities.',
          'Include relevant technologies, methodologies, or tools you used.',
          'Tailor your experience to highlight skills relevant to the job you're applying for.'
        ];
      case 'education':
        return [
          'List degrees in reverse chronological order (most recent first).',
          'Include relevant coursework, projects, or academic achievements.',
          'Mention honors, scholarships, or high GPA (if 3.5 or above).',
          'Add certifications and continuing education relevant to your field.',
          'For experienced professionals, keep education brief to focus on work experience.'
        ];
      case 'skills':
        return [
          'Organize skills by category (e.g., Technical, Soft Skills, Languages).',
          'Prioritize skills mentioned in the job description.',
          'Indicate proficiency levels for technical skills or languages.',
          'Include both hard skills (technical abilities) and soft skills (communication, leadership).',
          'Remove outdated or irrelevant skills to keep your resume focused.'
        ];
      case 'projects':
        return [
          'Highlight projects that demonstrate skills relevant to the job.',
          'Include the technologies, tools, or methodologies used.',
          'Quantify the impact or results of each project.',
          'For team projects, clarify your specific role and contributions.',
          'Consider adding links to repositories or live project demos.'
        ];
      default:
        return [
          'Customize your resume for each job application.',
          'Use a clean, professional layout with consistent formatting.',
          'Proofread carefully to eliminate grammar and spelling errors.',
          'Save your resume as a PDF to preserve formatting.',
          'Ask a colleague or mentor to review your resume and provide feedback.'
        ];
    }
  };

  const tips = getTipsForSection(section);
  
  const handleApplyTip = (index: number, tip: string) => {
    if (onApplyTip) {
      onApplyTip(tip);
      
      setAppliedTips(prev => {
        const updated = new Set(prev);
        updated.add(index);
        return updated;
      });
    }
  };
  
  const resetAppliedTips = () => {
    setAppliedTips(new Set());
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center">
          <Lightbulb className="h-5 w-5 text-primary mr-2" />
          Tips for {section.charAt(0).toUpperCase() + section.slice(1)}
        </CardTitle>
        {appliedTips.size > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetAppliedTips}
            iconLeft={<RefreshCcw className="h-4 w-4" />}
          >
            Reset
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {tips.map((tip, index) => (
            <li key={index} className={cn(
              "flex items-start p-2 rounded-md",
              appliedTips.has(index) ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"
            )}>
              <div className="mr-3 mt-0.5 flex-shrink-0">
                {appliedTips.has(index) ? (
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                ) : (
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <Lightbulb className="h-3 w-3 text-primary" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm">{tip}</p>
                {onApplyTip && !appliedTips.has(index) && (
                  <div className="mt-2">
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="h-auto p-0 text-xs"
                      onClick={() => handleApplyTip(index, tip)}
                      iconRight={<ExternalLink className="h-3 w-3 ml-1" />}
                    >
                      Apply this tip
                    </Button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            These tips are tailored to help you create a more effective resume that stands out to employers and ATS systems.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}