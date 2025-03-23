/**
 * Unified PageHeader Component
 * 
 * A consistent header component for all pages with support for title, subtitle, and actions
 * Integrates with the central theme system via CSS variables
 */
import React from 'react';
import { cn } from '@/lib/utils';
import { Heading1, Heading2, GradientText } from './Text';

interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  variant?: 'default' | 'gradient' | 'cosmic';
  className?: string;
  borderStyle?: 'none' | 'subtle' | 'gradient';
}

export default function PageHeader({
  title,
  subtitle,
  actions,
  variant = 'default',
  className,
  borderStyle = 'subtle',
}: PageHeaderProps) {
  // Different classes based on variant
  const variantClasses = {
    default: '',
    gradient: '',
    cosmic: 'bg-black/10 backdrop-blur-sm bg-opacity-60 rounded-xl'
  };

  // Border style classes
  const borderClasses = {
    none: '',
    subtle: 'border-b border-border',
    gradient: 'border-b border-gradient-to-r from-primary via-secondary to-transparent'
  };
  
  return (
    <div className={cn(
      'flex flex-col md:flex-row justify-between items-start md:items-center py-4 mb-6',
      borderClasses[borderStyle],
      variantClasses[variant],
      className
    )}>
      <div className="space-y-1">
        {variant === 'gradient' ? (
          <GradientText as="h1" size="3xl" weight="bold" gradient="cosmic" className="tracking-tight">
            {title}
          </GradientText>
        ) : (
          <Heading1 className={cn(
            variant === 'cosmic' && 'text-white'
          )}>
            {title}
          </Heading1>
        )}
        
        {subtitle && (
          <Heading2 className={cn(
            'font-normal text-muted-foreground',
            variant === 'cosmic' && 'text-white/70'
          )}>
            {subtitle}
          </Heading2>
        )}
      </div>
      
      {actions && (
        <div className="flex gap-2 mt-4 md:mt-0">
          {actions}
        </div>
      )}
    </div>
  );
}