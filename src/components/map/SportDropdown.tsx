import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Modal, TouchableWithoutFeedback } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

interface SportItem {
  id: string;
  name: string;
  iconName: string;
  iconType: 'FontAwesome5' | 'MaterialCommunityIcons';
  rotate?: boolean;
}

const sports: SportItem[] = [
  { id: 'corrida', name: 'Corrida', iconName: 'shoe-prints', iconType: 'FontAwesome5', rotate: true },
  { id: 'esteira', name: 'Esteira', iconName: 'running', iconType: 'FontAwesome5' },
];

interface SportDropdownProps {
  activeSport: string;
  onSelect: (sportId: string) => void;
  onClose: () => void;
}

export const SportDropdown = ({ activeSport, onSelect, onClose }: SportDropdownProps) => {
  return (
    <Modal visible={true} transparent={true} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <View style={styles.dropdown}>
        {sports.map((sport) => {
          const isActive = activeSport === sport.id;
          const color = isActive ? '#E34F1E' : '#999';
          const iconStyle = sport.rotate ? { transform: [{ rotate: '-30deg' }] } : {};

          return (
            <TouchableOpacity
              key={sport.id}
              style={[styles.sportItem, isActive && styles.activeItem]}
              onPress={() => {
                onSelect(sport.id);
                onClose();
              }}
            >
              <View style={styles.sportIcon}>
                {sport.iconType === 'FontAwesome5' ? (
                  <FontAwesome5 name={sport.iconName} size={16} color={color} style={iconStyle} />
                ) : (
                  <MaterialCommunityIcons name={sport.iconName as any} size={20} color={color} />
                )}
              </View>
              <Text style={[styles.sportName, isActive && styles.activeText]}>{sport.name}</Text>
              {isActive && <Ionicons name="checkmark" size={14} color="#E34F1E" />}
            </TouchableOpacity>
          );
        })}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdown: {
    position: 'absolute',
    top: 80,
    left: 16,
    width: 190,
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 20,
  },
  sportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
  },
  activeItem: {
    backgroundColor: 'rgba(227, 79, 30, 0.12)',
  },
  sportIcon: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  sportName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  activeText: {
    color: '#E34F1E',
  },
});
