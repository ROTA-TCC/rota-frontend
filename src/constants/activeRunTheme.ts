import { useTheme } from '@/providers/ThemeProvider';

export interface ActiveRunPalette {
  background: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  divider: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentText: string;
  mapControlBackground: string;
  mapControlIcon: string;
  shadow: string;
}

export const ActiveRunDarkColors: ActiveRunPalette = {
  background: '#121212',
  surface: '#18181B',
  surfaceElevated: '#2C2C2E',
  border: 'rgba(255, 255, 255, 0.08)',
  divider: 'rgba(255, 255, 255, 0.15)',
  textPrimary: '#FFFFFF',
  textSecondary: '#8E8E93',
  accent: '#E34F1E',
  accentText: '#FFFFFF',
  mapControlBackground: 'rgba(0, 0, 0, 0.65)',
  mapControlIcon: '#FFFFFF',
  shadow: '#000000',
};

export const ActiveRunLightColors: ActiveRunPalette = {
  background: '#F5F5F7',
  surface: '#FFFFFF',
  surfaceElevated: '#E9E9EE',
  border: 'rgba(0, 0, 0, 0.08)',
  divider: 'rgba(0, 0, 0, 0.14)',
  textPrimary: '#111113',
  textSecondary: '#6B7280',
  accent: '#E34F1E',
  accentText: '#FFFFFF',
  mapControlBackground: 'rgba(0, 0, 0, 0.65)',
  mapControlIcon: '#FFFFFF',
  shadow: '#000000',
};

export const useActiveRunColors = (): ActiveRunPalette => {
  const { isDark } = useTheme();
  return isDark ? ActiveRunDarkColors : ActiveRunLightColors;
};
