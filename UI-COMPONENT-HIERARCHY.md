# UI Component Hierarchy

This document outlines the hierarchy and organization of UI components in the AIreHire application to help developers understand how components are related and used throughout the application.

## Base UI Components

These are foundational components from ShadCN UI and custom implementations:

```
components/ui/
├── accordion.tsx        # Collapsible content panels
├── alert-dialog.tsx     # Modal dialogs for alerts
├── alert.tsx            # Alert messages
├── aspect-ratio.tsx     # Maintain aspect ratio for elements
├── avatar.tsx           # User avatars
├── badge.tsx            # Status indicators and tags
├── breadcrumb.tsx       # Navigation breadcrumbs
├── button.tsx           # Basic button component
├── calendar.tsx         # Date picker
├── card.tsx             # Content container
├── carousel.tsx         # Image/content carousel
├── chart.tsx            # Data visualization
├── checkbox.tsx         # Form checkboxes
├── collapsible.tsx      # Expandable sections
├── command.tsx          # Command palette
├── context-menu.tsx     # Right-click context menu
├── dialog.tsx           # Modal dialogs
├── drawer.tsx           # Slide-out panels
├── dropdown-menu.tsx    # Dropdown menus
├── form.tsx             # Form elements and validation
├── hover-card.tsx       # Cards that appear on hover
├── input-otp.tsx        # One-time password input
├── input.tsx            # Text input fields
├── label.tsx            # Form labels
├── menubar.tsx          # Horizontal menus
├── navigation-menu.tsx  # Navigation components
├── pagination.tsx       # Pagination controls
├── popover.tsx          # Popover tooltips
├── progress.tsx         # Progress indicators
├── radio-group.tsx      # Radio button groups
├── resizable.tsx        # Resizable panels
├── scroll-area.tsx      # Scrollable containers
├── select.tsx           # Dropdown select inputs
├── separator.tsx        # Visual dividers
├── sheet.tsx            # Side panel sheets
├── sidebar.tsx          # Application sidebar
├── skeleton.tsx         # Loading placeholders
├── slider.tsx           # Range sliders
├── switch.tsx           # Toggle switches
├── table.tsx            # Data tables
├── tabs.tsx             # Tabbed interfaces
├── textarea.tsx         # Multiline text inputs
├── toaster.tsx          # Toast notifications container
├── toast.tsx            # Toast notification component
├── toggle-group.tsx     # Group of toggles
├── toggle.tsx           # Toggle buttons
└── tooltip.tsx          # Tooltips
```

## Cosmic-themed Components

These components implement the cosmic design system:

```
components/
├── cosmic-background.tsx    # Animated cosmic background
├── cosmic-button.tsx        # Styled buttons with cosmic theme
├── cosmic-starfield.tsx     # Star field animation
└── cosmic-button-refactored.tsx  # Updated button implementation
```

## Modern UI Components

Updated design system components:

```
components/ui-modern/
├── Button.tsx               # Modern button implementation
└── [other modern components]
```

## Feature-specific Components

Components organized by feature:

### Resume Components
```
components/resume/
└── ResumeAIAssistant.tsx    # AI assistant for resume building

components/
├── resume-section.tsx       # Resume section editors
├── resume-template.tsx      # Resume display templates
└── resume-tips.tsx          # AI-powered resume improvement tips
```

### Job-related Components
```
components/
├── job-card.tsx             # Job listing card
├── job-filter.tsx           # Job search filters
├── job-interview-avatar.tsx # Interview simulation
├── job-listing.tsx          # Detailed job listing
└── job-search-progress.tsx  # Job search progress tracker
```

### Dashboard Components
```
components/
├── dashboard-stats.tsx      # Statistics display
└── recent-activity.tsx      # User activity feed
```

### Navigation Components
```
components/
├── navbar.tsx               # Main navigation bar
├── SimpleNavbar.tsx         # Simplified navigation
└── layout/
    └── modern-navbar.tsx    # Updated navigation bar
```

### Authentication Components
```
components/
├── auth-dialog.tsx          # Login/register dialog
└── quick-login.tsx          # Quick admin login
```

## Page Components

Pages that integrate multiple components:

```
pages/
├── admin-access.tsx         # Admin dashboard
├── auth-page.tsx            # Authentication page
├── home-page.tsx            # User dashboard
├── job-details.tsx          # Job detail view
├── job-finder.tsx           # Job search page
├── landing-page.tsx         # Marketing landing page
├── not-found.tsx            # 404 page
├── resume-builder.tsx       # Resume creation/editing
├── resumes-page.tsx         # Resume management
└── subscription-page.tsx    # Subscription management
```

## Component Relationship Diagram

```
App.tsx
├── ThemeProvider
│   └── AuthProvider
│       └── GuestModeProvider
│           └── AuthDialogProvider
│               └── AppContent
│                   ├── CosmicBackground
│                   ├── Navbar
│                   │   ├── ThemeButton
│                   │   └── NavigationMenu
│                   ├── Router
│                   │   ├── LandingPage
│                   │   ├── HomePage
│                   │   │   ├── DashboardStats
│                   │   │   └── RecentActivity
│                   │   ├── ResumeBuilder
│                   │   │   ├── ResumeSections
│                   │   │   │   ├── ResumeContactSection
│                   │   │   │   ├── ResumeSummarySection
│                   │   │   │   ├── ResumeExperienceSection
│                   │   │   │   ├── ResumeEducationSection
│                   │   │   │   ├── ResumeSkillsSection
│                   │   │   │   └── ResumeProjectsSection
│                   │   │   ├── ResumeTemplate
│                   │   │   └── AIAssistant
│                   │   ├── ResumesPage
│                   │   │   └── [Resume cards]
│                   │   ├── JobFinder
│                   │   │   ├── JobFilter
│                   │   │   └── JobCard
│                   │   ├── JobDetails
│                   │   │   ├── JobListing
│                   │   │   └── JobInterviewAvatar
│                   │   ├── SubscriptionPage
│                   │   │   └── SubscriptionStatus
│                   │   └── AdminAccess
│                   ├── GoAdminLink
│                   └── QuickLogin
└── Toaster
```

## Component Dependencies

Key component dependencies and relationships:

1. **Button Components**
   - `components/ui/button.tsx`: Base button
   - `components/cosmic-button.tsx`: Themed button
   - `components/ui-modern/Button.tsx`: Modern button
   - `components/ui/ThemeButton.tsx`: Theme-aware button

2. **Card Components**
   - `components/ui/card.tsx`: Base card
   - `components/ui/ThemeCard.tsx`: Theme-aware card
   - `components/ui/modern-card.tsx`: Modern card

3. **Resume Section Components**
   - All import from `components/resume-section.tsx`
   - Used in `pages/resume-builder.tsx`

4. **Job Components**
   - `job-card.tsx` used in `job-finder.tsx`
   - `job-listing.tsx` used in `job-details.tsx`

5. **Theme Components**
   - Theme configuration managed by `ThemeContext` in `contexts/ThemeContext.tsx`
   - Theme values applied in `lib/theme-loader.ts`

## Component Consolidation Recommendations

1. **Button Consolidation**
   - Merge `cosmic-button.tsx`, `ui/button.tsx`, and `ui-modern/Button.tsx` into a single unified button component
   - Maintain variant support through props

2. **Card Consolidation**
   - Create a single card component with theme and variant support
   - Remove duplicated card implementations

3. **Navigation Components**
   - Standardize on a single navbar implementation
   - Remove duplicate navbar components

4. **Resume Section Organization**
   - Move all resume-related components to a dedicated `components/resume/` directory
   - Standardize naming conventions for resume components