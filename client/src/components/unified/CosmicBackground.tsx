import React, { useMemo } from 'react';
import { useUnifiedTheme } from '@/contexts/UnifiedThemeContext';
import { cn } from '@/lib/utils';

/**
 * Unified CosmicBackground Component
 * 
 * This component creates a dynamic starfield background with cosmic theme elements.
 * It's optimized with memoization to prevent re-renders when state changes.
 * 
 * Features:
 * - Dynamic starfield effect with twinkling stars
 * - Subtle nebula-like gradients
 * - Optional shooting stars
 * - Integrated with the theme system
 * - Performance optimized
 */

interface CosmicBackgroundProps {
  starsCount?: number;
  nebulaEffect?: boolean;
  shootingStars?: boolean;
  className?: string;
}

export function CosmicBackground({
  starsCount = 100,
  nebulaEffect = true,
  shootingStars = true,
  className,
}: CosmicBackgroundProps) {
  const { config, isDarkMode } = useUnifiedTheme();
  
  // Only show full cosmic effects when in cosmic variant
  const isCosmicVariant = config.variant === 'cosmic';
  
  // Generate stars with memoization to prevent regeneration on re-renders
  const stars = useMemo(() => {
    // Don't generate stars if not using cosmic variant or in light mode
    if (!isCosmicVariant || !isDarkMode) return null;
    
    return Array.from({ length: starsCount }).map((_, i) => {
      const size = Math.random() * 2;
      const opacity = Math.random() * 0.7 + 0.3;
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const animationDelay = Math.random() * 10;
      
      return (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top: `${top}%`,
            left: `${left}%`,
            opacity,
            animationDelay: `${animationDelay}s`,
          }}
        />
      );
    });
  }, [starsCount, isCosmicVariant, isDarkMode]);
  
  // Only show shooting stars in cosmic variant
  const shootingStarsElements = useMemo(() => {
    if (!shootingStars || !isCosmicVariant || !isDarkMode) return null;
    
    return (
      <>
        <div className="absolute w-[1px] h-[50px] bg-white opacity-70 top-[15%] left-[25%] rotate-[35deg] animate-shooting-star" />
        <div className="absolute w-[1px] h-[30px] bg-white opacity-60 top-[40%] left-[85%] rotate-[20deg] animate-shooting-star-delayed" />
        <div className="absolute w-[1px] h-[40px] bg-white opacity-80 top-[65%] left-[10%] rotate-[40deg] animate-shooting-star-extra-delayed" />
      </>
    );
  }, [shootingStars, isCosmicVariant, isDarkMode]);
  
  // Nebula effect
  const nebulaEffects = useMemo(() => {
    if (!nebulaEffect || !isCosmicVariant || !isDarkMode) return null;
    
    return (
      <>
        <div 
          className="absolute opacity-20 rounded-full blur-3xl" 
          style={{
            background: `radial-gradient(circle at center, rgba(var(--primary-rgb), 0.3), transparent 70%)`,
            width: '30%',
            height: '30%',
            top: '15%',
            left: '15%',
          }}
        />
        <div 
          className="absolute opacity-10 rounded-full blur-3xl" 
          style={{
            background: `radial-gradient(circle at center, rgba(var(--secondary-rgb), 0.3), transparent 60%)`,
            width: '40%',
            height: '40%',
            bottom: '10%',
            right: '15%',
          }}
        />
      </>
    );
  }, [nebulaEffect, isCosmicVariant, isDarkMode]);
  
  // Don't render anything if not using cosmic variant or in light mode
  if (!isCosmicVariant) {
    return (
      <div 
        className={cn("fixed inset-0 z-[-1] bg-background", className)}
      />
    );
  }
  
  // Full cosmic background
  return (
    <div 
      className={cn(
        "fixed inset-0 z-[-1] overflow-hidden",
        isDarkMode ? "bg-gradient-to-b from-background to-[#0A1428]" : "bg-background",
        className
      )}
    >
      {stars}
      {shootingStarsElements}
      {nebulaEffects}
      
      {/* Star field base */}
      <div className="absolute inset-0 opacity-30" 
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 25% 25%, rgba(255, 255, 255, 0.2) 1px, transparent 0),
            radial-gradient(1px 1px at 50% 50%, rgba(255, 255, 255, 0.2) 1px, transparent 0),
            radial-gradient(1px 1px at 75% 75%, rgba(255, 255, 255, 0.2) 1px, transparent 0),
            radial-gradient(2px 2px at 10% 10%, rgba(var(--primary-rgb), 0.2) 1px, transparent 0),
            radial-gradient(2px 2px at 90% 20%, rgba(var(--secondary-rgb), 0.2) 1px, transparent 0)
          `,
          backgroundSize: '100px 100px, 120px 120px, 170px 170px, 150px 150px, 200px 200px',
        }} 
      />
    </div>
  );
}

export default React.memo(CosmicBackground);