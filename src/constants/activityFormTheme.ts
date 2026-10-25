import { useTheme } from '@/providers/ThemeProvider';

export interface ActivityFormPalette {
  background: string;
  card: string;
  cardAlt: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentText: string;
  accentSoft: string;
  accentBorder: string;
  danger: string;
  dangerSoft: string;
  overlay: string;
  mapOverlay: string;
  shadow: string;
  chartInactive: string;
}

export const ActivityFormDarkColors: ActivityFormPalette = {
  background: '#08080A',
  card: '#151517',
  cardAlt: '#1F1F22',
  border: '#2A2A2E',
  textPrimary: '#FFFFFF',
  textSecondary: '#8E8E93',
  textMuted: '#52525B',
  accent: '#D2FF1F',
  accentText: '#000000',
  accentSoft: 'rgba(210, 255, 31, 0.12)',
  accentBorder: 'rgba(210, 255, 31, 0.35)',
  danger: '#FF453A',
  dangerSoft: 'rgba(255, 69, 58, 0.12)',
  overlay: 'rgba(0, 0, 0, 0.72)',
  mapOverlay: 'rgba(0, 0, 0, 0.58)',
  shadow: '#000000',
  chartInactive: 'rgba(210, 255, 31, 0.16)',
};

export const ActivityFormLightColors: ActivityFormPalette = {
  background: '#F5F5F7',
  card: '#FFFFFF',
  cardAlt: '#F0F0F3',
  border: '#E5E5EA',
  textPrimary: '#111113',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  accent: '#A3D900',
  accentText: '#000000',
  accentSoft: 'rgba(163, 217, 0, 0.16)',
  accentBorder: 'rgba(163, 217, 0, 0.4)',
  danger: '#E53935',
  dangerSoft: 'rgba(229, 57, 53, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  mapOverlay: 'rgba(0, 0, 0, 0.5)',
  shadow: '#000000',
  chartInactive: 'rgba(163, 217, 0, 0.2)',
};

export const useActivityFormColors = (): ActivityFormPalette => {
  const { isDark } = useTheme();
  return isDark ? ActivityFormDarkColors : ActivityFormLightColors;
};
