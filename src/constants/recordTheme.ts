import { useTheme } from '@/providers/ThemeProvider';

export interface RecordPalette {
  background: string;
  card: string;
  cardPressed: string;
  accent: string;
  accentPressed: string;
  accentSoft: string;
  blue: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderFrame: string;
  iconBackground: string;
  buttonText: string;
  chartLine: string;
  chartText: string;
  chartDotStroke: string;
  overlay: string;
}

export const RecordDarkColors: RecordPalette = {
  background: '#0A0A0C',
  card: '#16161A',
  cardPressed: '#1E1E24',
  accent: '#FE9900',
  accentPressed: '#E0850D',
  accentSoft: 'rgba(254, 153, 0, 0.12)',
  blue: '#3D79FF',
  textPrimary: '#FFFFFF',
  textSecondary: '#A1A1AA',
  textMuted: '#52525B',
  border: 'rgba(255, 255, 255, 0.08)',
  borderFrame: 'rgba(255, 255, 255, 0.1)',
  iconBackground: 'rgba(255, 255, 255, 0.05)',
  buttonText: '#000000',
  chartLine: '#FFFFFF',
  chartText: '#FFFFFF',
  chartDotStroke: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.68)',
};

export const RecordLightColors: RecordPalette = {
  background: '#F5F5F7',
  card: '#FFFFFF',
  cardPressed: '#F0F0F2',
  accent: '#FE9900',
  accentPressed: '#E0850D',
  accentSoft: 'rgba(254, 153, 0, 0.14)',
  blue: '#3D79FF',
  textPrimary: '#111113',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: 'rgba(0, 0, 0, 0.08)',
  borderFrame: 'rgba(0, 0, 0, 0.1)',
  iconBackground: 'rgba(0, 0, 0, 0.05)',
  buttonText: '#000000',
  chartLine: '#111113',
  chartText: '#111113',
  chartDotStroke: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const useRecordColors = (): RecordPalette => {
  const { isDark } = useTheme();
  return isDark ? RecordDarkColors : RecordLightColors;
};
