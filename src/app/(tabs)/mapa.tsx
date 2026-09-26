import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { MapSearchBar } from '@/components/map/MapSearchBar';
import { MapFilterCarousel } from '@/components/map/MapFilterCarousel';
import { MapFab } from '@/components/map/MapFab';
import { MapRouteCarousel } from '@/components/map/MapRouteCarousel';
import { MapBottomSheet } from '@/components/map/MapBottomSheet';

export default function MapaScreen() {
  const [sheetVisible, setSheetVisible] = useState(false);
  const [activeOption, setActiveOption] = useState('rotas');

  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const mapHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          html, body, #map { margin: 0; padding: 0; height: 100%; width: 100%; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map', { zoomControl: false }).setView([-23.55052, -46.633308], 13);

          L.tileLayer('${tileUrl}', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* <WebView
        originWhitelist={['*']}
        source={{ html: mapHTML }}
        style={[StyleSheet.absoluteFillObject, { backgroundColor: 'transparent' }]}
        containerStyle={{ backgroundColor: 'transparent' }}
        scrollEnabled={false}
      /> */}

      {/* Camada de UI flutuante sobreposta */}
      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        <View style={styles.topContainer} pointerEvents="box-none">
          <View style={styles.searchWrapper}>
            <MapSearchBar />
          </View>

          <View style={styles.filterWrapper}>
            <MapFilterCarousel
              onFilterPress={(filter) => {
                if (filter === 'Rotas') {
                  setSheetVisible(true);
                }
              }}
            />
          </View>
        </View>

        <View style={styles.bottomContainer} pointerEvents="box-none">
          <MapFab />
          <MapRouteCarousel />
        </View>
      </SafeAreaView>

      {sheetVisible && (
        <MapBottomSheet
          activeOption={activeOption}
          onSelect={(id) => {
            setActiveOption(id);
            setSheetVisible(false);
          }}
          onClose={() => setSheetVisible(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Cor de fundo escura para caso o mapa/webview esteja desativado
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  topContainer: {
    width: '100%',
    // Compensa a barra de status no Android
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 10,
    zIndex: 10,
  },
  bottomContainer: {
    width: '100%',
  },
  searchWrapper: {
    paddingHorizontal: 16,
    zIndex: 20,
  },
  filterWrapper: {
    marginTop: 12,
    zIndex: 10,
  },
});
