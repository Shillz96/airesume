/**
 * Component Paths
 * 
 * This file centralizes component import paths to make it easier to:
 * 1. Switch between implementation versions (cosmic vs modern)
 * 2. Maintain consistent imports across the application
 * 3. Make global component updates in one place
 */

// UI Components
export const UI = {
  // Modern UI Components (new system)
  Button: '@/ui/core/Button',
  Card: '@/ui/core/Card',
  
  // Theme Components
  CosmicButton: '@/ui/core/CosmicButton',
  CosmicStarfield: '@/ui/theme/CosmicStarfield',
  CosmicBackground: '@/ui/theme/CosmicBackground',

  // Standard ShadCN UI Components
  Input: '@/components/ui/input',
  Textarea: '@/components/ui/textarea',
  Select: '@/components/ui/select',
  Checkbox: '@/components/ui/checkbox',
  Radio: '@/components/ui/radio-group',
  Switch: '@/components/ui/switch',
  Slider: '@/components/ui/slider',
  Tabs: '@/components/ui/tabs',
  Dialog: '@/components/ui/dialog',
  Badge: '@/components/ui/badge',
  Avatar: '@/components/ui/avatar',
  Toast: '@/components/ui/toast',
  
  // Core Components
  RichTextEditor: '@/ui/core/RichTextEditor',
  ButtonGuide: '@/ui/core/ButtonGuide',
};

// Layout Components
export const Layout = {
  Navbar: '@/ui/navigation/Navbar',
  SimpleNavbar: '@/ui/navigation/SimpleNavbar',
  PageHeader: '@/features/layout/components/PageHeader',
  Masthead: '@/features/layout/components/Masthead',
};

// Resume Components
export const Resume = {
  Template: '@/features/resume/components/ResumeTemplate',
  ResumeSection: '@/features/resume/components/ResumeSections',
  AIAssistant: '@/features/ai/components/AIAssistant',
  ResumeTips: '@/features/resume/components/ResumeTips',
};

// Job Components
export const Job = {
  Card: '@/features/job/components/JobCard',
  Filter: '@/features/job/components/JobFilter',
  Listing: '@/features/job/components/JobListing',
  InterviewAvatar: '@/features/job/components/JobInterviewAvatar',
  SearchProgress: '@/features/job/components/JobSearchProgress',
};

// Auth Components
export const Auth = {
  Dialog: '@/features/auth/components/AuthDialog',
  QuickLogin: '@/features/auth/components/QuickLogin',
};

// Dashboard Components
export const Dashboard = {
  Stats: '@/features/dashboard/components/DashboardStats',
  RecentActivity: '@/features/dashboard/components/RecentActivity',
  SubscriptionStatus: '@/features/subscription/components/SubscriptionStatus',
};