import axios from 'axios';

const API_BASE_URL = 'https://rota.nx.kg';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 429) {
        return Promise.reject(new Error('Muitas tentativas. Aguarde 1 minuto.'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
