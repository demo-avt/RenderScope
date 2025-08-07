import React, { useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import { useNotificationContext } from './contexts/NotificationContext';
import { LoginPage } from './components/auth/LoginPage';
import { Header } from './components/Header';
import { GlobalStats } from './components/GlobalStats';
import { ProjectCard } from './components/ProjectCard';
import { useRealTimeUpdates } from './hooks/useRealTimeUpdates';
import { SocialMediaLinks } from './components/SocialMediaLinks';

function App() {
  const { user, isAuthenticated, isLoading: authLoading, login, logout } = useAuth();
  const { theme, colorScheme, cycleTheme, changeColorScheme } = useTheme();
  const { projects, stats, isConnected } = useRealTimeUpdates();
  const { success, info } = useNotificationContext();

  // Show welcome notification on login
  useEffect(() => {
    if (isAuthenticated && user) {
      setTimeout(() => {
        success(
          'Welcome to RenderScope Pro',
          `Hello ${user.name}! You're now connected to the RenderScope dashboard.`
        );

        // Show theme notification after a delay
        setTimeout(() => {
          info(
            'New Feature: Enhanced Themes',
            'Try our new theme system with multiple color schemes. Click the theme button in the header to explore options.',
            { duration: 8000 }
          );
        }, 3000);
      }, 1000);
    }
  }, [isAuthenticated, user, success, info]);

  // Connection status notification
  useEffect(() => {
    if (isAuthenticated) {
      if (isConnected) {
        success('Connection Established', 'Real-time updates are now active.');
      } else {
        info('Connection Lost', 'Attempting to reconnect to the render server...');
      }
    }
  }, [isConnected, isAuthenticated, success, info]);

  // Show loading state during auth check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-primary text-lg">Loading RenderScope Pro...</div>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={login} isLoading={authLoading} />;
  }

  const isPremium = user?.role === 'admin'; // Premium features for admin users

  return (
    <div className="min-h-screen bg-primary">
      <Header
        isConnected={isConnected}
        user={user}
        theme={theme}
        colorScheme={colorScheme}
        onThemeChange={cycleTheme}
        onColorSchemeChange={changeColorScheme}
        onLogout={logout}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <GlobalStats stats={stats} isConnected={isConnected} />

        <div className="space-y-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} isPremium={isPremium} />
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-lg">No active projects</div>
            <div className="text-gray-500 text-sm mt-2">
              Projects will appear here when render jobs are initiated
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-primary bg-secondary/50 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-sm text-secondary">
            <div>
              RenderScope Pro v2.1.0 - Enhanced Dashboard
            </div>

            {/* Social Media Links - Mobile fallback */}
            <div className="lg:hidden">
              <SocialMediaLinks />
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-4">
              <span>Google OAuth</span>
              <span>•</span>
              <span>Enhanced Theme Engine</span>
              <span>•</span>
              <span>Notification System</span>
              <span>•</span>
              <span>WebSocket API</span>
              <span>•</span>
              <span>Auto-Healing Pipeline</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;