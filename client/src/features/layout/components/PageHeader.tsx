import React from "react";

interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}

/**
 * Standardized page header component to ensure consistent spacing and styling across all pages
 * This component is used at the top of each page to display the page title and optional actions
 * 
 * Updated to use our simplified CSS approach with class names from our unified theme
 */
export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-white/10">
        <div>
          {typeof title === 'string' ? (
            <h1 className="text-3xl font-bold">{title}</h1>
          ) : (
            title
          )}
          {subtitle && (
            <div className="page-header-subtitle mt-2">
              {typeof subtitle === 'string' ? subtitle : subtitle}
            </div>
          )}
        </div>
        {actions && (
          <div className="page-header-actions mt-4 sm:mt-0">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}