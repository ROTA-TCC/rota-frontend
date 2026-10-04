import api from './client';
import * as SecureStore from 'expo-secure-store';

export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = await SecureStore.getItemAsync('refreshToken');
  
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await api.post('/auth/refresh', {}, {
      headers: {
        Cookie: `refreshToken=${refreshToken}`
      }
    });

    const newAccessToken = response.data.accessToken || response.data.token;
    if (newAccessToken) {
      await SecureStore.setItemAsync('token', newAccessToken);
      return newAccessToken;
    }
    return null;
  } catch (error) {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('refreshToken');
    return null;
  }
};
