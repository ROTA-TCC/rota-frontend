import { create } from 'axios';
import { env } from '@/config/env';
import { setupInterceptors } from './interceptors';

const api = create({
  baseURL: env.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

setupInterceptors(api);

export default api;
