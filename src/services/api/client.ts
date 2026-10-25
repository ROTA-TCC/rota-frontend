import { create } from 'axios';
import { env } from '@/config/env';
import { setupInterceptors } from './interceptors';

const api = create({
  baseURL: env.apiUrl,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Type': 'mobile',
  },
});

setupInterceptors(api);

export default api;
