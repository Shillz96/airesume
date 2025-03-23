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
  // Initialize with the current theme from theme.json, but with a safe copy to avoid circular references
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(() => {
    const config = getThemeConfig();
    // Create a safe copy without potential circular references
    return {
      variant: config.variant || 'professional',
      primary: config.primary || '#3b82f6',
      appearance: config.appearance || 'system',
      radius: config.radius || 0.5,
      colors: config.colors ? JSON.parse(JSON.stringify(config.colors)) : {}
    };
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(isDarkModeActive());
  
  // We only need to listen for theme change events, not initialize the theme again
  // The theme is already initialized in main.tsx before the App renders
  useEffect(() => {
    // Set the initial dark mode state
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
    // Create a safe copy to avoid potential circular references
    setCurrentTheme(prev => {
      const newTheme = { ...prev };
      newTheme.variant = variant;
      return newTheme;
    });
  };
  
  const setThemeAppearance = (appearance: ThemeAppearance) => {
    updateTheme({ appearance });
    // Create a safe copy to avoid potential circular references
    setCurrentTheme(prev => {
      const newTheme = { ...prev };
      newTheme.appearance = appearance;
      return newTheme;
    });
    
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
    // Create a safe copy to avoid potential circular references
    setCurrentTheme(prev => {
      const newTheme = { ...prev };
      newTheme.primary = primary;
      return newTheme;
    });
  };
  
  const setThemeRadius = (radius: number) => {
    updateTheme({ radius });
    // Create a safe copy to avoid potential circular references
    setCurrentTheme(prev => {
      const newTheme = { ...prev };
      newTheme.radius = radius;
      return newTheme;
    });
  };
  
  const updateThemeSettings = (updates: ThemeUpdateParams) => {
    updateTheme(updates);
    
    // Create a safe copy of updates to avoid circular references
    const safeUpdates: ThemeUpdateParams = { ...updates };
    
    // Handle colors separately to avoid potential circular references
    if (updates.colors) {
      try {
        safeUpdates.colors = JSON.parse(JSON.stringify(updates.colors));
      } catch (err) {
        // If there's a circular reference, use a simpler approach
        console.warn('Error parsing colors, using simplified approach');
        safeUpdates.colors = { ...updates.colors };
      }
    }
    
    setCurrentTheme(prev => ({ ...prev, ...safeUpdates }));
    
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