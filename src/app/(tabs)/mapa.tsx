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
          html, body, #map { margin: 0; padding: 0; height: 100%; width: 100%; background-color: transparent; }
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

      {/* 1. CAMADA DO MAPA (BACKGROUND) */}
      <View style={[StyleSheet.absoluteFillObject, { zIndex: 0 }]}>
        <WebView
          originWhitelist={['*']}
          source={{ html: mapHTML }}
          // opacity: 0.99 resolve o bug de tela preta/invisível do WebView transparente no Android
          style={{ flex: 1, backgroundColor: 'transparent', opacity: 0.99 }}
          containerStyle={{ backgroundColor: 'transparent' }}
          javaScriptEnabled={true} // Obrigatório para o Leaflet rodar
          domStorageEnabled={true} // Ajuda no cache dos tiles
          scrollEnabled={false}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* 2. CAMADA DA INTERFACE DE USUÁRIO (FOREGROUND) 
          Mantemos box-none APENAS no container mestre da UI */}
      <View style={styles.uiLayer} pointerEvents="box-none">

        {/* TOPO (Busca e Filtros) - Removido box-none */}
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

        {/* RODAPÉ (FAB e Rotas) - Removido box-none para destravar o carrossel */}
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
    paddingBottom: 16,
    zIndex: 1, // Garante que fica acima do mapa
  },
  topSection: {
    width: '100%',
    zIndex: 10,
  },
  bottomSection: {
    width: '100%',
    zIndex: 10,
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
