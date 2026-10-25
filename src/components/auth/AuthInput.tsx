import React, { useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputInstance,
  type TextInputProps,
} from 'react-native';
import { useAuthTheme, type AuthTheme } from '@/constants/authTheme';
import { PasswordEyeIcon } from './PasswordEyeIcon';

interface AuthInputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string;
  isPassword?: boolean;
}

export const AuthInput = React.forwardRef<TextInputInstance, AuthInputProps>(
  ({ label, error, isPassword = false, onFocus, onBlur, ...rest }, ref) => {
    const theme = useAuthTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
      <View style={styles.group}>
        <Text style={styles.label}>{label}</Text>

        <View
          style={[
            styles.wrapper,
            isFocused && styles.wrapperFocused,
            !!error && styles.wrapperError,
          ]}
        >
          <TextInput
            ref={ref}
            style={styles.input}
            placeholderTextColor={theme.textFaint}
            selectionColor={theme.text}
            secureTextEntry={isPassword && !isPasswordVisible}
            onFocus={(event) => {
              setIsFocused(true);
              onFocus?.(event);
            }}
            onBlur={(event) => {
              setIsFocused(false);
              onBlur?.(event);
            }}
            {...rest}
          />

          {isPassword && (
            <Pressable
              onPress={() => setIsPasswordVisible((visible) => !visible)}
              hitSlop={12}
              style={styles.eyeButton}
              accessibilityRole="button"
              accessibilityLabel={isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'}
            >
              <PasswordEyeIcon visible={isPasswordVisible} size={20} />
            </Pressable>
          )}
        </View>

        {!!error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

AuthInput.displayName = 'AuthInput';

const createStyles = (theme: AuthTheme) =>
  StyleSheet.create({
    group: {
      marginBottom: 14,
    },
    label: {
      fontSize: 12,
      fontWeight: '500',
      color: theme.textMuted,
      marginBottom: 6,
    },
    wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 48,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      paddingHorizontal: 18,
    },
    wrapperFocused: {
      borderColor: theme.borderFocused,
      backgroundColor: theme.surfaceFocused,
    },
    wrapperError: {
      borderColor: theme.borderError,
    },
    input: {
      flex: 1,
      height: '100%',
      fontSize: 13.5,
      fontWeight: '500',
      color: theme.text,
    },
    eyeButton: {
      marginLeft: 8,
      padding: 4,
    },
    errorText: {
      marginTop: 6,
      marginLeft: 18,
      fontSize: 12,
      color: theme.error,
    },
  });
