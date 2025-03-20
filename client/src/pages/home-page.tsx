import { useEffect, useRef } from "react";
import Navbar from "@/components/navbar";
import DashboardStats from "@/components/dashboard-stats";
import RecentActivity from "@/components/recent-activity";
import { useAuth } from "@/hooks/use-auth";
import { Rocket } from "lucide-react";
import gsap from "gsap";

export default function HomePage() {
  const { user } = useAuth();
  const welcomeRef = useRef<HTMLDivElement>(null);
  const rocketRef = useRef<HTMLDivElement>(null);
  
  // Animation effect
  useEffect(() => {
    if (welcomeRef.current) {
      gsap.fromTo(
        welcomeRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      );
    }
    
    if (rocketRef.current) {
      gsap.fromTo(
        rocketRef.current,
        { 
          y: 20, 
          x: -10,
          opacity: 0 
        },
        { 
          y: 0, 
          x: 0,
          opacity: 1, 
          duration: 0.6, 
          delay: 0.3,
          ease: "back.out" 
        }
      );
      
      // Add a floating animation
      gsap.to(
        rocketRef.current,
        {
          y: "-=8",
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        }
      );
    }
    
    // Create shooting stars at random intervals
    const createShootingStar = () => {
      const starfield = document.querySelector('.starfield');
      if (!starfield) return;
      
      const star = document.createElement('div');
      star.className = 'shooting-star';
      
      // Random position and angle
      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * window.innerHeight / 3; // Start in top third
      star.style.left = `${startX}px`;
      star.style.top = `${startY}px`;
      
      // Random direction and distance
      const tx = Math.random() > 0.5 ? '300px' : '-300px';
      const ty = '300px';
      const rotation = Math.random() * 45 - 22.5;
      star.style.setProperty('--tx', tx);
      star.style.setProperty('--ty', ty);
      star.style.setProperty('--r', `${rotation}deg`);
      
      starfield.appendChild(star);
      
      // Remove after animation completes
      setTimeout(() => {
        if (star.parentNode === starfield) {
          starfield.removeChild(star);
        }
      }, 1500);
    };
    
    // Create a shooting star every 3-6 seconds
    const interval = setInterval(() => {
      createShootingStar();
    }, Math.random() * 3000 + 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="cosmic-page">
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
      
      <Navbar />
      
      <main className="pt-16 relative z-10 cosmic-nebula">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8 flex items-center" ref={welcomeRef}>
              <div>
                <h1 className="cosmic-page-title text-3xl">
                  Welcome back, <span className="cosmic-text-gradient">{user?.username}</span>!
                </h1>
                <p className="mt-1 text-gray-300">
                  Navigate your career journey with AI-powered tools and insights.
                </p>
              </div>
              <div className="ml-4" ref={rocketRef}>
                <div className="bg-[hsl(260,100%,60%)] bg-opacity-20 p-3 rounded-full cosmic-glow">
                  <Rocket size={24} className="text-white" />
                </div>
              </div>
            </div>
            
            <DashboardStats />
            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  );
}
