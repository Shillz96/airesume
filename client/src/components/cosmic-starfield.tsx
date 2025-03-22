import React, { useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface CosmicStarfieldProps {
  starsCount?: number;
  nebulasCount?: number;
  shootingStarsEnabled?: boolean;
  className?: string;
}

/**
 * CosmicStarfield component creates an animated starfield background
 * with nebulas and shooting stars, leveraging our theme variables
 */
export default function CosmicStarfield({
  starsCount = 150,
  nebulasCount = 3,
  shootingStarsEnabled = true,
  className = ''
}: CosmicStarfieldProps) {
  const { isDarkMode, currentTheme } = useTheme();
  const starfieldRef = useRef<HTMLDivElement>(null);
  
  // Create nebula configurations
  const nebulas = Array.from({ length: nebulasCount }).map((_, i) => {
    const size = Math.random() * 30 + 20; // 20-50% size
    const top = Math.random() * 80; // 0-80% from top
    const left = Math.random() * 80; // 0-80% from left
    const opacity = Math.random() * 0.1 + 0.1; // 0.1-0.2 opacity
    const duration = Math.random() * 10 + 15; // 15-25s animation duration
    const delay = Math.random() * 5; // 0-5s delay
    const hue = Math.random() * 60 - 30; // -30 to +30 hue shift from primary color
    
    return { size, top, left, opacity, duration, delay, hue };
  });
  
  // Set up shooting star effect
  useEffect(() => {
    if (!shootingStarsEnabled || !starfieldRef.current) return;
    
    const starfield = starfieldRef.current;
    
    const createShootingStar = () => {
      const star = document.createElement('div');
      star.className = 'cosmic-shooting-star';
      
      // Randomize position and angle for more natural appearance
      const startX = Math.random() * 100;
      const startY = Math.random() * 50; // Keep in top half
      const angle = Math.random() * 60 - 30; // Between -30 and +30 degrees
      
      star.style.setProperty('--angle', `${angle}deg`);
      star.style.top = `${startY}%`;
      star.style.left = `${startX}%`;
      
      starfield.appendChild(star);
      
      // Remove the star after animation completes
      setTimeout(() => {
        if (star.parentNode === starfield) {
          starfield.removeChild(star);
        }
      }, 1500); // Match animation duration
    };
    
    // Create shooting stars at random intervals
    const interval = setInterval(() => {
      if (Math.random() > 0.3) { // 70% chance to create a shooting star
        createShootingStar();
      }
    }, Math.random() * 3000 + 2000); // Between 2 and 5 seconds
    
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [shootingStarsEnabled]);
  
  return (
    <div 
      ref={starfieldRef} 
      className={`cosmic-starfield absolute inset-0 overflow-hidden z-0 pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Static Stars */}
      {Array.from({ length: starsCount }).map((_, i) => {
        const size = Math.random() * 2 + 1; // 1-3px
        const top = Math.random() * 100; // 0-100%
        const left = Math.random() * 100; // 0-100%
        const opacity = Math.random() * 0.7 + 0.3; // 0.3-1.0
        const duration = Math.random() * 4 + 2; // 2-6s
        const delay = Math.random() * 5; // 0-5s
        
        return (
          <div
            key={i}
            className="cosmic-star absolute bg-white rounded-full"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              top: `${top}%`,
              left: `${left}%`,
              opacity,
              boxShadow: '0 0 4px rgba(255,255,255,0.3)',
              '--twinkle-duration': `${duration}s`,
              '--twinkle-delay': `${delay}s`,
            }}
          />
        );
      })}
      
      {/* Nebula Layers */}
      <div className="absolute inset-0 pointer-events-none">
        {nebulas.map((nebula, i) => (
          <div 
            key={i}
            className="cosmic-nebula absolute rounded-full filter blur-3xl"
            style={{
              width: `${nebula.size}%`,
              height: `${nebula.size}%`,
              top: `${nebula.top}%`,
              left: `${nebula.left}%`,
              opacity: nebula.opacity,
              animation: `cosmic-pulsate ${nebula.duration}s infinite ease-in-out ${nebula.delay}s`,
              background: `radial-gradient(circle, 
                rgba(var(--color-primary), 0.15) 0%, 
                rgba(var(--color-primary), 0) 70%)`,
              filter: `blur(30px) hue-rotate(${nebula.hue}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}