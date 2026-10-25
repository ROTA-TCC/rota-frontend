import React, { type ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { useAuth, AuthProvider } from '../src/providers/AuthProvider';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
  }),
}));

jest.mock('@/services/api/authService', () => ({
  login: jest.fn(),
  register: jest.fn(),
  verifyTwoFactor: jest.fn(),
}));

jest.mock('@/services/auth/sessionManager', () => ({
  clearSession: jest.fn(),
  hasStoredSession: jest.fn(() => Promise.resolve(false)),
  logoutSession: jest.fn(),
  refreshAccessToken: jest.fn(),
  restoreSession: jest.fn(() => Promise.resolve(null)),
  saveSession: jest.fn(),
}));

jest.mock('@/services/api/interceptors', () => ({
  ApiError: class ApiError extends Error {},
  setLogoutHandler: jest.fn(),
  setRefreshHandler: jest.fn(),
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth', () => {
  test('expõe o contexto de autenticação', async () => {
    const { result } = await renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.status).toBe('unauthenticated');
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isBootstrapping).toBe(false);
    expect(result.current.user).toBeNull();
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.register).toBe('function');
    expect(typeof result.current.verifyTwoFactor).toBe('function');
    expect(typeof result.current.cancelTwoFactor).toBe('function');
    expect(typeof result.current.logout).toBe('function');
  });
});
