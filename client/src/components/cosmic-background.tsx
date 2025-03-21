import { useEffect, useState } from 'react';

export default function CosmicBackground() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
    // Create shooting stars at random intervals
    const createShootingStar = () => {
      const starfield = document.querySelector('.starfield');
      if (!starfield) return;
      
      const star = document.createElement('div');
      star.className = 'shooting-star';
      
      // Random position and angle
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const angle = Math.random() * 45 - 22.5; // -22.5 to +22.5 degrees
      
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
    
    const interval = setInterval(() => {
      createShootingStar();
    }, Math.random() * 3000 + 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (!isClient) return null;
  
  return (
    <>
      {/* Starfield Background */}
      <div className="starfield absolute inset-0 pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="star absolute bg-white rounded-full"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
              animation: `twinkle ${Math.random() * 3 + 2}s infinite`,
            }}
          />
        ))}
      </div>
      
      {/* Animated Nebula Background */}
      <div className="cosmic-nebula-1 absolute top-[10%] left-[15%] w-[30%] h-[30%] rounded-full bg-blue-500/10 filter blur-3xl opacity-20 animate-pulse-slow"></div>
      <div className="cosmic-nebula-2 absolute bottom-[20%] right-[10%] w-[20%] h-[40%] rounded-full bg-purple-500/10 filter blur-3xl opacity-20 animate-pulse-slow2"></div>
      <div className="cosmic-nebula-3 absolute top-[30%] right-[30%] w-[25%] h-[25%] rounded-full bg-cyan-500/10 filter blur-3xl opacity-10 animate-pulse-slow3"></div>
    </>
  );
}