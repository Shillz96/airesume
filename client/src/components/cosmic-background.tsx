import { useEffect, useState } from 'react';
import { isDarkMode } from '@/lib/theme-utils';

/**
 * CosmicBackground component
 * Creates a dynamic starfield with animated nebula effects using CSS animations
 * Now using our organized animation CSS
 */
export default function CosmicBackground() {
  const [isClient, setIsClient] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // Create stars manually to ensure they're visible
  const generateStars = () => {
    const stars = [];
    const starCount = darkMode ? 150 : 100; // Fewer stars in light mode
    
    for (let i = 0; i < starCount; i++) {
      const size = Math.random() * 2 + 1;
      const opacity = Math.random() * 0.7 + 0.3;
      const animDuration = Math.random() * 4 + 2;
      const animDelay = Math.random() * 2;
      
      stars.push(
        <div
          key={i}
          className="star absolute rounded-full"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: darkMode ? opacity : opacity * 0.6, // More translucent in light mode
            animation: `twinkle ${animDuration}s infinite ${animDelay}s`,
            background: darkMode ? 'white' : 'rgba(59, 130, 246, 0.8)', // Blue-tinted stars in light mode
            boxShadow: darkMode 
              ? '0 0 4px rgba(255, 255, 255, 0.3)' 
              : '0 0 4px rgba(59, 130, 246, 0.3)',
          }}
        />
      );
    }
    return stars;
  };

  useEffect(() => {
    setIsClient(true);
    setDarkMode(isDarkMode());
    
    // Manually create shooting stars
    const starfield = document.querySelector('.starfield');
    if (!starfield) return;
    
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
    
    // Listen for theme changes
    const checkTheme = () => {
      setDarkMode(isDarkMode());
    };
    
    window.addEventListener('theme-change', checkTheme);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('theme-change', checkTheme);
    };
  }, []);

  if (!isClient) return null;

  return (
    <div className="cosmic-background absolute inset-0 w-full h-full overflow-hidden z-0">
      {/* Starfield is handled via CSS ::before in animations.css */}
      
      {/* Dynamic stars with JavaScript */}
      <div className="starfield absolute inset-0 pointer-events-none">
        {generateStars()}
      </div>

      {/* Enhanced Nebula Layers - Using CSS animations */}
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
    </div>
  );
}