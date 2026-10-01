import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface LeafletMapProps {
  center: [number, number];
  zoom: number;
  style?: any;
  customCSS?: string;
  [key: string]: any; 
}

export function LeafletMap({ center, zoom, style, customCSS = '', ...rest }: LeafletMapProps) {
  const webviewRef = useRef<WebView>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  const [htmlContent] = useState(`
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
        
        /* 🔥 COLOQUE O SEU PROVEDOR AQUI DE VOLTA 🔥 */
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo(map);
        
        window.leafletMapInstance = map;
        
        setTimeout(function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'READY' }));
        }, 150);
      </script>
    </body>
    </html>
  `);

  useEffect(() => {
    if (isMapReady && webviewRef.current) {
      // Script inteligente: Só faz o flyTo se a distância for maior que 5 metros.
      // Isso impede que atualizações duplicadas do React causem a tremedeira.
      const script = `
        if (window.leafletMapInstance) {
          var currentCenter = window.leafletMapInstance.getCenter();
          var targetLat = ${center[0]};
          var targetLng = ${center[1]};
          var dist = window.leafletMapInstance.distance(currentCenter, [targetLat, targetLng]);
          
          if (dist > 5) {
            window.leafletMapInstance.flyTo([targetLat, targetLng], ${zoom}, {
              animate: true,
              duration: 1.2
            });
          }
        }
        true;
      `;
      webviewRef.current.injectJavaScript(script);
    }
  }, [center[0], center[1], zoom, isMapReady]);

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webviewRef}
        source={{ html: htmlContent }}
        style={styles.webview}
        // 🔥 Removi o scrollEnabled={false} que estava impedindo você de mexer no mapa!
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
