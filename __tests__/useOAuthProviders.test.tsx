import { renderHook, waitFor } from '@testing-library/react-native';

import { useOAuthProviders } from '@/hooks/useOAuthProviders';
import { getOAuthProviders } from '@/services/api/authService';

jest.mock('@/services/api/authService', () => ({
  getOAuthProviders: jest.fn(),
}));

const getProviders = getOAuthProviders as jest.Mock;

describe('useOAuthProviders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('atualiza com os provedores retornados pelo backend', async () => {
    getProviders.mockResolvedValue({ google: true, facebook: false });

    const { result } = await renderHook(() => useOAuthProviders());

    await waitFor(() => {
      expect(result.current.facebook).toBe(false);
    });
    expect(result.current.google).toBe(true);
  });

  test('mantém os provedores padrão quando a consulta falha', async () => {
    getProviders.mockRejectedValue(new Error('offline'));

    const { result } = await renderHook(() => useOAuthProviders());

    await waitFor(() => {
      expect(getProviders).toHaveBeenCalled();
    });
    expect(result.current).toEqual({ google: true, facebook: true });
  });
});
