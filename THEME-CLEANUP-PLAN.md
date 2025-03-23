# Theme Cleanup & Standardization Plan

## Goal
Standardize all pages to match the auth-page styling and remove all redundant theme files.

## Theme Elements To Standardize

### CSS Classes
- `cosmic-text-gradient` for headings
- `cosmic-btn-glow` for buttons
- `cosmic-card` for card components 
- Standard container: `w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-screen-xl -mt-4 pb-10 min-h-screen relative z-10`
- Dialog styling: `bg-card/90 backdrop-blur-xl border-white/10`

### Files to Keep
- `client/src/index.css` - Main CSS file (single source of truth)
- `client/src/contexts/UnifiedThemeContext.tsx` - Main theme context
- `client/src/components/ThemeManager.tsx` - Theme manager component
- `theme.json` - Theme configuration

### Files to Remove (Phase 1)
- `client/src/contexts/ThemeContext.tsx` (after migrating all components to use UnifiedThemeContext)
- All files in `client/src/components/theme/`
- `client/src/styles/animations/cosmic-animations.css` 
- `client/src/styles/base/theme-variables.css`
- `client/src/styles/components/cosmic-components.css`
- `client/src/styles/components/cosmic-dialog.css`
- `client/src/styles/components/cosmic-tabs.css`
- `client/src/styles/cosmic-resume.css`
- `client/src/styles/archive/*` (all files in archive)
- `client/src/styles/cosmic-theme-unified.css`
- `client/src/styles/modern/theme.css`
- `client/src/styles/theme/*` (all files in theme directory)
- `client/src/styles/theme-variables.css`

### Components to Standardize
1. Dialog/Modal styling to match auth-page
2. Button styling to use cosmic-btn-glow
3. Card styling to use cosmic-card
4. Headings to use cosmic-text-gradient

## Implementation Steps

1. Update main container in App.tsx ✅
2. Update ThemeManager.tsx documentation ✅
3. Ensure all pages use the standard container
4. Create unified button, card, and text components 
5. Update all dialogs to match auth-page styling
6. Migrate all components to use UnifiedThemeContext
7. Remove redundant theme files
8. Test all pages for consistent styling

## Final Validation
- Verify all pages look consistent with auth-page styling
- Confirm theme changes (light/dark) work across the entire application
- Ensure no broken references to deleted files