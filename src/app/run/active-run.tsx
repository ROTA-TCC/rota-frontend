import { useEffect } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import BottomPanel from '@/components/Record/BottomPanel';
import FloatingButtons from '@/components/Record/FloatingButtons';
import { LeafletMap } from '@/components/map/LeafletMap';
import { useRunTracker } from '@/hooks/useRunTracker';
import { createRun } from '@/services/api/runService';
import { colors } from '@/theme';

const MAP_OVERLAY_CSS = `#map::after { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: ${colors.overlayMap}; pointer-events: none; z-index: 1000; }`;

export default function ActiveRunScreen() {
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
    finishRecording,
  } = useRunTracker();

  useEffect(() => {
    startRecording();
  }, [startRecording]);

  const handleFinish = async () => {
    const payload = finishRecording();

    if (!payload || payload.trackpoints.length === 0) return;

    try {
      await createRun(payload);
      router.replace('/(tabs)/explore');
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar sua corrida. Tente novamente.');
    }
  };

  const handleBack = () => {
    pauseRecording();
    router.back();
  };

  if (!currentLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primaryRun} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LeafletMap
        center={currentLocation}
        zoom={17}
        route={route}
        showMarker
        style={styles.map}
        customCSS={MAP_OVERLAY_CSS}
      />

      <FloatingButtons onBack={handleBack} />

      <BottomPanel
        isPaused={isPaused}
        stats={{
          statusText: isPaused ? 'Pausado' : isRecording ? 'Gravando' : 'Pronto para Iniciar',
          time: durationFormatted,
          pace,
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
  container: {
    flex: 1,
    backgroundColor: colors.surfaceCardAlt,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.surfaceCardAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
});
