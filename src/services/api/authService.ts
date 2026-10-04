import api from './client';
import * as SecureStore from 'expo-secure-store';

export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = await SecureStore.getItemAsync('refreshToken');
  console.log('--- REFRESH SERVICE ---');
  console.log('Refresh Token found:', !!refreshToken);
  
  if (!refreshToken) {
    console.log('No refresh token found.');
    return null;
  }

  try {
    const response = await api.post('/auth/refresh', {}, {
      headers: {
        Cookie: `refreshToken=${refreshToken}`
      }
    });

    const newAccessToken = response.data.accessToken || response.data.token;
    console.log('Refresh successful. New token:', !!newAccessToken);
    
    if (newAccessToken) {
      await SecureStore.setItemAsync('token', newAccessToken);
      return newAccessToken;
    }
    return null;
  } catch (error) {
    console.error('Refresh request failed:', error);
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('refreshToken');
    return null;
  }
};
