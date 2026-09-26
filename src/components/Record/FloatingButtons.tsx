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

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
      <TouchableOpacity 
        style={[styles.btnCircle, { top: insets.top + 10, left: 20 }]} 
        onPress={onBack}
        activeOpacity={0.8}
      >
        <Ionicons name="chevron-back" size={26} color="white" />
      </TouchableOpacity>

      <MapFab />
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
    zIndex: 10,
  },
});