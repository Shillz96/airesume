# AIreHire Project Organization

This document provides a comprehensive overview of the project's structure and organization to make future development and maintenance easier.

## Directory Structure

### Core Directories
- **client/**: Frontend React application
- **server/**: Backend Express API
- **shared/**: Shared code (schemas, types) used by both client and server
- **attached_assets/**: Sample files and images for testing

### Client-side Structure
```
client/
├── src/                   # Source code
│   ├── components/        # Reusable UI components
│   │   ├── ui/            # Base UI components (shadcn/ui)
│   │   ├── ui-modern/     # Modern UI components
│   │   ├── layout/        # Layout components
│   │   ├── resume/        # Resume-specific components
│   │   └── theme/         # Theme-related components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and helpers
│   ├── pages/             # Page components
│   ├── styles/            # CSS styles
│   │   ├── animations/    # Animation styles
│   │   ├── base/          # Base styles and variables
│   │   ├── components/    # Component-specific styles
│   │   ├── layout/        # Layout styles
│   │   ├── theme/         # Theme styles
│   │   └── utilities/     # Utility styles
│   ├── App.tsx            # Main application component
│   ├── index.css          # Global styles
│   └── main.tsx           # Entry point
└── index.html             # HTML template
```

### Server-side Structure
```
server/
├── ai.ts                 # AI-related functionality using OpenAI
├── auth.ts               # Authentication with Passport.js
├── db.ts                 # Database connection
├── index.ts              # Server entry point
├── routes.ts             # API endpoints
├── services/             # External services integration
│   └── jobs-api.ts       # Job search API integration
├── storage.ts            # Data storage implementation
├── types.ts              # TypeScript types for server
└── vite.ts               # Vite configuration for server
```

### Shared Code
```
shared/
└── schema.ts             # Drizzle ORM schema definitions
```

## Database Schema

The application uses PostgreSQL with Drizzle ORM. Key tables include:

1. **users**: User accounts and authentication
2. **resumes**: User resumes with JSON content
3. **jobs**: Job listings from external API
4. **savedJobs**: Jobs saved by users
5. **applications**: Job applications submitted by users
6. **subscriptions**: User subscription plans
7. **addons**: Add-on features purchased by users
8. **payments**: Payment records

## Component System

The application uses a mix of:

1. **ShadCN/UI components**: Base UI components in `components/ui/`
2. **Custom cosmic components**: Themed components with cosmic design in root `components/`
3. **Modern UI components**: Updated design system in `components/ui-modern/`

## Styling Approach

The project uses a combination of:

1. **Tailwind CSS**: For utility-based styling
2. **CSS Modules**: For component-specific styles
3. **Global CSS**: For theme variables and utilities in `styles/`

The theme is controlled by:
- **theme.json**: Global theme configuration
- **cosmic-theme-unified.css**: CSS variables for the theme

## Authentication Flow

Authentication is handled through:
- **Passport.js**: For local user authentication
- **Express sessions**: For session management
- **PostgreSQL session store**: For persistent sessions

## Key Features

1. **Resume Builder**: Create and manage resumes
   - Components in `components/resume/`
   - Pages in `pages/resume-builder.tsx` and `pages/resumes-page.tsx`

2. **Job Search**: Find and apply to jobs
   - Components in `components/job-*.tsx`
   - Pages in `pages/job-finder.tsx` and `pages/job-details.tsx`

3. **AI Features**: AI-powered resume improvement
   - Server implementation in `server/ai.ts`
   - Client components in `components/ai-assistant.tsx` and `components/resume-tips.tsx`

4. **Subscription System**: Manage user subscriptions
   - Schema in `shared/schema.ts`
   - Components in `components/subscription-status.tsx`
   - Page in `pages/subscription-page.tsx`

## State Management

The application uses React Context and custom hooks for state management:

1. **Authentication**: `useAuth` hook and `AuthContext`
2. **Resume Data**: `useResumeData` hook
3. **Theme**: `useTheme` hook and `ThemeContext`
4. **UI State**: Various context providers and hooks

## API Endpoints

Key API endpoints include:

1. **Authentication**:
   - `/api/login`: User login
   - `/api/register`: User registration
   - `/api/logout`: User logout

2. **Resumes**:
   - `/api/resumes`: Get all user resumes
   - `/api/resumes/:id`: Get, update, or delete a specific resume
   - `/api/resumes/active`: Get active resume
   - `/api/resumes/parse`: Parse uploaded resume files

3. **Jobs**:
   - `/api/jobs`: Get job listings with filters
   - `/api/jobs/:id`: Get job details
   - `/api/saved-jobs`: Get jobs saved by user

4. **Applications**:
   - `/api/applications`: Submit job applications

5. **AI Features**:
   - `/api/resumes/:id/suggestions`: Get AI-powered resume suggestions
   - `/api/resumes/:id/tailor`: Tailor resume to job description

6. **Subscription**:
   - `/api/subscription`: Get or create user subscription
   - `/api/subscription/:id`: Update subscription
   - `/api/subscription/:id/cancel`: Cancel subscription

## Code Organization Issues and Improvements

1. **Style Duplication**: Multiple CSS files with overlapping styles
   - See `styles/REFACTORING-PLAN.md` for details on consolidation

2. **Component Consistency**: Multiple implementations of similar components
   - Unified button component needed (cosmic-button vs ui/button)
   - Card component variants need consolidation

3. **Naming Conventions**: Inconsistent naming across files
   - Some files use PascalCase, others use kebab-case
   - Component prefixes vary (cosmic-, modern-, ui-)

4. **Folder Structure**: Some miscategorized files
   - UI components mixed with business logic components
   - Style files distributed across multiple directories

## Workflows

The application uses a single workflow:
- **Start application**: Runs `npm run dev` to start the development server

## Next Steps for Better Organization

1. **Consolidate Components**: Merge duplicate component implementations
2. **Standardize Styles**: Follow the refactoring plan in `styles/REFACTORING-PLAN.md`
3. **Improve Naming Conventions**: Establish consistent naming patterns
4. **Restructure Folders**: Organize code more logically by feature/domain
5. **Document APIs**: Create comprehensive API documentation