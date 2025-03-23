import React from 'react';
import { Sun, Moon, Monitor, Paintbrush, Cog } from 'lucide-react';
import { useUnifiedTheme } from '@/contexts/UnifiedThemeContext';
import { cn } from '@/lib/utils';
import { UnifiedButton } from './Button';

/**
 * Unified ThemeSwitcher Component
 * 
 * This component provides controls for changing the theme appearance and variant.
 * 
 * Features:
 * - Toggle between light, dark, and system modes
 * - Select theme variants (cosmic, professional, minimal)
 * - Compact and expanded display options
 */

interface ThemeSwitcherProps {
  className?: string;
  compact?: boolean; // Only show appearance toggle in compact mode
  showVariants?: boolean; // Show variant selector
  showSettings?: boolean; // Show settings button that navigates to theme settings page
  buttonVariant?: 'default' | 'outline' | 'ghost';
  buttonSize?: 'default' | 'sm' | 'lg';
}

export function ThemeSwitcher({
  className,
  compact = false,
  showVariants = false,
  showSettings = false,
  buttonVariant = 'outline',
  buttonSize = 'default',
}: ThemeSwitcherProps) {
  const { 
    config, 
    isDarkMode, 
    toggleDarkMode, 
    setMode, 
    setVariant 
  } = useUnifiedTheme();
  
  // Get the current appearance icon
  const AppearanceIcon = isDarkMode ? Moon : 
                        config.mode === 'system' ? Monitor : Sun;
  
  // Handle appearance toggle
  const handleAppearanceToggle = () => {
    toggleDarkMode();
  };
  
  // Handle appearance selection
  const handleAppearanceSelect = (mode: 'light' | 'dark' | 'system') => {
    setMode(mode);
  };
  
  // Handle variant selection
  const handleVariantSelect = (variant: 'cosmic' | 'professional' | 'minimal') => {
    setVariant(variant);
  };
  
  // Compact mode (just the appearance toggle)
  if (compact) {
    return (
      <UnifiedButton
        variant={buttonVariant}
        size={buttonSize}
        onClick={handleAppearanceToggle}
        className={className}
        aria-label="Toggle theme"
      >
        <AppearanceIcon className="h-[1.2rem] w-[1.2rem]" />
      </UnifiedButton>
    );
  }
  
  // Full mode with all options
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Appearance toggles */}
      <div className="flex rounded-md border border-border p-1">
        <UnifiedButton
          variant={config.mode === 'light' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleAppearanceSelect('light')}
          className="px-3"
          aria-label="Light mode"
        >
          <Sun className="h-4 w-4 mr-1" />
          {!compact && <span>Light</span>}
        </UnifiedButton>
        
        <UnifiedButton
          variant={config.mode === 'dark' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleAppearanceSelect('dark')}
          className="px-3"
          aria-label="Dark mode"
        >
          <Moon className="h-4 w-4 mr-1" />
          {!compact && <span>Dark</span>}
        </UnifiedButton>
        
        <UnifiedButton
          variant={config.mode === 'system' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleAppearanceSelect('system')}
          className="px-3"
          aria-label="System mode"
        >
          <Monitor className="h-4 w-4 mr-1" />
          {!compact && <span>System</span>}
        </UnifiedButton>
      </div>
      
      {/* Theme variant selector */}
      {showVariants && (
        <div className="flex rounded-md border border-border p-1">
          <UnifiedButton
            variant={config.variant === 'cosmic' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleVariantSelect('cosmic')}
            className="px-3"
            aria-label="Cosmic theme"
          >
            <span className="animate-cosmic-shine bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Cosmic
            </span>
          </UnifiedButton>
          
          <UnifiedButton
            variant={config.variant === 'professional' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleVariantSelect('professional')}
            className="px-3"
            aria-label="Professional theme"
          >
            Professional
          </UnifiedButton>
          
          <UnifiedButton
            variant={config.variant === 'minimal' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleVariantSelect('minimal')}
            className="px-3"
            aria-label="Minimal theme"
          >
            Minimal
          </UnifiedButton>
        </div>
      )}
      
      {/* Settings button */}
      {showSettings && (
        <UnifiedButton
          variant="ghost"
          size={buttonSize}
          className="ml-1"
          aria-label="Theme settings"
          onClick={() => { /* Navigate to theme settings page */ }}
        >
          <Cog className="h-4 w-4" />
        </UnifiedButton>
      )}
    </div>
  );
}

export default ThemeSwitcher;