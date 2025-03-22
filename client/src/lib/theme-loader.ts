/**
 * Theme Loader
 * 
 * This module handles loading and applying theme configuration from theme.json
 * It converts theme.json values into CSS variables that are applied to the document root
 */

import { 
  getThemeConfig, 
  isDarkMode, 
  ThemeAppearance, 
  ThemeVariant, 
  ThemeUpdateParams 
} from './theme-utils';

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
  } else if (appearance === 'light') {
    root.classList.add('light-theme');
    root.classList.remove('dark-theme');
  } else {
    // Handle 'system' preference by checking user's system preference
    // For simplicity, defaulting to dark mode
    root.classList.add('dark-theme');
    root.classList.remove('light-theme');
    
    // In a real implementation, we would check the system preference:
    // const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // root.classList.toggle('dark-theme', prefersDark);
    // root.classList.toggle('light-theme', !prefersDark);
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
 * Update theme configuration
 * @param updates Partial theme updates to apply
 */
export function updateTheme(updates: ThemeUpdateParams): void {
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
    } else if (updates.appearance === 'light') {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
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
  } else {
    root.classList.add('dark-theme');
    root.classList.remove('light-theme');
  }
  
  // Dispatch a custom event that components can listen for
  const themeChangeEvent = new CustomEvent('theme-change', {
    detail: { isDarkMode: !isDark }
  });
  window.dispatchEvent(themeChangeEvent);
  
  // In a production app, we would update the theme.json file or localStorage
}