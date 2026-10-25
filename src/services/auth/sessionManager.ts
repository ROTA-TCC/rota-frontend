import api from '@/services/api/client';
import { ApiError } from '@/services/api/interceptors';
import { devLog, devWarn } from '@/utils/devLog';

import { getDeviceId } from './deviceId';
import { parseSessionPayload, type SessionPayload } from './session';
import { tokenStorage } from './tokenStorage';

let refreshInFlight: Promise<SessionPayload | null> | null = null;
let sessionGeneration = 0;

const isUnauthorized = (error: unknown) =>
  error instanceof ApiError && (error.status === 401 || error.status === 403);

const performRefresh = async (): Promise<SessionPayload | null> => {
  const generation = sessionGeneration;
  const refreshToken = await tokenStorage.getRefreshToken();
  if (!refreshToken) return null;

  const deviceId = await getDeviceId();

  try {
    const response = await api.post(
      '/auth/refresh',
      { refreshToken },
      { headers: { 'X-Device-Id': deviceId } }
    );

    const session = parseSessionPayload(response.data);
    if (!session) {
      devWarn('auth', 'refresh retornou payload invalido');
      await tokenStorage.clear();
      return null;
    }

    if (generation !== sessionGeneration) {
      devWarn('auth', 'refresh descartado apos troca de sessao');
      return null;
    }

    await tokenStorage.setTokens(session);

    if (generation !== sessionGeneration) {
      await tokenStorage.clear();
      return null;
    }

    devLog('auth', 'refresh concluido');
    return session;
  } catch (error) {
    if (isUnauthorized(error)) {
      devWarn('auth', 'refresh rejeitado pelo servidor');
      await tokenStorage.clear();
      return null;
    }

    devWarn('auth', 'refresh falhou', {
      status: error instanceof ApiError ? error.status : undefined,
    });
    throw error;
  }
};

export const refreshSession = (): Promise<SessionPayload | null> => {
  if (!refreshInFlight) {
    const pending = performRefresh();
    refreshInFlight = pending;
    void pending.finally(() => {
      if (refreshInFlight === pending) {
        refreshInFlight = null;
      }
    }).catch(() => undefined);
  }

  return refreshInFlight;
};

export const refreshAccessToken = async (): Promise<string | null> => {
  const session = await refreshSession();
  return session?.accessToken ?? null;
};

export const restoreSession = async (): Promise<SessionPayload | null> => {
  const refreshToken = await tokenStorage.getRefreshToken();
  if (!refreshToken) return null;
  return refreshSession();
};

export const hasStoredSession = async (): Promise<boolean> => {
  try {
    return Boolean(await tokenStorage.getRefreshToken());
  } catch {
    return false;
  }
};

export const saveSession = async (session: SessionPayload): Promise<void> => {
  sessionGeneration += 1;
  refreshInFlight = null;
  await tokenStorage.setTokens(session);
};

export const logoutSession = async (): Promise<void> => {
  sessionGeneration += 1;
  refreshInFlight = null;
  const refreshToken = await tokenStorage.getRefreshToken();

  try {
    if (refreshToken) {
      const deviceId = await getDeviceId();
      await api.post(
        '/auth/logout',
        { refreshToken },
        { headers: { 'X-Device-Id': deviceId } }
      );
    }
  } catch (error) {
    devWarn('auth', 'logout remoto falhou', {
      status: error instanceof ApiError ? error.status : undefined,
    });
  } finally {
    await tokenStorage.clear();
  }
};

export const clearSession = async (): Promise<void> => {
  sessionGeneration += 1;
  refreshInFlight = null;
  await tokenStorage.clear();
};
