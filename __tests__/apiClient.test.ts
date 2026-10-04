import api from '../src/services/api/client';
import { env } from '@/config/env';

jest.mock('@/config/env', () => ({
  env: { apiUrl: 'https://api.test.com' },
}));

jest.mock('../src/services/api/interceptors', () => ({
  setupInterceptors: jest.fn(),
}));

describe('api client', () => {
  test('should have correct baseURL', () => {
    expect(api.defaults.baseURL).toBe('https://api.test.com');
  });

  test('should have correct headers', () => {
    expect(api.defaults.headers['Content-Type']).toBe('application/json');
  });
});
