/**
 * Unified Container Component
 * 
 * Provides consistent padding and maximum width for content
 * Integrates with the central theme system
 */
import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  paddingX?: 'none' | 'sm' | 'md' | 'lg';
  paddingY?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Container({
  children,
  className,
  maxWidth = 'xl',
  paddingX = 'md',
  paddingY = 'md',
}: ContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg', 
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    'full': 'max-w-none'
  };
  
  const paddingXClasses = {
    none: 'px-0',
    sm: 'px-2 sm:px-4',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-6 sm:px-8 lg:px-12'
  };
  
  const paddingYClasses = {
    none: 'py-0',
    sm: 'py-2 sm:py-4',
    md: 'py-4 sm:py-6',
    lg: 'py-6 sm:py-8'
  };
  
  return (
    <div className={cn(
      'mx-auto w-full',
      maxWidthClasses[maxWidth],
      paddingXClasses[paddingX],
      paddingYClasses[paddingY],
      className
    )}>
      {children}
    </div>
  );
}