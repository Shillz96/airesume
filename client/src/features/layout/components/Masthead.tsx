import React from 'react';
import { Link, useLocation } from 'wouter';
import { User, Moon, Sun, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useUnifiedTheme } from '@/contexts/UnifiedThemeContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

export function Masthead() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { mode, setMode } = useUnifiedTheme();
  
  const isHomePage = location === '/home' || location === '/';
  
  function handleLogout() {
    logoutMutation.mutate();
  }
  
  const handleThemeToggle = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  };
  
  // Determine background based on route
  const bgClasses = isHomePage 
    ? 'bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10'
    : 'bg-background';

  return (
    <div className={`${bgClasses} relative overflow-hidden`}>
      {/* Starfield background on home page */}
      {isHomePage && (
        <div className="absolute inset-0 z-0">
          {/* CosmicStarfield component would be here */}
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
            {user ? (
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-semibold gap-2"
                >
                  <User size={16} />
                  {user.username}
                </Button>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Settings size={18} />
                      <span className="sr-only">Settings</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2">
                    <div className="space-y-1">
                      <div className="px-2 py-1.5 text-sm font-semibold">Appearance</div>
                      <Button variant="ghost" size="sm" onClick={handleThemeToggle} className="w-full justify-start gap-2">
                        {mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />} Toggle Theme
                      </Button>
                      <Separator />
                      <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start gap-2">
                        <LogOut size={16} /> Logout
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm" className="font-semibold">
                  Login
                </Button>
              </Link>
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

export default Masthead;