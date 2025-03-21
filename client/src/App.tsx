import React from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { GuestModeProvider } from "@/hooks/use-guest-mode";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import ResumeBuilder from "@/pages/resume-builder";
import ResumesPage from "@/pages/resumes-page";
import JobFinder from "@/pages/job-finder";
import JobDetails from "@/pages/job-details";
import SubscriptionPage from "@/pages/subscription-page";
import LandingPage from "@/pages/landing-page";
import { ProtectedRoute } from "./lib/protected-route";

import Navbar from "@/components/navbar";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <ProtectedRoute path="/dashboard" component={HomePage} />
      <ProtectedRoute path="/resume-builder" component={ResumeBuilder} />
      <ProtectedRoute path="/resumes" component={ResumesPage} />
      <ProtectedRoute path="/job-finder" component={JobFinder} />
      <ProtectedRoute path="/job/:id" component={JobDetails} />
      <ProtectedRoute path="/subscription" component={SubscriptionPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Separate component to use hooks that require auth context
function AppContent() {
  const [location] = useLocation();
  const { user } = useAuth();
  
  // Only show navbar when not on landing page or if authenticated
  const showNavbar = location !== "/" || user;
  
  // Check current location and redirect if using older paths
  React.useEffect(() => {
    // If we get a 404, we need to check if there's a hash in the URL that we can redirect to
    if (location === "/404") {
      const path = window.location.pathname;
      
      // Define map of old paths to new paths
      const pathMap: {[key: string]: string} = {
        "/": "/",
        "/dashboard": "/dashboard",
        "/resume-builder": "/resume-builder",
        "/resumes": "/resumes",
        "/job-finder": "/job-finder",
        "/subscription": "/subscription"
      };
      
      // Check if the path exists in our map and redirect
      const newPath = pathMap[path];
      if (newPath) {
        window.history.replaceState(null, '', newPath);
        window.location.reload();
      }
    }
  }, [location]);
  
  return (
    <div className="min-h-screen bg-black cosmic-background">
      {showNavbar && <Navbar />}
      <div className={showNavbar ? "pt-16" : ""}>
        <Router />
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GuestModeProvider>
          <AppContent />
          <Toaster />
        </GuestModeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
