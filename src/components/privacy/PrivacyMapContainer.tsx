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

  // Script Genial Injetado: Intercepta a montagem interna do Leaflet,
  // lembra o último ponto e dispara um flyTo suave ocultando a trepidação do recarregamento.
  const customMapCSSAndScript = `
    <style>
      .leaflet-layer { filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%); }
      body, #map { background-color: #070707 !important; margin: 0; padding: 0; }
      .leaflet-control-container { display: none; }
    </style>
    <script>
      (function() {
        try {
          var origMap = window.L.map;
          window.L.map = function(id, opts) {
            var m = origMap(id, opts);
            var curLat = ${mapCenter[0]};
            var curLng = ${mapCenter[1]};
            var lastLat = localStorage.getItem('rota_lat');
            var lastLng = localStorage.getItem('rota_lng');
            
            localStorage.setItem('rota_lat', curLat);
            localStorage.setItem('rota_lng', curLng);
            
            if (lastLat && lastLng) {
              var oLat = parseFloat(lastLat);
              var oLng = parseFloat(lastLng);
              var isMoved = Math.abs(oLat - curLat) > 0.0001 || Math.abs(oLng - curLng) > 0.0001;
              
              if (isMoved) {
                var origSetView = m.setView;
                var isFirst = true;
                m.setView = function(center, z, options) {
                  if (isFirst) {
                    isFirst = false;
                    origSetView.call(this, [oLat, oLng], z, { animate: false });
                    setTimeout(function() {
                      m.flyTo([curLat, curLng], z, { duration: 1.5, easeLinearity: 0.25 });
                    }, 250);
                    return this;
                  }
                  return origSetView.call(this, center, z, options);
                };
              }
            }
            return m;
          };
        } catch(e) {}
      })();
    </script>
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
      <View style={styles.cardContainer}>
        {renderMapContent(CARD_SIZE, false)}
      </View>

      {/* Animação Simples e Direta (Fade) cobrindo 100% da tela */}
      <Modal
        visible={isFullscreen}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsFullscreen(false)}
      >
        <SafeAreaView style={styles.fullscreenRoot}>
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
            style={styles.fullscreenRoot}
          >
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
    justifyContent: 'center',
    alignItems: 'center',
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
