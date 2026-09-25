// src/app/(tabs)/record.tsx
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

// Importando os componentes (ajuste o caminho conforme sua estrutura)
import FloatingButtons from '../../components/Record/FloatingButtons';
import BottomPanel from '../../components/Record/BottomPanel';

export default function RecordScreen() {
  const [isPaused, setIsPaused] = useState(false);
  
  // Estado que gerencia as informações na tela
  const [stats, setStats] = useState({
    statusText: 'Corrida',
    time: '11:09',
    pace: '4:46',
    paceLabel: 'Média parcial (/km)',
    distance: '1,13',
  });

  const handlePause = () => {
    setIsPaused(true);
    setStats({
      statusText: 'Parado',
      time: '11:12',
      pace: '9:52',
      paceLabel: 'Ritmo médio (/km)',
      distance: '1,13',
    });
  };

  const handleResume = () => {
    setIsPaused(false);
    setStats({
      statusText: 'Corrida',
      time: '11:09',
      pace: '4:46',
      paceLabel: 'Média parcial (/km)',
      distance: '1,13',
    });
  };

  const handleFinish = () => {
    // Lógica para finalizar a corrida
    console.log("Corrida concluída!");
  };

  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const mapHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          html, body, #map { margin: 0; padding: 0; height: 100%; width: 100%; background: #2b3a42; }
          /* Overlay escuro em cima do mapa para combinar com o design */
          #map::after {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(43, 58, 66, 0.5);
            pointer-events: none;
            z-index: 1000;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map', { zoomControl: false, attributionControl: false }).setView([42.882004, 74.582748], 13);
          L.tileLayer('${tileUrl}', { maxZoom: 19 }).addTo(map);
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      {/* WebView de Fundo */}
      <WebView
        originWhitelist={['*']}
        source={{ html: mapHTML }}
        style={styles.map}
        scrollEnabled={false}
      />
      
      {/* Overlay de Botões (Sobre o mapa) */}
      <FloatingButtons />

      {/* Painel Inferior de Estatísticas e Controles */}
      <BottomPanel 
        isPaused={isPaused}
        stats={stats}
        onPause={handlePause}
        onResume={handleResume}
        onFinish={handleFinish}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  map: {
    flex: 1,
  },
});
