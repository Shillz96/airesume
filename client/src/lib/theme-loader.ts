/**
 * Theme Loader
 * 
 * This module handles loading and applying theme configuration from theme.json
 * It converts theme.json values into CSS variables that are applied to the document root
 */

import { getThemeConfig, isDarkMode, ThemeAppearance, ThemeVariant } from './theme-utils';

/**
 * Apply dark theme CSS variables
 */
function applyDarkThemeVariables(): void {
  const root = document.documentElement;
  
  // Base colors for dark mode
  root.style.setProperty('--background', '#050A18');
  root.style.setProperty('--foreground', '#ffffff');
  root.style.setProperty('--card', 'rgba(255, 255, 255, 0.05)');
  root.style.setProperty('--card-foreground', '#ffffff');
  root.style.setProperty('--popover', 'rgba(0, 0, 0, 0.7)');
  root.style.setProperty('--popover-foreground', '#ffffff');
  root.style.setProperty('--secondary', 'rgba(255, 255, 255, 0.1)');
  root.style.setProperty('--secondary-foreground', '#ffffff');
  root.style.setProperty('--muted', 'rgba(255, 255, 255, 0.2)');
  root.style.setProperty('--muted-foreground', 'rgba(255, 255, 255, 0.65)');
  root.style.setProperty('--accent', 'rgba(59, 130, 246, 0.2)');
  root.style.setProperty('--accent-foreground', '#ffffff');
  root.style.setProperty('--border', 'rgba(255, 255, 255, 0.1)');
  root.style.setProperty('--input', 'rgba(255, 255, 255, 0.1)');
  root.style.setProperty('--ring', 'rgba(59, 130, 246, 0.5)');
}

/**
 * Apply light theme CSS variables
 */
function applyLightThemeVariables(): void {
  const root = document.documentElement;
  
  // Base colors for light mode
  root.style.setProperty('--background', '#f8f9fc');
  root.style.setProperty('--foreground', '#1a202c');
  root.style.setProperty('--card', '#ffffff');
  root.style.setProperty('--card-foreground', '#1a202c');
  root.style.setProperty('--popover', '#ffffff');
  root.style.setProperty('--popover-foreground', '#1a202c');
  root.style.setProperty('--secondary', 'rgba(0, 0, 0, 0.05)');
  root.style.setProperty('--secondary-foreground', '#1a202c');
  root.style.setProperty('--muted', 'rgba(0, 0, 0, 0.1)');
  root.style.setProperty('--muted-foreground', 'rgba(0, 0, 0, 0.6)');
  root.style.setProperty('--accent', 'rgba(59, 130, 246, 0.1)');
  root.style.setProperty('--accent-foreground', '#1a202c');
  root.style.setProperty('--border', 'rgba(0, 0, 0, 0.1)');
  root.style.setProperty('--input', 'rgba(0, 0, 0, 0.1)');
  root.style.setProperty('--ring', 'rgba(59, 130, 246, 0.5)');
}

/**
 * Apply variant-specific properties
 */
function setVariantProperties(variant: ThemeVariant): void {
  const root = document.documentElement;
  
  if (variant === 'professional') {
    // Professional variant has subtle gradients, less dramatic animations
    root.style.setProperty('--animation-speed', '1');
  } else if (variant === 'vibrant') {
    // Vibrant variant has stronger colors, more dramatic animations
    root.style.setProperty('--animation-speed', '1.2');
  } else if (variant === 'tint') {
    // Tint variant has muted colors, slower animations
    root.style.setProperty('--animation-speed', '0.8');
  }
}

/**
 * Initialize theme by setting CSS variables from theme.json
 * This should be called early in the application lifecycle
 */
export function initializeTheme(): void {
  // Get theme configuration
  const config = getThemeConfig();
  const { primary, appearance, variant, radius, colors } = config;
  
  // Get root element
  const root = document.documentElement;
  
  // Apply theme class based on appearance
  if (appearance === 'dark') {
    root.classList.add('dark-theme');
    root.classList.remove('light-theme');
    applyDarkThemeVariables();
  } else if (appearance === 'light') {
    root.classList.add('light-theme');
    root.classList.remove('dark-theme');
    applyLightThemeVariables();
  } else {
    // Handle 'system' preference by checking user's system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark-theme', prefersDark);
    root.classList.toggle('light-theme', !prefersDark);
    
    if (prefersDark) {
      applyDarkThemeVariables();
    } else {
      applyLightThemeVariables();
    }
  }
  
  // Set primary color
  root.style.setProperty('--primary', primary);
  
  // Set border radius from theme
  root.style.setProperty('--radius', `${radius}rem`);
  
  // Set variant-specific properties
  setVariantProperties(variant);
  
  // Set colors from theme.json
  Object.entries(colors).forEach(([name, value]) => {
    root.style.setProperty(`--${name}`, value);
  });
}

/**
 * Update theme configuration
 * @param updates Partial theme updates to apply
 */
export function updateTheme(updates: {
  primary?: string;
  appearance?: ThemeAppearance;
  variant?: ThemeVariant;
  radius?: number;
  colors?: Record<string, string>;
}): void {
  // In a production app, we would update the theme.json file or localStorage here
  // For this demo, we'll just update the CSS variables directly
  
  const root = document.documentElement;
  
  if (updates.primary) {
    root.style.setProperty('--primary', updates.primary);
  }
  
  if (updates.appearance) {
    if (updates.appearance === 'dark') {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
      applyDarkThemeVariables();
    } else if (updates.appearance === 'light') {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
      applyLightThemeVariables();
    }
    // Handle 'system' case
  }
  
  if (updates.variant) {
    setVariantProperties(updates.variant);
  }
  
  if (updates.radius !== undefined) {
    root.style.setProperty('--radius', `${updates.radius}rem`);
  }
  
  if (updates.colors) {
    Object.entries(updates.colors).forEach(([name, value]) => {
      root.style.setProperty(`--${name}`, value);
    });
  }
}

/**
 * Toggle between light and dark mode
 */
export function toggleDarkMode(): void {
  const isDark = isDarkMode();
  const root = document.documentElement;
  
  if (isDark) {
    root.classList.remove('dark-theme');
    root.classList.add('light-theme');
    applyLightThemeVariables();
  } else {
    root.classList.add('dark-theme');
    root.classList.remove('light-theme');
    applyDarkThemeVariables();
  }
  
  // In a production app, we would update the theme.json file or localStorage
}