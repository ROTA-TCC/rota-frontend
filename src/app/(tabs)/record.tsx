import React, { useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { LeafletMap } from '@/components/map/LeafletMap';
import FloatingButtons from '../../components/Record/FloatingButtons';
import BottomPanel from '../../components/Record/BottomPanel';
import { useRunTracker } from '@/hooks/useRunTracker';

export default function RecordScreen() {
  const {
    isRecording,
    isPaused,
    durationFormatted,
    distanceKm,
    pace,
    currentLocation,
    route,
    startRecording,
    pauseRecording,
    finishRecording
  } = useRunTracker();

  useEffect(() => {
    startRecording();
  }, []);

  const handleFinish = async () => {
    const payload = finishRecording();
    
    if (!payload || payload.trackpoints.length === 0) {
      Alert.alert("Erro", "Nenhuma rota registrada.");
      return;
    }

    console.log("PAYLOAD PRONTO PARA ENVIO:", JSON.stringify(payload, null, 2));

    Alert.alert("Corrida Finalizada!", "Seus dados estão prontos no console.");
  };

  const handleBack = () => {
    console.log("Voltar pressionado");
  };

  const customCSS = `
    #map::after {
      content: ''; position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(43, 58, 66, 0.5);
      pointer-events: none; z-index: 1000;
    }
  `;

  const mapCenter = currentLocation || [-23.5505, -46.6333];

  return (
    <View style={styles.container}>
      <LeafletMap
        center={mapCenter}
        zoom={currentLocation ? 17 : 13}
        route={route}
        style={styles.map}
        customCSS={customCSS}
      />

      <FloatingButtons onBack={handleBack} />

      <BottomPanel
        isPaused={isPaused}
        stats={{
          statusText: isPaused ? 'Pausado' : 'Gravando',
          time: durationFormatted,
          pace: pace,
          paceLabel: 'Ritmo médio (/km)',
          distance: distanceKm,
        }}
        onPause={pauseRecording}
        onResume={startRecording}
        onFinish={handleFinish}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  map: { flex: 1 },
});

