import React, { type ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';

import { AuthProvider, useAuth } from '../src/providers/AuthProvider';

const mockRouter = {
  replace: jest.fn(),
  push: jest.fn(),
};

jest.mock('expo-router', () => ({
  useRouter: () => mockRouter,
}));

jest.mock('@/services/api/authService', () => ({
  login: jest.fn(),
  loginWithFacebook: jest.fn(),
  loginWithGoogle: jest.fn(),
  register: jest.fn(),
  verifySocialTwoFactor: jest.fn(),
  verifyTwoFactor: jest.fn(),
}));

jest.mock('@/services/auth/sessionManager', () => ({
  clearSession: jest.fn(),
  hasStoredSession: jest.fn(),
  logoutSession: jest.fn(),
  refreshAccessToken: jest.fn(),
  restoreSession: jest.fn(),
  saveSession: jest.fn(),
}));

jest.mock('@/services/api/interceptors', () => ({
  ApiError: class ApiError extends Error {
    status?: number;

    constructor(message: string, status?: number) {
      super(message);
      this.status = status;
      this.name = 'ApiError';
    }
  },
  setLogoutHandler: jest.fn(),
  setRefreshHandler: jest.fn(),
}));

const authService = jest.requireMock('@/services/api/authService') as {
  login: jest.Mock;
  loginWithFacebook: jest.Mock;
  loginWithGoogle: jest.Mock;
  register: jest.Mock;
  verifySocialTwoFactor: jest.Mock;
  verifyTwoFactor: jest.Mock;
};

const sessionManager = jest.requireMock('@/services/auth/sessionManager') as {
  clearSession: jest.Mock;
  hasStoredSession: jest.Mock;
  logoutSession: jest.Mock;
  refreshAccessToken: jest.Mock;
  restoreSession: jest.Mock;
  saveSession: jest.Mock;
};

const interceptors = jest.requireMock('@/services/api/interceptors') as {
  setLogoutHandler: jest.Mock;
  setRefreshHandler: jest.Mock;
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

const loginData = {
  email: 'ana@example.com',
  password: 'senha-segura',
  rememberMe: true,
};

const session = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  user: {
    id: 'user-id',
    email: 'ana@example.com',
    alias: 'Ana',
  },
};

const renderAuth = async () => {
  const hook = await renderHook(() => useAuth(), { wrapper });
  await waitFor(() => {
    expect(hook.result.current.status).not.toBe('bootstrapping');
  });
  return hook;
};

describe('fluxo de autenticação', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionManager.restoreSession.mockResolvedValue(null);
    sessionManager.hasStoredSession.mockResolvedValue(false);
    sessionManager.saveSession.mockResolvedValue(undefined);
    sessionManager.logoutSession.mockResolvedValue(undefined);
    sessionManager.clearSession.mockResolvedValue(undefined);
    sessionManager.refreshAccessToken.mockResolvedValue(null);
  });

  test('faz login, persiste a sessão e autentica', async () => {
    authService.login.mockResolvedValue({ type: 'session', session });

    const { result } = await renderAuth();

    expect(result.current.status).toBe('unauthenticated');

    let outcome: string | undefined;
    await act(async () => {
      outcome = await result.current.login(loginData);
    });

    expect(outcome).toBe('authenticated');
    expect(authService.login).toHaveBeenCalledWith(loginData);
    expect(sessionManager.saveSession).toHaveBeenCalledWith(session);
    expect(result.current.status).toBe('authenticated');
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(session.user);
  });

  test('restaura a sessão no bootstrap', async () => {
    sessionManager.restoreSession.mockResolvedValue(session);

    const { result } = await renderAuth();

    expect(sessionManager.restoreSession).toHaveBeenCalled();
    expect(result.current.status).toBe('authenticated');
    expect(result.current.user).toEqual(session.user);
  });

  test('mantém deslogado quando o bootstrap não encontra sessão', async () => {
    sessionManager.restoreSession.mockResolvedValue(null);

    const { result } = await renderAuth();

    expect(result.current.status).toBe('unauthenticated');
    expect(result.current.user).toBeNull();
  });

  test('mantém autenticado quando o bootstrap falha por rede e há sessão salva', async () => {
    sessionManager.restoreSession.mockRejectedValue(new Error('offline'));
    sessionManager.hasStoredSession.mockResolvedValue(true);

    const { result } = await renderAuth();

    expect(result.current.status).toBe('authenticated');
  });

  test('login com 2FA guarda o partialToken e permite verificar o código', async () => {
    authService.login.mockResolvedValue({
      type: 'two-factor',
      partialToken: 'partial-token',
    });
    authService.verifyTwoFactor.mockResolvedValue(session);

    const { result } = await renderAuth();

    let outcome: string | undefined;
    await act(async () => {
      outcome = await result.current.login(loginData);
    });

    expect(outcome).toBe('two-factor');
    expect(result.current.status).toBe('unauthenticated');
    expect(result.current.user).toBeNull();

    await act(async () => {
      await result.current.verifyTwoFactor('123456');
    });

    expect(authService.verifyTwoFactor).toHaveBeenCalledWith({
      partialToken: 'partial-token',
      code: '123456',
    });
    expect(sessionManager.saveSession).toHaveBeenCalledWith(session);
    expect(result.current.status).toBe('authenticated');
  });

  test('login com Google autentica e sinaliza novo usuário', async () => {
    authService.loginWithGoogle.mockResolvedValue({
      type: 'session',
      session,
      isNewUser: true,
    });

    const { result } = await renderAuth();

    let socialResult: { outcome: string; isNewUser: boolean } | undefined;
    await act(async () => {
      socialResult = await result.current.loginWithGoogle('google-token', true);
    });

    expect(authService.loginWithGoogle).toHaveBeenCalledWith('google-token', true);
    expect(socialResult).toEqual({ outcome: 'authenticated', isNewUser: true });
    expect(sessionManager.saveSession).toHaveBeenCalledWith(session);
    expect(result.current.status).toBe('authenticated');
  });

  test('login com Facebook autentica usuário existente', async () => {
    authService.loginWithFacebook.mockResolvedValue({
      type: 'session',
      session,
      isNewUser: false,
    });

    const { result } = await renderAuth();

    let socialResult: { outcome: string; isNewUser: boolean } | undefined;
    await act(async () => {
      socialResult = await result.current.loginWithFacebook(
        { accessToken: 'facebook-token' },
        false
      );
    });

    expect(authService.loginWithFacebook).toHaveBeenCalledWith(
      { accessToken: 'facebook-token' },
      false
    );
    expect(socialResult).toEqual({ outcome: 'authenticated', isNewUser: false });
    expect(result.current.status).toBe('authenticated');
  });

  test('2FA social usa o endpoint OAuth e preserva isNewUser', async () => {
    authService.loginWithGoogle.mockResolvedValue({
      type: 'two-factor',
      partialToken: 'social-partial',
      isNewUser: true,
    });
    authService.verifySocialTwoFactor.mockResolvedValue({
      ...session,
      isNewUser: true,
    });

    const { result } = await renderAuth();

    await act(async () => {
      await result.current.loginWithGoogle('google-token');
    });

    let verified: { isNewUser: boolean } | undefined;
    await act(async () => {
      verified = await result.current.verifyTwoFactor('654321');
    });

    expect(authService.verifySocialTwoFactor).toHaveBeenCalledWith({
      partialToken: 'social-partial',
      code: '654321',
    });
    expect(authService.verifyTwoFactor).not.toHaveBeenCalled();
    expect(verified).toEqual({ isNewUser: true });
    expect(sessionManager.saveSession).toHaveBeenCalledWith({
      ...session,
      isNewUser: true,
    });
    expect(result.current.status).toBe('authenticated');
  });

  test('registra, faz login e autentica', async () => {
    authService.register.mockResolvedValue(undefined);
    authService.login.mockResolvedValue({ type: 'session', session });

    const { result } = await renderAuth();

    let outcome: string | undefined;
    await act(async () => {
      outcome = await result.current.register(
        'Ana',
        'ana@example.com',
        'senha-segura'
      );
    });

    expect(outcome).toBe('authenticated');
    expect(authService.register).toHaveBeenCalledWith({
      alias: 'Ana',
      email: 'ana@example.com',
      password: 'senha-segura',
    });
    expect(authService.login).toHaveBeenCalledWith({
      email: 'ana@example.com',
      password: 'senha-segura',
    });
    expect(sessionManager.saveSession).toHaveBeenCalledWith(session);
    expect(result.current.status).toBe('authenticated');
  });

  test('logout revoga a sessão, limpa os tokens e volta para o login', async () => {
    authService.login.mockResolvedValue({ type: 'session', session });

    const { result } = await renderAuth();

    await act(async () => {
      await result.current.login(loginData);
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(sessionManager.logoutSession).toHaveBeenCalled();
    expect(sessionManager.clearSession).toHaveBeenCalled();
    expect(result.current.status).toBe('unauthenticated');
    expect(mockRouter.replace).toHaveBeenCalledWith('/(auth)/login');
  });

  test('logout local forçado é registrado no interceptor', async () => {
    const { result } = await renderAuth();
    const handler = interceptors.setLogoutHandler.mock.calls[0][0] as () => void;

    await act(async () => {
      handler();
    });

    await waitFor(() => {
      expect(sessionManager.clearSession).toHaveBeenCalled();
      expect(result.current.status).toBe('unauthenticated');
      expect(mockRouter.replace).toHaveBeenCalledWith('/(auth)/login');
    });
  });

  test('mantém o usuário deslogado quando o login falha', async () => {
    authService.login.mockRejectedValue(new Error('Credenciais inválidas'));

    const { result } = await renderAuth();

    await expect(result.current.login(loginData)).rejects.toThrow(
      'Credenciais inválidas'
    );

    expect(sessionManager.saveSession).not.toHaveBeenCalled();
    expect(result.current.status).toBe('unauthenticated');
  });
});
