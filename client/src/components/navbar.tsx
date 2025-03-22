import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useGuestMode } from "@/hooks/use-guest-mode";
import { useAuthDialog } from "@/hooks/use-auth-dialog";
import { Menu, X, Moon, Sun, User, LogOut, Rocket, FileText, Briefcase, Home, LogIn, CreditCard, Search } from "lucide-react";
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
  const { openLogin, openRegister } = useAuthDialog();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Load dark mode preference from local storage
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : true;
  });

  const navbarRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const particleCountRef = useRef(0);

  // Persist dark mode preference
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Animations and mouse trail effect
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
          delay: 0.2,
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

    // Mobile menu animation
    if (mobileMenuRef.current) {
      gsap.fromTo(
        mobileMenuRef.current,
        { x: "100%", opacity: 0 },
        {
          x: "0%",
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
          when: mobileMenuOpen ? "enter" : "exit",
        }
      );
    }

    // Mouse trail effect with optimization
    const createTrailParticle = (e: MouseEvent) => {
      if (!navbarRef.current || particleCountRef.current >= 20) return;
      particleCountRef.current += 1;

      const particle = document.createElement("div");
      particle.className = "trail-particle";
      particle.style.left = `${e.clientX}px`;
      particle.style.top = `${e.clientY}px`;
      particle.style.background = `hsl(${Math.random() * 360}, 70%, 70%)`;
      particle.style.width = `${Math.random() * 4 + 2}px`;
      particle.style.height = particle.style.width;

      document.body.appendChild(particle);

      gsap.to(particle, {
        opacity: 0,
        scale: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
            particleCountRef.current -= 1;
          }
        },
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.8) {
        requestAnimationFrame(() => createTrailParticle(e));
      }
    };

    const navbar = navbarRef.current;
    if (navbar) {
      navbar.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (navbar) {
        navbar.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [mobileMenuOpen]);

  // Show dashboard items for both logged-in and guest users
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <Home className="h-4 w-4 mr-1" /> },
    { path: "/resumes", label: "Resumes", icon: <FileText className="h-4 w-4 mr-1" /> },
    { path: "/resume-builder", label: "Resume Builder", icon: <Briefcase className="h-4 w-4 mr-1" /> },
    { path: "/job-finder", label: "Job Finder", icon: <Search className="h-4 w-4 mr-1" /> },
    { path: "/subscription", label: "Subscription", icon: <CreditCard className="h-4 w-4 mr-1" /> },
  ];

  // Get user initials
  let initials = "GU"; // Default Guest User
  if (user) {
    initials = user.username
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  }

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    setMobileMenuOpen(false);
  };

  const getIconColor = (isActive: boolean) => {
    return isActive ? "text-blue-400" : "text-gray-400";
  };

  return (
    <nav
      className="cosmic-navbar fixed top-0 left-0 right-0 z-40 bg-black/50 backdrop-blur-lg shadow-lg border-b border-white/10"
      ref={navbarRef}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="content-container max-w-7xl mx-auto" style={{ 
        paddingLeft: "var(--space-4)",
        paddingRight: "var(--space-4)"
      }}>
        <div className="flex justify-between" style={{ height: "var(--space-16)" }}>
          {/* Left side - logo */}
          <div 
            className="flex-shrink-0 flex items-center"
            ref={logoRef}
          >
            <Link 
              href={user ? "/dashboard" : "/"} 
              className="flex items-center cosmic-text-gradient font-bold text-xl cursor-pointer"
              aria-label="AIreHire Home"
            >
              <Rocket className="mr-2 h-5 w-5" />
              AIreHire
            </Link>
          </div>
          
          {/* Center - main navigation */}
          <div className="hidden sm:flex flex-1 justify-center">
            <div className="flex items-center space-x-8">
              {navItems.map((item, index) => (
                <a 
                  key={item.path} 
                  href={item.path}
                  ref={(el) => (navItemsRef.current[index] = el)}
                  className={`${
                    location === item.path
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-gray-300 hover:border-gray-500 hover:text-gray-100"
                  } inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium cursor-pointer transition-colors duration-200`}
                  aria-current={location === item.path ? "page" : undefined}
                >
                  <span className={getIconColor(location === item.path)}>{item.icon}</span>
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right side - user menu */}
          <div 
            className="hidden sm:ml-6 sm:flex sm:items-center"
            ref={userMenuRef}
            style={{ position: 'relative', zIndex: 90 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="ml-3 text-gray-300 hover:text-white hover:bg-white/10"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-3 relative" aria-label="User menu" style={{ position: 'relative', zIndex: 100 }}>
                  <Avatar className="h-8 w-8 cosmic-glow" style={{ position: 'relative', zIndex: 100 }}>
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="cosmic-card border-white/10 py-2" style={{ zIndex: 9999, position: 'absolute' }}>
                {user ? (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-300 font-medium border-b border-white/10 mb-1">
                      {user.username}
                    </div>
                    <DropdownMenuItem className="cursor-pointer text-gray-200 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white">
                      <User className="mr-2 h-4 w-4 text-blue-400" /> 
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <a 
                        href="/subscription"
                        className="cursor-pointer text-gray-200 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white w-full flex items-center"
                      >
                        <CreditCard className="mr-2 h-4 w-4 text-purple-400" /> 
                        Subscription
                      </a>
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
                    <DropdownMenuItem asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start cursor-pointer text-blue-400 hover:bg-blue-900/20 hover:text-blue-300 focus:bg-blue-900/20 focus:text-blue-300"
                        onClick={openLogin}
                      >
                        <LogIn className="mr-2 h-4 w-4" /> 
                        Log In
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start cursor-pointer text-green-400 hover:bg-green-900/20 hover:text-green-300 focus:bg-green-900/20 focus:text-green-300"
                        onClick={openRegister}
                      >
                        <User className="mr-2 h-4 w-4" /> 
                        Sign Up
                      </Button>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu toggle */}
          <div className="-mr-2 flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10"
              aria-label={mobileMenuOpen ? "Close main menu" : "Open main menu"}
              aria-expanded={mobileMenuOpen}
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
        <div
          className="sm:hidden bg-gradient-to-b from-blue-900/80 to-purple-900/80 backdrop-blur-lg shadow-lg border-t border-white/10"
          ref={mobileMenuRef}
        >
          <div style={{ 
            paddingTop: "var(--space-2)", 
            paddingBottom: "var(--space-3)", 
            display: "flex", 
            flexDirection: "column", 
            gap: "var(--space-1)" 
          }}>
            {navItems.map((item) => (
              <a 
                key={item.path} 
                href={item.path}
                className={`${
                  location === item.path
                    ? "bg-blue-900/30 border-blue-500 text-blue-300"
                    : "border-transparent text-gray-300 hover:bg-white/10 hover:border-gray-400 hover:text-gray-100"
                } flex items-center pl-3 pr-4 py-3 border-l-4 text-base font-medium cursor-pointer transition-colors duration-200`}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={location === item.path ? "page" : undefined}
              >
                <span className={`${getIconColor(location === item.path)} mr-3`}>{item.icon}</span>
                {item.label}
              </a>
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
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
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
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openLogin();
                    }}
                    className="flex w-full items-center text-left px-4 py-2 text-base font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                  >
                    <LogIn className="mr-3 h-5 w-5" />
                    Log In
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openRegister();
                    }}
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