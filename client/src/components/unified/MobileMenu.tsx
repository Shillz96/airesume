import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { Menu, X, Home, FileText, Briefcase, Settings, LogOut, Moon, Sun } from 'lucide-react';
import { useUnifiedTheme } from '../../contexts/UnifiedThemeContext';
import { useAuth } from '../../hooks/use-auth';

interface MobileMenuProps {
  className?: string;
}

/**
 * MobileMenu component
 * 
 * Provides a responsive mobile navigation menu with full-screen overlay
 * for small screen devices. Includes theme toggle and user profile options.
 */
export default function MobileMenu({ className = '' }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { config, toggleDarkMode } = useUnifiedTheme();
  const { user, logoutMutation } = useAuth();

  // Close menu when location changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
    setIsOpen(false);
  };

  // Toggle menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`md:hidden ${className}`}>
      {/* Mobile Menu Toggle Button */}
      <button 
        onClick={toggleMenu}
        className="p-2 text-foreground"
        aria-label="Toggle mobile menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md">
          <div className="flex flex-col h-full">
            {/* Menu Header */}
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h2 className="text-xl font-semibold">
                Menu
              </h2>
              <button 
                onClick={toggleMenu}
                className="p-2 text-foreground hover:bg-muted/20 rounded-full"
                aria-label="Close mobile menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-6 px-4">
              <ul className="space-y-4">
                <li>
                  <Link href="/dashboard">
                    <a className={`flex items-center gap-3 p-3 rounded-lg ${location === '/dashboard' ? 'bg-primary/10 text-primary' : 'hover:bg-muted/10'}`}>
                      <Home size={20} />
                      <span>Dashboard</span>
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/resumes">
                    <a className={`flex items-center gap-3 p-3 rounded-lg ${location === '/resumes' ? 'bg-primary/10 text-primary' : 'hover:bg-muted/10'}`}>
                      <FileText size={20} />
                      <span>Resumes</span>
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/job-finder">
                    <a className={`flex items-center gap-3 p-3 rounded-lg ${location === '/job-finder' ? 'bg-primary/10 text-primary' : 'hover:bg-muted/10'}`}>
                      <Briefcase size={20} />
                      <span>Find Jobs</span>
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/subscription">
                    <a className={`flex items-center gap-3 p-3 rounded-lg ${location === '/subscription' ? 'bg-primary/10 text-primary' : 'hover:bg-muted/10'}`}>
                      <Settings size={20} />
                      <span>Subscription</span>
                    </a>
                  </Link>
                </li>
              </ul>
            </nav>

            {/* User and Theme Actions */}
            <div className="border-t border-border p-4 space-y-4">
              {/* Theme Toggle */}
              <button 
                onClick={toggleDarkMode}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted/10"
              >
                {config.mode === 'dark' ? (
                  <>
                    <Sun size={20} />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon size={20} />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>

              {/* Logout Button */}
              {user && (
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full p-3 rounded-lg text-danger hover:bg-danger/10"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              )}

              {/* User Info */}
              {user && (
                <div className="flex items-center gap-4 p-3 mt-4 rounded-lg bg-muted/10">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium">{user.username}</div>
                    <div className="text-sm text-muted-foreground">Signed in</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}