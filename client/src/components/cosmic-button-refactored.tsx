import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// Define button variants using class-variance-authority
const buttonVariants = cva(
  // Base styles applied to all buttons
  'cosmic-button inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      // Visual variants
      variant: {
        primary: 'cosmic-button-primary bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'cosmic-button-secondary bg-secondary text-secondary-foreground hover:bg-secondary/90',
        outline: 'cosmic-button-outline border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      // Size variants
      size: {
        xs: 'cosmic-button-xs h-6 px-2 text-xs',
        sm: 'cosmic-button-sm h-8 px-3 text-sm',
        md: 'cosmic-button-md h-10 px-4 py-2',
        lg: 'cosmic-button-lg h-12 px-6 py-3 text-lg',
        xl: 'cosmic-button-xl h-14 px-8 py-4 text-xl',
      },
      // Full width variant
      fullWidth: {
        true: 'w-full',
      },
      // Glow effect variant
      withGlow: {
        true: 'cosmic-button-glow relative overflow-hidden',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
      withGlow: false,
    },
  }
);

export interface CosmicButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

/**
 * CosmicButton component that applies consistent cosmic theme styling
 * across the application while using our theme variables for consistency.
 */
const CosmicButton = forwardRef<HTMLButtonElement, CosmicButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth, 
    withGlow,
    asChild = false,
    isLoading = false,
    loadingText,
    iconLeft,
    iconRight,
    children,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : 'button';
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, withGlow, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {!isLoading && iconLeft && (
          <span className="mr-2">{iconLeft}</span>
        )}
        {isLoading && loadingText ? loadingText : children}
        {!isLoading && iconRight && (
          <span className="ml-2">{iconRight}</span>
        )}
      </Comp>
    );
  }
);

CosmicButton.displayName = 'CosmicButton';

export { CosmicButton, buttonVariants };