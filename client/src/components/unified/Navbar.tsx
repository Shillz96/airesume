import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useAuthDialog } from "@/hooks/use-auth-dialog";
import { UnifiedButton } from "./Button";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { UnifiedContainer } from "./Container";
import { UnifiedText } from "./Text";
import { useUnifiedTheme } from "@/contexts/UnifiedThemeContext";
import {
  Menu,
  X,
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

/**
 * Unified Navbar Component
 * 
 * A responsive navigation bar that adapts to different screen sizes and provides
 * access to various features of the application. Uses the unified theme system
 * for consistent styling.
 * 
 * Features:
 * - Responsive design (mobile and desktop layouts)
 * - User authentication state integration
 * - Theme switcher integration
 * - Dropdown menu for user actions
 * - Consistent styling with theme system
 */
export function UnifiedNavbar() {
  console.log("USING UNIFIED NAVBAR FROM components/unified/Navbar.tsx!");
  
  // Added to log that component is loaded for debugging
  useEffect(() => {
    console.log("Unified Navbar mounted from components/unified/Navbar.tsx");
  }, []);
  
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { openLogin, openRegister } = useAuthDialog();
  const { config, isDarkMode } = useUnifiedTheme();
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

  // Theme-specific classes
  const getNavClasses = () => {
    return cn(
      "fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b shadow-sm",
      config.variant === 'cosmic' && isDarkMode ? 'bg-card/60 border-[#223]' : 'bg-card/80 border-border',
      config.variant === 'professional' ? 'border-muted-foreground/20' : '',
      config.variant === 'minimal' ? 'bg-background/90 border-border/50' : ''
    );
  };

  // Get active nav item classes
  const getNavItemClasses = (isActive: boolean) => {
    return cn(
      "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
      isActive 
        ? cn(
            "text-primary", 
            config.variant === 'cosmic' ? 'bg-primary/20' : 'bg-primary/10'
          )
        : cn(
            "text-foreground/80 hover:text-foreground",
            config.variant === 'cosmic' ? 'hover:bg-card/80' : 'hover:bg-card'
          )
    );
  };

  return (
    <nav className={getNavClasses()}>
      <UnifiedContainer>
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex-shrink-0 flex items-center">
              {config.variant === 'cosmic' ? (
                <span className="text-xl font-semibold animate-cosmic-shine bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                  AIreHire
                </span>
              ) : (
                <span className="text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  AIreHire
                </span>
              )}
            </a>
            
            {/* Desktop Menu */}
            <div className="hidden md:ml-8 md:flex md:space-x-4">
              {navItems.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  className={getNavItemClasses(location === item.path)}
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
            {/* Theme Switcher (compact mode) */}
            <ThemeSwitcher compact buttonVariant="ghost" />

            {/* Profile Button */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={cn(
                  "flex items-center space-x-2 p-2 rounded-md transition-colors",
                  config.variant === 'cosmic' 
                    ? 'hover:bg-card/80' 
                    : 'hover:bg-card'
                )}
              >
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center",
                  config.variant === 'cosmic' 
                    ? 'bg-primary/30 text-primary-foreground' 
                    : 'bg-primary/20 text-primary'
                )}>
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
                <div className={cn(
                  "absolute right-0 mt-2 w-48 py-2 rounded-md shadow-lg border z-10",
                  config.variant === 'cosmic' 
                    ? 'bg-card/95 backdrop-blur border-border/50' 
                    : 'bg-card border-border'
                )}>
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-sm text-foreground/70">
                        Signed in as <span className="font-medium text-foreground">{user.username}</span>
                      </div>
                      <div className="border-t border-border my-1"></div>
                      <a href="/profile" className={cn(
                        "flex items-center px-4 py-2 text-sm text-foreground/80",
                        config.variant === 'cosmic' 
                          ? 'hover:bg-primary/20 hover:text-primary-foreground' 
                          : 'hover:bg-primary/10 hover:text-primary'
                      )}>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </a>
                      <a href="/subscription" className={cn(
                        "flex items-center px-4 py-2 text-sm text-foreground/80",
                        config.variant === 'cosmic' 
                          ? 'hover:bg-primary/20 hover:text-primary-foreground' 
                          : 'hover:bg-primary/10 hover:text-primary'
                      )}>
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
                        className={cn(
                          "flex w-full items-center px-4 py-2 text-sm", 
                          config.variant === 'cosmic' 
                            ? 'text-primary/90 hover:bg-primary/20 hover:text-primary-foreground' 
                            : 'text-primary/80 hover:bg-primary/10 hover:text-primary'
                        )}
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
              className={cn(
                "inline-flex items-center justify-center p-2 rounded-md transition-colors",
                config.variant === 'cosmic' 
                  ? 'text-foreground/80 hover:text-foreground hover:bg-card/80' 
                  : 'text-foreground/70 hover:text-foreground hover:bg-card'
              )}
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
      </UnifiedContainer>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className={cn(
          "md:hidden pt-2 pb-4",
          config.variant === 'cosmic' && isDarkMode 
            ? 'bg-card/95 backdrop-blur' 
            : isDarkMode ? 'bg-card' : 'bg-gray-100'
        )}>
          <div className="space-y-1 px-2">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  location === item.path
                    ? cn(
                        "border-l-4",
                        config.variant === 'cosmic' 
                          ? 'bg-primary/20 border-primary text-primary-foreground' 
                          : 'bg-primary/10 border-primary text-primary'
                      )
                    : cn(
                        "border-l-4 border-transparent",
                        config.variant === 'cosmic' 
                          ? 'text-foreground/90 hover:bg-card/80 hover:text-foreground' 
                          : 'text-foreground/80 hover:bg-card hover:text-foreground'
                      )
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center">
                  <span className={cn(
                    "mr-3",
                    location === item.path 
                      ? 'text-primary' 
                      : 'text-foreground/60'
                  )}>
                    {item.icon}
                  </span>
                  {item.label}
                </span>
              </a>
            ))}

            <div className={cn(
              "pt-4 mt-4 border-t",
              config.variant === 'cosmic' 
                ? 'border-border/30' 
                : 'border-border'
            )}>
              <div className="flex items-center px-3 py-2">
                <div className="flex-shrink-0">
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center text-white font-bold",
                    config.variant === 'cosmic' 
                      ? 'bg-gradient-to-r from-primary to-secondary' 
                      : 'bg-gradient-to-r from-primary to-accent'
                  )}>
                    {initials}
                  </div>
                </div>
                <div className="ml-3">
                  <UnifiedText size="sm" weight="medium">
                    {user ? user.username : "Guest Mode"}
                  </UnifiedText>
                </div>
                <div className="ml-auto">
                  <ThemeSwitcher compact buttonSize="sm" />
                </div>
              </div>
              
              <div className="mt-3 space-y-1 px-2">
                {user ? (
                  <>
                    <a
                      href="/profile"
                      className={cn(
                        "block px-3 py-2 rounded-md text-base font-medium",
                        config.variant === 'cosmic' 
                          ? 'text-foreground/90 hover:bg-primary/20 hover:text-primary-foreground' 
                          : 'text-foreground/80 hover:bg-primary/10 hover:text-primary'
                      )}
                    >
                      <span className="flex items-center">
                        <User className={cn(
                          "mr-3 h-5 w-5",
                          config.variant === 'cosmic' 
                            ? 'text-primary-foreground' 
                            : 'text-primary'
                        )} />
                        Your Profile
                      </span>
                    </a>
                    <button
                      onClick={handleLogout}
                      className={cn(
                        "block w-full text-left px-3 py-2 rounded-md text-base font-medium",
                        "text-error/90 hover:bg-error/10 hover:text-error"
                      )}
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
                      className={cn(
                        "block w-full text-left px-3 py-2 rounded-md text-base font-medium",
                        config.variant === 'cosmic' 
                          ? 'text-primary/90 hover:bg-primary/20 hover:text-primary-foreground' 
                          : 'text-primary/80 hover:bg-primary/10 hover:text-primary'
                      )}
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
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-success/80 hover:bg-success/10 hover:text-success"
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

export default UnifiedNavbar;