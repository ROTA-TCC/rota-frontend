import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import api from '../services/api/client';
import { setLogoutHandler } from '../services/api/interceptors';

import { LoginDto } from '@ROTA-TCC/types';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (data: LoginDto) => Promise<void>;
  register: (alias: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('refreshToken');
    setIsAuthenticated(false);
    router.replace('/(auth)/login');
  }, [router]);

  useEffect(() => {
    setLogoutHandler(logout);
  }, [logout]);

  const login = async (data: LoginDto) => {
    try {
      const response = await api.post('/auth/login', data);
      if (response.data.token) {
        await SecureStore.setItemAsync('token', response.data.token);
      }
      if (response.data.refreshToken) {
        await SecureStore.setItemAsync('refreshToken', response.data.refreshToken);
      }
      setIsAuthenticated(true);
      router.replace('/(tabs)/explore');
    } catch (error: any) {
      throw error;
    }
  };

  const register = async (alias: string, email: string, password: string) => {
    try {
      await api.post('/auth/register', { alias, email, password });
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw error;
      }
      throw new Error('Falha ao cadastrar. Verifique sua conexão.');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
