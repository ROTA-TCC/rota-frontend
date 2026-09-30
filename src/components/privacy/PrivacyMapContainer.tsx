import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { LeafletMap } from '../map/LeafletMap';
import { InteractiveZoneCircle } from './InteractiveZoneCircle';
import { MapControls } from './MapControls';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_SIZE = SCREEN_WIDTH - 48; // Padding de 24 em ambos os lados

interface PrivacyMapContainerProps {
  mapCenter: [number, number];
  zoom: number;
  onLocateUser: () => void;
}

export function PrivacyMapContainer({
  mapCenter,
  zoom,
  onLocateUser,
}: PrivacyMapContainerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [radiusPx, setRadiusPx] = useState(70);

  // Animação de transição para Tela Cheia
  const isExpanded = useSharedValue(0);

  const toggleFullscreen = () => {
    const nextState = !isFullscreen;
    setIsFullscreen(nextState);
    isExpanded.value = withSpring(nextState ? 1 : 0, {
      damping: 18,
      stiffness: 120,
    });
  };

  const animatedContainerStyle = useAnimatedStyle(() => {
    const progress = isExpanded.value;
    return {
      position: progress > 0 ? 'absolute' : 'relative',
      top: progress > 0 ? 0 : 'auto',
      left: progress > 0 ? 0 : 'auto',
      width: progress === 1 ? SCREEN_WIDTH : CARD_SIZE,
      height: progress === 1 ? SCREEN_HEIGHT : CARD_SIZE,
      borderRadius: withTiming(progress === 1 ? 0 : 28, { duration: 250 }),
      zIndex: progress > 0 ? 999 : 1,
    };
  });

  // Cálculo ilustrativo do raio em KM
  const radiusKm = (radiusPx * 0.015).toFixed(1);

  // Injeção de CSS para dark mode nativo do Leaflet
  const darkMapCSS = `
    .leaflet-tile {
      filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7);
    }
    .leaflet-container {
      background: #070707 !important;
    }
  `;

  const currentSize = isFullscreen ? SCREEN_WIDTH : CARD_SIZE;

  return (
    <Animated.View style={[styles.mapWrapper, animatedContainerStyle]}>
      {/* Botão de Fechar se estiver em Modo Tela Cheia */}
      {isFullscreen && (
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={toggleFullscreen}
          activeOpacity={0.8}
        >
          <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <Path
              d="M18 6L6 18M6 6L18 18"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </Svg>
        </TouchableOpacity>
      )}

      {/* LeafletMap mantido original */}
      <LeafletMap
        center={mapCenter}
        zoom={zoom}
        style={styles.map}
        customCSS={darkMapCSS}
      />

      {/* Overlay Escuro para visual sofisticado */}
      <View style={styles.mapOverlay} pointerEvents="none" />

      {/* Círculo de Ajuste Interativo */}
      <InteractiveZoneCircle
        containerSize={currentSize}
        onRadiusChange={(r) => setRadiusPx(r)}
      />

      {/* Controles Flutuantes */}
      <MapControls
        radiusKm={radiusKm}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onLocateUser={onLocateUser}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  mapWrapper: {
    alignSelf: 'center',
    borderRadius: 28,
    overflow: 'hidden',
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#1F1F22',
    backgroundColor: '#070707',
  },
  map: {
    flex: 1,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7, 7, 7, 0.25)',
  },
  closeBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#141416',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
});
