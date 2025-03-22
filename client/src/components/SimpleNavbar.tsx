import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useAuthDialog } from "@/hooks/use-auth-dialog";
import { useTheme } from "@/contexts/ThemeContext";

// Icons
import {
  Home,
  FileText,
  LayoutTemplate,
  Search,
  CreditCard,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Sun,
  User,
  X
} from "lucide-react";

// Simple Navbar with minimal styling and vanilla JavaScript for dropdown
export default function SimpleNavbar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { openLogin, openRegister } = useAuthDialog();
  const { isDarkMode, toggleDarkMode } = useTheme();
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

  // Toggle profile dropdown manually with vanilla JavaScript
  const toggleProfileDropdown = () => {
    const dropdown = document.getElementById('profile-dropdown');
    if (dropdown) {
      dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest('#profile-dropdown') && !target.closest('#profile-button')) {
        const dropdown = document.getElementById('profile-dropdown');
        if (dropdown) dropdown.style.display = 'none';
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-gray-900 text-white py-2 px-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/" className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            AIreHire
          </a>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={`flex items-center space-x-1 px-3 py-2 rounded ${
                location === item.path
                  ? "text-blue-400 bg-blue-500/10"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className={location === item.path ? "text-blue-400" : "text-gray-400"}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </a>
          ))}
        </div>

        {/* Right side actions */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Dark mode toggle */}
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-white/10"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Profile Button */}
          <div className="relative">
            <button
              id="profile-button"
              onClick={toggleProfileDropdown}
              className="flex items-center space-x-2 p-2 rounded-full hover:bg-white/10"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                {initials}
              </div>
            </button>

            {/* Profile Dropdown */}
            <div 
              id="profile-dropdown"
              className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 py-1"
              style={{ display: 'none', zIndex: 50 }}
            >
              {user ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-300 font-medium border-b border-gray-700">
                    {user.username}
                  </div>
                  <a href="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center">
                    <User className="mr-2 h-4 w-4 text-blue-400" /> 
                    Profile
                  </a>
                  <a href="/subscription" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center">
                    <CreditCard className="mr-2 h-4 w-4 text-purple-400" /> 
                    Subscription
                  </a>
                  <div className="border-t border-gray-700 my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/20"
                  >
                    <span className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" /> 
                      Logout
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <div className="px-4 py-2 text-sm text-gray-300 font-medium border-b border-gray-700">
                    Guest Mode
                  </div>
                  <button 
                    onClick={openLogin}
                    className="block w-full text-left px-4 py-2 text-sm text-blue-400 hover:bg-blue-900/20"
                  >
                    <span className="flex items-center">
                      <LogIn className="mr-2 h-4 w-4" /> 
                      Log In
                    </span>
                  </button>
                  <button
                    onClick={openRegister}
                    className="block w-full text-left px-4 py-2 text-sm text-green-400 hover:bg-green-900/20"
                  >
                    <span className="flex items-center">
                      <User className="mr-2 h-4 w-4" /> 
                      Sign Up
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
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