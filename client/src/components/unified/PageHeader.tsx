import React from 'react';
import { useUnifiedTheme } from '../../contexts/UnifiedThemeContext';

interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  variant?: 'default' | 'gradient' | 'cosmic';
  className?: string;
  borderStyle?: 'none' | 'subtle' | 'gradient';
}

/**
 * UnifiedPageHeader component
 * 
 * A consistent page header that works well on all screen sizes
 * and supports multiple visual variants.
 */
export function UnifiedPageHeader({
  title,
  subtitle,
  actions,
  variant = 'default',
  className = '',
  borderStyle = 'none',
}: PageHeaderProps) {
  const { config } = useUnifiedTheme();
  
  // Determine border styling
  const getBorderClasses = () => {
    switch (borderStyle) {
      case 'subtle':
        return 'border-b border-border/40 pb-2 mb-2';
      case 'gradient':
        return 'border-b-[1px] border-gradient pb-2 mb-2';
      case 'none':
      default:
        return 'mb-2';
    }
  };
  
  // Determine variant-specific styles
  const getVariantClasses = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg';
      case 'cosmic':
        return 'bg-black/20 backdrop-blur-sm p-4 rounded-lg cosmic-glow';
      case 'default':
      default:
        return '';
    }
  };
  
  // Base classes that are applied regardless of variant
  const baseClasses = [
    'w-full',
    getBorderClasses(),
    getVariantClasses(),
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={baseClasses}>
      {/* Responsive layout that stacks on mobile but shows actions side-by-side on desktop */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          {/* Title with responsive sizing */}
          <div className="text-2xl font-bold md:text-3xl">{title}</div>
          
          {/* Optional subtitle */}
          {subtitle && (
            <div className="text-muted-foreground">{subtitle}</div>
          )}
        </div>
        
        {/* Optional actions - right-aligned on desktop, full-width on mobile */}
        {actions && (
          <div className="flex md:justify-end items-center mt-2 md:mt-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

export default UnifiedPageHeader;