# ResumeAI Documentation

This document provides information on how to customize and configure your ResumeAI application.

## Table of Contents
- [Theme Customization](#theme-customization)
- [Layout & Navigation](#layout--navigation)
- [Component Structure](#component-structure)
- [File Organization](#file-organization)

## Theme Customization

### Main Theme Configuration
The appearance and theme of ResumeAI can be customized by editing the `theme.json` file at the root of the project:

```json
{
  "variant": "professional",     // Options: "professional", "vibrant", "tint"
  "primary": "hsl(221.2 83.2% 53.3%)",   // Primary color (royal blue by default)
  "appearance": "light",         // Options: "light", "dark", "system"
  "radius": 0.5,                 // Controls roundness of UI elements (0-1)
  "colors": {
    "jobFinderBackground": "linear-gradient(...)",  // Job finder page gradient
    "resumeHighlight1": "bg-blue-500",  // Resume card highlight colors
    "resumeHighlight2": "bg-purple-500",
    "resumeHighlight3": "bg-emerald-500"
  }
}
```

### Applying Custom Colors to Components

You can reference the theme colors in your components using the Tailwind CSS classes provided by shadcn/ui.

For example:
- `text-primary` - Text with primary color
- `bg-primary` - Background with primary color
- `border-primary` - Border with primary color

## Layout & Navigation

### Navigation Bar
The main navigation is defined in `client/src/components/navbar.tsx`. To add, remove, or modify navigation items:

1. Edit the `navItems` array:
```typescript
const navItems = [
  { path: "/", label: "Dashboard" },
  { path: "/resumes", label: "Resumes" },
  { path: "/resume-builder", label: "Resume Builder" },
  { path: "/job-finder", label: "Job Finder" },
];
```

### Page Layout Structure
Each page follows a common structure:

```tsx
export default function PageName() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-20">
        {/* Page content here */}
      </main>
    </div>
  );
}
```

## Component Structure

The application is organized into several key components:

1. **Pages**: Located in `client/src/pages/`
   - `home-page.tsx` - Dashboard view
   - `resumes-page.tsx` - Resume management and templates
   - `resume-builder.tsx` - Resume editor
   - `job-finder.tsx` - Job search and matching

2. **UI Components**: Located in `client/src/components/`
   - `ui/` - Contains all shadcn/ui components
   - `resume-section.tsx` - Resume section components (Education, Experience, etc.)
   - `resume-template.tsx` - Resume display templates
   - `job-card.tsx` - Job listing display
   - `job-filter.tsx` - Job search filters
   - `ai-assistant.tsx` - AI-powered suggestion component

## File Organization

```
client/
  ├── src/
  │   ├── components/    # Reusable UI components
  │   ├── hooks/         # Custom React hooks
  │   ├── lib/           # Utility functions and helpers
  │   ├── pages/         # Page components
  │   ├── App.tsx        # Main application component
  │   ├── index.css      # Global styles
  │   └── main.tsx       # Entry point
  └── index.html         # HTML template

server/
  ├── ai.ts             # AI-related functionality
  ├── auth.ts           # Authentication
  ├── index.ts          # Server entry point
  ├── routes.ts         # API endpoints
  ├── storage.ts        # Data storage
  └── vite.ts           # Vite configuration

shared/
  └── schema.ts         # Shared data models

theme.json             # Global theme configuration
```

## Customizing Resume Templates

To create a new resume template:

1. Add a new template component in `client/src/components/resume-template.tsx`
2. Register it in the `ResumeTemplate` component
3. Add the template option to the template selection UI in the Resumes page