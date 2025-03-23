import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

/**
 * Button variant styles using class-variance-authority for theme consistency
 * Automatically integrates with theme variables
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-success text-success-foreground hover:bg-success/90",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90",
        cosmic: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90",
        "gradient-border": "border-2 border-transparent bg-background hover:bg-accent/30 relative after:absolute after:inset-0 after:rounded-md after:p-[2px] after:bg-gradient-to-r after:from-indigo-500 after:via-purple-500 after:to-pink-500 after:-z-10 after:content-['']",
        "animated-gradient": "relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white transition-all duration-500"
      },
      size: {
        default: "h-9 px-4 py-2",
        xs: "h-7 rounded-md px-2 text-xs",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        xl: "h-12 rounded-md px-8 text-base",
        icon: "h-9 w-9 p-0",
      },
      withGlow: {
        true: "after:absolute after:inset-0 after:rounded-md after:opacity-70 after:blur-md after:bg-inherit after:-z-10 after:content-['']",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      withGlow: false,
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
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    withGlow,
    asChild = false, 
    isLoading = false,
    loadingText,
    iconLeft,
    iconRight,
    fullWidth = false,
    children,
    ...props 
  }, ref) => {
    const { isDarkMode } = useTheme();
    const Comp = asChild ? Slot : "button";
    const buttonClassName = cn(
      buttonVariants({ variant, size, withGlow, className }),
      fullWidth && "w-full",
      (isDarkMode && variant === "outline") && "border-gray-700", 
      (isDarkMode && variant === "ghost") && "hover:bg-gray-800",
    );

    return (
      <Comp
        className={buttonClassName}
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

Button.displayName = "Button";

export { Button, buttonVariants };