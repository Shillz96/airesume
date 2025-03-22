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
  
  // Set data-theme-variant attribute for CSS selectors
  root.setAttribute('data-theme-variant', variant);
  
  // Apply theme class based on appearance
  if (appearance === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else if (appearance === 'light') {
    root.classList.add('light');
    root.classList.remove('dark');
  } else {
    // Handle 'system' preference by checking user's system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
    root.classList.toggle('light', !prefersDark);
    
    // Add listener for system preference changes
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMediaQuery.addEventListener('change', (e) => {
      root.classList.toggle('dark', e.matches);
      root.classList.toggle('light', !e.matches);
      
      // Dispatch theme change event
      const themeChangeEvent = new CustomEvent('theme-change', {
        detail: { isDarkMode: e.matches }
      });
      window.dispatchEvent(themeChangeEvent);
    });
  }
  
  // Convert primary color to RGB values
  const rgbPrimary = hexToRgb(primary);
  if (rgbPrimary) {
    root.style.setProperty('--color-primary', `${rgbPrimary.r} ${rgbPrimary.g} ${rgbPrimary.b}`);
  }
  
  // Set border radius from theme
  root.style.setProperty('--border-radius', `${radius}rem`);
  root.style.setProperty('--radius', `${radius}rem`); // Legacy support
  
  // Set variant-specific properties
  setVariantProperties(variant);
  
  // Set colors from theme.json
  Object.entries(colors).forEach(([name, value]) => {
    // Convert hex colors to RGB values
    const rgbColor = hexToRgb(value);
    if (rgbColor) {
      root.style.setProperty(`--color-${name}`, `${rgbColor.r} ${rgbColor.g} ${rgbColor.b}`);
    } else {
      root.style.setProperty(`--color-${name}`, value);
    }
    // Legacy support
    root.style.setProperty(`--${name}`, value);
  });
}

/**
 * Apply variant-specific properties
 */
function setVariantProperties(variant: ThemeVariant): void {
  const root = document.documentElement;
  
  // This handles variant-specific adjustments that can't be easily done with CSS
  if (variant === 'professional') {
    // Professional variant has subtle gradients, less dramatic animations
    root.style.setProperty('--animation-speed', '1');
    root.style.setProperty('--border-radius-button', 'var(--border-radius)');
    root.style.setProperty('--card-box-shadow', 'var(--shadow-md)');
  } else if (variant === 'vibrant') {
    // Vibrant variant has stronger colors, more dramatic animations
    root.style.setProperty('--animation-speed', '1.2');
    root.style.setProperty('--border-radius-button', 'var(--border-radius-lg)');
    root.style.setProperty('--card-box-shadow', 'var(--shadow-lg)');
  } else if (variant === 'tint') {
    // Tint variant has muted colors, slower animations
    root.style.setProperty('--animation-speed', '0.8');
    root.style.setProperty('--border-radius-button', 'var(--border-radius-full)');
    root.style.setProperty('--card-box-shadow', 'var(--shadow-sm)');
  }
}

/**
 * Update theme configuration
 * @param updates Partial theme updates to apply
 */
export function updateTheme(updates: ThemeUpdateParams): void {
  // Get root element
  const root = document.documentElement;
  
  if (updates.primary) {
    // Convert primary color to RGB values
    const rgbPrimary = hexToRgb(updates.primary);
    if (rgbPrimary) {
      root.style.setProperty('--color-primary', `${rgbPrimary.r} ${rgbPrimary.g} ${rgbPrimary.b}`);
    }
    // Legacy support
    root.style.setProperty('--primary', updates.primary);
  }
  
  if (updates.appearance) {
    if (updates.appearance === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else if (updates.appearance === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      // Handle 'system' case
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
      root.classList.toggle('light', !prefersDark);
    }
  }
  
  if (updates.variant) {
    root.setAttribute('data-theme-variant', updates.variant);
    setVariantProperties(updates.variant);
  }
  
  if (updates.radius !== undefined) {
    root.style.setProperty('--border-radius', `${updates.radius}rem`);
    root.style.setProperty('--radius', `${updates.radius}rem`); // Legacy support
  }
  
  if (updates.colors) {
    Object.entries(updates.colors).forEach(([name, value]) => {
      // Convert hex colors to RGB values
      const rgbColor = hexToRgb(value);
      if (rgbColor) {
        root.style.setProperty(`--color-${name}`, `${rgbColor.r} ${rgbColor.g} ${rgbColor.b}`);
      } else {
        root.style.setProperty(`--color-${name}`, value);
      }
      // Legacy support
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
    root.classList.remove('dark');
    root.classList.add('light');
  } else {
    root.classList.add('dark');
    root.classList.remove('light');
  }
  
  // Dispatch a custom event that components can listen for
  const themeChangeEvent = new CustomEvent('theme-change', {
    detail: { isDarkMode: !isDark }
  });
  window.dispatchEvent(themeChangeEvent);
}

/**
 * Helper function to convert HEX color to RGB
 * @param hex HEX color string (e.g. #ff0000)
 * @returns RGB color object or null if invalid
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // If hex is a named color, return null (can't convert)
  if (!hex.startsWith('#')) {
    return null;
  }
  
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Handle shorthand hex (e.g. #fff)
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  // Parse hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Check if valid RGB values
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return null;
  }
  
  return { r, g, b };
}