import { useTheme } from '@/providers/ThemeProvider';

export interface SettingsPalette {
  screen: string;
  card: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  icon: string;
  chevron: string;
  backButton: string;
  accent: string;
  accentText: string;
  toggleActive: string;
  toggleInactive: string;
  toggleHandle: string;
  logout: string;
  shadow: string;
}

export const SettingsLightColors: SettingsPalette = {
  screen: '#FFFFFF',
  card: '#F8F9FA',
  border: '#E5E5EA',
  textPrimary: '#1C1C1E',
  textSecondary: '#8E8E93',
  icon: '#48484A',
  chevron: '#C7C7CC',
  backButton: '#F2F2F7',
  accent: '#A3D900',
  accentText: '#000000',
  toggleActive: '#34C759',
  toggleInactive: '#E5E5EA',
  toggleHandle: '#FFFFFF',
  logout: '#FF3B30',
  shadow: '#000000',
};

export const SettingsDarkColors: SettingsPalette = {
  screen: '#09090B',
  card: '#151517',
  border: '#27272A',
  textPrimary: '#FFFFFF',
  textSecondary: '#A1A1AA',
  icon: '#D4D4D8',
  chevron: '#52525B',
  backButton: '#1F1F23',
  accent: '#D2FF1F',
  accentText: '#000000',
  toggleActive: '#34C759',
  toggleInactive: '#3F3F46',
  toggleHandle: '#FFFFFF',
  logout: '#FF453A',
  shadow: '#000000',
};

export const useSettingsColors = (): SettingsPalette => {
  const { isDark } = useTheme();
  return isDark ? SettingsDarkColors : SettingsLightColors;
};
