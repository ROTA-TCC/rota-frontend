import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const ORANGE = '#FF8C00';

interface MapControlsProps {
  distanceText: string;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onLocateUser: () => void;
}

export function MapControls({
  distanceText,
  isFullscreen,
  onToggleFullscreen,
  onLocateUser,
}: MapControlsProps) {
  return (
    <>
      {/* Indicador Superior do Raio Real */}
      <View style={styles.infoPill} pointerEvents="none">
        <Text style={styles.infoPillText}>Área Oculta ({distanceText})</Text>
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

      {/* Botões Flutuantes no Canto Inferior */}
      <View style={styles.actionCluster}>
        {/* Botão de Centralizar no Usuário */}
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

        {/* Botão de Tela Cheia / Expansão */}
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={onToggleFullscreen}
          activeOpacity={0.8}
        >
          <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            {isFullscreen ? (
              <Path
                d="M8 3V8H3M16 3V8H21M8 21V16H3M16 21V16H21"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
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
    zIndex: 10,
    elevation: 4,
  },
  infoPillText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  actionCluster: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    gap: 12,
    zIndex: 10,
  },
  controlBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#141416',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
});
