import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * Select styles with consistent cosmic theme
 */
const selectVariants = cva(
  "flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-8",
  {
    variants: {
      variant: {
        default: "border-white/10 focus-visible:border-primary/50",
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

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectVariants> {
  options?: Array<{ value: string; label: string }>;
}

/**
 * UnifiedSelect component with consistent styling
 * Following the JobSearchProgress styling as the reference standard
 */
export const UnifiedSelect = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant, glow, options, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(selectVariants({ variant, glow, className }))}
          {...props}
        >
          {options
            ? options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))
            : children}
        </select>
        <span className="absolute right-3 top-2.5 pointer-events-none">
          <ChevronDown className="h-4 w-4 opacity-50" />
        </span>
      </div>
    );
  }
);

UnifiedSelect.displayName = "UnifiedSelect";

export interface SelectOptionProps
  extends React.OptionHTMLAttributes<HTMLOptionElement> {
  value: string;
  children: React.ReactNode;
}

/**
 * UnifiedSelectOption component
 */
export const UnifiedSelectOption = forwardRef<HTMLOptionElement, SelectOptionProps>(
  ({ value, children, ...props }, ref) => {
    return (
      <option ref={ref} value={value} {...props}>
        {children}
      </option>
    );
  }
);

UnifiedSelectOption.displayName = "UnifiedSelectOption";

// Export a convenience object
export const Select = {
  Root: UnifiedSelect,
  Option: UnifiedSelectOption,
};

export default {
  Select: UnifiedSelect,
  Option: UnifiedSelectOption,
};