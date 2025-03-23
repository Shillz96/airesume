import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Home, FileText, Briefcase, Settings, Sun, Moon, LogOut, Rocket } from 'lucide-react';
import { useUnifiedTheme } from '../../contexts/UnifiedThemeContext';
import { useAuth } from '../../hooks/use-auth';

interface MobileMenuProps {
  className?: string;
}

/**
 * Super simple mobile menu component without complex transitions
 * Optimized for reliability across different mobile devices
 */
export default function MobileMenu({ className = '' }: MobileMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const { config, toggleDarkMode } = useUnifiedTheme();
  const { user, logoutMutation } = useAuth();
  
  const handleLogout = () => {
    logoutMutation.mutate();
    setMenuOpen(false);
  };
  
  // Simply show the hamburger icon when menu is closed
  if (!menuOpen) {
    return (
      <button 
        onClick={() => setMenuOpen(true)}
        className={`${className} md:hidden p-2 rounded-lg bg-card text-foreground`}
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>
    );
  }
  
  // When open, show the full menu
  return (
    <div className="fixed inset-0 bg-background z-[9999]">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Rocket size={20} />
          <span className="font-bold text-lg">AIreHire</span>
        </div>
        <button onClick={() => setMenuOpen(false)} className="p-2">
          <X size={24} />
        </button>
      </div>
      
      {/* Menu items */}
      <div className="p-4 overflow-y-auto h-[calc(100vh-64px)]">
        <nav>
          <ul className="space-y-3">
            <li>
              <Link 
                href="/dashboard" 
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  location === '/dashboard'
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card text-foreground'
                }`}
              >
                <Home size={20} />
                <span className="font-medium">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/resumes" 
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  location === '/resumes' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card text-foreground'
                }`}
              >
                <FileText size={20} />
                <span className="font-medium">Resumes</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/job-finder" 
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  location === '/job-finder' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card text-foreground'
                }`}
              >
                <Briefcase size={20} />
                <span className="font-medium">Find Jobs</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/subscription" 
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  location === '/subscription' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card text-foreground'
                }`}
              >
                <Settings size={20} />
                <span className="font-medium">Subscription</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Theme toggle */}
        <div className="mt-6 pt-6 border-t border-border">
          <button 
            onClick={toggleDarkMode}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-card text-foreground"
          >
            {config.mode === 'dark' ? (
              <>
                <Sun size={20} className="text-amber-500" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon size={20} className="text-indigo-500" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
          
          {/* Logout */}
          {user && (
            <button 
              onClick={handleLogout}
              className="w-full mt-3 flex items-center gap-3 p-3 rounded-lg bg-red-500/10 text-red-500"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          )}
        </div>
        
        {/* User info */}
        {user && (
          <div className="mt-6 pt-6 border-t border-border">
            <div className="p-3 rounded-lg bg-card flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-medium">{user.username}</div>
                <div className="text-sm text-muted-foreground">Signed in</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}