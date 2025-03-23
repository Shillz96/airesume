# Project Directory Structure

This document outlines the organized directory structure for the AIreHire application. The structure follows a feature-based architecture to ensure maintainability and scalability.

## Root Structure

```
client/
├── src/
│   ├── features/             # Feature-specific code
│   ├── ui/                   # Reusable UI components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilities and helper functions
│   ├── contexts/             # React contexts
│   ├── pages/                # Page components
│   ├── components/           # Legacy components (to be migrated)
│   ├── App.tsx               # Main application component
│   └── main.tsx              # Application entry point
server/                       # Backend server code
shared/                       # Shared code between client and server
types/                        # TypeScript type definitions
```

## Features Directory

The `features` directory contains domain-specific code organized by feature:

```
features/
├── auth/                     # Authentication feature
│   ├── components/           # Authentication-specific components
│   ├── hooks/                # Authentication-specific hooks
│   └── types.ts              # Authentication type definitions
├── resume/                   # Resume management feature
│   ├── components/           # Resume-specific components
│   ├── hooks/                # Resume-specific hooks
│   └── types.ts              # Resume type definitions
├── job/                      # Job search feature
│   ├── components/           # Job-specific components
│   ├── hooks/                # Job-specific hooks
│   └── types.ts              # Job type definitions
├── dashboard/                # Dashboard feature
│   └── components/           # Dashboard-specific components
├── layout/                   # Layout components
│   └── components/           # Layout-specific components
├── subscription/             # Subscription management
│   └── components/           # Subscription-specific components
└── ai/                       # AI features
    └── components/           # AI-specific components
```

## UI Directory

The `ui` directory contains reusable UI components not specific to any feature:

```
ui/
├── core/                     # Core UI components
│   ├── Button.tsx            # Button component
│   ├── Card.tsx              # Card component
│   └── RichTextEditor.tsx    # Rich text editor component
├── theme/                    # Theme-related components
│   ├── CosmicBackground.tsx  # Cosmic background component
│   └── CosmicStarfield.tsx   # Starfield component
└── navigation/               # Navigation components
    ├── Navbar.tsx            # Main navigation bar
    └── SimpleNavbar.tsx      # Simplified navigation for certain pages
```

## Hooks Directory

The `hooks` directory contains custom React hooks:

```
hooks/
├── use-auth.tsx              # Authentication hook
├── use-toast.ts              # Toast notification hook
├── use-mobile.tsx            # Mobile detection hook
└── use-guest-mode.tsx        # Guest mode hook
```

## Lib Directory

The `lib` directory contains utilities and helper functions:

```
lib/
├── utils.ts                  # General utilities
├── theme-utils.ts            # Theme utilities
├── theme-loader.ts           # Theme loading functionality
├── queryClient.ts            # Query client configuration
├── protected-route.tsx       # Protected route wrapper
└── componentPaths.ts         # Component import paths
```

## Contexts Directory

The `contexts` directory contains React contexts:

```
contexts/
└── ThemeContext.tsx          # Theme context for app-wide theming
```

## Migration Status

We are currently in the process of migrating components from the flat structure to the feature-based architecture. See [COMPONENT-MIGRATION-PLAN.md](./COMPONENT-MIGRATION-PLAN.md) for details on migration progress.

## Benefits of This Structure

1. **Maintainability**: Code is organized by feature, making it easier to locate and modify related code.
2. **Testability**: Features can be tested in isolation.
3. **Scalability**: New features can be added without impacting existing code.
4. **Team Collaboration**: Teams can work on different features simultaneously with minimal conflicts.
5. **Code Reuse**: Common UI components are centralized for consistency.

## Style Guidelines

1. All feature-specific components should be placed in their respective feature directory.
2. Reusable UI components should go in the `ui` directory.
3. All components should use the theme system for styling.
4. Files should use PascalCase for component files (e.g., `Button.tsx`) and camelCase for utilities (e.g., `utils.ts`).
5. Each component should have a clear, descriptive name that indicates its purpose.
6. Components should be documented with JSDoc comments for clarity.