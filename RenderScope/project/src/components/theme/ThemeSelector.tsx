import React from 'react';
import { Moon, Sun, Monitor, Palette } from 'lucide-react';
import { Theme, ColorScheme } from '../../types/theme';

interface ThemeSelectorProps {
  currentTheme: Theme;
  currentColorScheme: ColorScheme;
  onThemeChange: (theme: Theme) => void;
  onColorSchemeChange: (scheme: ColorScheme) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  currentColorScheme,
  onThemeChange,
  onColorSchemeChange
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showColorSchemes, setShowColorSchemes] = React.useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => {
    setIsOpen(false);
    setShowColorSchemes(false);
  };

  // Define available themes and color schemes
  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" /> },
    { value: 'system', label: 'System', icon: <Monitor className="h-4 w-4" /> },
  ];

  const colorSchemes: { value: ColorScheme; label: string; className: string }[] = [
    { value: 'default', label: 'Default', className: 'bg-gradient-to-r from-blue-500 to-blue-600' },
    { value: 'professional', label: 'Professional', className: 'bg-gradient-to-r from-gray-700 to-gray-800' },
    { value: 'vibrant', label: 'Vibrant', className: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { value: 'contrast', label: 'High Contrast', className: 'bg-gradient-to-r from-yellow-400 to-orange-500' },
    { value: 'calm', label: 'Calm', className: 'bg-gradient-to-r from-green-400 to-teal-500' },
  ];

  // Get current theme icon
  const currentThemeIcon = themes.find(t => t.value === currentTheme)?.icon || <Sun className="h-4 w-4" />;

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
        aria-label="Theme settings"
      >
        {currentThemeIcon}
        <span className="hidden md:inline">Theme</span>
        <Palette className="h-4 w-4 text-gray-400" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop for closing the dropdown */}
          <div
            className="fixed inset-0 z-10"
            onClick={closeDropdown}
          />

          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 border border-gray-700 z-20">
            {!showColorSchemes ? (
              <div className="py-1">
                <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-700">Select Theme Mode</div>
                {themes.map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => {
                      onThemeChange(theme.value);
                      setShowColorSchemes(true);
                    }}
                    className={`flex items-center gap-3 w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors ${
                      currentTheme === theme.value ? 'text-blue-400' : 'text-white'
                    }`}
                  >
                    {theme.icon}
                    {theme.label}
                    {currentTheme === theme.value && (
                      <span className="ml-auto">✓</span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-1">
                <button
                  onClick={() => setShowColorSchemes(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:bg-gray-700 w-full text-left border-b border-gray-700"
                >
                  ← Back to Themes
                </button>
                <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-700">Select Color Scheme</div>
                {colorSchemes.map((scheme) => (
                  <button
                    key={scheme.value}
                    onClick={() => {
                      onColorSchemeChange(scheme.value);
                      closeDropdown();
                    }}
                    className={`flex items-center gap-3 w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors ${
                      currentColorScheme === scheme.value ? 'text-blue-400' : 'text-white'
                    }`}
                  >
                    <span className={`h-4 w-4 rounded-full ${scheme.className}`}></span>
                    {scheme.label}
                    {currentColorScheme === scheme.value && (
                      <span className="ml-auto">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};