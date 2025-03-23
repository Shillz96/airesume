import React from 'react';
import { Loader2 } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Card variant styles using class-variance-authority for theme consistency
const cardVariants = cva(
  "rounded-lg overflow-hidden transition-all relative transform-gpu", 
  {
    variants: {
      variant: {
        default: "bg-card border border-border hover:border-border/80",
        primary: "bg-primary/5 border border-primary/20 hover:border-primary/30",
        destructive: "bg-destructive/5 border border-destructive/20 hover:border-destructive/30",
        outline: "bg-transparent border border-border hover:border-border/80",
        ghost: "bg-transparent border-none hover:bg-muted/50",
        cosmic: "bg-black/40 backdrop-blur-md border border-white/10 hover:border-white/20",
        gradient: "cosmic-card-gradient bg-card/80 backdrop-blur-sm border-none",
      },
      size: {
        sm: "p-[var(--card-padding-sm)]",
        md: "p-[var(--card-padding)]",
        lg: "p-[var(--card-padding-lg)]",
      },
      glow: {
        none: "",
        subtle: "shadow-md",
        primary: "shadow-md shadow-primary/10 hover:shadow-primary/20",
        cosmic: "shadow-lg shadow-primary/20 hover:shadow-primary/30",
        gradient: "shadow-xl cosmic-glow",
      },
      border: {
        none: "",
        subtle: "border border-border hover:border-border/80",
        primary: "border border-primary/20 hover:border-primary/40",
        gradient: "cosmic-gradient-border",
        animated: "cosmic-animated-border",
      },
      animation: {
        none: "",
        hover: "hover:-translate-y-1 hover:scale-[1.01]",
        float: "cosmic-card-float",
        pulse: "cosmic-card-pulse",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      glow: "none",
      border: "none",
      animation: "none"
    }
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
export function Card({
  variant,
  size,
  glow,
  border,
  animation,
  className,
  isLoading = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        cardVariants({ variant, size, glow, border, animation }),
        className,
        isLoading && "relative"
      )}
      {...props}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      <div className={cn(isLoading && "opacity-50")}>
        {children}
      </div>
    </div>
  );
}

/**
 * Card header component
 */
export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mb-4", className)}
      {...props}
    />
  );
}

/**
 * Card title component
 */
export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-semibold text-foreground", className)}
      {...props}
    />
  );
}

/**
 * Card description component
 */
export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

/**
 * Card content component
 */
export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("", className)}
      {...props}
    />
  );
}

/**
 * Card footer component
 */
export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-4 pt-4 border-t border-border flex items-center", className)}
      {...props}
    />
  );
}