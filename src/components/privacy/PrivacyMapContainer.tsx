import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { LeafletMap } from '../map/LeafletMap';
import { InteractiveZoneCircle } from './InteractiveZoneCircle';
import { MapControls } from './MapControls';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
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

  const customMapCSS = `
    .leaflet-layer { filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%) !important; }
    .leaflet-control-container { display: none !important; }
  `;

  const renderMapContent = (size: number, isFull: boolean) => (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <LeafletMap
        center={mapCenter}
        zoom={zoom}
        style={styles.map}
        customCSS={customMapCSS}
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

      <Modal
        visible={isFullscreen}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsFullscreen(false)}
      >
        <SafeAreaView style={styles.fullscreenRoot}>
          <Animated.View
            entering={FadeIn.duration(250)}
            exiting={FadeOut.duration(250)}
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
