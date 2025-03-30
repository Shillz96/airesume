import React from 'react';
// Remove broken import: import { Container } from './unified';
import { cn } from '@/lib/utils'; // Assuming cn utility exists

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  // Let's use Tailwind padding scale names directly if possible, or map them
  paddingTop?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'; // Keep prop names for now
  glass?: boolean; // Add option for glass effect
}

/**
 * PageContainer component
 * 
 * Provides consistent padding and maximum width for page content.
 * Apply glass effect via the glass prop or use the glass-panel utility class.
 */
const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  className = '',
  paddingTop = 'sm', // Default padding top
  glass = false, // Default to no glass effect
}) => {

  // Map paddingTop prop to Tailwind padding classes
  const paddingTopClasses = {
    none: 'pt-0',
    xs: 'pt-2',  // Assuming xs maps to space-2 (8px)
    sm: 'pt-4',  // Assuming sm maps to space-4 (16px)
    md: 'pt-6',  // Assuming md maps to space-6 (24px)
    lg: 'pt-8',  // Assuming lg maps to space-8 (32px)
    xl: 'pt-12'  // Assuming xl maps to space-12 (48px)
  };

  return (
    <div 
      className={cn(
        'w-full mx-auto', // Center content
        'max-w-screen-xl', // Apply max-width (adjust if needed, e.g., max-w-7xl)
        'px-4 sm:px-6 lg:px-8', // Apply horizontal padding (consistent with App.tsx?)
        paddingTopClasses[paddingTop], // Apply vertical top padding
        glass && 'glass-panel rounded-lg', // Apply glass effect if enabled
        className // Apply any additional classes passed via props
      )}
    >
      {children}
    </div>
  );
};

export default PageContainer;