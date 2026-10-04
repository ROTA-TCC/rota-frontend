import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface LeafletMapProps {
  center: [number, number];
  zoom: number;
  route?: [number, number][]; // Rota para ser desenhada
  style?: any;
  customCSS?: string;
}

export function LeafletMap({ center, zoom, route = [], style, customCSS = '' }: LeafletMapProps) {
  const webviewRef = useRef<WebView>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  const htmlContent = `
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
        var map = L.map('map', { zoomControl: false }).setView([${center[0]}, ${center[1]}], ${zoom});

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

        // Cria a linha da rota
        window.routeLine = L.polyline([], { color: '#ff4500', weight: 5, opacity: 0.8 }).addTo(map);
        
        // Cria o marcador de posição atual
        window.currentMarker = L.circleMarker([${center[0]}, ${center[1]}], {
          radius: 8, fillColor: '#007AFF', color: '#FFFFFF', weight: 2, opacity: 1, fillOpacity: 1
        }).addTo(map);

        window.leafletMapInstance = map;

        setTimeout(function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'READY' }));
        }, 150);
      </script>
    </body>
    </html>
  `;

  useEffect(() => {
    if (isMapReady && webviewRef.current) {
      webviewRef.current.injectJavaScript(`
        if (window.leafletMapInstance) {
          var currentCenter = window.leafletMapInstance.getCenter();
          var dist = window.leafletMapInstance.distance(currentCenter, [${center[0]}, ${center[1]}]);
          if (dist > 5) {
            window.leafletMapInstance.flyTo([${center[0]}, ${center[1]}], ${zoom}, { animate: true, duration: 1.2 });
            window.currentMarker.setLatLng([${center[0]}, ${center[1]}]);
          }
        }
        true;
      `);
    }
  }, [center[0], center[1], zoom, isMapReady]);

  useEffect(() => {
    if (isMapReady && webviewRef.current && route.length > 0) {
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
        source={{ html: htmlContent }}
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070707' },
  webview: { flex: 1, backgroundColor: 'transparent' },
});

