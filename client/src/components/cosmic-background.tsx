import { useEffect, useState, useMemo, memo } from 'react';
import { isDarkMode } from '@/lib/theme-utils';

/**
 * CosmicBackground component
 * Creates a dynamic starfield with animated nebula effects using CSS animations
 * Optimized with memoization to prevent re-renders and flickering when state changes
 */
function CosmicBackgroundComponent() {
  const [isClient, setIsClient] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [starKey, setStarKey] = useState(0); // Used to force re-generation of stars only when theme changes

  // Create stars manually to ensure they're visible
  // Memoize the stars so they don't regenerate on every render
  const stars = useMemo(() => {
    if (!isClient) return [];
    
    const starsArray = [];
    const starCount = darkMode ? 200 : 150; // Increase star count for better distribution
    
    // True random values for natural star distribution
    for (let i = 0; i < starCount; i++) {
      // More variation in star sizes
      const size = Math.random() * 2.5 + 0.5;
      const opacity = Math.random() * 0.6 + 0.4;
      const animDuration = Math.random() * 5 + 2;
      const animDelay = Math.random() * 3;
      
      // Use truly random position across the entire viewport
      const top = Math.random() * 120 - 10; // Some stars slightly outside the viewport
      const left = Math.random() * 120 - 10; // For a more natural feel
      
      // Slight color variation for more realism
      const hue = Math.random() > 0.7 ? 
        Math.floor(Math.random() * 40) + 200 : // Occasional blue tint
        0; // Mostly white

      starsArray.push(
        <div
          key={`star-${i}-${starKey}`}
          className="star absolute rounded-full"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top: `${top}%`,
            left: `${left}%`,
            opacity: darkMode ? opacity : opacity * 0.6, // More translucent in light mode
            animation: `twinkle ${animDuration}s infinite ${animDelay}s`,
            background: darkMode 
              ? (hue === 0 ? 'white' : `hsl(${hue}, 100%, 90%)`) 
              : `rgba(59, 130, 246, ${opacity * 0.8})`, // Blue-tinted stars in light mode
            boxShadow: darkMode 
              ? `0 0 ${Math.floor(size * 2)}px rgba(255, 255, 255, 0.3)` 
              : `0 0 ${Math.floor(size * 2)}px rgba(59, 130, 246, 0.3)`,
          }}
        />
      );
    }
    return starsArray;
  }, [isClient, darkMode, starKey]); // Only regenerate when these values change

  // Memoize the nebula layers to prevent re-renders
  const nebulaLayers = useMemo(() => (
    <div className="absolute inset-0 pointer-events-none">
      <div 
        className="absolute top-[10%] left-[15%] w-[35%] h-[35%] rounded-full filter blur-3xl opacity-25"
        style={{
          background: darkMode
            ? 'radial-gradient(circle, rgba(147,197,253,0.15) 0%, rgba(59,130,246,0) 70%)'
            : 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(59,130,246,0) 70%)',
          animation: 'pulse-slow 8s infinite ease-in-out',
        }}
      />
      <div 
        className="absolute bottom-[15%] right-[10%] w-[25%] h-[45%] rounded-full filter blur-3xl opacity-20"
        style={{
          background: darkMode
            ? 'radial-gradient(circle, rgba(192,132,252,0.15) 0%, rgba(107,33,168,0) 70%)'
            : 'radial-gradient(circle, rgba(192,132,252,0.1) 0%, rgba(107,33,168,0) 70%)',
          animation: 'pulse-slow2 10s infinite ease-in-out',
        }}
      />
      <div 
        className="absolute top-[25%] right-[25%] w-[30%] h-[30%] rounded-full filter blur-3xl opacity-15"
        style={{
          background: darkMode
            ? 'radial-gradient(circle, rgba(103,232,249,0.15) 0%, rgba(6,182,212,0) 70%)'
            : 'radial-gradient(circle, rgba(103,232,249,0.1) 0%, rgba(6,182,212,0) 70%)',
          animation: 'pulse-slow3 12s infinite ease-in-out',
        }}
      />
    </div>
  ), [darkMode]);

  // Setup once on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true);
      const currentDarkMode = isDarkMode();
      setDarkMode(currentDarkMode);
      
      // Setup shooting stars only once per mount
      const handleShootingStars = () => {
        const starfield = document.querySelector('.starfield');
        if (!starfield) return null;
        
        const createShootingStar = () => {
          const star = document.createElement('div');
          star.className = 'shooting-star';
          
          // Set random position and angle
          const startX = Math.random() * 100;
          const startY = Math.random() * 30; // Only from top portion
          const angle = Math.random() * 60 - 30;
          
          star.style.top = `${startY}%`;
          star.style.left = `${startX}%`;
          star.style.setProperty('--angle', `${angle}deg`);
          
          // Add the CSS variable to use in our animation
          starfield.appendChild(star);
          
          // Remove star after animation
          setTimeout(() => {
            if (star.parentNode === starfield) {
              starfield.removeChild(star);
            }
          }, 1500); // Match animation duration
        };
        
        // Create shooting stars at random intervals
        const interval = setInterval(() => {
          if (Math.random() > 0.7) { // 30% chance each interval
            createShootingStar();
          }
        }, Math.random() * 3000 + 2000);
        
        return interval;
      };
      
      const interval = handleShootingStars();
      
      // Listen for theme changes
      const checkTheme = () => {
        const newDarkMode = isDarkMode();
        if (newDarkMode !== darkMode) {
          setDarkMode(newDarkMode);
          setStarKey(prevKey => prevKey + 1); // Force regeneration of stars when theme changes
        }
      };
      
      window.addEventListener('theme-change', checkTheme);
      
      return () => {
        if (interval) clearInterval(interval);
        window.removeEventListener('theme-change', checkTheme);
      };
    }
  }, []); // Empty dependency array ensures this only runs once on mount

  if (!isClient) return null;

  return (
    <div className="cosmic-background fixed inset-0 w-full h-full min-h-screen overflow-hidden z-0" style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      minHeight: '100vh'
    }}>
      {/* Starfield is handled via CSS ::before in animations.css */}
      
      {/* Dynamic stars with JavaScript - now memoized */}
      <div className="starfield absolute inset-0 pointer-events-none" style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        minHeight: '100vh'
      }}>
        {stars}
      </div>

      {/* Enhanced Nebula Layers - Now memoized */}
      <div style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        minHeight: '100vh'
      }}>
        {nebulaLayers}
      </div>
    </div>
  );
}

// Export a memoized version to prevent re-renders when parent components update
const CosmicBackground = memo(CosmicBackgroundComponent);
export default CosmicBackground;