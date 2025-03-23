import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * Input styles with consistent cosmic theme
 */
const inputVariants = cva(
  "flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-white/10 focus-visible:border-blue-500/50",
        error: "border-red-500/50 focus-visible:border-red-500",
      },
      glow: {
        none: "",
        focus: "focus-visible:shadow-[0_0_15px_rgba(59,130,246,0.2)]",
      },
    },
    defaultVariants: {
      variant: "default",
      glow: "focus",
    },
  }
);

/**
 * Textarea styles with consistent cosmic theme
 */
const textareaVariants = cva(
  "flex min-h-[120px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-white/10 focus-visible:border-blue-500/50",
        error: "border-red-500/50 focus-visible:border-red-500",
      },
      glow: {
        none: "",
        focus: "focus-visible:shadow-[0_0_15px_rgba(59,130,246,0.2)]",
      },
    },
    defaultVariants: {
      variant: "default",
      glow: "focus",
    },
  }
);

/**
 * Label styles with consistent cosmic theme
 */
const labelVariants = cva(
  "text-sm font-medium leading-none mb-2 block peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "text-white",
        muted: "text-gray-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

/**
 * UnifiedInput component with consistent styling
 * Following the JobSearchProgress styling as the reference standard
 */
export const UnifiedInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, glow, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(inputVariants({ variant, glow, className }))}
        {...props}
      />
    );
  }
);
UnifiedInput.displayName = "UnifiedInput";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

/**
 * UnifiedTextarea component with consistent styling
 * Following the JobSearchProgress styling as the reference standard
 */
export const UnifiedTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, glow, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(textareaVariants({ variant, glow, className }))}
        {...props}
      />
    );
  }
);
UnifiedTextarea.displayName = "UnifiedTextarea";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {}

/**
 * UnifiedLabel component with consistent styling
 * Following the JobSearchProgress styling as the reference standard
 */
export const UnifiedLabel = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(labelVariants({ variant, className }))}
        {...props}
      />
    );
  }
);
UnifiedLabel.displayName = "UnifiedLabel";

// Export convenience objects
export const Input = {
  Root: UnifiedInput,
  Label: UnifiedLabel,
};

export const Textarea = {
  Root: UnifiedTextarea,
  Label: UnifiedLabel,
};

export default {
  Input: UnifiedInput,
  Textarea: UnifiedTextarea,
  Label: UnifiedLabel,
};