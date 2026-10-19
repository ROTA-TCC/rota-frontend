import { Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { colors, spacing, typography } from '@/theme';

interface SportItem {
  id: string;
  name: string;
  iconName: keyof typeof FontAwesome5.glyphMap;
  rotate?: boolean;
}

const SPORTS: SportItem[] = [
  { id: 'corrida', name: 'Corrida', iconName: 'shoe-prints', rotate: true },
  { id: 'esteira', name: 'Esteira', iconName: 'running' },
];

interface SportDropdownProps {
  activeSport: string;
  onSelect: (sportId: string) => void;
  onClose: () => void;
}

export function SportDropdown({ activeSport, onSelect, onClose }: SportDropdownProps) {
  return (
    <Modal visible transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <View style={styles.dropdown}>
        {SPORTS.map((sport) => {
          const isActive = activeSport === sport.id;
          const iconColor = isActive ? colors.primaryAction : colors.textIcon;

          return (
            <TouchableOpacity
              key={sport.id}
              style={[styles.sportItem, isActive && styles.activeItem]}
              onPress={() => {
                onSelect(sport.id);
                onClose();
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <View style={styles.sportIcon}>
                <FontAwesome5
                  name={sport.iconName}
                  size={16}
                  color={iconColor}
                  style={sport.rotate ? styles.rotatedIcon : undefined}
                />
              </View>
              <ThemedText style={[styles.sportName, isActive && styles.activeText]}>
                {sport.name}
              </ThemedText>
              {isActive && (
                <Ionicons name="checkmark" size={14} color={colors.primaryAction} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
  },
  dropdown: {
    position: 'absolute',
    top: 80,
    left: spacing.xl,
    width: 190,
    backgroundColor: colors.surfaceMenuItem,
    borderRadius: 14,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderMedium,
    zIndex: 20,
  },
  sportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: 10,
  },
  activeItem: {
    backgroundColor: colors.selectedHighlight,
  },
  sportIcon: {
    width: 24,
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  rotatedIcon: {
    transform: [{ rotate: '-30deg' }],
  },
  sportName: {
    color: colors.text,
    fontSize: typography.sizes.label,
    fontWeight: typography.weights.bold,
    flex: 1,
  },
  activeText: {
    color: colors.primaryAction,
  },
});
