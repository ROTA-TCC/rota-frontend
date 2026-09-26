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
          html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
          /* O mapa precisa de um ID com altura e largura totais explícitas */
          #map { width: 100%; height: 100%; } 
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map', { zoomControl: false }).setView([-23.55052, -46.633308], 13);

          L.tileLayer('${tileUrl}', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap'
          }).addTo(map);

          // CORREÇÃO DA TELA CINZA:
          // Aguarda o WebView e o Layout Nativo esticarem a tela,
          // e então força o Leaflet a recalcular o mapa e pintar os "tiles"
          setTimeout(function() {
            map.invalidateSize();
          }, 600);
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* 1. CAMADA DE FUNDO (MAPA) */}
      <View style={styles.mapLayer}>
        <WebView
          originWhitelist={['*']}
          source={{ html: mapHTML }}
          style={{ flex: 1 }}
          scrollEnabled={false} // Desativa o scroll do WebView (deixa o scroll só no mapa web)
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* 2. CAMADA FRONTAL (INTERFACE DE USUÁRIO) */}
      <View style={styles.uiLayer} pointerEvents="box-none">
        
        {/* PARTE SUPERIOR (Permite toque nos espaços vazios irem pro mapa) */}
        <View style={styles.topSection} pointerEvents="box-none">
          {/* Envelopamos a busca em "auto" para restaurar totalmente o foco nativo dela */}
          <View pointerEvents="auto" style={styles.searchWrapper}>
            <MapSearchBar />
          </View>

          <View pointerEvents="auto" style={styles.filterWrapper}>
            <MapFilterCarousel
              onFilterPress={(filter) => {
                if (filter === 'Rotas') {
                  setSheetVisible(true);
                }
              }}
            />
          </View>
        </View>

        {/* PARTE INFERIOR (Permite toque nos espaços vazios irem pro mapa) */}
        <View style={styles.bottomSection} pointerEvents="box-none">
          
          {/* 
            CORREÇÃO DO BLOQUEIO DE TOQUE: 
            Isolamos o botão flutuante e o carrossel usando pointerEvents="auto".
            Isso obriga o Android a habilitar o ScrollView/FlatList deles.
          */}
          <View pointerEvents="auto">
            <MapFab />
          </View>

          <View pointerEvents="auto">
            <MapRouteCarousel />
          </View>
          
        </View>
      </View>

      {/* 3. MODAL DE OPÇÕES */}
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
    backgroundColor: '#1a1a1a', // Fallback
  },
  mapLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  uiLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    justifyContent: 'space-between', // Separa o topSection e o bottomSection
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 16 : 54,
    paddingBottom: 95, // Impede que os botões caiam atrás da barra nativa do menu (Tabs)
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
