import React, { ReactNode, useContext } from 'react';
import { 
  useUnifiedTheme, 
  ThemeVariant, 
  ThemeAppearance, 
  ThemeConfig, 
  ThemeUpdateParams,
  ThemeMode
} from './UnifiedThemeContext';

/**
 * COMPATIBILITY LAYER
 * 
 * This file provides backward compatibility with the old ThemeContext.
 * It redirects all calls to the new UnifiedThemeContext to ensure 
 * a single source of truth for theme management.
 * 
 * This file should be considered DEPRECATED and will be removed in a future update.
 * All components should migrate to use `useUnifiedTheme` directly.
 */

// Define the shape of our theme context (same as before for compatibility)
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

// Create the theme context
const ThemeContext = React.createContext<ThemeContextType | null>(null);

// Hook for consuming the theme context - now directly passes through to UnifiedThemeContext
export function useTheme() {
  // Get the unified theme context
  const unifiedContext = useUnifiedTheme();
  
  // Return a compatible subset of the unified theme context
  return {
    currentTheme: unifiedContext.currentTheme,
    setThemeVariant: unifiedContext.setThemeVariant,
    setThemeAppearance: unifiedContext.setThemeAppearance,
    setPrimaryColor: unifiedContext.setPrimaryColor,
    setThemeRadius: unifiedContext.setThemeRadius,
    updateThemeSettings: unifiedContext.updateThemeSettings,
    toggleDarkMode: unifiedContext.toggleDarkMode,
    isDarkMode: unifiedContext.isDarkMode,
    isSystemTheme: unifiedContext.isSystemTheme
  };
}

// Empty provider component for backward compatibility
// This only exists as a simple pass-through since we've moved to UnifiedThemeProvider 
export function ThemeProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

// For class components (kept for compatibility)
export const ThemeConsumer = ThemeContext.Consumer;