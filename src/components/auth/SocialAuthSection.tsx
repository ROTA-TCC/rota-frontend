import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Facebook from 'expo-auth-session/providers/facebook';
import {
  ResponseType,
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
  type AuthSessionResult,
} from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import * as Crypto from 'expo-crypto';

import FacebookIcon from '@/components/social-icons/FacebookIcon';
import GoogleColorIcon from '@/components/social-icons/GoogleColorIcon';
import { useOAuthProviders } from '@/hooks/useOAuthProviders';
import { useAuthTheme, type AuthTheme } from '@/constants/authTheme';
import { useAuth, type SocialAuthResult } from '@/providers/AuthProvider';
import { ApiError } from '@/services/api/interceptors';

import { AuthDivider } from './AuthDivider';

WebBrowser.maybeCompleteAuthSession();

const googleWebClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const googleAndroidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
const googleIosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const facebookAppId = process.env.EXPO_PUBLIC_FACEBOOK_APP_ID ?? '';

const googleClientId =
  Platform.select({
    android: googleAndroidClientId,
    ios: googleIosClientId,
    default: googleWebClientId,
  }) ?? '';

const nativeAppId =
  Platform.select({
    android: Constants.expoConfig?.android?.package,
    ios: Constants.expoConfig?.ios?.bundleIdentifier,
    default: undefined,
  }) ?? 'com.anonymous.rotafrontend';

const googleRedirectUri = makeRedirectUri({
  native: `${nativeAppId}:/oauthredirect`,
});

const googleDiscovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

const googleConfigured = Boolean(googleClientId);
const facebookConfigured = Boolean(facebookAppId);

const getSocialErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    switch (error.errorCode) {
      case 'OAUTH_ACCOUNT_LINK_REQUIRED':
        return 'Já existe uma conta com este e-mail. Entre com e-mail e senha para verificar sua conta e vincular o login social.';
      case 'OAUTH_IDENTITY_ALREADY_LINKED':
        return 'Esta conta social já está vinculada a outro usuário.';
      case 'OAUTH_EMAIL_NOT_VERIFIED':
        return 'O e-mail da conta social não foi verificado pelo provedor.';
      case 'OAUTH_EMAIL_REQUIRED':
        return 'O provedor não retornou um e-mail para esta conta.';
      case 'OAUTH_TOKEN_INVALID':
        return 'Não foi possível validar o token do provedor. Tente novamente.';
      case 'OAUTH_PROVIDER_UNAVAILABLE':
        return 'Este provedor de login social não está disponível no momento.';
      default:
        return error.message;
    }
  }

  return 'Não foi possível concluir o login social. Tente novamente.';
};

interface SocialAuthSectionProps {
  rememberMe?: boolean;
  onSuccess: (result: SocialAuthResult) => void;
  onError?: (message: string) => void;
}

export function SocialAuthSection({
  rememberMe,
  onSuccess,
  onError,
}: SocialAuthSectionProps) {
  const providers = useOAuthProviders(googleConfigured || facebookConfigured);
  const theme = useAuthTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const showError = (message: string) => {
    if (onError) {
      onError(message);
      return;
    }

    Alert.alert('Login social', message);
  };

  const googleEnabled = providers.google && googleConfigured;
  const facebookEnabled = providers.facebook && facebookConfigured;

  if (!googleEnabled && !facebookEnabled) {
    return null;
  }

  return (
    <>
      <View style={styles.container}>
        {googleEnabled && (
          <GoogleSocialButton
            styles={styles}
            theme={theme}
            rememberMe={rememberMe}
            onSuccess={onSuccess}
            onError={showError}
          />
        )}
        {facebookEnabled && (
          <FacebookSocialButton
            styles={styles}
            theme={theme}
            rememberMe={rememberMe}
            onSuccess={onSuccess}
            onError={showError}
          />
        )}
      </View>
      <AuthDivider />
    </>
  );
}

interface SocialButtonProps {
  styles: ReturnType<typeof createStyles>;
  theme: AuthTheme;
  rememberMe?: boolean;
  onSuccess: (result: SocialAuthResult) => void;
  onError: (message: string) => void;
}

