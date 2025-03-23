# Cosmic Theme Guide

This document provides comprehensive guidance on using and customizing the cosmic theme system in the AIreHire application.

## Theme Overview

The application uses a cosmic-themed design system with:

1. **Dynamic dark/light modes**
2. **Multiple theme variants**
3. **CSS variable-based styling**
4. **Animated cosmic backgrounds**
5. **Consistent component styling**

## Theme Configuration

The theme is configured in `theme.json`:

```json
{
  "variant": "professional",
  "primary": "hsl(221, 83%, 53%)",
  "appearance": "dark",
  "radius": 0.5,
  "colors": {
    "background": "hsl(224, 71%, 4%)",
    "foreground": "hsl(0, 0%, 100%)",
    "card": "hsl(224, 71%, 6%)",
    // Additional colors...
  }
}
```

These settings are loaded by `client/src/lib/theme-loader.ts` and converted to CSS variables.

## Theme Variants

The application supports these theme variants:

1. **Professional**: Clean, minimal styling with subtle animations
2. **Vibrant**: Bold colors with stronger gradients and animations
3. **Tint**: Flat design with colored accents

To access the current variant programmatically:

```typescript
import { getCurrentVariant } from '@/lib/theme-utils';

// Get current variant
const variant = getCurrentVariant(); // "professional", "vibrant", or "tint"
```

## Theme Appearance

The theme supports light, dark, and system modes:

```typescript
import { getCurrentAppearance, isDarkMode } from '@/lib/theme-utils';

// Get appearance
const appearance = getCurrentAppearance(); // "light", "dark", or "system"

// Check if dark mode is active
const darkMode = isDarkMode();
```

## CSS Variables

All theme values are available as CSS variables:

```css
/* Using theme colors */
.my-component {
  background-color: var(--background);
  color: var(--foreground);
  border: 1px solid var(--border);
}

/* Using themed gradients */
.gradient-element {
  background: var(--gradient-primary);
}
```

## Using RGB Color Values

For colors with opacity, use the RGB format:

```css
/* Using RGB for transparency */
.overlay {
  background-color: rgb(var(--primary-rgb) / 0.5);
}
```

## Theme Utilities

The `lib/theme-utils.ts` file provides helpers for accessing theme values:

```typescript
import { 
  getThemeVar, 
  getCosmicColor, 
  getButtonClass,
  getCardBackgroundClass,
  getTextColorClass
} from '@/lib/theme-utils';

// Get a CSS variable reference
const primaryColor = getThemeVar('primary'); // "var(--primary)"

// Get a cosmic theme color
const accentColor = getCosmicColor('accent'); // "#00b3ff" (runtime value)

// Get the appropriate button class for theme
const buttonClass = getButtonClass('primary'); // Returns the CSS class for primary button

// Get theme-appropriate text and background classes
const textClass = getTextColorClass(); // text-white or text-gray-900 depending on theme
const bgClass = getBackgroundClass(); // bg-gray-950 or bg-white depending on theme
```

## Variant-Specific Styling

Apply variant-specific styles with the `getVariantClasses` utility:

```typescript
import { getVariantClasses } from '@/lib/theme-utils';

// In a component
const variantClasses = getVariantClasses(
  "professional-class", // Classes for professional variant
  "vibrant-class",      // Classes for vibrant variant
  "tint-class"          // Classes for tint variant
);

// Use in JSX
<div className={variantClasses}>Variant-specific styling</div>
```

## Theme Context

The application provides a theme context for managing theme state:

```tsx
import { useTheme } from '@/contexts/ThemeContext';

function ThemeControls() {
  const { 
    currentTheme, 
    setThemeVariant, 
    setThemeAppearance, 
    setPrimaryColor,
    toggleDarkMode,
    isDarkMode 
  } = useTheme();

  return (
    <div>
      <button onClick={() => setThemeVariant('vibrant')}>
        Switch to Vibrant
      </button>
      
      <button onClick={() => setThemeAppearance('dark')}>
        Switch to Dark Mode
      </button>
      
      <button onClick={toggleDarkMode}>
        Toggle Dark Mode
      </button>
      
      <div>Current theme: {currentTheme.variant}</div>
      <div>Dark mode: {isDarkMode ? 'On' : 'Off'}</div>
    </div>
  );
}
```

## Cosmic Background

The application includes a cosmic background component with animated starfield:

```tsx
import CosmicBackground from '@/components/cosmic-background';
import CosmicStarfield from '@/components/cosmic-starfield';

function Page() {
  return (
    <div>
      {/* Full animated cosmic background */}
      <CosmicBackground />
      
      {/* Just the starfield animation */}
      <CosmicStarfield 
        starsCount={200} 
        nebulasCount={3} 
        shootingStarsEnabled={true}
      />
      
      <div>Page content</div>
    </div>
  );
}
```

## Button Components

Several button implementations are available:

