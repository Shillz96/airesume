# Cosmic Resume Builder CSS Style Guide

This document serves as a guide for styling components and ensuring consistency across the application. It outlines the CSS architecture, naming conventions, and best practices for developing and maintaining the cosmic-themed design system.

## CSS Architecture

Our CSS is organized into the following structure:

```
client/src/styles/
├── base/                # Base styles and variables
│   ├── base.css         # Base elements and reset styles
│   └── variables.css    # CSS variables for design tokens
├── components/          # Component specific styles
│   ├── buttons.css      # Button styling
│   ├── cards.css        # Card component styling
│   ├── cosmic-components.css # Unified cosmic-themed components
│   ├── cosmic-dialog.css    # Dialog/modal styling
│   ├── cosmic-tabs.css      # Tab component styling
│   ├── forms.css        # Form controls styling
│   ├── resume-sections.css  # Resume section specific styling
│   └── tabs.css         # Tab navigation styling
├── animations/          # Animation related styles
│   ├── animations.css   # General animations
│   └── cosmic-animations.css # Cosmic-themed animations
├── layout/              # Layout related styles
│   └── navigation.css   # Navigation components
├── utilities/           # Utility classes
│   └── utilities.css    # Helper utilities
├── archive/             # Deprecated styles (for reference)
└── cosmic-theme-unified.css # Single source of truth for theme variables
```

## Primary CSS Files

1. **cosmic-theme-unified.css**: The main theme file with all variables. Always reference these variables for consistent styling.
2. **base/variables.css**: Design tokens and spacing values that complement the unified theme.
3. **components/cosmic-components.css**: Reusable component styles following the cosmic design system.

## Naming Conventions

- Use the **`cosmic-`** prefix for components that follow our design system
- Use BEM-like naming for component variants:
  - `.cosmic-button` (Block)
  - `.cosmic-button-primary` (Element/Variant)
  - `.cosmic-button-disabled` (Modifier/State)

## CSS Variable Usage

Always use CSS variables from `cosmic-theme-unified.css` for:

- Colors: `rgb(var(--color-primary))`
- Spacing: `var(--space-4)`
- Border radius: `var(--radius-md)`
- Shadows: `var(--shadow-lg)`
- Transitions: `var(--transition-normal)`

## Theme Variants

The application supports three theme variants:

1. **Professional**: Clean, minimal styling with subtle animations
2. **Vibrant**: Bold colors, stronger gradients and more pronounced animations
3. **Tint**: Flat design with colored accents and slower animations

Use the attribute selector to apply variant-specific styles:
```css
:root[data-theme-variant="professional"] .cosmic-component { /* styles */ }
```

## Button Styles

When adding new button styles, extend the existing cosmic button classes:

- `.cosmic-button-primary`: Primary blue gradient button
- `.cosmic-button-secondary`: Secondary lighter blue button
- `.cosmic-button-outline`: Outlined button with transparent background
- `.cosmic-button-ghost`: Text-only button with hover effect
- `.cosmic-button-destructive`: Red/danger action button

## Card Styles

Use these card variants consistently:

- `.cosmic-card`: Base card with subtle hover effect
- `.cosmic-card-hoverable`: Card with stronger hover transform
- `.cosmic-card-glass`: Card with frosted glass effect
- `.cosmic-card-gradient-border`: Card with gradient border
- `.cosmic-card-gradient`: Card with gradient background

## Spacing System

Follow the consistent spacing scale:

- `--space-1`: 4px (0.25rem)
- `--space-2`: 8px (0.5rem)
- `--space-3`: 12px (0.75rem)
- `--space-4`: 16px (1rem)
- `--space-6`: 24px (1.5rem)
- `--space-8`: 32px (2rem)
- `--space-12`: 48px (3rem)
- `--space-16`: 64px (4rem)

## Duplication Issues

The following areas have some style duplication that should be addressed:

1. **Tab styles**: Both `cosmic-tabs.css` and `tabs.css` define similar tab styles
2. **Section headers**: Defined in `resume-sections.css` and `cosmic-components.css`
3. **Card styles**: Similar styles in `cards.css` and `cosmic-components.css`
4. **Animation duplications**: Similar animations in both animation files

## Deprecation Path

1. Legacy variables in `index.css` should be phased out in favor of RGB values in `cosmic-theme-unified.css`
2. Component-specific CSS should be moved to the components directory
3. Replace all hardcoded color values with variables from the theme

## Animation Usage

Prefer these standard animations:

- `.cosmic-fade-in`: Fade in element
- `.cosmic-fade-out`: Fade out element
- `.cosmic-pulse`: Pulsating highlight
- `.cosmic-gradient-animate`: Animated gradient background
- `.cosmic-shimmer`: Shimmer effect for loading states
- `.cosmic-float`: Subtle floating animation

## Accessibility Considerations

- Ensure sufficient contrast ratios (minimum 4.5:1 for normal text)
- Disable animations when user prefers reduced motion:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .cosmic-animation {
      animation: none !important;
      transition: none !important;
    }
  }
  ```
- Include focus styles for keyboard navigation using `.focus-outline`

## Best Practices

1. Follow mobile-first approach with responsive breakpoints
2. Use CSS Grid and Flexbox for layouts instead of floats
3. Minimize use of `!important` (only when overriding library styles)
4. Group related styles together in the CSS files
5. Use Tailwind utilities for one-off styling needs
6. Maintain consistent naming across the entire application
7. Document complex animations or layout techniques with comments