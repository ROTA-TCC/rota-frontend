import axios from 'axios';
import { env } from '@/config/env';
import { setupInterceptors } from './interceptors';

const api = axios.create({
  baseURL: env.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

setupInterceptors(api);

export default api;
