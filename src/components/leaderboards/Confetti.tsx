import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

import { colors } from '@/theme';

export type ConfettiRef = {
  fire: () => void;
};

type ConfettiProps = {
  count?: number;
  origin?: { x: number; y: number };
  manualstart?: boolean;
  fadeOut?: boolean;
  colors?: string[];
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DEFAULT_CONFETTI_COLORS = [
  colors.accentSteelBlue,
  colors.gold,
  colors.accentGreen,
  colors.danger,
  colors.info,
];

export const Confetti = forwardRef<ConfettiRef, ConfettiProps>(function Confetti(
  {
    count = 80,
    origin = { x: SCREEN_WIDTH / 2, y: -60 },
    manualstart = true,
    fadeOut = true,
    colors: confettiColors = DEFAULT_CONFETTI_COLORS,
  },
  ref
) {
  const cannonRef = useRef<ConfettiCannon | null>(null);

  const fire = useCallback(() => {
    cannonRef.current?.start();
  }, []);

  useImperativeHandle(ref, () => ({ fire }), [fire]);

  useEffect(() => {
    if (!manualstart) {
      fire();
    }
  }, [manualstart, fire]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <ConfettiCannon
        ref={cannonRef}
        count={count}
        origin={origin}
        autoStart={!manualstart}
        fadeOut={fadeOut}
        colors={confettiColors}
        explosionSpeed={800}
        fallSpeed={4000}
      />
    </View>
  );
});
