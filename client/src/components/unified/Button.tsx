import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

/**
 * Unified Button Component
 * 
 * This component replaces all previous button implementations with a single,
 * consistent component that integrates with our unified theme system.
 * 
 * Features:
 * - Consistent styling across the application
 * - Support for multiple variants and sizes
 * - Loading state and accessibility features
 * - Icon support (left and right)
 * - Theme-aware styling that adapts to dark/light mode and theme variant
 */

// Define button variants using class-variance-authority
const buttonVariants = cva(
  // Base styles for all buttons
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-danger text-white hover:bg-danger/90",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Cosmic-specific variants
        cosmic: "relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary before:to-secondary before:z-[-1] text-white hover:before:opacity-80",
        "cosmic-outline": "border border-primary/30 bg-transparent text-foreground hover:border-primary/80 hover:bg-primary/10 hover:text-primary",
        glow: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-7 rounded px-2 text-xs",
        sm: "h-9 rounded-md px-3 text-sm",
        lg: "h-11 rounded-md px-8 text-lg",
        icon: "h-10 w-10 p-0",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  }
);

// Button props interface
export interface UnifiedButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  loadingText?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * The UnifiedButton component
 */
const UnifiedButton = forwardRef<HTMLButtonElement, UnifiedButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      isLoading = false,
      loadingText,
      iconLeft,
      iconRight,
      fullWidth,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Determine if the button should be disabled
    const isDisabled = disabled || isLoading;
    
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        disabled={isDisabled}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        {!isLoading && iconLeft && (
          <span className="mr-2 inline-flex">{iconLeft}</span>
        )}
        {isLoading && loadingText ? loadingText : children}
        {!isLoading && iconRight && (
          <span className="ml-2 inline-flex">{iconRight}</span>
        )}
      </button>
    );
  }
);

// Set display name for debugging
UnifiedButton.displayName = "UnifiedButton";

export { UnifiedButton, buttonVariants };