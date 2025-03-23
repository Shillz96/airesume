import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Button variant styles using class-variance-authority for theme consistency
 * Automatically integrates with theme variables
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-primary to-blue-700 text-white hover:opacity-90",
        cosmic: "bg-black/30 border border-white/10 text-white hover:border-white/20 backdrop-blur-sm",
      },
      size: {
        xs: "h-7 rounded-md px-2 text-xs",
        sm: "h-8 rounded-md px-3 text-xs",
        md: "h-9 rounded-md px-4",
        lg: "h-10 rounded-md px-6",
        xl: "h-12 rounded-md px-8 text-base",
        icon: "h-9 w-9",
      },
      glow: {
        none: "",
        subtle: "shadow-md",
        primary: "shadow-md shadow-primary/20",
        cosmic: "shadow-lg shadow-primary/40",
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
  fullWidth?: boolean;
}

/**
 * Unified Button component that integrates with our theme system
 * This component serves as the single button implementation throughout the application
 * Now uses forwardRef to properly handle ref forwarding when used with other components
 */
// Using forwardRef to allow passing refs to the button element
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      glow,
      isLoading = false,
      loadingText,
      iconLeft,
      iconRight,
      children,
      disabled,
      fullWidth,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size, glow }),
          fullWidth && "w-full",
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {!isLoading && iconLeft && (
          <span className={cn("mr-2", size === "icon" && "mr-0")}>
            {iconLeft}
          </span>
        )}
        {isLoading && loadingText ? loadingText : children}
        {iconRight && (
          <span className="ml-2">
            {iconRight}
          </span>
        )}
      </button>
    );
  }
);

// Add display name for React DevTools and error messages
Button.displayName = "Button";