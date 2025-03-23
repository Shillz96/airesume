import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useAuthDialog } from "@/hooks/use-auth-dialog";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";

// Icons
import {
  Home,
  FileText,
  LayoutTemplate,
  Search,
  CreditCard,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Sun,
  User,
  X,
  ChevronDown
} from "lucide-react";

/**
 * Modern SimpleNavbar component with updated styling to match the new theme
 */
export default function SimpleNavbar() {
  console.log("USING SIMPLIFIED NAVBAR FROM navbar.tsx!");
  
  // Added to alert that component is loaded for debugging
  useEffect(() => {
    console.log("SimpleNavbar mounted from navbar.tsx");
  }, []);
  
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { openLogin, openRegister } = useAuthDialog();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calculate user initials for avatar
  const initials = user
    ? user.username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "G";

  // Navigation items
  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <Home size={18} /> },
    { label: "Resumes", path: "/resumes", icon: <FileText size={18} /> },
    { label: "Resume Builder", path: "/resume-builder", icon: <LayoutTemplate size={18} /> },
    { label: "Job Finder", path: "/job-finder", icon: <Search size={18} /> },
    { label: "Subscription", path: "/subscription", icon: <CreditCard size={18} /> },
  ];

  // Simple function to handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-card/80 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AIreHire
              </span>
            </a>
            
            {/* Desktop Menu */}
            <div className="hidden md:ml-8 md:flex md:space-x-4">
              {navItems.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location === item.path
                      ? "text-primary bg-primary/10"
                      : "text-foreground/80 hover:text-foreground hover:bg-card"
                  }`}
                >
                  <span className={location === item.path ? "text-primary" : "text-foreground/60"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md text-foreground/70 hover:text-foreground hover:bg-card transition-colors"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Profile Button */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-card transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  {initials}
                </div>
                {user && (
                  <>
                    <span className="text-sm font-medium hidden lg:block">{user.username}</span>
                    <ChevronDown className="h-4 w-4 text-foreground/70" />
                  </>
                )}
              </button>

              {/* Profile Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 py-2 bg-card rounded-md shadow-lg border border-border z-10">
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-sm text-foreground/70">
                        Signed in as <span className="font-medium text-foreground">{user.username}</span>
                      </div>
                      <div className="border-t border-border my-1"></div>
                      <a href="/profile" className="flex items-center px-4 py-2 text-sm text-foreground/80 hover:bg-primary/10 hover:text-primary">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </a>
                      <a href="/subscription" className="flex items-center px-4 py-2 text-sm text-foreground/80 hover:bg-primary/10 hover:text-primary">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Subscription
                      </a>
                      <div className="border-t border-border my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm text-error/80 hover:bg-error/10 hover:text-error"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 text-sm text-foreground/70 font-medium">
                        Guest Mode
                      </div>
                      <div className="border-t border-border my-1"></div>
                      <button
                        onClick={openLogin}
                        className="flex w-full items-center px-4 py-2 text-sm text-primary/80 hover:bg-primary/10 hover:text-primary"
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        Log In
                      </button>
                      <button
                        onClick={openRegister}
                        className="flex w-full items-center px-4 py-2 text-sm text-success/80 hover:bg-success/10 hover:text-success"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Sign Up
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground/70 hover:text-foreground hover:bg-card transition-colors"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  location === item.path
                    ? "text-primary bg-primary/10"
                    : "text-foreground/80 hover:text-foreground hover:bg-accent/5"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className={`mr-3 ${location === item.path ? "text-primary" : "text-foreground/60"}`}>
                  {item.icon}
                </span>
                {item.label}
              </a>
            ))}
            
            <div className="border-t border-border my-2 pt-2">
              <div className="flex items-center px-3 py-2">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                  {initials}
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium">
                    {user ? user.username : "Guest Mode"}
                  </div>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className="ml-auto p-2 rounded-md text-foreground/70 hover:text-foreground hover:bg-accent/5"
                >
                  {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
              </div>
              
              <div className="mt-3 space-y-1 px-2">
                {user ? (
                  <>
                    <a
                      href="/profile"
                      className="flex items-center px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:bg-primary/10 hover:text-primary"
                    >
                      <User className="mr-3 h-5 w-5" />
                      Your Profile
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-error/80 hover:bg-error/10 hover:text-error"
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      Sign out
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2 p-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openLogin();
                      }}
                      className="w-full"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Log In
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openRegister();
                      }}
                      className="w-full"
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}