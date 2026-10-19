import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useAuth, AuthProvider } from '../src/providers/AuthProvider';

const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace, push: jest.fn(), back: jest.fn() }),
}));

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(() => Promise.resolve()),
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('../src/services/api/client', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

jest.mock('../src/services/api/interceptors', () => ({
  setLogoutHandler: jest.fn(),
  setRefreshHandler: jest.fn(),
}));

import api from '../src/services/api/client';
import * as SecureStore from 'expo-secure-store';
import { setLogoutHandler, setRefreshHandler } from '../src/services/api/interceptors';

const mockedApi = api as jest.Mocked<typeof api>;

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns auth context with initial state', async () => {
    const { result } = await renderHook(() => useAuth(), { wrapper: AuthProvider });

    expect(result.current.isAuthenticated).toBe(false);
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.register).toBe('function');
    expect(typeof result.current.logout).toBe('function');
  });

  test('registers interceptor handlers on mount', async () => {
    await renderHook(() => useAuth(), { wrapper: AuthProvider });

    await waitFor(() => {
      expect(setLogoutHandler).toHaveBeenCalled();
      expect(setRefreshHandler).toHaveBeenCalled();
    });
  });

  test('login stores tokens and navigates to tabs', async () => {
    mockedApi.post.mockResolvedValueOnce({
      data: { data: { accessToken: 'access-123', refreshToken: 'refresh-123' } },
    });

    const { result } = await renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await result.current.login({ email: 'ana@rota.com', password: 'secret' });
    });

    expect(mockedApi.post).toHaveBeenCalledWith('/auth/login', {
      email: 'ana@rota.com',
      password: 'secret',
    });
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('token', 'access-123');
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('refreshToken', 'refresh-123');
    expect(result.current.isAuthenticated).toBe(true);
    expect(mockReplace).toHaveBeenCalledWith('/(tabs)/explore');
  });

  test('logout clears tokens and navigates to login', async () => {
    const { result } = await renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await result.current.logout();
    });

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('token');
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('refreshToken');
    expect(result.current.isAuthenticated).toBe(false);
    expect(mockReplace).toHaveBeenCalledWith('/(auth)/login');
  });
});
