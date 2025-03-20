// Define types used in the storage interface

export interface DashboardStats {
  activeResumes: number;
  jobMatches: number;
  submittedApplications: number;
}

export interface Activity {
  id: number;
  type: 'resume_update' | 'job_application' | 'job_match';
  title: string;
  status: 'complete' | 'in_progress' | 'new';
  timestamp: string;
}
