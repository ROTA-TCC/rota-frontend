import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, G, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const ORANGE = '#FF9A00';
const ARC_LENGTH = 518.4;

type GoalLevel = 'novice' | 'intermediate' | 'advanced';

interface LevelData {
  id: GoalLevel;
  title: string;
  progressValue: number;
  description: string;
}

const LEVELS: Record<GoalLevel, LevelData> = {
  novice: {
    id: 'novice',
    title: 'Novato',
    progressValue: 0,
    description: 'Haverá 1 desafio com distância de 2 km. Perfeito para dar os primeiros passos com consistência.',
  },
  intermediate: {
    id: 'intermediate',
    title: 'Intermediário',
    progressValue: 0.5,
    description: 'Haverá 3 desafios com distâncias cumulativas de 5 km. Você pode redefinir isso na página de configurações.',
  },
  advanced: {
    id: 'advanced',
    title: 'Avançado',
    progressValue: 1,
    description: 'Haverá 5 desafios com distâncias cumulativas de 10 km. Ideal para quem deseja alta intensidade.',
  },
};

export default function SetGoalsScreen() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<GoalLevel>('intermediate');

  const progress = useSharedValue(0.5);

  const handleSelectLevel = (level: GoalLevel) => {
    setSelectedLevel(level);
    const target = LEVELS[level].progressValue;
    progress.value = withTiming(target, {
      duration: 350,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  };

  const animatedPathProps = useAnimatedProps(() => {
    const strokeDashoffset = ARC_LENGTH * (1 - progress.value);
    return {
      strokeDashoffset,
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Image
            source={require('../../../assets/images/background-blur.png')}
            style={[styles.glowImage, styles.topGlow]}
            resizeMode="cover"
          />
          <Image
            source={require('../../../assets/images/background-blur.png')}
            style={[styles.glowImage, styles.bottomGlow]}
            resizeMode="cover"
          />
        </View>

        <View style={styles.header}>
          <View style={styles.progressBar}>
            <View style={styles.step} />
            <View style={[styles.step, styles.activeStep]} />
            <View style={styles.step} />
          </View>

          <ThemedText style={styles.subtitle}>Metas</ThemedText>
          <ThemedText type="title" style={styles.title}>Defina metas</ThemedText>
          <ThemedText style={styles.description}>
            Defina sua meta semanal. Nós ajudaremos você a acompanhar seu progresso e a manter a motivação, escolha o nivel de dificuldade.
          </ThemedText>
        </View>

        <View style={styles.arcWrapper}>
          <Svg width="320" height="280" viewBox="0 0 320 280" fill="none">
            <Defs>
              <LinearGradient id="trackGradient" x1="82.2" y1="227.8" x2="237.8" y2="227.8" gradientUnits="userSpaceOnUse">
                <Stop offset="0%" stopColor="#4A2200" />
                <Stop offset="45%" stopColor="#1A0D00" />
                <Stop offset="100%" stopColor={ORANGE} />
              </LinearGradient>
            </Defs>

            <Path
              d="M 82.2 227.8 A 110 110 0 1 1 237.8 227.8"
              stroke="#171717"
              strokeWidth="44"
              strokeLinecap="butt"
            />

            <AnimatedPath
              d="M 82.2 227.8 A 110 110 0 1 1 237.8 227.8"
              stroke="url(#trackGradient)"
              strokeWidth="44"
              strokeLinecap="butt"
              strokeDasharray={ARC_LENGTH}
              animatedProps={animatedPathProps}
            />

            <Circle cx="63.0" cy="201.8" r="1.2" fill="#3D2100" />
            <Circle cx="52.1" cy="171.5" r="1.2" fill="#3D2100" />
            <Circle cx="50.5" cy="139.2" r="1.2" fill="#3D2100" />
            <Circle cx="58.4" cy="107.9" r="1.2" fill="#3D2100" />
            <Circle cx="75.0" cy="80.2" r="1.2" fill="#3D2100" />
            <Circle cx="98.9" cy="58.5" r="1.2" fill="#3D2100" />
            <Circle cx="128.1" cy="44.7" r="1.2" fill="#3D2100" />

            <Circle cx="196.3" cy="46.2" r="1.2" fill="#242424" />
            <Circle cx="228.6" cy="64.0" r="1.2" fill="#242424" />
            <Circle cx="253.1" cy="91.5" r="1.2" fill="#242424" />
            <Circle cx="267.2" cy="125.5" r="1.2" fill="#242424" />
            <Circle cx="269.3" cy="162.3" r="1.2" fill="#242424" />
            <Circle cx="259.1" cy="196.8" r="1.2" fill="#242424" />

            <G transform="translate(82.2, 227.8)" onPress={() => handleSelectLevel('novice')}>
              <Circle cx="0" cy="0" r="32" fill="transparent" />
              <Circle
                cx="0"
                cy="0"
                r="22"
                fill="#2A2E2D"
                stroke={selectedLevel === 'novice' ? ORANGE : 'none'}
                strokeWidth="2"
              />
              <Path
                d="M 2.25,-9 L -5.25,2.25 L -0.75,2.25 L -2.25,10.5 L 6.75,-0.75 L 1.5,-0.75 Z"
                fill={selectedLevel === 'novice' ? ORANGE : '#343837'}
              />
              <SvgText
                x="0"
                y="44"
                textAnchor="middle"
                fill={selectedLevel === 'novice' ? ORANGE : '#828282'}
                fontSize="12"
                fontWeight={selectedLevel === 'novice' ? '700' : '600'}
              >
                Novato
              </SvgText>
            </G>

            <G transform="translate(237.8, 227.8)" onPress={() => handleSelectLevel('advanced')}>
              <Circle cx="0" cy="0" r="32" fill="transparent" />
              <Circle
                cx="0"
                cy="0"
                r="22"
                fill="#2A2E2D"
                stroke={selectedLevel === 'advanced' ? ORANGE : 'none'}
                strokeWidth="2"
              />
              <Path
                d="M 2.25,-9 L -5.25,2.25 L -0.75,2.25 L -2.25,10.5 L 6.75,-0.75 L 1.5,-0.75 Z"
                fill={selectedLevel === 'advanced' ? ORANGE : '#343837'}
              />
              <SvgText
                x="0"
                y="44"
                textAnchor="middle"
                fill={selectedLevel === 'advanced' ? ORANGE : '#828282'}
                fontSize="12"
                fontWeight={selectedLevel === 'advanced' ? '700' : '600'}
              >
                Avançado
              </SvgText>
            </G>

            <G transform="translate(160, 40)" onPress={() => handleSelectLevel('intermediate')}>
              <Circle cx="0" cy="0" r="32" fill="transparent" />
              <Circle
                cx="0"
                cy="0"
                r="24"
                fill="#171717"
                stroke={ORANGE}
                strokeWidth="2"
              />
              <Circle cx="0" cy="0" r="10" fill="none" stroke={selectedLevel === 'intermediate' ? ORANGE : '#555555'} strokeWidth="2" />
              <Circle cx="0" cy="0" r="6" fill="none" stroke={selectedLevel === 'intermediate' ? ORANGE : '#555555'} strokeWidth="1.5" />
              <Circle cx="0" cy="0" r="2" fill={selectedLevel === 'intermediate' ? ORANGE : '#555555'} />

              <SvgText
                x="0"
                y="-32"
                textAnchor="middle"
                fill={ORANGE}
                fontSize="13"
                fontWeight="700"
              >
                Intermediário
              </SvgText>
            </G>
          </Svg>
        </View>

        <Animated.View key={selectedLevel} entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)} style={styles.infoBox}>
          <View style={styles.infoIcon}>
            <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <Circle cx="12" cy="12" r="10" stroke={ORANGE} strokeWidth="2" />
              <Circle cx="12" cy="12" r="6" stroke={ORANGE} strokeWidth="2" />
              <Circle cx="12" cy="12" r="2" fill={ORANGE} />
            </Svg>
          </View>
          <ThemedText style={styles.infoText}>
            <ThemedText style={styles.infoHighlight}>{LEVELS[selectedLevel].title}: </ThemedText>
            {LEVELS[selectedLevel].description}
          </ThemedText>
        </Animated.View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.btnNext} onPress={() => router.push('/')} activeOpacity={0.85}>
            <ThemedText style={styles.btnNextText}>Próximo</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSkip} onPress={() => router.push('/')} activeOpacity={0.7}>
            <ThemedText style={styles.btnSkipText}>Pular</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 40,
    backgroundColor: '#070707',
  },
  glowImage: {
    position: 'absolute',
    width: 320,
    height: 320,
    opacity: 0.4,
  },
  topGlow: {
    top: -80,
    right: -80,
  },
  bottomGlow: {
    bottom: -80,
    left: -80,
    transform: [{ rotate: '180deg' }],
  },
  header: {
    marginBottom: 10,
  },
  progressBar: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 24,
  },
  step: {
    height: 3,
    borderRadius: 2,
    backgroundColor: '#2A2A2A',
    width: 12,
  },
  activeStep: {
    width: 24,
    backgroundColor: ORANGE,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
    marginBottom: 6,
    color: ORANGE,
  },
  title: {
    marginBottom: 16,
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  description: {
    color: '#828282',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 20,
  },
  arcWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  infoBox: {
    backgroundColor: '#151515',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 'auto',
    marginBottom: 24,
  },
  infoIcon: {
    marginTop: 2,
  },
  infoText: {
    color: '#828282',
    fontSize: 13,
    lineHeight: 19.5,
    fontWeight: '500',
    flex: 1,
  },
  infoHighlight: {
    color: ORANGE,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    gap: 16,
  },
  btnNext: {
    backgroundColor: ORANGE,
    height: 56,
    paddingHorizontal: 48,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  btnNextText: {
    color: '#0A0F09',
    fontWeight: '700',
    fontSize: 15,
  },
  btnSkip: {
    padding: 6,
  },
  btnSkipText: {
    color: ORANGE,
    fontWeight: '600',
    fontSize: 14,
  },
});
