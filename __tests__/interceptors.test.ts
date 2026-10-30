import axios, {
  AxiosError,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

import {
  ApiError,
  setLogoutHandler,
  setRefreshHandler,
  setupInterceptors,
} from '@/services/api/interceptors';
import { tokenStorage } from '@/services/auth/tokenStorage';

jest.mock('@/services/auth/tokenStorage', () => ({
  tokenStorage: {
    getAccessToken: jest.fn(),
    clear: jest.fn(),
  },
}));

const storage = tokenStorage as unknown as {
  getAccessToken: jest.Mock;
  clear: jest.Mock;
};

const response = (
  config: InternalAxiosRequestConfig,
  status: number,
  data: unknown
): AxiosResponse => ({
  data,
  status,
  statusText: String(status),
  headers: {},
  config,
});

const rejectWith = (
  config: InternalAxiosRequestConfig,
  status: number,
  data: unknown
) =>
  Promise.reject(
    new AxiosError(
      'Request failed',
      AxiosError.ERR_BAD_REQUEST,
      config,
      undefined,
      response(config, status, data)
    )
  );

const createApi = (adapter: AxiosAdapter) => {
  const api = axios.create({ baseURL: 'https://api.test', adapter });
  setupInterceptors(api);
  return api;
};

describe('interceptors', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    storage.getAccessToken.mockResolvedValue('old-token');
    storage.clear.mockResolvedValue(undefined);
    setRefreshHandler(jest.fn().mockResolvedValue(null));
    setLogoutHandler(jest.fn());
  });

  test('renova o token e repete a requisição protegida', async () => {
    const adapter = jest
      .fn()
      .mockImplementationOnce((config: InternalAxiosRequestConfig) =>
        rejectWith(config, 401, { message: 'expirado' })
      )
      .mockImplementationOnce(async (config: InternalAxiosRequestConfig) =>
        response(config, 200, { ok: true })
      );
    const api = createApi(adapter);
    const refresh = jest.fn().mockResolvedValue('new-token');
    setRefreshHandler(refresh);

    const result = await api.get('/runs');

    expect(result.data).toEqual({ ok: true });
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(adapter).toHaveBeenCalledTimes(2);

    const retryConfig = adapter.mock.calls[1][0] as InternalAxiosRequestConfig;
    expect(retryConfig.headers.Authorization).toBe('Bearer new-token');
  });

  test('não tenta refresh em rota pública de autenticação', async () => {
    const adapter = jest.fn((config: InternalAxiosRequestConfig) =>
      rejectWith(config, 401, { message: 'Credenciais inválidas' })
    );
    const api = createApi(adapter);
    const refresh = jest.fn();
    const logout = jest.fn();
    setRefreshHandler(refresh);
    setLogoutHandler(logout);

    await expect(api.post('/auth/login', {})).rejects.toMatchObject({
      status: 401,
      message: 'Credenciais inválidas',
    });

    expect(refresh).not.toHaveBeenCalled();
    expect(logout).not.toHaveBeenCalled();
    expect(storage.clear).not.toHaveBeenCalled();
  });

  test.each([
    '/auth/oauth/providers',
    '/auth/oauth/google/mobile',
    '/auth/oauth/facebook/mobile',
    '/auth/oauth/2fa/verify',
  ])('não tenta refresh em rota pública OAuth %s', async (path) => {
    const adapter = jest.fn((config: InternalAxiosRequestConfig) =>
      rejectWith(config, 401, { message: 'Token inválido' })
    );
    const api = createApi(adapter);
    const refresh = jest.fn();
    const logout = jest.fn();
    setRefreshHandler(refresh);
    setLogoutHandler(logout);

    await expect(api.post(path, {})).rejects.toMatchObject({
      status: 401,
      message: 'Token inválido',
    });

    expect(refresh).not.toHaveBeenCalled();
    expect(logout).not.toHaveBeenCalled();
    expect(storage.clear).not.toHaveBeenCalled();
  });

  test('encerra a sessão quando o refresh retorna null', async () => {
    const adapter = jest.fn((config: InternalAxiosRequestConfig) =>
      rejectWith(config, 401, { message: 'expirado' })
    );
    const api = createApi(adapter);
    const logout = jest.fn();
    setRefreshHandler(jest.fn().mockResolvedValue(null));
    setLogoutHandler(logout);

    await expect(api.get('/runs')).rejects.toMatchObject({ status: 401 });

    expect(storage.clear).toHaveBeenCalled();
    expect(logout).toHaveBeenCalledTimes(1);
  });

  test('não encerra a sessão quando o refresh falha por rede', async () => {
    const adapter = jest.fn((config: InternalAxiosRequestConfig) =>
      rejectWith(config, 401, { message: 'expirado' })
    );
    const api = createApi(adapter);
    const logout = jest.fn();
    setRefreshHandler(
      jest.fn().mockRejectedValue(
        new ApiError('Erro de conexão. Verifique sua internet.')
      )
    );
    setLogoutHandler(logout);

    await expect(api.get('/runs')).rejects.toMatchObject({
      message: 'Erro de conexão. Verifique sua internet.',
    });

    expect(storage.clear).not.toHaveBeenCalled();
    expect(logout).not.toHaveBeenCalled();
  });
});
