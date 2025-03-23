import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

/**
 * Unified Theme Context
 * 
 * This is the single, centralized theme system that powers all UI components.
 * It merges functionality from both previous theme implementations to provide
 * a unified API for theme management across the application.
 */

// Theme Types
export type ThemeVariant = 'cosmic' | 'professional' | 'minimal' | 'vibrant' | 'tint'; 
export type ThemeMode = 'dark' | 'light' | 'system';
export type ThemeAppearance = ThemeMode; // For backward compatibility

// Event interface for theme change notifications
export interface ThemeChangeEventDetail {
  isDarkMode: boolean;
}

// Extend Window interface for our custom theme change event
declare global {
  interface WindowEventMap {
    'theme-change': CustomEvent<ThemeChangeEventDetail>;
  }
}

// Theme Configuration Interface
export interface ThemeConfig {
  variant: ThemeVariant;
  mode: ThemeMode;
  primaryColor: string;
  secondaryColor: string;
  borderRadius: number;
  animations: boolean;
  colors: Record<string, string>;
}

// Parameters for partial theme updates
export interface ThemeUpdateParams {
  variant?: ThemeVariant;
  mode?: ThemeMode;
  appearance?: ThemeAppearance; // For backward compatibility
  primaryColor?: string;
  primary?: string; // For backward compatibility
  secondaryColor?: string;
  borderRadius?: number;
  radius?: number; // For backward compatibility
  animations?: boolean;
  colors?: Record<string, string>;
}

// Theme Context Interface
interface ThemeContextType {
  // Current theme state
  config: ThemeConfig;
  currentTheme: ThemeConfig; // For backward compatibility
  
  // Theme state flags
  isDarkMode: boolean;
  isSystemTheme: boolean;
  
  // Theme changing functions
  setVariant: (variant: ThemeVariant) => void;
  setMode: (mode: ThemeMode) => void;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  setBorderRadius: (radius: number) => void;
  setAnimations: (enabled: boolean) => void;
  toggleDarkMode: () => void;
  
  // Legacy compatibility functions
  setThemeVariant: (variant: ThemeVariant) => void;
  setThemeAppearance: (appearance: ThemeAppearance) => void;
  setThemeRadius: (radius: number) => void;
  updateThemeSettings: (updates: ThemeUpdateParams) => void;
  
