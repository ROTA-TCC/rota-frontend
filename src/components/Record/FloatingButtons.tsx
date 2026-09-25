// src/components/Record/FloatingButtons.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FloatingButtons() {
  const insets = useSafeAreaInsets();

  return (
    <>
      {/* Botão Superior Esquerdo (Voltar) */}
      <TouchableOpacity style={[styles.btnCircle, { top: insets.top + 10, left: 20 }]}>
        <Ionicons name="chevron-down" size={28} color="white" />
      </TouchableOpacity>

      {/* Botão Inferior Esquerdo (Informação) */}
      <TouchableOpacity style={[styles.btnInfo, { bottom: 270 }]}>
        <Ionicons name="information" size={20} color="white" />
      </TouchableOpacity>

      {/* Botões Flutuantes à Direita */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fabBtn}>
          <View style={styles.fabBadge}>
            <Text style={styles.fabBadgeText}>1</Text>
          </View>
          <Ionicons name="layers" size={22} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.fabBtn}>
          <Text style={styles.fabText3D}>3D</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.fabBtn}>
          <MaterialIcons name="my-location" size={22} color="white" />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  btnCircle: {
    position: 'absolute',
    width: 44,
    height: 44,
    backgroundColor: 'rgba(18, 18, 18, 0.9)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  btnInfo: {
    position: 'absolute',
    left: 20,
    width: 32,
    height: 32,
    backgroundColor: 'rgba(18, 18, 18, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  fabContainer: {
    position: 'absolute',
    right: 15,
    top: '50%',
    marginTop: -80, // Centraliza verticalmente considerando os 3 botões
    gap: 12,
    zIndex: 10,
  },
  fabBtn: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(18, 18, 18, 0.9)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: 'white',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  fabBadgeText: {
    color: 'black',
    fontSize: 10,
    fontWeight: 'bold',
  },
  fabText3D: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
});
