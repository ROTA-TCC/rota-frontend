import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapFab } from '../map/MapFab';

type FloatingButtonsProps = {
  onBack?: () => void;
};

export default function FloatingButtons({ onBack }: FloatingButtonsProps) {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, 20);

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <TouchableOpacity 
        style={[styles.btnCircle, { top: topInset + 10, left: 20 }]} 
        onPress={onBack}
        activeOpacity={0.8}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      >
        <Ionicons name="chevron-back" size={26} color="white" />
      </TouchableOpacity>

      <View style={styles.fabWrapper} pointerEvents="box-none">
        <MapFab />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999, 
    elevation: 9999,
  },
  btnCircle: {
    position: 'absolute',
    width: 44,
    height: 44,
    backgroundColor: 'rgba(18, 18, 18, 0.9)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
    elevation: 10000,
  },
  fabWrapper: {
    ...StyleSheet.absoluteFillObject,
    transform: [{ translateY: 45 }],
    zIndex: 9999,
    elevation: 9999,
  },
});
