/**
 * Theme utility functions for consistent theme handling throughout the application
 * 
 * This file provides utilities to access and apply theme values from theme.json
 * consistently across the application. It handles theme variants, appearance modes,
 * and provides easy access to colors and other design tokens.
 */

export type ThemeVariant = 'professional' | 'vibrant' | 'tint' | string;
export const THEME_VARIANTS = ['professional', 'vibrant', 'tint'] as const;

export type ThemeAppearance = 'light' | 'dark' | 'system';
export const THEME_APPEARANCES = ['light', 'dark', 'system'] as const;

export interface ThemeChangeEventDetail {
  isDarkMode: boolean;
}

export interface ThemeConfig {
  variant: ThemeVariant;
  primary: string;
  appearance: ThemeAppearance;
  radius: number;
  colors: Record<string, string>;
}

export interface ThemeUpdateParams {
  primary?: string;
  appearance?: ThemeAppearance;
  variant?: ThemeVariant;
  radius?: number;
  colors?: Record<string, string>;
}

// Extend Window interface for our custom theme change event
declare global {
  interface WindowEventMap {
    'theme-change': CustomEvent<ThemeChangeEventDetail>;
  }
}

// Import theme.json at build time
// Note: In production, we would use a more dynamic approach to access theme.json
// This is a simplified version that will be improved in the future
import themeConfig from '../../../theme.json';

/**
 * Helper to access our theme configuration
 */
export function getThemeConfig(): ThemeConfig {
  return themeConfig as ThemeConfig;
}

/**
 * Get a CSS variable from the theme
 * @param variableName The name of the CSS variable without the leading --
 * @returns The CSS variable reference
 */
export function getThemeVar(variableName: string): string {
  return `var(--${variableName})`;
}

/**
 * Get the current theme variant
 * @returns The current theme variant
 */
export function getCurrentVariant(): ThemeVariant {
  return getThemeConfig().variant;
}

/**
 * Get the current theme appearance
 * @returns The current theme appearance
 */
export function getCurrentAppearance(): ThemeAppearance {
  return getThemeConfig().appearance;
}

/**
 * Get a cosmic theme color from theme.json colors object
 * @param colorName The name of the color from theme.json colors object
 * @returns The color value or a fallback
 */
export function getCosmicColor(colorName: string): string {
  const { colors } = getThemeConfig();
  return colors[colorName] || "";
}

/**
 * Returns appropriate CSS classes based on the current theme variant
 * @param professionalClasses Classes to apply when theme variant is "professional"
 * @param vibrantClasses Classes to apply when theme variant is "vibrant"
 * @param tintClasses Classes to apply when theme variant is "tint"
 * @returns The appropriate CSS classes for the current theme
 */
export function getVariantClasses(
  professionalClasses: string,
  vibrantClasses: string,
  tintClasses: string,
): string {
  const currentVariant = getCurrentVariant();
  
  if (currentVariant === "vibrant") {
    return vibrantClasses;
  } else if (currentVariant === "tint") {
    return tintClasses;
  } else {
    // Default to professional
    return professionalClasses;
  }
}

/**
 * Determines if the current theme is dark mode
 * @returns true if the theme is in dark mode
 */
export function isDarkMode(): boolean {
  // Check if we're in a browser environment
  if (typeof document !== 'undefined') {
    // Check if the dark class is applied to the html element
    return document.documentElement.classList.contains('dark');
  }
  
  // Fallback to check from theme configuration
  const appearance = getCurrentAppearance();
  
  if (appearance === 'system') {
    // If we can't access DOM, check media query if available
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    // Default to light mode if we can't determine
    return false;
  }
  
  return appearance === 'dark';
}

/**
 * Get appropriate text color based on current theme appearance
 * @returns CSS class for text color
 */
export function getTextColorClass(): string {
  return isDarkMode() ? "text-white" : "text-gray-900";
}

/**
 * Get appropriate background color based on current theme appearance
 * @returns CSS class for background
 */
export function getBackgroundClass(): string {
  if (isDarkMode()) {
    return "bg-[#050A18] cosmic-background";
  } else {
    return "bg-white";
  }
}

/**
 * Get appropriate card background color based on current theme appearance
 * @returns CSS class for card background
 */
export function getCardBackgroundClass(): string {
  return isDarkMode() 
    ? "cosmic-card"
    : "bg-white border border-gray-200 shadow rounded-lg";
}

/**
 * Get consistent design token for spacing
 * @param size The spacing size (1-16)
 * @returns CSS variable for consistent spacing
 */
export function getSpacing(size: number): string {
  return `var(--space-${size})`;
}

/**
 * Get button style based on variant and theme
 * @param variant Button variant
 * @returns CSS class for button styling
 */
export function getButtonClass(variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'): string {
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
}