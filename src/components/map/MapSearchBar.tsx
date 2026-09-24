import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

export const MapSearchBar = () => (
  <View style={styles.searchBar}>
    <View style={styles.brandSection}>
      <FontAwesome5 name="shoe-prints" size={18} color="#E34F1E" style={{ transform: [{ rotate: '-30deg' }] }} />
      <Ionicons name="chevron-down" size={11} color="white" />
    </View>
    <Text style={styles.searchText}>Procurar locais</Text>
    <TouchableOpacity style={styles.savedBtn}>
      <Ionicons name="bookmark-outline" size={16} color="white" />
      <Text style={styles.savedText}>Salvo</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: 'rgba(15, 15, 15, 0.95)',
    height: 52,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
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