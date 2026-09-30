import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { LeafletMap } from '../map/LeafletMap';
import { InteractiveZoneCircle } from './InteractiveZoneCircle';
import { MapControls } from './MapControls';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_SIZE = SCREEN_WIDTH - 48;

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
  const [distanceText, setDistanceText] = useState('0 m');

  // CSS dinâmico injetado no Leaflet que intercepta a mudança de coordenadas
  // e faz o voo suave (flyTo) sem alterar o LeafletMap.tsx!
  const customMapCSSAndScript = `
    .leaflet-tile {
      filter: brightness(0.65) invert(1) contrast(2.8) hue-rotate(200deg) saturate(0.3);
    }
    .leaflet-container {
      background: #070707 !important;
    }
    </style>
    <script>
      (function() {
        var origMap = L.map;
        L.map = function(id, opts) {
          var m = origMap(id, opts);
          var lastLat = localStorage.getItem('privacy_lat');
          var lastLng = localStorage.getItem('privacy_lng');
          var curLat = ${mapCenter[0]};
          var curLng = ${mapCenter[1]};
          localStorage.setItem('privacy_lat', curLat);
          localStorage.setItem('privacy_lng', curLng);
          if (lastLat && lastLng) {
            var oldLat = parseFloat(lastLat);
            var oldLng = parseFloat(lastLng);
            if (Math.abs(oldLat - curLat) > 0.00001 || Math.abs(oldLng - curLng) > 0.00001) {
              m.setView([oldLat, oldLng], ${zoom}, { animate: false });
              setTimeout(function() {
                m.flyTo([curLat, curLng], ${zoom}, { duration: 1.8, easeLinearity: 0.25 });
              }, 80);
            }
          }
          return m;
        };
      })();
    </script>
    <style>
  `;

  const renderMapContent = (size: number, isFull: boolean) => (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <LeafletMap
        center={mapCenter}
        zoom={zoom}
        style={styles.map}
        customCSS={customMapCSSAndScript}
      />
      <View style={styles.mapOverlay} pointerEvents="none" />

      <InteractiveZoneCircle
        containerSize={size}
        centerCoords={mapCenter}
        zoom={zoom}
        onDistanceChange={(dist) => setDistanceText(dist)}
      />

      <MapControls
        distanceText={distanceText}
        isFullscreen={isFull}
        onToggleFullscreen={() => setIsFullscreen(!isFull)}
        onLocateUser={onLocateUser}
      />
    </View>
  );

  return (
    <>
      {/* Modo Card (Padrão) */}
      <View style={styles.cardContainer}>{renderMapContent(CARD_SIZE, false)}</View>

      {/* Modo Tela Cheia Nativado com Transição Fluida */}
      <Modal
        visible={isFullscreen}
        animationType="fade"
        transparent={false}
        onRequestClose={() => setIsFullscreen(false)}
      >
        <SafeAreaView style={styles.fullscreenRoot}>
          <Animated.View
            entering={FadeIn.duration(250)}
            exiting={FadeOut.duration(200)}
            style={styles.fullscreenContainer}
          >
            {/* Botão de Fechar no topo */}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setIsFullscreen(false)}
              activeOpacity={0.8}
            >
              <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <Path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </Svg>
            </TouchableOpacity>

            {renderMapContent(SCREEN_WIDTH, true)}
          </Animated.View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    alignSelf: 'center',
    borderRadius: 28,
    overflow: 'hidden',
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#1F1F22',
    backgroundColor: '#070707',
  },
  fullscreenRoot: {
    flex: 1,
    backgroundColor: '#070707',
  },
  fullscreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    top: 20,
    left: 20,
    zIndex: 30,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#141416',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
});
