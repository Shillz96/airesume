import { useEffect, useRef } from "react";
import Navbar from "@/components/navbar";
import DashboardStats from "@/components/dashboard-stats";
import RecentActivity from "@/components/recent-activity";
import JobInterviewAvatar from "@/components/job-interview-avatar";
import JobSearchProgress from "@/components/job-search-progress";
import SubscriptionStatus from "@/components/subscription-status";
import CosmicBackground from "@/components/cosmic-background";
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
      <CosmicBackground />
      <Navbar />
      
      <main className="pt-24 pb-16 relative z-10 cosmic-nebula flex-1">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 h-full">
          <div className="px-4 py-6 sm:px-0 h-full flex flex-col">
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
            
            <SubscriptionStatus />
            
            <div className="mt-6">
              <DashboardStats />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[600px]">
              <div className="md:col-span-1 flex flex-col h-full">
                <div className="flex-1 h-full">
                  <JobInterviewAvatar />
                </div>
              </div>
              <div className="md:col-span-1 flex flex-col h-full">
                <div className="flex-1 h-full">
                  <RecentActivity />
                </div>
              </div>
            </div>
            
            <div className="mt-16 mb-12 pt-4">
              <JobSearchProgress />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
