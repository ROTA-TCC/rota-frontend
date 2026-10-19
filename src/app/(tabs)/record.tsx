import { useRouter } from 'expo-router';
import { Alert, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GoalProgressCard } from '@/components/Record/GoalProgressCard';
import { SportCard } from '@/components/Record/SportCard';
import { SPORT_ACTIVITIES } from '@/components/Record/recordSports';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/Button';
import { colors, spacing, typography } from '@/theme';

const GOAL_PROGRESS = 0.6;
const GOAL_REMAINING_LABEL = '14 treinos restantes';

export default function RecordScreen() {
  const router = useRouter();

  const handleStartActivity = (type: string) => {
    router.push(`/run/active-run?type=${type}`);
  };

  const handleMoreSports = () => {
    Alert.alert('Mais esportes', 'Novos esportes estarão disponíveis em breve.');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.backgroundDeep} />
      <View style={styles.header}>
        <ThemedText style={styles.title}>Gravar</ThemedText>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <GoalProgressCard
          title="Progresso da Meta"
          subtitle={GOAL_REMAINING_LABEL}
          progress={GOAL_PROGRESS}
        />
        <ThemedText style={styles.sectionLabel}>Atividades</ThemedText>
        {SPORT_ACTIVITIES.map((activity) => (
          <SportCard
            key={activity.type}
            icon={activity.icon}
            title={activity.title}
            subtitle={activity.subtitle}
            onStart={() => handleStartActivity(activity.type)}
          />
        ))}
        <Button
          label="Mais esportes"
          variant="outline"
          fullWidth
          onPress={handleMoreSports}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundDeep,
  },
  header: {
    paddingTop: spacing.xxxl,
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: typography.sizes.displayXl,
    fontWeight: typography.weights.heavy,
    letterSpacing: -0.6,
  },
  content: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxl,
    gap: spacing.xl,
  },
  sectionLabel: {
    color: colors.textNeutral,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginTop: spacing.xs,
  },
});
