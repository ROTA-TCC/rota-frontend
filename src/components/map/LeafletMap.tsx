import React, { useRef, useEffect, useState, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface LeafletMapProps {
  center: [number, number];
  zoom: number;
  style?: any;
  customCSS?: string;
  route?: [number, number][];
  showMarker?: boolean;
  [key: string]: any;
}

export function LeafletMap({ center, zoom, style, customCSS = '', route, showMarker = false, ...rest }: LeafletMapProps) {
  const webviewRef = useRef<WebView>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const initialCenterRef = useRef(center);

  const htmlContent = useMemo(() => {
    const lat = initialCenterRef.current[0];
    const lng = initialCenterRef.current[1];
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; background-color: #070707; }
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
        window.routeLine = L.polyline([], { color: '#ff4500', weight: 5, opacity: 0.8 }).addTo(map);
        window.currentMarker = L.circleMarker([${lat}, ${lng}], {
          radius: 8, fillColor: '#007AFF', color: '#FFFFFF', weight: 2, opacity: 1, fillOpacity: 1
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
  }, [customCSS]);

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
  }, [center[0], center[1], zoom, isMapReady, showMarker]);

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
          } catch (e) {}
        }}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070707' },
  webview: { flex: 1, backgroundColor: 'transparent' },
});

