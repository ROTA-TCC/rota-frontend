import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { colors, typography } from '@/theme';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: typography.sizes.input,
    lineHeight: typography.lineHeights.input,
  },
  defaultSemiBold: {
    fontSize: typography.sizes.input,
    lineHeight: typography.lineHeights.input,
    fontWeight: typography.weights.semibold,
  },
  title: {
    fontSize: typography.sizes.hero,
    fontWeight: typography.weights.bold,
    lineHeight: typography.sizes.hero,
  },
  subtitle: {
    fontSize: typography.sizes.headline,
    fontWeight: typography.weights.bold,
  },
  link: {
    lineHeight: 30,
    fontSize: typography.sizes.input,
    color: colors.link,
  },
});
