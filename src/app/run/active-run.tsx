import React, { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LeafletMap } from '@/components/map/LeafletMap';
import FloatingButtons from '../../components/Record/FloatingButtons';
import BottomPanel from '../../components/Record/BottomPanel';
import { useRunTracker } from '@/hooks/useRunTracker';

export default function ActiveRunScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const router = useRouter();

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
    
    if (!payload || payload.trackpoints.length === 0) return;

    console.log(JSON.stringify(payload, null, 2));
    router.back();
  };

  const handleBack = () => {
    pauseRecording();
    router.back();
  };

  if (!currentLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff4500" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LeafletMap
        center={currentLocation}
        zoom={17}
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
  loadingContainer: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' },
  map: { flex: 1 },
});

