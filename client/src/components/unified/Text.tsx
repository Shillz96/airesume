import React from 'react';
import { useUnifiedTheme } from '../../contexts/UnifiedThemeContext';

type TextSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
type TextAlign = 'left' | 'center' | 'right';
type TextElement = 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label';

interface TextProps {
  children: React.ReactNode;
  as?: TextElement;
  size?: TextSize;
  weight?: TextWeight;
  align?: TextAlign;
  className?: string;
  gradient?: boolean;
  muted?: boolean;
}

/**
 * Get size class based on the size prop and element type
 */
const getSizeClass = (size: TextSize = 'md', as: TextElement = 'p'): string => {
  // Default sizes per element
  if (!size) {
    switch (as) {
      case 'h1': return 'text-4xl md:text-5xl';
      case 'h2': return 'text-3xl md:text-4xl';
      case 'h3': return 'text-2xl md:text-3xl';
      case 'h4': return 'text-xl md:text-2xl';
      case 'h5': return 'text-lg md:text-xl';
      case 'h6': return 'text-md md:text-lg';
      default: return 'text-base';
    }
  }

  // Size classes that scale with device
  const sizeClasses: Record<TextSize, string> = {
    '2xs': 'text-xs',
    'xs': 'text-xs md:text-sm',
    'sm': 'text-sm md:text-base',
    'md': 'text-base',
    'lg': 'text-lg',
    'xl': 'text-xl',
    '2xl': 'text-xl md:text-2xl',
    '3xl': 'text-2xl md:text-3xl',
    '4xl': 'text-3xl md:text-4xl',
    '5xl': 'text-4xl md:text-5xl',
    '6xl': 'text-5xl md:text-6xl',
  };

  return sizeClasses[size];
};

/**
 * Get weight class based on the weight prop
 */
const getWeightClass = (weight: TextWeight = 'normal'): string => {
  const weightClasses: Record<TextWeight, string> = {
    'normal': 'font-normal',
    'medium': 'font-medium',
    'semibold': 'font-semibold',
    'bold': 'font-bold',
  };

  return weightClasses[weight];
};

/**
 * Get alignment class based on the align prop
 */
const getAlignClass = (align?: TextAlign): string => {
  if (!align) return '';
  
  const alignClasses: Record<TextAlign, string> = {
    'left': 'text-left',
    'center': 'text-center',
    'right': 'text-right',
  };

  return alignClasses[align];
};

/**
 * UnifiedText component
 * 
 * A typography component with responsive text sizes
 * and consistent styling according to the design system
 */
export function UnifiedText({
  children,
  as: Component = 'p',
  size,
  weight,
  align,
  className = '',
  gradient = false,
  muted = false,
}: TextProps) {
  const { config } = useUnifiedTheme();
  
  const classes = [
    getSizeClass(size, Component),
    getWeightClass(weight),
    getAlignClass(align),
    gradient ? 'text-gradient' : '',
    muted ? 'text-muted-foreground' : 'text-foreground',
    className
  ].filter(Boolean).join(' ');

  return (
    <Component className={classes}>
      {children}
    </Component>
  );
}

/**
 * Helper components for common text elements
 */

export function Heading1({ children, className = '', ...props }: Omit<TextProps, 'as' | 'size'>) {
  return (
    <UnifiedText
      as="h1"
      size="5xl"
      weight="bold"
      className={className}
      {...props}
    >
      {children}
    </UnifiedText>
  );
}

export function Heading2({ children, className = '', ...props }: Omit<TextProps, 'as' | 'size'>) {
  return (
    <UnifiedText
      as="h2"
      size="4xl"
      weight="bold"
      className={className}
      {...props}
    >
      {children}
    </UnifiedText>
  );
}

export function Heading3({ children, className = '', ...props }: Omit<TextProps, 'as' | 'size'>) {
  return (
    <UnifiedText
      as="h3"
      size="3xl"
      weight="semibold"
      className={className}
      {...props}
    >
      {children}
    </UnifiedText>
  );
}

export function Heading4({ children, className = '', ...props }: Omit<TextProps, 'as' | 'size'>) {
  return (
    <UnifiedText
      as="h4"
      size="2xl"
      weight="semibold"
      className={className}
      {...props}
    >
      {children}
    </UnifiedText>
  );
}

export function Subtitle({ children, className = '', ...props }: Omit<TextProps, 'as' | 'size'>) {
  return (
    <UnifiedText
      size="lg"
      className={`text-muted-foreground ${className}`}
      {...props}
    >
      {children}
    </UnifiedText>
  );
}

export function Lead({ children, className = '', ...props }: Omit<TextProps, 'as' | 'size'>) {
  return (
    <UnifiedText
      size="xl"
      className={className}
      {...props}
    >
      {children}
    </UnifiedText>
  );
}

export function Label({ children, className = '', ...props }: Omit<TextProps, 'as'>) {
  return (
    <UnifiedText
      as="label"
      size="sm"
      weight="medium"
      className={className}
      {...props}
    >
      {children}
    </UnifiedText>
  );
}

export function Code({ children, className = '', ...props }: Omit<TextProps, 'as'>) {
  return (
    <code className={`px-1.5 py-0.5 bg-muted rounded text-sm font-mono ${className}`} {...props}>
      {children}
    </code>
  );
}

/**
 * Gradient text with cosmic styling
 */
export function GradientText({ 
  children, 
  className = '', 
  as: Component = 'span',
  size = 'md',
  weight = 'normal',
  ...props 
}: TextProps) {
  const classes = [
    'cosmic-text-gradient',
    getSizeClass(size, Component as TextElement),
    getWeightClass(weight),
    className
  ].filter(Boolean).join(' ');

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}

export default UnifiedText;