# Styling Standardization Plan

## Main Issues Identified
1. **Mixed Button Components**: Two different button components (`cosmic-button.tsx` and `cosmic-button-refactored.tsx`) with different implementations.
2. **Inconsistent Classnames**: Some components use `cosmic-` prefixed classes while others use Tailwind directly.
3. **Multiple Styling Sources**: Styles coming from CSS files, Tailwind classes, and shadcn/ui components.
4. **Inconsistent Theme Variable Access**: Some components use CSS variables, others use the ThemeContext.
5. **Multiple Resume Section Components**: Different implementations for the same functionality.

## Standardization Strategy

### 1. Button Components
- Keep only the `cosmic-button-refactored.tsx` implementation which uses the more modern approach with class-variance-authority.
- Replace all uses of the original `cosmic-button.tsx` with the refactored version.
- Ensure all buttons in the Resume Builder page use the refactored component.

### 2. Standardize Class Naming
- Use consistent prefixes for custom classes (e.g., `cosmic-`) throughout the application.
- For components that use both Tailwind and custom classes, prioritize Tailwind where possible.
- Create a new utility file to generate consistent classes for common UI patterns.

### 3. Consolidate CSS Files
- Merge overlapping CSS variables from `theme-variables.css` and `cosmic-config.css`.
- Create a single, well-organized theme configuration file.
- Remove duplicate style definitions from multiple files.

### 4. Standardize Theme Access
- Use ThemeContext consistently across components.
- Create helper functions for common theme operations to ensure consistency.
- Ensure dark/light mode transitions work properly across all components.

### 5. Resume Component Cleanup
- Keep only the `UnifiedResumeSections.tsx` implementation.
- Remove or deprecate other resume component implementations.
- Update any components that still reference old implementations.

## Implementation Steps

### Step 1: Fix Button Components
- Update all button instances to use the refactored cosmic button
- Remove or deprecate the original cosmic button

### Step 2: Standardize Resume Builder Components
- Ensure all resume sections use the unified components
- Fix any styling inconsistencies in these components
- Make sure all inputs, forms, and controls have consistent styling

### Step 3: Create Consistent Theme
- Merge theme variables into a single file
- Update the theme context to use these variables
- Ensure all components reference the theme consistently

### Step 4: Update Page Layout
- Apply consistent layout patterns across pages
- Standardize spacing, padding, and margins
- Ensure responsive behavior is consistent

### Step 5: Test Across All Pages
- Verify styling is consistent across all pages
- Check that dark/light mode works properly
- Ensure responsive design works on all screen sizes