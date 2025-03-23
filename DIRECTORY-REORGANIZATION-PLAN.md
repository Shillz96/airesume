# Directory Reorganization Plan

This document outlines a step-by-step plan to reorganize the project directory structure to improve maintainability, readability, and organization.

## Current Issues

1. **Component Duplication**: Multiple implementations of similar components (buttons, cards)
2. **Inconsistent Directory Structure**: Lack of feature-based organization
3. **Style File Duplication**: Overlapping CSS files with similar purposes
4. **Mixed Component Locations**: Feature-specific components spread across directories
5. **Incomplete Feature Grouping**: Related components not grouped together

## Reorganization Goals

1. **Feature-based Organization**: Group components by feature/domain
2. **Consistent Naming Conventions**: Standardize file and component naming
3. **Reduced Duplication**: Consolidate similar components and styles
4. **Improved Discoverability**: Make it easier to find related code
5. **Clear Boundaries**: Separate UI components from business logic

## Step-by-Step Reorganization Plan

### Phase 1: Client-side Reorganization

#### 1. Create Feature-based Directories

```
client/src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── pages/
│   ├── dashboard/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── pages/
│   ├── resume/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── pages/
│   └── jobs/
│       ├── components/
│       ├── hooks/
│       └── pages/
└── ...
```

#### 2. Move Components to Feature Directories

| Component | Current Location | New Location |
|-----------|------------------|--------------|
| `resume-section.tsx` | `components/` | `features/resume/components/` |
| `resume-template.tsx` | `components/` | `features/resume/components/` |
| `resume-tips.tsx` | `components/` | `features/resume/components/` |
| `job-card.tsx` | `components/` | `features/jobs/components/` |
| `job-filter.tsx` | `components/` | `features/jobs/components/` |
| `job-listing.tsx` | `components/` | `features/jobs/components/` |
| `job-interview-avatar.tsx` | `components/` | `features/jobs/components/` |
| `ai-assistant.tsx` | `components/` | `features/resume/components/` |
| `subscription-status.tsx` | `components/` | `features/dashboard/components/` |

#### 3. Move Pages to Feature Directories

| Page | Current Location | New Location |
|------|------------------|--------------|
| `resume-builder.tsx` | `pages/` | `features/resume/pages/` |
| `resumes-page.tsx` | `pages/` | `features/resume/pages/` |
| `job-finder.tsx` | `pages/` | `features/jobs/pages/` |
| `job-details.tsx` | `pages/` | `features/jobs/pages/` |
| `subscription-page.tsx` | `pages/` | `features/dashboard/pages/` |
| `home-page.tsx` | `pages/` | `features/dashboard/pages/` |
| `auth-page.tsx` | `pages/` | `features/auth/pages/` |
| `landing-page.tsx` | `pages/` | `features/auth/pages/` |

#### 4. Move Hooks to Feature Directories

| Hook | Current Location | New Location |
|------|------------------|--------------|
| `use-resume-data.tsx` | `hooks/` | `features/resume/hooks/` |
| `use-auth.tsx` | `hooks/` | `features/auth/hooks/` |
| `use-auth-dialog.tsx` | `hooks/` | `features/auth/hooks/` |
| `use-guest-mode.tsx` | `hooks/` | `features/auth/hooks/` |

#### 5. Consolidate UI Components

Create a unified UI component library:

```
client/src/
├── ui/
│   ├── core/
│   │   ├── Button.tsx        # Single unified button component
│   │   ├── Card.tsx          # Single unified card component
│   │   ├── Input.tsx         # Form input components
│   │   └── ...               # Other base components
│   ├── feedback/
│   │   ├── Alert.tsx
│   │   ├── Toast.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── Container.tsx
│   │   ├── Grid.tsx
│   │   └── ...
│   ├── navigation/
│   │   ├── Navbar.tsx        # Single unified navbar
│   │   ├── Sidebar.tsx
│   │   └── ...
│   └── theme/
│       ├── ThemeProvider.tsx
│       ├── CosmicBackground.tsx
│       └── ...
└── ...
```

#### 6. Reorganize Styles Directory

```
client/src/
├── styles/
│   ├── theme/
│   │   ├── colors.css        # All color variables
│   │   ├── typography.css    # Typography styles
│   │   ├── spacing.css       # Spacing system
│   │   └── animations.css    # Animation library
│   ├── components/           # Component-specific styles
│   ├── utilities/            # Utility classes
│   ├── reset.css             # CSS reset
│   └── global.css            # Global styles
└── ...
```

