import React, { useMemo } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  useActivityFormColors,
  type ActivityFormPalette,
} from '@/constants/activityFormTheme';
import type { ActivitySelectOption } from '@/types/activity';

interface SelectOptionSheetProps {
  visible: boolean;
  title: string;
  options: ActivitySelectOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

export function SelectOptionSheet({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}: SelectOptionSheetProps) {
  const insets = useSafeAreaInsets();
  const colors = useActivityFormColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleSelect = (value: string) => {
    onSelect(value);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Fechar opções"
        />

        <View
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}
          accessibilityViewIsModal
        >
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.closeButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Fechar"
            >
              <Ionicons name="close" size={18} color={colors.textPrimary} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={styles.list}
          >
            {options.map((option) => {
              const isSelected = option.value === selectedValue;

              return (
                <Pressable
                  key={option.value}
                  onPress={() => handleSelect(option.value)}
                  style={({ pressed }) => [
                    styles.option,
                    isSelected && styles.optionSelected,
                    pressed && styles.optionPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={option.label}
                >
                  {option.icon ? (
                    <View
                      style={[
                        styles.optionIcon,
                        isSelected && styles.optionIconSelected,
                      ]}
                    >
                      <Ionicons
                        name={option.icon}
                        size={18}
                        color={isSelected ? colors.accent : colors.textSecondary}
                      />
                    </View>
                  ) : null}

                  <View style={styles.optionText}>
                    <Text
                      style={[
                        styles.optionLabel,
                        isSelected && styles.optionLabelSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {option.description ? (
                      <Text style={styles.optionDescription}>
                        {option.description}
                      </Text>
                    ) : null}
                  </View>

                  {isSelected ? (
                    <Ionicons name="checkmark-circle" size={20} color={colors.accent} />
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (colors: ActivityFormPalette) =>
  StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    backdrop: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: colors.overlay,
    },
    sheet: {
      maxHeight: '78%',
      backgroundColor: colors.card,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      borderWidth: 1,
      borderColor: colors.border,
      paddingTop: 10,
    },
    handle: {
      width: 38,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      alignSelf: 'center',
      marginBottom: 8,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 14,
    },
    title: {
      color: colors.textPrimary,
      fontSize: 17,
      fontWeight: '700',
      letterSpacing: -0.3,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.cardAlt,
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeButtonPressed: {
      opacity: 0.7,
    },
    list: {
      paddingHorizontal: 16,
      paddingBottom: 8,
    },
    option: {
      minHeight: 58,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 14,
      marginBottom: 6,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    optionSelected: {
      backgroundColor: colors.accentSoft,
      borderColor: colors.accentBorder,
    },
    optionPressed: {
      backgroundColor: colors.cardAlt,
    },
    optionIcon: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: colors.cardAlt,
      alignItems: 'center',
      justifyContent: 'center',
    },
    optionIconSelected: {
      backgroundColor: colors.card,
    },
    optionText: {
      flex: 1,
      gap: 2,
    },
    optionLabel: {
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '600',
    },
    optionLabelSelected: {
      color: colors.accent,
    },
    optionDescription: {
      color: colors.textSecondary,
      fontSize: 11,
      lineHeight: 15,
    },
  });
