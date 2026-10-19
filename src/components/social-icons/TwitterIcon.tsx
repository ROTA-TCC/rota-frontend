import { FontAwesome6 } from '@expo/vector-icons';

import { colors } from '@/theme';

export default function TwitterIcon({ size = 24, color = colors.textDark }: { size?: number; color?: string }) {
  return <FontAwesome6 name="x-twitter" size={size} color={color} />;
}