```tsx
// Base button from shadcn/ui
import { Button } from '@/components/ui/button';

// Cosmic themed button
import { CosmicButton } from '@/components/cosmic-button';

// Modern button
import { Button as ModernButton } from '@/components/ui-modern/Button';

// Theme-aware button
import { ThemeButton } from '@/components/ui/ThemeButton';

function ButtonExamples() {
  return (
    <div>
      <Button variant="default">Base Button</Button>
      
      <CosmicButton 
        variant="primary" 
        size="md" 
        withGlow={true}
      >
        Cosmic Button
      </CosmicButton>
      
      <ModernButton 
        variant="primary" 
        size="md"
      >
        Modern Button
      </ModernButton>
      
      <ThemeButton 
        variant="gradient-border" 
        size="lg"
      >
        Theme Button
      </ThemeButton>
    </div>
  );
}
```

## Card Components

Similar to buttons, multiple card implementations exist:

```tsx
// Base card from shadcn/ui
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

// Theme-aware card
import { ThemeCard, ThemeCardHeader, ThemeCardTitle, ThemeCardDescription, ThemeCardBody, ThemeCardFooter } from '@/components/ui/ThemeCard';

// Modern card
import { Card as ModernCard, CardHeader as ModernCardHeader } from '@/components/ui/modern-card';

function CardExamples() {
  return (
    <div>
      {/* Base Card */}
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
      
      {/* Theme Card */}
      <ThemeCard variant="glass" isHoverable withGlow>
        <ThemeCardHeader>
          <ThemeCardTitle>Theme Card</ThemeCardTitle>
          <ThemeCardDescription>With cosmic styling</ThemeCardDescription>
        </ThemeCardHeader>
        <ThemeCardBody>Content</ThemeCardBody>
        <ThemeCardFooter>Footer</ThemeCardFooter>
      </ThemeCard>
      
      {/* Modern Card */}
      <ModernCard variant="elevated" isHoverable>
        <ModernCardHeader>
          <h3>Modern Card</h3>
        </ModernCardHeader>
        <div>Content</div>
      </ModernCard>
    </div>
  );
}
```

## Cosmic Animations

The application provides several cosmic-themed animations:

```css
/* Available animation classes */
.cosmic-fade-in { /* Fade in animation */ }
.cosmic-fade-out { /* Fade out animation */ }
.cosmic-pulse { /* Pulsating effect */ }
.cosmic-gradient-animate { /* Animated gradient */ }
.cosmic-shimmer { /* Loading shimmer effect */ }
.cosmic-float { /* Gentle floating animation */ }
```

Apply these animations to any element:

```tsx
function AnimatedElements() {
  return (
    <div>
      <div className="cosmic-fade-in">Fades in on mount</div>
      <div className="cosmic-pulse">Pulses continuously</div>
      <div className="cosmic-gradient-animate">Animated gradient background</div>
      <div className="cosmic-float">Gently floats up and down</div>
    </div>
  );
}
```

## Spacing System

Use the spacing variables for consistent layout:

```css
/* Available spacing variables */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
```

Access spacing values programmatically:

```typescript
import { getSpacing } from '@/lib/theme-utils';

// Get spacing value
const space4 = getSpacing(4); // "var(--space-4)"
```

## Responsive Design

The application follows a mobile-first approach with standard Tailwind breakpoints:

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

Example:

```tsx
function ResponsiveComponent() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {/* Content will be 1 column on mobile, 2 on small screens, 3 on medium, 4 on large */}
    </div>
  );
}
```

## Dark Mode Toggle

The application handles dark mode via the theme system:

```tsx
import { useTheme } from '@/contexts/ThemeContext';

function DarkModeToggle() {
  const { toggleDarkMode, isDarkMode } = useTheme();
  
  return (
    <button onClick={toggleDarkMode}>
      {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    </button>
  );
}
```

## Theme Customization

To customize the theme, update the `theme.json` file or use the theme update functions:

```typescript
import { updateTheme } from '@/lib/theme-loader';

// Update theme programmatically
updateTheme({
  primary: "hsl(250, 83%, 53%)", // Change primary color
  appearance: "light",           // Switch to light mode
  variant: "vibrant",            // Switch to vibrant variant
  radius: 1.0,                   // Increase border radius
  colors: {
    // Override specific colors
    accent: "hsl(330, 89%, 48%)",
  }
});
```

## Accessibility Considerations

The theme system includes built-in accessibility features:

1. **Color contrast**: All color combinations meet WCAG 2.1 AA standards
2. **Motion reduction**: Respects `prefers-reduced-motion` preference
3. **Focus styles**: Visible focus indicators for keyboard navigation
4. **Dark mode**: Provides reduced eye strain in low-light environments

## Recommended Practices

1. **Always use theme variables** instead of hardcoded colors
2. **Use the correct button variant** for each use case
3. **Prefer ThemeButton and ThemeCard** for new components
4. **Keep animations subtle** for the professional variant
5. **Test all components** in both light and dark modes
6. **Use the spacing system** for consistent layouts