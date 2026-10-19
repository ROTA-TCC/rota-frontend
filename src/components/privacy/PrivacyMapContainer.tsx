import { useCallback, useState } from 'react';
import { Dimensions, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { LeafletMap } from '@/components/map/LeafletMap';
import { InteractiveZoneCircle } from '@/components/privacy/InteractiveZoneCircle';
import { MapControls } from '@/components/privacy/MapControls';
import { colors, radius, spacing } from '@/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_SIZE = SCREEN_WIDTH - 48;

const CUSTOM_MAP_CSS = `
  .leaflet-layer { filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%) !important; }
  .leaflet-control-container { display: none !important; }
`;

interface PrivacyMapContainerProps {
  mapCenter: [number, number];
  zoom: number;
  onLocateUser: () => void;
  onRadiusMetersChange?: (meters: number) => void;
}

export function PrivacyMapContainer({
  mapCenter,
  zoom,
  onLocateUser,
  onRadiusMetersChange,
}: PrivacyMapContainerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [distanceText, setDistanceText] = useState('0 m');

  const handleDistanceChange = useCallback(
    (dist: string) => setDistanceText(dist),
    []
  );

  const closeFullscreen = useCallback(() => setIsFullscreen(false), []);

  const renderMapContent = (size: number, isFull: boolean) => (
    <View style={{ width: size, height: size }}>
      <LeafletMap center={mapCenter} zoom={zoom} style={styles.map} customCSS={CUSTOM_MAP_CSS} />
      <View style={styles.mapOverlay} pointerEvents="none" />

      <InteractiveZoneCircle
        containerSize={size}
        centerCoords={mapCenter}
        zoom={zoom}
        onDistanceChange={handleDistanceChange}
        onRadiusMetersChange={onRadiusMetersChange}
      />

      <MapControls
        distanceText={distanceText}
        isFullscreen={isFull}
        onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
        onLocateUser={onLocateUser}
      />
    </View>
  );

  return (
    <>
      <View style={styles.cardContainer}>{renderMapContent(CARD_SIZE, false)}</View>

      <Modal
        visible={isFullscreen}
        animationType="fade"
        transparent
        onRequestClose={closeFullscreen}
      >
        <SafeAreaView style={styles.fullscreenRoot}>
          <Animated.View
            entering={FadeIn.duration(250)}
            exiting={FadeOut.duration(250)}
            style={styles.fullscreenRoot}
          >
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={closeFullscreen}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Fechar mapa em tela cheia"
            >
              <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <Path
                  d="M18 6L6 18M6 6L18 18"
                  stroke={colors.text}
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
    borderRadius: radius.xxxl,
    overflow: 'hidden',
    marginVertical: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderCard,
    backgroundColor: colors.backgroundAlt,
  },
  fullscreenRoot: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlaySoft,
  },
  closeBtn: {
    position: 'absolute',
    top: spacing.xxl,
    left: spacing.xxl,
    zIndex: 30,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceCard,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderVisible,
  },
});
