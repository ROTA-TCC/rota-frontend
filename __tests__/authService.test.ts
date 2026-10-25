import {
  login,
  register,
  verifyTwoFactor,
} from '@/services/api/authService';
import { ApiError } from '@/services/api/interceptors';

jest.mock('@/services/api/client', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

jest.mock('@/services/auth/tokenStorage', () => ({
  tokenStorage: {
    getAccessToken: jest.fn(),
    getRefreshToken: jest.fn(),
    setTokens: jest.fn(),
    clear: jest.fn(),
  },
}));

jest.mock('@/services/auth/deviceId', () => ({
  getDeviceId: jest.fn(() => Promise.resolve('device-id')),
}));

const api = jest.requireMock('@/services/api/client') as {
  default: { post: jest.Mock };
};

const user = { id: '1', email: 'ana@example.com', alias: 'Ana' };

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('login envia device ID e parseia a sessão', async () => {
    api.default.post.mockResolvedValue({
      data: {
        success: true,
        data: {
          accessToken: 'access',
          refreshToken: 'refresh',
          user,
        },
      },
    });

    const outcome = await login({
      email: 'ana@example.com',
      password: 'senha',
      rememberMe: true,
    });

    expect(api.default.post).toHaveBeenCalledWith(
      '/auth/login',
      { email: 'ana@example.com', password: 'senha', rememberMe: true },
      { headers: { 'X-Device-Id': 'device-id' } }
    );
    expect(outcome).toEqual({
      type: 'session',
      session: { accessToken: 'access', refreshToken: 'refresh', user },
    });
  });

  test('login identifica exigência de 2FA', async () => {
    api.default.post.mockResolvedValue({
      data: { data: { requires2fa: true, partialToken: 'partial' } },
    });

    await expect(
      login({ email: 'ana@example.com', password: 'senha' })
    ).resolves.toEqual({ type: 'two-factor', partialToken: 'partial' });
  });

  test('login rejeita resposta inválida', async () => {
    api.default.post.mockResolvedValue({ data: { data: {} } });

    await expect(
      login({ email: 'ana@example.com', password: 'senha' })
    ).rejects.toBeInstanceOf(ApiError);
  });

  test('verifyTwoFactor envia partialToken, código e device ID', async () => {
    api.default.post.mockResolvedValue({
      data: {
        data: { accessToken: 'access', refreshToken: 'refresh', user },
      },
    });

    const session = await verifyTwoFactor({
      partialToken: 'partial',
      code: '123456',
    });

    expect(api.default.post).toHaveBeenCalledWith(
      '/auth/verify-2fa',
      { partialToken: 'partial', code: '123456' },
      { headers: { 'X-Device-Id': 'device-id' } }
    );
    expect(session).toMatchObject({
      accessToken: 'access',
      refreshToken: 'refresh',
    });
  });

  test('register envia os dados cadastrais', async () => {
    api.default.post.mockResolvedValue({ data: { success: true } });

    await register({
      alias: 'Ana',
      email: 'ana@example.com',
      password: 'senha',
    });

    expect(api.default.post).toHaveBeenCalledWith('/auth/register', {
      alias: 'Ana',
      email: 'ana@example.com',
      password: 'senha',
    });
  });
});
