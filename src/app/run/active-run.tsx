import React, { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { GoogleMap } from '@/components/map/GoogleMap';
import FloatingButtons from '../../components/Record/FloatingButtons';
import BottomPanel from '../../components/Record/BottomPanel';
import { ExpandedRunView } from '../../components/Record/ExpandedRunView';
import { useRunTracker } from '@/hooks/useRunTracker';
import { useActivityDraft } from '@/providers/ActivityDraftProvider';
import { useTheme } from '@/providers/ThemeProvider';

const DEFAULT_CENTER: [number, number] = [-23.55052, -46.633308];

export default function ActiveRunScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const router = useRouter();
  const { isDark } = useTheme();
  const styles = useMemo(() => createStyles(isDark), [isDark]);
  const [isExpanded, setIsExpanded] = useState(false);
  const { setDraft } = useActivityDraft();

  const {
    isRecording,
    isPaused,
    durationFormatted,
    distanceKm,
    pace,
    calories,
    elevationGain,
    currentLocation,
    route,
    startRecording,
    pauseRecording,
    finishRecording
  } = useRunTracker();

  useEffect(() => {
    startRecording();
  }, [startRecording]);

  const handleFinish = () => {
    const payload = finishRecording();

    if (!payload || payload.trackpoints.length < 2) {
      Alert.alert(
        'Corrida muito curta',
        'Não há pontos suficientes para salvar esta atividade.'
      );
      return;
    }

    setDraft({
      run: payload,
      sourceType: type ?? 'normal',
      createdAt: new Date().toISOString(),
    });
    router.replace('/run/activity-details');
  };

  const handleBack = () => {
    finishRecording();
    router.back();
  };

  const handleDiscard = () => {
    finishRecording();
    router.back();
  };

  return (
    <View style={styles.container}>
      {isExpanded ? (
        <ExpandedRunView
          center={currentLocation ?? DEFAULT_CENTER}
          route={route}
          showMarker={!!currentLocation}
          isPaused={isPaused}
          stats={{
            time: durationFormatted,
            pace,
            distance: distanceKm,
            calories,
            elevation: elevationGain,
          }}
          onCollapse={() => setIsExpanded(false)}
          onPause={pauseRecording}
          onResume={startRecording}
          onFinish={handleFinish}
          onDiscard={handleDiscard}
        />
      ) : (
        <>
          <GoogleMap
            center={currentLocation ?? DEFAULT_CENTER}
            zoom={17}
            route={route}
            showMarker={!!currentLocation}
            style={styles.map}
          />
          <View style={styles.mapOverlay} pointerEvents="none" />

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
            onExpand={() => setIsExpanded(true)}
          />
        </>
      )}
    </View>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: isDark ? '#121212' : '#F5F5F7' },
    map: { flex: 1 },
    mapOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: isDark ? 'rgba(43, 58, 66, 0.5)' : 'rgba(255, 255, 255, 0.15)',
    },
  });

