import { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AuthScreen, AuthFooterLink } from '@/components/auth/AuthScreen';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthSubmitButton } from '@/components/auth/AuthSubmitButton';
import { useAuthTheme, type AuthTheme } from '@/constants/authTheme';
import {
  getPasswordRequirements,
  hasErrors,
  validateResetPasswordForm,
  type AuthFormErrors,
} from '@/utils/validation';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const theme = useAuthTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<AuthFormErrors>({});

  const requirements = getPasswordRequirements(password);

  const clearFieldError = (field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const goToLogin = () => {
    if (router.canDismiss()) {
      router.dismissAll();
    }
    router.replace('/(auth)/login');
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    goToLogin();
  };

  const handleResetPassword = () => {
    const validationErrors = validateResetPasswordForm({ password, confirmPassword });
    setErrors(validationErrors);

    if (hasErrors(validationErrors)) return;

    Alert.alert(
      'Senha redefinida',
      'Sua nova senha foi criada com sucesso. Faça login para continuar.',
      [{ text: 'Fazer login', onPress: goToLogin }],
      { cancelable: false }
    );
  };

  return (
    <AuthScreen
      title="Criar nova senha"
      subtitle="Sua nova senha deve ser diferente das senhas utilizadas anteriormente."
      onBack={handleBack}
      footer={
        <AuthFooterLink
          text="Voltar ao"
          linkText="Fazer Login"
          onPress={goToLogin}
        />
      }
    >
      <View style={styles.form}>
        <AuthInput
          label="Nova senha"
          placeholder="••••••••••••"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            clearFieldError('password');
          }}
          error={errors.password}
          isPassword
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="next"
        />

        <View style={styles.requirements}>
          {requirements.map((requirement) => (
            <View key={requirement.id} style={styles.requirementRow}>
              <View
                style={[
                  styles.requirementIcon,
                  requirement.valid && styles.requirementIconValid,
                ]}
              >
                <Ionicons
                  name={requirement.valid ? 'checkmark' : 'close'}
                  size={requirement.valid ? 12 : 11}
                  color={requirement.valid ? '#ffffff' : theme.textFaint}
                />
              </View>
              <Text
                style={[
                  styles.requirementText,
                  requirement.valid && styles.requirementTextValid,
                ]}
              >
                {requirement.label}
              </Text>
            </View>
          ))}
        </View>

        <AuthInput
          label="Confirmar nova senha"
          placeholder="••••••••••••"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            clearFieldError('confirmPassword');
          }}
          error={errors.confirmPassword}
          isPassword
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="done"
          onSubmitEditing={handleResetPassword}
        />

        <AuthSubmitButton label="Redefinir senha" onPress={handleResetPassword} />
      </View>
    </AuthScreen>
  );
}

const createStyles = (theme: AuthTheme) =>
  StyleSheet.create({
    form: {
      marginTop: 28,
    },
    requirements: {
      gap: 10,
      marginTop: -4,
      marginBottom: 14,
      paddingLeft: 4,
    },
    requirementRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    requirementIcon: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surfacePressed,
      alignItems: 'center',
      justifyContent: 'center',
    },
    requirementIconValid: {
      borderColor: theme.success,
      backgroundColor: theme.success,
    },
    requirementText: {
      fontSize: 13,
      color: theme.textFaint,
    },
    requirementTextValid: {
      color: theme.text,
    },
  });
