# Glassmorphic UI Update Guide

This document outlines the implementation of the new glassmorphic UI design system for the AllHire AI application.

## Core Theme & Aesthetic

The new design embraces a futuristic, glassmorphic aesthetic with:

### Colors
- Background: Deep navy gradient (rgb(10, 15, 30) to rgb(5, 8, 15))
- Primary: Electric green (#00F260)
- Secondary: Electric blue (#0575E6)
- Accent: Soft purple (#6366F1)

### Typography
- Headings: Space Grotesk (Geometric sans-serif)
- Body: Inter (Modern sans-serif)
- Font sizes follow a modular scale:
  - H1: 48px (3rem)
  - H2: 36px (2.25rem)
  - H3: 28px (1.75rem)
  - Body: 16px (1rem)
  - Small: 14px (0.875rem)

## Component Classes

### Cards & Panels
```css
.glass-card {
  @apply bg-black/20 backdrop-blur-xl border border-white/10 shadow-xl;
}

.glass-panel {
  @apply bg-black/30 backdrop-blur-lg border border-white/5 shadow-2xl;
}
```

### Buttons
```css
.btn-primary {
  @apply bg-gradient-to-r from-primary to-secondary text-white font-semibold 
         py-2 px-6 rounded-lg transition-all duration-300
         hover:shadow-[0_0_20px_rgba(0,255,180,0.5)]
         active:scale-[0.97];
}

.btn-secondary {
  @apply bg-transparent border-2 border-white/20 text-white font-semibold
         py-2 px-6 rounded-lg transition-all duration-300
         hover:border-white/40 hover:bg-white/5
         active:scale-[0.97];
}
```

### Navigation
```css
.nav-glass {
  @apply fixed top-0 left-0 right-0 z-50
         bg-black/10 backdrop-blur-lg border-b border-white/5
         transition-all duration-300;
}

.nav-link {
  @apply relative text-white/80 hover:text-white transition-colors duration-200
         after:content-[''] after:absolute after:bottom-0 after:left-0
         after:w-full after:h-0.5 after:bg-primary
         after:transform after:scale-x-0 after:origin-left
         after:transition-transform after:duration-300
         hover:after:scale-x-100;
}
```

## Animations

### GSAP Animations
```typescript
// Fade in elements on page load
gsap.fromTo(
  '.fade-in',
  { opacity: 0, y: 20 },
  { 
    opacity: 1, 
    y: 0, 
    duration: 0.8,
    stagger: 0.2,
    ease: 'power2.out'
  }
);

// Scroll animations
gsap.utils.toArray('.scroll-fade').forEach((element: any) => {
  gsap.fromTo(
    element,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    }
  );
});
```

### Framer Motion Variants
```typescript
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
```

## Implementation Checklist

1. [x] Update theme context and provider
2. [x] Add new font imports
3. [x] Create base utility classes
4. [x] Update navigation component
5. [x] Update card components
6. [x] Add GSAP animations
7. [x] Add Framer Motion transitions
8. [ ] Update form elements
9. [ ] Update button components
10. [ ] Add loading states and animations

## Dependencies

Required packages:
```json
{
  "dependencies": {
    "gsap": "^3.12.0",
    "framer-motion": "^10.12.0",
    "@radix-ui/react-dialog": "^1.0.4",
    "@radix-ui/react-tabs": "^1.0.4",
    "tailwindcss": "^3.3.0",
    "class-variance-authority": "^0.7.0"
  }
}
```

## Usage Examples

### Basic Card
```tsx
<div className="glass-card p-6">
  <h2 className="text-2xl font-space-grotesk font-bold mb-4">Card Title</h2>
  <p className="text-white/80">Card content goes here</p>
</div>
```

### Animated Section
```tsx
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
  className="glass-panel p-8"
>
  <motion.h1 
    variants={cardVariants}
    className="text-gradient text-4xl font-bold mb-6"
  >
    Welcome Back
  </motion.h1>
  <motion.p 
    variants={cardVariants}
    className="text-white/80"
  >
    Your content here
  </motion.p>
</motion.div>
```

### Navigation Link
```tsx
<Link href="/dashboard" className="nav-link">
  Dashboard
</Link>
```

## Best Practices

1. Always use the provided utility classes for consistency
2. Add appropriate animations for user interactions
3. Maintain proper contrast ratios for accessibility
4. Use proper semantic HTML elements
5. Follow the component hierarchy for proper animation flow
6. Test across different screen sizes for responsive behavior

## Known Issues

1. Backdrop blur performance on some mobile devices
2. Animation performance on lower-end devices
3. Font loading optimization needed

## Future Improvements

1. Add more animation variants
2. Optimize performance for mobile
3. Add more interactive elements
4. Enhance accessibility features
5. Add dark/light theme variations 