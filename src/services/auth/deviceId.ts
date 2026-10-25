import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

import { devLog, devWarn } from '@/utils/devLog';

const DEVICE_ID_KEY = 'auth.deviceId';

let cachedDeviceId: string | null = null;
let pendingDeviceId: Promise<string> | null = null;

const createDeviceId = () => {
  try {
    return Crypto.randomUUID();
  } catch {
    return `android-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
  }
};

const loadDeviceId = async () => {
  if (cachedDeviceId) return cachedDeviceId;

  try {
    const stored = await SecureStore.getItemAsync(DEVICE_ID_KEY);
    if (stored) {
      cachedDeviceId = stored;
      return stored;
    }

    const created = createDeviceId();
    await SecureStore.setItemAsync(DEVICE_ID_KEY, created);
    cachedDeviceId = created;
    devLog('auth', 'device id criado');
    return created;
  } catch {
    cachedDeviceId = createDeviceId();
    devWarn('auth', 'nao foi possivel persistir o device id');
    return cachedDeviceId;
  }
};

export const getDeviceId = (): Promise<string> => {
  if (!pendingDeviceId) {
    pendingDeviceId = loadDeviceId().catch((error) => {
      pendingDeviceId = null;
      throw error;
    });
  }

  return pendingDeviceId;
};
