/**
 * Unified Container Component
 * 
 * This is the single Container component to be used across the entire application.
 * It provides consistent spacing, padding, and max-width for content sections.
 */
import React from 'react';
import { cn } from '@/lib/utils';

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'none';
  paddingX?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  paddingY?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  centerContent?: boolean;
}

// For backward compatibility
export interface UnifiedContainerProps {
  children: React.ReactNode;
  className?: string;
  paddingTop?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  maxWidth = 'lg',
  paddingX = 'md',
  paddingY = 'md',
  centerContent = false,
  ...props
}) => {
  // Max width styles
  const maxWidthStyles: Record<string, string> = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full',
    none: '',
  };

  // Padding X (horizontal) styles
  const paddingXStyles: Record<string, string> = {
    none: 'px-0',
    xs: 'px-2',
    sm: 'px-4',
    md: 'px-6',
    lg: 'px-8',
    xl: 'px-12',
  };

  // Padding Y (vertical) styles
  const paddingYStyles: Record<string, string> = {
    none: 'py-0',
    xs: 'py-2',
    sm: 'py-4',
    md: 'py-6',
    lg: 'py-8',
    xl: 'py-12',
  };

  // Center content styles
  const centerContentStyles = centerContent ? 'flex flex-col items-center' : '';

  return (
    <div
      className={cn(
        'mx-auto w-full',
        maxWidthStyles[maxWidth],
        paddingXStyles[paddingX],
        paddingYStyles[paddingY],
        centerContentStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// For backward compatibility
export const UnifiedContainer: React.FC<UnifiedContainerProps> = ({
  children,
  className = '',
  paddingTop = 'sm'
}) => {
  return (
    <Container
      className={className}
      paddingY={paddingTop}
      maxWidth="lg"
    >
      {children}
    </Container>
  );
};

export default Container;