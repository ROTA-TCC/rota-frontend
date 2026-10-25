import { useTheme } from '@/providers/ThemeProvider';

export interface AuthTheme {
  background: string;
  surface: string;
  surfaceFocused: string;
  surfacePressed: string;
  border: string;
  borderStrong: string;
  borderFocused: string;
  borderError: string;
  text: string;
  textMuted: string;
  textFaint: string;
  success: string;
  error: string;
  errorBannerBackground: string;
  errorBannerBorder: string;
  submit: string;
  submitPressed: string;
  submitText: string;
  link: string;
  switchTrackOff: string;
  switchTrackOn: string;
  switchBorderOff: string;
  switchBorderOn: string;
  switchThumbOff: string;
  switchThumbOn: string;
}

export const AuthLightTheme: AuthTheme = {
  background: '#f8f8f9',
  surface: '#ffffff',
  surfaceFocused: '#ffffff',
  surfacePressed: '#f1f1f3',
  border: '#ededf0',
  borderStrong: '#d1d1d6',
  borderFocused: '#c7c7cc',
  borderError: '#fca5a5',
  text: '#111111',
  textMuted: '#6e6e73',
  textFaint: '#8e8e93',
  success: '#10b981',
  error: '#dc2626',
  errorBannerBackground: 'rgba(220, 38, 38, 0.06)',
  errorBannerBorder: 'rgba(220, 38, 38, 0.2)',
  submit: '#000000',
  submitPressed: '#27272a',
  submitText: '#ffffff',
  link: '#111111',
  switchTrackOff: '#cccccc',
  switchTrackOn: '#111111',
  switchBorderOff: 'transparent',
  switchBorderOn: '#111111',
  switchThumbOff: '#ffffff',
  switchThumbOn: '#ffffff',
};

export const AuthDarkTheme: AuthTheme = {
  background: '#09090b',
  surface: '#18181b',
  surfaceFocused: '#1f1f23',
  surfacePressed: '#27272a',
  border: '#27272a',
  borderStrong: '#3f3f46',
  borderFocused: '#52525b',
  borderError: '#7f1d1d',
  text: '#ffffff',
  textMuted: '#a1a1aa',
  textFaint: '#71717a',
  success: '#34d399',
  error: '#f87171',
  errorBannerBackground: 'rgba(248, 113, 113, 0.08)',
  errorBannerBorder: 'rgba(248, 113, 113, 0.25)',
  submit: '#ffffff',
  submitPressed: '#e4e4e7',
  submitText: '#09090b',
  link: '#ffffff',
  switchTrackOff: '#27272a',
  switchTrackOn: '#ffffff',
  switchBorderOff: '#3f3f46',
  switchBorderOn: '#ffffff',
  switchThumbOff: '#f4f4f5',
  switchThumbOn: '#09090b',
};

export const AuthThemes = {
  light: AuthLightTheme,
  dark: AuthDarkTheme,
} as const;

export const useAuthTheme = (): AuthTheme => {
  const { isDark } = useTheme();
  return isDark ? AuthDarkTheme : AuthLightTheme;
};
