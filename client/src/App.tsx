import React, { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { AuthDialogProvider, useAuthDialog } from "@/hooks/use-auth-dialog";
import { GuestModeProvider } from "@/hooks/use-guest-mode";
import { UnifiedThemeProvider, useUnifiedTheme } from "@/contexts/UnifiedThemeContext";
import NotFound from "@/pages/not-found"; 
import HomePage from "@/pages/home-page";
import ResumeBuilderNew from "@/pages/resume-builder-new";
import ResumesPage from "@/pages/resumes-page";
import JobFinder from "@/pages/job-finder";
import JobDetails from "@/pages/job-details";
import SubscriptionPage from "@/pages/subscription-page";
import LandingPage from "@/pages/landing-page";
import AdminAccess from "@/pages/admin-access";
import { ProtectedRoute } from "./lib/protected-route";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import admin and auth components
import GoAdminLink from "@/features/admin/components/GoAdminLink";
import QuickLogin from "@/features/auth/components/QuickLogin";
import AuthDialog from "@/features/auth/components/AuthDialog";

// Fix: Update CosmicBackground import path
import CosmicBackground from "@/components/CosmicBackground";

// Temporary importing existing navbar until we create the unified one
import Navbar from "@/components/navigation/Navbar";

import { cn } from "@/lib/utils";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

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
      <ProtectedRoute path="/resume-builder" component={ResumeBuilderNew} />
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
  // Restore original state/hooks used here
  const [location] = useLocation();
  const { user } = useAuth();
  const { isOpen, activeTab, closeDialog } = useAuthDialog();
  const { theme } = useUnifiedTheme();
  const showNavbar = true; // Restore this flag

  const [effectiveMode, setEffectiveMode] = React.useState(theme);

  // Restore useEffect logic for effectiveMode
  React.useEffect(() => {
    let currentMode = theme;
    if (theme === 'system') {
      currentMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    setEffectiveMode(currentMode);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        setEffectiveMode(mediaQuery.matches ? 'dark' : 'light');
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Restore original useEffect for path checks (optional, but part of original code)
  React.useEffect(() => {
    const path = window.location.pathname;
    const validPaths = [
      "/", "/dashboard", "/resume-builder", "/resumes",
      "/job-finder", "/subscription", "/admin-access"
    ];
    if (validPaths.includes(path) || path.startsWith("/job/")) {
      // Valid path
    } else if (location === "/404") {
      window.location.href = "/";
    }
  }, [location]);

  useEffect(() => {
    // Initialize GSAP animations
    gsap.fromTo(
      '.fade-in',
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out'
      }
    );

    // Scroll animations
    gsap.utils.toArray('.scroll-fade').forEach((element: any) => {
      gsap.fromTo(
        element,
        { 
          opacity: 0,
          y: 50
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.nav-glass');
    if (navbar) {
      ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        toggleClass: {
          className: 'nav-scrolled',
          targets: navbar
        }
      });
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // Restore original return structure
  return (
    <div className={`min-h-screen bg-background ${effectiveMode}`}>
      {/* Animated background with stars */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
        <div className="stars" />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Cosmic background - moved outside content div for proper layering */}
        <CosmicBackground />
        
        {/* Content div with semi-transparent gradient */}
        <div 
          className="relative min-h-screen"
          style={{
            backgroundImage: effectiveMode === 'dark' 
              ? 'linear-gradient(to top right, rgba(67, 56, 202, 0.5), rgba(2, 6, 23, 0.5))' // Made more transparent
              : 'linear-gradient(to bottom right, rgba(224, 242, 254, 0.5), rgba(199, 210, 254, 0.5))' // Made more transparent
          }}
        >
          {/* Navbar */}
          {showNavbar && <Navbar />}
          
          {/* Main content area */}
          <main className="pt-20">
            <div className="w-full px-6 sm:px-8 lg:px-10 mx-auto max-w-screen-xl -mt-4 pb-16">
              <Router />
            </div>
          </main>
          
          {/* Other components */}
          <GoAdminLink />
          <QuickLogin />
          <AuthDialog 
            isOpen={isOpen} 
            onOpenChange={closeDialog}
            defaultTab={activeTab}
          />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Single centralized theme provider */}
      <UnifiedThemeProvider>
        <AuthProvider>
          <GuestModeProvider>
            <AuthDialogProvider>
              <AppContent />
              <Toaster />
            </AuthDialogProvider>
          </GuestModeProvider>
        </AuthProvider>
      </UnifiedThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
