import { useTheme } from '@/providers/ThemeProvider';

export interface MapPalette {
  background: string;
  surface: string;
  surfaceStrong: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentSoft: string;
  overlay: string;
  shadow: string;
  badgeBackground: string;
  badgeText: string;
}

export const MapDarkColors: MapPalette = {
  background: '#121212',
  surface: 'rgba(20, 20, 20, 0.95)',
  surfaceStrong: '#1A1A1A',
  border: 'rgba(255, 255, 255, 0.1)',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  accent: '#E34F1E',
  accentSoft: 'rgba(227, 79, 30, 0.12)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: '#000000',
  badgeBackground: '#FFFFFF',
  badgeText: '#000000',
};

export const MapLightColors: MapPalette = {
  background: '#F5F5F7',
  surface: 'rgba(255, 255, 255, 0.97)',
  surfaceStrong: '#FFFFFF',
  border: 'rgba(0, 0, 0, 0.08)',
  textPrimary: '#111113',
  textSecondary: '#6B7280',
  accent: '#E34F1E',
  accentSoft: 'rgba(227, 79, 30, 0.12)',
  overlay: 'rgba(0, 0, 0, 0.35)',
  shadow: '#000000',
  badgeBackground: '#111113',
  badgeText: '#FFFFFF',
};

export const useMapColors = (): MapPalette => {
  const { isDark } = useTheme();
  return isDark ? MapDarkColors : MapLightColors;
};
