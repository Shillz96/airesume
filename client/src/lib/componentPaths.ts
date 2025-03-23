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
  Button: '@/components/ui/modern-button',
  Card: '@/components/ui/modern-card',
  
  // Legacy UI Components (for backward compatibility)
  CosmicButton: '@/components/cosmic-button',
  CosmicStarfield: '@/components/cosmic-starfield',

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
};

// Layout Components
export const Layout = {
  Background: '@/components/layout/background',
  Navbar: '@/components/layout/modern-navbar',
  LegacyNavbar: '@/components/navbar',
  PageHeader: '@/components/page-header',
};

// Resume Components
export const Resume = {
  Template: '@/components/resume-template',
  ResumeSection: '@/components/resume-section',
  AIAssistant: '@/components/ai-assistant',
};

// Job Components
export const Job = {
  JobCard: '@/components/job-card',
  JobFilter: '@/components/job-filter',
  JobListing: '@/components/job-listing',
};

// Auth Components
export const Auth = {
  AuthDialog: '@/components/auth-dialog',
  QuickLogin: '@/components/quick-login',
};

// Dashboard Components
export const Dashboard = {
  Stats: '@/components/dashboard-stats',
  RecentActivity: '@/components/recent-activity',
};