import React from 'react';
import { useUnifiedTheme } from '../../contexts/UnifiedThemeContext';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  noGutter?: boolean;
  centerContent?: boolean;
  as?: React.ElementType;
  paddingTop?: 'none' | 'sm' | 'md' | 'lg';
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
  paddingTop = 'md',
  as: Component = 'div'
}: ContainerProps) {
  const { config } = useUnifiedTheme();
  
  // Get padding top value based on the selected option
  const getPaddingTopClass = () => {
    switch (paddingTop) {
      case 'none': return '';
      case 'sm': return 'pt-2';
      case 'md': return 'pt-4 sm:pt-6';
      case 'lg': return 'pt-6 sm:pt-8';
      default: return 'pt-4 sm:pt-6';
    }
  };
  
  // Base container classes
  const baseClasses = [
    // Padding that adapts to screen size
    noGutter ? '' : 'px-4 sm:px-6 md:px-8',
    
    // Top padding based on selected option
    getPaddingTopClass(),
    
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