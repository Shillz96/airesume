import { useEffect, useState, useCallback, useRef } from 'react';

export default function CosmicBackground() {
  const [isClient, setIsClient] = useState(false);
  // We are not using separate animation styles to avoid injection issues
  // Instead, we'll use the CSS file entries

  // Create stars manually to ensure they're visible
  const generateStars = () => {
    const stars = [];
    for (let i = 0; i < 150; i++) {
      const size = Math.random() * 2 + 1;
      const opacity = Math.random() * 0.7 + 0.3;
      const animDuration = Math.random() * 4 + 2;
      const animDelay = Math.random() * 2;
      
      stars.push(
        <div
          key={i}
          className="star absolute bg-white rounded-full"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity,
            animation: `twinkle ${animDuration}s infinite ${animDelay}s`,
            boxShadow: '0 0 4px rgba(255,255,255,0.3)',
          }}
        />
      );
    }
    return stars;
  };

  useEffect(() => {
    setIsClient(true);
    
    // Manually create shooting stars
    const starfield = document.querySelector('.starfield');
    if (!starfield) return;
    
    const createShootingStar = () => {
      const star = document.createElement('div');
      star.className = 'shooting-star';
      
      // Set random position and angle
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const angle = Math.random() * 60 - 30;
      
      star.style.top = `${startY}%`;
      star.style.left = `${startX}%`;
      star.style.transform = `rotate(${angle}deg)`;
      
      starfield.appendChild(star);
      
      // Remove star after animation
      setTimeout(() => {
        if (star.parentNode === starfield) {
          starfield.removeChild(star);
        }
      }, 1000);
    };
    
    // Create shooting stars at random intervals
    const interval = setInterval(() => {
      createShootingStar();
    }, Math.random() * 2000 + 2000);
    
    return () => clearInterval(interval);
  }, []);

  if (!isClient) return null;

  return (
    <div className="cosmic-container relative w-full h-full overflow-hidden">
      {/* Starfield Background */}
      <div 
        className="starfield absolute inset-0 pointer-events-none bg-gradient-to-b from-gray-900 via-black to-gray-900"
      >
        {generateStars()}
      </div>

      {/* Enhanced Nebula Layers */}
      <div className="nebula-container absolute inset-0 pointer-events-none">
        <div 
          className="cosmic-nebula-1 absolute top-[10%] left-[15%] w-[35%] h-[35%] rounded-full filter blur-3xl opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(147,197,253,0.15) 0%, rgba(59,130,246,0) 70%)',
            animation: 'pulse-slow 8s infinite ease-in-out',
          }}
        />
        <div 
          className="cosmic-nebula-2 absolute bottom-[15%] right-[10%] w-[25%] h-[45%] rounded-full filter blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(192,132,252,0.15) 0%, rgba(107,33,168,0) 70%)',
            animation: 'pulse-slow2 10s infinite ease-in-out',
          }}
        />
        <div 
          className="cosmic-nebula-3 absolute top-[25%] right-[25%] w-[30%] h-[30%] rounded-full filter blur-3xl opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(103,232,249,0.15) 0%, rgba(6,182,212,0) 70%)',
            animation: 'pulse-slow3 12s infinite ease-in-out',
          }}
        />
      </div>
    </div>
  );
}