import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import GoalArcPicker, { GoalLevel } from '@/components/GoalArcPicker';

const ORANGE = '#FF8C00';

interface LevelData {
  id: GoalLevel;
  title: string;
  description: string;
}

const LEVELS: Record<GoalLevel, LevelData> = {
  novice: {
    id: 'novice',
    title: 'Novato',
    description: 'Haverá 1 desafio com distância de 2 km. Perfeito para dar os primeiros passos com consistência.',
  },
  intermediate: {
    id: 'intermediate',
    title: 'Intermediário',
    description: 'Haverá 3 desafios com distâncias cumulativas de 5 km. Você pode redefinir isso na página de configurações.',
  },
  advanced: {
    id: 'advanced',
    title: 'Avançado',
    description: 'Haverá 5 desafios com distâncias cumulativas de 10 km. Ideal para quem deseja alta intensidade.',
  },
};

export default function SetGoalsScreen() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<GoalLevel>('intermediate');

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
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

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          <View style={styles.header}>
            <View style={styles.progressBar}>
              <View style={styles.step} />
              <View style={[styles.step, styles.activeStep]} />
              <View style={styles.step} />
            </View>

            <Text style={styles.subtitle}>Metas</Text>
            <Text style={styles.title}>Defina metas</Text>
            <Text style={styles.description}>
              Defina sua meta semanal. Nós ajudaremos você a acompanhar seu progresso e a manter a motivação, escolha o nível de dificuldade.
            </Text>
          </View>

          <GoalArcPicker
            selectedLevel={selectedLevel}
            onSelectLevel={setSelectedLevel}
            accentColor={ORANGE}
          />

          <Animated.View
            key={selectedLevel}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
            style={styles.infoBox}
          >
            <View style={styles.infoIcon}>
              <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="10" stroke={ORANGE} strokeWidth="2" />
                <Circle cx="12" cy="12" r="6" stroke={ORANGE} strokeWidth="2" />
                <Circle cx="12" cy="12" r="2" fill={ORANGE} />
              </Svg>
            </View>
            <Text style={styles.infoText}>
              <Text style={styles.infoHighlight}>{LEVELS[selectedLevel].title}: </Text>
              {LEVELS[selectedLevel].description}
            </Text>
          </Animated.View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.btnNext}
              onPress={() => router.push('/privacy-zone')}
              activeOpacity={0.85}
            >
              <Text style={styles.btnNextText}>Próximo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnSkip}
              onPress={() => router.push('/privacy-zone')}
              activeOpacity={0.7}
            >
              <Text style={styles.btnSkipText}>Pular</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070707',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  glowImage: {
    position: 'absolute',
    width: 320,
    height: 320,
    opacity: 0.35,
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
    marginBottom: 8,
  },
  progressBar: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 20,
  },
  step: {
    height: 3,
    borderRadius: 2,
    backgroundColor: '#2A2A2D',
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
    marginBottom: 4,
    color: ORANGE,
  },
  title: {
    marginBottom: 12,
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  description: {
    color: '#8E8E93',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: '#141416',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#242426',
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginVertical: 16,
  },
  infoIcon: {
    marginTop: 2,
  },
  infoText: {
    color: '#8E8E93',
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
    gap: 14,
    marginTop: 8,
  },
  btnNext: {
    backgroundColor: ORANGE,
    height: 54,
    borderRadius: 27,
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
