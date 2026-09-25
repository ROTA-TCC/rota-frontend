// src/components/Record/BottomPanel.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type BottomPanelProps = {
  isPaused: boolean;
  stats: {
    time: string;
    pace: string;
    paceLabel: string;
    statusText: string;
    distance: string;
  };
  onPause: () => void;
  onResume: () => void;
  onFinish: () => void;
};

export default function BottomPanel({ isPaused, stats, onPause, onResume, onFinish }: BottomPanelProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Card de Estatísticas */}
      <View style={styles.statsCardWrapper}>
        <View style={styles.statsCard}>
          <View style={[styles.statsHeader, isPaused && styles.statsHeaderPaused]}>
            <Text style={[styles.headerText, isPaused && styles.headerTextPaused]}>
              {stats.statusText}
            </Text>
            <Ionicons 
              name="chevron-up" 
              size={18} 
              color={isPaused ? "#000" : "#fff"} 
              style={styles.expandIcon} 
            />
          </View>

          <View style={styles.statsBody}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.time}</Text>
              <Text style={styles.statLabel}>Tempo</Text>
            </View>
            <View style={styles.statItemCenter}>
              <Text style={styles.statValueGiant}>{stats.pace}</Text>
              <Text style={styles.statLabel}>{stats.paceLabel}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.distance}</Text>
              <Text style={styles.statLabel}>Distância (km)</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Card Base (Controles) */}
      <View style={[styles.controlsCard, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.dragHandle} />
        
        <View style={styles.actionButtonsWrapper}>
          {!isPaused ? (
            <TouchableOpacity style={[styles.btnAction, styles.btnPause]} onPress={onPause}>
              <Ionicons name="pause" size={20} color="white" />
              <Text style={styles.btnTextWhite}>Pausar</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.pausedActionsContainer}>
              {/* Botão Retomar à esquerda */}
              <TouchableOpacity style={[styles.btnAction, styles.btnResume]} onPress={onResume}>
                <Ionicons name="play" size={20} color="white" />
                <Text style={styles.btnTextWhite}>Retomar</Text>
              </TouchableOpacity>
              
              {/* Botão Concluir à direita */}
              <TouchableOpacity style={[styles.btnAction, styles.btnFinish]} onPress={onFinish}>
                <Ionicons name="stop" size={20} color="black" />
                <Text style={styles.btnTextBlack}>Concluir</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 20,
  },
  statsCardWrapper: {
    paddingHorizontal: 16,
    marginBottom: -16, // Para sobrepor levemente e conectar fluidamente com o painel de baixo
    zIndex: 2,
  },
  statsCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    overflow: 'hidden',
  },
  statsHeader: {
    paddingVertical: 12,
    backgroundColor: '#1e1e1e',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsHeaderPaused: {
    backgroundColor: '#ffc107',
  },
  headerText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  headerTextPaused: {
    color: '#000000',
  },
  expandIcon: {
    position: 'absolute',
    right: 16,
  },
  statsBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
  },
  statItem: {
    alignItems: 'center',
  },
  statItemCenter: {
    alignItems: 'center',
    marginBottom: -4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  statValueGiant: {
    fontSize: 38,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#b0b0b0',
  },
  controlsCard: {
    backgroundColor: '#121212',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 36, // Espaço extra para compensar o margin negativo de cima
    paddingHorizontal: 20,
    alignItems: 'center',
    zIndex: 1,
  },
  dragHandle: {
    width: 36,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 2,
    marginBottom: 24,
  },
  actionButtonsWrapper: {
    width: '100%',
    height: 60,
  },
  btnAction: {
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  btnPause: {
    backgroundColor: '#ff4500',
    width: '100%',
  },
  pausedActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
  },
  btnResume: {
    backgroundColor: '#ff4500',
    width: '48%',
  },
  btnFinish: {
    backgroundColor: '#ffffff',
    width: '48%',
  },
  btnTextWhite: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  btnTextBlack: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
});
