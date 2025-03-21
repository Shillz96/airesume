import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { GuestModeProvider } from "@/hooks/use-guest-mode";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import ResumeBuilder from "@/pages/resume-builder";
import ResumesPage from "@/pages/resumes-page";
import JobFinder from "@/pages/job-finder";
import JobDetails from "@/pages/job-details";
import { ProtectedRoute } from "./lib/protected-route";

import Navbar from "@/components/navbar";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/resume-builder" component={ResumeBuilder} />
      <ProtectedRoute path="/resumes" component={ResumesPage} />
      <ProtectedRoute path="/job-finder" component={JobFinder} />
      <ProtectedRoute path="/job/:id" component={JobDetails} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GuestModeProvider>
          <div className="min-h-screen bg-black cosmic-background">
            <Navbar />
            <div className="pt-16">
              <Router />
            </div>
          </div>
          <Toaster />
        </GuestModeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
