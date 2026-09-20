import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api/client';
import { setLogoutHandler } from '../services/api/interceptors';

import { LoginDto } from '@ROTA-TCC/types';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (data: LoginDto) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync('token');
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    setLogoutHandler(logout);
  }, [logout]);

  const login = async (data: LoginDto) => {
    try {
      const response = await api.post('/auth/login', data);
      if (response.data.token) {
        await SecureStore.setItemAsync('token', response.data.token);
      }
      setIsAuthenticated(true);
      console.log('Login bem-sucedido:', response.data);
    } catch (error: any) {
      console.error('Erro no login:', error.message || error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      console.log('Enviando requisição de registro:', { username, email, password });
      await api.post('/auth/register', { username, email, password });
      console.log('Registro bem-sucedido');
    } catch (error: any) {
      console.error('Erro no registro:', error.message || error);
      throw error;
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
