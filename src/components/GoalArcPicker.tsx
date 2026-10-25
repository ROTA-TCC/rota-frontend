import React, { useCallback, useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path, Circle, G, Text as SvgText } from 'react-native-svg';
import {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  createAnimatedComponent,
} from 'react-native-reanimated';

const AnimatedPath = createAnimatedComponent(Path);

export type GoalLevel = 'novice' | 'intermediate' | 'advanced';

interface GoalArcPickerProps {
  selectedLevel: GoalLevel;
  onSelectLevel: (level: GoalLevel) => void;
  accentColor?: string;
}

interface Dot {
  cx: number;
  cy: number;
}

interface DotGroupProps {
  dots: readonly Dot[];
  active: boolean;
  activeColors: readonly string[];
}

interface LevelOptionProps {
  label: string;
  x: number;
  y: number;
  radius: number;
  labelY: number;
  fontSize: number;
  icon: 'bolt' | 'rings';
  selected: boolean;
  accentColor: string;
  onPress: () => void;
}

interface ArcSegment {
  d: string;
  color: string;
}

type ColorStop = readonly [offset: number, color: string];

const ARC_LENGTH = 518.4;
const ARC_RADIUS = 110;
const ARC_CENTER_X = 160;
const ARC_CENTER_Y = 227.8 - Math.sqrt(ARC_RADIUS ** 2 - 77.8 ** 2);
const ARC_START_ANGLE = Math.atan2(227.8 - ARC_CENTER_Y, 82.2 - ARC_CENTER_X);
const ARC_SWEEP = Math.PI * 1.5;
const ARC_SEGMENT_COUNT = 48;
const DEFAULT_ACCENT = '#FF8C00';

const LEFT_DOTS: readonly Dot[] = [
  { cx: 63.0, cy: 201.8 },
  { cx: 52.1, cy: 171.5 },
  { cx: 50.5, cy: 139.2 },
  { cx: 58.4, cy: 107.9 },
  { cx: 75.0, cy: 80.2 },
  { cx: 98.9, cy: 58.5 },
  { cx: 128.1, cy: 44.7 },
];

const RIGHT_DOTS: readonly Dot[] = [
  { cx: 196.3, cy: 46.2 },
  { cx: 228.6, cy: 64.0 },
  { cx: 253.1, cy: 91.5 },
  { cx: 267.2, cy: 125.5 },
  { cx: 269.3, cy: 162.3 },
  { cx: 259.1, cy: 196.8 },
];

const LEFT_ACTIVE_COLORS = ['#6A3815', '#864312', '#A24F0F', '#BE5A0C', '#DA6509', '#F07105', '#FF7E01'];
const RIGHT_ACTIVE_COLORS = ['#FF8200', '#FF8400', '#FF8600', '#FF8800', '#FF8A00', DEFAULT_ACCENT];
const INACTIVE_DOT_COLOR = '#555555';

const PROGRESS_MAP: Record<GoalLevel, number> = {
  novice: 0.0,
  intermediate: 0.5,
  advanced: 1.0,
};

function getArcStops(level: GoalLevel, accentColor: string): readonly ColorStop[] {
  switch (level) {
    case 'novice':
      return [
        [0, INACTIVE_DOT_COLOR],
        [1, INACTIVE_DOT_COLOR],
      ];
    case 'intermediate':
      return [
        [0, INACTIVE_DOT_COLOR],
        [0.1, '#7A3A10'],
        [0.3, '#C25600'],
        [0.5, accentColor],
        [1, accentColor],
      ];
    case 'advanced':
      return [
        [0, INACTIVE_DOT_COLOR],
        [0.08, '#7A3A10'],
        [0.35, '#A84200'],
        [0.7, '#D66200'],
        [1, accentColor],
      ];
  }
}

function parseHexColor(color: string): [number, number, number] {
  const hex = color.replace('#', '');
  return [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
  ];
}

