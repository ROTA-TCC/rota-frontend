import { FontAwesome } from '@expo/vector-icons';

import { colors } from '@/theme';

export default function AppleIcon({ size = 24, color = colors.textDark }: { size?: number; color?: string }) {
  return <FontAwesome name="apple" size={size} color={color} />;
}
