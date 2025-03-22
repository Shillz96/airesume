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
    <div className="cosmic-card border border-white/10 bg-black/30 p-6 rounded-lg">
      <div className="flex items-center gap-2 mb-6">
        <User className="h-5 w-5 text-blue-400" />
        <h2 className="text-lg font-medium text-white">Personal Information</h2>
      </div>
      
      {showUploadCard && (
        <div className="mb-6 bg-blue-900/20 border border-blue-900/30 rounded-lg p-4">
          <div className="flex items-start gap-4">
            <div className="bg-blue-900/30 p-3 rounded-lg">
              <Upload className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-medium mb-1">
                Upload an existing resume
              </h3>
              <p className="text-gray-300 text-sm mb-3">
                Already have a resume? Upload a PDF, DOCX, or TXT file and we'll pre-fill this information for you.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                onClick={onFileUpload}
              >
                Upload Resume
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column - Basic Info */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="firstName" className="text-gray-200">First Name</Label>
            <Input
              id="firstName"
              value={personalInfo.firstName}
              onChange={e => handleChange('firstName', e.target.value)}
              className="cosmic-input mt-1"
              placeholder="Enter your first name"
            />
          </div>
          
          <div>
            <Label htmlFor="lastName" className="text-gray-200">Last Name</Label>
            <Input
              id="lastName"
              value={personalInfo.lastName}
              onChange={e => handleChange('lastName', e.target.value)}
              className="cosmic-input mt-1"
              placeholder="Enter your last name"
            />
          </div>
          
          <div>
            <Label htmlFor="headline" className="text-gray-200">Professional Headline</Label>
            <Input
              id="headline"
              value={personalInfo.headline}
              onChange={e => handleChange('headline', e.target.value)}
              className="cosmic-input mt-1"
              placeholder="e.g., Senior Software Engineer"
            />
            <div className="text-xs text-gray-400 mt-1">
              A short title that appears below your name on your resume
            </div>
          </div>
        </div>
        
        {/* Right column - Contact Info */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-gray-200">Email</Label>
            <Input
              id="email"
              type="email"
              value={personalInfo.email}
              onChange={e => handleChange('email', e.target.value)}
              className="cosmic-input mt-1"
              placeholder="your.email@example.com"
            />
          </div>
          
          <div>
            <Label htmlFor="phone" className="text-gray-200">Phone Number</Label>
            <Input
              id="phone"
              value={personalInfo.phone}
              onChange={e => handleChange('phone', e.target.value)}
              className="cosmic-input mt-1"
              placeholder="e.g., (123) 456-7890"
            />
          </div>
          
          <div>
            <Label htmlFor="location" className="text-gray-200">Location (Optional)</Label>
            <Input
              id="location"
              value={personalInfo.location || ""}
              onChange={e => handleChange('location', e.target.value)}
              className="cosmic-input mt-1"
              placeholder="City, State"
            />
          </div>
        </div>
      </div>
      
      {/* Summary section - Full width */}
      <div className="mt-6">
        <Label htmlFor="summary" className="text-gray-200">
          Professional Summary
        </Label>
        <Textarea
          id="summary"
          value={personalInfo.summary}
          onChange={e => handleChange('summary', e.target.value)}
          className="cosmic-textarea mt-1"
          placeholder="Write a brief summary of your professional background, key skills, and career goals..."
          rows={4}
        />
        <div className="text-xs text-gray-400 mt-1">
          Pro tip: Keep your summary concise (3-5 sentences) and highlight your most impressive achievements and skills.
        </div>
      </div>
    </div>
  );
}