### Phase 2: Server-side Reorganization

#### 1. Create Feature-based Directories

```
server/
├── features/
│   ├── auth/
│   │   ├── controllers.ts
│   │   ├── middleware.ts
│   │   └── routes.ts
│   ├── resumes/
│   │   ├── controllers.ts
│   │   └── routes.ts
│   ├── jobs/
│   │   ├── controllers.ts
│   │   └── routes.ts
│   └── subscriptions/
│       ├── controllers.ts
│       └── routes.ts
├── services/               # External services
├── middleware/             # Shared middleware
├── utils/                  # Utility functions
├── db/                     # Database-related code
│   ├── index.ts            # Main export
│   └── schema.ts           # Schema reference (proxy to shared)
└── index.ts                # Entry point
```

#### 2. Reorganize Routes File

Split `routes.ts` into feature-specific route files:

```typescript
// server/features/auth/routes.ts
export function registerAuthRoutes(app: Express) {
  app.post('/api/login', ...);
  app.post('/api/register', ...);
  app.get('/api/logout', ...);
  // ...
}

// server/features/resumes/routes.ts
export function registerResumeRoutes(app: Express) {
  app.get('/api/resumes', ...);
  app.get('/api/resumes/:id', ...);
  // ...
}

// server/index.ts
import { registerAuthRoutes } from './features/auth/routes';
import { registerResumeRoutes } from './features/resumes/routes';
// ...

async function setupRoutes(app: Express) {
  registerAuthRoutes(app);
  registerResumeRoutes(app);
  // ...
}
```

### Phase 3: Shared Code Reorganization

#### 1. Expand Shared Directory

```
shared/
├── types/                  # Shared type definitions
│   ├── resume.ts
│   ├── job.ts
│   └── user.ts
├── validation/             # Validation schemas
│   ├── resume.ts
│   ├── job.ts
│   └── user.ts
├── constants/              # Shared constants
├── utils/                  # Shared utilities
└── schema.ts               # Database schema
```

## Implementation Strategy

### Approach 1: Gradual Migration (Recommended)

1. Start with a single feature (e.g., Resume features)
2. Create the new directory structure
3. Move components one by one
4. Update imports
5. Test thoroughly
6. Move to next feature

This minimizes risk and allows for incremental improvements.

### Approach 2: Parallel Structure

1. Create new directory structure alongside existing one
2. Implement new components in new structure
3. Gradually migrate functionality
4. Deprecate old structure when complete

This allows for a smoother transition but requires maintaining two structures temporarily.

## Migration Checklist

For each component/file being moved:

- [ ] Create target directory if it doesn't exist
- [ ] Copy file to new location
- [ ] Update imports in the moved file
- [ ] Update all references to the file throughout the codebase
- [ ] Test functionality thoroughly
- [ ] Remove original file once migration is verified

## Naming Conventions

Adopt consistent naming conventions:

1. **Component Files**: PascalCase (e.g., `Button.tsx`, `ResumeSection.tsx`)
2. **Utility Files**: camelCase (e.g., `formatDate.ts`, `validateInput.ts`)
3. **Feature Directories**: kebab-case (e.g., `resume-builder/`, `job-search/`)
4. **Component Directories**: camelCase (e.g., `components/`, `hooks/`)
5. **CSS Files**: kebab-case (e.g., `button-styles.css`, `card-layout.css`)

## Recommended Tools

To assist with this reorganization:

1. **VSCode Find/Replace**: For updating import paths
2. **Git**: Commit after each cohesive change to track progress
3. **Jest Tests**: Run tests after each migration to ensure functionality

## Risk Mitigation

1. **Create a detailed backup** before starting
2. **Work in a separate branch**
3. **Use Git stash** to save in-progress work
4. **Maintain comprehensive documentation** of changes
5. **Test continuously** to catch issues early

## Timeline Estimation

| Phase | Estimated Time | Complexity |
|-------|----------------|------------|
| Phase 1: Client-side | 3-5 days | High |
| Phase 2: Server-side | 2-3 days | Medium |
| Phase 3: Shared Code | 1-2 days | Low |
| Testing & Fixes | 2-3 days | Medium |

**Total Estimated Time**: 8-13 days