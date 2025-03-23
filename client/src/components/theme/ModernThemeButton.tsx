import React from 'react';
import { Button, ButtonProps } from '@/ui/core/Button';
import { cn } from '@/lib/utils';

/**
 * ModernThemeButton
 * 
 * This component provides a wrapper around our unified Button component
 * with cosmic-themed styling options and animations.
 * 
 * It maintains the same API as the core Button component while adding
 * additional theme-specific features.
 */

export interface ModernThemeButtonProps extends Omit<ButtonProps, 'variant'> {
  withGlow?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success' | 'gradient-border' | 'animated-gradient';
}

export function ModernThemeButton({
  className,
  variant = 'primary',
  size,
  withGlow,
  children,
  ...props
}: ModernThemeButtonProps) {
  // Map our variants to the core Button variants
  const variantMap: Record<string, 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient' | 'cosmic' | null> = {
    'primary': 'default',
    'secondary': 'secondary',
    'outline': 'outline',
    'ghost': 'ghost',
    'destructive': 'destructive',
    'success': 'outline',
    'gradient-border': 'outline',
    'animated-gradient': 'gradient'
  };

  // Get the core Button variant
  const buttonVariant = variantMap[variant] || 'default';

  // Add special styling for our custom variants
  const customStyles = cn(
    withGlow && 'shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)] hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]',
    variant === 'success' && 'bg-success text-white hover:bg-success/90',
    variant === 'gradient-border' && 'border-2 border-transparent bg-clip-padding border-gradient',
    variant === 'animated-gradient' && 'bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary transition-all duration-500'
  );

  return (
    <Button 
      className={cn(customStyles, className)}
      variant={buttonVariant}
      size={size}
      {...props}
    >
      {children}
    </Button>
  );
}

// Export for convenience
export const ThemeButton = ModernThemeButton;