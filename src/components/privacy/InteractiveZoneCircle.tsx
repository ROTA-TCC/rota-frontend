import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
  withTiming,
  useAnimatedReaction,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const ORANGE = '#FF8C00';
const AnimatedPath = Animated.createAnimatedComponent(Path);

interface InteractiveZoneCircleProps {
  containerSize: number;
  centerCoords: [number, number];
  zoom: number;
  onDistanceChange?: (formattedDistance: string) => void;
}

export function InteractiveZoneCircle({
  containerSize,
  centerCoords,
  zoom,
  onDistanceChange,
}: InteractiveZoneCircleProps) {
  const center = containerSize / 2;
  const minRadius = 40;
  const maxRadius = containerSize / 2 - 32;

  const radius = useSharedValue(70);
  const startRadius = useSharedValue(70);
  
  const prevZoom = useSharedValue(zoom);
  const targetDistanceMeters = useSharedValue(0);

  const handleAngleRad = (-45 * Math.PI) / 180;
  const gapAngleDeg = 48; 
  const lastDistRef = useRef('');

  const getMetersPerPx = (z: number, lat: number) => {
    'worklet';
    const latRad = (lat * Math.PI) / 180;
    return (156543.03392 * Math.cos(latRad)) / Math.pow(2, z);
  };

  const calculateDistanceStr = (rPx: number, z: number, lat: number) => {
    const meters = Math.round(rPx * getMetersPerPx(z, lat));
    if (meters < 1000) return `${meters} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const updateDistanceJS = (currentRadiusPx: number) => {
    const dist = calculateDistanceStr(currentRadiusPx, zoom, centerCoords[0]);
    if (dist !== lastDistRef.current && onDistanceChange) {
      lastDistRef.current = dist;
      onDistanceChange(dist);
    }
  };

  // Define a distância em metros atual quando o mapa monta
  useEffect(() => {
    if (targetDistanceMeters.value === 0) {
      targetDistanceMeters.value = radius.value * getMetersPerPx(zoom, centerCoords[0]);
    }
  }, []);

  // Quando o ZOOM muda, o círculo recalcula os pixels necessários 
  // para cobrir a MESMA distância correspondente na vida real
  useEffect(() => {
    if (prevZoom.value !== zoom && targetDistanceMeters.value > 0) {
      const targetPx = targetDistanceMeters.value / getMetersPerPx(zoom, centerCoords[0]);
      let clamped = targetPx;
      if (clamped < minRadius) clamped = minRadius;
      if (clamped > maxRadius) clamped = maxRadius;
      
      radius.value = withTiming(clamped, { duration: 300 });
      prevZoom.value = zoom;
    }
  }, [zoom, centerCoords]);

  useAnimatedReaction(
    () => radius.value,
    (currentRadius) => {
      runOnJS(updateDistanceJS)(currentRadius);
    }
  );

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startRadius.value = radius.value;
    })
    .onUpdate((event) => {
      const delta = (event.translationX - event.translationY) / Math.SQRT2;
      let newR = startRadius.value + delta;

      if (newR < minRadius) newR = minRadius;
      if (newR > maxRadius) newR = maxRadius;

      radius.value = newR;
      // Salva a nova métrica na vida real
      targetDistanceMeters.value = newR * getMetersPerPx(zoom, centerCoords[0]);
    });

  const animatedArcProps = useAnimatedProps(() => {
    const r = radius.value;
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
    width: radius.value * 2,
    height: radius.value * 2,
    borderRadius: radius.value,
  }));

  const animatedHandleStyle = useAnimatedStyle(() => {
    const r = radius.value;
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
      <View style={[styles.centerDot, { top: center - 5, left: center - 5 }]} />

      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        <AnimatedPath
          animatedProps={animatedArcProps}
          stroke={ORANGE}
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.cleanHandle, animatedHandleStyle]}>
          {/* Ícone PRETO, FINO (1.2), MAIOR (36) e SEM SOMBRA (CleanHandle zera shadow) */}
          <Svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <Path
              d="M14 10L21 3M21 3H16M21 3V8M10 14L3 21M3 21H8M3 21V16"
              stroke="#000000"
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
    backgroundColor: 'rgba(255, 140, 0, 0.16)',
  },
  centerDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: ORANGE,
    borderWidth: 2,
    borderColor: '#070707',
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
