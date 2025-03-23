import React, { useEffect, useRef } from "react";
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
import ResumeBuilderNew from "@/pages/resume-builder-new";
import ResumesPage from "@/pages/resumes-page";
import JobFinder from "@/pages/job-finder";
import JobDetails from "@/pages/job-details";
import SubscriptionPage from "@/pages/subscription-page";
import LandingPage from "@/pages/landing-page";
import AdminAccess from "@/pages/admin-access";
import { ProtectedRoute } from "./lib/protected-route";

// Import components from their new locations after migration
import Navbar from "@/ui/navigation/Navbar";
import GoAdminLink from "@/features/admin/components/GoAdminLink";
import QuickLogin from "@/features/auth/components/QuickLogin";
import AuthDialog from "@/features/auth/components/AuthDialog";
import CosmicBackground from "@/ui/theme/CosmicBackground";

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
  const [location] = useLocation();
  const { user } = useAuth();
  const { isOpen, activeTab, closeDialog } = useAuthDialog();
  const { isDarkMode } = useTheme();
  
  // Force show navbar for all pages for testing purposes
  const showNavbar = true; // Force navbar to always show for testing
  
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
    <div className={`cosmic-app-container ${isDarkMode ? '' : 'light-mode'}`} style={{ 
      minHeight: '100vh',
      position: 'relative',
      width: '100%'
    }}>
      {/* Global Cosmic Background with consistent styling across all pages */}
      <CosmicBackground />
      
      {/* Content */}
      <div className="relative z-10" style={{ minHeight: '100vh' }}>
        {/* Master Navbar Component */}
        {showNavbar && <Navbar />}
        <div className="pt-[4.5rem]" style={{ minHeight: 'calc(100vh - 4.5rem)' }}>
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
  // Note: Theme is initialized in main.tsx before the App renders
  // We no longer need to initialize it here to avoid duplicate initialization
  
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
