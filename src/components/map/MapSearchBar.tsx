import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { SportDropdown } from './SportDropdown';

export const MapSearchBar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [activeSport, setActiveSport] = useState('corrida');

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TouchableOpacity 
          style={styles.brandSection} 
          onPress={() => setDropdownVisible(!dropdownVisible)}
          activeOpacity={0.7}
        >
          <FontAwesome5 
            name={activeSport === 'corrida' ? 'shoe-prints' : 'bars-progress'} 
            size={18} 
            color="#E34F1E" 
            style={{ transform: [{ rotate: '-30deg' }] }} 
          />
          <Ionicons name={dropdownVisible ? "chevron-up" : "chevron-down"} size={11} color="white" />
        </TouchableOpacity>

        <Text style={styles.searchText}>Procurar locais</Text>

        <TouchableOpacity style={styles.savedBtn} activeOpacity={0.7}>
          <Ionicons name="bookmark-outline" size={16} color="white" />
          <Text style={styles.savedText}>Salvo</Text>
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
};

const styles = StyleSheet.create({
  container: { 
    position: 'relative', 
    zIndex: 30,
  },
  searchBar: {
    backgroundColor: 'rgba(15, 15, 15, 0.95)',
    height: 52,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    // Elevação e sombras aplicadas diretamente no elemento com cor sólida de fundo
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  brandSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 14,
    borderRightWidth: 1.5,
    borderRightColor: '#333333',
    marginRight: 14,
  },
  searchText: {
    color: '#999999',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  savedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  savedText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
