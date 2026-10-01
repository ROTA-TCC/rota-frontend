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
  
  // Variáveis seguras para evitar erro de closure no Reanimated
  const zoomSV = useSharedValue(zoom);
  const latSV = useSharedValue(centerCoords[0]);
  
  const geoRadiusRef = useRef<number | null>(null);
  const lastDistRef = useRef('');

  const handleAngleRad = (-45 * Math.PI) / 180;
  const gapAngleDeg = 48; 

  const getMetersPerPx = (z: number, lat: number) => {
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

  const updateGeoRefJS = (r: number, z: number, lat: number) => {
    geoRadiusRef.current = r * getMetersPerPx(z, lat);
  };

  // 🔥 Lógica de Escala Corrigida: Mantém o tamanho geográfico quando o zoom muda
  useEffect(() => {
    zoomSV.value = zoom;
    latSV.value = centerCoords[0];

    if (geoRadiusRef.current === null) {
      geoRadiusRef.current = radius.value * getMetersPerPx(zoom, centerCoords[0]);
    } else {
      const targetPx = geoRadiusRef.current / getMetersPerPx(zoom, centerCoords[0]);
      // Não damos clamp aqui para permitir que o raio cresça ou diminua visualmente livremente
      radius.value = withTiming(targetPx, { duration: 250 });
    }
  }, [zoom, centerCoords[0]]);

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
      // Atualiza a distância geográfica alvo ao redimensionar manualmente
      runOnJS(updateGeoRefJS)(newR, zoomSV.value, latSV.value);
    });

  const generateArcPath = (cx: number, cy: number, r: number, gapDeg: number) => {
    'worklet';
    const halfGapRad = (gapDeg / 2) * (Math.PI / 180);
    const startAngle = handleAngleRad + halfGapRad;
    const endAngle = handleAngleRad + 2 * Math.PI - halfGapRad;
    const startX = cx + r * Math.cos(startAngle);
    const startY = cy + r * Math.sin(startAngle);
    const endX = cx + r * Math.cos(endAngle);
    const endY = cy + r * Math.sin(endAngle);
    const largeArcFlag = 2 * Math.PI - gapDeg * (Math.PI / 180) > Math.PI ? 1 : 0;
    return `M ${startX} ${startY} A ${r} ${r} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
  };

  const animatedCircleProps = useAnimatedProps(() => ({
    d: generateArcPath(center, center, radius.value, gapAngleDeg),
  }));

  const handleStyle = useAnimatedStyle(() => {
    const r = radius.value;
    return {
      transform: [
        { translateX: r * Math.cos(handleAngleRad) },
        { translateY: r * Math.sin(handleAngleRad) },
      ],
    };
  });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Svg width={containerSize} height={containerSize} style={StyleSheet.absoluteFill}>
        <AnimatedPath
          animatedProps={animatedCircleProps}
          stroke={ORANGE}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="6 8"
          fill="rgba(255, 140, 0, 0.15)"
        />
      </Svg>

      <View
        style={[styles.handleContainer, { left: center, top: center }]}
        pointerEvents="box-none"
      >
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.handle, handleStyle]}>
            <View style={styles.handleInner} />
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  handleContainer: {
    position: 'absolute',
    width: 0,
    height: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  handle: {
    position: 'absolute',
    width: 44,
    height: 44,
    marginLeft: -22,
    marginTop: -22,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  handleInner: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: ORANGE,
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
