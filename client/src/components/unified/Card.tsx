/**
 * Unified Card Component
 * 
 * This is the single Card component to be used across the entire application.
 * It provides consistent card styling with variants and standardized spacing.
 */
import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'cosmic' | 'glass';
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  className?: string;
  withShadow?: boolean;
  withBorder?: boolean;
  withHoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  isLoading = false,
  className,
  withShadow = true,
  withBorder = true,
  withHoverEffect = false,
  ...props
}) => {
  // Base card styles
  const baseClasses = 'rounded-md transition-all duration-200';
  
  // Variant-specific classes
  const variantClasses: Record<string, string> = {
    default: 'bg-card text-card-foreground',
    outline: 'bg-background',
    cosmic: 'bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-sm text-white',
    glass: 'bg-white/10 backdrop-blur-md dark:bg-slate-900/50 text-foreground'
  };
  
  // Padding classes
  const paddingClasses: Record<string, string> = {
    none: 'p-0',
    xs: 'p-2',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  // Shadow classes
  const shadowClasses = withShadow ? 'shadow-sm' : '';
  
  // Border classes
  const borderClasses = withBorder ? 'border border-border' : '';
  
  // Hover effect classes
  const hoverClasses = withHoverEffect 
    ? 'hover:shadow-md hover:-translate-y-1'
    : '';
    
  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        paddingClasses[padding],
        shadowClasses,
        borderClasses,
        hoverClasses,
        className
      )}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-32">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 pb-4', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <h3
      className={cn('text-xl font-semibold leading-none tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <p
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    >
      {children}
    </p>
  );
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn('flex items-center pt-4 border-t border-border', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;