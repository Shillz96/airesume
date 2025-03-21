import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/use-auth';

interface GuestContextType {
  isGuestMode: boolean;
  showGuestModal: () => void;
  hideGuestModal: () => void;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export function GuestModeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [location] = useLocation();
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);

  // Check for guest mode in URL parameters and auto-enable when needed
  useEffect(() => {
    if (user) {
      // If user is logged in, never use guest mode
      setIsGuestMode(false);
      return;
    }
    
    // Check location path - if not on landing page, enable guest mode automatically
    const isOnProtectedPage = location !== "/" && !location.startsWith("/?");
    
    // Get the guest parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get('guest');
    
    // Auto-enable guest mode for any of these conditions:
    // 1. When guest=true parameter is in URL
    // 2. When user is on any page other than the landing page and not logged in
    if (guestParam === 'true' || isOnProtectedPage) {
      setIsGuestMode(true);
      
      // If we're enabling guest mode automatically on a path without the parameter,
      // add it to the URL without page reload for consistency
      if (isOnProtectedPage && guestParam !== 'true') {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('guest', 'true');
        window.history.replaceState({}, '', currentUrl.toString());
      }
    } else if (guestParam === 'false') {
      // Only explicitly disable if guest=false
      setIsGuestMode(false);
    }
  }, [location, user]);

  const showGuestModal = () => {
    if (isGuestMode && !user) {
      setIsGuestModalOpen(true);
    }
  };

  const hideGuestModal = () => {
    setIsGuestModalOpen(false);
  };

  // Guest mode modal component
  const GuestModeDialog = () => (
    <Dialog open={isGuestModalOpen} onOpenChange={setIsGuestModalOpen}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold cosmic-text-gradient">
            Create an Account to Continue
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            You're in guest mode. Some features are limited.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-gray-300">
          To unlock all features like saving resumes and applying to jobs, please create an account.
        </p>
        <div className="flex gap-3 mt-4">
          <Button 
            onClick={() => window.location.href = "/?register=true"} 
            className="bg-[hsl(221.2,83.2%,53.3%)] hover:bg-[hsl(221.2,83.2%,63.3%)] text-white w-full"
          >
            Register
          </Button>
          <Button 
            onClick={() => window.location.href = "/?login=true"} 
            variant="outline" 
            className="border-[hsl(221.2,83.2%,53.3%)] text-[hsl(221.2,83.2%,53.3%)] w-full"
          >
            Login
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <GuestContext.Provider value={{ isGuestMode, showGuestModal, hideGuestModal }}>
      {/* Only render the dialog when explicitly shown, not automatically */}
      {isGuestModalOpen && isGuestMode && !user && <GuestModeDialog />}
      {children}
    </GuestContext.Provider>
  );
}

export function useGuestMode() {
  const context = useContext(GuestContext);
  if (context === undefined) {
    throw new Error('useGuestMode must be used within a GuestModeProvider');
  }
  return context;
}