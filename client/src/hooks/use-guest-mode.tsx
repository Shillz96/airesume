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

  // Check for guest mode in URL parameters
  useEffect(() => {
    if (user) {
      setIsGuestMode(false);
      return;
    }
    
    // Get the guest parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get('guest');
    
    // Set guest mode based on URL parameter
    if (guestParam === 'true') {
      setIsGuestMode(true);
    } else {
      // If not explicitly set to true, check if we should keep existing state
      // Only change to false if explicitly set to something other than 'true'
      if (guestParam !== null) {
        setIsGuestMode(false);
      }
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
      {isGuestMode && !user && <GuestModeDialog />}
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