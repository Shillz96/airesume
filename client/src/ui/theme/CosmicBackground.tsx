import React, { useState, useEffect, useRef, memo } from 'react';
import { useUnifiedTheme } from '@/contexts/UnifiedThemeContext';

/**
 * Enhanced CosmicBackground component
 * Creates a more immersive, dynamic starfield with animated nebula effects and parallax
 * Optimized with memoization to prevent re-renders and flickering when state changes
 * 
 * Properly integrated with the unified theme system for consistent styling
 */
function CosmicBackgroundComponent() {
  const { isDarkMode, config } = useUnifiedTheme();
  const [starsGenerated, setStarsGenerated] = useState(false);
  const backgroundRef = useRef<HTMLDivElement>(null);
  
  // Generate stars and nebulae only once on mount to avoid layout thrashing
  useEffect(() => {
    if (starsGenerated || !backgroundRef.current) return;
    
    // Get container dimensions
    const container = backgroundRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight * 1.5; // Extended coverage for parallax
    
    // Star generation function with improved distribution and varied sizes
    const generateStars = () => {
      const starCount = Math.min(width * height / 800, 1200); // More stars for denser field
      let starsHtml = '';
      
      // Create 3 distinct star layers for parallax effect
      for (let layer = 1; layer <= 3; layer++) {
        const layerStars = Math.floor(starCount / 3);
        const layerClass = `star-layer-${layer}`;
        
        for (let i = 0; i < layerStars; i++) {
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          const size = (0.5 + Math.random() * 2) * (1 + (layer * 0.2)); // Larger stars in front layers
          const opacity = 0.3 + Math.random() * 0.7;
          const blurAmount = layer === 1 ? '0px' : layer === 2 ? '0.5px' : '0px';
          const glowIntensity = layer === 1 ? '0 0 2px rgba(255,255,255,0.3)' : 'none';
          
          // Randomize colors for some stars
          const isColoredStar = Math.random() > 0.8;
          let starColor = 'rgba(255,255,255,1)';
          
          if (isColoredStar) {
            // Extract RGB from theme primary color
            const primaryColor = config.primaryColor;
            const secondaryColor = config.secondaryColor;
            const starColors = [
              'rgba(255,255,255,1)', // White
              'rgba(255,235,150,1)', // Yellowish
              'rgba(200,230,255,1)', // Blueish
              primaryColor,
              secondaryColor
            ];
            starColor = starColors[Math.floor(Math.random() * starColors.length)];
          }
          
          const animDuration = 2 + Math.random() * 8;
          const animDelay = Math.random() * 5;
          
          starsHtml += `<div class="star ${layerClass}" style="
            left: ${x}%;
            top: ${y}%;
            width: ${size}px;
            height: ${size}px;
            opacity: ${opacity};
            background-color: ${starColor};
            filter: blur(${blurAmount});
            box-shadow: ${glowIntensity};
            animation-duration: ${animDuration}s;
            animation-delay: ${animDelay}s;
          "></div>`;
        }
      }
      
      return starsHtml;
    };
    
    // Enhanced nebulae generation with more depth and theme colors
    const generateNebulae = () => {
      const nebulaCount = 5; // More nebulae for more atmosphere
      let nebulaeHtml = '';
      
      // Use theme colors for nebulae
      const { primaryColor, secondaryColor } = config;
      
      // Convert hex to rgba
      const hexToRgba = (hex: string, alpha: number) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return `rgba(99, 102, 241, ${alpha})`;
        const r = parseInt(result[1], 16);
        const g = parseInt(result[2], 16);
        const b = parseInt(result[3], 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      };
      
      // Define nebula colors from theme with more opacity variations
      const nebulaColors = [
        hexToRgba(primaryColor, 0.04),
        hexToRgba(secondaryColor, 0.03),
        hexToRgba(primaryColor, 0.025),
        hexToRgba(secondaryColor, 0.035),
        'rgba(10, 10, 40, 0.02)'
      ];
      
      for (let i = 0; i < nebulaCount; i++) {
        const x = 10 + Math.random() * 80;
        const y = 10 + Math.random() * 80;
        const scale = 0.8 + Math.random() * 1.5;
        const rotation = Math.random() * 360;
        const color = nebulaColors[i % nebulaColors.length];
        const animDuration = 80 + Math.random() * 40;
        const animDelay = Math.random() * 10;
        
        // Create more complex nebula with multiple layers
        const blurAmount = 70 + Math.random() * 30;
        
        nebulaeHtml += `<div class="nebula" style="
          left: ${x}%;
          top: ${y}%;
          transform: scale(${scale}) rotate(${rotation}deg);
          background: radial-gradient(ellipse at center, ${color} 0%, transparent ${blurAmount}%);
          width: 60%;
          height: 60%;
          filter: blur(${10 + Math.random() * 20}px);
          animation-duration: ${animDuration}s;
          animation-delay: ${animDelay}s;
          z-index: ${Math.floor(Math.random() * 3) - 2};
        "></div>`;
      }
      
      return nebulaeHtml;
    };
    
    // Add stars that flicker more dramatically for emphasis
    const generatePulsars = () => {
      const pulsarCount = 5;
      let pulsarsHtml = '';
      
      for (let i = 0; i < pulsarCount; i++) {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = 2 + Math.random() * 2;
        const color = config.primaryColor;
        
        pulsarsHtml += `<div class="pulsar" style="
          left: ${x}%;
          top: ${y}%;
          width: ${size}px;
          height: ${size}px;
          background-color: ${color};
        "></div>`;
      }
      
      return pulsarsHtml;
    };
    
    // Add generated HTML to the container
    container.innerHTML = generateStars() + generateNebulae() + generatePulsars();
    setStarsGenerated(true);
    
    // Add shooting stars at random intervals
    const shootingStarsInterval = setInterval(() => {
      if (!backgroundRef.current) return;
      
      const shootingStar = document.createElement('div');
      shootingStar.className = 'shooting-star';
      
      // Random position and animation
      const startX = Math.random() * 100;
      const startY = Math.random() * 40; // Start from top section
      const angle = 20 + Math.random() * 50;
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
    }, 4000);
    
    // Optional: Add interactive parallax effect based on mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      if (!backgroundRef.current) return;
      
      const moveX = (e.clientX - window.innerWidth / 2) / 50;
      const moveY = (e.clientY - window.innerHeight / 2) / 50;
      
      // Apply different parallax speeds to each star layer
      const layers = backgroundRef.current.querySelectorAll('.star-layer-1, .star-layer-2, .star-layer-3');
      
      layers.forEach((layer) => {
        const element = layer as HTMLElement;
        if (element.classList.contains('star-layer-1')) {
          element.style.transform = `translate(${moveX * 0.5}px, ${moveY * 0.5}px)`;
        } else if (element.classList.contains('star-layer-2')) {
          element.style.transform = `translate(${moveX * 1}px, ${moveY * 1}px)`;
        } else if (element.classList.contains('star-layer-3')) {
          element.style.transform = `translate(${moveX * 2}px, ${moveY * 2}px)`;
        }
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearInterval(shootingStarsInterval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [starsGenerated, config]);
  
  // CSS class based on theme mode
  const themeClass = isDarkMode ? 'cosmic-dark' : 'cosmic-light';
  
  return (
    <div className={`cosmic-background ${themeClass}`}>
      <div className="star-container" ref={backgroundRef}></div>
      
      {/* Enhanced overlay gradients for depth and atmosphere */}
      <div className="cosmic-overlay cosmic-overlay-base"></div>
      <div className="cosmic-overlay cosmic-overlay-accent"></div>
      
      {/* Vignette effect */}
      <div className="cosmic-vignette"></div>
    </div>
  );
}

// Use memo to prevent unnecessary re-renders
const CosmicBackground = memo(CosmicBackgroundComponent);

export default CosmicBackground;