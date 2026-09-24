import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Modal, TouchableWithoutFeedback } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

interface SportItem {
  id: string;
  name: string;
  icon: string;
  isIconAwesome?: boolean;
}

const sports: SportItem[] = [
  { id: 'corrida', name: 'Corrida', icon: 'shoe-prints', isIconAwesome: true },
  { id: 'esteira', name: 'treadmill', icon: 'material-community', isIconAwesome: false },
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
        {sports.map((sport) => (
          <TouchableOpacity
            key={sport.id}
            style={[styles.sportItem, activeSport === sport.id && styles.activeItem]}
            onPress={() => {
              onSelect(sport.id);
              onClose();
            }}
          >
            <View style={styles.sportIcon}>
              {sport.isIconAwesome ? (
                <FontAwesome5 name={sport.icon} size={16} color={activeSport === sport.id ? '#E34F1E' : '#999'} />
              ) : (
                <Ionicons name="fitness" size={18} color={activeSport === sport.id ? '#E34F1E' : '#999'} />
              )}
            </View>
            <Text style={[styles.sportName, activeSport === sport.id && styles.activeText]}>{sport.name}</Text>
            {activeSport === sport.id && <Ionicons name="checkmark" size={14} color="#E34F1E" />}
          </TouchableOpacity>
        ))}
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
    top: 80, // Adjusted top position to be below the search bar
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
