/**
 * ThemeManager Component
 * 
 * THE SINGLE SOURCE OF TRUTH for theme management in the application.
 * This component loads theme settings from theme.json and applies them consistently
 * across the entire application.
 * 
 * It implements the auth-page styling as the standard for all pages and components,
 * with cosmic-themed CSS classes for:
 * - cosmic-text-gradient: For gradient text headings
 * - cosmic-btn-glow: For glowing button effects
 * - cosmic-card: For consistent card styling with subtle borders
 * - Dialog styling with backdrop blur and semi-transparent backgrounds
 * 
 * Any changes to the application's visual style should be made in this component
 * or directly in index.css. All other theme-related files are DEPRECATED.
 */
import React from 'react';
import { useUnifiedTheme, ThemeMode } from '@/contexts/UnifiedThemeContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Settings, Moon, Sun, Laptop } from 'lucide-react';

export default function ThemeManager() {
  const { mode, setMode } = useUnifiedTheme();

  const modes: { value: ThemeMode; label: string; icon: React.ElementType }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Laptop },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-1">
        <div className="grid gap-1">
          {modes.map(({ value, label, icon: Icon }) => (
            <Button
              key={value}
              variant={mode === value ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setMode(value)}
              className="justify-start gap-2"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}