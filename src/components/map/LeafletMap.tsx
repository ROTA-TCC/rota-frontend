import React from 'react';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { WebView } from 'react-native-webview';

interface LeafletMapProps {
  center: [number, number];
  zoom: number;
  style?: StyleProp<ViewStyle>;
  customCSS?: string;
  tileUrl?: string;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  center,
  zoom,
  style,
  customCSS = '',
  tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
}) => {
  const mapHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          html, body, #map { margin: 0; padding: 0; height: 100%; width: 100%; background-color: #121212; }
          ${customCSS}
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map', { zoomControl: false, attributionControl: false }).setView(${JSON.stringify(center)}, ${zoom});
          L.tileLayer('${tileUrl}', { maxZoom: 19 }).addTo(map);
        </script>
      </body>
    </html>
  `;

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: mapHTML }}
      style={style}
      scrollEnabled={false}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      cacheEnabled={false}
    />
  );
};
