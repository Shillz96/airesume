import React, { forwardRef } from 'react';
import { useUnifiedTheme } from '../../contexts/UnifiedThemeContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'cosmic' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  withGlow?: boolean;
  withGradientBorder?: boolean;
}

/**
 * UnifiedButton component
 * 
 * A versatile button component that supports multiple visual variants
 * and is fully responsive across all device sizes.
 * 
 * Features:
 * - Multiple style variants and sizes
 * - Loading state with spinner
 * - Icon support (left and right)
 * - Optional glow effect
 * - Optional gradient border
 * - Full width option
 */
export const UnifiedButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'default',
    size = 'md',
    isLoading = false,
    loadingText,
    leftIcon,
    rightIcon,
    fullWidth = false,
    withGlow = false,
    withGradientBorder = false,
    className = '',
    children,
    disabled,
    ...props
  }, ref) => {
    const { config } = useUnifiedTheme();
    const isDisabled = disabled || isLoading;

    // Determine variant-specific styles
    const getVariantClasses = () => {
      switch (variant) {
        case 'primary':
          return 'bg-primary text-primary-foreground hover:bg-primary/90';
        case 'secondary':
          return 'bg-secondary text-secondary-foreground hover:bg-secondary/90';
        case 'outline':
          return 'border border-border bg-background hover:bg-muted/30 text-foreground';
        case 'ghost':
          return 'hover:bg-muted/30 text-foreground';
        case 'link':
          return 'text-primary underline-offset-4 hover:underline p-0 h-auto';
        case 'cosmic':
          return 'bg-black/30 text-white backdrop-blur-sm border-t border-white/10 hover:bg-black/40';
        case 'danger':
          return 'bg-red-500 text-white hover:bg-red-600';
        case 'default':
        default:
          return 'bg-muted text-muted-foreground hover:bg-muted/80';
      }
    };

    // Determine size-specific styles
    const getSizeClasses = () => {
      switch (size) {
        case 'sm':
          return 'h-8 px-3 text-xs rounded-md';
        case 'lg':
          return 'h-12 px-6 text-base rounded-lg';
        case 'icon':
          return 'h-9 w-9 p-0 rounded-md';
        case 'md':
        default:
          return 'h-10 px-4 py-2 text-sm rounded-md';
      }
    };

    // Apply full width if needed
    const getWidthClasses = () => {
      return fullWidth ? 'w-full' : '';
    };

    // Apply glow effect if needed
    const getGlowClasses = () => {
      if (!withGlow) return '';
      
      switch (variant) {
        case 'primary':
          return 'shadow-md shadow-primary/30';
        case 'secondary':
          return 'shadow-md shadow-secondary/30';
        case 'cosmic':
          return 'cosmic-glow';
        case 'danger':
          return 'shadow-md shadow-red-500/30';
        default:
          return 'shadow-md';
      }
    };

    // Apply gradient border if needed
    const getGradientBorderClasses = () => {
      if (!withGradientBorder) return '';
      return 'border-gradient';
    };

    // Base classes that apply to all buttons
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50';

    // Combined classes
    const buttonClasses = [
      baseClasses,
      getVariantClasses(),
      getSizeClasses(),
      getWidthClasses(),
      getGlowClasses(),
      getGradientBorderClasses(),
      className
    ].filter(Boolean).join(' ');

    return (
      <button
        className={buttonClasses}
        disabled={isDisabled}
        ref={ref}
        {...props}
      >
        {/* Loading Spinner */}
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}

        {/* Left Icon */}
        {!isLoading && leftIcon && (
          <span className="mr-2">{leftIcon}</span>
        )}

        {/* Button Text */}
        {isLoading && loadingText ? loadingText : children}

        {/* Right Icon */}
        {!isLoading && rightIcon && (
          <span className="ml-2">{rightIcon}</span>
        )}
      </button>
    );
  }
);

UnifiedButton.displayName = 'UnifiedButton';

export default UnifiedButton;