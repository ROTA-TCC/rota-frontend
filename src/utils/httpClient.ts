import axios from 'axios';

const API_BASE_URL = 'https://paiva.qzz.io';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para tratar erros (ex: 429 - Too Many Requests)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 429) {
        return Promise.reject(new Error('Muitas tentativas. Aguarde 1 minuto.'));
      }
      // Aqui você pode adicionar lógica para 401 (token expirado)
    }
    return Promise.reject(error);
  }
);

export default api;
