import type { LoginDto, RegisterDto, TwoFactorVerifyDto } from '@ROTA-TCC/types';

import { getDeviceId } from '@/services/auth/deviceId';
import {
  parseLoginPayload,
  parseSessionPayload,
  type LoginOutcome,
  type SessionPayload,
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
