import React, { useMemo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { useAuthTheme, type AuthTheme } from '@/constants/authTheme';

interface AuthSubmitButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function AuthSubmitButton({
  label,
  onPress,
  loading = false,
  disabled = false,
}: AuthSubmitButtonProps) {
  const theme = useAuthTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const isDisabled = disabled || loading;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        isDisabled && styles.buttonDisabled,
        pressed && !isDisabled && styles.buttonPressed,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator color={theme.submitText} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
}

const createStyles = (theme: AuthTheme) =>
  StyleSheet.create({
    button: {
      height: 52,
      borderRadius: 26,
      backgroundColor: theme.submit,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 4,
    },
    buttonPressed: {
      backgroundColor: theme.submitPressed,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    label: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.submitText,
    },
  });
