import { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type TextInputInstance,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AuthScreen, AuthFooterLink } from '@/components/auth/AuthScreen';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthCheckbox } from '@/components/auth/AuthCheckbox';
import { SocialAuthSection } from '@/components/auth/SocialAuthSection';
import { useAuthTheme, type AuthTheme } from '@/constants/authTheme';
import { useAuth, type SocialAuthResult } from '@/providers/AuthProvider';
import { ApiError } from '@/services/api/interceptors';
import { hasErrors, validateLoginForm, type AuthFormErrors } from '@/utils/validation';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const theme = useAuthTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordRef = useRef<TextInputInstance>(null);

  const clearFieldError = (field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(auth)/onboarding');
  };

  const handleApiError = (error: unknown) => {
    if (error instanceof ApiError && error.field) {
      setErrors((prev) => ({ ...prev, [error.field as string]: error.message }));
      return;
    }
    if (error instanceof ApiError) {
      setGeneralError(error.message);
      return;
    }
    setGeneralError('Não foi possível entrar. Tente novamente.');
  };

  const handleSocialSuccess = (result: SocialAuthResult) => {
    if (result.outcome === 'two-factor') {
      router.push({
        pathname: '/(auth)/two-factor',
        params: { email: '' },
      });
      return;
    }

    router.replace(result.isNewUser ? '/(auth)/profile-info' : '/(tabs)/home');
  };

  const handleLogin = async () => {
    const validationErrors = validateLoginForm({ email, password });
    setErrors(validationErrors);
    setGeneralError('');

    if (hasErrors(validationErrors)) return;

    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const outcome = await login({ email: normalizedEmail, password, rememberMe });

      if (outcome === 'two-factor') {
        router.push({
          pathname: '/(auth)/two-factor',
          params: { email: normalizedEmail },
        });
        return;
      }

      router.replace('/(tabs)/home');
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreen
      title="Bem-vindo de volta"
      subtitle="Mantenha-se conectado fazendo login com seu e-mail e senha para acessar sua conta."
      onBack={handleBack}
      footer={
        <AuthFooterLink
          text="Não tem uma conta?"
          linkText="Cadastre-se"
          onPress={() => router.replace('/(auth)/cadastro')}
        />
      }
    >
      <SocialAuthSection
        rememberMe={rememberMe}
        onSuccess={handleSocialSuccess}
        onError={setGeneralError}
      />

      <AuthInput
        label="Endereço de e-mail"
        placeholder="voce@email.com"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          clearFieldError('email');
        }}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
        submitBehavior="submit"
      />

      <AuthInput
        ref={passwordRef}
        label="Senha"
        placeholder="Sua senha"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          clearFieldError('password');
        }}
        error={errors.password}
        isPassword
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="done"
        onSubmitEditing={handleLogin}
      />

      <View style={styles.optionsRow}>
        <AuthCheckbox
          value={rememberMe}
          onValueChange={setRememberMe}
          label="Lembrar de mim"
        />
        <Pressable
          onPress={() => router.push('/(auth)/forgot-password')}
          hitSlop={8}
          accessibilityRole="link"
        >
          <Text style={styles.forgotLink}>Esqueceu a senha?</Text>
        </Pressable>
      </View>

      {!!generalError && (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle-outline" size={18} color={theme.error} />
          <Text style={styles.errorBannerText}>{generalError}</Text>
        </View>
      )}

      <Pressable
        style={({ pressed }) => [
          styles.submit,
          loading && styles.submitDisabled,
          pressed && !loading && styles.submitPressed,
        ]}
        onPress={handleLogin}
        disabled={loading}
        testID="login-submit"
        accessibilityRole="button"
        accessibilityLabel="Entrar"
        accessibilityState={{ disabled: loading, busy: loading }}
      >
        {loading ? (
          <ActivityIndicator color={theme.submitText} />
        ) : (
          <Text style={styles.submitText}>Entrar</Text>
        )}
      </Pressable>
    </AuthScreen>
  );
}

const createStyles = (theme: AuthTheme) =>
  StyleSheet.create({
    optionsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 10,
      marginBottom: 8,
    },
    forgotLink: {
      fontSize: 13,
      fontWeight: '500',
      color: theme.textMuted,
    },
    errorBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 12,
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.errorBannerBorder,
      backgroundColor: theme.errorBannerBackground,
    },
    errorBannerText: {
      flex: 1,
      fontSize: 12.5,
      lineHeight: 17,
      color: theme.error,
    },
    submit: {
      height: 52,
      borderRadius: 26,
      backgroundColor: theme.submit,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 18,
    },
    submitPressed: {
      backgroundColor: theme.submitPressed,
    },
    submitDisabled: {
      opacity: 0.7,
    },
    submitText: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.submitText,
    },
  });
