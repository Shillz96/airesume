/**
 * Unified Text Components
 * 
 * This file provides text components like headings and paragraphs
 * with consistent styling based on the unified theme system.
 */
import React from 'react';
import { cn } from '@/lib/utils';
import { useUnifiedTheme } from '@/contexts/UnifiedThemeContext';

// Heading components with different levels
export function Heading1({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const { config } = useUnifiedTheme();
  
  return (
    <h1 
      className={cn(
        "text-3xl font-bold tracking-tight",
        config.variant === 'cosmic' && "text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function Heading2({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const { config } = useUnifiedTheme();
  
  return (
    <h2 
      className={cn(
        "text-2xl font-semibold tracking-tight",
        config.variant === 'cosmic' && "text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export function Heading3({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const { config } = useUnifiedTheme();
  
  return (
    <h3 
      className={cn(
        "text-xl font-semibold tracking-tight",
        config.variant === 'cosmic' && "text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function Heading4({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const { config } = useUnifiedTheme();
  
  return (
    <h4 
      className={cn(
        "text-lg font-semibold tracking-tight",
        config.variant === 'cosmic' && "text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </h4>
  );
}

export function Heading5({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const { config } = useUnifiedTheme();
  
  return (
    <h5 
      className={cn(
        "text-base font-semibold tracking-tight",
        config.variant === 'cosmic' && "text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </h5>
  );
}

export function Heading6({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const { config } = useUnifiedTheme();
  
  return (
    <h6 
      className={cn(
        "text-sm font-semibold tracking-tight",
        config.variant === 'cosmic' && "text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </h6>
  );
}

export function Paragraph({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p 
      className={cn(
        "leading-7 [&:not(:first-child)]:mt-6",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

// Text with gradient effect
type GradientTextProps = {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
  gradient?: 'primary' | 'secondary' | 'accent' | 'cosmic';
};

export function GradientText({ 
  children, 
  as = 'span',
  size = 'base',
  weight = 'normal',
  className,
  gradient = 'primary',
  ...props
}: GradientTextProps) {
  const { config } = useUnifiedTheme();
  
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
  };
  
  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };
  
  const gradientClasses = {
    primary: 'from-primary to-primary/80',
    secondary: 'from-primary to-secondary',
    accent: 'from-secondary to-accent',
    cosmic: 'from-primary via-secondary to-accent',
  };
  
  const Component = as;
  
  return (
    <Component
      className={cn(
        sizeClasses[size],
        weightClasses[weight],
        "bg-clip-text text-transparent bg-gradient-to-r",
        gradientClasses[gradient],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default function Text() {
  return null; // This default export is just to satisfy the requirement
}