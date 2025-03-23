import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

/**
 * Unified Theme Context
 * 
 * This is a complete rebuild of the theme system to provide a single, consistent
 * approach to theming throughout the application.
 */

// Theme Types
export type ThemeVariant = 'cosmic' | 'professional' | 'minimal';
export type ThemeMode = 'dark' | 'light' | 'system';

// Theme Configuration Interface
export interface ThemeConfig {
  variant: ThemeVariant;
  mode: ThemeMode;
  primaryColor: string;
  secondaryColor: string;
  borderRadius: number;
  animations: boolean;
}

// Theme Context Interface
interface ThemeContextType {
  // Current theme state
  config: ThemeConfig;
  
  // Theme state flags
  isDarkMode: boolean;
  
  // Theme changing functions
  setVariant: (variant: ThemeVariant) => void;
  setMode: (mode: ThemeMode) => void;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  setBorderRadius: (radius: number) => void;
  setAnimations: (enabled: boolean) => void;
  toggleDarkMode: () => void;
  
  // Utility functions
  getThemeClass: (component: string) => string;
}

// Default theme configuration
const defaultTheme: ThemeConfig = {
  variant: 'cosmic',
  mode: 'dark',
  primaryColor: '#3b82f6',
  secondaryColor: '#8b5cf6',
  borderRadius: 0.5,
  animations: true,
};

// Create the context with default values
const ThemeContext = createContext<ThemeContextType>({
  config: defaultTheme,
  isDarkMode: true,
  setVariant: () => {},
  setMode: () => {},
  setPrimaryColor: () => {},
  setSecondaryColor: () => {},
  setBorderRadius: () => {},
  setAnimations: () => {},
  toggleDarkMode: () => {},
  getThemeClass: () => "",
});

/**
 * Theme Provider Component
 * 
 * Provides theme configuration and functions to all child components
 */
