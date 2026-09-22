import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path, Circle, G, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export type GoalLevel = 'novice' | 'intermediate' | 'advanced';

interface GoalArcPickerProps {
  selectedLevel: GoalLevel;
  onSelectLevel: (level: GoalLevel) => void;
  accentColor?: string;
}

const ARC_LENGTH = 518.4;
const DEFAULT_ACCENT = '#FF8C00'; // Laranja vibrante e limpo

// Coordenadas dos pontinhos
const LEFT_DOTS = [
  { cx: 63.0, cy: 201.8 },
  { cx: 52.1, cy: 171.5 },
  { cx: 50.5, cy: 139.2 },
  { cx: 58.4, cy: 107.9 },
  { cx: 75.0, cy: 80.2 },
  { cx: 98.9, cy: 58.5 },
  { cx: 128.1, cy: 44.7 },
];

const RIGHT_DOTS = [
  { cx: 196.3, cy: 46.2 },
  { cx: 228.6, cy: 64.0 },
  { cx: 253.1, cy: 91.5 },
  { cx: 267.2, cy: 125.5 },
  { cx: 269.3, cy: 162.3 },
  { cx: 259.1, cy: 196.8 },
];

const PROGRESS_MAP: Record<GoalLevel, number> = {
  novice: 0.0,
  intermediate: 0.5,
  advanced: 1.0,
};

export const GoalArcPicker: React.FC<GoalArcPickerProps> = ({
  selectedLevel,
  onSelectLevel,
  accentColor = DEFAULT_ACCENT,
}) => {
  const progress = useSharedValue(PROGRESS_MAP[selectedLevel]);

  useEffect(() => {
    progress.value = withTiming(PROGRESS_MAP[selectedLevel], {
      duration: 400,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [selectedLevel]);

  const animatedPathProps = useAnimatedProps(() => {
    const strokeDashoffset = ARC_LENGTH * (1 - progress.value);
    return {
      strokeDashoffset,
    };
  });

  // Regra de ativação dos pontinhos
  const isLeftActive = selectedLevel === 'intermediate' || selectedLevel === 'advanced';
  const isRightActive = selectedLevel === 'advanced';

  return (
    <View style={styles.container}>
      <Svg width="320" height="280" viewBox="0 0 320 280" fill="none">
        <Defs>
          {/* Gradiente Limpo e Moderno:
              Cinza neutro suave no comecinho -> Amarelo/Dourado -> Laranja Vibrante no final */}
          <LinearGradient id="arcGradient" x1="82.2" y1="227.8" x2="237.8" y2="40" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#3A3A3C" />
            <Stop offset="12%" stopColor="#FFC107" />
            <Stop offset="50%" stopColor="#FF9800" />
            <Stop offset="100%" stopColor={accentColor} />
          </LinearGradient>
        </Defs>

        {/* Trilha Fundo Escura */}
        <Path
          d="M 82.2 227.8 A 110 110 0 1 1 237.8 227.8"
          stroke="#1C1C1E"
          strokeWidth="44"
          strokeLinecap="butt"
        />

        {/* Trilha Preenchida (Gradiente Animado) */}
        <AnimatedPath
          d="M 82.2 227.8 A 110 110 0 1 1 237.8 227.8"
          stroke="url(#arcGradient)"
          strokeWidth="44"
          strokeLinecap="butt"
          strokeDasharray={ARC_LENGTH}
          animatedProps={animatedPathProps}
        />

        {/* PONTINHOS LADO ESQUERDO (Ativam no Intermediário / Avançado) */}
        {LEFT_DOTS.map((dot, index) => (
          <Circle
            key={`left-dot-${index}`}
            cx={dot.cx}
            cy={dot.cy}
            r={isLeftActive ? 1.8 : 1.2}
            fill={isLeftActive ? '#FFB703' : '#2C2C2E'}
          />
        ))}

        {/* PONTINHOS LADO DIREITO (Ativam apenas no Avançado) */}
        {RIGHT_DOTS.map((dot, index) => (
          <Circle
            key={`right-dot-${index}`}
            cx={dot.cx}
            cy={dot.cy}
            r={isRightActive ? 1.8 : 1.2}
            fill={isRightActive ? accentColor : '#2C2C2E'}
          />
        ))}

        {/* NÓ: NOVATO */}
        <G transform="translate(82.2, 227.8)" onPress={() => onSelectLevel('novice')}>
          <Circle cx="0" cy="0" r="32" fill="transparent" />
          <Circle
            cx="0"
            cy="0"
            r="22"
            fill="#121212"
            stroke={selectedLevel === 'novice' ? accentColor : '#2C2C2E'}
            strokeWidth="2.5"
          />
          <Path
            d="M 2.25,-9 L -5.25,2.25 L -0.75,2.25 L -2.25,10.5 L 6.75,-0.75 L 1.5,-0.75 Z"
            fill={selectedLevel === 'novice' ? accentColor : '#555555'}
          />
          <SvgText
            x="0"
            y="44"
            textAnchor="middle"
            fill={selectedLevel === 'novice' ? accentColor : '#8E8E93'}
            fontSize="12"
            fontWeight={selectedLevel === 'novice' ? '800' : '600'}
          >
            Novato
          </SvgText>
        </G>

        {/* NÓ: INTERMEDIÁRIO (TOPO) */}
        <G transform="translate(160, 40)" onPress={() => onSelectLevel('intermediate')}>
          <Circle cx="0" cy="0" r="32" fill="transparent" />
          <Circle
            cx="0"
            cy="0"
            r="24"
            fill="#121212"
            stroke={selectedLevel === 'intermediate' ? accentColor : '#2C2C2E'}
            strokeWidth="2.5"
          />
          {/* Ícone de Alvo */}
          <Circle cx="0" cy="0" r="10" fill="none" stroke={selectedLevel === 'intermediate' ? accentColor : '#555555'} strokeWidth="2" />
          <Circle cx="0" cy="0" r="6" fill="none" stroke={selectedLevel === 'intermediate' ? accentColor : '#555555'} strokeWidth="1.5" />
          <Circle cx="0" cy="0" r="2" fill={selectedLevel === 'intermediate' ? accentColor : '#555555'} />

          <SvgText
            x="0"
            y="-34"
            textAnchor="middle"
            fill={selectedLevel === 'intermediate' ? accentColor : '#8E8E93'}
            fontSize="13"
            fontWeight={selectedLevel === 'intermediate' ? '800' : '600'}
          >
            Intermediário
          </SvgText>
        </G>

        {/* NÓ: AVANÇADO */}
        <G transform="translate(237.8, 227.8)" onPress={() => onSelectLevel('advanced')}>
          <Circle cx="0" cy="0" r="32" fill="transparent" />
          <Circle
            cx="0"
            cy="0"
            r="22"
            fill="#121212"
            stroke={selectedLevel === 'advanced' ? accentColor : '#2C2C2E'}
            strokeWidth="2.5"
          />
          <Path
            d="M 2.25,-9 L -5.25,2.25 L -0.75,2.25 L -2.25,10.5 L 6.75,-0.75 L 1.5,-0.75 Z"
            fill={selectedLevel === 'advanced' ? accentColor : '#555555'}
          />
          <SvgText
            x="0"
            y="44"
            textAnchor="middle"
            fill={selectedLevel === 'advanced' ? accentColor : '#8E8E93'}
            fontSize="12"
            fontWeight={selectedLevel === 'advanced' ? '800' : '600'}
          >
            Avançado
          </SvgText>
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
});
