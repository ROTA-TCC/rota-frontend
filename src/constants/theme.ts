import { Platform } from 'react-native';

const tintColorLight = '#ff9a00';
const tintColorDark = '#ff9a00';

export const Colors = {
  light: {
    text: '#0e0e0e',
    background: '#ffffff',
    tint: tintColorLight,
    icon: '#0e0e0e99',
    tabIconDefault: '#0e0e0e99',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ffffff',
    background: '#0e0e0e',
    tint: tintColorDark,
    icon: '#ffffff99',
    tabIconDefault: '#ffffff99',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