export function UnifiedThemeProvider({ children }: { children: ReactNode }) {
  // Theme configuration state
  const [config, setConfig] = useState<ThemeConfig>(() => {
    // Try to load from localStorage
    try {
      const saved = localStorage.getItem('unified-theme');
      return saved ? JSON.parse(saved) : defaultTheme;
    } catch (e) {
      console.error('Failed to parse saved theme:', e);
      return defaultTheme;
    }
  });
  
  // Dark mode state - depends on theme mode and system preference
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Effect to apply theme configuration to DOM
  useEffect(() => {
    // Cache in localStorage
    localStorage.setItem('unified-theme', JSON.stringify(config));
    
    // Apply theme to document root
    applyThemeToDOM(config);
    
    // Calculate dark mode based on config and system preference
    updateDarkModeState(config.mode);
    
    // Add listener for system preference changes if using system theme
    if (config.mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e: MediaQueryListEvent) => updateDarkModeState('system');
      
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [config]);
  
  /**
   * Updates dark mode state based on theme mode and system preference
   */
  const updateDarkModeState = (mode: ThemeMode) => {
    if (mode === 'dark') {
      setIsDarkMode(true);
    } else if (mode === 'light') {
      setIsDarkMode(false);
    } else {
      // System mode - check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  };
  
  /**
   * Applies theme configuration to the DOM
   */
  const applyThemeToDOM = (config: ThemeConfig) => {
    const root = document.documentElement;
    
    // Set data-attributes for CSS selectors
    root.setAttribute('data-theme-variant', config.variant);
    
    // Set theme mode class
    if (config.mode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else if (config.mode === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      // System mode - apply based on system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
      root.classList.toggle('light', !prefersDark);
    }
    
    // Set CSS variables
    
    // Primary color
    root.style.setProperty('--primary', config.primaryColor);
    
    // Convert primary color to RGB for use in rgba() functions
    const primaryRgb = hexToRgb(config.primaryColor);
    if (primaryRgb) {
      root.style.setProperty('--primary-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
    }
    
    // Secondary color
    root.style.setProperty('--secondary', config.secondaryColor);
    
    // Convert secondary color to RGB for use in rgba() functions
    const secondaryRgb = hexToRgb(config.secondaryColor);
    if (secondaryRgb) {
      root.style.setProperty('--secondary-rgb', `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`);
    }
    
    // Border radius
    root.style.setProperty('--radius', `${config.borderRadius}rem`);
    root.style.setProperty('--button-radius', `${config.borderRadius}rem`);
    
    // Animation control
    root.style.setProperty('--animation-speed', config.animations ? '1' : '0');
    
    // Apply theme variant class
    root.classList.remove('theme-cosmic', 'theme-professional', 'theme-minimal');
    root.classList.add(`theme-${config.variant}`);
    
    // Variant-specific properties
    if (config.variant === 'cosmic') {
      root.style.setProperty('--animation-speed', config.animations ? '1.2' : '0');
      root.style.setProperty('--card-glow', 'var(--shadow-cosmic)');
      root.style.setProperty('--animation-emphasis', '1');
    } else if (config.variant === 'professional') {
      root.style.setProperty('--animation-speed', config.animations ? '0.8' : '0');
      root.style.setProperty('--card-glow', 'none');
      root.style.setProperty('--animation-emphasis', '0.5');
    } else if (config.variant === 'minimal') {
      root.style.setProperty('--animation-speed', config.animations ? '0.5' : '0');
      root.style.setProperty('--card-glow', 'none');
      root.style.setProperty('--animation-emphasis', '0');
    }
  };
  
  // Theme changing functions
  const setVariant = (variant: ThemeVariant) => {
    setConfig({ ...config, variant });
  };
  
  const setMode = (mode: ThemeMode) => {
    setConfig({ ...config, mode });
  };
  
  const setPrimaryColor = (primaryColor: string) => {
    setConfig({ ...config, primaryColor });
  };
  
  const setSecondaryColor = (secondaryColor: string) => {
    setConfig({ ...config, secondaryColor });
  };
  
  const setBorderRadius = (borderRadius: number) => {
    setConfig({ ...config, borderRadius });
  };
  
  const setAnimations = (animations: boolean) => {
    setConfig({ ...config, animations });
  };
  
  const toggleDarkMode = () => {
    if (config.mode === 'dark') {
      setConfig({ ...config, mode: 'light' });
    } else if (config.mode === 'light') {
      setConfig({ ...config, mode: 'dark' });
    } else {
      // If system, explicitly set to opposite of current system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setConfig({ ...config, mode: prefersDark ? 'light' : 'dark' });
    }
  };
  
  /**
   * Returns appropriate CSS classes for components based on current theme
   */
  const getThemeClass = (component: string): string => {
    const { variant } = config;
    
    // Generate component-specific classes based on theme variant
    switch (component) {
      case 'button':
        return variant === 'cosmic' ? 'cosmic-button cosmic-glow' : 
               variant === 'professional' ? 'professional-button' : 
               'minimal-button';
               
      case 'card':
        return variant === 'cosmic' ? 'cosmic-card cosmic-glow' : 
               variant === 'professional' ? 'professional-card' : 
               'minimal-card';
               
      case 'input':
        return variant === 'cosmic' ? 'cosmic-input' : 
               variant === 'professional' ? 'professional-input' : 
               'minimal-input';
      
      case 'text':
        return variant === 'cosmic' ? 'cosmic-text' : 
               variant === 'professional' ? 'professional-text' : 
               'minimal-text';
      
      case 'header':
        return variant === 'cosmic' ? 'cosmic-header' : 
               variant === 'professional' ? 'professional-header' : 
               'minimal-header';
               
      // Add more component variants as needed
      
      default:
        return '';
    }
  };
  
  // Combine state and functions for context value
  const contextValue: ThemeContextType = {
    config,
    isDarkMode,
    setVariant,
    setMode,
    setPrimaryColor,
    setSecondaryColor,
    setBorderRadius,
    setAnimations,
    toggleDarkMode,
    getThemeClass,
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to use the theme context
 */
export function useUnifiedTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useUnifiedTheme must be used within a UnifiedThemeProvider');
  }
  return context;
}

/**
 * Helper function to convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Handle shorthand (e.g. #fff)
  if (hex.length === 3) {
    hex = hex.split('').map(x => x + x).join('');
  }
  
  // Validate hex format
  if (!/^[0-9A-F]{6}$/i.test(hex)) {
    return null;
  }
  
  // Parse hex
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  
  return { r, g, b };
}