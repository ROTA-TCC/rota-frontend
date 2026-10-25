import React, { useMemo } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRecordColors, type RecordPalette } from '@/constants/recordTheme';
import type { SportActivity } from '@/types/record';
import { ChevronRightIcon, sportIcons } from './icons';

interface MoreSportsModalProps {
  visible: boolean;
  sports: SportActivity[];
  onClose: () => void;
  onSelect: (sport: SportActivity) => void;
}

export function MoreSportsModal({ visible, sports, onClose, onSelect }: MoreSportsModalProps) {
  const colors = useRecordColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalRoot}>
        <Pressable
          style={[StyleSheet.absoluteFill, styles.backdrop]}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Fechar mais esportes"
        />

        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Mais esportes</Text>
            <Text style={styles.subtitle}>Escolha outro tipo de atividade</Text>
          </View>

          <View style={styles.list}>
            {sports.map((sport) => {
              const Icon = sportIcons[sport.id];

              return (
                <Pressable
                  key={sport.id}
                  style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
                  onPress={() => onSelect(sport)}
                  accessibilityRole="button"
                  accessibilityLabel={`Iniciar ${sport.title}`}
                >
                  <View style={styles.iconBox}>
                    <Icon size={22} color={colors.textPrimary} />
                  </View>

                  <View style={styles.itemText}>
                    <Text style={styles.itemTitle}>{sport.title}</Text>
                    <Text style={styles.itemSubtitle}>{sport.subtitle}</Text>
                  </View>

                  <ChevronRightIcon size={18} color={colors.textMuted} />
                </Pressable>
              );
            })}
          </View>

          <Pressable
            style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Fechar"
          >
            <Text style={styles.closeText}>Fechar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (colors: RecordPalette) =>
  StyleSheet.create({
    modalRoot: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    backdrop: {
      backgroundColor: colors.overlay,
    },
    sheet: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      borderWidth: 1,
      borderColor: colors.borderFrame,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 32,
      gap: 18,
    },
    handle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.borderFrame,
      alignSelf: 'center',
      marginBottom: 4,
    },
    header: {
      gap: 4,
    },
    title: {
      color: colors.textPrimary,
      fontSize: 22,
      fontWeight: '800',
      letterSpacing: -0.4,
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: '500',
    },
    list: {
      gap: 8,
    },
    item: {
      minHeight: 64,
      borderRadius: 18,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 14,
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    itemPressed: {
      backgroundColor: colors.cardPressed,
    },
    iconBox: {
      width: 40,
      height: 40,
      borderRadius: 13,
      backgroundColor: colors.iconBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemText: {
      flex: 1,
      gap: 2,
    },
    itemTitle: {
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: '700',
    },
    itemSubtitle: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: '500',
    },
    closeButton: {
      height: 48,
      borderRadius: 24,
      borderWidth: 1.5,
      borderColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeButtonPressed: {
      backgroundColor: colors.accentSoft,
    },
    closeText: {
      color: colors.accent,
      fontSize: 14,
      fontWeight: '700',
    },
  });
