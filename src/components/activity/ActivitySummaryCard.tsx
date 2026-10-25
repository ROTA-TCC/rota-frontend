import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { GoogleMap } from '@/components/map/GoogleMap';
import { sportIcons } from '@/components/Record/icons';
import {
  useActivityFormColors,
  type ActivityFormPalette,
} from '@/constants/activityFormTheme';
import {
  MAP_TYPE_OPTIONS,
  SPORT_LABELS,
  getSportFromTrackingType,
} from '@/constants/activityOptions';
import type { ActivityMapType } from '@/types/activity';
import type { SportId } from '@/types/record';
import type { RunPayload } from '@/types/run';
import { calculatePace, formatTime } from '@/utils/runUtils';
import { SelectOptionSheet } from './SelectOptionSheet';

interface ActivitySummaryCardProps {
  run: RunPayload;
  sourceType: string;
  sport?: SportId;
  createdAt: string;
}

const DEFAULT_CENTER: [number, number] = [-23.55052, -46.633308];

const formatActivityDate = (createdAt: string) => {
  const date = new Date(createdAt);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const dateLabel = isToday
    ? 'Hoje'
    : date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  const timeLabel = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${dateLabel}, ${timeLabel}`;
};

export function ActivitySummaryCard({
  run,
  sourceType,
  sport: selectedSport,
  createdAt,
}: ActivitySummaryCardProps) {
  const colors = useActivityFormColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [mapType, setMapType] = useState<ActivityMapType>('standard');
  const [isMapSheetVisible, setIsMapSheetVisible] = useState(false);

  const sport = selectedSport ?? getSportFromTrackingType(sourceType);
  const SportIcon = sportIcons[sport];

  const distanceKm = (run.distanceMeters / 1000).toFixed(2).replace('.', ',');
  const duration = formatTime(run.durationSeconds);
  const pace = calculatePace(run.durationSeconds, run.distanceMeters);

  const route = useMemo(
    () =>
      run.trackpoints.map(
        (point) => [point.latitude, point.longitude] as [number, number]
      ),
    [run.trackpoints]
  );

  const center = useMemo<[number, number]>(() => {
    if (route.length === 0) return DEFAULT_CENTER;
    return route[Math.floor(route.length / 2)];
  }, [route]);

  const mapTypeOption =
    MAP_TYPE_OPTIONS.find((option) => option.value === mapType) ??
    MAP_TYPE_OPTIONS[0];

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.metaRow}>
          <View style={styles.sportIcon}>
            <SportIcon size={16} color={colors.accent} />
          </View>
          <Text style={styles.metaText}>
            {SPORT_LABELS[sport]} · {formatActivityDate(createdAt)}
          </Text>
        </View>

        <View style={styles.heroRow}>
          <View style={styles.distanceBlock}>
            <View style={styles.distanceLine}>
              <Text style={styles.distanceValue}>{distanceKm}</Text>
              <Text style={styles.distanceUnit}>km</Text>
            </View>
            <Text style={styles.distanceLabel}>Distância</Text>
          </View>

          <View style={styles.secondaryStats}>
            <View style={styles.secondaryStat}>
              <Text style={styles.secondaryLabel}>Tempo</Text>
              <Text style={styles.secondaryValue}>{duration}</Text>
            </View>
            <View style={styles.secondaryStat}>
              <Text style={styles.secondaryLabel}>Ritmo</Text>
              <Text style={styles.secondaryValue}>
                {pace}
                <Text style={styles.secondaryUnit}> /km</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.mapWrapper}>
        {route.length > 0 ? (
          <GoogleMap
            center={center}
            zoom={15}
            route={route}
            routeColor={colors.accent}
            mapType={mapType}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
            toolbarEnabled={false}
            style={styles.map}
          />
        ) : (
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map-outline" size={26} color={colors.textMuted} />
            <Text style={styles.mapPlaceholderText}>Rota indisponível</Text>
          </View>
        )}

        <Pressable
          onPress={() => setIsMapSheetVisible(true)}
          style={({ pressed }) => [
            styles.mapTypeButton,
            pressed && styles.mapTypeButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Alterar tipo de mapa"
        >
          <Ionicons name="layers-outline" size={13} color="#FFFFFF" />
          <Text style={styles.mapTypeText}>{mapTypeOption.label}</Text>
        </Pressable>
      </View>

      <SelectOptionSheet
        visible={isMapSheetVisible}
        title="Tipo de mapa"
        options={MAP_TYPE_OPTIONS}
        selectedValue={mapType}
        onSelect={(value) => setMapType(value as ActivityMapType)}
        onClose={() => setIsMapSheetVisible(false)}
      />
    </View>
  );
}

const createStyles = (colors: ActivityFormPalette) =>
  StyleSheet.create({
    card: {
      borderRadius: 22,
      backgroundColor: colors.card,
      overflow: 'hidden',
    },
    content: {
      padding: 18,
      gap: 16,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    sportIcon: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.accentSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    metaText: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: '600',
    },
    heroRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 16,
    },
    distanceBlock: {
      gap: 0,
    },
    distanceLine: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 6,
    },
    distanceValue: {
      color: colors.textPrimary,
      fontSize: 44,
      fontWeight: '800',
      letterSpacing: -1.6,
      lineHeight: 48,
      fontVariant: ['tabular-nums'],
    },
    distanceUnit: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '600',
    },
    distanceLabel: {
      color: colors.textMuted,
      fontSize: 11,
      fontWeight: '500',
    },
    secondaryStats: {
      alignItems: 'flex-end',
      gap: 10,
      paddingBottom: 2,
    },
    secondaryStat: {
      alignItems: 'flex-end',
      gap: 1,
    },
    secondaryLabel: {
      color: colors.textMuted,
      fontSize: 10,
      fontWeight: '600',
    },
    secondaryValue: {
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: '700',
      letterSpacing: -0.2,
      fontVariant: ['tabular-nums'],
    },
    secondaryUnit: {
      color: colors.textSecondary,
      fontSize: 11,
      fontWeight: '500',
    },
    mapWrapper: {
      height: 160,
      backgroundColor: colors.cardAlt,
    },
    map: {
      flex: 1,
    },
    mapPlaceholder: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    },
    mapPlaceholderText: {
      color: colors.textMuted,
      fontSize: 11,
      fontWeight: '500',
    },
    mapTypeButton: {
      position: 'absolute',
      left: 12,
      bottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 7,
      paddingHorizontal: 11,
      borderRadius: 20,
      backgroundColor: colors.mapOverlay,
    },
    mapTypeButtonPressed: {
      opacity: 0.8,
    },
    mapTypeText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: '600',
    },
  });
