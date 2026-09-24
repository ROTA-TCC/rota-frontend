import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

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
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.optionList}>
            {options.map((option) => (
              <TouchableOpacity key={option.id} style={styles.optionItem} onPress={() => onSelect(option.id)}>
                <View style={styles.optionIcon}>
                  <MaterialCommunityIcons name={option.icon as any} size={24} color="white" />
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

const styles = StyleSheet.create({
  modalContainer: { 
    flex: 1, 
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)', // Moved background color to container
  },
  overlay: { 
    ...StyleSheet.absoluteFillObject, 
    // Removed background color here to avoid conflict
  },
  bottomSheet: {
    backgroundColor: '#1F1F1F',
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
    borderBottomColor: '#333',
  },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  optionList: { padding: 8 },
  optionItem: { flexDirection: 'row', padding: 20, alignItems: 'flex-start' },
  optionIcon: { width: 24, marginRight: 20, alignItems: 'center' },
  optionContent: { flex: 1, marginRight: 20 },
  optionTitle: { color: '#FFF', fontSize: 16, fontWeight: '600', marginBottom: 6 },
  optionDesc: { color: '#E0E0E0', fontSize: 14, fontWeight: '500', lineHeight: 20 },
  radioBtn: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  selectedRadio: { borderColor: '#E34F1E' },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#E34F1E' },
});
