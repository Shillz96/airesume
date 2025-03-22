import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type CosmicButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';

export interface CosmicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: CosmicButtonVariant;
  isLoading?: boolean;
  loadingText?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

/**
 * CosmicButton component that applies consistent cosmic theme styling
 * across the application while using shadcn/ui Button as the base.
 */
export const CosmicButton = forwardRef<HTMLButtonElement, CosmicButtonProps>(
  ({ 
    variant = 'primary',
    isLoading = false,
    loadingText,
    iconLeft,
    iconRight,
    className,
    children,
    disabled,
    ...props
  }, ref) => {
    const variantStyles = {
      primary: 'cosmic-button-primary',
      secondary: 'cosmic-button-secondary',
      outline: 'cosmic-button-outline',
      ghost: 'cosmic-button-ghost',
      destructive: 'cosmic-button-destructive',
    };

    // Map our custom variants to shadcn/ui Button variants for accessibility and behavior
    const shadcnVariant = variant === 'primary' ? 'default' 
      : variant === 'secondary' ? 'secondary'
      : variant === 'outline' ? 'outline'
      : variant === 'ghost' ? 'ghost'
      : variant === 'destructive' ? 'destructive'
      : 'default';

    return (
      <Button
        ref={ref}
        variant={shadcnVariant}
        className={cn(variantStyles[variant], className)}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading && (
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {iconLeft && !isLoading && <span className="mr-1">{iconLeft}</span>}
        {isLoading && loadingText ? loadingText : children}
        {iconRight && <span className="ml-1">{iconRight}</span>}
      </Button>
    );
  }
);

CosmicButton.displayName = "CosmicButton";