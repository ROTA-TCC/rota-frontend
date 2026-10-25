import { useTheme } from '@/providers/ThemeProvider';

export interface SocialPalette {
  surface: string;
  surfaceElevated: string;
  border: string;
  divider: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentSoft: string;
  accentText: string;
  verified: string;
  verifiedText: string;
  trophy: string;
  avatarBorder: string;
  badgeBackground: string;
  badgeText: string;
}

export const SocialDarkColors: SocialPalette = {
  surface: '#141518',
  surfaceElevated: '#1E1F24',
  border: 'rgba(255, 255, 255, 0.07)',
  divider: 'rgba(255, 255, 255, 0.08)',
  textPrimary: '#FFFFFF',
  textSecondary: '#8E8E93',
  accent: '#FC4C02',
  accentSoft: 'rgba(252, 76, 2, 0.16)',
  accentText: '#FFFFFF',
  verified: '#FC4C02',
  verifiedText: '#FFFFFF',
  trophy: '#CD7F32',
  avatarBorder: '#141518',
  badgeBackground: '#FFFFFF',
  badgeText: '#000000',
};

export const SocialLightColors: SocialPalette = {
  surface: '#FFFFFF',
  surfaceElevated: '#F2F2F5',
  border: 'rgba(0, 0, 0, 0.07)',
  divider: 'rgba(0, 0, 0, 0.07)',
  textPrimary: '#111113',
  textSecondary: '#6B7280',
  accent: '#E34F1E',
  accentSoft: 'rgba(227, 79, 30, 0.10)',
  accentText: '#FFFFFF',
  verified: '#E34F1E',
  verifiedText: '#FFFFFF',
  trophy: '#B87333',
  avatarBorder: '#FFFFFF',
  badgeBackground: '#111113',
  badgeText: '#FFFFFF',
};

export const useSocialColors = (): SocialPalette => {
  const { isDark } = useTheme();
  return isDark ? SocialDarkColors : SocialLightColors;
};
