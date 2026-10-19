import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { SubFab } from '@/components/map/SubFab';
import { ThemedText } from '@/components/themed-text';
import { colors, shadows } from '@/theme';

const SPRING_CONFIG = { damping: 12, stiffness: 180, mass: 0.8 };
const SUB_FAB_OFFSET = 60;

export function MapFab() {
  const [active, setActive] = useState(false);
  const progress = useSharedValue(0);

  const toggleFab = () => {
    const next = !active;
    setActive(next);
    progress.set(next ? withSpring(1, SPRING_CONFIG) : withTiming(0, { duration: 200 }));
  };

  const mainIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-90 + 90 * progress.get()}deg` }],
  }));

  return (
    <View style={styles.container}>
      <SubFab progress={progress} offset={SUB_FAB_OFFSET * 3}>
        <Ionicons name="layers" size={18} color={colors.text} />
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>1</ThemedText>
        </View>
      </SubFab>

      <SubFab progress={progress} offset={SUB_FAB_OFFSET * 2}>
        <Ionicons name="locate" size={18} color={colors.text} />
      </SubFab>

      <SubFab progress={progress} offset={SUB_FAB_OFFSET}>
        <FontAwesome5 name="pencil-alt" size={18} color={colors.text} />
      </SubFab>

      <TouchableOpacity
        style={styles.mainFab}
        onPress={toggleFab}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={active ? 'Fechar ações do mapa' : 'Abrir ações do mapa'}
      >
        <Animated.View style={mainIconStyle}>
          <Ionicons name="ellipsis-horizontal" size={22} color={colors.text} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    bottom: 235,
    width: 48,
    height: 48,
  },
  mainFab: {
    width: 48,
    height: 48,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
    ...shadows.fab,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.text,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: colors.textDark,
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 18,
    includeFontPadding: false,
  },
});
