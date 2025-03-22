import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CosmicButton } from '@/components/cosmic-button';
import { Upload, User, Mail, Phone, Briefcase } from 'lucide-react';
import { PersonalInfo } from '@/hooks/use-resume-data';
import { getCosmicColor, getSpacing } from '@/lib/theme-utils';

interface PersonalInfoSectionProps {
  personalInfo: PersonalInfo;
  resumeId?: string;
  onUpdate: (field: keyof PersonalInfo, value: string) => void;
  onFileUpload?: () => void;
  showUploadCard?: boolean;
}

/**
 * PersonalInfoSection component for managing personal information in the resume
 */
export function PersonalInfoSection({
  personalInfo,
  resumeId,
  onUpdate,
  onFileUpload,
  showUploadCard = false
}: PersonalInfoSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <User className="h-5 w-5" style={{ color: getCosmicColor('primary') }} />
        <h3 className="text-lg font-semibold">Personal Information</h3>
      </div>

      {showUploadCard && onFileUpload && (
        <Card className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-indigo-500/30 mb-6">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h4 className="font-medium text-lg">Import from Existing Resume</h4>
              <p className="text-sm opacity-70 mt-1">
                Upload your existing resume to extract your information automatically
              </p>
            </div>
            <CosmicButton
              variant="outline"
              onClick={onFileUpload}
              iconLeft={<Upload className="h-4 w-4 mr-2" />}
            >
              Upload Resume
            </CosmicButton>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First column */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={personalInfo.firstName}
              onChange={(e) => onUpdate('firstName', e.target.value)}
              placeholder="Your first name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={personalInfo.lastName}
              onChange={(e) => onUpdate('lastName', e.target.value)}
              placeholder="Your last name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={personalInfo.email}
                onChange={(e) => onUpdate('email', e.target.value)}
                className="pl-10"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                value={personalInfo.phone}
                onChange={(e) => onUpdate('phone', e.target.value)}
                className="pl-10"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        </div>

        {/* Second column */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="headline">Professional Headline</Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="headline"
                value={personalInfo.headline}
                onChange={(e) => onUpdate('headline', e.target.value)}
                className="pl-10"
                placeholder="e.g., Senior Software Engineer | React Specialist"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              A short headline that appears below your name
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Professional Summary</Label>
            <Textarea
              id="summary"
              value={personalInfo.summary}
              onChange={(e) => onUpdate('summary', e.target.value)}
              rows={8}
              placeholder="Briefly introduce yourself, highlighting your expertise, experience, and unique value proposition..."
            />
            <p className="text-xs text-muted-foreground">
              Aim for 3-5 sentences that highlight your professional strengths and career goals
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2 mt-4">
        <h4 className="text-sm font-medium text-muted-foreground">Recommendations:</h4>
        <ul className="space-y-1 text-sm">
          <li className="flex items-start gap-2">
            <div className="rounded-full bg-green-500/20 text-green-500 p-0.5 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            Keep your summary concise and impactful - aim for 3-5 sentences
          </li>
          <li className="flex items-start gap-2">
            <div className="rounded-full bg-green-500/20 text-green-500 p-0.5 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            Include relevant keywords from job descriptions you're targeting
          </li>
          <li className="flex items-start gap-2">
            <div className="rounded-full bg-green-500/20 text-green-500 p-0.5 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            Your professional headline should be specific and include your specialty
          </li>
          <li className="flex items-start gap-2">
            <div className="rounded-full bg-green-500/20 text-green-500 p-0.5 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            Use a professional email address, ideally with your name
          </li>
        </ul>
      </div>
    </div>
  );
}