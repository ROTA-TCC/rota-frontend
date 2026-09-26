import React, { useState } from 'react';
import { StyleSheet, View, StatusBar, Platform } from 'react-native';
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
          html, body, #map {
            margin: 0;
            padding: 0;
            height: 100vh;
            width: 100vw;
            background-color: transparent;
          }
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

          // Força o Leaflet a recalcular o tamanho correto do container (corrige o mapa cinza)
          setTimeout(function() {
            map.invalidateSize();
          }, 300);
          window.addEventListener('resize', function() {
            map.invalidateSize();
          });
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* 1. CAMADA DO MAPA (BACKGROUND) */}
      <View style={StyleSheet.absoluteFillObject}>
        <WebView
          originWhitelist={['*']}
          source={{ html: mapHTML }}
          style={{ width: '100%', height: '100%', backgroundColor: 'transparent', opacity: 0.99 }}
          containerStyle={{ backgroundColor: 'transparent' }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scrollEnabled={false}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* 2. CAMADA DA INTERFACE DE USUÁRIO (FOREGROUND)
          'box-none' aqui permite tocar no mapa nos espaços vazios da tela */}
      <View style={styles.uiLayer} pointerEvents="box-none">

        {/* TOPO (Busca e Filtros) */}
        <View style={styles.topSection}>
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

        {/* RODAPÉ (FAB e Rotas) */}
        <View style={styles.bottomSection}>
          <MapFab />
          <MapRouteCarousel />
        </View>

      </View>

      {/* 3. MODAL (BottomSheet) */}
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
    backgroundColor: '#1a1a1a',
  },
  uiLayer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 16 : 54,
  },
  topSection: {
    width: '100%',
    zIndex: 10,
  },
  bottomSection: {
    width: '100%',
    zIndex: 10,
    paddingBottom: 16,
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
