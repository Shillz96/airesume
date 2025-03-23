import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useUnifiedTheme } from '@/contexts/UnifiedThemeContext';

/**
 * Unified Text Component
 * 
 * This component provides consistent text styling throughout the application
 * with support for different visual styles based on the theme system.
 * 
 * Features:
 * - Multiple variants (heading, title, subtitle, body, etc.)
 * - Size variations
 * - Theme awareness
 * - Support for gradient text and other cosmic effects
 */

// Define text variants
const textVariants = cva(
  // Base styles for all text
  "text-foreground",
  {
    variants: {
      variant: {
        heading: "font-bold tracking-tight",
        title: "font-semibold",
        subtitle: "text-muted-foreground",
        body: "",
        lead: "text-muted-foreground",
        label: "font-medium",
        code: "font-mono bg-muted/50 rounded px-1.5 py-0.5",
        gradient: "text-gradient bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent",
        cosmic: "cosmic-text-gradient",
      },
      size: {
        xs: "text-xs",
        sm: "text-sm",
        base: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
        "3xl": "text-3xl",
        "4xl": "text-4xl",
        "5xl": "text-5xl",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
      spaced: {
        true: "tracking-wide",
      },
      animated: {
        true: "transition-all duration-200",
      },
    },
    defaultVariants: {
      variant: "body",
      size: "base",
      align: "left",
      weight: "normal",
      spaced: false,
      animated: false,
    },
  }
);

// Interface for the text component props
export interface UnifiedTextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  cosmic?: boolean; // Enable cosmic theme styling
}

// The text component
export function UnifiedText({
  as: Component = "p",
  children,
  className,
  variant,
  size,
  align,
  weight,
  spaced,
  animated,
  cosmic = false,
  ...props
}: UnifiedTextProps) {
  const { config } = useUnifiedTheme();
  
  // Determine if cosmic styling should be applied
  const isCosmicEnabled = cosmic && config.variant === 'cosmic';
  
  // Apply variant overrides for cosmic theme
  let variantOverride = variant;
  if (isCosmicEnabled && variant === 'heading') {
    variantOverride = 'cosmic';
  }
  
  return (
    <Component
      className={cn(
        textVariants({ 
          variant: variantOverride, 
          size, 
          align, 
          weight, 
          spaced, 
          animated, 
          className 
        }),
        isCosmicEnabled && variant === 'body' && 'text-blue-50',
        isCosmicEnabled && variant === 'subtitle' && 'text-blue-200',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

// Text heading components
export function Heading1({ className, ...props }: UnifiedTextProps) {
  return (
    <UnifiedText
      as="h1"
      variant="heading"
      size="4xl"
      className={className}
      {...props}
    />
  );
}

export function Heading2({ className, ...props }: UnifiedTextProps) {
  return (
    <UnifiedText
      as="h2"
      variant="heading"
      size="3xl"
      className={className}
      {...props}
    />
  );
}

export function Heading3({ className, ...props }: UnifiedTextProps) {
  return (
    <UnifiedText
      as="h3"
      variant="heading"
      size="2xl"
      className={className}
      {...props}
    />
  );
}

export function Heading4({ className, ...props }: UnifiedTextProps) {
  return (
    <UnifiedText
      as="h4"
      variant="heading"
      size="xl"
      className={className}
      {...props}
    />
  );
}

export function Subtitle({ className, ...props }: UnifiedTextProps) {
  return (
    <UnifiedText
      variant="subtitle"
      className={className}
      {...props}
    />
  );
}

export function Lead({ className, ...props }: UnifiedTextProps) {
  return (
    <UnifiedText
      variant="lead"
      size="lg"
      className={className}
      {...props}
    />
  );
}

export function Label({ className, ...props }: UnifiedTextProps) {
  return (
    <UnifiedText
      as="label"
      variant="label"
      className={className}
      {...props}
    />
  );
}

export function Code({ className, ...props }: UnifiedTextProps) {
  return (
    <UnifiedText
      as="code"
      variant="code"
      className={className}
      {...props}
    />
  );
}

export function GradientText({ className, ...props }: UnifiedTextProps) {
  return (
    <UnifiedText
      variant="gradient"
      className={className}
      {...props}
    />
  );
}

export default UnifiedText;