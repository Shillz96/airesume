/**
 * Theme utility functions for consistent theme handling throughout the application
 */

/**
 * Get a CSS variable from the theme
 * @param variableName The name of the CSS variable without the leading --
 * @returns The CSS variable reference
 */
export function getThemeVar(variableName: string): string {
  return `var(--${variableName})`;
}

/**
 * Get a custom color from the theme.json colors object
 * These are additional colors defined in theme.json beyond the primary color
 * @param colorName The name of the color from theme.json colors object
 * @returns The color value or a fallback
 */
export function getCustomColor(colorName: string): string {
  // Access any custom colors defined in theme.json
  // This is a simplified implementation and would need to be enhanced
  // for real production use to actually read from theme.json
  
  const customColors: Record<string, string> = {
    jobFinderBackground: "linear-gradient(to bottom right, hsl(219, 90%, 10%), hsl(260, 90%, 10%))",
    resumeHighlight1: "bg-blue-500",
    resumeHighlight2: "bg-purple-500",
    resumeHighlight3: "bg-emerald-500",
  };
  
  return customColors[colorName] || "";
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
  
  switch (currentVariant) {
    case "vibrant":
      return vibrantClasses;
    case "tint":
      return tintClasses;
    case "professional":
    default:
      return professionalClasses;
  }
}

/**
 * Determines if the current theme is dark mode
 * @returns true if the theme is in dark mode
 */
export function isDarkMode(): boolean {
  // In a real implementation, we would check the actual theme setting
  // For now, we'll return false (light mode) as a default
  return false;
}