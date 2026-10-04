import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
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

  const [initialRegion, setInitialRegion] = useState<[number, number] | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced
        });
        setInitialRegion([location.coords.latitude, location.coords.longitude]);
      }
    })();
  }, []);

  const handleFinish = async () => {
    const payload = finishRecording();
    
    if (!payload || payload.trackpoints.length === 0) return;

    console.log(JSON.stringify(payload, null, 2));
  };

  const handleBack = () => {
  };

  const mapCenter = currentLocation || initialRegion || [-23.5505, -46.6333];

  return (
    <View style={styles.container}>
      <LeafletMap
        center={mapCenter}
        zoom={currentLocation ? 17 : 14}
        route={route}
        showMarker={true}
        style={styles.map}
        customCSS="#map::after { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(43, 58, 66, 0.5); pointer-events: none; z-index: 1000; }"
      />

      <FloatingButtons onBack={handleBack} />

      <BottomPanel
        isPaused={isPaused}
        stats={{
          statusText: isPaused ? 'Pausado' : (isRecording ? 'Gravando' : 'Pronto para Iniciar'),
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

