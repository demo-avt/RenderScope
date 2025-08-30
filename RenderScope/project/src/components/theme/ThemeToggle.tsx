import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Theme } from '../../types/theme';

interface ThemeToggleProps {
  theme: Theme;
  onThemeChange: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onThemeChange }) => {
  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-5 w-5" />;
      case 'dark':
        return <Moon className="h-5 w-5" />;
      case 'system':
        return <Monitor className="h-5 w-5" />;
      default:
        return <Sun className="h-5 w-5" />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Switch to dark theme';
      case 'dark':
        return 'Switch to system theme';
      case 'system':
        return 'Switch to light theme';
      default:
        return 'Toggle theme';
    }
  };

  return (
    <button
      onClick={onThemeChange}
      className="p-2 rounded-lg bg-secondary border border-primary hover:bg-tertiary transition-colors"
      title={getLabel()}
      aria-label={getLabel()}
    >
      {getIcon()}
    </button>
  );
};