import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useGuestMode } from "@/hooks/use-guest-mode";
import { Menu, X, Moon, Sun, User, LogOut, Rocket, FileText, Briefcase, Home, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import gsap from "gsap";

export default function Navbar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { isGuestMode } = useGuestMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Set to true for cosmic theme
  
  const navbarRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Logo animation
    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
    
    // Nav items staggered animation
    if (navItemsRef.current.length > 0) {
      gsap.fromTo(
        navItemsRef.current,
        { opacity: 0, y: -15 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.4, 
          stagger: 0.1, 
          ease: "power2.out",
          delay: 0.2
        }
      );
    }
    
    // User menu animation
    if (userMenuRef.current) {
      gsap.fromTo(
        userMenuRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, delay: 0.4, ease: "back.out(1.7)" }
      );
    }
    
    // Create a mouse trail effect on navbar
    const createTrailParticle = (e: MouseEvent) => {
      if (!navbarRef.current) return;
      
      const particle = document.createElement('div');
      particle.className = 'trail-particle';
      
      // Set position at mouse cursor
      particle.style.left = `${e.clientX}px`;
      particle.style.top = `${e.clientY}px`;
      
      document.body.appendChild(particle);
      
      // Animate and remove
      gsap.to(particle, {
        opacity: 0,
        scale: 0,
        duration: 0.8,
        onComplete: () => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        }
      });
    };
    
    // Add mouse trail only when moving within the navbar
    const handleMouseMove = (e: MouseEvent) => {
      // Only create particles occasionally to avoid performance issues
      if (Math.random() > 0.8) {
        createTrailParticle(e);
      }
    };
    
    const navbar = navbarRef.current;
    if (navbar) {
      navbar.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      if (navbar) {
        navbar.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  // Remove the conditional rendering check so navbar shows for both guests and logged-in users

  // Always show the navbar - for both logged in users and guests
  const navItems = [
    { path: "/", label: "Dashboard", icon: <Home className="h-4 w-4 mr-1" /> },
    { path: "/resumes", label: "Resumes", icon: <FileText className="h-4 w-4 mr-1" /> },
    { path: "/resume-builder", label: "Resume Builder", icon: <FileText className="h-4 w-4 mr-1" /> },
    { path: "/job-finder", label: "Job Finder", icon: <Briefcase className="h-4 w-4 mr-1" /> },
  ];

  // For Guest Mode or authenticated users
  let initials = "GU"; // Default Guest User
  if (user) {
    initials = user.username
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  function toggleDarkMode() {
    setDarkMode(!darkMode);
    // Implementation would go here if we add dark mode support
  }

  function handleLogout() {
    logoutMutation.mutate();
  }
  
  // Get icon color based on active state
  function getIconColor(isActive: boolean) {
    return isActive ? "text-blue-400" : "text-gray-400"; 
  }

  return (
    <nav 
      className="cosmic-navbar"
      ref={navbarRef}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div 
              className="flex-shrink-0 flex items-center"
              ref={logoRef}
            >
              <Link 
                href="/" 
                className="flex items-center cosmic-text-gradient font-bold text-xl cursor-pointer"
              >
                <Rocket className="mr-2 h-5 w-5" />
                AIreHire
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-6">
              {navItems.map((item, index) => (
                <Link 
                  key={item.path} 
                  href={item.path}
                  ref={el => navItemsRef.current[index] = el}
                  className={`${
                    location === item.path
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-gray-300 hover:border-gray-500 hover:text-gray-100"
                  } inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium cursor-pointer transition-colors duration-200`}
                >
                  <span className={getIconColor(location === item.path)}>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div 
            className="hidden sm:ml-6 sm:flex sm:items-center"
            ref={userMenuRef}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="ml-3 text-gray-300 hover:text-white hover:bg-white/10"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-3 relative">
                  <Avatar className="h-8 w-8 cosmic-glow">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="cosmic-card border-white/10 py-2">
                {user ? (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-300 font-medium border-b border-white/10 mb-1">
                      {user.username}
                    </div>
                    <DropdownMenuItem className="cursor-pointer text-gray-200 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white">
                      <User className="mr-2 h-4 w-4 text-blue-400" /> 
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem 
                      onClick={handleLogout} 
                      className="cursor-pointer text-red-400 hover:bg-red-900/20 hover:text-red-300 focus:bg-red-900/20 focus:text-red-300"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> 
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-300 font-medium border-b border-white/10 mb-1">
                      Guest Mode
                    </div>
                    <DropdownMenuItem 
                      onClick={() => window.location.href = "/auth?tab=login"}
                      className="cursor-pointer text-blue-400 hover:bg-blue-900/20 hover:text-blue-300 focus:bg-blue-900/20 focus:text-blue-300"
                    >
                      <LogIn className="mr-2 h-4 w-4" /> 
                      Log In
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => window.location.href = "/auth?tab=register"}
                      className="cursor-pointer text-green-400 hover:bg-green-900/20 hover:text-green-300 focus:bg-green-900/20 focus:text-green-300"
                    >
                      <User className="mr-2 h-4 w-4" /> 
                      Sign Up
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10"
              aria-label="Open main menu"
            >
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-black/50 backdrop-blur-lg cosmic-nebula shadow-lg">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                className={`${
                  location === item.path
                    ? "bg-blue-900/30 border-blue-500 text-blue-300"
                    : "border-transparent text-gray-300 hover:bg-white/5 hover:border-gray-400 hover:text-gray-100"
                } flex items-center pl-3 pr-4 py-3 border-l-4 text-base font-medium cursor-pointer`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className={`${getIconColor(location === item.path)} mr-3`}>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-white/10">
            <div className="flex items-center px-4 py-2">
              <div className="flex-shrink-0">
                <Avatar className="h-10 w-10 cosmic-glow">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-200">
                  {user ? user.username : "Guest Mode"}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="ml-auto text-gray-300 hover:text-white hover:bg-white/10"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              </Button>
            </div>
            <div className="mt-3 space-y-1">
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    className="flex w-full items-center text-left px-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/10"
                  >
                    <User className="mr-3 h-5 w-5 text-blue-400" />
                    Your Profile
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="flex w-full items-center text-left px-4 py-2 text-base font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => window.location.href = "/auth?tab=login"}
                    className="flex w-full items-center text-left px-4 py-2 text-base font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                  >
                    <LogIn className="mr-3 h-5 w-5" />
                    Log In
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => window.location.href = "/auth?tab=register"}
                    className="flex w-full items-center text-left px-4 py-2 text-base font-medium text-green-400 hover:text-green-300 hover:bg-green-900/20"
                  >
                    <User className="mr-3 h-5 w-5" />
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
