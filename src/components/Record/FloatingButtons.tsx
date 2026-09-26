import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapFab } from '../map/MapFab';

type FloatingButtonsProps = {
  onBack?: () => void;
  bottomOffset?: number;
};

export default function FloatingButtons({ onBack, bottomOffset = 215 }: FloatingButtonsProps) {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, 20);

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
      <TouchableOpacity 
        style={[styles.btnCircle, { top: topInset + 10, left: 20 }]} 
        onPress={onBack}
        activeOpacity={0.8}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="chevron-back" size={26} color="white" />
      </TouchableOpacity>

      <View style={[styles.fabWrapper, { bottom: bottomOffset }]} pointerEvents="box-none">
        <MapFab />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  btnCircle: {
    position: 'absolute',
    width: 44,
    height: 44,
    backgroundColor: 'rgba(18, 18, 18, 0.9)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 30,
    elevation: 10,
  },
  fabWrapper: {
    position: 'absolute',
    right: 16,
    zIndex: 25,
    elevation: 10,
  },
});