import React from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { AuthDialogProvider, useAuthDialog } from "@/hooks/use-auth-dialog";
import { GuestModeProvider } from "@/hooks/use-guest-mode";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { initializeTheme } from "@/lib/theme-loader";
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
import CosmicStarfield from "@/components/cosmic-starfield";

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
  const { isDarkMode, currentTheme } = useTheme();
  
  // Only show navbar when not on landing page or if authenticated
  const showNavbar = location !== "/" || user;
  
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
      {/* Enhanced Cosmic Starfield Background */}
      <CosmicStarfield 
        starsCount={180}
        nebulasCount={4}
        shootingStarsEnabled={true}
      />
      
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
  // Initialize theme when app loads
  useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <GuestModeProvider>
            <AuthDialogProvider>
              <AppContent />
              <Toaster />
            </AuthDialogProvider>
          </GuestModeProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