  // Utility functions
  getThemeClass: (component: string) => string;
  getThemeVar: (variableName: string) => string;
  getCurrentVariant: () => ThemeVariant;
  getCurrentAppearance: () => ThemeAppearance;
  getCosmicColor: (colorName: string) => string;
  getVariantClasses: (
    professionalClasses: string,
    vibrantClasses: string,
    tintClasses: string,
    minimalClasses?: string,
    cosmicClasses?: string
  ) => string;
  getTextColorClass: () => string;
  getBackgroundClass: () => string;
  getCardBackgroundClass: () => string;
  getButtonClass: (variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive') => string;
}

// Default colors for the application
const defaultColors = {
  // Core colors
  background: '#050A18',
  foreground: '#ffffff',
  card: '#0A1428',
  cardHover: '#0F1A30',
  muted: '#6b7280',
  mutedForeground: '#9ca3af',
  
  // Brand colors
  primary: '#4f46e5', // Indigo-600
  secondary: '#10b981', // Emerald-500
  accent: '#10b981',
  
  // UI element colors
  border: 'rgba(255, 255, 255, 0.1)',
  input: 'rgba(255, 255, 255, 0.1)',
  ring: 'rgba(59, 130, 246, 0.5)',
  
  // Status colors
  destructive: '#ef4444',
  destructiveForeground: '#ffffff',
  success: '#10b981',
  successForeground: '#ffffff',
  warning: '#f59e0b',
  warningForeground: '#ffffff',
  error: '#ef4444',
  errorForeground: '#ffffff',
  info: '#3b82f6',
  infoForeground: '#ffffff',
  
  // Additional UI elements
  popover: '#0A1428',
  popoverForeground: '#ffffff',
  
  // Gradient definitions
  gradientPrimary: 'linear-gradient(135deg, #4f46e5, #8b5cf6)',
  gradientAccent: 'linear-gradient(135deg, #10b981, #3b82f6)',
  gradientBackground: 'linear-gradient(135deg, #050A18, #0A1428)'
};

// Default theme configuration
const defaultTheme: ThemeConfig = {
  variant: 'cosmic',
  mode: 'dark',
  primaryColor: '#4f46e5', // Indigo-600 - more vibrant and professional
  secondaryColor: '#10b981', // Emerald-500 - creates an attractive contrast
  borderRadius: 0.75, // Slightly more rounded corners
  animations: true,
  colors: defaultColors
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
  
  // Legacy compatibility functions
  const setThemeVariant = (variant: ThemeVariant) => {
    setVariant(variant);
  };
  
  const setThemeAppearance = (appearance: ThemeAppearance) => {
    setMode(appearance);
  };
  
  const setThemeRadius = (radius: number) => {
    setBorderRadius(radius);
  };
  
  const updateThemeSettings = (updates: ThemeUpdateParams) => {
    const newConfig = { ...config };
    
    if (updates.variant) {
      newConfig.variant = updates.variant;
    }
    
    if (updates.mode) {
      newConfig.mode = updates.mode;
    } else if (updates.appearance) {
      // Handle legacy appearance property
      newConfig.mode = updates.appearance;
    }
    
    if (updates.primaryColor) {
      newConfig.primaryColor = updates.primaryColor;
    } else if (updates.primary) {
      // Handle legacy primary property
      newConfig.primaryColor = updates.primary;
    }
    
    if (updates.borderRadius !== undefined) {
      newConfig.borderRadius = updates.borderRadius;
    } else if (updates.radius !== undefined) {
      // Handle legacy radius property
      newConfig.borderRadius = updates.radius;
    }
    
    if (updates.colors) {
      newConfig.colors = { ...newConfig.colors, ...updates.colors };
    }
    
    setConfig(newConfig);
  };
  
  // Utility functions for backwards compatibility
  const getThemeVar = (variableName: string): string => {
    return `var(--${variableName})`;
  };
  
  const getCurrentVariant = (): ThemeVariant => {
    return config.variant;
  };
  
  const getCurrentAppearance = (): ThemeAppearance => {
    return config.mode;
  };
  
  const getCosmicColor = (colorName: string): string => {
    if (!colorName) return "";
    
    const { colors } = config;
    if (!colors) return "";
    
    // Handle dot notation for nested colors
    if (colorName.includes('.')) {
      const parts = colorName.split('.');
      let current: any = colors;
      
      // Navigate through nested properties
      for (const part of parts) {
        if (current && typeof current === 'object' && part in current) {
          current = current[part];
        } else {
          return ""; // Return empty string if path doesn't exist
        }
      }
      
      // Return the color if it's a string
      return typeof current === 'string' ? current : "";
    }
    
    // Simple property access
    return typeof colors[colorName] === 'string' ? colors[colorName] : "";
  };
  
  const getVariantClasses = (
    professionalClasses: string,
    vibrantClasses: string,
    tintClasses: string,
    minimalClasses?: string,
    cosmicClasses?: string
  ): string => {
    const currentVariant = config.variant;
    
    if (currentVariant === "cosmic" && cosmicClasses) {
      return cosmicClasses;
    } else if (currentVariant === "vibrant") {
      return vibrantClasses;
    } else if (currentVariant === "tint") {
      return tintClasses;
    } else if (currentVariant === "minimal" && minimalClasses) {
      return minimalClasses;
    } else {
      // Default to professional
      return professionalClasses;
    }
  };
  
  const getTextColorClass = (): string => {
    return isDarkMode ? "text-white" : "text-gray-900";
  };
  
  const getBackgroundClass = (): string => {
    if (isDarkMode) {
      return "bg-[#050A18] cosmic-background";
    } else {
      return "bg-white";
    }
  };
  
  const getCardBackgroundClass = (): string => {
    return isDarkMode 
      ? "cosmic-card"
      : "bg-white border border-gray-200 shadow rounded-lg";
  };
  
  const getButtonClass = (variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'): string => {
    switch (variant) {
      case 'primary':
        return 'cosmic-button-primary';
      case 'secondary':
        return 'cosmic-button-secondary';
      case 'outline':
        return 'cosmic-button-outline';
      case 'ghost':
        return 'cosmic-button-ghost';
      case 'destructive':
        return 'cosmic-button-destructive';
      default:
        return 'cosmic-button-primary';
    }
  };
  
  // Create backwards compatible currentTheme property
  const currentTheme: ThemeConfig = {
    ...config,
    // Add these for backward compatibility
    primary: config.primaryColor,
    appearance: config.mode,
    radius: config.borderRadius,
  } as any;
  
  // Determine if system theme is active
  const isSystemTheme = config.mode === 'system';
  
  // Combine state and functions for context value
  const contextValue: ThemeContextType = {
    config,
    currentTheme,
    isDarkMode,
    isSystemTheme,
    setVariant,
    setMode,
    setPrimaryColor,
    setSecondaryColor,
    setBorderRadius,
    setAnimations,
    toggleDarkMode,
    getThemeClass,
    
    // Legacy compatibility functions
    setThemeVariant,
    setThemeAppearance,
    setThemeRadius,
    updateThemeSettings,
    
    // Utility functions
    getThemeVar,
    getCurrentVariant,
    getCurrentAppearance,
    getCosmicColor,
    getVariantClasses,
    getTextColorClass,
    getBackgroundClass,
    getCardBackgroundClass,
    getButtonClass
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