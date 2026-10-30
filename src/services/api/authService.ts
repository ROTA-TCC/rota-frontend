import type { LoginDto, RegisterDto, TwoFactorVerifyDto } from '@ROTA-TCC/types';

import { getDeviceId } from '@/services/auth/deviceId';
import {
  parseLoginPayload,
  parseSessionPayload,
  parseSocialLoginPayload,
  parseSocialSessionPayload,
  type LoginOutcome,
  type SessionPayload,
  type SocialLoginOutcome,
  type SocialSessionPayload,
} from '@/services/auth/session';

import api from './client';
import { ApiError } from './interceptors';

const getMobileHeaders = async () => ({
  'X-Device-Id': await getDeviceId(),
});

export const login = async (data: LoginDto): Promise<LoginOutcome> => {
  const response = await api.post('/auth/login', data, {
    headers: await getMobileHeaders(),
  });
  const outcome = parseLoginPayload(response.data);

  if (!outcome) {
    throw new ApiError('Resposta de autenticação inválida.');
  }

  return outcome;
};

export const register = async (data: RegisterDto): Promise<void> => {
  await api.post('/auth/register', data);
};

export const verifyTwoFactor = async (
  data: TwoFactorVerifyDto
): Promise<SessionPayload> => {
  const response = await api.post('/auth/verify-2fa', data, {
    headers: await getMobileHeaders(),
  });
  const session = parseSessionPayload(response.data);

  if (!session) {
    throw new ApiError('Resposta de autenticação inválida.');
  }

  return session;
};

export interface OAuthProviders {
  google: boolean;
  facebook: boolean;
}

export interface FacebookMobileLoginDto {
  accessToken?: string;
  idToken?: string;
  nonce?: string;
}

export const getOAuthProviders = async (): Promise<OAuthProviders> => {
  const response = await api.get('/auth/oauth/providers');
  const body = response.data;
  const data = body?.data ?? body ?? {};

  return {
    google: data.google === true,
    facebook: data.facebook === true,
  };
};

export const loginWithGoogle = async (
  idToken: string,
  rememberMe = false
): Promise<SocialLoginOutcome> => {
  const response = await api.post(
    '/auth/oauth/google/mobile',
    { idToken, rememberMe },
    { headers: await getMobileHeaders() }
  );
  const outcome = parseSocialLoginPayload(response.data);

  if (!outcome) {
    throw new ApiError('Resposta de autenticação inválida.');
  }

  return outcome;
};

export const loginWithFacebook = async (
  data: FacebookMobileLoginDto,
  rememberMe = false
): Promise<SocialLoginOutcome> => {
  const response = await api.post(
    '/auth/oauth/facebook/mobile',
    { ...data, rememberMe },
    { headers: await getMobileHeaders() }
  );
  const outcome = parseSocialLoginPayload(response.data);

  if (!outcome) {
    throw new ApiError('Resposta de autenticação inválida.');
  }

  return outcome;
};

export const verifySocialTwoFactor = async (
  data: TwoFactorVerifyDto
): Promise<SocialSessionPayload> => {
  const response = await api.post('/auth/oauth/2fa/verify', data, {
    headers: await getMobileHeaders(),
  });
  const session = parseSocialSessionPayload(response.data);

  if (!session) {
    throw new ApiError('Resposta de autenticação inválida.');
  }

  return session;
};
