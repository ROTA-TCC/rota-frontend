import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  useActivityFormColors,
  type ActivityFormPalette,
} from '@/constants/activityFormTheme';
import type { ActivitySelectOption } from '@/types/activity';
import { SelectOptionSheet } from './SelectOptionSheet';

interface SelectFieldProps {
  label: string;
  value: string;
  options: ActivitySelectOption[];
  onSelect: (value: string) => void;
  placeholder?: string;
  modalTitle?: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  error?: string;
}

export function SelectField({
  label,
  value,
  options,
  onSelect,
  placeholder = 'Selecionar',
  modalTitle,
  icon,
  error,
}: SelectFieldProps) {
  const colors = useActivityFormColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);
  const displayLabel = selectedOption?.label ?? placeholder;
  const leadingIcon = selectedOption?.icon ?? icon;

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <Pressable
        onPress={() => setIsOpen(true)}
        style={({ pressed }) => [
          styles.control,
          pressed && styles.controlPressed,
          error && styles.controlError,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${displayLabel}`}
      >
        {leadingIcon ? (
          <Ionicons name={leadingIcon} size={16} color={colors.textSecondary} />
        ) : null}

        <Text
          style={[styles.value, !selectedOption && styles.placeholder]}
          numberOfLines={1}
        >
          {displayLabel}
        </Text>

        <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <SelectOptionSheet
        visible={isOpen}
        title={modalTitle ?? label}
        options={options}
        selectedValue={value}
        onSelect={onSelect}
        onClose={() => setIsOpen(false)}
      />
    </View>
  );
}

const createStyles = (colors: ActivityFormPalette) =>
  StyleSheet.create({
    field: {
      gap: 8,
    },
    label: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: '600',
    },
    control: {
      minHeight: 50,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
      paddingHorizontal: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: 'transparent',
      backgroundColor: colors.card,
    },
    controlPressed: {
      backgroundColor: colors.cardAlt,
    },
    controlError: {
      borderColor: colors.danger,
    },
    value: {
      flex: 1,
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '500',
    },
    placeholder: {
      color: colors.textMuted,
      fontWeight: '400',
    },
    error: {
      color: colors.danger,
      fontSize: 11,
      fontWeight: '500',
    },
  });
