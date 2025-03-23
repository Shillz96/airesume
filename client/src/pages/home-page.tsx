import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useAuth } from "@/hooks/use-auth";
import { useUnifiedTheme } from "@/contexts/UnifiedThemeContext";
import DashboardStats from "@/features/dashboard/components/DashboardStats";
import RecentActivity from "@/features/dashboard/components/RecentActivity";
import JobSearchProgress from "@/features/job/components/JobSearchProgress";
import EnhancedJobInterviewAvatar from "@/features/job/components/EnhancedJobInterviewAvatar";
import SubscriptionStatus from "@/features/subscription/components/SubscriptionStatus";
import { UnifiedPageHeader, Heading1, GradientText, UnifiedContainer } from "@/components/unified";
import { Rocket, User, LayoutDashboard, UserCheck, Calendar, Search, Clock, Briefcase } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const welcomeRef = useRef<HTMLDivElement>(null);
  const rocketRef = useRef<HTMLDivElement>(null);
  
  // Animated welcome elements with GSAP
  useEffect(() => {
    const welcomeEl = welcomeRef.current;
    const rocketEl = rocketRef.current;
    
    if (welcomeEl && rocketEl) {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      
      tl.from(welcomeEl, {
        y: 30,
        opacity: 0,
        duration: 0.8,
      })
      .from(rocketEl, {
        scale: 0,
        rotation: 45,
        opacity: 0,
        duration: 0.5,
      }, "-=0.4");
      
      // Star particles around the rocket
      const createStar = () => {
        const star = document.createElement("div");
        star.className = "absolute w-1 h-1 bg-blue-400 rounded-full";
        
        const size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 30 + 15;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        star.style.left = `50%`;
        star.style.top = `50%`;
        star.style.transform = `translate(${x}px, ${y}px)`;
        
        rocketEl.appendChild(star);
        
        gsap.to(star, {
          opacity: 0,
          scale: 0,
          duration: Math.random() * 1 + 0.5,
          onComplete: () => {
            star.remove();
          }
        });
      };
      
      // Create stars at random intervals
      const interval = setInterval(() => {
        if (rocketEl.contains(document.activeElement)) {
          for (let i = 0; i < 3; i++) {
            createStar();
          }
        }
      }, 300);
      
      return () => clearInterval(interval);
    }
  }, []);
  
  const { config } = useUnifiedTheme();
  
  return (
    <>
      <UnifiedContainer className="pb-10 min-h-screen relative z-10">
        <div ref={welcomeRef}>
          <UnifiedPageHeader
            title={
              config.variant === 'cosmic' ? (
                <GradientText as="h1" size="4xl" weight="bold">
                  Welcome back, {user?.username}!
                </GradientText>
              ) : (
                <Heading1>
                  Welcome back, {user?.username}!
                </Heading1>
              )
            }
            subtitle="Navigate your career journey with AI-powered tools and insights."
            variant={config.variant === 'cosmic' ? 'cosmic' : 'default'}
            borderStyle={config.variant === 'cosmic' ? 'gradient' : 'subtle'}
            actions={
              <div ref={rocketRef}>
                <div className={`p-3 rounded-full ${config.variant === 'cosmic' ? 'bg-primary/30 cosmic-glow animate-pulse' : 'bg-primary/20'}`}>
                  <Rocket size={24} className={config.variant === 'cosmic' ? 'text-primary-foreground' : 'text-primary'} />
                </div>
              </div>
            }
          />
        </div>
        
        <SubscriptionStatus />
        
        <div className="mt-6">
          <DashboardStats />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[600px]">
          <div className="md:col-span-1 flex flex-col h-full">
            <div className="flex-1 h-full">
              <EnhancedJobInterviewAvatar />
            </div>
          </div>
          <div className="md:col-span-1 flex flex-col h-full">
            <div className="flex-1 h-full">
              <RecentActivity />
            </div>
          </div>
        </div>
        
        <div className="mt-16 mb-12 ">
          <JobSearchProgress />
        </div>
      </UnifiedContainer>
    </>
  );
}