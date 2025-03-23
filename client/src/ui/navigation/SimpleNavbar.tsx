import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Home, Briefcase, FileText, User, LogOut, Moon, Sun, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useUnifiedTheme } from '@/contexts/UnifiedThemeContext';

/**
 * Modern SimpleNavbar component with updated styling to match the new theme
 */
export default function SimpleNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { isDarkMode, setMode, toggleDarkMode } = useUnifiedTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    console.log('SimpleNavbar mounted from navbar.tsx');
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Close menu when location changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Links */}
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-blue-500 flex items-center justify-center text-white font-bold">
                  A
                </div>
                <span className="ml-2 text-lg font-bold text-foreground">AIreHire</span>
              </div>
            </Link>
            
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              <NavLink href="/home" icon={<Home className="h-4 w-4" />} isActive={location === '/home'}>
                Home
              </NavLink>
              <NavLink href="/jobs" icon={<Briefcase className="h-4 w-4" />} isActive={location.startsWith('/job')}>
                Jobs
              </NavLink>
              <NavLink href="/resumes" icon={<FileText className="h-4 w-4" />} isActive={location.startsWith('/resume')}>
                Resumes
              </NavLink>
              <NavLink href="/subscription" icon={<User className="h-4 w-4" />} isActive={location === '/subscription'}>
                Account
              </NavLink>
            </div>
          </div>
          
          {/* Right side menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            {user ? (
              <div className="relative ml-3" ref={dropdownRef}>
                <div>
                  <button 
                    className="flex items-center max-w-xs p-2 rounded-md text-sm bg-background border border-border focus:outline-none hover:border-primary/50"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <span className="flex items-center">
                      <span className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {user.username.substring(0, 2).toUpperCase()}
                      </span>
                      <span className="ml-2 text-sm font-medium text-foreground hidden md:block">
                        {user.username}
                      </span>
                    </span>
                  </button>
                </div>
                
                {isOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-card border border-border ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <Link href="/subscription">
                        <a className="block px-4 py-2 text-sm text-foreground hover:bg-accent">
                          <Settings className="inline-block h-4 w-4 mr-2" />
                          Account Settings
                        </a>
                      </Link>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent"
                        onClick={handleLogout}
                      >
                        <LogOut className="inline-block h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link href="/auth">
                  <a className="inline-flex items-center px-3 py-1.5 border border-primary rounded-md text-sm font-medium text-primary hover:bg-primary/10 focus:outline-none">
                    Login
                  </a>
                </Link>
                <Link href="/auth?tab=register">
                  <a className="inline-flex items-center px-3 py-1.5 bg-primary border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary/90 focus:outline-none">
                    Sign Up
                  </a>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none"
              aria-expanded="false"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden" ref={dropdownRef}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <MobileNavLink href="/home" isActive={location === '/home'}>
              <Home className="h-5 w-5 mr-3" />
              Home
            </MobileNavLink>
            <MobileNavLink href="/jobs" isActive={location.startsWith('/job')}>
              <Briefcase className="h-5 w-5 mr-3" />
              Jobs
            </MobileNavLink>
            <MobileNavLink href="/resumes" isActive={location.startsWith('/resume')}>
              <FileText className="h-5 w-5 mr-3" />
              Resumes
            </MobileNavLink>
            <MobileNavLink href="/subscription" isActive={location === '/subscription'}>
              <User className="h-5 w-5 mr-3" />
              Account
            </MobileNavLink>
          </div>
          
          <div className="pt-4 pb-3 border-t border-border">
            <div className="px-4 flex items-center">
              {user ? (
                <>
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {user.username.substring(0, 2).toUpperCase()}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-foreground">{user.username}</div>
                  </div>
                </>
              ) : (
                <div className="w-full flex flex-col space-y-2">
                  <Link href="/auth">
                    <a className="flex items-center justify-center px-4 py-2 border border-primary rounded-md text-primary hover:bg-primary/10 focus:outline-none w-full">
                      Login
                    </a>
                  </Link>
                  <Link href="/auth?tab=register">
                    <a className="flex items-center justify-center px-4 py-2 bg-primary border border-transparent rounded-md text-white hover:bg-primary/90 focus:outline-none w-full">
                      Sign Up
                    </a>
                  </Link>
                </div>
              )}
              <div className="ml-auto flex-shrink-0">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-md text-muted-foreground hover:text-foreground focus:outline-none"
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                </button>
              </div>
            </div>
            
            {user && (
              <div className="mt-3 px-2 space-y-1">
                <Link href="/subscription">
                  <a className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-muted focus:outline-none">
                    <Settings className="inline-block h-5 w-5 mr-3" />
                    Account Settings
                  </a>
                </Link>
                <button
                  className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-muted focus:outline-none w-full text-left"
                  onClick={handleLogout}
                >
                  <LogOut className="inline-block h-5 w-5 mr-3" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

interface NavLinkProps {
  href: string;
  icon?: React.ReactNode;
  isActive: boolean;
  children: React.ReactNode;
}

function NavLink({ href, icon, isActive, children }: NavLinkProps) {
  return (
    <Link href={href}>
      <a
        className={cn(
          "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md",
          isActive
            ? "text-primary bg-primary/10"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        )}
      >
        {icon && <span className="mr-1.5">{icon}</span>}
        {children}
      </a>
    </Link>
  );
}

interface MobileNavLinkProps {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}

function MobileNavLink({ href, isActive, children }: MobileNavLinkProps) {
  return (
    <Link href={href}>
      <a
        className={cn(
          "flex items-center px-3 py-2 rounded-md text-base font-medium",
          isActive
            ? "text-primary bg-primary/10"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        )}
      >
        {children}
      </a>
    </Link>
  );
}