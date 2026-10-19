import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ProgressSteps } from '@/components/ui/ProgressSteps';
import { colors, spacing, typography } from '@/theme';

export function PrivacyHeader() {
  return (
    <View style={styles.header}>
      <ProgressSteps activeStep={2} accentColor={colors.primary} />

      <ThemedText style={styles.subtitle}>Privacidade</ThemedText>
      <ThemedText style={styles.title}>Ocultar região</ThemedText>
      <ThemedText style={styles.description}>
        Defina uma área no mapa para manter suas atividades privadas. Trajetos iniciados ou
        finalizados dentro desta zona não serão exibidos publicamente.
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.xl,
  },
  subtitle: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.3,
    marginBottom: spacing.xs,
    color: colors.primary,
  },
  title: {
    marginBottom: spacing.lg,
    fontSize: typography.sizes.displayXl,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  description: {
    color: colors.textSecondary,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium,
    lineHeight: typography.lineHeights.body,
  },
});
