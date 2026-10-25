import React, { useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  useActivityFormColors,
  type ActivityFormPalette,
} from '@/constants/activityFormTheme';

interface EquipmentFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const getEquipmentIcon = (label: string): React.ComponentProps<typeof Ionicons>['name'] => {
  const normalized = label.toLowerCase();

  if (normalized.includes('bicicleta') || normalized.includes('bike')) {
    return 'bicycle-outline';
  }

  if (normalized.includes('esteira')) {
    return 'timer-outline';
  }

  return 'footsteps-outline';
};

export function EquipmentField({ value, onChange }: EquipmentFieldProps) {
  const colors = useActivityFormColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [isAdding, setIsAdding] = useState(false);
  const [input, setInput] = useState('');

  const closeInput = () => {
    setIsAdding(false);
    setInput('');
  };

  const handleAdd = () => {
    const trimmed = input.trim();

    if (!trimmed) {
      closeInput();
      return;
    }

    if (!value.some((item) => item.toLowerCase() === trimmed.toLowerCase())) {
      onChange([...value, trimmed]);
    }

    closeInput();
  };

  const handleRemove = (item: string) => {
    onChange(value.filter((equipment) => equipment !== item));
  };

  return (
    <View style={styles.field}>
      {value.length > 0 ? (
        <View style={styles.chips}>
          {value.map((item) => (
            <View key={item} style={styles.chip}>
              <Ionicons
                name={getEquipmentIcon(item)}
                size={13}
                color={colors.textSecondary}
              />
              <Text style={styles.chipText}>{item}</Text>
              <Pressable
                onPress={() => handleRemove(item)}
                hitSlop={6}
                accessibilityRole="button"
                accessibilityLabel={`Remover ${item}`}
              >
                <Ionicons name="close" size={13} color={colors.textMuted} />
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}

      {isAdding ? (
        <View style={styles.inputRow}>
          <Ionicons name="add-circle-outline" size={18} color={colors.textSecondary} />
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleAdd}
            placeholder="Ex.: Tênis de corrida"
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.accent}
            returnKeyType="done"
            autoFocus
            maxLength={40}
            accessibilityLabel="Nome do equipamento"
          />
          <Pressable
            onPress={handleAdd}
            hitSlop={6}
            style={styles.confirmButton}
            accessibilityRole="button"
            accessibilityLabel="Adicionar equipamento"
          >
            <Ionicons name="checkmark" size={17} color={colors.accentText} />
          </Pressable>
          <Pressable
            onPress={closeInput}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel="Cancelar equipamento"
          >
            <Ionicons name="close" size={18} color={colors.textSecondary} />
          </Pressable>
        </View>
      ) : (
        <Pressable
          onPress={() => setIsAdding(true)}
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.addButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Adicionar equipamento"
        >
          <View style={styles.addIcon}>
            <Ionicons name="add" size={17} color={colors.accent} />
          </View>
          <Text style={styles.addText}>Adicionar equipamento</Text>
        </Pressable>
      )}
    </View>
  );
}

const createStyles = (colors: ActivityFormPalette) =>
  StyleSheet.create({
    field: {
      gap: 8,
    },
    chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 999,
      backgroundColor: colors.cardAlt,
    },
    chipText: {
      color: colors.textPrimary,
      fontSize: 12,
      fontWeight: '500',
    },
    inputRow: {
      minHeight: 50,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
      paddingHorizontal: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.accent,
      backgroundColor: colors.card,
    },
    input: {
      flex: 1,
      color: colors.textPrimary,
      fontSize: 13,
      padding: 0,
    },
    confirmButton: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addButton: {
      minHeight: 50,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 14,
      borderRadius: 12,
      backgroundColor: colors.card,
    },
    addButtonPressed: {
      backgroundColor: colors.cardAlt,
    },
    addIcon: {
      width: 30,
      height: 30,
      borderRadius: 9,
      backgroundColor: colors.accentSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addText: {
      flex: 1,
      color: colors.textPrimary,
      fontSize: 13,
      fontWeight: '600',
    },
  });
