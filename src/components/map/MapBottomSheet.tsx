import { Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { colors, radius, spacing, typography } from '@/theme';

interface MapOption {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

const OPTIONS: MapOption[] = [
  {
    id: 'rotas',
    title: 'Rotas',
    description: 'Recomendações de rotas baseadas em dados da comunidade.',
    icon: 'map-marker-path',
  },
  {
    id: 'mapa',
    title: 'Somente mapa',
    description: 'Explore os heatmaps, pontos de interesse e outros detalhes em uma tela limpa.',
    icon: 'map-marker-outline',
  },
];

interface MapBottomSheetProps {
  activeOption: string;
  onSelect: (optionId: string) => void;
  onClose: () => void;
}

export function MapBottomSheet({ activeOption, onSelect, onClose }: MapBottomSheetProps) {
  return (
    <Modal visible transparent animationType="slide">
      <View style={styles.modalContainer}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={styles.bottomSheet}>
          <View style={styles.sheetHeader}>
            <ThemedText style={styles.headerTitle}>Escolha recursos no mapa</ThemedText>
            <TouchableOpacity
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Fechar"
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <View style={styles.optionList}>
            {OPTIONS.map((option) => {
              const isSelected = activeOption === option.id;

              return (
                <TouchableOpacity
                  key={option.id}
                  style={styles.optionItem}
                  onPress={() => onSelect(option.id)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                >
                  <View style={styles.optionIcon}>
                    <MaterialCommunityIcons name={option.icon} size={24} color={colors.text} />
                  </View>
                  <View style={styles.optionContent}>
                    <ThemedText style={styles.optionTitle}>{option.title}</ThemedText>
                    <ThemedText style={styles.optionDesc}>{option.description}</ThemedText>
                  </View>
                  <View style={[styles.radioBtn, isSelected && styles.selectedRadio]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlay,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
  },
  bottomSheet: {
    backgroundColor: colors.surfaceModal,
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
    paddingBottom: spacing.huge,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xxl,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderStrong,
  },
  headerTitle: {
    color: colors.text,
    fontSize: typography.sizes.titleLg,
    fontWeight: typography.weights.heavy,
  },
  optionList: {
    padding: spacing.md,
  },
  optionItem: {
    flexDirection: 'row',
    padding: spacing.xxl,
    alignItems: 'flex-start',
  },
  optionIcon: {
    width: 24,
    marginRight: spacing.xxl,
    alignItems: 'center',
  },
  optionContent: {
    flex: 1,
    marginRight: spacing.xxl,
  },
  optionTitle: {
    color: colors.text,
    fontSize: typography.sizes.input,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.sm,
  },
  optionDesc: {
    color: colors.textDesc,
    fontSize: typography.sizes.bodyLg,
    fontWeight: typography.weights.medium,
    lineHeight: 20,
  },
  radioBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.text,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadio: {
    borderColor: colors.primaryAction,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primaryAction,
  },
});
