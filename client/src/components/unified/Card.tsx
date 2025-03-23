import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface UnifiedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: "none" | "subtle" | "medium" | "strong";
  gradient?: "none" | "border" | "bg";
}

/**
 * UnifiedCard component following the JobSearchProgress styling as the reference standard.
 * Provides consistent styling for all card-based components in the application.
 */
export const UnifiedCard = forwardRef<HTMLDivElement, UnifiedCardProps>(
  ({ children, className, glow = "subtle", gradient = "none", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "cosmic-card overflow-hidden border border-white/10 bg-black/30",
          {
            "shadow-[0_0_15px_rgba(59,130,246,0.1)]": glow === "subtle",
            "shadow-[0_0_25px_rgba(59,130,246,0.15)]": glow === "medium",
            "shadow-[0_0_35px_rgba(59,130,246,0.25)]": glow === "strong",
            "border-gradient-to-r border-from-blue-500 border-to-purple-500": gradient === "border",
            "bg-gradient-to-r from-blue-900/20 to-purple-900/20": gradient === "bg",
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

UnifiedCard.displayName = "UnifiedCard";

export interface UnifiedCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  border?: "none" | "subtle" | "gradient";
}

/**
 * UnifiedCardHeader with consistent styling
 */
export const UnifiedCardHeader = forwardRef<HTMLDivElement, UnifiedCardHeaderProps>(
  ({ children, className, border = "none", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "pb-3",
          {
            "border-b border-white/5": border === "subtle",
            "border-b border-gradient-to-r border-from-blue-500/20 border-to-purple-500/20": border === "gradient",
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

UnifiedCardHeader.displayName = "UnifiedCardHeader";

export interface UnifiedCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

/**
 * UnifiedCardTitle with consistent styling
 */
export const UnifiedCardTitle = forwardRef<HTMLHeadingElement, UnifiedCardTitleProps>(
  ({ children, className, gradient = false, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn(
          "text-xl text-white",
          {
            "bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400": gradient,
          },
          className
        )}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

UnifiedCardTitle.displayName = "UnifiedCardTitle";

export interface UnifiedCardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * UnifiedCardDescription with consistent styling
 */
export const UnifiedCardDescription = forwardRef<HTMLParagraphElement, UnifiedCardDescriptionProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          "text-gray-300",
          className
        )}
        {...props}
      >
        {children}
      </p>
    );
  }
);

UnifiedCardDescription.displayName = "UnifiedCardDescription";

export interface UnifiedCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * UnifiedCardContent with consistent styling
 */
export const UnifiedCardContent = forwardRef<HTMLDivElement, UnifiedCardContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "p-6",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

UnifiedCardContent.displayName = "UnifiedCardContent";

export interface UnifiedCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * UnifiedCardFooter with consistent styling
 */
export const UnifiedCardFooter = forwardRef<HTMLDivElement, UnifiedCardFooterProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "p-6 pt-0",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

UnifiedCardFooter.displayName = "UnifiedCardFooter";

// Export a convenience object for easy imports
export const Card = {
  Root: UnifiedCard,
  Header: UnifiedCardHeader,
  Title: UnifiedCardTitle,
  Description: UnifiedCardDescription,
  Content: UnifiedCardContent,
  Footer: UnifiedCardFooter,
};

export default Card;