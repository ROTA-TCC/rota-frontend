import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { colors, shadows, spacing, typography } from '@/theme';

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
      <View style={styles.infoPill} pointerEvents="none">
        <ThemedText style={styles.infoPillText}>Área Oculta ({distanceText})</ThemedText>
        <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="10" stroke={colors.primary} strokeWidth="2" />
          <Path
            d="M12 16V12M12 8H12.01"
            stroke={colors.primary}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </Svg>
      </View>

      <View style={styles.actionCluster}>
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={onLocateUser}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Centralizar na minha posição"
        >
          <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="3" fill={colors.text} />
            <Path
              d="M12 2V5M12 19V22M2 12H5M19 12H22"
              stroke={colors.text}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <Circle cx="12" cy="12" r="8" stroke={colors.text} strokeWidth="2" />
          </Svg>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlBtn}
          onPress={onToggleFullscreen}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={isFullscreen ? 'Sair da tela cheia' : 'Expandir mapa'}
        >
          <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            {isFullscreen ? (
              <Path
                d="M8 3V8H3M16 3V8H21M8 21V16H3M16 21V16H21"
                stroke={colors.text}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <Path
                d="M15 3H21V9M9 21H3V15M21 3L14 10M3 21L10 14"
                stroke={colors.text}
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
    top: spacing.xl,
    alignSelf: 'center',
    backgroundColor: colors.surfaceCard,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    zIndex: 10,
    elevation: 4,
  },
  infoPillText: {
    color: colors.text,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.3,
  },
  actionCluster: {
    position: 'absolute',
    bottom: spacing.xxl,
    right: spacing.xxl,
    gap: spacing.lg,
    zIndex: 10,
  },
  controlBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.surfaceCard,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderVisible,
    ...shadows.control,
  },
});
