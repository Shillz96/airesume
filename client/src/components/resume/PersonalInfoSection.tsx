import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Upload } from "lucide-react";
import { PersonalInfo } from "@/hooks/use-resume-data";

interface PersonalInfoSectionProps {
  personalInfo: PersonalInfo;
  resumeId?: string;
  onUpdate: (field: keyof PersonalInfo, value: string) => void;
  onFileUpload?: () => void;
  showUploadCard?: boolean;
}

/**
 * PersonalInfoSection component for managing personal/contact information in the resume
 */
export function PersonalInfoSection({ 
  personalInfo, 
  resumeId, 
  onUpdate,
  onFileUpload,
  showUploadCard = true
}: PersonalInfoSectionProps) {
  
  // Handle input changes
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onUpdate(field, value);
  };

  return (
    <div className="cosmic-section p-6 rounded-lg" style={{ padding: 'var(--space-6)' }}>
      <div className="cosmic-profile-header mb-6" style={{ marginBottom: 'var(--space-6)' }}>
        <User className="h-5 w-5 text-cosmic-accent" />
        <h2 className="text-lg font-medium text-cosmic-text">Personal Information</h2>
      </div>
      
      {showUploadCard && (
        <div className="mb-6 bg-cosmic-card-secondary/30 border border-cosmic-border rounded-lg p-4" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-4)' }}>
          <div className="flex items-start gap-4" style={{ gap: 'var(--space-4)' }}>
            <div className="bg-cosmic-accent/20 p-3 rounded-lg" style={{ padding: 'var(--space-3)' }}>
              <Upload className="h-6 w-6 text-cosmic-accent" />
            </div>
            <div>
              <h3 className="text-cosmic-text font-medium mb-1" style={{ marginBottom: 'var(--space-1)' }}>
                Upload an existing resume
              </h3>
              <p className="text-cosmic-text-secondary text-sm mb-3" style={{ marginBottom: 'var(--space-3)' }}>
                Already have a resume? Upload a PDF, DOCX, or TXT file and we'll pre-fill this information for you.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="cosmic-button-outline border-cosmic-accent/30 bg-cosmic-accent/10 text-cosmic-accent hover:bg-cosmic-accent/20"
                onClick={onFileUpload}
              >
                Upload Resume
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="cosmic-profile-form grid grid-cols-1 md:grid-cols-2 gap-6" style={{ gap: 'var(--space-6)' }}>
        {/* Left column - Basic Info */}
        <div className="space-y-4" style={{ '--space-y': 'var(--space-4)' } as React.CSSProperties}>
          <div className="cosmic-form-group">
            <Label htmlFor="firstName" className="cosmic-form-label text-cosmic-text-secondary mb-1" style={{ marginBottom: 'var(--space-1)' }}>First Name</Label>
            <Input
              id="firstName"
              value={personalInfo.firstName}
              onChange={e => handleChange('firstName', e.target.value)}
              className="cosmic-form-input w-full bg-cosmic-input-bg border-cosmic-border text-cosmic-text"
              placeholder="Enter your first name"
            />
          </div>
          
          <div className="cosmic-form-group">
            <Label htmlFor="lastName" className="cosmic-form-label text-cosmic-text-secondary mb-1" style={{ marginBottom: 'var(--space-1)' }}>Last Name</Label>
            <Input
              id="lastName"
              value={personalInfo.lastName}
              onChange={e => handleChange('lastName', e.target.value)}
              className="cosmic-form-input w-full bg-cosmic-input-bg border-cosmic-border text-cosmic-text"
              placeholder="Enter your last name"
            />
          </div>
          
          <div className="cosmic-form-group">
            <Label htmlFor="headline" className="cosmic-form-label text-cosmic-text-secondary mb-1" style={{ marginBottom: 'var(--space-1)' }}>Professional Headline</Label>
            <Input
              id="headline"
              value={personalInfo.headline}
              onChange={e => handleChange('headline', e.target.value)}
              className="cosmic-form-input w-full bg-cosmic-input-bg border-cosmic-border text-cosmic-text"
              placeholder="e.g., Senior Software Engineer"
            />
            <div className="text-xs text-cosmic-text-secondary mt-1" style={{ marginTop: 'var(--space-1)' }}>
              A short title that appears below your name on your resume
            </div>
          </div>
        </div>
        
        {/* Right column - Contact Info */}
        <div className="space-y-4" style={{ '--space-y': 'var(--space-4)' } as React.CSSProperties}>
          <div className="cosmic-form-group">
            <Label htmlFor="email" className="cosmic-form-label text-cosmic-text-secondary mb-1" style={{ marginBottom: 'var(--space-1)' }}>Email</Label>
            <Input
              id="email"
              type="email"
              value={personalInfo.email}
              onChange={e => handleChange('email', e.target.value)}
              className="cosmic-form-input w-full bg-cosmic-input-bg border-cosmic-border text-cosmic-text"
              placeholder="your.email@example.com"
            />
          </div>
          
          <div className="cosmic-form-group">
            <Label htmlFor="phone" className="cosmic-form-label text-cosmic-text-secondary mb-1" style={{ marginBottom: 'var(--space-1)' }}>Phone Number</Label>
            <Input
              id="phone"
              value={personalInfo.phone}
              onChange={e => handleChange('phone', e.target.value)}
              className="cosmic-form-input w-full bg-cosmic-input-bg border-cosmic-border text-cosmic-text"
              placeholder="e.g., (123) 456-7890"
            />
          </div>
          
          <div className="cosmic-form-group">
            <Label htmlFor="location" className="cosmic-form-label text-cosmic-text-secondary mb-1" style={{ marginBottom: 'var(--space-1)' }}>Location (Optional)</Label>
            <Input
              id="location"
              value={personalInfo.location || ""}
              onChange={e => handleChange('location', e.target.value)}
              className="cosmic-form-input w-full bg-cosmic-input-bg border-cosmic-border text-cosmic-text"
              placeholder="City, State"
            />
          </div>
        </div>
      </div>
      
      {/* Summary section - Full width */}
      <div className="cosmic-form-group mt-6" style={{ marginTop: 'var(--space-6)' }}>
        <Label htmlFor="summary" className="cosmic-form-label text-cosmic-text-secondary mb-1" style={{ marginBottom: 'var(--space-1)' }}>
          Professional Summary
        </Label>
        <Textarea
          id="summary"
          value={personalInfo.summary}
          onChange={e => handleChange('summary', e.target.value)}
          className="cosmic-form-textarea w-full bg-cosmic-input-bg border-cosmic-border text-cosmic-text"
          placeholder="Write a brief summary of your professional background, key skills, and career goals..."
          rows={4}
        />
        <div className="text-xs text-cosmic-text-secondary mt-1" style={{ marginTop: 'var(--space-1)' }}>
          Pro tip: Keep your summary concise (3-5 sentences) and highlight your most impressive achievements and skills.
        </div>
      </div>
    </div>
  );
}