import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { Menu, X, Home, FileText, Briefcase, Settings, LogOut, Moon, Sun, Rocket } from 'lucide-react';
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
        className="p-2 text-foreground bg-card hover:bg-muted/80 rounded-lg shadow-sm"
        aria-label="Toggle mobile menu"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[1000] bg-background shadow-xl min-h-screen h-full overflow-y-auto">
          {/* Add a solid background to prevent any text showing through */}
          <div className="absolute inset-0 bg-background"></div>
          
          <div className="flex flex-col min-h-screen bg-background relative z-10">
            {/* Menu Header */}
            <div className="sticky top-0 flex justify-between items-center p-4 border-b border-border bg-primary text-primary-foreground z-10">
              <div className="flex items-center gap-2">
                <Rocket className="text-primary-foreground h-5 w-5" />
                <h2 className="text-xl font-semibold">
                  AIreHire
                </h2>
              </div>
              <button 
                onClick={toggleMenu}
                className="p-2 text-primary-foreground hover:bg-primary-foreground/10 rounded-full"
                aria-label="Close mobile menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-6 px-4">
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="/dashboard"
                    className={`flex items-center gap-3 p-4 rounded-lg text-md font-medium ${
                      location === '/dashboard' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-card hover:bg-muted/30 text-foreground shadow-sm'
                    }`}
                  >
                    <Home size={20} />
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/resumes"
                    className={`flex items-center gap-3 p-4 rounded-lg text-md font-medium ${
                      location === '/resumes' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-card hover:bg-muted/30 text-foreground shadow-sm'
                    }`}
                  >
                    <FileText size={20} />
                    <span>Resumes</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/job-finder"
                    className={`flex items-center gap-3 p-4 rounded-lg text-md font-medium ${
                      location === '/job-finder' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-card hover:bg-muted/30 text-foreground shadow-sm'
                    }`}
                  >
                    <Briefcase size={20} />
                    <span>Find Jobs</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/subscription"
                    className={`flex items-center gap-3 p-4 rounded-lg text-md font-medium ${
                      location === '/subscription' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-card hover:bg-muted/30 text-foreground shadow-sm'
                    }`}
                  >
                    <Settings size={20} />
                    <span>Subscription</span>
                  </Link>
                </li>
              </ul>
            </nav>

            {/* User and Theme Actions */}
            <div className="border-t border-border p-4 space-y-4 bg-muted/5 pb-24">
              {/* Theme Toggle */}
              <button 
                onClick={toggleDarkMode}
                className="flex items-center gap-3 w-full p-4 rounded-lg bg-card hover:bg-muted/30 text-foreground font-medium shadow-sm"
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

              {/* Logout Button */}
              {user && (
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full p-4 rounded-lg font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 shadow-sm"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              )}

              {/* User Info */}
              {user && (
                <div className="flex items-center gap-4 p-4 mt-4 mb-6 rounded-lg bg-card shadow-sm">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-lg font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{user.username}</div>
                    <div className="text-sm text-primary">Signed in</div>
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