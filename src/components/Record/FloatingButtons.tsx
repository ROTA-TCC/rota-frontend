import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapFab } from '../map/MapFab';

type FloatingButtonsProps = {
  onBack?: () => void;
};

export default function FloatingButtons({ onBack }: FloatingButtonsProps) {
  const insets = useSafeAreaInsets();
  const topInset = insets?.top ? Math.max(insets.top, 20) : 40;

  return (
    <>
      <TouchableOpacity 
        style={[styles.btnCircle, { top: topInset + 10, left: 20 }]} 
        onPress={onBack}
        activeOpacity={0.8}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      >
        <Ionicons name="chevron-back" size={26} color="white" style={styles.iconFix} />
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
    width: 44,
    height: 44,
    backgroundColor: 'rgba(18, 18, 18, 0.9)',
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
    ...StyleSheet.absoluteFillObject,
    transform: [{ translateY: 15 }], 
    zIndex: 900,
    elevation: 15,
  },
});