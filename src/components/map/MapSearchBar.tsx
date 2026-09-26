import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { SportDropdown } from './SportDropdown'; // Certifique-se de que este componente não tem absolute/elevation quebrando o layout

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
    // Removi propriedades absolutas e zIndex daqui para evitar conflito com a View pai. 
    // O empilhamento agora é gerenciado de forma segura no arquivo mapa.tsx
  },
  searchBar: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    height: 52,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    // O elevation SÓ PODE existir em views com backgroundColor sólido para não bugar no Android
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
    color: '#A0A0A0',
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
