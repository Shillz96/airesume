import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

/**
 * Unified Card Component
 * 
 * This component replaces all previous card implementations with a single,
 * consistent component that integrates with our unified theme system.
 * 
 * Features:
 * - Standardized styling across the application
 * - Multiple variants for different visual styles
 * - Loading state support
 * - Consistent spacing and layout
 */

// Define card variants
const cardVariants = cva(
  // Base styles for all cards
  "rounded-lg border border-border bg-card text-card-foreground transition-all duration-200",
  {
    variants: {
      variant: {
        default: "shadow-sm",
        outline: "border border-border bg-transparent",
        filled: "bg-card border-none",
        elevated: "shadow-md hover:shadow-lg",
        // Cosmic-specific variants
        cosmic: "border-primary/20 backdrop-blur-sm bg-card/80 hover:border-primary/40",
        "cosmic-glow": "border-primary/30 shadow-[0_0_15px_rgba(var(--primary-rgb),0.15)] hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] hover:border-primary/50",
        gradient: "border-0 bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm",
      },
      hover: {
        true: "hover:border-primary/30 hover:bg-card/90",
        false: "",
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        default: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      hover: true,
      padding: "default",
    },
  }
);

// Card props interface
export interface UnifiedCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  isLoading?: boolean;
}

// Card component
export const UnifiedCard = React.forwardRef<HTMLDivElement, UnifiedCardProps>(
  (
    {
      className,
      variant,
      hover,
      padding,
      isLoading = false,
      children,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, hover, padding, className }))}
      {...props}
    >
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        children
      )}
    </div>
  )
);

UnifiedCard.displayName = "UnifiedCard";

// Card Header component
export const UnifiedCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 pb-3", className)}
    {...props}
  />
));

UnifiedCardHeader.displayName = "UnifiedCardHeader";

// Card Title component
export const UnifiedCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));

UnifiedCardTitle.displayName = "UnifiedCardTitle";

// Card Description component
export const UnifiedCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));

UnifiedCardDescription.displayName = "UnifiedCardDescription";

// Card Content component
export const UnifiedCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-6 pt-0", className)}
    {...props}
  />
));

UnifiedCardContent.displayName = "UnifiedCardContent";

// Card Footer component
export const UnifiedCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0 gap-2", className)}
    {...props}
  />
));

UnifiedCardFooter.displayName = "UnifiedCardFooter";

export { cardVariants };