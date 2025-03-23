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
import React, { useState, useEffect } from 'react';
import { useUnifiedTheme } from '@/contexts/UnifiedThemeContext';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Settings, Moon, Sun, Paintbrush } from 'lucide-react';

export default function ThemeManager() {
  const { 
    config, 
    setVariant, 
    setMode, 
    setPrimaryColor,
    setBorderRadius,
    setAnimations,
    toggleDarkMode
  } = useUnifiedTheme();
  
  const [isOpen, setIsOpen] = useState(false);

  // Theme variants available in the system
  const variants = [
    { id: 'cosmic', name: 'Cosmic' },
    { id: 'professional', name: 'Professional' },
    { id: 'minimal', name: 'Minimal' },
    { id: 'vibrant', name: 'Vibrant' },
    { id: 'tint', name: 'Tint' }
  ];

  // Predefined color schemes
  const colorPresets = [
    { name: 'Blue', color: '#3b82f6' },
    { name: 'Purple', color: '#8b5cf6' },
    { name: 'Green', color: '#10b981' },
    { name: 'Red', color: '#ef4444' },
    { name: 'Orange', color: '#f59e0b' },
    { name: 'Pink', color: '#ec4899' }
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Settings className="h-[1.2rem] w-[1.2rem]" />
          {config.variant === 'cosmic' && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium leading-none text-center">Theme Customization</h4>
          
          <div className="space-y-2">
            <h5 className="text-sm font-medium leading-none">Mode</h5>
            <div className="flex items-center justify-between">
              <Label htmlFor="theme-mode" className="flex items-center gap-2">
                {config.mode === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                {config.mode === 'dark' ? 'Dark' : 'Light'} Mode
              </Label>
              <Switch 
                id="theme-mode" 
                checked={config.mode === 'dark'}
                onCheckedChange={() => toggleDarkMode()}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <h5 className="text-sm font-medium leading-none">Style Variant</h5>
            <div className="grid grid-cols-3 gap-2">
              {variants.map(variant => (
                <Button
                  key={variant.id}
                  variant={config.variant === variant.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setVariant(variant.id as any)}
                  className="h-8"
                >
                  {variant.name}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <h5 className="text-sm font-medium leading-none">Primary Color</h5>
            <div className="flex flex-wrap gap-2">
              {colorPresets.map(preset => (
                <button
                  key={preset.color}
                  onClick={() => setPrimaryColor(preset.color)}
                  className="w-6 h-6 rounded-full border border-border"
                  style={{ backgroundColor: preset.color }}
                  title={preset.name}
                />
              ))}
              <input
                type="color"
                value={config.primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-6 h-6"
                title="Custom color"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="radius-slider" className="text-sm font-medium leading-none">
                Border Radius: {Math.round(config.borderRadius * 16)}px
              </Label>
            </div>
            <Slider 
              id="radius-slider"
              min={0} 
              max={2} 
              step={0.1}
              value={[config.borderRadius]} 
              onValueChange={(value) => setBorderRadius(value[0])}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="animation-toggle" className="flex items-center gap-2">
                <Paintbrush className="h-4 w-4" />
                Animations
              </Label>
              <Switch 
                id="animation-toggle" 
                checked={config.animations}
                onCheckedChange={(checked) => setAnimations(checked)}
              />
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setVariant('cosmic');
              setMode('dark');
              setPrimaryColor('#3b82f6');
              setBorderRadius(0.5);
              setAnimations(true);
              setIsOpen(false);
            }}
            className="w-full"
          >
            Reset to Defaults
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}