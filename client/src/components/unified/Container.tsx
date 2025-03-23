import React from 'react';
import { useUnifiedTheme } from '../../contexts/UnifiedThemeContext';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  noGutter?: boolean;
  centerContent?: boolean;
  as?: React.ElementType;
}

/**
 * UnifiedContainer component
 * 
 * A responsive container that adapts to different screen sizes
 * and provides consistent padding across the application.
 * 
 * Features:
 * - Responsive padding based on screen size
 * - Option for full width or max-width constraint
 * - Support for custom HTML element type
 * - Configurable gutters and content alignment
 */
export function UnifiedContainer({
  children,
  className = '',
  fullWidth = false,
  noGutter = false,
  centerContent = false,
  as: Component = 'div'
}: ContainerProps) {
  const { config } = useUnifiedTheme();
  
  // Base container classes
  const baseClasses = [
    // Padding that adapts to screen size
    noGutter ? '' : 'px-4 sm:px-6 md:px-8',
    
    // Max width constraints (unless fullWidth is true)
    fullWidth ? 'w-full' : 'max-w-7xl mx-auto w-full',
    
    // Centering content if requested
    centerContent ? 'flex flex-col items-center' : '',
    
    // Apply any additional custom classes
    className
  ].filter(Boolean).join(' ');
  
  return (
    <Component className={baseClasses}>
      {children}
    </Component>
  );
}

export default UnifiedContainer;