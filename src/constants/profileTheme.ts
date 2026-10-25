import { useTheme } from '@/providers/ThemeProvider';

export interface ProfilePalette {
  background: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentText: string;
  flame: string;
}

export const ProfileDarkColors: ProfilePalette = {
  background: '#08080A',
  surface: '#18181B',
  surfaceElevated: '#242428',
  border: 'rgba(255, 255, 255, 0.05)',
  textPrimary: '#FFFFFF',
  textSecondary: '#8E8E93',
  accent: '#D2FF1F',
  accentText: '#000000',
  flame: '#FF9D00',
};

export const ProfileLightColors: ProfilePalette = {
  background: '#F5F5F7',
  surface: '#FFFFFF',
  surfaceElevated: '#EFEFF2',
  border: 'rgba(0, 0, 0, 0.06)',
  textPrimary: '#111113',
  textSecondary: '#6B7280',
  accent: '#A3D900',
  accentText: '#000000',
  flame: '#FF9D00',
};

export const useProfileColors = (): ProfilePalette => {
  const { isDark } = useTheme();
  return isDark ? ProfileDarkColors : ProfileLightColors;
};
