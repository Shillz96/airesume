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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 relative z-10">
      <div className="cosmic-section-header">
        <h1 className="text-3xl font-bold tracking-tight cosmic-text-gradient">{title}</h1>
        {subtitle && (
          <p className="text-blue-100/80 mt-1">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="mt-4 sm:mt-0 flex-shrink-0 space-x-2">
          {actions}
        </div>
      )}
    </div>
  );
}