import React, { memo } from 'react';
import { cn } from '@/lib/utils';

interface BackgroundProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'gradient' | 'subtle';
}

/**
 * Modern background component with clean, subtle design
 * Optimized with memoization to prevent re-renders
 */
const Background = memo(({ className, children, variant = 'default' }: BackgroundProps) => {
  // Define variant styles
  const variantStyles = {
    default: 'bg-background',
    gradient: 'bg-gradient-to-b from-background to-background/80',
    subtle: 'bg-background/95 backdrop-blur-sm'
  };

  // Optional subtle grid overlay for depth
  const gridOverlay = (
    <div 
      className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" 
      style={{ 
        backgroundSize: '30px 30px',
        backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)'
      }}
      aria-hidden="true"
    />
  );

  // Optional subtle gradient accent in the corner
  const accentGradient = (
    <div 
      className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-radial from-primary/20 to-transparent opacity-50 blur-3xl pointer-events-none" 
      aria-hidden="true"
    />
  );

  return (
    <div className={cn('relative min-h-screen w-full overflow-hidden', variantStyles[variant], className)}>
      {gridOverlay}
      {variant !== 'default' && accentGradient}
      {children}
    </div>
  );
});

Background.displayName = 'Background';

export default Background;