import React from 'react';
import { Link, useLocation } from 'wouter';
import { User, Moon, Sun, LogOut, Settings } from 'lucide-react';
import { Button } from '@/ui/core/Button';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/contexts/ThemeContext';
import CosmicStarfield from '@/ui/theme/CosmicStarfield';

export default function Masthead() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  const isHomePage = location === '/home' || location === '/';
  
  function handleLogout() {
    logoutMutation.mutate();
  }
  
  // Determine background based on route
  const bgClasses = isHomePage 
    ? 'bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10'
    : 'bg-background';

  return (
    <div className={`${bgClasses} relative overflow-hidden`}>
      {/* Starfield background on home page */}
      {isHomePage && (
        <div className="absolute inset-0 z-0">
          <CosmicStarfield 
            starsCount={70} 
            nebulasCount={2} 
            shootingStarsEnabled={true} 
          />
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Left Side: Logo and Title */}
          <div className="flex items-center">
            <Link href="/home">
              <a className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                  A
                </div>
                <div className="ml-3">
                  <h1 className="text-xl md:text-2xl font-bold text-foreground">AIreHire</h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    AI-powered career management
                  </p>
                </div>
              </a>
            </Link>
          </div>
          
          {/* Right Side: User Menu */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              iconLeft={isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              className="text-muted-foreground hover:text-foreground"
            >
              <span className="sr-only md:not-sr-only">
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </span>
            </Button>
            
            {user ? (
              <div className="flex items-center space-x-2">
                <Link href="/subscription">
                  <a className="md:inline-flex items-center px-3 py-1.5 border border-primary/30 rounded-full text-xs font-medium text-primary bg-primary/5 hover:bg-primary/10">
                    <Settings className="h-3 w-3 mr-1" />
                    Account
                  </a>
                </Link>
                
                <Button
                  variant="ghost"
                  size="sm"
                  iconLeft={<User className="h-4 w-4" />}
                  className="bg-primary/5 text-foreground hidden md:flex"
                >
                  {user.username}
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  iconLeft={<LogOut className="h-4 w-4" />}
                  className="text-muted-foreground"
                >
                  <span className="sr-only">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth">
                  <a className="inline-flex items-center px-3 py-1.5 border border-primary rounded-md text-sm font-medium text-primary hover:bg-primary/10">
                    Login
                  </a>
                </Link>
                <Link href="/auth?tab=register">
                  <a className="inline-flex items-center px-3 py-1.5 bg-primary border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary/90">
                    Sign Up
                  </a>
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Page Title and Description - conditionally rendered for home page */}
        {isHomePage && (
          <div className="text-center mt-12 mb-8 max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Your Career, <span className="text-primary">Elevated</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              AI-powered resume building, job matching, and application tracking in one platform.
            </p>
            
            {!user && (
              <div className="mt-8">
                <Link href="/auth?tab=register">
                  <a className="inline-flex items-center px-5 py-2.5 bg-primary border border-transparent rounded-md text-base font-medium text-white hover:bg-primary/90 shadow-lg shadow-primary/20">
                    Get Started
                  </a>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}