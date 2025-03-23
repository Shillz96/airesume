/**
 * Unified PageHeader Component
 * 
 * This is the single PageHeader component to be used across the entire application.
 * It provides consistent header styling with variants for different pages.
 */
import React from 'react';
import { cn } from '@/lib/utils';
import Text from './Text';

export interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  variant?: 'default' | 'gradient' | 'cosmic';
  className?: string;
  borderStyle?: 'none' | 'subtle' | 'gradient';
}

// For backward compatibility
export interface UnifiedPageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  variant?: 'default' | 'gradient' | 'cosmic';
  className?: string;
  borderStyle?: 'none' | 'subtle' | 'gradient';
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  variant = 'default',
  className,
  borderStyle = 'none',
  ...props
}) => {
  // Border styles
  const borderStyles: Record<string, string> = {
    none: '',
    subtle: 'border-b border-border',
    gradient: 'border-b border-gradient-to-r from-blue-500 to-purple-500',
  };

  // Header variants
  const variantStyles: Record<string, { titleClass: string; subtitleClass: string }> = {
    default: {
      titleClass: '',
      subtitleClass: 'text-muted-foreground',
    },
    gradient: {
      titleClass: 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600',
      subtitleClass: 'text-muted-foreground',
    },
    cosmic: {
      titleClass: 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-600',
      subtitleClass: 'text-muted-foreground',
    },
  };

  const renderTitle = () => {
    if (typeof title === 'string') {
      return (
        <Text 
          variant="h1" 
          className={cn(variantStyles[variant].titleClass)}
        >
          {title}
        </Text>
      );
    }
    return title;
  };

  const renderSubtitle = () => {
    if (!subtitle) return null;
    
    if (typeof subtitle === 'string') {
      return (
        <Text 
          variant="subtitle1" 
          className={cn('mt-2', variantStyles[variant].subtitleClass)}
        >
          {subtitle}
        </Text>
      );
    }
    return subtitle;
  };

  return (
    <div 
      className={cn(
        'mb-6 pb-4',
        borderStyles[borderStyle],
        className
      )}
      {...props}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          {renderTitle()}
          {renderSubtitle()}
        </div>
        {actions && (
          <div className="flex items-center gap-3 md:ml-auto">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

// For backward compatibility
export const UnifiedPageHeader: React.FC<UnifiedPageHeaderProps> = (props) => {
  return <PageHeader {...props} />;
};

export default PageHeader;