import { useEffect, useMemo, useRef, useState, type ComponentProps } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';

import { colors } from '@/theme';

type WebViewProps = ComponentProps<typeof WebView>;

interface LeafletMapProps extends Omit<WebViewProps, 'source' | 'style'> {
  center: [number, number];
  zoom: number;
  style?: StyleProp<ViewStyle>;
  customCSS?: string;
  route?: [number, number][];
  showMarker?: boolean;
}

export function LeafletMap({
  center,
  zoom,
  style,
  customCSS = '',
  route,
  showMarker = false,
  ...rest
}: LeafletMapProps) {
  const webviewRef = useRef<WebView>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [initialCenter] = useState(center);

  const htmlContent = useMemo(() => {
    const [lat, lng] = initialCenter;
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; background-color: ${colors.backgroundAlt}; }
        #map { width: 100%; height: 100%; background-color: transparent; }
        .leaflet-control-attribution { display: none; }
        ${customCSS}
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', { zoomControl: false }).setView([${lat}, ${lng}], ${zoom});
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

        window.leafletMapInstance = map;
        window.routeLine = L.polyline([], { color: '${colors.primaryRun}', weight: 5, opacity: 0.8 }).addTo(map);
        window.currentMarker = L.circleMarker([${lat}, ${lng}], {
          radius: 8, fillColor: '${colors.info}', color: '${colors.text}', weight: 2, opacity: 1, fillOpacity: 1
        });
        if (${showMarker}) {
          window.currentMarker.addTo(map);
        }

        setTimeout(function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'READY' }));
        }, 150);
      </script>
    </body>
    </html>
  `;
  }, [customCSS, initialCenter, showMarker, zoom]);

  const mapSource = useMemo(() => ({ html: htmlContent }), [htmlContent]);

  useEffect(() => {
    if (isMapReady && webviewRef.current) {
      const script = `
        if (window.leafletMapInstance) {
          var targetLat = ${center[0]};
          var targetLng = ${center[1]};

          window.leafletMapInstance.panTo([targetLat, targetLng], { animate: true, duration: 0.5 });

          if (${showMarker}) {
            if (!window.leafletMapInstance.hasLayer(window.currentMarker)) {
              window.currentMarker.addTo(window.leafletMapInstance);
            }
            window.currentMarker.setLatLng([targetLat, targetLng]);
          } else if (window.leafletMapInstance.hasLayer(window.currentMarker)) {
            window.leafletMapInstance.removeLayer(window.currentMarker);
          }
        }
        true;
      `;
      webviewRef.current.injectJavaScript(script);
    }
  }, [center, zoom, isMapReady, showMarker]);

  useEffect(() => {
    if (isMapReady && webviewRef.current && route && route.length > 0) {
      const routeJson = JSON.stringify(route);
      webviewRef.current.injectJavaScript(`
        if (window.routeLine) {
          window.routeLine.setLatLngs(${routeJson});
        }
        true;
      `);
    }
  }, [route, isMapReady]);

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webviewRef}
        source={mapSource}
        style={styles.webview}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'READY') setIsMapReady(true);
          } catch {
            // mensagens não-JSON (ex.: scripts do Leaflet) são ignoradas
          }
        }}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundAlt },
  webview: { flex: 1, backgroundColor: 'transparent' },
});
