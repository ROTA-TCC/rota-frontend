import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'auth.accessToken';
const REFRESH_TOKEN_KEY = 'auth.refreshToken';
const LEGACY_ACCESS_TOKEN_KEY = 'token';
const LEGACY_REFRESH_TOKEN_KEY = 'refreshToken';

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

const readWithLegacyMigration = async (key: string, legacyKey: string) => {
  const current = await SecureStore.getItemAsync(key);
  if (current) return current;

  const legacy = await SecureStore.getItemAsync(legacyKey);
  if (!legacy) return null;

  await SecureStore.setItemAsync(key, legacy);
  await SecureStore.deleteItemAsync(legacyKey);
  return legacy;
};

export const tokenStorage = {
  getAccessToken: () => readWithLegacyMigration(ACCESS_TOKEN_KEY, LEGACY_ACCESS_TOKEN_KEY),

  getRefreshToken: () => readWithLegacyMigration(REFRESH_TOKEN_KEY, LEGACY_REFRESH_TOKEN_KEY),

  async setTokens(tokens: SessionTokens) {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken);
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken);
    await SecureStore.deleteItemAsync(LEGACY_ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(LEGACY_REFRESH_TOKEN_KEY);
  },

  async clear() {
    await Promise.allSettled([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
      SecureStore.deleteItemAsync(LEGACY_ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(LEGACY_REFRESH_TOKEN_KEY),
    ]);
  },
};
