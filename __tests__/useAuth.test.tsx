import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { useAuth, AuthProvider } from '../src/providers/AuthProvider';

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(() => Promise.resolve()),
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('../src/services/api/client', () => ({
  __esModule: true,
  default: {
    post: jest.fn(() => Promise.resolve({ data: {} })),
    get: jest.fn(() => Promise.resolve({ data: {} })),
  },
}));

jest.mock('../src/services/api/interceptors', () => ({
  setLogoutHandler: jest.fn(),
}));

describe('useAuth', () => {
  test('should return auth context', () => {
    let contextValue: any;

    const TestComponent = () => {
      contextValue = useAuth();
      return null;
    };

    act(() => {
      TestRenderer.create(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    expect(contextValue).toBeDefined();
    expect(contextValue.isAuthenticated).toBe(false);
    expect(typeof contextValue.login).toBe('function');
    expect(typeof contextValue.register).toBe('function');
    expect(typeof contextValue.logout).toBe('function');
  });
});

