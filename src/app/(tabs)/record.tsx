// src/app/(tabs)/record.tsx
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { LeafletMap } from '@/components/map/LeafletMap';

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

  const handleBack = () => {
    console.log("Voltar pressionado");
  };

  const customCSS = `
    /* Overlay escuro em cima do mapa para combinar com o design */
    #map::after {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(43, 58, 66, 0.5);
      pointer-events: none;
      z-index: 1000;
    }
  `;

  return (
    <View style={styles.container}>
      {/* WebView de Fundo */}
      <LeafletMap
        center={[42.882004, 74.582748]}
        zoom={13}
        style={styles.map}
        customCSS={customCSS}
      />
      
      {/* Overlay de Botões (Sobre o mapa) */}
      <FloatingButtons onBack={handleBack} />

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
