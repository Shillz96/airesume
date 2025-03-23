import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { getThemeVar, getCosmicColor } from '@/lib/theme-utils';

interface CosmicStarfieldProps {
  starsCount?: number;
  nebulasCount?: number;
  shootingStarsEnabled?: boolean;
  className?: string;
}

/**
 * CosmicStarfield component creates an animated starfield background
 * with nebulas and shooting stars, leveraging our theme variables
 * Now using memoization to prevent background regeneration on re-renders
 */
export default function CosmicStarfield({
  starsCount = 100,
  nebulasCount = 3,
  shootingStarsEnabled = true,
  className
}: CosmicStarfieldProps) {
  // Generate stars with memoization to prevent re-generation on every render
  const stars = useMemo(() => {
    return Array.from({ length: starsCount }).map((_, i) => {
      const size = Math.random() * 2;
      const opacity = Math.random() * 0.7 + 0.3;
      const animationDelay = Math.random() * 5;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      
      return (
        <div
          key={`star-${i}`}
          className="absolute rounded-full bg-white"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            opacity,
            top: `${y}%`,
            left: `${x}%`,
            animation: `twinkle 5s infinite ease-in-out`,
            animationDelay: `${animationDelay}s`
          }}
        />
      );
    });
  }, [starsCount]);
  
  // Generate nebulas with memoization
  const nebulas = useMemo(() => {
    // Get primary color from theme for nebula coloring
    const primaryColor = getThemeVar('primary');
    
    return Array.from({ length: nebulasCount }).map((_, i) => {
      const size = 30 + Math.random() * 50;
      const opacity = 0.1 + Math.random() * 0.15;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const hue = Math.random() * 60 - 30; // Random hue variation
      
      // Use theme colors for nebula
      const color1 = primaryColor; 
      const color2 = getCosmicColor('cosmic-accent') || '#9055FF';
      const color3 = getCosmicColor('cosmic-highlight') || '#5D8EFF';
      
      // Create gradient based on theme
      const gradient = Math.random() > 0.5 
        ? `radial-gradient(circle, ${color1} 0%, ${color2} 50%, transparent 100%)`
        : `radial-gradient(circle, ${color3} 0%, ${color1} 60%, transparent 100%)`;
      
      return (
        <div
          key={`nebula-${i}`}
          className="absolute rounded-full"
          style={{
            width: `${size}vw`,
            height: `${size}vw`,
            opacity,
            top: `${y}%`,
            left: `${x}%`,
            background: gradient,
            filter: 'blur(40px)',
            animation: 'nebula-drift 100s infinite alternate ease-in-out',
            animationDelay: `${-i * 20}s`
          }}
        />
      );
    });
  }, [nebulasCount]);
  
  // Generate shooting stars
  const shootingStars = useMemo(() => {
    if (!shootingStarsEnabled) return null;
    
    return (
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => {
          const delay = 3 + Math.random() * 10;
          const duration = 1 + Math.random();
          const top = Math.random() * 70;
          const left = Math.random() * 30;
          const size = 100 + Math.random() * 150;
          
          return (
            <div
              key={`shooting-${i}`}
              className="absolute h-px bg-gradient-to-r from-transparent via-white to-transparent"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                width: `${size}px`,
                transform: 'rotate(-45deg)',
                animation: `shooting ${duration}s ${delay}s infinite linear`,
              }}
            />
          );
        })}
      </div>
    );
  }, [shootingStarsEnabled]);
  
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <div className="relative w-full h-full">
        {stars}
        {nebulas}
        {shootingStars}
      </div>
    </div>
  );
}