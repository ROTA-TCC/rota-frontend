import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  useActivityFormColors,
  type ActivityFormPalette,
} from '@/constants/activityFormTheme';

interface CaloriesBarChartProps {
  data: number[];
  highlightIndex: number;
  startLabel: string;
  endLabel: string;
}

const CHART_HEIGHT = 148;
const GRID_LINES = 5;

export function CaloriesBarChart({
  data,
  highlightIndex,
  startLabel,
  endLabel,
}: CaloriesBarChartProps) {
  const colors = useActivityFormColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const scaleMax = Math.max(Math.ceil(Math.max(...data, 1) * 1.15), 4);
  const safeHighlightIndex = Math.min(
    Math.max(highlightIndex, 0),
    Math.max(data.length - 1, 0)
  );
  const yAxisLabels = Array.from({ length: GRID_LINES }, (_, index) =>
    Math.round(scaleMax * (1 - index / (GRID_LINES - 1)))
  );

  return (
    <View>
      <View style={styles.chart}>
        <View style={styles.yAxis}>
          {yAxisLabels.map((label, index) => (
            <Text key={`y-${index}`} style={styles.yAxisLabel}>
              {label}
            </Text>
          ))}
        </View>

        <View style={styles.barsArea}>
          <View style={styles.grid} pointerEvents="none">
            {Array.from({ length: GRID_LINES }, (_, index) => (
              <View key={`grid-${index}`} style={styles.gridLine} />
            ))}
          </View>

          <View style={styles.barsRow}>
            {data.map((value, index) => {
              const isHighlighted = index === safeHighlightIndex;
              const height = Math.max(
                value > 0 ? 3 : 2,
                (value / scaleMax) * CHART_HEIGHT
              );

              return (
                <View
                  key={`bar-${index}`}
                  style={[
                    styles.bar,
                    { height },
                    {
                      backgroundColor: isHighlighted
                        ? colors.accent
                        : colors.chartInactive,
                    },
                    isHighlighted && styles.barHighlighted,
                  ]}
                />
              );
            })}
          </View>
        </View>
      </View>

      <View style={styles.xAxis}>
        <Text style={styles.xAxisLabel}>{startLabel}</Text>
        <Text style={styles.xAxisLabel}>{endLabel}</Text>
      </View>
    </View>
  );
}

const createStyles = (colors: ActivityFormPalette) =>
  StyleSheet.create({
    chart: {
      flexDirection: 'row',
      height: CHART_HEIGHT,
    },
    yAxis: {
      width: 38,
      height: CHART_HEIGHT,
      justifyContent: 'space-between',
      paddingRight: 9,
    },
    yAxisLabel: {
      color: colors.textSecondary,
      fontSize: 9,
      fontWeight: '600',
      lineHeight: 10,
      textAlign: 'left',
    },
    barsArea: {
      flex: 1,
      height: CHART_HEIGHT,
      position: 'relative',
    },
    grid: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      justifyContent: 'space-between',
      zIndex: 0,
    },
    gridLine: {
      width: '100%',
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
    },
    barsRow: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      zIndex: 1,
    },
    bar: {
      width: 8,
      minHeight: 2,
      borderTopLeftRadius: 3,
      borderTopRightRadius: 3,
    },
    barHighlighted: {
      shadowColor: colors.accent,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.45,
      shadowRadius: 8,
      elevation: 4,
    },
    xAxis: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 14,
      marginLeft: 38,
    },
    xAxisLabel: {
      color: colors.textSecondary,
      fontSize: 9,
      fontWeight: '600',
    },
  });
