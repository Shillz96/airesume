import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Menu, X, Moon, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  if (!user) return null;

  const initials = user.username
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/resumes", label: "Resumes" },
    { path: "/resume-builder", label: "Resume Builder" },
    { path: "/job-finder", label: "Job Finder" },
  ];

  function toggleDarkMode() {
    setDarkMode(!darkMode);
    // Implementation would go here if we add dark mode support
  }

  function handleLogout() {
    logoutMutation.mutate();
  }

  return (
    <nav className="bg-white border-b border-secondary-200 fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="text-primary-600 font-bold text-xl cursor-pointer">ResumeAI</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <a className={`${
                    location === item.path
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-secondary-500 hover:border-secondary-300 hover:text-secondary-700"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer`}>
                    {item.label}
                  </a>
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="ml-3"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-3 relative">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary-500 text-white">{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center"
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
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a
                  className={`${
                    location === item.path
                      ? "bg-primary-50 border-primary-500 text-primary-700"
                      : "border-transparent text-secondary-600 hover:bg-secondary-50 hover:border-secondary-300 hover:text-secondary-700"
                  } block pl-3 pr-4 py-2 border-l-4 text-base font-medium cursor-pointer`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-secondary-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary-500 text-white">{initials}</AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-secondary-800">{user.username}</div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="ml-auto"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              </Button>
            </div>
            <div className="mt-3 space-y-1">
              <Button
                variant="ghost"
                className="block w-full text-left px-4 py-2 text-base font-medium text-secondary-500 hover:text-secondary-800 hover:bg-secondary-100"
              >
                Your Profile
              </Button>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-base font-medium text-secondary-500 hover:text-secondary-800 hover:bg-secondary-100"
              >
                Sign out
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
