import React, { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Line,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { useExploreColors } from '@/constants/exploreTheme';
import type { ChartPoint } from '@/types/explore';

interface ActivityAreaChartProps {
  data: ChartPoint[];
  highlightIndex?: number;
  height?: number;
}

interface PositionedPoint extends ChartPoint {
  x: number;
  y: number;
}

const HORIZONTAL_PADDING = 6;
const TOP_PADDING = 10;
const BOTTOM_PADDING = 36;

function createSmoothPath(
  points: PositionedPoint[],
  startIndex = 0,
  endIndex = points.length - 1
) {
  if (points.length === 0) {
    return '';
  }

  const start = Math.max(0, startIndex);
  const end = Math.min(points.length - 1, endIndex);

  if (start >= end) {
    return `M ${points[start].x},${points[start].y}`;
  }

  let path = `M ${points[start].x},${points[start].y}`;

  for (let index = start; index < end; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const previous = points[index - 1] ?? current;
    const afterNext = points[index + 2] ?? next;

    const controlPointOneX = current.x + (next.x - previous.x) / 6;
    const controlPointOneY = current.y + (next.y - previous.y) / 6;
    const controlPointTwoX = next.x - (afterNext.x - current.x) / 6;
    const controlPointTwoY = next.y - (afterNext.y - current.y) / 6;

    path += ` C ${controlPointOneX},${controlPointOneY} ${controlPointTwoX},${controlPointTwoY} ${next.x},${next.y}`;
  }

  return path;
}

export function ActivityAreaChart({
  data,
  highlightIndex = 0,
  height = 120,
}: ActivityAreaChartProps) {
  const colors = useExploreColors();
  const [containerWidth, setContainerWidth] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(highlightIndex);

  const lastIndex = Math.max(data.length - 1, 0);
  const clampedHighlight = Math.min(Math.max(highlightIndex, 0), lastIndex);

  useEffect(() => {
    setSelectedIndex(clampedHighlight);
  }, [clampedHighlight]);

  const chartWidth = containerWidth;
  const innerWidth = Math.max(chartWidth - HORIZONTAL_PADDING * 2, 0);
  const baselineY = height - BOTTOM_PADDING;
  const maxValue = Math.max(...data.map((point) => point.value), 1);

  const points = useMemo<PositionedPoint[]>(
    () =>
      data.map((point, index) => ({
        ...point,
        x:
          HORIZONTAL_PADDING +
          (data.length > 1 ? (index / (data.length - 1)) * innerWidth : innerWidth / 2),
        y: TOP_PADDING + (1 - point.value / maxValue) * (baselineY - TOP_PADDING),
      })),
    [baselineY, data, innerWidth, maxValue]
  );

  const activePoints = points.slice(0, clampedHighlight + 1);
  const inactivePoints = points.slice(clampedHighlight);
  const activePath = createSmoothPath(points, 0, clampedHighlight);
  const inactivePath = createSmoothPath(points, clampedHighlight, lastIndex);

  const firstActivePoint = activePoints[0];
  const lastActivePoint = activePoints[activePoints.length - 1];
  const areaPath =
    activePath && firstActivePoint && lastActivePoint
      ? `${activePath} L ${lastActivePoint.x},${baselineY} L ${firstActivePoint.x},${baselineY} Z`
      : '';

  const safeSelectedIndex = Math.min(Math.max(selectedIndex, 0), lastIndex);
  const selectedPoint = points[safeSelectedIndex];
  const firstPoint = points[0];
  const lastPoint = points[lastIndex];
  const selectedCapsuleX = selectedPoint
    ? Math.max(0, Math.min(selectedPoint.x - 18, chartWidth - 36))
    : 0;

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const handlePress = (event: GestureResponderEvent) => {
    if (data.length < 2 || innerWidth <= 0) {
      return;
    }

    const pressX = event.nativeEvent.locationX;
    const ratio = Math.min(Math.max((pressX - HORIZONTAL_PADDING) / innerWidth, 0), 1);

    setSelectedIndex(Math.round(ratio * lastIndex));
  };

  const selectedLabel = selectedPoint?.label ?? '';

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {chartWidth > 0 && firstPoint && lastPoint && selectedPoint && (
        <>
          <Svg width={chartWidth} height={height}>
            <Defs>
              <LinearGradient id="chartFill" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor={colors.accentPrimary} stopOpacity={0.3} />
                <Stop offset="100%" stopColor={colors.accentPrimary} stopOpacity={0} />
              </LinearGradient>
            </Defs>

            {areaPath ? <Path d={areaPath} fill="url(#chartFill)" /> : null}

            {inactivePoints.length > 1 ? (
              <Path
                d={inactivePath}
                fill="none"
                stroke={colors.chartInactive}
                strokeWidth={1.8}
                strokeLinecap="round"
              />
            ) : null}

            {activePath ? (
              <Path
                d={activePath}
                fill="none"
                stroke={colors.accentPrimary}
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}

            <Circle
              cx={selectedPoint.x}
              cy={selectedPoint.y}
              r={6}
              fill={colors.accentPrimary}
              fillOpacity={0.25}
            />
            <Circle
              cx={selectedPoint.x}
              cy={selectedPoint.y}
              r={3.5}
              fill={colors.accentPrimary}
            />

            {points.map((point, index) => {
              const isSelected = index === safeSelectedIndex;

              return (
                <Line
                  key={`tick-${point.label}`}
                  x1={point.x}
                  y1={baselineY + 2}
                  x2={point.x}
                  y2={baselineY + (isSelected ? 9 : 6)}
                  stroke={isSelected ? colors.accentPrimary : colors.borderRuler}
                  strokeWidth={isSelected ? 2 : 1.5}
                />
              );
            })}

            {safeSelectedIndex > 1 ? (
              <SvgText
                x={firstPoint.x}
                y={height - 10}
                fill={colors.textRuler}
                fontSize={9.5}
                fontWeight="500"
                textAnchor="start"
              >
                {firstPoint.label}
              </SvgText>
            ) : null}

            <Rect
              x={selectedCapsuleX}
              y={baselineY + 12}
              width={36}
              height={17}
              rx={8.5}
              fill={colors.card}
              stroke={colors.accentPrimary}
              strokeWidth={1}
            />
            <SvgText
              x={selectedCapsuleX + 18}
              y={baselineY + 24}
              fill={colors.accentPrimary}
              fontSize={9}
              fontWeight="700"
              textAnchor="middle"
            >
              {selectedLabel}
            </SvgText>

            {safeSelectedIndex < lastIndex - 1 ? (
              <SvgText
                x={lastPoint.x}
                y={height - 10}
                fill={colors.textRuler}
                fontSize={9.5}
                fontWeight="500"
                textAnchor="end"
              >
                {lastPoint.label}
              </SvgText>
            ) : null}
          </Svg>

          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={handlePress}
            accessibilityRole="adjustable"
            accessibilityLabel="Gráfico de passos por hora"
            accessibilityValue={{ text: `${selectedLabel}: ${selectedPoint.value} passos` }}
            accessibilityActions={[
              { name: 'increment', label: 'Próximo horário' },
              { name: 'decrement', label: 'Horário anterior' },
            ]}
            onAccessibilityAction={(event) => {
              if (event.nativeEvent.actionName === 'increment') {
                setSelectedIndex((current) => Math.min(current + 1, lastIndex));
              } else if (event.nativeEvent.actionName === 'decrement') {
                setSelectedIndex((current) => Math.max(current - 1, 0));
              }
            }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 4,
  },
});
