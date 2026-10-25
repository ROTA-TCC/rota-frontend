import { useTheme } from '@/providers/ThemeProvider';

export interface ExplorePalette {
  background: string;
  capsule: string;
  card: string;
  storyAvatar: string;
  avatarFallback: string;
  accentPrimary: string;
  accentOrange: string;
  borderScreen: string;
  borderCapsule: string;
  borderCard: string;
  borderPill: string;
  borderRuler: string;
  textPrimary: string;
  textMuted: string;
  textBanner: string;
  textChevron: string;
  textStoryIcon: string;
  textRuler: string;
  caloriesText: string;
  caloriesUnit: string;
  caloriesPillBackground: string;
  caloriesPillLabel: string;
  chartInactive: string;
  shadow: string;
}

export const ExploreDarkColors: ExplorePalette = {
  background: '#08080A',
  capsule: '#0F0F12',
  card: '#141518',
  storyAvatar: '#1C1D22',
  avatarFallback: '#887842',
  accentPrimary: '#04FC5C',
  accentOrange: '#F69919',
  borderScreen: '#1A1A1E',
  borderCapsule: '#2C2C30',
  borderCard: '#1F2026',
  borderPill: '#26272E',
  borderRuler: '#2A2C33',
  textPrimary: '#FFFFFF',
  textMuted: '#8E8E93',
  textBanner: '#9A9AB0',
  textChevron: '#636366',
  textStoryIcon: '#77777D',
  textRuler: '#585966',
  caloriesText: '#000000',
  caloriesUnit: '#3D2200',
  caloriesPillBackground: 'rgba(0, 0, 0, 0.12)',
  caloriesPillLabel: '#4D2C00',
  chartInactive: '#3D404A',
  shadow: '#000000',
};

export const ExploreLightColors: ExplorePalette = {
  background: '#F5F6F8',
  capsule: '#FFFFFF',
  card: '#FFFFFF',
  storyAvatar: '#E9E9EE',
  avatarFallback: '#D9C98F',
  accentPrimary: '#04C95B',
  accentOrange: '#F69919',
  borderScreen: '#E5E5EA',
  borderCapsule: '#D8D8DE',
  borderCard: '#E8E8EE',
  borderPill: '#E2E2E8',
  borderRuler: '#DADAE0',
  textPrimary: '#111113',
  textMuted: '#6B7280',
  textBanner: '#4B5563',
  textChevron: '#9CA3AF',
  textStoryIcon: '#6B7280',
  textRuler: '#9CA3AF',
  caloriesText: '#000000',
  caloriesUnit: '#3D2200',
  caloriesPillBackground: 'rgba(0, 0, 0, 0.06)',
  caloriesPillLabel: '#4D2C00',
  chartInactive: '#D4D4D8',
  shadow: '#000000',
};

export const useExploreColors = (): ExplorePalette => {
  const { isDark } = useTheme();
  return isDark ? ExploreDarkColors : ExploreLightColors;
};
