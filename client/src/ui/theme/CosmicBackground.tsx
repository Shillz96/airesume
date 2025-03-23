import { useEffect, useState, useMemo, memo } from 'react';
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
  const [isClient, setIsClient] = useState(false);
  const { isDarkMode } = useTheme();
  const [starKey, setStarKey] = useState(0); // Used to force re-generation of stars only when theme changes

  // Get colors from theme system
  const primaryColor = useMemo(() => getCosmicColor('primary'), []);
  const accentColor = useMemo(() => getCosmicColor('accent'), []);
  const tertiaryColor = useMemo(() => getCosmicColor('tertiary'), []);

  // Create stars manually to ensure they're visible
  // Memoize the stars so they don't regenerate on every render
  const stars = useMemo(() => {
    if (!isClient) return [];
    
    const starsArray = [];
    const starCount = isDarkMode ? 200 : 150; // Increase star count for better distribution
    
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
            opacity: isDarkMode ? opacity : opacity * 0.6, // More translucent in light mode
            animation: `twinkle ${animDuration}s infinite ${animDelay}s`,
            background: isDarkMode 
              ? (hue === 0 ? 'white' : `hsl(${hue}, 100%, 90%)`) 
              : `rgba(59, 130, 246, ${opacity * 0.8})`, // Blue-tinted stars in light mode
            boxShadow: isDarkMode 
              ? `0 0 ${Math.floor(size * 2)}px rgba(255, 255, 255, 0.3)` 
              : `0 0 ${Math.floor(size * 2)}px rgba(59, 130, 246, 0.3)`,
          }}
        />
      );
    }
    return starsArray;
  }, [isClient, isDarkMode, starKey]); // Only regenerate when these values change

  // Memoize the nebula layers to prevent re-renders
  const nebulaLayers = useMemo(() => (
    <div className="absolute inset-0 pointer-events-none">
      <div 
        className="absolute top-[10%] left-[15%] w-[35%] h-[35%] rounded-full filter blur-3xl opacity-25"
        style={{
          background: isDarkMode
            ? `radial-gradient(circle, ${primaryColor}30 0%, ${primaryColor}00 70%)`
            : `radial-gradient(circle, ${primaryColor}15 0%, ${primaryColor}00 70%)`,
          animation: 'pulse-slow 8s infinite ease-in-out',
        }}
      />
      <div 
        className="absolute bottom-[15%] right-[10%] w-[25%] h-[45%] rounded-full filter blur-3xl opacity-20"
        style={{
          background: isDarkMode
            ? `radial-gradient(circle, ${accentColor}30 0%, ${accentColor}00 70%)`
            : `radial-gradient(circle, ${accentColor}15 0%, ${accentColor}00 70%)`,
          animation: 'pulse-slow2 10s infinite ease-in-out',
        }}
      />
      <div 
        className="absolute top-[25%] right-[25%] w-[30%] h-[30%] rounded-full filter blur-3xl opacity-15"
        style={{
          background: isDarkMode
            ? `radial-gradient(circle, ${tertiaryColor}30 0%, ${tertiaryColor}00 70%)`
            : `radial-gradient(circle, ${tertiaryColor}15 0%, ${tertiaryColor}00 70%)`,
          animation: 'pulse-slow3 12s infinite ease-in-out',
        }}
      />
    </div>
  ), [isDarkMode, primaryColor, accentColor, tertiaryColor]);

  // Setup once on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true);
      
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
      
      // Theme changes are now managed by the useTheme hook directly
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, []); // Empty dependency array ensures this only runs once on mount

  // Watch for theme changes to regenerate stars when needed
  useEffect(() => {
    setStarKey(prevKey => prevKey + 1);
  }, [isDarkMode]);

  if (!isClient) return null;

  return (
    <div className="cosmic-background fixed inset-0 w-full h-full min-h-screen overflow-hidden z-0" 
      style={{ 
        background: isDarkMode ? 'linear-gradient(to bottom, #0f172a, #020617)' : 'linear-gradient(to bottom, #f8fafc, #f1f5f9)'
      }}
    >
      {/* Dynamic stars with JavaScript - now memoized */}
      <div className="starfield absolute inset-0 pointer-events-none">
        {stars}
      </div>

      {/* Enhanced Nebula Layers - Now memoized */}
      <div className="absolute inset-0">
        {nebulaLayers}
      </div>
    </div>
  );
}

// Export a memoized version to prevent re-renders when parent components update
const CosmicBackground = memo(CosmicBackgroundComponent);
export default CosmicBackground;