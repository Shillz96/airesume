import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { Moon, Sun, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { isDarkMode } from "@/lib/theme-utils";
import gsap from "gsap";

// CSS for the stars and trail effects should be added to index.css

export default function Masthead() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(isDarkMode());
  const tabsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  
  const initials = user?.username ? user.username.substring(0, 2).toUpperCase() : "AI";

  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Resume Builder", path: "/resume-builder" },
    { label: "Resumes", path: "/resumes" },
    { label: "Job Finder", path: "/job-finder" },
  ];

  function toggleDarkMode() {
    setDarkMode(!darkMode);
    // In a real implementation, this would update the theme in theme.json
  }

  function handleLogout() {
    logoutMutation.mutate();
  }

  // GSAP Cosmic Trail Effect
  useEffect(() => {
    // Skip animation setup if tabs refs aren't ready
    if (!tabsRef.current || tabsRef.current.length === 0) return;

    tabsRef.current.forEach((tab) => {
      if (!tab) return;
      
      tab.addEventListener("mouseenter", (e) => {
        // Create a trail particle
        const trail = document.createElement("div");
        trail.className = "trail-particle";
        document.body.appendChild(trail);

        gsap.to(trail, {
          x: e.clientX,
          y: e.clientY,
          scale: 0,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => trail.remove(),
        });

        // Glow effect on tab
        gsap.to(tab, {
          boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)",
          duration: 0.3,
        });
      });

      tab.addEventListener("mouseleave", () => {
        gsap.to(tab, {
          boxShadow: "none",
          duration: 0.3,
        });
      });

      tab.addEventListener("mousemove", (e) => {
        const trail = document.createElement("div");
        trail.className = "trail-particle";
        document.body.appendChild(trail);

        gsap.to(trail, {
          x: e.clientX,
          y: e.clientY,
          scale: 0,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => trail.remove(),
        });
      });
    });

    // Cleanup event listeners
    return () => {
      tabsRef.current.forEach((tab) => {
        if (!tab) return;
        
        tab.removeEventListener("mouseenter", () => {});
        tab.removeEventListener("mouseleave", () => {});
        tab.removeEventListener("mousemove", () => {});
      });
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 shadow-lg bg-gradient-to-br from-[hsl(219,90%,10%)] to-[hsl(260,90%,10%)] text-white">
      <div className="relative overflow-hidden">
        {/* Starfield Background */}
        <div className="starfield absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="star absolute bg-white rounded-full"
              style={{
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.2,
                animation: `twinkle ${Math.random() * 3 + 2}s infinite`,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link 
                  href="/" 
                  className="text-white font-bold text-xl cursor-pointer relative hover:text-transparent bg-clip-text bg-gradient-to-r from-[hsl(210,100%,60%)] to-[hsl(260,100%,60%)] transition-all duration-300"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  AIreHire
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item, index) => (
                  <Link 
                    key={item.path} 
                    href={item.path}
                    ref={(el) => (tabsRef.current[index] = el)}
                    className={`
                      relative inline-flex items-center px-3 py-2 text-sm font-medium cursor-pointer transition-all duration-300
                      ${location === item.path
                        ? "text-white border-b-2 border-[hsl(210,100%,60%)]"
                        : "text-gray-300 border-transparent hover:text-white"}
                    `}
                  >
                    {item.label}
                    <span className={`absolute inset-x-0 bottom-0 h-0.5 bg-[hsl(210,100%,60%)] transform origin-left transition-transform duration-300 ${
                      location === item.path ? "scale-x-100" : "scale-x-0"
                    }`} />
                  </Link>
                ))}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="ml-3 hover:bg-white/10"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-3 relative group">
                    <Avatar className="h-8 w-8 transition-all duration-300 group-hover:ring-2 group-hover:ring-[hsl(210,100%,60%)]">
                      <AvatarFallback className="bg-[hsl(221.2,83.2%,53.3%)] text-white">{initials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="backdrop-blur-md bg-opacity-20 bg-black border border-white/10">
                  <DropdownMenuItem className="cursor-pointer hover:bg-white/10">
                    <User className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-white/10"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="-mr-2 flex items-center sm:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center hover:bg-white/10"
                aria-label="Open main menu"
              >
                <span className={`block h-0.5 w-5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`block h-0.5 w-5 bg-white my-1 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 w-5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-black/40 backdrop-blur-md">
            <div className="pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={`
                    block pl-3 pr-4 py-2 text-base font-medium cursor-pointer transition-all duration-300
                    ${location === item.path
                      ? "text-white border-l-4 border-[hsl(210,100%,60%)] bg-white/10"
                      : "text-gray-300 border-l-4 border-transparent hover:bg-white/5 hover:border-white/30 hover:text-white"}
                  `}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-white/10">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-[hsl(221.2,83.2%,53.3%)] text-white">{initials}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">{user?.username}</div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleDarkMode}
                  className="ml-auto hover:bg-white/10"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                </Button>
              </div>
              <div className="mt-3 space-y-1">
                <Button
                  variant="ghost"
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/10"
                >
                  Your Profile
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-red-400 hover:text-red-300 hover:bg-white/10"
                >
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}