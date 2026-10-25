import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputInstance } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { AuthScreen, AuthFooterLink } from '@/components/auth/AuthScreen';
import { AuthSubmitButton } from '@/components/auth/AuthSubmitButton';
import { useAuthTheme, type AuthTheme } from '@/constants/authTheme';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 59;

export default function VerifyCodeScreen() {
  const router = useRouter();
  const theme = useAuthTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const params = useLocalSearchParams<{ email?: string }>();

  const inputRef = useRef<TextInputInstance>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);

  const email = typeof params.email === 'string' ? params.email : '';
  const emailLabel = email || 'seu e-mail';
  const activeIndex = Math.min(code.length, OTP_LENGTH - 1);
  const resendLabel =
    seconds > 0 ? `Reenviar (00:${String(seconds).padStart(2, '0')})` : 'Reenviar código';

  useEffect(() => {
    if (seconds === 0) return;

    const timer = setTimeout(() => {
      setSeconds((value) => value - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

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

  const handleCodeChange = (value: string) => {
    setCode(value.replace(/\D/g, '').slice(0, OTP_LENGTH));
    setError('');
  };

  const handleResend = () => {
    if (seconds > 0) return;

    setSeconds(RESEND_SECONDS);
    setCode('');
    setError('');
    inputRef.current?.focus();
  };

  const handleVerify = () => {
    if (code.length !== OTP_LENGTH) {
      setError('Digite o código completo.');
      inputRef.current?.focus();
      return;
    }

    router.push('/(auth)/reset-password');
  };

  const renderGroup = (start: number) => (
    <View style={styles.otpGroup}>
      {Array.from({ length: 3 }).map((_, offset) => {
        const index = start + offset;
        const isActive = isInputFocused && index === activeIndex;

        return (
          <View key={index} style={[styles.otpBox, isActive && styles.otpBoxActive]}>
            <Text style={styles.otpDigit}>{code[index] ?? ''}</Text>
          </View>
        );
      })}
    </View>
  );

  return (
    <AuthScreen
      title="Verificar código"
      subtitle={
        <>
          Digite o código de {OTP_LENGTH} dígitos enviado para{' '}
          <Text style={styles.email}>{emailLabel}</Text>
        </>
      }
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
        <View style={styles.otpContainer}>
          {renderGroup(0)}
          <Text style={styles.otpDivider}>-</Text>
          {renderGroup(3)}

          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={handleCodeChange}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            style={styles.hiddenInput}
            keyboardType="number-pad"
            maxLength={OTP_LENGTH}
            autoFocus
            caretHidden
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            accessibilityLabel={`Código de verificação de ${OTP_LENGTH} dígitos`}
          />
        </View>

        {!!error && <Text style={styles.error}>{error}</Text>}

        <Text style={styles.resendText}>
          Não recebeu o código?{' '}
          <Text
            style={[styles.resendLink, seconds > 0 && styles.resendLinkDisabled]}
            onPress={handleResend}
            accessibilityRole="button"
            accessibilityState={{ disabled: seconds > 0 }}
          >
            {resendLabel}
          </Text>
        </Text>

        <AuthSubmitButton label="Verificar" onPress={handleVerify} />
      </View>
    </AuthScreen>
  );
}

const createStyles = (theme: AuthTheme) =>
  StyleSheet.create({
    form: {
      marginTop: 28,
    },
    email: {
      color: theme.text,
      fontWeight: '600',
    },
    otpContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginTop: 20,
      marginBottom: 16,
      position: 'relative',
    },
    otpGroup: {
      flexDirection: 'row',
      gap: 8,
      flexShrink: 1,
    },
    otpBox: {
      width: 44,
      height: 48,
      minWidth: 34,
      flexShrink: 1,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    otpBoxActive: {
      borderColor: theme.text,
      backgroundColor: theme.surfaceFocused,
    },
    otpDigit: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.text,
    },
    otpDivider: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.textMuted,
    },
    hiddenInput: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      opacity: 0.01,
      color: 'transparent',
      fontSize: 1,
    },
    error: {
      marginTop: -4,
      marginBottom: 12,
      fontSize: 12,
      color: theme.error,
      textAlign: 'center',
    },
    resendText: {
      marginBottom: 32,
      fontSize: 13,
      color: theme.textMuted,
      textAlign: 'center',
    },
    resendLink: {
      color: theme.link,
      fontWeight: '600',
    },
    resendLinkDisabled: {
      color: theme.textFaint,
    },
  });
