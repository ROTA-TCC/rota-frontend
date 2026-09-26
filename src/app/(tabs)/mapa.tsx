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
          html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background-color: #121212; }
          #map { width: 100%; height: 100%; position: absolute; top: 0; bottom: 0; left: 0; right: 0; }
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

      {/* 1. Camada do Mapa */}
      <WebView
        originWhitelist={['*']}
        source={{ html: mapHTML }}
        style={StyleSheet.absoluteFillObject}
        containerStyle={{ backgroundColor: '#121212' }}
        scrollEnabled={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />

      {/* 2. Camada de UI flutuante sobreposta */}
      <View style={styles.overlay} pointerEvents="box-none">
        <SafeAreaView style={styles.safeArea} pointerEvents="box-none">
          {/* Parte Superior (Busca e Filtros) */}
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

          {/* Parte Inferior (FAB e Carrossel de Rotas) */}
          <View style={styles.bottomContainer} pointerEvents="box-none">
            <MapFab />
            <MapRouteCarousel />
          </View>
        </SafeAreaView>
      </View>

      {/* Modal / BottomSheet */}
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
    backgroundColor: '#121212',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topContainer: {
    width: '100%',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 0,
  },
  bottomContainer: {
    width: '100%',
    paddingBottom: Platform.OS === 'android' ? 16 : 0,
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
