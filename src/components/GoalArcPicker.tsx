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
const DEFAULT_ACCENT = '#FF8C00'; // Laranja Vibrante Base

// Coordenadas das bolinhas esquerdas e direitas
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

// Cores ativadas em degradê profundo (Laranja queimado escuro até o laranja vibrante)
const LEFT_ACTIVE_COLORS = ['#6A3815', '#864312', '#A24F0F', '#BE5A0C', '#DA6509', '#F07105', '#FF7E01'];
const RIGHT_ACTIVE_COLORS = ['#FF8200', '#FF8400', '#FF8600', '#FF8800', '#FF8A00', DEFAULT_ACCENT];

const INACTIVE_DOT_COLOR = '#555555'; // Cinza muito mais visível

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
      duration: 450,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [selectedLevel]);

  const animatedPathProps = useAnimatedProps(() => {
    const strokeDashoffset = ARC_LENGTH * (1 - progress.value);
    return { strokeDashoffset };
  });

  const isLeftActive = selectedLevel === 'intermediate' || selectedLevel === 'advanced';
  const isRightActive = selectedLevel === 'advanced';

  return (
    <View style={styles.container}>
      <Svg width="320" height="280" viewBox="0 0 320 280" fill="none">
        <Defs>
          {/* GRADIENTES DINÂMICOS: Eles se comportam de forma diferente com base na seleção
              garantindo que a ponta da barra seja sempre o laranja máximo, sem usar amarelos fracos. */}
          
          {selectedLevel === 'intermediate' && (
            <LinearGradient id="arcGradient" x1="50" y1="0" x2="270" y2="0" gradientUnits="userSpaceOnUse">
              <Stop offset="0%" stopColor={INACTIVE_DOT_COLOR} /> 
              <Stop offset="10%" stopColor="#7A3A10" />     {/* Transição rápida para um laranja/marrom profundo */}
              <Stop offset="30%" stopColor="#C25600" />     {/* Laranja queimado no meio do trajeto */}
              <Stop offset="50%" stopColor={accentColor} /> {/* Finaliza no topo com laranja puro */}
              <Stop offset="100%" stopColor={accentColor} />
            </LinearGradient>
          )}

          {selectedLevel === 'advanced' && (
            <LinearGradient id="arcGradient" x1="50" y1="0" x2="270" y2="0" gradientUnits="userSpaceOnUse">
              <Stop offset="0%" stopColor={INACTIVE_DOT_COLOR} />
              <Stop offset="8%" stopColor="#7A3A10" />      {/* Cinza dura apenas na saída do novato */}
              <Stop offset="35%" stopColor="#A84200" />     {/* Escurece lindamente o lado esquerdo */}
              <Stop offset="70%" stopColor="#D66200" />     {/* Esquenta no lado direito */}
              <Stop offset="100%" stopColor={accentColor} />{/* Laranja puro no final do avançado */}
            </LinearGradient>
          )}

          {selectedLevel === 'novice' && (
            <LinearGradient id="arcGradient" x1="50" y1="0" x2="270" y2="0" gradientUnits="userSpaceOnUse">
              <Stop offset="0%" stopColor={INACTIVE_DOT_COLOR} />
              <Stop offset="100%" stopColor={INACTIVE_DOT_COLOR} />
            </LinearGradient>
          )}
        </Defs>

        {/* Trilha Fundo Escura (Bem visível) */}
        <Path
          d="M 82.2 227.8 A 110 110 0 1 1 237.8 227.8"
          stroke="#1E1E1E"
          strokeWidth="44"
          strokeLinecap="butt"
        />

        {/* Trilha Preenchida com Animação do Gradiente */}
        <AnimatedPath
          d="M 82.2 227.8 A 110 110 0 1 1 237.8 227.8"
          stroke="url(#arcGradient)"
          strokeWidth="44"
          strokeLinecap="butt"
          strokeDasharray={ARC_LENGTH}
          animatedProps={animatedPathProps}
        />

        {/* BOLINHAS ESQUERDAS - Seguem o gradiente visual individualmente */}
        {LEFT_DOTS.map((dot, index) => (
          <Circle
            key={`left-dot-${index}`}
            cx={dot.cx}
            cy={dot.cy}
            r={isLeftActive ? 2 : 1.5}
            fill={isLeftActive ? LEFT_ACTIVE_COLORS[index] : INACTIVE_DOT_COLOR}
          />
        ))}

        {/* BOLINHAS DIREITAS - Seguem o gradiente visual final */}
        {RIGHT_DOTS.map((dot, index) => (
          <Circle
            key={`right-dot-${index}`}
            cx={dot.cx}
            cy={dot.cy}
            r={isRightActive ? 2 : 1.5}
            fill={isRightActive ? RIGHT_ACTIVE_COLORS[index] : INACTIVE_DOT_COLOR}
          />
        ))}

        {/* NÓ: NOVATO */}
        <G transform="translate(82.2, 227.8)" onPress={() => onSelectLevel('novice')}>
          <Circle cx="0" cy="0" r="32" fill="transparent" />
          <Circle
            cx="0"
            cy="0"
            r="22"
            fill="#161616"
            stroke={selectedLevel === 'novice' ? accentColor : '#4A4A4A'}
            strokeWidth="2.5"
          />
          <Path
            d="M 2.25,-9 L -5.25,2.25 L -0.75,2.25 L -2.25,10.5 L 6.75,-0.75 L 1.5,-0.75 Z"
            fill={selectedLevel === 'novice' ? accentColor : '#666666'}
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

        {/* NÓ: INTERMEDIÁRIO */}
        <G transform="translate(160, 40)" onPress={() => onSelectLevel('intermediate')}>
          <Circle cx="0" cy="0" r="32" fill="transparent" />
          <Circle
            cx="0"
            cy="0"
            r="24"
            fill="#161616"
            stroke={selectedLevel === 'intermediate' ? accentColor : '#4A4A4A'}
            strokeWidth="2.5"
          />
          <Circle cx="0" cy="0" r="10" fill="none" stroke={selectedLevel === 'intermediate' ? accentColor : '#666666'} strokeWidth="2" />
          <Circle cx="0" cy="0" r="6" fill="none" stroke={selectedLevel === 'intermediate' ? accentColor : '#666666'} strokeWidth="1.5" />
          <Circle cx="0" cy="0" r="2" fill={selectedLevel === 'intermediate' ? accentColor : '#666666'} />

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
            fill="#161616"
            stroke={selectedLevel === 'advanced' ? accentColor : '#4A4A4A'}
            strokeWidth="2.5"
          />
          <Path
            d="M 2.25,-9 L -5.25,2.25 L -0.75,2.25 L -2.25,10.5 L 6.75,-0.75 L 1.5,-0.75 Z"
            fill={selectedLevel === 'advanced' ? accentColor : '#666666'}
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
