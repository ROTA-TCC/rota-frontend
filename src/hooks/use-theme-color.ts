import { useColorScheme } from '@/hooks/use-color-scheme';
import { themed } from '@/theme';

type ThemeColorName = keyof typeof themed.light & keyof typeof themed.dark;

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ThemeColorName
) {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? 'dark' : 'light';
  const colorFromProps = props[theme];

  return colorFromProps ?? themed[theme][colorName];
}
