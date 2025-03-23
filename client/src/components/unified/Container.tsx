import React from 'react';
import { cn } from '@/lib/utils';
import { useUnifiedTheme } from '@/contexts/UnifiedThemeContext';

/**
 * Unified Container Component
 * 
 * This component provides a consistent container layout throughout the application
 * with predictable spacing and maximum width.
 * 
 * Features:
 * - Consistent max-width and padding
 * - Theme-aware styling
 * - Support for full-width and centered layouts
 */

interface UnifiedContainerProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  noPadding?: boolean;
  centered?: boolean;
}

export function UnifiedContainer({
  children,
  className,
  fullWidth = false,
  noPadding = false,
  centered = false,
}: UnifiedContainerProps) {
  const { config } = useUnifiedTheme();
  
  // Base classes for the container
  const containerClasses = cn(
    // Apply max-width unless fullWidth is true
    !fullWidth ? 'max-w-[var(--content-max-width)]' : '',
    
    // Apply padding unless noPadding is true
    !noPadding ? 'px-[var(--container-padding)]' : '',
    
    // Center the container if centered or not fullWidth
    (centered || !fullWidth) ? 'mx-auto' : '',
    
    // Apply width
    'w-full',
    
    // Theme variant specific classes (add if needed)
    config.variant === 'cosmic' ? 'cosmic-container' : '',
    config.variant === 'professional' ? 'professional-container' : '',
    config.variant === 'minimal' ? 'minimal-container' : '',
    
    // Allow custom classes to override defaults
    className
  );
  
  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
}

export default UnifiedContainer;