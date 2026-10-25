import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useExploreColors, type ExplorePalette } from '@/constants/exploreTheme';
import type { ChartPoint } from '@/types/explore';
import { ActivityAreaChart } from '@/components/charts/ActivityAreaChart';
import { ChevronRightIcon, RunningIcon } from './icons';

interface DailyAverageCardProps {
  title: string;
  value: number;
  unit: string;
  data: ChartPoint[];
  highlightIndex: number;
}

export function DailyAverageCard({
  title,
  value,
  unit,
  data,
  highlightIndex,
}: DailyAverageCardProps) {
  const colors = useExploreColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <ChevronRightIcon size={16} color={colors.textChevron} />
      </View>

      <View style={styles.metricRow}>
        <View style={styles.metricIcon}>
          <RunningIcon size={18} color={colors.background} />
        </View>
        <Text style={styles.metricValue}>{value.toLocaleString('pt-BR')}</Text>
        <Text style={styles.metricUnit}>{unit}</Text>
      </View>

      <ActivityAreaChart data={data} highlightIndex={highlightIndex} />
    </View>
  );
}

const createStyles = (colors: ExplorePalette) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.borderCard,
      paddingTop: 16,
      paddingHorizontal: 16,
      paddingBottom: 12,
      gap: 12,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '600',
    },
    metricRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    metricIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.accentPrimary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    metricValue: {
      color: colors.textPrimary,
      fontSize: 30,
      fontWeight: '700',
      letterSpacing: -0.5,
      lineHeight: 30,
    },
    metricUnit: {
      color: colors.textMuted,
      fontSize: 12,
      marginLeft: 2,
    },
  });
