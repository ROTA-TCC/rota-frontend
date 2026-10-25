import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  BackHandler,
  Modal,
  Pressable,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CaloriesBarChart } from '@/components/activity/CaloriesBarChart';
import { GoogleMap } from '@/components/map/GoogleMap';
import { SPORT_LABELS } from '@/constants/activityOptions';
import {
  useActivityFormColors,
  type ActivityFormPalette,
} from '@/constants/activityFormTheme';
import { useActivityDraft } from '@/providers/ActivityDraftProvider';
import { useTheme } from '@/providers/ThemeProvider';
import type { PublishedActivity } from '@/types/activity';
import { buildCaloriesChart } from '@/utils/activityMetrics';
import { calculatePace, formatTime } from '@/utils/runUtils';

const DEFAULT_CENTER: [number, number] = [-23.55052, -46.633308];

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

const formatClock = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '--:--';
  }

  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

const getDayLabel = (date: Date) => {
  const today = new Date();
  const difference = Math.round(
    (startOfDay(today) - startOfDay(date)) / 86_400_000
  );

  if (difference === 0) {
    return 'Hoje';
  }

  if (difference === 1) {
    return 'Ontem';
  }

  return capitalize(date.toLocaleDateString('pt-BR', { weekday: 'long' }));
};

const formatActivityRange = (activity: PublishedActivity) => {
  const start = new Date(activity.run.startTime);
  const end = new Date(activity.run.endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 'Data indisponível';
  }

  const startDay = getDayLabel(start);
  const startTime = formatClock(activity.run.startTime);
  const endTime = formatClock(activity.run.endTime);

  if (start.toDateString() === end.toDateString()) {
    return `${startDay}, ${startTime} - ${endTime}`;
  }

  const endDay = getDayLabel(end);

  return `${startDay}, ${startTime} - ${endDay}, ${endTime}`;
};

const formatDistance = (meters: number) =>
  (meters / 1000).toFixed(2).replace('.', ',');

