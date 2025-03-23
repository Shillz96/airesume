import React from 'react';
import { useLocation, Link } from 'wouter';
import { Rocket, LogOut } from 'lucide-react';
import { useUnifiedTheme } from '../../contexts/UnifiedThemeContext';
import { useAuth } from '../../hooks/use-auth';
import MobileMenu from './MobileMenu';
import ThemeSwitcher from './ThemeSwitcher';

/**
 * Unified Navbar component
 * 
 * This component provides a consistent navigation experience
 * that adapts to both desktop and mobile views.
 * It supports theme switching and authentication actions.
 */
export default function Navbar() {
  console.log("USING UNIFIED NAVBAR FROM components/unified/Navbar.tsx!");
  
  const [location] = useLocation();
  const { config } = useUnifiedTheme();
  const { user, logoutMutation } = useAuth();
  
  // Prevent multiple navbar X from showing
  const isMobileMenuOpen = React.useRef(false);
  
  React.useEffect(() => {
    console.log("Unified Navbar mounted from components/unified/Navbar.tsx");
  }, []);

  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center">
        {/* Logo and Brand */}
        <div className="flex gap-2 items-center font-semibold mr-4">
          {config.variant === 'cosmic' ? (
            <Rocket className="text-primary h-6 w-6 animate-pulse" />
          ) : (
            <Rocket className="text-primary h-6 w-6" />
          )}
          <span className={config.variant === 'cosmic' ? 'cosmic-text-gradient text-xl' : 'text-xl'}>
            AIreHire
          </span>
        </div>

        {/* Desktop Navigation - Hidden on Mobile */}
        <nav className="hidden md:flex items-center gap-6 flex-1">
          <Link href="/dashboard" className={`text-sm transition-colors hover:text-foreground ${
            location === '/dashboard' ? 'text-foreground font-medium' : 'text-muted-foreground'
          }`}>
            Dashboard
          </Link>
          <Link href="/resumes" className={`text-sm transition-colors hover:text-foreground ${
            location === '/resumes' ? 'text-foreground font-medium' : 'text-muted-foreground'
          }`}>
            Resumes
          </Link>
          <Link href="/job-finder" className={`text-sm transition-colors hover:text-foreground ${
            location === '/job-finder' ? 'text-foreground font-medium' : 'text-muted-foreground'
          }`}>
            Find Jobs
          </Link>
          <Link href="/subscription" className={`text-sm transition-colors hover:text-foreground ${
            location === '/subscription' ? 'text-foreground font-medium' : 'text-muted-foreground'
          }`}>
            Subscription
          </Link>
        </nav>
        
        {/* Right Side Actions */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Theme Switcher - Hidden on Mobile */}
          <div className="hidden md:block">
            <ThemeSwitcher />
          </div>
          
          {/* User Menu - Hidden on Mobile */}
          {user && (
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium">{user.username}</span>
              </div>
              
              <button 
                onClick={handleLogout}
                className="p-2 text-muted-foreground hover:text-foreground"
                aria-label="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
          
          {/* Mobile Menu */}
          <MobileMenu className="md:hidden" />
        </div>
      </div>
    </header>
  );
}