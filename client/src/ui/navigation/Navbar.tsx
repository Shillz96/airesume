import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useAuthDialog } from "@/hooks/use-auth-dialog";
import { useUnifiedTheme } from "@/contexts/UnifiedThemeContext";
import { Button } from "@/ui/core/Button";
import {
  Menu,
  X,
  Moon,
  Sun,
  User,
  LogOut,
  FileText,
  LayoutTemplate,
  Home,
  LogIn,
  CreditCard,
  Search,
  ChevronDown
} from "lucide-react";

/**
 * Responsive navigation bar component that adapts to different screen sizes
 * and provides access to various features of the application
 * 
 * Includes user authentication state, dark mode toggle, and mobile-friendly menu
 */
export default function Navbar() {
  console.log("USING SIMPLIFIED NAVBAR FROM ui/navigation/Navbar.tsx!");
  
  // Added to log that component is loaded for debugging
  useEffect(() => {
    console.log("Navbar mounted from ui/navigation/Navbar.tsx");
  }, []);
  
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { openLogin, openRegister } = useAuthDialog();
  const { isDarkMode, toggleDarkMode } = useUnifiedTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { label: "Dashboard", path: "/dashboard", icon: <Home size={20} /> },
    { label: "Resumes", path: "/resumes", icon: <FileText size={20} /> },
    { label: "Resume Builder", path: "/resume-builder", icon: <LayoutTemplate size={20} /> },
    { label: "Job Finder", path: "/job-finder", icon: <Search size={20} /> },
    { label: "Subscription", path: "/subscription", icon: <CreditCard size={20} /> },
  ];

  // Simple function to handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Use React state for dropdown toggle
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border shadow-sm">
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
        <div className="md:hidden mt-2 pt-2 pb-4 bg-gray-800">
          <div className="space-y-1 px-2">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location === item.path
                    ? "bg-blue-900/30 border-l-4 border-blue-500 text-blue-300"
                    : "border-l-4 border-transparent text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center">
                  <span className={`${location === item.path ? "text-blue-400" : "text-gray-400"} mr-3`}>
                    {item.icon}
                  </span>
                  {item.label}
                </span>
              </a>
            ))}

            <div className="pt-4 mt-4 border-t border-gray-700">
              <div className="flex items-center px-3 py-2">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {initials}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-300">
                    {user ? user.username : "Guest Mode"}
                  </div>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className="ml-auto p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10"
                >
                  {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                </button>
              </div>
              
              <div className="mt-3 space-y-1 px-2">
                {user ? (
                  <>
                    <a
                      href="/profile"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-white/10 hover:text-white"
                    >
                      <span className="flex items-center">
                        <User className="mr-3 h-5 w-5 text-blue-400" />
                        Your Profile
                      </span>
                    </a>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-red-900/20"
                    >
                      <span className="flex items-center">
                        <LogOut className="mr-3 h-5 w-5" />
                        Sign out
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openLogin();
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-400 hover:bg-blue-900/20"
                    >
                      <span className="flex items-center">
                        <LogIn className="mr-3 h-5 w-5" />
                        Log In
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openRegister();
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-green-400 hover:bg-green-900/20"
                    >
                      <span className="flex items-center">
                        <User className="mr-3 h-5 w-5" />
                        Sign Up
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}