const getActivityTitle = (activity: PublishedActivity) =>
  activity.title || `${SPORT_LABELS[activity.sport]} concluída`;

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const colors = useActivityFormColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { publishedActivity } = useActivityDraft();
  const [isRouteVisible, setIsRouteVisible] = useState(false);

  const activity =
    publishedActivity?.id === id ? publishedActivity : null;

  const route = useMemo(
    () =>
      activity?.run.trackpoints.map(
        (point) => [point.latitude, point.longitude] as [number, number]
      ) ?? [],
    [activity]
  );

  const center = useMemo<[number, number]>(() => {
    if (route.length === 0) return DEFAULT_CENTER;
    return route[Math.floor(route.length / 2)];
  }, [route]);

  const chart = useMemo(
    () => (activity ? buildCaloriesChart(activity.run) : null),
    [activity]
  );

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (isRouteVisible) {
          setIsRouteVisible(false);
          return true;
        }

        router.replace('/(tabs)/home');
        return true;
      }
    );

    return () => subscription.remove();
  }, [isRouteVisible, router]);

  const handleBack = () => {
    router.replace('/(tabs)/home');
  };

  const handleShare = async () => {
    if (!activity) return;

    const title = getActivityTitle(activity);
    const distance = formatDistance(activity.run.distanceMeters);
    const duration = formatTime(activity.run.durationSeconds);
    const pace = calculatePace(
      activity.run.durationSeconds,
      activity.run.distanceMeters
    );

    try {
      await Share.share({
        message: `${title}\n${distance} km • ${duration} • ${pace}/km`,
      });
    } catch {
      Alert.alert(
        'Compartilhar atividade',
        'Não foi possível compartilhar esta atividade agora.'
      );
    }
  };

  const handleOpenRoute = () => {
    if (route.length < 2) {
      Alert.alert(
        'Rota indisponível',
        'Não há pontos suficientes para exibir a rota desta atividade.'
      );
      return;
    }

    setIsRouteVisible(true);
  };

  const handleCaloriesInfo = () => {
    if (!chart) return;

    Alert.alert(
      'Queima de calorias',
      `Total estimado: ${chart.total} kcal\nMédia por intervalo: ${chart.average} kcal\nMínimo: ${chart.min} kcal\nMáximo: ${chart.max} kcal`
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable
          onPress={handleBack}
          hitSlop={8}
          style={({ pressed }) => [
            styles.headerButton,
            pressed && styles.headerButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Voltar ao feed"
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </Pressable>

        <Text style={styles.headerTitle}>Detalhes</Text>

        <Pressable
          onPress={handleShare}
          disabled={!activity}
          hitSlop={8}
          style={({ pressed }) => [
            styles.headerButton,
            pressed && styles.headerButtonPressed,
            !activity && styles.headerButtonDisabled,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Compartilhar atividade"
        >
          <Ionicons name="share-outline" size={20} color={colors.textPrimary} />
        </Pressable>
      </View>

      {activity && chart ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 16) + 28 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <Text style={styles.title}>{getActivityTitle(activity)}</Text>
            <Text style={styles.time}>{formatActivityRange(activity)}</Text>

            {activity.description ? (
              <Text style={styles.description} numberOfLines={3}>
                {activity.description}
              </Text>
            ) : null}

            <View style={styles.badge}>
              <Ionicons
                name={activity.isRecord ? 'trophy-outline' : 'sparkles-outline'}
                size={14}
                color={colors.accent}
              />
              <Text style={styles.badgeText}>
                {activity.isRecord
                  ? 'Você alcançou um novo recorde'
                  : `${activity.tag} • ${activity.effort}`}
              </Text>
            </View>

            <View style={styles.distanceRow}>
              <Text
                style={styles.distanceValue}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
              >
                {formatDistance(activity.run.distanceMeters)}
              </Text>
              <Text style={styles.distanceUnit}>Quilômetros</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Pressable
              onPress={handleCaloriesInfo}
              style={({ pressed }) => [
                styles.cardHeader,
                pressed && styles.cardHeaderPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Ver detalhes da queima de calorias"
            >
              <Text style={styles.cardTitle}>Queima de calorias</Text>
              <Ionicons
                name="chevron-forward"
                size={15}
                color={colors.textMuted}
              />
            </Pressable>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Média</Text>
                <View style={styles.statValueRow}>
                  <Text style={styles.statValue}>{chart.average}</Text>
                  <Text style={styles.statUnit}>kcal</Text>
                </View>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Mín</Text>
                <View style={styles.statValueRow}>
                  <Text style={styles.statValue}>{chart.min}</Text>
                  <Text style={styles.statUnit}>kcal</Text>
                </View>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Máx</Text>
                <View style={styles.statValueRow}>
                  <Text style={styles.statValue}>{chart.max}</Text>
                  <Text style={styles.statUnit}>kcal</Text>
                </View>
              </View>
            </View>

            <CaloriesBarChart
              data={chart.bars}
              highlightIndex={chart.highlightIndex}
              startLabel={formatClock(activity.run.startTime)}
              endLabel={formatClock(activity.run.endTime)}
            />
          </View>

          <View style={styles.mapSection}>
            <Pressable
              onPress={handleOpenRoute}
              style={styles.mapHeader}
              accessibilityRole="button"
              accessibilityLabel="Abrir rota gravada"
            >
              <Text style={styles.mapTitle}>Rota do mapa</Text>
              <Ionicons
                name="chevron-forward"
                size={15}
                color={colors.textMuted}
              />
            </Pressable>

            <View style={styles.mapCard}>
              {route.length > 0 ? (
                <GoogleMap
                  center={center}
                  zoom={15}
                  route={route}
                  routeColor={colors.accent}
                  fitToRoute
                  fitPadding={28}
                  scrollEnabled={false}
                  zoomEnabled={false}
                  rotateEnabled={false}
                  pitchEnabled={false}
                  toolbarEnabled={false}
                  style={styles.map}
                />
              ) : (
                <View style={styles.mapPlaceholder}>
                  <Ionicons
                    name="map-outline"
                    size={28}
                    color={colors.textMuted}
                  />
                  <Text style={styles.mapPlaceholderText}>Rota indisponível</Text>
                </View>
              )}

              {route.length > 0 ? (
                <Pressable
                  style={StyleSheet.absoluteFill}
                  onPress={handleOpenRoute}
                  accessibilityRole="button"
                  accessibilityLabel="Ver rota completa"
                />
              ) : null}
            </View>
          </View>

          <Pressable
            onPress={handleOpenRoute}
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.actionButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Ver rota gravada"
          >
            <Ionicons name="map-outline" size={18} color={colors.accentText} />
            <Text style={styles.actionButtonText}>Ver rota gravada</Text>
          </Pressable>
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="document-text-outline"
              size={30}
              color={colors.textSecondary}
            />
          </View>
          <Text style={styles.emptyTitle}>Atividade não encontrada</Text>
          <Text style={styles.emptyText}>
            Esta atividade não está mais disponível neste dispositivo.
          </Text>
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [
              styles.emptyButton,
              pressed && styles.emptyButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Voltar ao feed"
          >
            <Text style={styles.emptyButtonText}>Voltar ao feed</Text>
          </Pressable>
        </View>
      )}

      <Modal
        visible={isRouteVisible && route.length > 1}
        animationType="slide"
        onRequestClose={() => setIsRouteVisible(false)}
        statusBarTranslucent
        presentationStyle="fullScreen"
      >
        <View style={styles.routeModal}>
          <View
            style={[styles.routeHeader, { paddingTop: insets.top + 10 }]}
          >
            <Pressable
              onPress={() => setIsRouteVisible(false)}
              hitSlop={8}
              style={({ pressed }) => [
                styles.headerButton,
                pressed && styles.headerButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Fechar rota"
            >
              <Ionicons
                name="arrow-back"
                size={20}
                color={colors.textPrimary}
              />
            </Pressable>

            <Text style={styles.headerTitle}>Rota gravada</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.routeMapContainer}>
            <GoogleMap
              center={center}
              zoom={15}
              route={route}
              routeColor={colors.accent}
              fitToRoute
              fitPadding={56}
              style={styles.map}
            />
          </View>

          <View
            style={[
              styles.routeFooter,
              { paddingBottom: Math.max(insets.bottom, 16) + 8 },
            ]}
          >
            <View style={styles.routeStat}>
              <Text style={styles.routeStatLabel}>Distância</Text>
              <Text style={styles.routeStatValue}>
                {formatDistance(activity?.run.distanceMeters ?? 0)} km
              </Text>
            </View>
            <View style={styles.routeDivider} />
            <View style={styles.routeStat}>
              <Text style={styles.routeStatLabel}>Tempo</Text>
              <Text style={styles.routeStatValue}>
                {formatTime(activity?.run.durationSeconds ?? 0)}
              </Text>
            </View>
            <View style={styles.routeDivider} />
            <View style={styles.routeStat}>
              <Text style={styles.routeStatLabel}>Ritmo</Text>
              <Text style={styles.routeStatValue}>
                {calculatePace(
                  activity?.run.durationSeconds ?? 0,
                  activity?.run.distanceMeters ?? 0
                )}
                /km
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (colors: ActivityFormPalette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingBottom: 12,
      backgroundColor: colors.background,
      zIndex: 5,
    },
    headerButton: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    headerButtonPressed: {
      backgroundColor: colors.cardAlt,
    },
    headerButtonDisabled: {
      opacity: 0.45,
    },
    headerTitle: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: -0.2,
    },
    headerSpacer: {
      width: 38,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 6,
      gap: 24,
    },
    hero: {
      gap: 6,
    },
    title: {
      color: colors.textPrimary,
      fontSize: 22,
      fontWeight: '700',
      letterSpacing: -0.35,
      lineHeight: 29,
    },
    time: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: '500',
    },
    description: {
      color: colors.textSecondary,
      fontSize: 12,
      lineHeight: 18,
      marginTop: 2,
    },
    badge: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 20,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      marginTop: 8,
      marginBottom: 10,
    },
    badgeText: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: '600',
    },
    distanceRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 8,
    },
    distanceValue: {
      color: colors.accent,
      fontSize: 76,
      fontWeight: '700',
      lineHeight: 82,
      letterSpacing: -3,
      flexShrink: 1,
    },
    distanceUnit: {
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: '600',
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 20,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 18,
    },
    cardHeaderPressed: {
      opacity: 0.7,
    },
    cardTitle: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 24,
      paddingRight: 12,
    },
    statBox: {
      gap: 4,
    },
    statLabel: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: '500',
    },
    statValueRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 2,
    },
    statValue: {
      color: colors.textPrimary,
      fontSize: 30,
      fontWeight: '600',
      lineHeight: 34,
      letterSpacing: -1,
    },
    statUnit: {
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: '500',
    },
    mapSection: {
      gap: 14,
    },
    mapHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    mapTitle: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
    mapCard: {
      height: 150,
      borderRadius: 24,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    map: {
      flex: 1,
    },
    mapPlaceholder: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    mapPlaceholderText: {
      color: colors.textMuted,
      fontSize: 11,
      fontWeight: '500',
    },
    actionButton: {
      height: 60,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.accent,
      backgroundColor: colors.accent,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    actionButtonPressed: {
      opacity: 0.85,
    },
    actionButtonText: {
      color: colors.accentText,
      fontSize: 15,
      fontWeight: '600',
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      paddingHorizontal: 32,
    },
    emptyIcon: {
      width: 64,
      height: 64,
      borderRadius: 22,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4,
    },
    emptyTitle: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '700',
    },
    emptyText: {
      color: colors.textSecondary,
      fontSize: 12,
      lineHeight: 18,
      textAlign: 'center',
    },
    emptyButton: {
      height: 46,
      paddingHorizontal: 22,
      borderRadius: 14,
      backgroundColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
    },
    emptyButtonPressed: {
      opacity: 0.82,
    },
    emptyButtonText: {
      color: colors.accentText,
      fontSize: 12,
      fontWeight: '700',
    },
    routeModal: {
      flex: 1,
      backgroundColor: colors.background,
    },
    routeHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingBottom: 12,
      backgroundColor: colors.background,
    },
    routeMapContainer: {
      flex: 1,
      backgroundColor: colors.card,
    },
    routeFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 16,
      paddingHorizontal: 20,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      backgroundColor: colors.card,
    },
    routeStat: {
      flex: 1,
      alignItems: 'center',
      gap: 3,
    },
    routeStatLabel: {
      color: colors.textSecondary,
      fontSize: 10,
      fontWeight: '500',
    },
    routeStatValue: {
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '700',
    },
    routeDivider: {
      width: 1,
      height: 28,
      backgroundColor: colors.border,
    },
  });
