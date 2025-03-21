import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Global loading overlay that shows a cosmic-themed loader
 * when transitioning between pages or during data fetching
 */
export default function GlobalLoading() {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Create listeners for page navigation
    const handleStart = () => setVisible(true);
    const handleComplete = () => {
      setTimeout(() => setVisible(false), 300); // Short delay to prevent flash
    };
    
    // Track navigation and data loading globally
    window.addEventListener('beforeunload', handleStart);
    window.addEventListener('load', handleComplete);
    
    // Also track React Query loading states
    document.addEventListener('cosmic-loading-start', handleStart);
    document.addEventListener('cosmic-loading-complete', handleComplete);
    
    return () => {
      window.removeEventListener('beforeunload', handleStart);
      window.removeEventListener('load', handleComplete);
      document.removeEventListener('cosmic-loading-start', handleStart);
      document.removeEventListener('cosmic-loading-complete', handleComplete);
    };
  }, []);
  
  if (!visible) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md transition-opacity duration-300"
      style={{ 
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {/* Orbital loader with cosmic effects */}
      <div className="relative">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        
        {/* Animated glow effect */}
        <div 
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0) 70%)",
            animation: "pulse-slow 2s infinite ease-in-out"
          }}
        />
        
        {/* Orbital particles */}
        <div className="h-3 w-3 absolute top-0 left-0 rounded-full bg-blue-400"
          style={{
            boxShadow: "0 0 8px rgba(59,130,246,0.8)",
            animation: "orbit 3s infinite linear"
          }}
        />
        <div className="h-2 w-2 absolute bottom-0 right-0 rounded-full bg-purple-400"
          style={{
            boxShadow: "0 0 8px rgba(147,51,234,0.8)",
            animation: "orbit 2.5s infinite linear reverse"
          }}
        />
      </div>
      
      {/* Loading text with animated dots */}
      <p className="mt-4 text-white/90 text-center max-w-xs font-medium">
        Navigating the cosmos...
      </p>
      
      {/* Small stars in the background */}
      <div className="absolute inset-0 overflow-hidden -z-10 opacity-50">
        {Array.from({ length: 50 }).map((_, i) => {
          const size = Math.random() * 2 + 1;
          const top = Math.random() * 100;
          const left = Math.random() * 100;
          const duration = Math.random() * 3 + 1;
          
          return (
            <div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                top: `${top}%`,
                left: `${left}%`,
                animation: `twinkle ${duration}s infinite ${Math.random()}s`,
                boxShadow: '0 0 4px rgba(255,255,255,0.3)',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}