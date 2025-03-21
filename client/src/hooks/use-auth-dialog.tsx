import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { useLocation } from 'wouter';

interface AuthDialogContextType {
  isOpen: boolean;
  activeTab: 'login' | 'register';
  openLogin: () => void;
  openRegister: () => void;
  closeDialog: () => void;
}

const AuthDialogContext = createContext<AuthDialogContextType | null>(null);

export function AuthDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [location] = useLocation();

  // Parse URL parameters on location change
  useEffect(() => {
    const url = new URL(window.location.href);
    const loginParam = url.searchParams.get('login');
    const registerParam = url.searchParams.get('register');

    if (loginParam === 'true') {
      openLogin();
    } else if (registerParam === 'true') {
      openRegister();
    }
  }, [location]);

  const openLogin = () => {
    setActiveTab('login');
    setIsOpen(true);
  };

  const openRegister = () => {
    setActiveTab('register');
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  return (
    <AuthDialogContext.Provider
      value={{
        isOpen,
        activeTab,
        openLogin,
        openRegister,
        closeDialog,
      }}
    >
      {children}
    </AuthDialogContext.Provider>
  );
}

export function useAuthDialog() {
  const context = useContext(AuthDialogContext);
  if (!context) {
    throw new Error('useAuthDialog must be used within an AuthDialogProvider');
  }
  return context;
}