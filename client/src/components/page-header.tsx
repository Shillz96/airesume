import React from "react";

interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}

/**
 * Standardized page header component to ensure consistent spacing and styling across all pages
 */
export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-border">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm sm:text-base text-foreground/60">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="mt-4 sm:mt-0 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}