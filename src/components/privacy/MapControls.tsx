import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const ORANGE = '#FF8C00';

interface MapControlsProps {
  radiusKm: string;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onLocateUser: () => void;
  isLocating?: boolean;
}

export function MapControls({
  radiusKm,
  isFullscreen,
  onToggleFullscreen,
  onLocateUser,
}: MapControlsProps) {
  return (
    <>
      {/* Pill Superior - Informação do Raio */}
      <View style={styles.infoPill} pointerEvents="none">
        <Text style={styles.infoPillText}>Área Oculta ({radiusKm} km)</Text>
        <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="10" stroke={ORANGE} strokeWidth="2" />
          <Path
            d="M12 16V12M12 8H12.01"
            stroke={ORANGE}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </Svg>
      </View>

      {/* Botões de Ação no Canto Inferior Direito */}
      <View style={styles.actionCluster}>
        {/* Botão Minha Localização */}
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={onLocateUser}
          activeOpacity={0.8}
        >
          <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="3" fill="#FFFFFF" />
            <Path
              d="M12 2V5M12 19V22M2 12H5M19 12H22"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <Circle cx="12" cy="12" r="8" stroke="#FFFFFF" strokeWidth="2" />
          </Svg>
        </TouchableOpacity>

        {/* Botão Expansão / Tela Cheia */}
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={onToggleFullscreen}
          activeOpacity={0.8}
        >
          <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            {isFullscreen ? (
              // Ícone de Encolher (Minimize)
              <Path
                d="M8 3V8H3M16 3V8H21M8 21V16H3M16 21V16H21"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              // Ícone de Expandir (Maximize)
              <Path
                d="M15 3H21V9M9 21H3V15M21 3L14 10M3 21L10 14"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </Svg>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  infoPill: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
    backgroundColor: '#141416',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    zIndex: 10,
  },
  infoPillText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  actionCluster: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    gap: 10,
    zIndex: 10,
  },
  controlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#141416',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 5,
  },
});
