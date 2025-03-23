import React from 'react';
import { cn } from '@/lib/utils';
import { useUnifiedTheme } from '@/contexts/UnifiedThemeContext';

/**
 * Unified PageHeader Component
 * 
 * This component provides a consistent page header layout throughout the application
 * with support for different visual styles based on the theme system.
 * 
 * Features:
 * - Multiple variant support (default, gradient, cosmic)
 * - Support for title, subtitle, and actions
 * - Consistent spacing and layout
 * - Border style options
 */

interface UnifiedPageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  variant?: 'default' | 'gradient' | 'cosmic';
  className?: string;
  borderStyle?: 'none' | 'subtle' | 'gradient';
}

export function UnifiedPageHeader({
  title,
  subtitle,
  actions,
  variant = 'default',
  className,
  borderStyle = 'subtle',
}: UnifiedPageHeaderProps) {
  const { config, getThemeClass } = useUnifiedTheme();
  
  // Base classes for the header
  const headerClasses = cn(
    'mb-8 pb-4',
    borderStyle === 'none' ? '' : 
    borderStyle === 'subtle' ? 'border-b border-border' : 
    'border-b-2 border-gradient',
    
    // Apply theme variant specific classes
    variant === 'cosmic' && config.variant === 'cosmic' ? 'cosmic-header' : '',
    variant === 'gradient' ? 'gradient-header' : '',
    
    // Allow custom classes to override defaults
    className
  );
  
  // Classes for the title
  const titleClasses = cn(
    'text-2xl font-bold tracking-tight',
    variant === 'gradient' ? 'text-gradient' : '',
    variant === 'cosmic' && config.variant === 'cosmic' ? 'cosmic-text-gradient animate-pulse' : ''
  );
  
  // Classes for the subtitle
  const subtitleClasses = cn(
    'text-muted-foreground mt-1',
    variant === 'cosmic' && config.variant === 'cosmic' ? 'text-blue-300' : ''
  );
  
  return (
    <div className={headerClasses}>
      <div className="flex items-center justify-between">
        <div>
          {typeof title === 'string' ? (
            <h1 className={titleClasses}>{title}</h1>
          ) : (
            title
          )}
          
          {subtitle && (
            typeof subtitle === 'string' ? (
              <p className={subtitleClasses}>{subtitle}</p>
            ) : (
              subtitle
            )
          )}
        </div>
        
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

export default UnifiedPageHeader;