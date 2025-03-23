import React, { useRef, useEffect } from 'react';
import { useUnifiedTheme } from '../../contexts/UnifiedThemeContext';

/**
 * CosmicBackground component
 * 
 * Creates an animated cosmic background with stars, nebulas,
 * and shooting stars. Performance optimized for mobile devices
 * with adaptive rendering based on device capabilities.
 */
export default function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { config } = useUnifiedTheme();
  const starfieldEnabled = config.variant === 'cosmic';
  
  // Use requestAnimationFrame for smooth animations
  useEffect(() => {
    if (!starfieldEnabled || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match window size
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      
      // Adjust for high DPI displays
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    
    // Initial canvas setup
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Reduced number of stars for mobile
    const isMobile = window.innerWidth < 768;
    const starCount = isMobile ? 100 : 200;
    
    // Star properties
    type Star = {
      x: number;
      y: number;
      radius: number;
      color: string;
      speed: number;
      twinkleSpeed: number;
      twinklePhase: number;
      opacity: number;
    };
    
    // Generate stars with varying properties
    const stars: Star[] = Array.from({ length: starCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 1.5 + 0.5,
      color: Math.random() > 0.8 
        ? `rgba(${79 + Math.random() * 20}, ${70 + Math.random() * 80}, ${229 + Math.random() * 26}, 1)` // blue tint
        : Math.random() > 0.6 
          ? `rgba(${79 + Math.random() * 50}, ${229 + Math.random() * 26}, ${179 + Math.random() * 30}, 1)` // cyan/teal tint
          : `rgba(255, 255, 255, 1)`, // white
      speed: Math.random() * 0.15 + 0.1,
      twinkleSpeed: Math.random() * 0.01 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.5 + 0.5
    }));
    
    // Shooting stars
    type ShootingStar = {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
      active: boolean;
      timeToLaunch: number;
    };
    
    // Fewer shooting stars on mobile
    const shootingStarCount = isMobile ? 2 : 5;
    
    // Generate shooting stars
    const shootingStars: ShootingStar[] = Array.from({ length: shootingStarCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight / 2, // Only in top half
      length: Math.random() * 80 + 50,
      speed: Math.random() * 5 + 10,
      opacity: 0,
      active: false,
      timeToLaunch: Math.random() * 5000 + 2000 // Random launch time
    }));
    
    // Animation timestamp tracking
    let lastTime = 0;
    
    // Main animation loop
    const animate = (timestamp: number) => {
      // Calculate delta time for smooth animation regardless of frame rate
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw stars
      stars.forEach(star => {
        // Update twinkling
        star.twinklePhase += star.twinkleSpeed * deltaTime;
        star.opacity = 0.5 + Math.sin(star.twinklePhase) * 0.5;
        
        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color.replace('1)', `${star.opacity})`);
        ctx.fill();
      });
      
      // Update and draw shooting stars
      shootingStars.forEach(star => {
        if (star.active) {
          // Update position
          star.x += star.speed * deltaTime * 0.1;
          star.y += star.speed * deltaTime * 0.1;
          
          // Fade out at the end
          if (star.x > window.innerWidth || star.y > window.innerHeight) {
            star.active = false;
            star.timeToLaunch = Math.random() * 5000 + 2000;
          } else {
            // Increase opacity during start of animation
            if (star.opacity < 1) star.opacity += 0.05;
            
            // Draw the shooting star
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            
            // Calculate tail position
            const tailX = star.x - star.length * (star.speed / 15);
            const tailY = star.y - star.length * (star.speed / 15);
            
            ctx.lineTo(tailX, tailY);
            
            // Create gradient for tail
            const gradient = ctx.createLinearGradient(star.x, star.y, tailX, tailY);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        } else {
          // Count down to launch
          star.timeToLaunch -= deltaTime;
          if (star.timeToLaunch <= 0) {
            star.active = true;
            star.opacity = 0;
            star.x = Math.random() * window.innerWidth;
            star.y = Math.random() * (window.innerHeight / 3);
            star.length = Math.random() * 80 + 50;
            star.speed = Math.random() * 5 + 10;
          }
        }
      });
      
      // Continue animation loop
      if (starfieldEnabled) {
        requestAnimationFrame(animate);
      }
    };
    
    // Start animation
    const animationId = requestAnimationFrame(animate);
    
    // Cleanup on unmount
    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [starfieldEnabled]);
  
  return (
    <div className="fixed inset-0 z-[-1] bg-background overflow-hidden">
      {/* Static nebula effect background that uses minimal resources */}
      <div className="absolute inset-0 opacity-30" 
        style={{ 
          background: 'radial-gradient(circle at 20% 80%, rgba(79, 70, 229, 0.08) 0%, transparent 40%), ' +
                      'radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.08) 0%, transparent 40%)'
        }}
      />
      
      {/* Optimized canvas-based starfield animation */}
      {starfieldEnabled && (
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ pointerEvents: 'none' }}
        />
      )}
      
      {/* Static star field fallback for minimal theme */}
      {!starfieldEnabled && (
        <div className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `
              radial-gradient(1px 1px at 25% 25%, rgba(255, 255, 255, 0.5) 1px, transparent 0),
              radial-gradient(1px 1px at 50% 50%, rgba(255, 255, 255, 0.4) 1px, transparent 0),
              radial-gradient(2px 2px at 75% 75%, rgba(255, 255, 255, 0.3) 1px, transparent 0)
            `,
            backgroundSize: '100px 100px, 120px 120px, 170px 170px'
          }}
        />
      )}
    </div>
  );
}