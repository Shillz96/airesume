import React, { memo, useEffect, useState } from 'react';
import { useUnifiedTheme } from '@/contexts/UnifiedThemeContext';

/**
 * Enhanced CosmicBackground component
 * 
 * This creates a dynamic, animated cosmic background with:
 * - Gradient background
 * - Star field
 * - Animated particles
 * - Geometric patterns
 * - Blurred abstract shapes
 */
const CosmicBackground: React.FC = () => {
  const { mode } = useUnifiedTheme();
  const [effectiveMode, setEffectiveMode] = useState(mode);
  const [particles, setParticles] = useState<{ left: number; top: number; size: number; delay: number }[]>([]);
  const showDebug = false; // Set to true to show debugging overlay

  // Calculate effective mode (light/dark)
  useEffect(() => {
    let currentMode = mode;
    if (mode === 'system') {
      currentMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    setEffectiveMode(currentMode);

    if (mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        setEffectiveMode(mediaQuery.matches ? 'dark' : 'light');
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [mode]);

  // Generate random particles
  useEffect(() => {
    const particleCount = 25; // Reduced for better performance and appearance
    const newParticles = [];
    
    for (let i = 0; i < particleCount; i++) {
      // Create particles with more intentional distribution
      newParticles.push({
        left: Math.random() * 100, // percentage position
        top: Math.random() * 100,
        size: Math.random() * 2 + 1, // Size between 1-3px (smaller for subtlety)
        delay: Math.random() * 10 // Longer range of delays for more natural appearance
      });
    }
    
    setParticles(newParticles);
  }, []);

  return (
    <div 
      className={`cosmic-background ${effectiveMode === 'dark' ? 'cosmic-dark' : 'cosmic-light'}`} 
      aria-hidden="true"
    >
      {/* Debug overlay - only shown when showDebug is true */}
      {showDebug && (
        <div style={{ 
          position: 'absolute', 
          top: '10px', 
          right: '10px', 
          background: 'rgba(255,255,255,0.2)', 
          padding: '5px', 
          borderRadius: '3px',
          fontSize: '10px',
          color: 'white',
          zIndex: 1000
        }}>
          BG: {effectiveMode}
        </div>
      )}
      
      {/* Animated particles */}
      <div className="cosmic-particles">
        {particles.map((particle, index) => (
          <div 
            key={index}
            className="cosmic-particle"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${15 + particle.delay * 2}s`
            }}
          />
        ))}
      </div>

      {/* Geometric patterns */}
      <div className="cosmic-patterns">
        <div className="cosmic-hexagon" />
        <div className="cosmic-circuit" />
      </div>

      {/* Blurred abstract shapes */}
      <div className="cosmic-abstract-shapes">
        <div className="cosmic-abstract-shape" />
        <div className="cosmic-abstract-shape" />
        <div className="cosmic-abstract-shape" />
      </div>
    </div>
  );
};

// Using memo to prevent unnecessary re-renders
export default memo(CosmicBackground);