import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CosmicButton } from '@/components/cosmic-button-refactored';
import { Upload, User, Mail, Phone, Briefcase, CheckIcon } from 'lucide-react';
import { PersonalInfo } from '@/hooks/use-resume-data';
import { getCosmicColor, getSpacing } from '@/lib/theme-utils';
import { SectionHeader, SectionCard } from './ResumeComponentShared';

interface PersonalInfoSectionProps {
  personalInfo: PersonalInfo;
  resumeId?: string;
  onUpdate: (field: keyof PersonalInfo, value: string) => void;
  onFileUpload?: () => void;
  showUploadCard?: boolean;
}

/**
 * PersonalInfoSection component for managing personal information in the resume
 * Updated to use the cosmic styling consistently across all resume sections
 */
export function PersonalInfoSection({
  personalInfo,
  resumeId,
  onUpdate,
  onFileUpload,
  showUploadCard = false
}: PersonalInfoSectionProps) {
  return (
    <div className="cosmic-resume-section">
      <SectionHeader 
        title="Personal Information" 
        icon={<User className="cosmic-section-icon h-5 w-5" />}
      />

      {showUploadCard && onFileUpload && (
        <SectionCard withHoverEffect={true} className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-medium text-lg">Import from Existing Resume</h4>
              <p className="text-sm text-white/70 mt-1">
                Upload your existing resume to extract your information automatically
              </p>
            </div>
            <CosmicButton
              variant="outline"
              onClick={onFileUpload}
              iconLeft={<Upload className="h-4 w-4 mr-2" />}
              withGlow
            >
              Upload Resume
            </CosmicButton>
          </div>
        </SectionCard>
      )}

      <SectionCard className="transition-all duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First column */}
          <div className="space-y-6">
            <div className="cosmic-form-group">
              <Label htmlFor="firstName" className="cosmic-form-label">First Name</Label>
              <Input
                id="firstName"
                value={personalInfo.firstName}
                onChange={(e) => onUpdate('firstName', e.target.value)}
                placeholder="Your first name"
                className="cosmic-navy-input"
              />
            </div>

            <div className="cosmic-form-group">
              <Label htmlFor="lastName" className="cosmic-form-label">Last Name</Label>
              <Input
                id="lastName"
                value={personalInfo.lastName}
                onChange={(e) => onUpdate('lastName', e.target.value)}
                placeholder="Your last name"
                className="cosmic-navy-input"
              />
            </div>

            <div className="cosmic-form-group">
              <Label htmlFor="email" className="cosmic-form-label">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/70" />
                <Input
                  id="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => onUpdate('email', e.target.value)}
                  className="cosmic-navy-input pl-10"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="cosmic-form-group">
              <Label htmlFor="phone" className="cosmic-form-label">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/70" />
                <Input
                  id="phone"
                  value={personalInfo.phone}
                  onChange={(e) => onUpdate('phone', e.target.value)}
                  className="cosmic-navy-input pl-10"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Second column */}
          <div className="space-y-6">
            <div className="cosmic-form-group">
              <Label htmlFor="headline" className="cosmic-form-label">Professional Headline</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 h-4 w-4 text-primary/70" />
                <Input
                  id="headline"
                  value={personalInfo.headline}
                  onChange={(e) => onUpdate('headline', e.target.value)}
                  className="cosmic-navy-input pl-10"
                  placeholder="e.g., Senior Software Engineer | React Specialist"
                />
              </div>
              <p className="mt-2 text-xs text-primary/70">
                A short headline that appears below your name
              </p>
            </div>

            <div className="cosmic-form-group">
              <Label htmlFor="summary" className="cosmic-form-label">Professional Summary</Label>
              <Textarea
                id="summary"
                value={personalInfo.summary}
                onChange={(e) => onUpdate('summary', e.target.value)}
                rows={8}
                className="cosmic-navy-input cosmic-form-textarea"
                placeholder="Briefly introduce yourself, highlighting your expertise, experience, and unique value proposition..."
              />
              <p className="mt-2 text-xs text-primary/70">
                Aim for 3-5 sentences that highlight your professional strengths and career goals
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-primary/20">
          <h4 className="text-sm font-medium text-white/80 mb-3">Recommendations:</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-primary/20 text-primary p-0.5 mt-0.5">
                <CheckIcon size={12} />
              </div>
              <span className="text-white/70">Keep your summary concise and impactful - aim for 3-5 sentences</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-primary/20 text-primary p-0.5 mt-0.5">
                <CheckIcon size={12} />
              </div>
              <span className="text-white/70">Include relevant keywords from job descriptions you're targeting</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-primary/20 text-primary p-0.5 mt-0.5">
                <CheckIcon size={12} />
              </div>
              <span className="text-white/70">Your professional headline should be specific and include your specialty</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-primary/20 text-primary p-0.5 mt-0.5">
                <CheckIcon size={12} />
              </div>
              <span className="text-white/70">Use a professional email address, ideally with your name</span>
            </li>
          </ul>
        </div>
      </SectionCard>
    </div>
  );
}