import { AxiosInstance, InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';

export class ApiError extends Error {
  constructor(
    public message: string,
    public status?: number,
    public field?: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

let logoutHandler: (() => void) | null = null;

export const setLogoutHandler = (handler: () => void) => {
  logoutHandler = handler;
};

export const setupInterceptors = (api: AxiosInstance) => {
  api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      if (error.response) {
        const { status, data } = error.response;
        
        // Extract backend error details, assuming structure: { message: string, field?: string }
        const backendData = data as any;
        const backendMessage = backendData?.message;
        const field = backendData?.field;
        
        switch (status) {
          case 400:
            throw new ApiError(backendMessage || 'Requisição inválida.', status, field, data);
          case 401:
            await SecureStore.deleteItemAsync('token');
            if (logoutHandler) {
              logoutHandler();
            }
            throw new ApiError(backendMessage || 'Sessão expirada. Faça login novamente.', status, field);
          case 403:
            throw new ApiError(backendMessage || 'Você não tem permissão para esta ação.', status, field);
          case 404:
            throw new ApiError(backendMessage || 'Recurso não encontrado.', status, field);
          case 429:
            throw new ApiError('Muitas tentativas. Aguarde 1 minuto.', status);
          case 500:
            throw new ApiError('Erro interno no servidor. Tente novamente mais tarde.', status);
          default:
            throw new ApiError(backendMessage || 'Ocorreu um erro inesperado.', status, field);
        }
      }
      
      // Network errors
      if (error.request) {
        throw new ApiError('Erro de conexão. Verifique sua internet.');
      }
      
      throw error;
    }
  );
};
