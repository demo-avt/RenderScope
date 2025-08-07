export type Theme = 'light' | 'dark' | 'system';
export type ColorScheme = 'default' | 'professional' | 'vibrant' | 'contrast' | 'calm';

export interface ThemeSettings {
  theme: Theme;
  colorScheme: ColorScheme;
}

export interface ThemeColors {
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  textPrimary: string;
  textSecondary: string;
  accentColor: string;
  successColor: string;
  errorColor: string;
  warningColor: string;
  infoColor: string;
  borderColor: string;
}

// Theme color mappings for each combination of theme + colorScheme
export const themeColorMappings: Record<Theme, Record<ColorScheme, ThemeColors>> = {
  light: {
    default: {
      bgPrimary: '#FFFFFF',
      bgSecondary: '#F8F9FA',
      bgTertiary: '#F1F3F4',
      textPrimary: '#000000',
      textSecondary: '#6C757D',
      accentColor: '#007BFF',
      successColor: '#28A745',
      errorColor: '#DC3545',
      warningColor: '#FFC107',
      infoColor: '#17A2B8',
      borderColor: '#E5E5E5'
    },
    professional: {
      bgPrimary: '#FFFFFF',
      bgSecondary: '#F5F7FA',
      bgTertiary: '#EDF2F7',
      textPrimary: '#1A202C',
      textSecondary: '#4A5568',
      accentColor: '#3182CE',
      successColor: '#38A169',
      errorColor: '#E53E3E',
      warningColor: '#DD6B20',
      infoColor: '#00B5D8',
      borderColor: '#E2E8F0'
    },
    vibrant: {
      bgPrimary: '#FFFFFF',
      bgSecondary: '#F9F9FF',
      bgTertiary: '#F0F0FF',
      textPrimary: '#2D3748',
      textSecondary: '#718096',
      accentColor: '#805AD5',
      successColor: '#38B2AC',
      errorColor: '#F56565',
      warningColor: '#ED8936',
      infoColor: '#4299E1',
      borderColor: '#E2E8F0'
    },
    contrast: {
      bgPrimary: '#FFFFFF',
      bgSecondary: '#F5F5F5',
      bgTertiary: '#EEEEEE',
      textPrimary: '#000000',
      textSecondary: '#333333',
      accentColor: '#0056B3',
      successColor: '#006400',
      errorColor: '#B30000',
      warningColor: '#856404',
      infoColor: '#004085',
      borderColor: '#CCCCCC'
    },
    calm: {
      bgPrimary: '#FFFFFF',
      bgSecondary: '#F5F9F7',
      bgTertiary: '#EDF7F2',
      textPrimary: '#1F2937',
      textSecondary: '#4B5563',
      accentColor: '#059669',
      successColor: '#10B981',
      errorColor: '#EF4444',
      warningColor: '#F59E0B',
      infoColor: '#3B82F6',
      borderColor: '#D1FAE5'
    }
  },
  dark: {
    default: {
      bgPrimary: '#000000',
      bgSecondary: '#1A1A1A',
      bgTertiary: '#2D2D2D',
      textPrimary: '#FFFFFF',
      textSecondary: '#B0B0B0',
      accentColor: '#1E90FF',
      successColor: '#32CD32',
      errorColor: '#FF4757',
      warningColor: '#FFA502',
      infoColor: '#70A1FF',
      borderColor: '#333333'
    },
    professional: {
      bgPrimary: '#0F172A',
      bgSecondary: '#1E293B',
      bgTertiary: '#334155',
      textPrimary: '#F8FAFC',
      textSecondary: '#CBD5E1',
      accentColor: '#3B82F6',
      successColor: '#10B981',
      errorColor: '#EF4444',
      warningColor: '#F59E0B',
      infoColor: '#06B6D4',
      borderColor: '#475569'
    },
    vibrant: {
      bgPrimary: '#0F0F1A',
      bgSecondary: '#1A1A2E',
      bgTertiary: '#16213E',
      textPrimary: '#FFFFFF',
      textSecondary: '#CBD5E1',
      accentColor: '#8B5CF6',
      successColor: '#14B8A6',
      errorColor: '#F43F5E',
      warningColor: '#F97316',
      infoColor: '#38BDF8',
      borderColor: '#2A2A4A'
    },
    contrast: {
      bgPrimary: '#000000',
      bgSecondary: '#121212',
      bgTertiary: '#1E1E1E',
      textPrimary: '#FFFFFF',
      textSecondary: '#EEEEEE',
      accentColor: '#3B82F6',
      successColor: '#4ADE80',
      errorColor: '#F87171',
      warningColor: '#FBBF24',
      infoColor: '#60A5FA',
      borderColor: '#4B5563'
    },
    calm: {
      bgPrimary: '#0F1A17',
      bgSecondary: '#1A2C27',
      bgTertiary: '#2D3F3A',
      textPrimary: '#F8FAFC',
      textSecondary: '#CBD5E1',
      accentColor: '#10B981',
      successColor: '#34D399',
      errorColor: '#F87171',
      warningColor: '#FBBF24',
      infoColor: '#38BDF8',
      borderColor: '#2D3F3A'
    }
  },
  system: {
    // System will use either light or dark based on user's system preference
    // These values are placeholders and will be replaced at runtime
    default: {
      bgPrimary: '#FFFFFF',
      bgSecondary: '#F8F9FA',
      bgTertiary: '#F1F3F4',
      textPrimary: '#000000',
      textSecondary: '#6C757D',
      accentColor: '#007BFF',
      successColor: '#28A745',
      errorColor: '#DC3545',
      warningColor: '#FFC107',
      infoColor: '#17A2B8',
      borderColor: '#E5E5E5'
    },
    professional: {
      bgPrimary: '#FFFFFF',
      bgSecondary: '#F5F7FA',
      bgTertiary: '#EDF2F7',
      textPrimary: '#1A202C',
      textSecondary: '#4A5568',
      accentColor: '#3182CE',
      successColor: '#38A169',
      errorColor: '#E53E3E',
      warningColor: '#DD6B20',
      infoColor: '#00B5D8',
      borderColor: '#E2E8F0'
    },
    vibrant: {
      bgPrimary: '#FFFFFF',
      bgSecondary: '#F9F9FF',
      bgTertiary: '#F0F0FF',
      textPrimary: '#2D3748',
      textSecondary: '#718096',
      accentColor: '#805AD5',
      successColor: '#38B2AC',
      errorColor: '#F56565',
      warningColor: '#ED8936',
      infoColor: '#4299E1',
      borderColor: '#E2E8F0'
    },
    contrast: {
      bgPrimary: '#FFFFFF',
      bgSecondary: '#F5F5F5',
      bgTertiary: '#EEEEEE',
      textPrimary: '#000000',
      textSecondary: '#333333',
      accentColor: '#0056B3',
      successColor: '#006400',
      errorColor: '#B30000',
      warningColor: '#856404',
      infoColor: '#004085',
      borderColor: '#CCCCCC'
    },
    calm: {
      bgPrimary: '#FFFFFF',
      bgSecondary: '#F5F9F7',
      bgTertiary: '#EDF7F2',
      textPrimary: '#1F2937',
      textSecondary: '#4B5563',
      accentColor: '#059669',
      successColor: '#10B981',
      errorColor: '#EF4444',
      warningColor: '#F59E0B',
      infoColor: '#3B82F6',
      borderColor: '#D1FAE5'
    }
  }
};