/**
 * Theme Types
 * 
 * This file defines TypeScript types and interfaces for the theming system
 */

// Types for theme variants
export type ThemeVariant = 'professional' | 'vibrant' | 'tint' | string;
export const THEME_VARIANTS = ['professional', 'vibrant', 'tint'] as const;

// Types for theme appearance
export type ThemeAppearance = 'light' | 'dark' | 'system';
export const THEME_APPEARANCES = ['light', 'dark', 'system'] as const;

// Detail for our custom theme change event
export interface ThemeChangeEventDetail {
  isDarkMode: boolean;
  // We could include more information here as needed
  // theme?: ThemeVariant;
  // appearance?: ThemeAppearance; 
}

// Theme configuration type
export interface ThemeConfig {
  variant: ThemeVariant;
  primary: string;
  appearance: ThemeAppearance;
  radius: number;
  colors: Record<string, string>;
}

// Theme update parameters
export interface ThemeUpdateParams {
  primary?: string;
  appearance?: ThemeAppearance;
  variant?: ThemeVariant;
  radius?: number;
  colors?: Record<string, string>;
}

// Extend the Window interface to add our custom theme change event
declare global {
  interface WindowEventMap {
    'theme-change': CustomEvent<ThemeChangeEventDetail>;
  }
}