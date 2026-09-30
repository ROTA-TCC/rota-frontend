import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const ORANGE = '#FF8C00';
const AnimatedPath = Animated.createAnimatedComponent(Path);

interface InteractiveZoneCircleProps {
  containerSize: number;
  centerCoords: [number, number]; // [lat, lng]
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
  const minRadius = 35;
  const maxRadius = containerSize / 2 - 28;

  const radius = useSharedValue(70);
  const startRadius = useSharedValue(70);

  // Ângulo fixo do manipulador (Top-Right: -45º)
  const handleAngleRad = (-45 * Math.PI) / 180;
  const gapAngleDeg = 42; // Abertura na borda para o ícone sem poluição visual

  // Cálculo de distância geográfica real (Metros por pixel no Leaflet)
  const calculateDistance = (radiusPx: number) => {
    const latitude = centerCoords[0];
    const latRad = (latitude * Math.PI) / 180;
    const metersPerPx = (156543.03392 * Math.cos(latRad)) / Math.pow(2, zoom);
    const meters = Math.round(radiusPx * metersPerPx);

    if (meters < 1000) {
      return `${meters} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const updateDistance = (currentRadiusPx: number) => {
    if (onDistanceChange) {
      const formatted = calculateDistance(currentRadiusPx);
      onDistanceChange(formatted);
    }
  };

  useEffect(() => {
    updateDistance(radius.value);
  }, [centerCoords, zoom]);

  // Gesto de Arraste (Pan)
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
      runOnJS(updateDistance)(newR);
    });

  // Arco SVG com abertura (Gap) exata para o ícone
  const animatedArcProps = useAnimatedProps(() => {
    const r = radius.value;
    const gapRad = (gapAngleDeg * Math.PI) / 180;

    const startAngle = handleAngleRad + gapRad / 2;
    const endAngle = handleAngleRad - gapRad / 2 + 2 * Math.PI;

    const x1 = center + r * Math.cos(startAngle);
    const y1 = center + r * Math.sin(startAngle);
    const x2 = center + r * Math.cos(endAngle);
    const y2 = center + r * Math.sin(endAngle);

    const pathD = `M ${x1} ${y1} A ${r} ${r} 0 1 1 ${x2} ${y2}`;

    return { d: pathD };
  });

  // Preenchimento interno translúcido
  const animatedFillStyle = useAnimatedStyle(() => ({
    width: radius.value * 2,
    height: radius.value * 2,
    borderRadius: radius.value,
  }));

  // Posição do Ícone Flutuante (Sem fundo e sem borda)
  const animatedHandleStyle = useAnimatedStyle(() => {
    const r = radius.value;
    const hX = center + r * Math.cos(handleAngleRad);
    const hY = center + r * Math.sin(handleAngleRad);

    return {
      transform: [
        { translateX: hX - 22 }, // Centraliza a área de toque de 44px
        { translateY: hY - 22 },
      ],
    };
  });

  return (
    <View
      style={[
        styles.overlayContainer,
        { width: containerSize, height: containerSize },
      ]}
      pointerEvents="box-none"
    >
      {/* Círculo Transparente de Fundo */}
      <Animated.View
        style={[styles.zoneFill, animatedFillStyle]}
        pointerEvents="none"
      />

      {/* Ponto de Referência no Centro */}
      <View style={[styles.centerDot, { top: center - 5, left: center - 5 }]} />

      {/* Borda SVG Interrompida no Ícone */}
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        <AnimatedPath
          animatedProps={animatedArcProps}
          stroke={ORANGE}
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>

      {/* Ícone de Expansão Limpo e Maior (32px visual em hit-target de 44px) */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.cleanHandle, animatedHandleStyle]}>
          <Svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            {/* Setas opostas em diagonal */}
            <Path
              d="M14 10L21 3M21 3H16M21 3V8M10 14L3 21M3 21H8M3 21V16"
              stroke={ORANGE}
              strokeWidth="2.8"
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
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', // Sem fundo
    borderWidth: 0, // Sem borda
  },
});