function mixHexColors(from: string, to: string, progress: number): string {
  const [fromR, fromG, fromB] = parseHexColor(from);
  const [toR, toG, toB] = parseHexColor(to);
  const channel = (start: number, end: number) =>
    Math.round(start + (end - start) * progress)
      .toString(16)
      .padStart(2, '0');

  return `#${channel(fromR, toR)}${channel(fromG, toG)}${channel(fromB, toB)}`;
}

function getArcColor(stops: readonly ColorStop[], progress: number): string {
  for (let index = 1; index < stops.length; index += 1) {
    const [endOffset, endColor] = stops[index];
    if (progress <= endOffset) {
      const [startOffset, startColor] = stops[index - 1];
      const span = endOffset - startOffset;
      const localProgress = span === 0 ? 1 : (progress - startOffset) / span;
      return mixHexColors(startColor, endColor, localProgress);
    }
  }

  return stops[stops.length - 1][1];
}

function buildArcSegments(level: GoalLevel, accentColor: string): ArcSegment[] {
  const stops = getArcStops(level, accentColor);
  const segments: ArcSegment[] = [];

  for (let index = 0; index < ARC_SEGMENT_COUNT; index += 1) {
    const startProgress = index / ARC_SEGMENT_COUNT;
    const endProgress = (index + 1) / ARC_SEGMENT_COUNT;
    const startAngle = ARC_START_ANGLE + ARC_SWEEP * startProgress;
    const endAngle = ARC_START_ANGLE + ARC_SWEEP * endProgress + 0.004;
    const startX = ARC_CENTER_X + ARC_RADIUS * Math.cos(startAngle);
    const startY = ARC_CENTER_Y + ARC_RADIUS * Math.sin(startAngle);
    const endX = ARC_CENTER_X + ARC_RADIUS * Math.cos(endAngle);
    const endY = ARC_CENTER_Y + ARC_RADIUS * Math.sin(endAngle);

    segments.push({
      d: `M ${startX.toFixed(3)} ${startY.toFixed(3)} A ${ARC_RADIUS} ${ARC_RADIUS} 0 0 1 ${endX.toFixed(3)} ${endY.toFixed(3)}`,
      color: getArcColor(stops, (startProgress + endProgress) / 2),
    });
  }

  return segments;
}

const ArcGradientStroke = React.memo(function ArcGradientStroke({
  level,
  accentColor,
}: {
  level: GoalLevel;
  accentColor: string;
}) {
  const segments = useMemo(() => buildArcSegments(level, accentColor), [level, accentColor]);

  return (
    <G>
      {segments.map((segment, index) => (
        <Path
          key={`arc-segment-${index}`}
          d={segment.d}
          stroke={segment.color}
          strokeWidth="44"
          strokeLinecap="butt"
          fill="none"
        />
      ))}
    </G>
  );
});

const ArcTrack = React.memo(function ArcTrack() {
  return (
    <Path
      d="M 82.2 227.8 A 110 110 0 1 1 237.8 227.8"
      stroke="#1E1E1E"
      strokeWidth="44"
      strokeLinecap="butt"
    />
  );
});

const DotGroup = React.memo(function DotGroup({ dots, active, activeColors }: DotGroupProps) {
  return (
    <G>
      {dots.map((dot, index) => (
        <Circle
          key={`dot-${index}`}
          cx={dot.cx}
          cy={dot.cy}
          r={active ? 2 : 1.5}
          fill={active ? activeColors[index] : INACTIVE_DOT_COLOR}
        />
      ))}
    </G>
  );
});

