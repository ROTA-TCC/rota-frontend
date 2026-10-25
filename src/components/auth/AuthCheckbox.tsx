import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthTheme, type AuthTheme } from '@/constants/authTheme';

interface AuthCheckboxProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  accessibilityLabel?: string;
}

export function AuthCheckbox({
  value,
  onValueChange,
  label,
  accessibilityLabel,
}: AuthCheckboxProps) {
  const theme = useAuthTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      hitSlop={8}
      style={styles.row}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value }}
      accessibilityLabel={accessibilityLabel ?? label}
    >
      <View style={[styles.box, value && styles.boxChecked]}>
        {value && <Ionicons name="checkmark" size={13} color={theme.submitText} />}
      </View>
      {!!label && <Text style={styles.label}>{label}</Text>}
    </Pressable>
  );
}

const createStyles = (theme: AuthTheme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    box: {
      width: 18,
      height: 18,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.borderStrong,
      backgroundColor: theme.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    boxChecked: {
      backgroundColor: theme.submit,
      borderColor: theme.submit,
    },
    label: {
      fontSize: 13,
      color: theme.textMuted,
    },
  });
