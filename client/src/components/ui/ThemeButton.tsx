import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

// Button variants and sizes
type ButtonVariant = 
  | 'primary'        // Default blue button with white text
  | 'secondary'      // Purple button with white text
  | 'accent'         // Accent color button
  | 'destructive'    // Red button for dangerous actions
  | 'success'        // Green button for success/confirmation actions
  | 'outline'        // Transparent with border
  | 'ghost'          // Transparent without border
  | 'link'           // Text only with underline
  | 'gradient'       // Gradient background
  | 'gradient-border' // Button with gradient border
  ;

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ThemeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  withGlow?: boolean;
}

/**
 * ThemeButton - Unified button component for the application
 * 
 * This component incorporates all button styling into a single component
 * that is consistent with our theme. It unifies the various button implementations
 * and provides a consistent API for all buttons in the application.
 * 
 * Usage:
 * ```tsx
 * <ThemeButton variant="primary" size="md">Click Me</ThemeButton>
 * <ThemeButton variant="destructive" isLoading loadingText="Deleting...">Delete</ThemeButton>
 * <ThemeButton variant="outline" iconLeft={<PlusIcon />}>Add New</ThemeButton>
 * ```
 */
export const ThemeButton = forwardRef<HTMLButtonElement, ThemeButtonProps>(
  ({ 
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    loadingText,
    iconLeft,
    iconRight,
    fullWidth = false,
    withGlow = false,
    children,
    disabled,
    type = 'button',
    ...props
  }, ref) => {
    // Determine if this is an icon-only button
    const isIconOnly = (
      (iconLeft && !children && !iconRight) || 
      (!children && !loadingText && (iconLeft || iconRight))
    );
    
    // Build the class list based on props
    const buttonClasses = cn(
      'btn',
      `btn-${variant}`,
      `btn-${size}`,
      isIconOnly && 'btn-icon',
      fullWidth && 'btn-full',
      withGlow && 'btn-glow',
      isLoading && 'btn-loading',
      className
    );
    
    // Render loading, icons, and text appropriately
    const renderContent = () => {
      if (isLoading) {
        return (
          <>
            <span className="btn-spinner" aria-hidden="true" />
            <span className="btn-text">{loadingText || children}</span>
          </>
        );
      }
      
      return (
        <>
          {iconLeft && <span className="btn-icon-left">{iconLeft}</span>}
          {children && <span className="btn-text">{children}</span>}
          {iconRight && <span className="btn-icon-right">{iconRight}</span>}
        </>
      );
    };
    
    return (
      <button
        className={buttonClasses}
        disabled={isLoading || disabled}
        ref={ref}
        type={type}
        {...props}
      >
        {renderContent()}
      </button>
    );
  }
);

ThemeButton.displayName = 'ThemeButton';

export default ThemeButton;