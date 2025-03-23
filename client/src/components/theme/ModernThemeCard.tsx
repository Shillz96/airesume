import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  CardProps
} from '@/ui/core/Card';
import { cn } from '@/lib/utils';

/**
 * ModernThemeCard
 * 
 * This component provides a wrapper around our unified Card component
 * with cosmic-themed styling options and animations.
 * 
 * It maintains the same API as the core Card component while adding
 * additional theme-specific features.
 */

export interface ModernThemeCardProps extends CardProps {
  withGlow?: boolean;
  isHoverable?: boolean;
  isInteractive?: boolean;
}

export function ModernThemeCard({
  className,
  withGlow,
  isHoverable,
  isInteractive,
  children,
  ...props
}: ModernThemeCardProps) {
  return (
    <Card 
      className={cn(
        className,
        withGlow && 'shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]',
        isHoverable && 'transition-all duration-300 hover:border-primary/50',
        isInteractive && 'transition-all duration-300 hover:shadow-lg cursor-pointer'
      )}
      {...props}
    >
      {children}
    </Card>
  );
}

export function ModernThemeCardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <CardHeader className={cn(className)} {...props} />;
}

export function ModernThemeCardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <CardTitle className={cn(className)} {...props} />;
}

export function ModernThemeCardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <CardDescription className={cn(className)} {...props} />;
}

export function ModernThemeCardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <CardContent className={cn(className)} {...props} />;
}

export function ModernThemeCardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <CardFooter className={cn(className)} {...props} />;
}

// Export all components for convenience
export const ThemeCard = ModernThemeCard;
export const ThemeCardHeader = ModernThemeCardHeader;
export const ThemeCardTitle = ModernThemeCardTitle;
export const ThemeCardDescription = ModernThemeCardDescription;
export const ThemeCardContent = ModernThemeCardContent;
export const ThemeCardFooter = ModernThemeCardFooter;