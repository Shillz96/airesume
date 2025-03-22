import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// Define button variants using class-variance-authority
const buttonVariants = cva(
  // Base styles applied to all buttons
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      // Visual variants
      variant: {
        primary: 'bg-primary text-white hover:bg-primary/90 shadow-sm',
        secondary: 'bg-secondary text-white hover:bg-secondary/90 shadow-sm',
        outline: 'border border-white/20 bg-card/30 text-white hover:bg-white/10',
        ghost: 'text-white hover:bg-white/10',
        destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
      },
      // Size variants
      size: {
        xs: 'h-6 px-2 text-xs rounded',
        sm: 'h-8 px-3 text-sm rounded',
        md: 'h-10 px-4 py-2 rounded-md',
        lg: 'h-12 px-6 py-3 text-lg rounded-md',
        xl: 'h-14 px-8 py-4 text-xl rounded-lg',
      },
      // Full width variant
      fullWidth: {
        true: 'w-full',
      },
      // Glow effect variant
      withGlow: {
        true: 'relative overflow-hidden after:absolute after:inset-0 after:content-[""] after:bg-gradient-to-r after:from-primary/0 after:via-primary/30 after:to-primary/0 after:animate-glow-slow after:opacity-30',
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