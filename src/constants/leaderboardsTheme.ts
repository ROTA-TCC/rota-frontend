import { useTheme } from '@/providers/ThemeProvider';

export interface LeaderboardsPalette {
  background: string;
  card: string;
  cardAlt: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentText: string;
  accentBorder: string;
  positive: string;
  negative: string;
  positiveBackground: string;
  negativeBackground: string;
  avatarBackground: string;
  rankFirst: string;
  rankSecond: string;
  rankThird: string;
  stickyBackground: string;
}

export const LeaderboardsDarkColors: LeaderboardsPalette = {
  background: '#09090B',
  card: '#151517',
  cardAlt: '#1F1F22',
  border: '#2A2A2E',
  textPrimary: '#FFFFFF',
  textSecondary: '#8E8E93',
  accent: '#9ED872',
  accentText: '#000000',
  accentBorder: 'rgba(158, 216, 114, 0.3)',
  positive: '#9ED872',
  negative: '#FF453A',
  positiveBackground: 'rgba(158, 216, 114, 0.12)',
  negativeBackground: 'rgba(255, 69, 58, 0.12)',
  avatarBackground: '#2A2A2E',
  rankFirst: '#F59E0B',
  rankSecond: '#94A3B8',
  rankThird: '#D97706',
  stickyBackground: 'rgba(21, 21, 23, 0.96)',
};

export const LeaderboardsLightColors: LeaderboardsPalette = {
  background: '#F5F5F7',
  card: '#FFFFFF',
  cardAlt: '#EFEFF2',
  border: '#E5E5EA',
  textPrimary: '#111113',
  textSecondary: '#6B7280',
  accent: '#3E9B2E',
  accentText: '#FFFFFF',
  accentBorder: 'rgba(62, 155, 46, 0.3)',
  positive: '#3E9B2E',
  negative: '#E53935',
  positiveBackground: 'rgba(62, 155, 46, 0.12)',
  negativeBackground: 'rgba(229, 57, 53, 0.1)',
  avatarBackground: '#E5E5EA',
  rankFirst: '#D97706',
  rankSecond: '#64748B',
  rankThird: '#B45309',
  stickyBackground: 'rgba(255, 255, 255, 0.96)',
};

export const useLeaderboardsColors = (): LeaderboardsPalette => {
  const { isDark } = useTheme();
  return isDark ? LeaderboardsDarkColors : LeaderboardsLightColors;
};
