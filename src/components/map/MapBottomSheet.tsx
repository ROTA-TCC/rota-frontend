import React, { useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useMapColors, type MapPalette } from '@/constants/mapTheme';

interface MapOption {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const options: MapOption[] = [
  { id: 'rotas', title: 'Rotas', description: 'Recomendações de rotas baseadas em dados da comunidade.', icon: 'map-marker-path' },
  { id: 'mapa', title: 'Somente mapa', description: 'Explore os heatmaps, pontos de interesse e outros detalhes em uma tela limpa.', icon: 'map-marker-outline' },
];

interface MapBottomSheetProps {
  activeOption: string;
  onSelect: (optionId: string) => void;
  onClose: () => void;
}

export const MapBottomSheet = ({ activeOption, onSelect, onClose }: MapBottomSheetProps) => {
  const colors = useMapColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal visible={true} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={styles.bottomSheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.headerTitle}>Escolha recursos no mapa</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
          <View style={styles.optionList}>
            {options.map((option) => (
              <TouchableOpacity key={option.id} style={styles.optionItem} onPress={() => onSelect(option.id)}>
                <View style={styles.optionIcon}>
                  <MaterialCommunityIcons name={option.icon as any} size={24} color={colors.textPrimary} />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionDesc}>{option.description}</Text>
                </View>
                <View style={[styles.radioBtn, activeOption === option.id && styles.selectedRadio]}>
                  {activeOption === option.id && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (colors: MapPalette) =>
  StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: colors.overlay,
    },
    overlay: {
      ...StyleSheet.absoluteFill,
    },
    bottomSheet: {
      backgroundColor: colors.surfaceStrong,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      paddingBottom: 32,
    },
    sheetHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '800' },
    optionList: { padding: 8 },
    optionItem: { flexDirection: 'row', padding: 20, alignItems: 'flex-start' },
    optionIcon: { width: 24, marginRight: 20, alignItems: 'center' },
    optionContent: { flex: 1, marginRight: 20 },
    optionTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: '600', marginBottom: 6 },
    optionDesc: { color: colors.textSecondary, fontSize: 14, fontWeight: '500', lineHeight: 20 },
    radioBtn: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.textSecondary, justifyContent: 'center', alignItems: 'center' },
    selectedRadio: { borderColor: colors.accent },
    radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.accent },
  });
