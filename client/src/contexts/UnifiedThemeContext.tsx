import React, { createContext, ReactNode, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: Theme;
  theme: Theme;
  setMode: (mode: Theme) => void;
}

const UnifiedThemeContext = createContext<ThemeContextType>({
  mode: 'system',
  theme: 'system',
  setMode: () => {},
});

/**
 * Apply initial theme class based on localStorage or system preference.
 * Should be called early (e.g., in main.tsx or root layout) to prevent FOUC.
 */
export function applyInitialThemeClass(): Theme {
  let initialMode: Theme = 'system';
  try {
    const savedMode = localStorage.getItem('theme-mode') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const html = document.documentElement;

    if (savedMode && ['light', 'dark'].includes(savedMode)) {
      initialMode = savedMode;
    } else {
      initialMode = prefersDark ? 'dark' : 'light';
      // Store 'system' preference if no explicit mode saved
      try {
        localStorage.setItem('theme-mode', 'system');
      } catch (e) {
        // Silently fail if localStorage is not available
      }
    }

    html.classList.remove('light', 'dark');
    if (initialMode === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.add('light');
    }
  } catch (e) {
    // In case of SSR or errors accessing localStorage/window
    // Silently fall back to default mode
    const html = document.documentElement;
    html.classList.remove('light', 'dark');
    html.classList.add('system');
  }
  return initialMode;
}

export function UnifiedThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Theme>('system');
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    // Update theme based on mode and system preference
    if (mode === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(isDark ? 'dark' : 'light');
    } else {
      setTheme(mode);
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (mode === 'system') {
        setTheme(mediaQuery.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode]);

  const applyMode = useCallback((newMode: Theme) => {
    try {
      const html = document.documentElement;
      html.classList.remove('light', 'dark');

      if (newMode === 'dark') {
        html.classList.add('dark');
      } else if (newMode === 'light') {
        html.classList.add('light');
      } else { // System mode
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        html.classList.add(prefersDark ? 'dark' : 'light');
      }
    } catch (e) {
      // Silently fall back to default mode if there's an error
      const html = document.documentElement;
      html.classList.remove('light', 'dark');
      html.classList.add('system');
    }
  }, []);

  const setModeState = useCallback((newMode: Theme) => {
    try {
      localStorage.setItem('theme-mode', newMode);
    } catch (e) {
      // Silently fail if localStorage is not available
    }
    setMode(newMode);
    applyMode(newMode);
  }, [applyMode]);

  // Apply mode on initial mount based on state
  useEffect(() => {
    applyMode(mode);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount, subsequent changes handled by setMode or system listener
  
  return (
    <UnifiedThemeContext.Provider value={{ mode, theme, setMode: setModeState }}>
      {children}
    </UnifiedThemeContext.Provider>
  );
}

export const useUnifiedTheme = () => useContext(UnifiedThemeContext);

export default UnifiedThemeContext;

