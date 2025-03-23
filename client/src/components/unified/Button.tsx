import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * Button variant styles using class-variance-authority for theme consistency
 * Following the JobSearchProgress styling as the reference standard
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700 shadow-glow-blue",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-glow-red",
        outline: "border border-white/10 bg-transparent hover:bg-white/5 text-white",
        secondary: "bg-purple-600 text-white hover:bg-purple-700 shadow-glow-purple",
        ghost: "text-blue-400 hover:text-blue-300 hover:bg-transparent",
        link: "text-blue-400 underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700",
      },
      size: {
        xs: "h-6 px-2 text-xs",
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4 text-sm",
        lg: "h-10 px-8 text-base",
        xl: "h-12 px-8 text-lg",
      },
      glow: {
        none: "",
        subtle: "shadow-[0_0_10px_rgba(59,130,246,0.3)]",
        medium: "shadow-[0_0_15px_rgba(59,130,246,0.4)]",
        strong: "shadow-[0_0_20px_rgba(59,130,246,0.5)]",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      glow: "none",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

/**
 * UnifiedButton component with consistent styling across the application.
 * Uses the styling from the JobSearchProgress component as the reference standard.
 */
export const UnifiedButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      glow,
      fullWidth,
      isLoading = false,
      loadingText,
      iconLeft,
      iconRight,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, glow, fullWidth, className }))}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {!isLoading && iconLeft && <span className="mr-2">{iconLeft}</span>}
        {isLoading && loadingText ? loadingText : children}
        {!isLoading && iconRight && <span className="ml-2">{iconRight}</span>}
      </button>
    );
  }
);

UnifiedButton.displayName = "UnifiedButton";

// Export a default Button
export default UnifiedButton;