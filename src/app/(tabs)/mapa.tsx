import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';
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
      <StatusBar barStyle="light-content" />
      
      <WebView
        originWhitelist={['*']}
        source={{ html: mapHTML }}
        style={StyleSheet.absoluteFillObject}
        scrollEnabled={false}
      />

      {/* 2. Camada de UI flutuante sobreposta */}
      <View style={[styles.overlay, { zIndex: 1 }]} pointerEvents="box-none">
        <SafeAreaView style={styles.safeArea}>
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

          <MapFab />
          
          <MapRouteCarousel />
        </SafeAreaView>
      </View>

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
  container: { flex: 1, backgroundColor: 'transparent' },
  overlay: { 
    ...StyleSheet.absoluteFillObject, 
    justifyContent: 'space-between' 
  },
  safeArea: { 
    flex: 1, 
    justifyContent: 'space-between',
    paddingTop: 40 // Adiciona espaçamento para não ficar atrás da barra de status
  },
  searchWrapper: { paddingHorizontal: 16 },
  filterWrapper: { marginTop: 12 },
});