function GoogleSocialButton({
  styles,
  theme,
  rememberMe,
  onSuccess,
  onError,
}: SocialButtonProps) {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const handledResponse = useRef<AuthSessionResult | null>(null);
  const isWeb = Platform.OS === 'web';
  const nonce = useMemo(
    () => (isWeb ? Crypto.randomUUID() : undefined),
    [isWeb]
  );

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: googleClientId,
      redirectUri: googleRedirectUri,
      responseType: isWeb ? ResponseType.IdToken : ResponseType.Code,
      scopes: [
        'openid',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
      usePKCE: !isWeb,
      extraParams: isWeb ? { nonce: nonce ?? '' } : undefined,
    },
    googleDiscovery
  );

  useEffect(() => {
    if (!response || response === handledResponse.current) return;

    if (response.type === 'success') {
      handledResponse.current = response;
      const idToken = response.params.id_token || response.authentication?.idToken;

      if (idToken) {
        void (async () => {
          try {
            const result = await loginWithGoogle(idToken, rememberMe);
            onSuccess(result);
          } catch (error) {
            onError(getSocialErrorMessage(error));
          } finally {
            setLoading(false);
          }
        })();
        return;
      }

      if (isWeb) {
        setLoading(false);
        onError('Não foi possível obter o token do Google.');
        return;
      }

      const code = response.params.code;
      const codeVerifier = request?.codeVerifier;

      if (!code || !codeVerifier) {
        setLoading(false);
        onError('Não foi possível obter o código do Google.');
        return;
      }

      void (async () => {
        try {
          const tokenResponse = await exchangeCodeAsync(
            {
              clientId: googleClientId,
              code,
              redirectUri: googleRedirectUri,
              extraParams: { code_verifier: codeVerifier },
            },
            googleDiscovery
          );
          const exchangedIdToken = tokenResponse.idToken;

          if (!exchangedIdToken) {
            onError('Não foi possível obter o token do Google.');
            return;
          }

          const result = await loginWithGoogle(exchangedIdToken, rememberMe);
          onSuccess(result);
        } catch (error) {
          onError(getSocialErrorMessage(error));
        } finally {
          setLoading(false);
        }
      })();
      return;
    }

    if (response.type === 'error') {
      handledResponse.current = response;
      setLoading(false);
      onError(getSocialErrorMessage(response.error));
      return;
    }

    if (
      response.type === 'cancel' ||
      response.type === 'dismiss' ||
      response.type === 'locked'
    ) {
      handledResponse.current = response;
      setLoading(false);
    }
  }, [isWeb, loginWithGoogle, onError, onSuccess, rememberMe, request, response]);

  const handlePress = async () => {
    setLoading(true);
    try {
      await promptAsync();
    } catch (error) {
      setLoading(false);
      onError(getSocialErrorMessage(error));
    }
  };

  return (
    <SocialButtonView
      provider="google"
      loading={loading}
      disabled={!request}
      onPress={handlePress}
      styles={styles}
      theme={theme}
    />
  );
}

function FacebookSocialButton({
  styles,
  theme,
  rememberMe,
  onSuccess,
  onError,
}: SocialButtonProps) {
  const { loginWithFacebook } = useAuth();
  const [loading, setLoading] = useState(false);
  const handledResponse = useRef<AuthSessionResult | null>(null);

  const [request, response, promptAsync] = Facebook.useAuthRequest({
    clientId: facebookAppId,
    responseType: ResponseType.Token,
  });

  useEffect(() => {
    if (!response || response === handledResponse.current) return;

    if (response.type === 'success') {
      handledResponse.current = response;
      const accessToken =
        response.authentication?.accessToken || response.params.access_token;

      if (!accessToken) {
        setLoading(false);
        onError('Não foi possível obter o token do Facebook.');
        return;
      }

      void (async () => {
        try {
          const result = await loginWithFacebook({ accessToken }, rememberMe);
          onSuccess(result);
        } catch (error) {
          onError(getSocialErrorMessage(error));
        } finally {
          setLoading(false);
        }
      })();
      return;
    }

    if (response.type === 'error') {
      handledResponse.current = response;
      setLoading(false);
      onError(getSocialErrorMessage(response.error));
      return;
    }

    if (
      response.type === 'cancel' ||
      response.type === 'dismiss' ||
      response.type === 'locked'
    ) {
      handledResponse.current = response;
      setLoading(false);
    }
  }, [loginWithFacebook, onError, onSuccess, rememberMe, response]);

  const handlePress = async () => {
    setLoading(true);
    try {
      await promptAsync();
    } catch (error) {
      setLoading(false);
      onError(getSocialErrorMessage(error));
    }
  };

  return (
    <SocialButtonView
      provider="facebook"
      loading={loading}
      disabled={!request}
      onPress={handlePress}
      styles={styles}
      theme={theme}
    />
  );
}

interface SocialButtonViewProps {
  provider: 'google' | 'facebook';
  loading: boolean;
  disabled: boolean;
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
  theme: AuthTheme;
}

function SocialButtonView({
  provider,
  loading,
  disabled,
  onPress,
  styles,
  theme,
}: SocialButtonViewProps) {
  const label = provider === 'google' ? 'Google' : 'Facebook';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled && styles.buttonPressed,
        (loading || disabled) && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={loading || disabled}
      accessibilityRole="button"
      accessibilityLabel={`Continuar com ${label}`}
      accessibilityState={{ disabled: loading || disabled, busy: loading }}
      testID={`social-${provider}`}
    >
      {loading ? (
        <ActivityIndicator size="small" color={theme.text} />
      ) : provider === 'google' ? (
        <GoogleColorIcon size={18} />
      ) : (
        <FacebookIcon size={18} color={theme.text} />
      )}
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

const createStyles = (theme: AuthTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 22,
    },
    button: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      height: 48,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
    },
    buttonPressed: {
      backgroundColor: theme.surfacePressed,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
    },
  });
