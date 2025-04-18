import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  variant?: 'default' | 'gradient' | 'cosmic';
  className?: string;
  borderStyle?: 'none' | 'subtle' | 'gradient';
}

/**
 * Standardized page header component with solid theme integration
 * 
 * This component provides consistent styling for all page headers throughout the application
 * and uses our unified theme system with glass/solid styling options.
 * 
 * @example
 * <PageHeader
 *   title="Dashboard"
 *   subtitle="Welcome back!"
 *   variant="gradient" 
 *   borderStyle="gradient"
 *   actions={<Button>New Item</Button>}
 * />
 */
export default function PageHeader({ 
  title, 
  subtitle, 
  actions, 
  variant = 'cosmic',
  className,
  borderStyle = 'gradient'
}: PageHeaderProps) {
  // Generate title classes based on variant
  const getTitleClasses = () => {
    switch (variant) {
      case 'gradient':
      case 'cosmic':
        return 'bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent';
      default:
        return 'text-foreground';
    }
  };

  // Generate border classes based on style
  const getBorderClasses = () => {
    switch (borderStyle) {
      case 'none':
        return '';
      case 'gradient':
        return 'border-b border-transparent bg-gradient-to-r from-transparent via-primary/20 to-transparent bg-[length:100%_1px] bg-bottom bg-no-repeat pb-4';
      case 'subtle':
      default:
        return 'border-b border-white/10 pb-4';
    }
  };

  return (
    <header className={cn("mb-6 px-4 py-5 solid-card rounded-lg", className)}>
      <div className={cn(
        "flex flex-col sm:flex-row items-start sm:items-center justify-between", 
        getBorderClasses()
      )}>
        <div className="no-blur">
          {typeof title === 'string' ? (
            <h1 className={cn("text-3xl font-bold", getTitleClasses())}>
              {title}
            </h1>
          ) : (
            title
          )}
          {subtitle && (
            <div className="mt-2 text-muted-foreground">
              {typeof subtitle === 'string' ? subtitle : subtitle}
            </div>
          )}
        </div>
        {actions && (
          <div className="flex gap-2 mt-4 sm:mt-0">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}