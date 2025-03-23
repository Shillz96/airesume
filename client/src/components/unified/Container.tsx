import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * Container styles with consistent cosmic theme
 */
const containerVariants = cva(
  "w-full px-4 sm:px-6 lg:px-8 mx-auto",
  {
    variants: {
      maxWidth: {
        sm: "max-w-screen-sm",
        md: "max-w-screen-md",
        lg: "max-w-screen-lg",
        xl: "max-w-screen-xl",
        "2xl": "max-w-screen-2xl",
        full: "max-w-full",
      },
      paddingTop: {
        none: "pt-0",
        sm: "pt-4",
        md: "pt-6",
        lg: "pt-8",
        xl: "pt-12",
        navClear: "pt-16", // Clears the navbar
        negative: "-mt-4", // Negative margin to pull content up against navbar
      },
      paddingBottom: {
        none: "pb-0",
        sm: "pb-4",
        md: "pb-6",
        lg: "pb-8",
        xl: "pb-12",
      },
      spacing: {
        compact: "space-y-4",
        default: "space-y-6",
        relaxed: "space-y-8",
        none: "",
      },
    },
    defaultVariants: {
      maxWidth: "xl",
      paddingTop: "negative", // Default to ultra-compact layout with negative margin
      paddingBottom: "lg",
      spacing: "default",
    },
  }
);

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

/**
 * UnifiedContainer component with consistent spacing
 * This container provides consistent spacing across all pages
 * with an option for negative margins to create an ultra-compact layout
 */
export const UnifiedContainer = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, maxWidth, paddingTop, paddingBottom, spacing, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          containerVariants({ maxWidth, paddingTop, paddingBottom, spacing, className })
        )}
        {...props}
      />
    );
  }
);

UnifiedContainer.displayName = "UnifiedContainer";

export interface SectionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: "sm" | "md" | "lg" | "xl" | "none";
}

/**
 * UnifiedSection component with consistent spacing
 */
export const UnifiedSection = forwardRef<HTMLDivElement, SectionProps>(
  ({ className, spacing = "md", ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          "w-full",
          {
            "py-4": spacing === "sm",
            "py-6": spacing === "md",
            "py-8": spacing === "lg",
            "py-12": spacing === "xl",
            "py-0": spacing === "none",
          },
          className
        )}
        {...props}
      />
    );
  }
);

UnifiedSection.displayName = "UnifiedSection";

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
}

/**
 * UnifiedGrid component with consistent spacing
 */
export const UnifiedGrid = forwardRef<HTMLDivElement, GridProps>(
  ({ className, columns = 1, gap = "md", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid w-full",
          {
            "grid-cols-1": columns === 1,
            "grid-cols-1 md:grid-cols-2": columns === 2,
            "grid-cols-1 md:grid-cols-2 lg:grid-cols-3": columns === 3,
            "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4": columns === 4,
            "gap-3": gap === "sm",
            "gap-6": gap === "md", 
            "gap-8": gap === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

UnifiedGrid.displayName = "UnifiedGrid";

// Export convenience object
export const Layout = {
  Container: UnifiedContainer,
  Section: UnifiedSection,
  Grid: UnifiedGrid,
};

export default Layout;