import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  ThemeVariant, 
  ThemeAppearance, 
  ThemeConfig,
  ThemeUpdateParams,
  getThemeConfig,
  THEME_VARIANTS,
  THEME_APPEARANCES
} from '@/lib/theme-utils';
import { initializeTheme, updateTheme, toggleDarkMode } from '@/lib/theme-loader';

// Define the shape of our theme context
interface ThemeContextType {
  // Current theme state
  currentTheme: ThemeConfig;
  
  // Theme changing functions
  setThemeVariant: (variant: ThemeVariant) => void;
  setThemeAppearance: (appearance: ThemeAppearance) => void;
  setPrimaryColor: (color: string) => void;
  setThemeRadius: (radius: number) => void;
  updateThemeSettings: (updates: ThemeUpdateParams) => void;
  toggleDarkMode: () => void;
  
  // Theme state flags
  isDarkMode: boolean;
  isSystemTheme: boolean;
}

// Create the theme context with default values
const ThemeContext = createContext<ThemeContextType>({
  currentTheme: {
    variant: 'professional',
    primary: '#3b82f6',
    appearance: 'system',
    radius: 0.5,
    colors: {}
  },
  setThemeVariant: () => {},
  setThemeAppearance: () => {},
  setPrimaryColor: () => {},
  setThemeRadius: () => {},
  updateThemeSettings: () => {},
  toggleDarkMode: () => {},
  isDarkMode: false,
  isSystemTheme: true
});

// Hook for consuming the theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Function to determine if dark mode is active
function isDarkModeActive(): boolean {
  // Check if dark class is on html element
  const htmlElement = document.documentElement;
  return htmlElement.classList.contains('dark');
}

// Provider component to wrap application with
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize with the current theme from theme.json
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(getThemeConfig());
  const [isDarkMode, setIsDarkMode] = useState<boolean>(isDarkModeActive());
  
  // Initialize theme when component mounts
  useEffect(() => {
    initializeTheme();
    setIsDarkMode(isDarkModeActive());

    // Listen for theme change events from outside this component
    const handleThemeChange = (e: CustomEvent<{ isDarkMode: boolean }>) => {
      setIsDarkMode(e.detail.isDarkMode);
    };

    window.addEventListener('theme-change', handleThemeChange as EventListener);
    
    return () => {
      window.removeEventListener('theme-change', handleThemeChange as EventListener);
    };
  }, []);
  
  // Theme setting functions
  const setThemeVariant = (variant: ThemeVariant) => {
    updateTheme({ variant });
    setCurrentTheme(prev => ({ ...prev, variant }));
  };
  
  const setThemeAppearance = (appearance: ThemeAppearance) => {
    updateTheme({ appearance });
    setCurrentTheme(prev => ({ ...prev, appearance }));
    
    // Update dark mode state based on new appearance
    if (appearance === 'dark') {
      setIsDarkMode(true);
    } else if (appearance === 'light') {
      setIsDarkMode(false);
    } else {
      // For 'system', check the system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  };
  
  const setPrimaryColor = (primary: string) => {
    updateTheme({ primary });
    setCurrentTheme(prev => ({ ...prev, primary }));
  };
  
  const setThemeRadius = (radius: number) => {
    updateTheme({ radius });
    setCurrentTheme(prev => ({ ...prev, radius }));
  };
  
  const updateThemeSettings = (updates: ThemeUpdateParams) => {
    updateTheme(updates);
    setCurrentTheme(prev => ({ ...prev, ...updates }));
    
    // If appearance is being updated, update dark mode state
    if (updates.appearance) {
      if (updates.appearance === 'dark') {
        setIsDarkMode(true);
      } else if (updates.appearance === 'light') {
        setIsDarkMode(false);
      }
    }
  };
  
  const handleToggleDarkMode = () => {
    toggleDarkMode();
    setIsDarkMode(isDarkModeActive());
  };
  
  const contextValue: ThemeContextType = {
    currentTheme,
    setThemeVariant,
    setThemeAppearance,
    setPrimaryColor,
    setThemeRadius,
    updateThemeSettings,
    toggleDarkMode: handleToggleDarkMode,
    isDarkMode,
    isSystemTheme: currentTheme.appearance === 'system'
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Optional: Create theme consumer component for class components
export const ThemeConsumer = ThemeContext.Consumer;