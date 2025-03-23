import React, { useState, useEffect, useRef, memo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { getCosmicColor } from '@/lib/theme-utils';

/**
 * CosmicBackground component
 * Creates a dynamic starfield with animated nebula effects using CSS animations
 * Optimized with memoization to prevent re-renders and flickering when state changes
 * 
 * Properly integrated with the theme system for consistent styling across the application
 */
function CosmicBackgroundComponent() {
  const { isDarkMode } = useTheme();
  const [starsGenerated, setStarsGenerated] = useState(false);
  const backgroundRef = useRef<HTMLDivElement>(null);
  
  // Generate stars and nebulae only once on mount to avoid layout thrashing
  useEffect(() => {
    if (starsGenerated || !backgroundRef.current) return;
    
    // Get container dimensions
    const container = backgroundRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight * 1.2; // Extend past viewport to ensure coverage
    
    // Star generation function
    const generateStars = () => {
      const starCount = Math.min(width * height / 1000, 1000); // Responsive star count
      let starsHtml = '';
      
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 2;
        const opacity = 0.2 + Math.random() * 0.8;
        const animDuration = 2 + Math.random() * 8;
        const animDelay = Math.random() * 5;
        
        starsHtml += `<div class="star" style="
          left: ${x}%;
          top: ${y}%;
          width: ${size}px;
          height: ${size}px;
          opacity: ${opacity};
          animation-duration: ${animDuration}s;
          animation-delay: ${animDelay}s;
        "></div>`;
      }
      
      return starsHtml;
    };
    
    // Nebulae generation function
    const generateNebulae = () => {
      const nebulaCount = 3;
      let nebulaeHtml = '';
      
      // Get theme colors for nebulae
      const primaryColor = getCosmicColor('primary');
      const accentColor = getCosmicColor('accent');
      const tertiaryColor = getCosmicColor('muted');
      
      // Define nebula colors from theme
      const nebulaColors = [
        `rgba(${hexToRgb(primaryColor)?.r || 63}, ${hexToRgb(primaryColor)?.g || 81}, ${hexToRgb(primaryColor)?.b || 181}, 0.03)`,
        `rgba(${hexToRgb(accentColor)?.r || 113}, ${hexToRgb(accentColor)?.g || 47}, ${hexToRgb(accentColor)?.b || 173}, 0.02)`,
        `rgba(${hexToRgb(tertiaryColor)?.r || 3}, ${hexToRgb(tertiaryColor)?.g || 152}, ${hexToRgb(tertiaryColor)?.b || 158}, 0.015)`
      ];
      
      for (let i = 0; i < nebulaCount; i++) {
        const x = 10 + Math.random() * 80;
        const y = 10 + Math.random() * 80;
        const scale = 0.8 + Math.random() * 1.2;
        const rotation = Math.random() * 360;
        const color = nebulaColors[i % nebulaColors.length];
        const animDuration = 80 + Math.random() * 40;
        const animDelay = Math.random() * 10;
        
        nebulaeHtml += `<div class="nebula" style="
          left: ${x}%;
          top: ${y}%;
          transform: scale(${scale}) rotate(${rotation}deg);
          background: radial-gradient(circle at center, ${color} 0%, transparent 70%);
          width: 50%;
          height: 50%;
          animation-duration: ${animDuration}s;
          animation-delay: ${animDelay}s;
        "></div>`;
      }
      
      return nebulaeHtml;
    };
    
    // Add generated HTML to the container
    container.innerHTML = generateStars() + generateNebulae();
    setStarsGenerated(true);
    
    // Add shooting stars at random intervals
    const shootingStarsInterval = setInterval(() => {
      if (!backgroundRef.current) return;
      
      const shootingStar = document.createElement('div');
      shootingStar.className = 'shooting-star';
      
      // Random position and animation
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const angle = Math.random() * 45;
      const length = 100 + Math.random() * 150;
      
      shootingStar.style.left = `${startX}%`;
      shootingStar.style.top = `${startY}%`;
      shootingStar.style.transform = `rotate(${angle}deg)`;
      shootingStar.style.width = `${length}px`;
      
      backgroundRef.current.appendChild(shootingStar);
      
      // Remove shooting star after animation completes
      setTimeout(() => {
        if (shootingStar.parentNode) {
          shootingStar.parentNode.removeChild(shootingStar);
        }
      }, 1000);
    }, 5000);
    
    return () => {
      clearInterval(shootingStarsInterval);
    };
  }, [starsGenerated]);
  
  // CSS class based on theme mode
  const themeClass = isDarkMode ? 'cosmic-dark' : 'cosmic-light';
  
  return (
    <div className={`cosmic-background ${themeClass}`}>
      <div className="star-container" ref={backgroundRef}></div>
      
      {/* Overlay gradients for atmosphere */}
      <div className="cosmic-overlay"></div>
      
      {/* Styles are moved to CSS classes in index.css for proper compatibility */}
    </div>
  );
}

// Helper function to convert HEX to RGB
function hexToRgb(hex: string) {
  // Default fallback color if parsing fails
  if (!hex || typeof hex !== 'string') return { r: 100, g: 149, b: 237 };
  
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse hex value
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  
  return { r, g, b };
}

// Use memo to prevent unnecessary re-renders
const CosmicBackground = memo(CosmicBackgroundComponent);

export default CosmicBackground;