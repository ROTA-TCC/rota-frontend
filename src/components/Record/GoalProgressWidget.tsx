import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect, Text as SvgText } from 'react-native-svg';
import { useRecordColors, type RecordPalette } from '@/constants/recordTheme';

interface GoalProgressWidgetProps {
  progress: number;
  remaining: number;
}

export function GoalProgressWidget({ progress, remaining }: GoalProgressWidgetProps) {
  const colors = useRecordColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel={`Progresso da meta: ${progress}%. ${remaining} treinos restantes.`}
    >
      <View style={styles.textGroup}>
        <Text style={styles.title}>Progresso da Meta</Text>
        <Text style={styles.subtitle}>{remaining} treinos restantes</Text>
      </View>

      <View style={styles.chart}>
        <Svg width={90} height={60} viewBox="0 0 90 60" fill="none">
          <Rect x={31} y={10} width={3} height={4} rx={1} fill={colors.chartLine} />
          <Path
            d="M 32 12 L 22 12 A 16.5 16.5 0 0 0 22 45 L 70 45"
            stroke={colors.chartLine}
            strokeWidth={4}
            strokeLinecap="butt"
            strokeLinejoin="miter"
          />
          <SvgText
            x={46}
            y={29}
            fill={colors.chartText}
            fontSize={10}
            fontWeight="600"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {`${progress}%`}
          </SvgText>
          <Circle
            cx={70}
            cy={45}
            r={5}
            fill={colors.blue}
            stroke={colors.chartDotStroke}
            strokeWidth={1.5}
          />
        </Svg>
      </View>
    </View>
  );
}

const createStyles = (colors: RecordPalette) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 20,
      paddingVertical: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    textGroup: {
      flex: 1,
      gap: 4,
    },
    title: {
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: '700',
      letterSpacing: -0.2,
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: '500',
    },
    chart: {
      width: 90,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
