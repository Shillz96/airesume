import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

const cardVariants = cva(
  "rounded-lg shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        elevated: "bg-card text-card-foreground shadow-md",
        outlined: "bg-transparent border",
        flat: "bg-muted/50 text-muted-foreground",
        gradient: "bg-gradient-to-br from-primary/20 via-background to-background/80 text-card-foreground",
        glass: "backdrop-blur-md bg-background/60 text-card-foreground border border-muted/20"
      },
      size: {
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
      },
      isInteractive: {
        true: "transition-all duration-200 hover:shadow-md",
        false: "",
      },
      isHoverable: {
        true: "hover:border-primary/50 hover:shadow-sm hover:shadow-primary/20",
        false: "",
      },
      withGlow: {
        true: "after:absolute after:inset-0 after:rounded-lg after:opacity-40 after:blur-xl after:bg-gradient-to-br after:from-primary/30 after:via-primary/5 after:to-transparent after:-z-10 after:content-['']",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      isInteractive: false,
      isHoverable: false,
      withGlow: false
    },
  }
);

export interface CardProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  isLoading?: boolean;
}

/**
 * Unified Card component that integrates with our theme system
 * This component serves as the single card implementation throughout the application
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant, 
    size, 
    isInteractive, 
    isHoverable, 
    withGlow,
    isLoading,
    children, 
    ...props 
  }, ref) => {
    const { isDarkMode } = useTheme();
    
    return (
      <div
        ref={ref}
        className={cn(
          "relative",
          cardVariants({ variant, size, isInteractive, isHoverable, withGlow }),
          isDarkMode && variant === "outlined" && "border-gray-700",
          isLoading && "animate-pulse",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-4 pt-0", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-4 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants };