import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function HeaderSearch() {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={18} color="#8E8E93" />
      <TextInput
        style={styles.input}
        placeholder="Buscar atividade..."
        placeholderTextColor="#8E8E93"
      />
      <TouchableOpacity activeOpacity={0.7}>
        <Ionicons name="options-outline" size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
    gap: 12,
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
});
