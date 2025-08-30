import { useState, useEffect } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import { Theme, ColorScheme, themeColorMappings, ThemeColors } from '../types/theme';

export const useTheme = () => {
  const [theme, setTheme] = useLocalStorageState<Theme>('renderscope_theme', {
    defaultValue: 'system'
  });

  const [colorScheme, setColorScheme] = useLocalStorageState<ColorScheme>('renderscope_color_scheme', {
    defaultValue: 'default'
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');
  const [themeColors, setThemeColors] = useState<ThemeColors>(themeColorMappings.dark.default);

  const cycleTheme = () => {
    const nextTheme: Record<Theme, Theme> = {
      light: 'dark',
      dark: 'system',
      system: 'light'
    };
    setTheme(nextTheme[theme]);
  };

  const changeColorScheme = (newScheme: ColorScheme) => {
    setColorScheme(newScheme);
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

  // Update theme colors when theme or color scheme changes
  useEffect(() => {
    const baseTheme = resolvedTheme === 'dark' ? 'dark' : 'light';
    const colors = themeColorMappings[baseTheme][colorScheme];
    setThemeColors(colors);

    // Apply theme to document using data attributes
    document.documentElement.setAttribute('data-theme', resolvedTheme);
    document.documentElement.setAttribute('data-color-scheme', colorScheme);

    // Apply CSS variables
    const root = document.documentElement;
    root.style.setProperty('--bg-primary', colors.bgPrimary);
    root.style.setProperty('--bg-secondary', colors.bgSecondary);
    root.style.setProperty('--bg-tertiary', colors.bgTertiary);
    root.style.setProperty('--text-primary', colors.textPrimary);
    root.style.setProperty('--text-secondary', colors.textSecondary);
    root.style.setProperty('--accent-color', colors.accentColor);
    root.style.setProperty('--success-color', colors.successColor);
    root.style.setProperty('--error-color', colors.errorColor);
    root.style.setProperty('--warning-color', colors.warningColor);
    root.style.setProperty('--info-color', colors.infoColor);
    root.style.setProperty('--border-color', colors.borderColor);

    // Trigger AdSense re-render on theme change
    if (window.adsbygoogle) {
      window.adsbygoogle.forEach((ad: any) => ad.push({}));
    }
  }, [resolvedTheme, colorScheme]);

  return {
    theme,
    colorScheme,
    resolvedTheme,
    themeColors,
    setTheme,
    cycleTheme,
    changeColorScheme
  };
};