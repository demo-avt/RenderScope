import { useState, useEffect } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import { Theme } from '../types/theme';

export const useTheme = () => {
  const [theme, setTheme] = useLocalStorageState<Theme>('renderscope_theme', {
    defaultValue: 'system'
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

  const cycleTheme = () => {
    const nextTheme: Record<Theme, Theme> = {
      light: 'dark',
      dark: 'system',
      system: 'light'
    };
    setTheme(nextTheme[theme]);
  };

  useEffect(() => {
    const updateResolvedTheme = () => {
      if (theme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setResolvedTheme(systemPrefersDark ? 'dark' : 'light');
      } else {
        setResolvedTheme(theme);
      }
    };

    updateResolvedTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', updateResolvedTheme);
      return () => mediaQuery.removeEventListener('change', updateResolvedTheme);
    }
  }, [theme]);

  useEffect(() => {
    // Apply theme to document using data attribute
    document.documentElement.setAttribute('data-theme', resolvedTheme);

    // Trigger AdSense re-render on theme change
    if (window.adsbygoogle) {
      window.adsbygoogle.forEach((ad: any) => ad.push({}));
    }
  }, [resolvedTheme]);

  return {
    theme,
    resolvedTheme,
    setTheme,
    cycleTheme
  };
};