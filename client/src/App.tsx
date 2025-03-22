import React from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { AuthDialogProvider, useAuthDialog } from "@/hooks/use-auth-dialog";
import { GuestModeProvider } from "@/hooks/use-guest-mode";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import ResumeBuilder from "@/pages/resume-builder";
import RefactoredResumeBuilder from "@/pages/refactored-resume-builder";
import ResumesPage from "@/pages/resumes-page";
import JobFinder from "@/pages/job-finder";
import JobDetails from "@/pages/job-details";
import SubscriptionPage from "@/pages/subscription-page";
import LandingPage from "@/pages/landing-page";
import AdminAccess from "@/pages/admin-access";
import { ProtectedRoute } from "./lib/protected-route";
import { useEffect, useRef } from "react";

import Navbar from "@/components/navbar";
import GoAdminLink from "@/components/go-admin-link";
import QuickLogin from "@/components/quick-login";
import AuthDialog from "@/components/auth-dialog";

function Router() {
  // Manual check for admin-access path to handle direct navigation
  const path = window.location.pathname;
  if (path === "/admin-access") {
    return <AdminAccess />;
  }
  
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <ProtectedRoute path="/dashboard" component={HomePage} />
      <ProtectedRoute path="/resume-builder" component={ResumeBuilder} />
      <ProtectedRoute path="/refactored-resume-builder" component={RefactoredResumeBuilder} />
      <ProtectedRoute path="/resumes" component={ResumesPage} />
      <ProtectedRoute path="/job-finder" component={JobFinder} />
      <ProtectedRoute path="/job/:id" component={JobDetails} />
      <ProtectedRoute path="/subscription" component={SubscriptionPage} />
      <Route path="/admin-access" component={AdminAccess} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Separate component to use hooks that require auth context
function AppContent() {
  const [location] = useLocation();
  const { user } = useAuth();
  const { isOpen, activeTab, closeDialog } = useAuthDialog();
  const starfieldRef = useRef<HTMLDivElement>(null);
  
  // Only show navbar when not on landing page or if authenticated
  const showNavbar = location !== "/" || user;
  
  // Create shooting stars effect
  useEffect(() => {
    if (!starfieldRef.current) return;
    
    const starfield = starfieldRef.current;
    const createShootingStar = () => {
      const star = document.createElement('div');
      star.className = 'shooting-star';
      
      // Randomize position and angle for more natural appearance
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const angle = Math.random() * 60 - 30; // Between -30 and +30 degrees
      
      star.style.setProperty('--angle', `${angle}deg`);
      star.style.top = `${startY}%`;
      star.style.left = `${startX}%`;
      star.style.width = '100px';
      star.style.height = '2px';
      star.style.position = 'absolute';
      star.style.background = 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)';
      star.style.animation = 'shooting-star 1s linear forwards';
      star.style.zIndex = '5';
      
      starfield.appendChild(star);
      
      // Remove the star after animation completes
      setTimeout(() => {
        if (star.parentNode === starfield) {
          starfield.removeChild(star);
        }
      }, 1000);
    };
    
    // Create shooting stars at random intervals
    const interval = setInterval(() => {
      createShootingStar();
    }, Math.random() * 3000 + 2000); // Between 2 and 5 seconds
    
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);
  
  // Handle browser refresh and direct URL navigation
  React.useEffect(() => {
    // Get the current pathname from the browser
    const path = window.location.pathname;
    
    // Define valid paths in our application
    const validPaths = [
      "/",
      "/dashboard",
      "/resume-builder",
      "/resumes",
      "/job-finder",
      "/subscription",
      "/admin-access"
    ];
    
    // Check if we're on a valid path
    if (validPaths.includes(path) || path.startsWith("/job/")) {
      // The path is valid, we don't need to do anything
    } else if (location === "/404") {
      // We're on the 404 page, try to redirect
      window.location.href = "/";
    }
  }, [location]);
  
  return (
    <div className="min-h-screen bg-black cosmic-background relative">
      {/* Enhanced Starfield Background with static implementation */}
      <div ref={starfieldRef} className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        {/* Static Stars - More visible and with glow effects */}
        {Array.from({ length: 150 }).map((_, i) => {
          const size = Math.random() * 2 + 1;
          const top = Math.random() * 100;
          const left = Math.random() * 100;
          const opacity = Math.random() * 0.7 + 0.3;
          const duration = Math.random() * 4 + 2;
          const delay = Math.random() * 2;
          
          return (
            <div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                top: `${top}%`,
                left: `${left}%`,
                opacity,
                animation: `twinkle ${duration}s infinite ${delay}s`,
                boxShadow: '0 0 4px rgba(255,255,255,0.3)',
              }}
            />
          );
        })}
        
        {/* Enhanced Nebula Layers */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute top-[10%] left-[15%] w-[35%] h-[35%] rounded-full filter blur-3xl opacity-25"
            style={{
              background: 'radial-gradient(circle, rgba(147,197,253,0.15) 0%, rgba(59,130,246,0) 70%)',
              animation: 'pulse-slow 8s infinite ease-in-out',
            }}
          />
          <div 
            className="absolute bottom-[15%] right-[10%] w-[25%] h-[45%] rounded-full filter blur-3xl opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(192,132,252,0.15) 0%, rgba(107,33,168,0) 70%)',
              animation: 'pulse-slow2 10s infinite ease-in-out',
            }}
          />
          <div 
            className="absolute top-[25%] right-[25%] w-[30%] h-[30%] rounded-full filter blur-3xl opacity-15"
            style={{
              background: 'radial-gradient(circle, rgba(103,232,249,0.15) 0%, rgba(6,182,212,0) 70%)',
              animation: 'pulse-slow3 12s infinite ease-in-out',
            }}
          />
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {showNavbar && <Navbar />}
        <div className={showNavbar ? "pt-16" : ""}>
          <Router />
        </div>
        {/* Admin access button - always visible */}
        <GoAdminLink />
        {/* Quick login for the admin user */}
        <QuickLogin />
        {/* Auth dialog for login/register */}
        <AuthDialog 
          isOpen={isOpen} 
          onOpenChange={closeDialog}
          defaultTab={activeTab}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GuestModeProvider>
          <AuthDialogProvider>
            <AppContent />
            <Toaster />
          </AuthDialogProvider>
        </GuestModeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
