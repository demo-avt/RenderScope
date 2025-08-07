import { useState, useEffect, useCallback } from 'react';
import { User, AuthState } from '../types/auth';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('renderscope_token');
    const userData = localStorage.getItem('renderscope_user');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false
        });

        // Set up token refresh
        setupTokenRefresh(token);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        logout();
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const setupTokenRefresh = useCallback((token: string) => {
    // Refresh token every 55 minutes
    const refreshInterval = setInterval(() => {
      refreshToken(token);
    }, 55 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  const refreshToken = async (currentToken: string) => {
    try {
      // Simulate token refresh API call
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const { token: newToken } = await response.json();
        localStorage.setItem('renderscope_token', newToken);
        setAuthState(prev => ({ ...prev, token: newToken }));
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  };

  const login = useCallback(async (credential: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      // Simulate Google OAuth verification
      const mockUser: User = {
        id: 'user_123',
        email: 'user@company.com',
        name: 'John Doe',
        picture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
        role: 'admin'
      };

      const mockToken = 'mock_jwt_token_' + Date.now();

      localStorage.setItem('renderscope_token', mockToken);
      localStorage.setItem('renderscope_user', JSON.stringify(mockUser));

      setAuthState({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false
      });

      setupTokenRefresh(mockToken);
    } catch (error) {
      console.error('Login failed:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, [setupTokenRefresh]);

  const logout = useCallback(() => {
    localStorage.removeItem('renderscope_token');
    localStorage.removeItem('renderscope_user');

    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false
    });
  }, []);

  return {
    ...authState,
    login,
    logout
  };
};