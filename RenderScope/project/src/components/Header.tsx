import React, { useState, useEffect } from 'react';
import { Monitor, Wifi, WifiOff, ChevronDown } from 'lucide-react';
import { User } from '../types/auth';
import { Theme, ColorScheme } from '../types/theme';
import { ThemeSelector } from './theme/ThemeSelector';
import { SocialMediaLinks } from './SocialMediaLinks';

interface HeaderProps {
  isConnected: boolean;
  user: User | null;
  theme: Theme;
  colorScheme: ColorScheme;
  onThemeChange: (theme: Theme) => void;
  onColorSchemeChange: (scheme: ColorScheme) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isConnected,
  user,
  theme,
  colorScheme,
  onThemeChange,
  onColorSchemeChange,
  onLogout
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-secondary/80 backdrop-blur-sm border-b border-primary sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Monitor className="h-8 w-8 text-accent" />
            <div>
              <h1 className="text-2xl font-bold text-primary">RenderScope Pro</h1>
              <p className="text-sm text-secondary">Live Render Tracker & Project Manager v2.0</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Social Media Links - Hidden on mobile */}
            <div className="hidden lg:block">
              <SocialMediaLinks />
            </div>

            {/* Theme Selector */}
            <ThemeSelector
              currentTheme={theme}
              currentColorScheme={colorScheme}
              onThemeChange={onThemeChange}
              onColorSchemeChange={onColorSchemeChange}
            />

            {/* Connection Status */}
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Wifi className="h-5 w-5 text-success" />
              ) : (
                <WifiOff className="h-5 w-5 text-error" />
              )}
              <span className={`text-sm font-medium ${isConnected ? 'text-success' : 'text-error'}`}>
                {isConnected ? 'Live' : 'Offline'}
              </span>
            </div>

            {/* User Menu */}
            {user && (
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-tertiary transition-colors">
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="h-8 w-8 rounded-full"
                  />
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-primary">{user.name}</div>
                    <div className="text-xs text-secondary capitalize">{user.role}</div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-secondary" />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-secondary border border-primary rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-3 border-b border-primary">
                    <div className="text-sm font-medium text-primary">{user.name}</div>
                    <div className="text-xs text-secondary">{user.email}</div>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={onLogout}
                      className="w-full text-left px-3 py-2 text-sm text-secondary hover:text-primary hover:bg-tertiary rounded transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Time Display */}
            <div className="hidden lg:block text-right text-sm">
              <div className="text-primary font-mono">{currentTime.toLocaleTimeString()}</div>
              <div className="text-xs text-secondary">Last Update</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};