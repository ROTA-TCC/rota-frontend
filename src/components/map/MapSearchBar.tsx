import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

import { SportDropdown } from '@/components/map/SportDropdown';
import { ThemedText } from '@/components/themed-text';
import { colors, radius, shadows, spacing, typography } from '@/theme';

export function MapSearchBar() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [activeSport, setActiveSport] = useState('corrida');

  return (
    <View>
      <View style={styles.searchBar}>
        <TouchableOpacity
          style={styles.brandSection}
          onPress={() => setDropdownVisible((prev) => !prev)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Selecionar esporte"
        >
          <FontAwesome5
            name={activeSport === 'corrida' ? 'shoe-prints' : 'running'}
            size={18}
            color={colors.primaryAction}
            style={activeSport === 'corrida' ? styles.shoeIcon : undefined}
          />
          <Ionicons
            name={dropdownVisible ? 'chevron-up' : 'chevron-down'}
            size={11}
            color={colors.text}
          />
        </TouchableOpacity>

        <ThemedText style={styles.searchText}>Procurar locais</ThemedText>

        <TouchableOpacity
          style={styles.savedBtn}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Locais salvos"
        >
          <Ionicons name="bookmark-outline" size={16} color={colors.text} />
          <ThemedText style={styles.savedText}>Salvo</ThemedText>
        </TouchableOpacity>
      </View>

      {dropdownVisible && (
        <SportDropdown
          activeSport={activeSport}
          onSelect={setActiveSport}
          onClose={() => setDropdownVisible(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: colors.surfaceOverlay,
    height: 52,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderMedium,
    ...shadows.raised,
  },
  brandSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingRight: 14,
    borderRightWidth: 1.5,
    borderRightColor: colors.borderStrong,
    marginRight: 14,
  },
  shoeIcon: {
    transform: [{ rotate: '-30deg' }],
  },
  searchText: {
    color: colors.textPlaceholder,
    fontSize: typography.sizes.label,
    fontWeight: typography.weights.semibold,
    flex: 1,
  },
  savedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  savedText: {
    color: colors.text,
    fontSize: typography.sizes.bodyLg,
    fontWeight: typography.weights.bold,
  },
});
