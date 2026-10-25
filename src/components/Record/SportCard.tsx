import React, { useMemo, type ComponentType } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRecordColors, type RecordPalette } from '@/constants/recordTheme';
import { ChevronRightIcon, PlayIcon, type IconProps } from './icons';

interface SportCardProps {
  title: string;
  subtitle: string;
  icon: ComponentType<IconProps>;
  onStart: () => void;
}

export function SportCard({ title, subtitle, icon: Icon, onStart }: SportCardProps) {
  const colors = useRecordColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.left}>
          <View style={styles.iconBox}>
            <Icon size={24} color={colors.textPrimary} />
          </View>

          <View style={styles.titleGroup}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>

        <ChevronRightIcon size={20} color={colors.textMuted} />
      </View>

      <Pressable
        style={({ pressed }) => [styles.startButton, pressed && styles.startButtonPressed]}
        onPress={onStart}
        accessibilityRole="button"
        accessibilityLabel={`Iniciar ${title}`}
      >
        <PlayIcon size={16} color={colors.buttonText} />
        <Text style={styles.startText}>Início</Text>
      </Pressable>
    </View>
  );
}

const createStyles = (colors: RecordPalette) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      gap: 14,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    left: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      flex: 1,
    },
    iconBox: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: colors.iconBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleGroup: {
      flex: 1,
      gap: 2,
    },
    title: {
      color: colors.textPrimary,
      fontSize: 18,
      fontWeight: '700',
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: '500',
    },
    startButton: {
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.accent,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    startButtonPressed: {
      backgroundColor: colors.accentPressed,
    },
    startText: {
      color: colors.buttonText,
      fontSize: 15,
      fontWeight: '800',
    },
  });
