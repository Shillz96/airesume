import React from 'react';
import { Resume } from '@/features/resume/types';

/**
 * Compatibility component that redirects to the new ResumeTemplate
 * This allows existing components to continue working while we migrate
 */

interface ResumeTemplateProps {
  resume: Resume;
  onDownload?: () => void;
}

const ResumeTemplate: React.FC<ResumeTemplateProps> = (props) => {
  // Dynamically import the new component to prevent circular dependencies
  const NewResumeTemplate = React.lazy(() => import('@/features/resume/components/ResumeTemplate'));
  
  return (
    <React.Suspense fallback={<div>Loading template...</div>}>
      <NewResumeTemplate {...props} />
    </React.Suspense>
  );
};

export default ResumeTemplate;