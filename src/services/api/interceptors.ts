import {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  isAxiosError,
} from 'axios';

import { tokenStorage } from '@/services/auth/tokenStorage';
import { devLog } from '@/utils/devLog';

export class ApiError extends Error {
  constructor(
    public message: string,
    public status?: number,
    public field?: string,
    public data?: unknown,
    public errorCode?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const PUBLIC_AUTH_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/verify-2fa',
  '/auth/refresh',
  '/auth/logout',
  '/auth/oauth/providers',
  '/auth/oauth/google/mobile',
  '/auth/oauth/facebook/mobile',
  '/auth/oauth/2fa/verify',
  '/auth/password/forgot',
  '/auth/password/reset',
  '/auth/security/verify-email',
];

const normalizePath = (url?: string) =>
  (url?.split('?')[0] ?? '').replace(/\/+$/, '');

export const isPublicAuthRequest = (url?: string) => {
  const path = normalizePath(url);
  return PUBLIC_AUTH_PATHS.includes(path);
};

let logoutHandler: (() => void) | null = null;
let refreshHandler: (() => Promise<string | null>) | null = null;

export const setLogoutHandler = (handler: () => void) => {
  logoutHandler = handler;
};

export const setRefreshHandler = (handler: () => Promise<string | null>) => {
  refreshHandler = handler;
};

const normalizeMessage = (message: unknown, fallback: string) => {
  if (Array.isArray(message)) {
    const parts = message.filter((item): item is string => typeof item === 'string');
    return parts.length > 0 ? parts.join(' ') : fallback;
  }

  return typeof message === 'string' && message.trim() ? message : fallback;
};

const toApiError = (error: AxiosError): ApiError => {
  if (!error.response) {
    return new ApiError('Erro de conexão. Verifique sua internet.');
  }

  const { status, data } = error.response;
  const payload = (data ?? {}) as {
    message?: unknown;
    field?: unknown;
    errorCode?: unknown;
  };
  const field = typeof payload.field === 'string' ? payload.field : undefined;
  const errorCode = typeof payload.errorCode === 'string' ? payload.errorCode : undefined;

  switch (status) {
    case 400:
      return new ApiError(
        normalizeMessage(payload.message, 'Requisição inválida.'),
        status,
        field,
        data,
        errorCode
      );
    case 401:
      return new ApiError(
        normalizeMessage(payload.message, 'Sessão expirada. Faça login novamente.'),
        status,
        field,
        data,
        errorCode
      );
    case 403:
      return new ApiError(
        normalizeMessage(payload.message, 'Você não tem permissão para esta ação.'),
        status,
        field,
        data,
        errorCode
      );
    case 404:
      return new ApiError(
        normalizeMessage(payload.message, 'Recurso não encontrado.'),
        status,
        field,
        data,
        errorCode
      );
    case 429:
      return new ApiError(
        normalizeMessage(payload.message, 'Muitas tentativas. Aguarde 1 minuto.'),
        status,
        field,
        data,
        errorCode
      );
    case 500:
      return new ApiError(
        'Erro interno no servidor. Tente novamente mais tarde.',
        status,
        field,
        data,
        errorCode
      );
    default:
      return new ApiError(
        normalizeMessage(payload.message, 'Ocorreu um erro inesperado.'),
        status,
        field,
        data,
        errorCode
      );
  }
};

export const setupInterceptors = (api: AxiosInstance) => {
  api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      if (!isPublicAuthRequest(config.url) && !config.headers.Authorization) {
        const token = await tokenStorage.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as
        | (InternalAxiosRequestConfig & { _retry?: boolean })
        | undefined;
      const url = originalRequest?.url;
      const isPublicAuth = isPublicAuthRequest(url);

      if (
        originalRequest &&
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !isPublicAuth
      ) {
        originalRequest._retry = true;

        try {
          const newToken = refreshHandler ? await refreshHandler() : null;

          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            devLog('api', 'requisicao repetida apos refresh', {
              method: originalRequest.method,
              url,
            });
            return api(originalRequest);
          }

          await tokenStorage.clear();
          logoutHandler?.();
          throw new ApiError('Sessão expirada. Faça login novamente.', 401);
        } catch (refreshError) {
          if (refreshError instanceof ApiError) {
            throw refreshError;
          }
          if (isAxiosError(refreshError)) {
            throw toApiError(refreshError);
          }
          throw refreshError;
        }
      }

      if (originalRequest?._retry && error.response?.status === 401) {
        await tokenStorage.clear();
        logoutHandler?.();
        throw new ApiError('Sessão expirada. Faça login novamente.', 401);
      }

      if (error.response) {
        throw toApiError(error);
      }

      if (error.request) {
        throw new ApiError('Erro de conexão. Verifique sua internet.');
      }

      throw error;
    }
  );
};
