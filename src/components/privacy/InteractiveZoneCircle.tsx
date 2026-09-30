import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Path, Circle } from 'react-native-svg';

const ORANGE = '#FF8C00';
const AnimatedPath = Animated.createAnimatedComponent(Path);

interface InteractiveZoneCircleProps {
  containerSize: number;
  onRadiusChange?: (radiusPx: number) => void;
}

export function InteractiveZoneCircle({
  containerSize,
  onRadiusChange,
}: InteractiveZoneCircleProps) {
  const center = containerSize / 2;
  const minRadius = 40;
  const maxRadius = Math.min(containerSize / 2 - 24, 160);

  const radius = useSharedValue(70);
  const startRadius = useSharedValue(70);

  // Ângulo fixo do manipulador (Top Right: -45º / 315º)
  const handleAngleDeg = -45;
  const handleAngleRad = (handleAngleDeg * Math.PI) / 180;
  const gapAngleDeg = 36; // Abertura na borda para a alça

  // Gesto de Arraste (Pan)
  const panGesture = Gesture.Pan()
    .onStart(() => {
      startRadius.value = radius.value;
    })
    .onUpdate((event) => {
      // Projeção radial do movimento
      const delta = (event.translationX - event.translationY) / Math.SQRT2;
      let newR = startRadius.value + delta;
      if (newR < minRadius) newR = minRadius;
      if (newR > maxRadius) newR = maxRadius;

      radius.value = newR;
      if (onRadiusChange) {
        runOnJS(onRadiusChange)(newR);
      }
    });

  // Desenho dinâmico do arco com Notch/Gap
  const animatedArcProps = useAnimatedProps(() => {
    const r = radius.value;
    const gapRad = (gapAngleDeg * Math.PI) / 180;

    const startAngle = handleAngleRad + gapRad / 2;
    const endAngle = handleAngleRad - gapRad / 2 + 2 * Math.PI;

    const x1 = center + r * Math.cos(startAngle);
    const y1 = center + r * Math.sin(startAngle);
    const x2 = center + r * Math.cos(endAngle);
    const y2 = center + r * Math.sin(endAngle);

    // M x1 y1 A r r 0 1 1 x2 y2
    const pathD = `M ${x1} ${y1} A ${r} ${r} 0 1 1 ${x2} ${y2}`;

    return {
      d: pathD,
    };
  });

  // Preenchimento central translúcido
  const animatedFillStyle = useAnimatedStyle(() => ({
    width: radius.value * 2,
    height: radius.value * 2,
    borderRadius: radius.value,
  }));

  // Posição do Ícone de Expansão (Alça)
  const animatedHandleStyle = useAnimatedStyle(() => {
    const r = radius.value;
    const hX = center + r * Math.cos(handleAngleRad);
    const hY = center + r * Math.sin(handleAngleRad);

    return {
      transform: [
        { translateX: hX - 16 }, // Centraliza a badge de 32px
        { translateY: hY - 16 },
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
      {/* Círculo com Preenchimento Translúcido */}
      <Animated.View
        style={[styles.zoneFill, animatedFillStyle]}
        pointerEvents="none"
      />

      {/* Ponto Central de Referência */}
      <View style={[styles.centerDot, { top: center - 5, left: center - 5 }]} />

      {/* SVG da Borda Circular com Notch */}
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        <AnimatedPath
          animatedProps={animatedArcProps}
          stroke={ORANGE}
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>

      {/* Manipulador / Ícone de Redimensionamento */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.handleBadge, animatedHandleStyle]}>
          {/* Ícone com setas opostas (Expansão) */}
          <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <Path
              d="M15 9L21 3M21 3H16M21 3V8M9 15L3 21M3 21H8M3 21V16"
              stroke="#070707"
              strokeWidth="2.5"
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
  handleBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ORANGE,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
