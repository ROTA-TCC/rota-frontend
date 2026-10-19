import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';

import { OnboardingFooter } from '@/components/auth/OnboardingFooter';
import { GoalArcPicker } from '@/components/goals/GoalArcPicker';
import { GoalLevelInfo } from '@/components/goals/GoalLevelInfo';
import { GOAL_LEVEL_API, GOAL_LEVELS, type GoalLevel } from '@/components/goals/goalArcData';
import { ThemedText } from '@/components/themed-text';
import { GlowBackground } from '@/components/ui/GlowBackground';
import { ProgressSteps } from '@/components/ui/ProgressSteps';
import { useProfileSetup } from '@/providers/ProfileSetupProvider';
import { colors, spacing, typography } from '@/theme';

export default function SetGoalsScreen() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<GoalLevel>('intermediate');
  const { updateProfileData } = useProfileSetup();

  const accentColor = colors.primary;
  const levelData = GOAL_LEVELS[selectedLevel];

  const handleNext = () => {
    updateProfileData({ nivelDificuldade: GOAL_LEVEL_API[selectedLevel] });
    router.push('/privacy-zone');
  };

  const handleSkip = () => router.push('/privacy-zone');

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.container}>
        <GlowBackground offset={80} opacity={0.35} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces
        >
          <View style={styles.header}>
            <ProgressSteps activeStep={1} accentColor={accentColor} />

            <ThemedText style={[styles.subtitle, { color: accentColor }]}>Metas</ThemedText>
            <ThemedText style={styles.title}>Defina metas</ThemedText>
            <ThemedText style={styles.description}>
              Defina sua meta semanal. Nós ajudaremos você a acompanhar seu progresso e a manter a
              motivação, escolha o nível de dificuldade.
            </ThemedText>
          </View>

          <GoalArcPicker
            selectedLevel={selectedLevel}
            onSelectLevel={setSelectedLevel}
            accentColor={accentColor}
          />

          <GoalLevelInfo
            selectedLevel={selectedLevel}
            title={levelData.title}
            description={levelData.description}
            accentColor={accentColor}
          />

          <View style={styles.footer}>
            <OnboardingFooter
              onNext={handleNext}
              onSkip={handleSkip}
              accentColor={accentColor}
              fullWidth
            />
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xxxl,
    paddingTop: 60,
    paddingBottom: spacing.xxxl,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.sizes.label,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.3,
    marginBottom: spacing.xs,
  },
  title: {
    marginBottom: spacing.md,
    fontSize: 30,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  description: {
    color: colors.textSecondary,
    fontSize: typography.sizes.label,
    fontWeight: typography.weights.medium,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
});
