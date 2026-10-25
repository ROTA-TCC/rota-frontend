import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  useActivityFormColors,
  type ActivityFormPalette,
} from '@/constants/activityFormTheme';

interface ActivityTextFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
  maxLength?: number;
  error?: string;
  helper?: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  returnKeyType?: TextInputProps['returnKeyType'];
}

export function ActivityTextField({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  maxLength,
  error,
  helper,
  icon,
  autoCapitalize = 'sentences',
  returnKeyType = 'done',
}: ActivityTextFieldProps) {
  const colors = useActivityFormColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.field}>
      <View style={styles.labelRow}>
        <View style={styles.labelContent}>
          {icon ? <Ionicons name={icon} size={13} color={colors.textSecondary} /> : null}
          <Text style={styles.label}>{label}</Text>
        </View>
        {maxLength ? (
          <Text style={styles.counter}>
            {value.length}/{maxLength}
          </Text>
        ) : null}
      </View>

      <View
        style={[
          styles.inputContainer,
          multiline && styles.inputContainerMultiline,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
        ]}
      >
        <TextInput
          style={[styles.input, multiline && styles.inputMultiline]}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.accent}
          multiline={multiline}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          returnKeyType={returnKeyType}
          textAlignVertical={multiline ? 'top' : 'center'}
          accessibilityLabel={label}
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!error && helper ? <Text style={styles.helper}>{helper}</Text> : null}
    </View>
  );
}

const createStyles = (colors: ActivityFormPalette) =>
  StyleSheet.create({
    field: {
      gap: 8,
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    labelContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    label: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: '600',
    },
    counter: {
      color: colors.textMuted,
      fontSize: 10,
      fontWeight: '500',
    },
    inputContainer: {
      minHeight: 50,
      justifyContent: 'center',
      paddingHorizontal: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: 'transparent',
      backgroundColor: colors.card,
    },
    inputContainerMultiline: {
      minHeight: 120,
      paddingTop: 13,
      paddingBottom: 13,
    },
    inputContainerFocused: {
      borderColor: colors.accent,
    },
    inputContainerError: {
      borderColor: colors.danger,
    },
    input: {
      color: colors.textPrimary,
      fontSize: 14,
      lineHeight: 20,
      padding: 0,
    },
    inputMultiline: {
      minHeight: 94,
      lineHeight: 20,
    },
    error: {
      color: colors.danger,
      fontSize: 11,
      fontWeight: '500',
    },
    helper: {
      color: colors.textMuted,
      fontSize: 11,
      lineHeight: 15,
    },
  });
