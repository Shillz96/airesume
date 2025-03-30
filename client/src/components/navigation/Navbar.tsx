import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useAuthDialog } from "@/hooks/use-auth-dialog";
import { useUnifiedTheme } from "@/contexts/UnifiedThemeContext";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

/**
 * Responsive navigation bar component that adapts to different screen sizes
 * and provides access to various features of the application
 * 
 * Includes user authentication state, dark mode toggle, and mobile-friendly menu
 */
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { mode, setMode } = useUnifiedTheme();
  const { user, logoutMutation } = useAuth();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { openLogin, openRegister } = useAuthDialog();

  // Handle logout click
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine effective mode for display/toggle logic
  const [effectiveMode, setEffectiveMode] = useState(mode);

  useEffect(() => {
    let currentMode = mode;
    if (mode === 'system') {
      currentMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    setEffectiveMode(currentMode);

    if (mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        setEffectiveMode(mediaQuery.matches ? 'dark' : 'light');
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [mode]);

  // Toggle function using setMode
  const handleToggleDarkMode = () => {
    const newMode = effectiveMode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    setEffectiveMode(newMode); // Update local state immediately
  };

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

  // Update location comparisons to use string paths
  const isActivePath = (path: string) => location === path;

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

  useEffect(() => {
    const navbar = document.querySelector('.navbar');
    const handleScroll = () => {
      if (window.scrollY > 50) {
        gsap.to(navbar, { height: '60px', duration: 0.3, ease: 'power1.out' });
      } else {
        gsap.to(navbar, { height: '80px', duration: 0.3, ease: 'power1.out' });
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="navbar cosmic-navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <a href="/" className="flex items-center">
            <span className="text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AIreHire
            </span>
          </a>
        </div>
            
        {/* Desktop Menu */}
        <div className="navbar-links hidden md:flex">
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={cn(
                "navbar-link flex items-center gap-2 no-blur",
                isActivePath(item.path)
                  ? "active"
                  : ""
              )}
            >
              <span className={cn(
                "transition-colors",
                isActivePath(item.path)
                  ? "text-blue-600 dark:text-sky-500"
                  : "text-muted-foreground"
              )}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </a>
          ))}
        </div>

        {/* Right side actions */}
        <div className="navbar-actions">
          {/* Dark mode toggle */}
          <button
            onClick={handleToggleDarkMode}
            className="p-2 rounded-md text-muted-foreground hover:text-blue-600 dark:hover:text-sky-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={effectiveMode === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
          >
            {effectiveMode === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Profile Button */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center text-white font-semibold">
                {initials}
              </div>
              {user && (
                <>
                  <span className="text-sm font-medium text-foreground hidden lg:block">{user.username}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </>
              )}
            </button>

            {/* Profile Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 py-1 solid-card rounded-lg shadow-xl border border-border z-10">
                {user ? (
                  <>
                    <div className="px-4 py-2 text-sm text-muted-foreground no-blur">
                      Signed in as <span className="font-medium text-foreground">{user.username}</span>
                    </div>
                    <div className="border-t border-border my-1 mx-1"></div>
                    <a href="/profile" className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-sky-500 rounded-md mx-1 no-blur">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </a>
                    <a href="/subscription" className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-sky-500 rounded-md mx-1 no-blur">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Subscription
                    </a>
                    <div className="border-t border-border my-1 mx-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-destructive hover:bg-destructive/10 hover:text-red-600 rounded-md mx-1 no-blur"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-2 text-sm text-muted-foreground font-medium no-blur">
                      Guest Mode
                    </div>
                    <div className="border-t border-border my-1 mx-1"></div>
                    <button
                      onClick={openLogin}
                      className="flex w-full items-center px-4 py-2 text-sm text-blue-600 dark:text-sky-500 hover:bg-blue-500/10 dark:hover:bg-sky-500/10 rounded-md mx-1 no-blur"
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Log In
                    </button>
                    <button
                      onClick={openRegister}
                      className="flex w-full items-center px-4 py-2 text-sm text-green-600 dark:text-green-500 hover:bg-green-500/10 dark:hover:bg-green-500/10 rounded-md mx-1 no-blur"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-blue-600 dark:hover:text-sky-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-controls="mobile-menu"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: isMobileMenuOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="md:hidden solid-card border-t border-slate-200/20 dark:border-gray-700/20"
        id="mobile-menu"
      >
        <div className="px-4 pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium no-blur",
                isActivePath(item.path)
                  ? "text-blue-600 dark:text-sky-500 bg-blue-500/10 dark:bg-sky-500/10"
                  : "text-muted-foreground hover:text-blue-600 dark:hover:text-sky-500"
              )}
            >
              <span className={cn(
                isActivePath(item.path)
                  ? "text-blue-600 dark:text-sky-500"
                  : "text-muted-foreground"
              )}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </a>
          ))}
          
          <div className="border-t border-slate-200/20 dark:border-gray-700/20 my-2"></div>
          
          {!user ? (
            <div className="flex flex-col gap-2 mt-3">
              <Button variant="default" onClick={openLogin} className="w-full justify-center">
                <LogIn className="mr-2 h-4 w-4" />
                Log In
              </Button>
              <Button variant="outline" onClick={openRegister} className="w-full justify-center">
                <User className="mr-2 h-4 w-4" />
                Sign Up
              </Button>
            </div>
          ) : (
            <Button variant="destructive" onClick={handleLogout} className="w-full justify-center mt-3">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          )}
        </div>
      </motion.div>
    </nav>
  );
}