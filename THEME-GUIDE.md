# Unified Theme System Guide

This document provides a comprehensive guide to the unified theme system implemented in the application. It explains how to use the theme variables, components, and styling consistently across the application.

## Table of Contents

1. [Theme Architecture](#theme-architecture)
2. [CSS Variables](#css-variables)
3. [Component Library](#component-library)
4. [Migration Guide](#migration-guide)
5. [Best Practices](#best-practices)

## Theme Architecture

The theme system is built around a centralized approach with a single source of truth:

```
client/src/styles/theme/
├── index.css       # Core theme variables and base styles
├── buttons.css     # Button component styles
├── cards.css       # Card component styles
└── ...             # Other component-specific styles
```

All theme variables are defined in `styles/theme/index.css` and are used by the component-specific CSS files. This ensures consistency across all components.

### Theme Philosophy

Our theme is designed around these key principles:

1. **Single Source of Truth**: All theme variables in one place
2. **Consistency**: Same styles used across all components
3. **Flexibility**: Support for different theme variants and appearances
4. **Backward Compatibility**: Legacy components still work during migration

## CSS Variables

### Core Variables

The most important variables that define the look and feel of the application:

| Variable | Purpose | Example Usage |
|----------|---------|--------------|
| `--color-primary` | Main brand color | Buttons, links, accents |
| `--color-background` | Page background | Page containers |
| `--color-foreground` | Main text color | Body text |
| `--color-card` | Card background | Card components |
| `--border-radius` | Border roundness | Buttons, cards, inputs |

### Using Variables in CSS

```css
.my-component {
  background-color: hsl(var(--color-background));
  color: hsl(var(--color-foreground));
  border: 1px solid hsl(var(--color-border));
  border-radius: var(--border-radius);
}
```

### Using Variables in Tailwind

For Tailwind classes, use the defined color utilities:

```jsx
<div className="bg-background text-foreground border-border rounded-md">
  Styled using theme variables
</div>
```

## Component Library

### Buttons

We now have a unified `ThemeButton` component that replaces all previous button implementations:

```jsx
import { ThemeButton } from '@/components/ui/ThemeButton';

// Basic usage
<ThemeButton>Default Button</ThemeButton>

// Variants
<ThemeButton variant="primary">Primary</ThemeButton>
<ThemeButton variant="secondary">Secondary</ThemeButton>
<ThemeButton variant="outline">Outline</ThemeButton>
<ThemeButton variant="ghost">Ghost</ThemeButton>
<ThemeButton variant="destructive">Destructive</ThemeButton>
<ThemeButton variant="success">Success</ThemeButton>

// Sizes
<ThemeButton size="xs">Extra Small</ThemeButton>
<ThemeButton size="sm">Small</ThemeButton>
<ThemeButton size="md">Medium</ThemeButton>
<ThemeButton size="lg">Large</ThemeButton>
<ThemeButton size="xl">Extra Large</ThemeButton>

// States
<ThemeButton isLoading loadingText="Loading...">Loading</ThemeButton>
<ThemeButton disabled>Disabled</ThemeButton>

// With icons
<ThemeButton iconLeft={<PlusIcon />}>With Icon</ThemeButton>
<ThemeButton iconRight={<ArrowRightIcon />}>Next</ThemeButton>

// Special styles
<ThemeButton fullWidth>Full Width</ThemeButton>
<ThemeButton withGlow>With Glow Effect</ThemeButton>
```

### Cards

Our unified `ThemeCard` component system replaces all previous card implementations:

```jsx
import { 
  ThemeCard, 
  ThemeCardHeader, 
  ThemeCardBody, 
  ThemeCardFooter,
  ThemeCardTitle,
  ThemeCardDescription
} from '@/components/ui/ThemeCard';

// Basic card
<ThemeCard>
  <ThemeCardBody>
    Simple card content
  </ThemeCardBody>
</ThemeCard>

// Full card with all sections
<ThemeCard variant="elevated">
  <ThemeCardHeader>
    <ThemeCardTitle>Card Title</ThemeCardTitle>
    <ThemeCardDescription>Description text here</ThemeCardDescription>
  </ThemeCardHeader>
  <ThemeCardBody>
    Card content goes here
  </ThemeCardBody>
  <ThemeCardFooter>
    <ThemeButton>Cancel</ThemeButton>
    <ThemeButton variant="primary">Save</ThemeButton>
  </ThemeCardFooter>
</ThemeCard>

// Card variants
<ThemeCard variant="default">Default Card</ThemeCard>
<ThemeCard variant="elevated">Elevated Card</ThemeCard>
<ThemeCard variant="outlined">Outlined Card</ThemeCard>
<ThemeCard variant="flat">Flat Card</ThemeCard>
<ThemeCard variant="gradient">Gradient Card</ThemeCard>
<ThemeCard variant="glass">Glass Card</ThemeCard>

// Interactive cards
<ThemeCard isInteractive>Clickable Card</ThemeCard>
<ThemeCard isHoverable>Hover Effect Card</ThemeCard>

// Special effects
<ThemeCard withGlow>Glowing Border Card</ThemeCard>
<ThemeCard isLoading>Loading State Card</ThemeCard>
```

## Migration Guide

### From Cosmic to Unified Theme

1. **Replace Button Components**:
   - Replace `<Button>` or `<CosmicButton>` with `<ThemeButton>`
   - Map the variants appropriately:
     - `variant="default"` → `variant="primary"`
     - `variant="secondary"` → `variant="secondary"`
     - `variant="outline"` → `variant="outline"`
     - `variant="ghost"` → `variant="ghost"`
     - `variant="destructive"` → `variant="destructive"`

2. **Replace Card Components**:
   - Replace `<Card>` or any cosmic card with `<ThemeCard>` and related components
   - Replace legacy card structure with the new component hierarchy

3. **Update CSS Classes**:
   - Replace `cosmic-button-*` classes with `btn-*` classes
   - Replace `cosmic-card-*` classes with `card-*` classes

### From Modern to Unified Theme

1. **Update Component Imports**:
   - Change `import { Button } from '@/components/ui-modern/Button'` to `import { ThemeButton } from '@/components/ui/ThemeButton'`
   - Rename props if needed (minimal changes required)

2. **Update CSS Variables**:
   - Change `var(--primary)` to `hsl(var(--color-primary))`
   - Change `var(--background)` to `hsl(var(--color-background))`
   - Change other color variables to follow the new pattern

## Best Practices

### Use Theme Variables

Always use theme variables instead of hardcoded colors:

```jsx
// ❌ Don't do this
<div style={{ backgroundColor: '#3b82f6' }}>...</div>

// ✅ Do this instead
<div className="bg-primary">...</div>
// or
<div style={{ backgroundColor: 'hsl(var(--color-primary))' }}>...</div>
```

### Consistent Component Usage

Use the unified component library consistently:

```jsx
// ❌ Don't mix button types
<Button>Old Button</Button>
<CosmicButton>Cosmic Button</CosmicButton>

// ✅ Standardize on ThemeButton
<ThemeButton>Unified Button</ThemeButton>
```

### Responsive Design

Make sure to implement responsive designs using the theme's spacing and breakpoint system:

```jsx
<div className="p-4 md:p-6 lg:p-8">
  <ThemeCard>
    Responsive padding based on screen size
  </ThemeCard>
</div>
```

### Extend, Don't Override

When you need custom styles, extend the theme rather than override it:

```jsx
// ❌ Don't create new variables
:root {
  --my-custom-color: #ff0000;
}

// ✅ Extend existing variables
.my-component {
  /* Uses the theme's primary color with a custom opacity */
  background-color: hsl(var(--color-primary) / 0.1);
}
```

## Conclusion

The unified theme system provides a consistent, maintainable, and flexible approach to styling across the application. By following this guide, you can ensure that all components and styles remain consistent with the design system, while still allowing for customization and extension when needed.

For any questions or issues with the theme system, consult with the development team or refer to the component source code for examples.