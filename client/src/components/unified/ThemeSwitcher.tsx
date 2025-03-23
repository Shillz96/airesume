import React, { useState } from 'react';
import { Moon, Sun, Laptop } from 'lucide-react';
import { useUnifiedTheme } from '../../contexts/UnifiedThemeContext';

/**
 * ThemeSwitcher component
 * 
 * Allows users to toggle between dark mode, light mode, and system preference
 * with a stylish dropdown menu that matches the current theme.
 */
export default function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { config, setMode } = useUnifiedTheme();
  
  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  // Close dropdown when user selects an option
  const handleModeChange = (mode: 'dark' | 'light' | 'system') => {
    setMode(mode);
    setIsOpen(false);
  };
  
  // Get icon based on current mode
  const getCurrentIcon = () => {
    switch (config.mode) {
      case 'dark':
        return <Moon size={18} />;
      case 'light':
        return <Sun size={18} />;
      case 'system':
        return <Laptop size={18} />;
      default:
        return <Moon size={18} />;
    }
  };
  
  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={toggleDropdown}
        className="p-2 rounded-md hover:bg-muted/30 transition-colors flex items-center gap-2 text-sm"
        aria-label="Toggle theme"
      >
        {getCurrentIcon()}
      </button>
      
      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop for closing when clicking outside */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Dropdown content */}
          <div className="absolute right-0 mt-2 z-50 w-40 bg-card border border-border rounded-md shadow-lg overflow-hidden">
            <div className="py-1">
              <button
                onClick={() => handleModeChange('light')}
                className={`flex items-center gap-2 w-full px-4 py-2 text-sm ${
                  config.mode === 'light' 
                    ? 'text-primary bg-primary/10' 
                    : 'text-foreground hover:bg-muted/30'
                }`}
              >
                <Sun size={16} />
                <span>Light</span>
              </button>
              <button
                onClick={() => handleModeChange('dark')}
                className={`flex items-center gap-2 w-full px-4 py-2 text-sm ${
                  config.mode === 'dark' 
                    ? 'text-primary bg-primary/10' 
                    : 'text-foreground hover:bg-muted/30'
                }`}
              >
                <Moon size={16} />
                <span>Dark</span>
              </button>
              <button
                onClick={() => handleModeChange('system')}
                className={`flex items-center gap-2 w-full px-4 py-2 text-sm ${
                  config.mode === 'system' 
                    ? 'text-primary bg-primary/10' 
                    : 'text-foreground hover:bg-muted/30'
                }`}
              >
                <Laptop size={16} />
                <span>System</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}