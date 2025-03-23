/**
 * Unified Page Header Component
 * 
 * A flexible page header component with multiple variants and styling options.
 * Designed to be consistent with our unified theme system.
 */
import React from 'react';
import { cn } from '@/lib/utils';
import { useUnifiedTheme } from '@/contexts/UnifiedThemeContext';

export interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  variant?: 'default' | 'gradient' | 'cosmic';
  className?: string;
  borderStyle?: 'none' | 'subtle' | 'gradient';
}

export default function UnifiedPageHeader({ 
  title,
  subtitle,
  actions,
  variant = 'default',
  className,
  borderStyle = 'none',
}: PageHeaderProps) {
  const { config } = useUnifiedTheme();
  
  const borderClasses = {
    none: '',
    subtle: 'border-b border-border/40 pb-6',
    gradient: 'border-b border-gradient-to-r from-primary/50 via-primary/20 to-primary/50 pb-6'
  };
  
  const variantClasses = {
    default: 'bg-card',
    gradient: 'bg-gradient-to-r from-card/50 to-card',
    cosmic: 'bg-black/40 backdrop-blur-sm rounded-lg'
  };
  
  return (
    <div className={cn(
      "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8",
      borderStyle && borderClasses[borderStyle],
      className
    )}>
      <div className="space-y-1">
        {typeof title === 'string' ? (
          <h1 className={cn(
            "text-2xl font-bold tracking-tight",
            config.variant === 'cosmic' && "text-primary"
          )}>
            {title}
          </h1>
        ) : (
          title
        )}
        
        {subtitle && (
          <p className="text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
      
      {actions && (
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          {actions}
        </div>
      )}
    </div>
  );
}

export { UnifiedPageHeader };