import React, { useEffect, useMemo } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { GoogleMap } from '@/components/map/GoogleMap';
import { useActiveRunColors, type ActiveRunPalette } from '@/constants/activeRunTheme';

export interface ExpandedRunStats {
  time: string;
  pace: string;
  distance: string;
  calories: number;
  elevation: number;
  heartRate?: number;
}

interface ExpandedRunViewProps {
  center: [number, number];
  route: [number, number][];
  showMarker: boolean;
  isPaused: boolean;
  stats: ExpandedRunStats;
  onCollapse: () => void;
  onPause: () => void;
  onResume: () => void;
  onFinish: () => void | Promise<void>;
  onDiscard: () => void;
}

interface StatItem {
  id: string;
  label: string;
  value: string;
  unit?: string;
}

export function ExpandedRunView({
  center,
  route,
  showMarker,
  isPaused,
  stats,
  onCollapse,
  onPause,
  onResume,
  onFinish,
  onDiscard,
}: ExpandedRunViewProps) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const colors = useActiveRunColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(1, {
      damping: 18,
      stiffness: 190,
      mass: 0.9,
    });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { scale: 0.86 + progress.value * 0.14 },
      { translateY: (1 - progress.value) * 32 },
    ],
  }));

  const mapHeight = Math.round(height * 0.5);

  const statItems = useMemo<StatItem[]>(
    () => [
      { id: 'pace', label: 'Ritmo médio', value: stats.pace, unit: '/km' },
      { id: 'distance', label: 'Distância', value: stats.distance, unit: 'km' },
      { id: 'calories', label: 'Calorias', value: String(stats.calories), unit: 'kcal' },
      { id: 'time', label: 'Tempo', value: stats.time },
      { id: 'elevation', label: 'Elevação', value: String(stats.elevation), unit: 'm' },
      {
        id: 'heart-rate',
        label: 'BPM',
        value: stats.heartRate != null ? String(stats.heartRate) : '--',
        unit: 'bpm',
      },
    ],
    [stats]
  );

  const handleHistory = () => {
    Alert.alert(
      'Histórico da corrida',
      `Tempo: ${stats.time}\nDistância: ${stats.distance} km\nRitmo médio: ${stats.pace} /km`
    );
  };

  const handleOptions = () => {
    Alert.alert('Opções da corrida', 'Deseja descartar esta corrida?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Descartar corrida',
        style: 'destructive',
        onPress: onDiscard,
      },
    ]);
  };

  const handleFinish = () => {
    Alert.alert(
      'Concluir corrida',
      'Deseja encerrar esta corrida? Você poderá revisar os detalhes antes de publicar.',
      [
        { text: 'Continuar correndo', style: 'cancel' },
        { text: 'Concluir', onPress: onFinish },
      ]
    );
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={[styles.mapContainer, { height: mapHeight }]}>
        <GoogleMap
          center={center}
          zoom={17}
          route={route}
          showMarker={showMarker}
          style={styles.map}
        />

        <View style={[styles.mapHeader, { top: Math.max(insets.top, 20) + 10 }]}>
          <TouchableOpacity
            style={styles.mapButton}
            activeOpacity={0.8}
            onPress={onCollapse}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Voltar para a corrida"
          >
            <Ionicons name="arrow-back" size={20} color={colors.mapControlIcon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mapButton}
            activeOpacity={0.8}
            onPress={handleOptions}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Opções da corrida"
          >
            <Ionicons
              name="ellipsis-vertical"
              size={20}
              color={colors.mapControlIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statsWrapper}>
          <View style={styles.statsGrid}>
            {statItems.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.statBox,
                  index % 3 === 1 && styles.statBoxMiddle,
                ]}
              >
                <Text style={styles.statLabel}>{item.label}</Text>
                <View style={styles.statValueContainer}>
                  <Text style={styles.statValue} numberOfLines={1}>
                    {item.value}
                  </Text>
                  {item.unit ? <Text style={styles.statUnit}>{item.unit}</Text> : null}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View
          style={[
            styles.controls,
            { paddingBottom: Math.max(insets.bottom, 16) + 12 },
          ]}
        >
          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.75}
            onPress={handleHistory}
            accessibilityRole="button"
            accessibilityLabel="Histórico da corrida"
          >
            <Ionicons name="time-outline" size={22} color={colors.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={isPaused ? onResume : onPause}
            accessibilityRole="button"
            accessibilityLabel={isPaused ? 'Retomar corrida' : 'Pausar corrida'}
          >
            <Ionicons
              name={isPaused ? 'play' : 'pause'}
              size={28}
              color={colors.accentText}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.75}
            onPress={handleFinish}
            accessibilityRole="button"
            accessibilityLabel="Concluir corrida"
          >
            <Ionicons name="stop" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const createStyles = (colors: ActiveRunPalette) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: colors.background,
      zIndex: 1000,
      elevation: 30,
    },
    mapContainer: {
      position: 'relative',
      width: '100%',
      backgroundColor: colors.surface,
    },
    map: {
      flex: 1,
    },
    mapHeader: {
      position: 'absolute',
      left: 20,
      right: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    mapButton: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: colors.mapControlBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statsContainer: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    statsWrapper: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statsGrid: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      rowGap: 32,
    },
    statBox: {
      width: '33.333%',
      minHeight: 62,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
    },
    statBoxMiddle: {
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: colors.divider,
    },
    statLabel: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '500',
      letterSpacing: -0.1,
      marginBottom: 6,
    },
    statValueContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'center',
    },
    statValue: {
      color: colors.textPrimary,
      fontSize: 30,
      fontWeight: '700',
      letterSpacing: -0.8,
      lineHeight: 32,
    },
    statUnit: {
      color: colors.textPrimary,
      fontSize: 13,
      fontWeight: '600',
      marginLeft: 2,
    },
    controls: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 32,
      paddingTop: 8,
    },
    secondaryButton: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.surfaceElevated,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryButton: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.accent,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.32,
      shadowRadius: 12,
      elevation: 8,
    },
  });
