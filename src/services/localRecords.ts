import * as SecureStore from 'expo-secure-store';

const BEST_DISTANCE_KEY = 'rota.bestDistanceMeters';

export const registerDistanceRecord = async (distanceMeters: number) => {
  if (distanceMeters <= 0) {
    return false;
  }

  try {
    const storedValue = await SecureStore.getItemAsync(BEST_DISTANCE_KEY);
    const previousBest = Number(storedValue) || 0;

    if (distanceMeters <= previousBest) {
      return false;
    }

    await SecureStore.setItemAsync(BEST_DISTANCE_KEY, String(distanceMeters));
    return true;
  } catch {
    return false;
  }
};
