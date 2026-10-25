import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/providers/ThemeProvider';
import { MapFab } from '../map/MapFab';

type FloatingButtonsProps = {
  onBack?: () => void;
};

export default function FloatingButtons({ onBack }: FloatingButtonsProps) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const topInset = insets?.top ? Math.max(insets.top, 20) : 40;
  const styles = useMemo(() => createStyles(isDark), [isDark]);

  return (
    <>
      <TouchableOpacity
        style={[styles.btnCircle, { top: topInset + 10, left: 20 }]}
        onPress={onBack}
        activeOpacity={0.8}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      >
        <Ionicons
          name="chevron-back"
          size={26}
          color={isDark ? '#FFFFFF' : '#111113'}
          style={styles.iconFix}
        />
      </TouchableOpacity>

      <View style={styles.fabWrapper} pointerEvents="box-none">
        <MapFab />
      </View>
    </>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    btnCircle: {
      position: 'absolute',
      width: 44,
      height: 44,
      backgroundColor: isDark ? 'rgba(18, 18, 18, 0.9)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      elevation: 20,
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
