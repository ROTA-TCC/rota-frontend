import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, Image } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Svg, { Path, Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedPath = Animated.createAnimatedComponent(Path);

// Configurações do Arco SVG
const ARC_LENGTH = 518.4; // Comprimento total da trilha do arco
const ORANGE_ACCENT = '#FF9A00';

type GoalLevel = 'novice' | 'intermediate' | 'advanced';

interface LevelInfo {
  id: GoalLevel;
  title: string;
  progressValue: number; // 0 = Novato, 0.5 = Intermediário, 1 = Avançado
  description: string;
}

const LEVELS_DATA: Record<GoalLevel, LevelInfo> = {
  novice: {
    id: 'novice',
    title: 'Novato',
    progressValue: 0,
    description: 'Haverá 1 desafio semanal com distância de 2 km. Perfeito para quem está dando os primeiros passos.',
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
    description: 'Haverá 5 desafios com distâncias cumulativas de 10 km. Ideal para quem deseja superar seus limites diariamente.',
  },
};

export default function SetGoalsScreen() {
  const [selectedLevel, setSelectedLevel] = useState<GoalLevel>('intermediate');

  // Valor compartilhado de animação do progresso (0 a 1)
  const progress = useSharedValue(0.5);

  const handleSelectLevel = (level: GoalLevel) => {
    setSelectedLevel(level);
    progress.value = withSpring(LEVELS_DATA[level].progressValue, {
      damping: 18,
      stiffness: 90,
    });
  };

  // Animação da trilha preenchida (strokeDashoffset)
  const animatedPathProps = useAnimatedProps(() => {
    const strokeDashoffset = ARC_LENGTH * (1 - progress.value);
    return {
      strokeDashoffset,
    };
  });

  // Estilos de animação para os nós
  const getScaleStyle = (level: GoalLevel) => {
    return useAnimatedStyle(() => {
      const isSelected = selectedLevel === level;
      return {
        transform: [
          {
            scale: withSpring(isSelected ? 1.15 : 1, {
              damping: 15,
            }),
          },
        ],
      };
    });
  };

  const noviceScale = getScaleStyle('novice');
  const intermediateScale = getScaleStyle('intermediate');
  const advancedScale = getScaleStyle('advanced');

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        {/* Camada de Blur de Fundo */}
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

        {/* --- HEADER --- */}
        <View style={styles.header}>
          {/* Progress Bar (Primeiro Inativo, Segundo Ativo) */}
          <View style={styles.progressBar}>
            <View style={styles.step} />
            <View style={[styles.step, styles.activeStep, { backgroundColor: ORANGE_ACCENT }]} />
            <View style={styles.step} />
          </View>

          <ThemedText style={[styles.subtitle, { color: ORANGE_ACCENT }]}>Metas</ThemedText>
          <ThemedText type="title" style={styles.title}>Defina metas</ThemedText>
          <ThemedText style={styles.description}>
            Defina sua meta semanal. Nós ajudaremos você a acompanhar seu progresso e a manter a motivação, escolha o nível de dificuldade.
          </ThemedText>
        </View>

        {/* --- DIAL ARCO SVG INTERATIVO --- */}
        <View style={styles.arcWrapper}>
          <Svg width="320" height="280" viewBox="0 0 320 280" fill="none">
            <Defs>
              <LinearGradient id="orangeGradient" x1="82.2" y1="227.8" x2="237.8" y2="227.8" gradientUnits="userSpaceOnUse">
                <Stop offset="0%" stopColor="#4A2200" />
                <Stop offset="50%" stopColor="#804500" />
                <Stop offset="100%" stopColor={ORANGE_ACCENT} />
              </LinearGradient>
            </Defs>

            {/* Trilha Base Cinza Escura */}
            <Path
              d="M 82.2 227.8 A 110 110 0 1 1 237.8 227.8"
              stroke="#171717"
              strokeWidth="44"
              strokeLinecap="butt"
            />

            {/* Trilha Preenchida Animada em Laranja */}
            <AnimatedPath
              d="M 82.2 227.8 A 110 110 0 1 1 237.8 227.8"
              stroke="url(#orangeGradient)"
              strokeWidth="44"
              strokeLinecap="butt"
              strokeDasharray={ARC_LENGTH}
              animatedProps={animatedPathProps}
            />

            {/* Pontos Decorativos do Lado Esquerdo */}
            <Circle cx="63.0" cy="201.8" r="1.5" fill="#4A2200" />
            <Circle cx="52.1" cy="171.5" r="1.5" fill="#4A2200" />
            <Circle cx="50.5" cy="139.2" r="1.5" fill="#4A2200" />
            <Circle cx="58.4" cy="107.9" r="1.5" fill="#4A2200" />
            <Circle cx="75.0" cy="80.2" r="1.5" fill="#4A2200" />
            <Circle cx="98.9" cy="58.5" r="1.5" fill="#4A2200" />
            <Circle cx="128.1" cy="44.7" r="1.5" fill="#4A2200" />

            {/* Pontos Decorativos do Lado Direito */}
            <Circle cx="196.3" cy="46.2" r="1.5" fill="#242424" />
            <Circle cx="228.6" cy="64.0" r="1.5" fill="#242424" />
            <Circle cx="253.1" cy="91.5" r="1.5" fill="#242424" />
            <Circle cx="267.2" cy="125.5" r="1.5" fill="#242424" />
            <Circle cx="269.3" cy="162.3" r="1.5" fill="#242424" />
            <Circle cx="259.1" cy="196.8" r="1.5" fill="#242424" />
          </Svg>

          {/* BOTÃO NÓ: Novato (Esquerda) */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleSelectLevel('novice')}
            style={[styles.nodeTouchable, { left: 38, bottom: 8 }]}
          >
            <Animated.View style={[styles.nodeCircle, noviceScale, selectedLevel === 'novice' && styles.nodeSelected]}>
              {/* Ícone de Raio */}
              <Svg width="16" height="16" viewBox="0 0 24 24" fill={selectedLevel === 'novice' ? ORANGE_ACCENT : '#555555'}>
                <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </Svg>
            </Animated.View>
            <ThemedText style={[styles.nodeText, selectedLevel === 'novice' && { color: ORANGE_ACCENT, fontWeight: '700' }]}>
              Novato
            </ThemedText>
          </TouchableOpacity>

          {/* BOTÃO NÓ: Intermediário (Topo Central) */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleSelectLevel('intermediate')}
            style={[styles.nodeTouchable, { top: -10, left: '50%', transform: [{ translateX: -30 }] }]}
          >
            <Animated.View
              style={[
                styles.nodeCircle,
                styles.intermediateNode,
                intermediateScale,
                selectedLevel === 'intermediate' && styles.nodeSelected,
              ]}
            >
              {/* Ícone de Alvo / Target requested */}
              <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={selectedLevel === 'intermediate' ? ORANGE_ACCENT : '#777777'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <Circle cx="12" cy="12" r="10" />
                <Circle cx="12" cy="12" r="6" />
                <Circle cx="12" cy="12" r="2" />
              </Svg>
            </Animated.View>
            <ThemedText style={[styles.nodeText, selectedLevel === 'intermediate' && { color: ORANGE_ACCENT, fontWeight: '700' }]}>
              Intermediário
            </ThemedText>
          </TouchableOpacity>

          {/* BOTÃO NÓ: Avançado (Direita) */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleSelectLevel('advanced')}
            style={[styles.nodeTouchable, { right: 38, bottom: 8 }]}
          >
            <Animated.View style={[styles.nodeCircle, advancedScale, selectedLevel === 'advanced' && styles.nodeSelected]}>
              {/* Ícone de Fogo/Chama */}
              <Svg width="18" height="18" viewBox="0 0 24 24" fill={selectedLevel === 'advanced' ? ORANGE_ACCENT : '#555555'}>
                <Path d="M12 23c4.97 0 9-3.58 9-8 0-4.19-3.23-7.6-7.38-7.95C12.82 8.61 12 10.23 12 12c0-3.5-2.5-6.5-5-8.5C6.18 5.75 5 8.2 5 11c0 2.5 1 4.5 2.5 6 1.13-1.87 2.38-3 4.5-3-1 2 0 4 0 4 1.5 0 3.5 1 3.5 3z" />
              </Svg>
            </Animated.View>
            <ThemedText style={[styles.nodeText, selectedLevel === 'advanced' && { color: ORANGE_ACCENT, fontWeight: '700' }]}>
              Avançado
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* --- CAIXA DE INFORMAÇÕES DINÂMICA --- */}
        <Animated.View key={selectedLevel} entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)} style={styles.infoBox}>
          <View style={styles.infoIcon}>
            <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ORANGE_ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <Circle cx="12" cy="12" r="10" />
              <Circle cx="12" cy="12" r="6" />
              <Circle cx="12" cy="12" r="2" />
            </Svg>
          </View>
          <ThemedText style={styles.infoText}>
            <ThemedText style={[styles.infoHighlight, { color: ORANGE_ACCENT }]}>
              {LEVELS_DATA[selectedLevel].title}:{' '}
            </ThemedText>
            {LEVELS_DATA[selectedLevel].description}
          </ThemedText>
        </Animated.View>

        {/* --- FOOTER --- */}
        <View style={styles.footer}>
          <TouchableOpacity style={[styles.btnNext, { backgroundColor: ORANGE_ACCENT }]} activeOpacity={0.85}>
            <ThemedText style={styles.btnNextText}>Próximo</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSkip} activeOpacity={0.7}>
            <ThemedText style={[styles.btnSkipText, { color: ORANGE_ACCENT }]}>Pular</ThemedText>
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
    top: -60,
    right: -60,
  },
  bottomGlow: {
    bottom: -60,
    left: -60,
    transform: [{ rotate: '180deg' }],
  },
  header: {
    marginBottom: 20,
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
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  title: {
    marginBottom: 12,
    fontSize: 32,
    fontWeight: '700',
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
    height: 250,
    position: 'relative',
    marginVertical: 10,
  },
  nodeTouchable: {
    position: 'absolute',
    alignItems: 'center',
    width: 60,
    zIndex: 10,
  },
  nodeCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2A2E2D',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#171717',
  },
  intermediateNode: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#171717',
    borderWidth: 2,
    borderColor: ORANGE_ACCENT, // Borda Laranja no nó intermediário
  },
  nodeSelected: {
    borderColor: ORANGE_ACCENT,
    shadowColor: ORANGE_ACCENT,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  nodeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#828282',
    marginTop: 6,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#151515',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 'auto',
    marginBottom: 20,
  },
  infoIcon: {
    marginTop: 2,
  },
  infoText: {
    color: '#828282',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    flex: 1,
  },
  infoHighlight: {
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    gap: 14,
  },
  btnNext: {
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
    padding: 8,
  },
  btnSkipText: {
    fontWeight: '600',
    fontSize: 14,
  },
});
