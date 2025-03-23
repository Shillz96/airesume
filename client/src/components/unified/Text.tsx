/**
 * Unified Text Component
 * 
 * This is the single Text component to be used across the entire application.
 * It handles all typography variants with consistent styling.
 */
import React from 'react';
import { cn } from '@/lib/utils';

export interface TextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'overline';
  color?: 'default' | 'primary' | 'secondary' | 'muted' | 'accent' | 'success' | 'warning' | 'error' | 'cosmic';
  align?: 'left' | 'center' | 'right' | 'justify';
  className?: string;
  component?: React.ElementType;
  noMargin?: boolean;
  gutterBottom?: boolean;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body1',
  color = 'default',
  align = 'left',
  className,
  component,
  noMargin = false,
  gutterBottom = false,
  ...props
}) => {
  // Map variant to element type
  const defaultComponentMap: Record<string, React.ElementType> = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    subtitle1: 'h6',
    subtitle2: 'h6',
    body1: 'p',
    body2: 'p',
    caption: 'span',
    overline: 'span',
  };

  // Use provided component or default based on variant
  const Component = component || defaultComponentMap[variant] || 'p';

  // Typography variant styles
  const variantStyles: Record<string, string> = {
    h1: 'text-4xl font-extrabold tracking-tight',
    h2: 'text-3xl font-bold tracking-tight',
    h3: 'text-2xl font-bold',
    h4: 'text-xl font-semibold',
    h5: 'text-lg font-semibold',
    h6: 'text-base font-semibold',
    subtitle1: 'text-lg font-medium',
    subtitle2: 'text-base font-medium',
    body1: 'text-base',
    body2: 'text-sm',
    caption: 'text-sm',
    overline: 'text-xs uppercase tracking-wider',
  };

  // Text color styles
  const colorStyles: Record<string, string> = {
    default: 'text-foreground',
    primary: 'text-primary',
    secondary: 'text-secondary',
    muted: 'text-muted-foreground',
    accent: 'text-accent',
    success: 'text-green-600',
    warning: 'text-amber-600',
    error: 'text-destructive',
    cosmic: 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600',
  };

  // Text alignment
  const alignStyles: Record<string, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  };

  // Margin styles
  const marginStyles = noMargin 
    ? 'my-0' 
    : gutterBottom 
      ? 'mb-4' 
      : '';

  return (
    <Component
      className={cn(
        variantStyles[variant],
        colorStyles[color],
        alignStyles[align],
        marginStyles,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Text;