import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

export function HeaderSearch() {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
      <TextInput
        style={styles.input}
        placeholder="Buscar atividade..."
        placeholderTextColor={colors.textSecondary}
      />
      <TouchableOpacity activeOpacity={0.7} accessibilityRole="button" accessibilityLabel="Filtros">
        <Ionicons name="options-outline" size={18} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.xxl,
    paddingHorizontal: spacing.xl,
    height: 48,
    gap: spacing.lg,
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: typography.sizes.label,
    fontWeight: typography.weights.medium,
  },
});
