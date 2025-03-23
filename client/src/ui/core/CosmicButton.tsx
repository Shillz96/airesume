import { Button } from "@/ui/core/Button";
import { cn } from "@/lib/utils";
import { getCurrentVariant } from "@/lib/theme-utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type CosmicButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success' | 'gradient-border' | 'animated-gradient';
type CosmicButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface CosmicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: CosmicButtonVariant;
  size?: CosmicButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  withGlow?: boolean;
}

/**
 * CosmicButton component that applies consistent cosmic theme styling
 * across the application while using our unified theme system.
 * 
 * This component is the recommended way to create buttons throughout the app
 * as it automatically handles theme variants, accessibility, and responsive design.
 * 
 * NOTE: This is a wrapper around the core Button component to provide additional
 * cosmic-themed styling options. For new components, prefer using the Button component
 * directly from ui/core/Button.tsx.
 */
export const CosmicButton = forwardRef<HTMLButtonElement, CosmicButtonProps>(
  ({ 
    variant = 'primary',
    size = 'md',
    isLoading = false,
    loadingText,
    iconLeft,
    iconRight,
    fullWidth = false,
    withGlow = false,
    className,
    children,
    disabled,
    ...props
  }, ref) => {
    // Get current theme variant for any theme-specific adjustments
    const themeVariant = getCurrentVariant();
    
    // Determine button styles based on variant from unified CSS
    const variantClasses = {
      primary: 'cosmic-button-primary',
      secondary: 'cosmic-button-secondary',
      outline: 'cosmic-button-outline',
      ghost: 'cosmic-button-ghost',
      destructive: 'cosmic-button-destructive',
      success: 'cosmic-button-success',
      'gradient-border': 'cosmic-button-gradient-border',
      'animated-gradient': 'cosmic-button-animated-gradient',
    };
    
    // Size classes from unified CSS
    const sizeClasses = {
      xs: 'cosmic-button-xs',
      sm: 'cosmic-button-sm',
      md: '', // Default size doesn't need a class
      lg: 'cosmic-button-lg',
      xl: 'cosmic-button-xl',
    };

    // Icon-only button (square) detection
    const isIconOnly = (iconLeft && !children && !iconRight) || (!children && !loadingText && (iconLeft || iconRight));
    
    // Full width class - using unified class
    const fullWidthClass = fullWidth ? 'cosmic-button-full-width' : '';
    
    // Glow effect class - using unified class
    const glowClass = withGlow ? 'cosmic-button-glow' : '';
    
    // Loading state class - using unified class
    const loadingClass = isLoading ? 'cosmic-button-loading' : '';
    
    // Icon positioning classes
    const iconLeftClass = iconLeft && !isIconOnly ? 'cosmic-button-icon-left' : '';
    const iconRightClass = iconRight && !isIconOnly ? 'cosmic-button-icon-right' : '';
    
    // Map our custom variants to Button variants
    const buttonVariant = variant === 'primary' ? 'default' 
      : variant === 'secondary' ? 'secondary'
      : variant === 'outline' ? 'outline'
      : variant === 'ghost' ? 'ghost'
      : variant === 'destructive' ? 'destructive'
      : variant === 'success' ? 'default'
      : variant === 'gradient-border' ? 'outline'
      : variant === 'animated-gradient' ? 'default'
      : 'default';
      
    // Map our sizes to Button sizes
    const buttonSize = size === 'xs' ? 'sm'
      : size === 'sm' ? 'sm'
      : size === 'md' ? 'md'
      : size === 'lg' ? 'lg'
      : size === 'xl' ? 'lg'
      : 'md';

    return (
      <Button
        variant={buttonVariant}
        size={buttonSize}
        className={cn(
          "cosmic-button", // Base class that applies core styling
          variantClasses[variant],
          sizeClasses[size],
          isIconOnly && 'cosmic-button-icon-only',
          iconLeftClass,
          iconRightClass,
          fullWidthClass,
          glowClass,
          loadingClass,
          className
        )}
        disabled={isLoading || disabled}
        isLoading={isLoading}
        loadingText={loadingText}
        iconLeft={iconLeft}
        iconRight={iconRight}
        fullWidth={fullWidth}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

CosmicButton.displayName = "CosmicButton";