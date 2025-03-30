import React from 'react';
import { cn } from '@/lib/utils';

interface PageBannerProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  gradient?: boolean;
  className?: string;
}

/**
 * PageBanner component
 * A prominent header banner for page titles with optional icon, subtitle and action button
 * Uses the solid-card style for consistent UI experience
 */
export default function PageBanner({
  title,
  subtitle,
  icon,
  action,
  gradient = true,
  className
}: PageBannerProps) {
  return (
    <div className={cn(
      "solid-card mb-6 rounded-lg shadow-lg",
      gradient ? "bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-blue-600/10" : "bg-white/80 dark:bg-gray-900/80",
      "overflow-hidden",
      className
    )}>
      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex-shrink-0 p-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                {icon}
              </div>
            )}
            <div>
              {typeof title === 'string' ? (
                <h1 className={cn(
                  "text-3xl font-bold no-blur", 
                  gradient && "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                )}>
                  {title}
                </h1>
              ) : (
                title
              )}
              {subtitle && (
                <div className="mt-2 text-muted-foreground no-blur">
                  {typeof subtitle === 'string' ? subtitle : subtitle}
                </div>
              )}
            </div>
          </div>
          
          {action && (
            <div className="mt-3 sm:mt-0">
              {action}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 