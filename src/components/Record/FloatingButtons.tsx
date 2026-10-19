import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MapFab } from '@/components/map/MapFab';
import { colors, shadows } from '@/theme';

type FloatingButtonsProps = {
  onBack?: () => void;
};

export default function FloatingButtons({ onBack }: FloatingButtonsProps) {
  const insets = useSafeAreaInsets();
  const topOffset = insets.top > 0 ? Math.max(insets.top, 20) : 40;

  return (
    <>
      <TouchableOpacity
        style={[styles.btnCircle, { top: topOffset + 10 }]}
        onPress={onBack}
        activeOpacity={0.8}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        accessibilityRole="button"
        accessibilityLabel="Voltar"
      >
        <Ionicons name="chevron-back" size={26} color={colors.text} style={styles.iconFix} />
      </TouchableOpacity>

      <View style={styles.fabWrapper} pointerEvents="box-none">
        <MapFab />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  btnCircle: {
    position: 'absolute',
    left: 20,
    width: 44,
    height: 44,
    backgroundColor: colors.surfaceOverlayDark,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    ...shadows.fab,
  },
  iconFix: {
    marginLeft: -2,
    marginTop: 1,
  },
  fabWrapper: {
    ...StyleSheet.absoluteFill,
    transform: [{ translateY: -50 }],
    zIndex: 900,
    elevation: 15,
  },
});
