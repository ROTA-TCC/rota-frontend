import { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { colors } from '@/theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface InteractiveZoneCircleProps {
  containerSize: number;
  centerCoords: [number, number];
  zoom: number;
  onDistanceChange?: (formattedDistance: string) => void;
  onRadiusMetersChange?: (meters: number) => void;
}

function getMetersPerPx(z: number, lat: number) {
  'worklet';
  const latRad = (lat * Math.PI) / 180;
  return (156543.03392 * Math.cos(latRad)) / Math.pow(2, z);
}

function calculateDistance(rPx: number, z: number, lat: number) {
  'worklet';
  return Math.round(rPx * getMetersPerPx(z, lat));
}

function calculateDistanceStr(meters: number) {
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function InteractiveZoneCircle({
  containerSize,
  centerCoords,
  zoom,
  onDistanceChange,
  onRadiusMetersChange,
}: InteractiveZoneCircleProps) {
  const center = containerSize / 2;
  const minRadius = 40;
  const maxRadius = containerSize / 2 - 32;

  const radius = useSharedValue(70);
  const startRadius = useSharedValue(70);
  const lastDistRef = useRef('');

  const handleAngleRad = (-45 * Math.PI) / 180;
  const gapAngleDeg = 48;

  const updateDistance = useCallback(
    (currentRadiusPx: number, currentZoom: number, currentLat: number) => {
      const meters = calculateDistance(currentRadiusPx, currentZoom, currentLat);
      const dist = calculateDistanceStr(meters);

      onRadiusMetersChange?.(meters);

      if (dist !== lastDistRef.current) {
        lastDistRef.current = dist;
        onDistanceChange?.(dist);
      }
    },
    [onDistanceChange, onRadiusMetersChange]
  );

  useEffect(() => {
    updateDistance(radius.get(), zoom, centerCoords[0]);
  }, [updateDistance, radius, zoom, centerCoords]);

  useAnimatedReaction(
    () => radius.get(),
    (currentRadius) => {
      runOnJS(updateDistance)(currentRadius, zoom, centerCoords[0]);
    }
  );

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startRadius.set(radius.get());
    })
    .onUpdate((event) => {
      const delta = (event.translationX - event.translationY) / Math.SQRT2;
      let newR = startRadius.get() + delta;

      if (newR < minRadius) newR = minRadius;
      if (newR > maxRadius) newR = maxRadius;

      radius.set(newR);
    });

  const animatedArcProps = useAnimatedProps(() => {
    const r = radius.get();
    const gapRad = (gapAngleDeg * Math.PI) / 180;
    const startAngle = handleAngleRad + gapRad / 2;
    const endAngle = handleAngleRad - gapRad / 2 + 2 * Math.PI;

    const x1 = center + r * Math.cos(startAngle);
    const y1 = center + r * Math.sin(startAngle);
    const x2 = center + r * Math.cos(endAngle);
    const y2 = center + r * Math.sin(endAngle);

    return { d: `M ${x1} ${y1} A ${r} ${r} 0 1 1 ${x2} ${y2}` };
  });

  const animatedFillStyle = useAnimatedStyle(() => ({
    width: radius.get() * 2,
    height: radius.get() * 2,
    borderRadius: radius.get(),
  }));

  const animatedHandleStyle = useAnimatedStyle(() => {
    const r = radius.get();
    return {
      transform: [
        { translateX: center + r * Math.cos(handleAngleRad) - 24 },
        { translateY: center + r * Math.sin(handleAngleRad) - 24 },
      ],
    };
  });

  return (
    <View
      style={[styles.overlayContainer, { width: containerSize, height: containerSize }]}
      pointerEvents="box-none"
    >
      <Animated.View style={[styles.zoneFill, animatedFillStyle]} pointerEvents="none" />
      <View
        style={[styles.centerDot, { top: center - 5, left: center - 5 }]}
        pointerEvents="none"
      />

      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        <AnimatedPath
          animatedProps={animatedArcProps}
          stroke={colors.primary}
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>

      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[styles.cleanHandle, animatedHandleStyle]}
          accessibilityRole="adjustable"
          accessibilityLabel="Ajustar área oculta"
        >
          <Svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <Path
              d="M14 10L21 3M21 3H16M21 3V8M10 14L3 21M3 21H8M3 21V16"
              stroke={colors.textDark}
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  zoneFill: {
    position: 'absolute',
    backgroundColor: colors.zoneFill,
  },
  centerDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.backgroundAlt,
  },
  cleanHandle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
});
