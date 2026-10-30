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
import { AuthSwitch } from '@/components/auth/AuthSwitch';
import { SocialAuthSection } from '@/components/auth/SocialAuthSection';
import { useAuthTheme, type AuthTheme } from '@/constants/authTheme';
import { useAuth, type SocialAuthResult } from '@/providers/AuthProvider';
import { ApiError } from '@/services/api/interceptors';
import { hasErrors, validateRegisterForm, type AuthFormErrors } from '@/utils/validation';

export default function CadastroScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const theme = useAuthTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [alias, setAlias] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const emailRef = useRef<TextInputInstance>(null);
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
    setGeneralError('Não foi possível criar sua conta. Tente novamente.');
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

  const handleRegister = async () => {
    const validationErrors = validateRegisterForm({
      alias,
      email,
      password,
      acceptedTerms,
    });
    setErrors(validationErrors);
    setGeneralError('');

    if (hasErrors(validationErrors)) return;

    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const outcome = await register(alias.trim(), normalizedEmail, password);

      if (outcome === 'two-factor') {
        router.push({
          pathname: '/(auth)/two-factor',
          params: { email: normalizedEmail },
        });
        return;
      }

      router.replace('/(auth)/profile-info');
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreen
      title="Crie sua conta"
      subtitle="Informe seu nome completo, e-mail e senha para criar sua conta e começar."
      onBack={handleBack}
      footer={
        <AuthFooterLink
          text="Já tem uma conta?"
          linkText="Entrar"
          onPress={() => router.replace('/(auth)/login')}
        />
      }
    >
      <SocialAuthSection
        onSuccess={handleSocialSuccess}
        onError={setGeneralError}
      />

      <AuthInput
        label="Nome completo"
        placeholder="Seu nome completo"
        value={alias}
        onChangeText={(text) => {
          setAlias(text);
          clearFieldError('alias');
        }}
        error={errors.alias}
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        returnKeyType="next"
        onSubmitEditing={() => emailRef.current?.focus()}
        submitBehavior="submit"
      />

      <AuthInput
        ref={emailRef}
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
        placeholder="Mínimo de 8 caracteres"
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
        returnKeyType="done"
        onSubmitEditing={handleRegister}
      />

      <View style={styles.termsRow}>
        <AuthSwitch
          value={acceptedTerms}
          onValueChange={(value) => {
            setAcceptedTerms(value);
            clearFieldError('acceptedTerms');
          }}
          accessibilityLabel="Aceitar termos e política de privacidade"
        />
        <Text style={styles.termsText}>
          Concordo com os <Text style={styles.termsStrong}>Termos e Política de Privacidade</Text>
        </Text>
      </View>
      {!!errors.acceptedTerms && <Text style={styles.termsError}>{errors.acceptedTerms}</Text>}

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
        onPress={handleRegister}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel="Cadastre-se"
        accessibilityState={{ disabled: loading, busy: loading }}
      >
        {loading ? (
          <ActivityIndicator color={theme.submitText} />
        ) : (
          <Text style={styles.submitText}>Cadastre-se</Text>
        )}
      </Pressable>
    </AuthScreen>
  );
}

const createStyles = (theme: AuthTheme) =>
  StyleSheet.create({
    termsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginTop: 4,
      marginBottom: 4,
    },
    termsText: {
      flex: 1,
      fontSize: 12,
      lineHeight: 16,
      color: theme.textMuted,
    },
    termsStrong: {
      color: theme.text,
      fontWeight: '600',
    },
    termsError: {
      marginTop: 4,
      marginLeft: 4,
      fontSize: 12,
      color: theme.error,
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
