# Component Migration Plan

This document outlines the plan for migrating components from the old flat structure to the new feature-based architecture.

## Current Status

We have implemented the core infrastructure for our feature-based architecture:
- Created central UI components in `ui/core` (Button, Card, RichTextEditor)
- Created theme components in `ui/theme` (CosmicBackground, CosmicStarfield)
- Established feature directories for resume and job features
- Created core components for these features
- Updated App.tsx to use the new feature-organized components

## Migration Plan for Remaining Components

### UI Core Components
- [x] Button.tsx → ui/core/Button.tsx
- [x] Card.tsx → ui/core/Card.tsx
- [x] RichTextEditor.tsx → ui/core/RichTextEditor.tsx
- [x] cosmic-button.tsx → ui/core/CosmicButton.tsx (archive after migration)
- [ ] cosmic-button-refactored.tsx → (archive/remove - redundant)
- [x] button-guide.tsx → ui/core/ButtonGuide.tsx

### UI Theme Components
- [x] cosmic-background.tsx → ui/theme/CosmicBackground.tsx
- [x] cosmic-starfield.tsx → ui/theme/CosmicStarfield.tsx

### Layout Components
- [x] page-header.tsx → features/layout/components/PageHeader.tsx
- [x] masthead.tsx → features/layout/components/Masthead.tsx
- [ ] navbar.tsx → ui/navigation/Navbar.tsx
- [x] SimpleNavbar.tsx → ui/navigation/SimpleNavbar.tsx

### Job Feature Components
- [x] job-card.tsx → features/job/components/JobCard.tsx
- [x] job-filter.tsx → features/job/components/JobFilter.tsx
- [x] job-interview-avatar.tsx → features/job/components/JobInterviewAvatar.tsx
- [ ] job-listing.tsx → features/job/components/JobListing.tsx
- [x] job-search-progress.tsx → features/job/components/JobSearchProgress.tsx

### Resume Feature Components
- [x] resume-section.tsx → features/resume/components/ResumeSections.tsx
- [ ] resume-template.tsx → features/resume/components/ResumeTemplate.tsx
- [x] resume-tips.tsx → features/resume/components/ResumeTips.tsx

### Dashboard Feature Components
- [x] dashboard-stats.tsx → features/dashboard/components/DashboardStats.tsx
- [x] recent-activity.tsx → features/dashboard/components/RecentActivity.tsx

### Auth Feature Components
- [x] auth-dialog.tsx → features/auth/components/AuthDialog.tsx
- [x] quick-login.tsx → features/auth/components/QuickLogin.tsx

### Common Feature Components
- [x] admin-tools.tsx → features/admin/components/AdminTools.tsx
- [x] go-admin-link.tsx → features/admin/components/GoAdminLink.tsx
- [x] ai-assistant.tsx → features/ai/components/AIAssistant.tsx
- [x] subscription-status.tsx → features/subscription/components/SubscriptionStatus.tsx

## Migration Process
1. Create the new component in the appropriate feature directory
2. Update imports in all files that use the component
3. Test that the application works correctly with the new component
4. Archive the old component with a comment pointing to the new location
5. Eventually remove the old component once all references have been updated

## Component Dependency Graph
For complex components with many dependencies, we'll need to follow a bottom-up approach:
1. Migrate leaf components first (those with no dependencies on other components)
2. Then migrate components that depend on the leaf components
3. Continue until all components are migrated

## Completion Checklist
- [ ] All UI core components migrated
- [ ] All UI theme components migrated
- [ ] All feature-specific components moved to their respective feature directories
- [ ] All page components updated to use the new components
- [ ] All old components archived or removed
- [ ] Application fully tested with the new structure