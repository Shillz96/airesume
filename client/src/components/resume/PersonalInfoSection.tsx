import React from 'react';
import { PersonalInfo } from '@/hooks/use-resume-data';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { User, Upload } from 'lucide-react';
import { CosmicButton } from '@/components/cosmic-button';
import AIAssistant from '@/components/ai-assistant';

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
  // Handler for applying summary from AI suggestions
  const handleApplySummary = (summary: string) => {
    onUpdate('summary', summary);
  };

  return (
    <div className="cosmic-resume-section">
      <div className="main-content">
        {/* Optional resume upload card */}
        {showUploadCard && (
          <div className="md:col-span-3 mb-4">
            <div className="cosmic-card border border-blue-500/30 bg-blue-900/20 p-6 rounded-lg relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-3">
                  <Upload className="h-5 w-5 mr-2 text-blue-400" />
                  <h3 className="font-medium text-xl text-white">
                    Upload Your Existing Resume
                  </h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Skip manual entry by uploading your existing
                  resume. Our AI will automatically extract your
                  information and fill out this form for you.
                </p>
                <div className="flex flex-wrap gap-3">
                  <CosmicButton
                    variant="primary"
                    onClick={onFileUpload}
                    iconLeft={<Upload />}
                  >
                    Upload PDF, DOCX, or TXT
                  </CosmicButton>
                  <p className="text-sm text-gray-400 flex items-center">
                    <span className="mr-1">or</span> fill out the
                    form manually below
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center mb-5">
            <User className="h-5 w-5 mr-2 text-blue-400" />
            <h2 className="text-white text-xl font-semibold">Personal Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="cosmic-form-group">
              <Label htmlFor="firstName" className="cosmic-form-label">
                First Name
              </Label>
              <Input
                id="firstName"
                value={personalInfo.firstName}
                onChange={(e) => onUpdate("firstName", e.target.value)}
                className="cosmic-form-input"
                placeholder="Dylan"
              />
            </div>
            <div className="cosmic-form-group">
              <Label htmlFor="lastName" className="cosmic-form-label">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={personalInfo.lastName}
                onChange={(e) => onUpdate("lastName", e.target.value)}
                className="cosmic-form-input"
                placeholder="Spivack"
              />
            </div>
            <div className="cosmic-form-group">
              <Label htmlFor="email" className="cosmic-form-label">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={personalInfo.email}
                onChange={(e) => onUpdate("email", e.target.value)}
                className="cosmic-form-input"
                placeholder="dylan.spivack@example.com"
              />
            </div>
            <div className="cosmic-form-group">
              <Label htmlFor="phone" className="cosmic-form-label">
                Phone
              </Label>
              <Input
                id="phone"
                value={personalInfo.phone}
                onChange={(e) => onUpdate("phone", e.target.value)}
                className="cosmic-form-input"
                placeholder="(303) 555-9307"
              />
            </div>
          </div>

          <div className="cosmic-form-group mb-6">
            <Label htmlFor="headline" className="cosmic-form-label">
              Professional Headline
            </Label>
            <Input
              id="headline"
              value={personalInfo.headline}
              onChange={(e) => onUpdate("headline", e.target.value)}
              className="cosmic-form-input"
              placeholder="Senior Software Engineer specializing in React and Node.js"
            />
          </div>

          <div className="cosmic-form-group">
            <Label htmlFor="summary" className="cosmic-form-label">
              Professional Summary
            </Label>
            <Textarea
              id="summary"
              value={personalInfo.summary}
              onChange={(e) => onUpdate("summary", e.target.value)}
              className="cosmic-form-input cosmic-form-textarea"
              placeholder="Dedicated and efficient software engineer with 8+ years of experience in application development. Highly skilled in React, Node.js, and API design. Improved application performance by 40% and reduced load times by 30% in my previous role."
              rows={6}
            />
          </div>
        </div>
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
              <h3>AI Summary Assistant</h3>
            </div>
            
            <AIAssistant 
              resumeId={resumeId}
              onApplySummary={handleApplySummary}
              activeTab="contact"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalInfoSection;