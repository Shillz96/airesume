import React, { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

// Card variants and types
type CardVariant = 'default' | 'elevated' | 'outlined' | 'flat' | 'gradient' | 'glass';
type CardSize = 'sm' | 'md' | 'lg';

export interface ThemeCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  size?: CardSize;
  isInteractive?: boolean;
  isHoverable?: boolean;
  isLoading?: boolean;
  withGlow?: boolean;
}

/**
 * ThemeCard - Unified card component for the application
 * 
 * This component incorporates all card styling into a single component
 * that is consistent with our theme. It unifies the various card implementations
 * and provides a consistent API for all cards in the application.
 * 
 * Usage:
 * ```tsx
 * <ThemeCard>Basic card content</ThemeCard>
 * <ThemeCard variant="elevated" isInteractive>Interactive elevated card</ThemeCard>
 * <ThemeCard withGlow>Card with glowing border effect</ThemeCard>
 * ```
 */
export const ThemeCard = forwardRef<HTMLDivElement, ThemeCardProps>(
  ({ 
    className,
    variant = 'default',
    size = 'md',
    isInteractive = false,
    isHoverable = false,
    isLoading = false,
    withGlow = false,
    children,
    ...props
  }, ref) => {
    // Build the class list based on props
    const cardClasses = cn(
      'card',
      `card-${variant}`,
      `card-${size}`,
      isInteractive && 'card-interactive',
      isHoverable && 'card-hoverable',
      isLoading && 'card-loading',
      withGlow && 'card-glow',
      className
    );
    
    return (
      <div
        className={cardClasses}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

export interface ThemeCardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const ThemeCardHeader = forwardRef<HTMLDivElement, ThemeCardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div 
        className={cn('card-header', className)} 
        ref={ref} 
        {...props}
      >
        {children}
      </div>
    );
  }
);

export interface ThemeCardBodyProps extends HTMLAttributes<HTMLDivElement> {}

export const ThemeCardBody = forwardRef<HTMLDivElement, ThemeCardBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div 
        className={cn('card-body', className)} 
        ref={ref} 
        {...props}
      >
        {children}
      </div>
    );
  }
);

export interface ThemeCardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const ThemeCardFooter = forwardRef<HTMLDivElement, ThemeCardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div 
        className={cn('card-footer', className)} 
        ref={ref} 
        {...props}
      >
        {children}
      </div>
    );
  }
);

export interface ThemeCardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const ThemeCardTitle = forwardRef<HTMLHeadingElement, ThemeCardTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3 
        className={cn('card-title', className)} 
        ref={ref} 
        {...props}
      >
        {children}
      </h3>
    );
  }
);

export interface ThemeCardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export const ThemeCardDescription = forwardRef<HTMLParagraphElement, ThemeCardDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p 
        className={cn('card-description', className)} 
        ref={ref} 
        {...props}
      >
        {children}
      </p>
    );
  }
);

ThemeCard.displayName = 'ThemeCard';
ThemeCardHeader.displayName = 'ThemeCardHeader';
ThemeCardBody.displayName = 'ThemeCardBody';
ThemeCardFooter.displayName = 'ThemeCardFooter';
ThemeCardTitle.displayName = 'ThemeCardTitle';
ThemeCardDescription.displayName = 'ThemeCardDescription';