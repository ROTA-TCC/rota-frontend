import { ApiError } from '@/services/api/interceptors';
import {
  logoutSession,
  refreshAccessToken,
  refreshSession,
} from '@/services/auth/sessionManager';

jest.mock('@/services/api/client', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

jest.mock('@/services/auth/deviceId', () => ({
  getDeviceId: jest.fn(() => Promise.resolve('device-id')),
}));

jest.mock('@/services/auth/tokenStorage', () => ({
  tokenStorage: {
    getAccessToken: jest.fn(),
    getRefreshToken: jest.fn(),
    setTokens: jest.fn(),
    clear: jest.fn(),
  },
}));

const api = jest.requireMock('@/services/api/client') as {
  default: { post: jest.Mock };
};

const storage = jest.requireMock('@/services/auth/tokenStorage') as {
  tokenStorage: {
    getAccessToken: jest.Mock;
    getRefreshToken: jest.Mock;
    setTokens: jest.Mock;
    clear: jest.Mock;
  };
};

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('sessionManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    storage.tokenStorage.getRefreshToken.mockResolvedValue('refresh-old');
    storage.tokenStorage.setTokens.mockResolvedValue(undefined);
    storage.tokenStorage.clear.mockResolvedValue(undefined);
  });

  test('faz refresh com rotação e persiste os novos tokens', async () => {
    api.default.post.mockResolvedValue({
      data: {
        success: true,
        data: {
          accessToken: 'access-new',
          refreshToken: 'refresh-new',
          user: { id: '1', email: 'ana@example.com', alias: 'Ana' },
        },
      },
    });

    const result = await refreshSession();

    expect(api.default.post).toHaveBeenCalledWith(
      '/auth/refresh',
      { refreshToken: 'refresh-old' },
      { headers: { 'X-Device-Id': 'device-id' } }
    );
    expect(result).toMatchObject({
      accessToken: 'access-new',
      refreshToken: 'refresh-new',
    });
    expect(storage.tokenStorage.setTokens).toHaveBeenCalledWith(
      expect.objectContaining({
        accessToken: 'access-new',
        refreshToken: 'refresh-new',
      })
    );
  });

  test('compartilha uma única chamada de refresh entre requisições concorrentes', async () => {
    let resolvePost: (value: unknown) => void = () => undefined;
    api.default.post.mockReturnValue(
      new Promise((resolve) => {
        resolvePost = resolve;
      })
    );

    const first = refreshSession();
    const second = refreshSession();

    await flush();
    expect(api.default.post).toHaveBeenCalledTimes(1);

    resolvePost({
      data: {
        data: { accessToken: 'access-new', refreshToken: 'refresh-new' },
      },
    });

    await expect(first).resolves.toMatchObject({
      accessToken: 'access-new',
      refreshToken: 'refresh-new',
    });
    await expect(second).resolves.toMatchObject({
      accessToken: 'access-new',
      refreshToken: 'refresh-new',
    });
    expect(api.default.post).toHaveBeenCalledTimes(1);
  });

  test('refreshAccessToken retorna apenas o access token', async () => {
    api.default.post.mockResolvedValue({
      data: { accessToken: 'access-new', refreshToken: 'refresh-new' },
    });

    await expect(refreshAccessToken()).resolves.toBe('access-new');
  });

  test('limpa a sessão quando o refresh é rejeitado com 401', async () => {
    api.default.post.mockRejectedValue(new ApiError('expirado', 401));

    await expect(refreshSession()).resolves.toBeNull();
    expect(storage.tokenStorage.clear).toHaveBeenCalled();
  });

  test('não limpa a sessão em falha de rede', async () => {
    api.default.post.mockRejectedValue(new ApiError('sem conexão'));

    await expect(refreshSession()).rejects.toThrow('sem conexão');
    expect(storage.tokenStorage.clear).not.toHaveBeenCalled();
  });

  test('não chama o backend quando não há refresh token', async () => {
    storage.tokenStorage.getRefreshToken.mockResolvedValue(null);

    await expect(refreshSession()).resolves.toBeNull();
    expect(api.default.post).not.toHaveBeenCalled();
  });

  test('logout revoga no backend e limpa os tokens locais', async () => {
    api.default.post.mockResolvedValue({ data: {} });

    await logoutSession();

    expect(api.default.post).toHaveBeenCalledWith(
      '/auth/logout',
      { refreshToken: 'refresh-old' },
      { headers: { 'X-Device-Id': 'device-id' } }
    );
    expect(storage.tokenStorage.clear).toHaveBeenCalled();
  });

  test('logout limpa os tokens locais mesmo se o backend falhar', async () => {
    api.default.post.mockRejectedValue(new ApiError('sem conexão'));

    await logoutSession();

    expect(storage.tokenStorage.clear).toHaveBeenCalled();
  });

  test('descarta refresh concluído depois do logout', async () => {
    let resolveRefresh: (value: unknown) => void = () => undefined;

    api.default.post.mockImplementation((url: string) => {
      if (url === '/auth/refresh') {
        return new Promise((resolve) => {
          resolveRefresh = resolve;
        });
      }

      return Promise.resolve({ data: {} });
    });

    const pendingRefresh = refreshSession();
    await flush();

    await logoutSession();
    resolveRefresh({
      data: {
        data: { accessToken: 'stale-access', refreshToken: 'stale-refresh' },
      },
    });

    await expect(pendingRefresh).resolves.toBeNull();
    expect(storage.tokenStorage.setTokens).not.toHaveBeenCalled();
  });
});
