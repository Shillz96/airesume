import React from 'react';
import { useUnifiedTheme } from '../../contexts/UnifiedThemeContext';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'cosmic';
  padding?: 'none' | 'small' | 'medium' | 'large';
  withShadow?: boolean;
  withHoverEffect?: boolean;
  withGradientBorder?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * UnifiedCard component
 * 
 * A versatile card component that supports multiple visual variants
 * and is fully responsive across all device sizes.
 * 
 * Features:
 * - Multiple style variants
 * - Configurable padding
 * - Optional shadow and hover effects
 * - Optional gradient border
 * - Fully responsive
 */
export function UnifiedCard({
  variant = 'default',
  padding = 'medium',
  withShadow = false,
  withHoverEffect = false,
  withGradientBorder = false,
  className = '',
  children,
  ...props
}: CardProps) {
  const { config } = useUnifiedTheme();

  // Determine variant-specific styles
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary text-primary-foreground';
      case 'secondary':
        return 'bg-secondary text-secondary-foreground';
      case 'outline':
        return 'bg-transparent border border-border';
      case 'ghost':
        return 'bg-muted/50';
      case 'cosmic':
        return 'bg-black/20 backdrop-blur-sm cosmic-glow';
      case 'default':
      default:
        return 'bg-card text-card-foreground';
    }
  };

  // Determine padding size
  const getPaddingClasses = () => {
    switch (padding) {
      case 'none':
        return '';
      case 'small':
        return 'p-3';
      case 'large':
        return 'p-6';
      case 'medium':
      default:
        return 'p-4';
    }
  };

  // Apply optional shadow
  const getShadowClasses = () => {
    if (!withShadow) return '';
    return 'shadow-lg';
  };

  // Apply hover effect
  const getHoverClasses = () => {
    if (!withHoverEffect) return '';
    return 'transition-all duration-200 hover:shadow-md hover:-translate-y-1';
  };

  // Apply gradient border
  const getGradientBorderClasses = () => {
    if (!withGradientBorder) return '';
    return 'border-gradient';
  };

  const cardClasses = [
    'rounded-lg',
    getVariantClasses(),
    getPaddingClasses(),
    getShadowClasses(),
    getHoverClasses(),
    getGradientBorderClasses(),
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
}

export function UnifiedCardHeader({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex flex-col space-y-1.5 ${className}`} {...props} />
  );
}

export function UnifiedCardTitle({ className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-lg md:text-xl font-semibold leading-none tracking-tight ${className}`} {...props} />
  );
}

export function UnifiedCardDescription({ className = '', ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-sm text-muted-foreground ${className}`} {...props} />
  );
}

export function UnifiedCardContent({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`pt-4 ${className}`} {...props} />
  );
}

export function UnifiedCardFooter({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex flex-wrap items-center pt-4 gap-4 mt-auto ${className}`} {...props} />
  );
}

export default UnifiedCard;