/**
 * Theme utility functions for consistent theme handling throughout the application
 */

// Define theme variant types to ensure type safety
export type ThemeVariant = 'professional' | 'vibrant' | 'tint';
export const THEME_VARIANTS = ['professional', 'vibrant', 'tint'] as const;
export type ThemeAppearance = 'light' | 'dark' | 'system';

/**
 * Get a CSS variable from the theme
 * @param variableName The name of the CSS variable without the leading --
 * @returns The CSS variable reference
 */
export function getThemeVar(variableName: string): string {
  return `var(--${variableName})`;
}

/**
 * Get a cosmic theme color from theme.json colors object
 * @param colorName The name of the color from theme.json colors object
 * @returns The color value or a fallback
 */
export function getCosmicColor(colorName: string): string {
  // Access cosmic colors defined in theme.json
  const cosmicColors: Record<string, string> = {
    cosmicBackground: "linear-gradient(to bottom right, hsl(219, 90%, 10%), hsl(260, 90%, 10%))",
    cosmicPrimary: "hsl(221.2, 83.2%, 53.3%)",
    cosmicHighlight1: "hsl(210, 100%, 60%)",
    cosmicHighlight2: "hsl(260, 100%, 60%)",
    cosmicHighlight3: "hsl(170, 100%, 60%)",
    cosmicText: "hsl(0, 0%, 100%)",
    cosmicTextSecondary: "hsl(220, 30%, 80%)",
    cosmicBorderGlow: "0 0 10px rgba(59, 130, 246, 0.5)",
    cosmicCardBg: "rgba(255, 255, 255, 0.05)",
    cosmicCardBorder: "rgba(255, 255, 255, 0.1)",
    cosmicOverlayBg: "rgba(0, 0, 0, 0.7)"
  };
  
  return cosmicColors[colorName] || "";
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
  // In a real implementation, this would detect the current theme variant
  // from theme.json or CSS variables. For now, we'll default to professional.
  const currentVariant = "professional";
  
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
  // In a real implementation, we would check the actual theme setting from theme.json
  // We're now defaulting to true for dark mode since our theme is "Cosmic Navigator"
  return true;
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
  return isDarkMode() 
    ? "bg-gradient-to-br from-[hsl(219,90%,10%)] to-[hsl(260,90%,10%)]" 
    : "bg-white";
}

/**
 * Get appropriate card background color based on current theme appearance
 * @returns CSS class for card background
 */
export function getCardBackgroundClass(): string {
  return isDarkMode() 
    ? "bg-opacity-10 bg-white backdrop-blur-md border border-white/10" 
    : "bg-white border border-gray-200";
}