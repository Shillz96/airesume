# Modern Theme System

This directory contains the modern theme system for the application, which is designed to replace the previous cosmic-themed styling with a cleaner, more consistent approach.

## Structure

- `theme.css`: Core theme variables and base styles using CSS custom properties. These are designed to work seamlessly with both the application code and Tailwind CSS.

## Design Principles

1. **Consistent Variables**: All colors and design tokens are defined as CSS variables with a clear naming convention.
2. **Dark Mode Support**: Built-in support for both light and dark modes using CSS variables and the `.dark` class.
3. **HSL Color Format**: Colors are defined in HSL format for easier manipulation and transparency adjustments.
4. **Responsive Design**: The theme is designed to be responsive across all device sizes.
5. **Accessibility**: Color contrast ratios and focus states are designed with accessibility in mind.

## Integration with Tailwind

The theme variables are designed to work with Tailwind CSS. The variables defined here are also referenced in the Tailwind configuration to ensure consistent styling across the application.

## Usage

```css
/* Example usage of theme variables */
.my-component {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
}

.my-component:hover {
  background-color: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}
```

## Modern Component System

The modern theme works with a set of new React components found in:

- `/components/ui/modern-button.tsx`: Modern button component
- `/components/ui/modern-card.tsx`: Modern card component
- `/components/layout/background.tsx`: Modern background component
- `/components/layout/modern-navbar.tsx`: Modern navbar component

These components are designed to replace the existing cosmic-themed components while maintaining the same API surface area where possible, allowing for a gradual migration.

## Transition Strategy

The modern theme system is being introduced alongside the existing cosmic theme to allow for a gradual transition. Components will be migrated one by one, and pages will be updated to use the new components as they become available.

For convenience during the transition, a central import path registry is available at `src/lib/componentPaths.ts` that allows for easy switching between cosmic and modern components.