const LevelOption = React.memo(function LevelOption({
  label,
  x,
  y,
  radius,
  labelY,
  fontSize,
  icon,
  selected,
  accentColor,
  onPress,
}: LevelOptionProps) {
  const iconColor = selected ? accentColor : '#666666';

  return (
    <G transform={`translate(${x}, ${y})`} onPress={onPress}>
      <Circle cx="0" cy="0" r="32" fill="transparent" />
      <Circle
        cx="0"
        cy="0"
        r={radius}
        fill="#161616"
        stroke={selected ? accentColor : '#4A4A4A'}
        strokeWidth="2.5"
      />

      {icon === 'bolt' ? (
        <Path
          d="M 2.25,-9 L -5.25,2.25 L -0.75,2.25 L -2.25,10.5 L 6.75,-0.75 L 1.5,-0.75 Z"
          fill={iconColor}
        />
      ) : (
        <>
          <Circle cx="0" cy="0" r="10" fill="none" stroke={iconColor} strokeWidth="2" />
          <Circle cx="0" cy="0" r="6" fill="none" stroke={iconColor} strokeWidth="1.5" />
          <Circle cx="0" cy="0" r="2" fill={iconColor} />
        </>
      )}

      <SvgText
        x="0"
        y={labelY}
        textAnchor="middle"
        fill={selected ? accentColor : '#8E8E93'}
        fontSize={fontSize}
        fontWeight={selected ? '800' : '600'}
      >
        {label}
      </SvgText>
    </G>
  );
});

export const GoalArcPicker = React.memo(function GoalArcPicker({
  selectedLevel,
  onSelectLevel,
  accentColor = DEFAULT_ACCENT,
}: GoalArcPickerProps) {
  const progress = useSharedValue(PROGRESS_MAP[selectedLevel]);

  useEffect(() => {
    progress.value = withTiming(PROGRESS_MAP[selectedLevel], {
      duration: 450,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [progress, selectedLevel]);

  const coverPathProps = useAnimatedProps(() => ({
    strokeDashoffset: -ARC_LENGTH * progress.value,
  }));

  const selectNovice = useCallback(() => onSelectLevel('novice'), [onSelectLevel]);
  const selectIntermediate = useCallback(() => onSelectLevel('intermediate'), [onSelectLevel]);
  const selectAdvanced = useCallback(() => onSelectLevel('advanced'), [onSelectLevel]);

  const isLeftActive = selectedLevel === 'intermediate' || selectedLevel === 'advanced';
  const isRightActive = selectedLevel === 'advanced';

  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" viewBox="0 0 320 280" fill="none">
        <ArcTrack />
        <ArcGradientStroke level={selectedLevel} accentColor={accentColor} />

        <AnimatedPath
          d="M 82.2 227.8 A 110 110 0 1 1 237.8 227.8"
          stroke="#1E1E1E"
          strokeWidth="44"
          strokeLinecap="butt"
          strokeDasharray={ARC_LENGTH}
          animatedProps={coverPathProps}
        />

        <DotGroup dots={LEFT_DOTS} active={isLeftActive} activeColors={LEFT_ACTIVE_COLORS} />
        <DotGroup dots={RIGHT_DOTS} active={isRightActive} activeColors={RIGHT_ACTIVE_COLORS} />

        <LevelOption
          label="Novato"
          x={82.2}
          y={227.8}
          radius={22}
          labelY={44}
          fontSize={12}
          icon="bolt"
          selected={selectedLevel === 'novice'}
          accentColor={accentColor}
          onPress={selectNovice}
        />

        <LevelOption
          label="Intermediário"
          x={160}
          y={40}
          radius={24}
          labelY={-34}
          fontSize={13}
          icon="rings"
          selected={selectedLevel === 'intermediate'}
          accentColor={accentColor}
          onPress={selectIntermediate}
        />

        <LevelOption
          label="Avançado"
          x={237.8}
          y={227.8}
          radius={22}
          labelY={44}
          fontSize={12}
          icon="bolt"
          selected={selectedLevel === 'advanced'}
          accentColor={accentColor}
          onPress={selectAdvanced}
        />
      </Svg>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 320,
    aspectRatio: 320 / 280,
    alignSelf: 'center',
    marginVertical: 8,
  },
});

export default GoalArcPicker;
