import React, { type ComponentType } from 'react';
import Svg, { Circle, Line, Path, Polygon, Polyline } from 'react-native-svg';
import type { SportId } from '@/types/record';

export interface IconProps {
  size?: number;
  color?: string;
}

export function RunningSportIcon({ size = 24, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 16v-2.38C4 11.5 5.97 9.8 8.1 10.3l3.9.9c.8.2 1.6 0 2.2-.5l3.8-3.2"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M2 20h20" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M14 17l2 3" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M8 17l-1 3" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function CyclingSportIcon({ size = 24, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={5.5} cy={17.5} r={3.5} stroke={color} strokeWidth={2} />
      <Circle cx={18.5} cy={17.5} r={3.5} stroke={color} strokeWidth={2} />
      <Circle cx={15} cy={5} r={1} stroke={color} strokeWidth={2} />
      <Path
        d="M12 17.5V14l-3-3 4-3 2 3h3"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function StrengthSportIcon({ size = 24, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6.5 6.5h11" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M6.5 17.5h11" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M8 3v18" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M16 3v18" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M3 8v8" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M21 8v8" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function WalkSportIcon({ size = 24, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={13} cy={4} r={2} stroke={color} strokeWidth={2} />
      <Path
        d="M13 7l-2 5 3 2v6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M11 12l-4 1-2 4" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M14 9l4 2 1 4" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function TrailSportIcon({ size = 24, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1={2} y1={20} x2={22} y2={20} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path
        d="M4 20l5-9 3 5 3-6 5 10"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function TreadmillSportIcon({ size = 24, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1={3} y1={18} x2={21} y2={18} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path
        d="M6 18l3-9h9"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M18 9l3 9" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M9 13h7" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function PlayIcon({ size = 16, color = '#000000' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Polygon points="5 3 19 12 5 21 5 3" />
    </Svg>
  );
}

export function ChevronRightIcon({ size = 20, color = '#52525B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Polyline
        points="9 18 15 12 9 6"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export const sportIcons: Record<SportId, ComponentType<IconProps>> = {
  running: RunningSportIcon,
  cycling: CyclingSportIcon,
  strength: StrengthSportIcon,
  walk: WalkSportIcon,
  trail: TrailSportIcon,
  treadmill: TreadmillSportIcon,
};
