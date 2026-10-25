import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  type Region,
} from 'react-native-maps';
import { useTheme } from '@/providers/ThemeProvider';

interface GoogleMapProps {
  center: [number, number];
  zoom: number;
  style?: any;
  route?: [number, number][];
  showMarker?: boolean;
  routeColor?: string;
  fitToRoute?: boolean;
  fitPadding?: number;
  [key: string]: any;
}

const TILE_SIZE = 256;

type MapStyle = NonNullable<React.ComponentProps<typeof MapView>['customMapStyle']>;

const DARK_MAP_STYLE: MapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8a8a8a' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a1a' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#2a2a2a' }] },
  { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#bdbdbd' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#17251b' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2c2c2c' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#1f1f1f' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3c3c3c' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#2b2b2b' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#242424' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#4e5f70' }] },
];

function buildRegion(
  center: [number, number],
  zoom: number,
  size: { width: number; height: number }
): Region {
  const degreesPerPoint = 360 / (TILE_SIZE * Math.pow(2, zoom));
  const longitudeDelta = size.width * degreesPerPoint;
  const latitudeDelta =
    size.height * degreesPerPoint * Math.cos((center[0] * Math.PI) / 180);

  return {
    latitude: center[0],
    longitude: center[1],
    latitudeDelta,
    longitudeDelta,
  };
}

export function GoogleMap({
  center,
  zoom,
  style,
  route,
  showMarker = false,
  routeColor = '#ff4500',
  fitToRoute = false,
  fitPadding = 28,
  ...rest
}: GoogleMapProps) {
  const { isDark } = useTheme();
  const styles = useMemo(() => createStyles(isDark), [isDark]);
  const mapRef = useRef<MapView>(null);
  const layoutRef = useRef({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  });
  const hasPositionedRef = useRef(false);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [initialRegion] = useState(() =>
    buildRegion(center, zoom, {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    })
  );
  const [latitude, longitude] = center;

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width > 0 && height > 0) {
      layoutRef.current = { width, height };
      setIsLayoutReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isLayoutReady) return;

    if (fitToRoute && route && route.length > 1) {
      mapRef.current?.fitToCoordinates(
        route.map(([latitude, longitude]) => ({ latitude, longitude })),
        {
          edgePadding: {
            top: fitPadding,
            right: fitPadding,
            bottom: fitPadding,
            left: fitPadding,
          },
          animated: hasPositionedRef.current,
        }
      );
      hasPositionedRef.current = true;
      return;
    }

    const region = buildRegion([latitude, longitude], zoom, layoutRef.current);
    mapRef.current?.animateToRegion(region, hasPositionedRef.current ? 500 : 0);
    hasPositionedRef.current = true;
  }, [
    fitPadding,
    fitToRoute,
    isLayoutReady,
    latitude,
    longitude,
    route,
    zoom,
  ]);

  return (
    <View style={[styles.container, style]}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        initialRegion={initialRegion}
        customMapStyle={isDark ? DARK_MAP_STYLE : []}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
        toolbarEnabled={false}
        pitchEnabled={false}
        moveOnMarkerPress={false}
        onLayout={handleLayout}
        {...rest}
      >
        {showMarker && (
          <Marker
            coordinate={{ latitude, longitude }}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.markerOuter}>
              <View style={styles.markerInner} />
            </View>
          </Marker>
        )}

        {route && route.length > 0 && (
          <Polyline
            coordinates={route.map(([latitude, longitude]) => ({ latitude, longitude }))}
            strokeColor={routeColor}
            strokeWidth={5}
            lineCap="round"
            lineJoin="round"
          />
        )}
      </MapView>
    </View>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: isDark ? '#070707' : '#F5F5F7', overflow: 'hidden' },
    markerOuter: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#FFFFFF',
      backgroundColor: '#007AFF',
      justifyContent: 'center',
      alignItems: 'center',
    },
    markerInner: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: '#007AFF',
    },
  });
