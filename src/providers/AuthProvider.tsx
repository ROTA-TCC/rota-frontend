import React, { createContext, useContext, useState, ReactNode } from 'react';
import api from '../utils/httpClient';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (alias: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      setIsAuthenticated(true);
      console.log('Login bem-sucedido:', response.data);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const register = async (alias: string, email: string, password: string) => {
    try {
      console.log('Enviando requisição de registro:', { alias, email, password });
      await api.post('/auth/register', { alias, email, password });
      console.log('Registro bem-sucedido');
    } catch (error: any) {
      console.error('Erro no registro (detalhado):', error.response?.data || error);

      const backendMessage = error.response?.data?.message || 'Erro ao realizar cadastro.';
      throw new Error(backendMessage);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
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
