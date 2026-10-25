import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AuthScreen, AuthFooterLink } from '@/components/auth/AuthScreen';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthSubmitButton } from '@/components/auth/AuthSubmitButton';
import { useAuthTheme, type AuthTheme } from '@/constants/authTheme';
import {
  hasErrors,
  validateForgotPasswordForm,
  type AuthFormErrors,
} from '@/utils/validation';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const theme = useAuthTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<AuthFormErrors>({});

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

  const handleSendCode = () => {
    const validationErrors = validateForgotPasswordForm({ email });
    setErrors(validationErrors);

    if (hasErrors(validationErrors)) return;

    router.push({
      pathname: '/(auth)/verify-code',
      params: { email: email.trim().toLowerCase() },
    });
  };

  return (
    <AuthScreen
      title="Esqueceu a senha?"
      subtitle="Digite o e-mail associado à sua conta e enviaremos um código de verificação para redefinir sua senha."
      onBack={handleBack}
      footer={
        <AuthFooterLink
          text="Lembrou a senha?"
          linkText="Fazer Login"
          onPress={goToLogin}
        />
      }
    >
      <View style={styles.form}>
        <AuthInput
          label="Endereço de e-mail"
          placeholder="seuemail@exemplo.com"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrors((prev) => {
              if (!prev.email) return prev;
              const next = { ...prev };
              delete next.email;
              return next;
            });
          }}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="done"
          onSubmitEditing={handleSendCode}
        />

        <AuthSubmitButton label="Enviar código" onPress={handleSendCode} />
      </View>
    </AuthScreen>
  );
}

const createStyles = (theme: AuthTheme) =>
  StyleSheet.create({
    form: {
      marginTop: 28,
    },
  });
