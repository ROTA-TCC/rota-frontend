import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Appearance, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const THEME_STORAGE_KEY = 'rota.themeMode';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const readStoredMode = async (): Promise<ThemeMode | null> => {
  try {
    if (Platform.OS === 'web') {
      const stored = globalThis.localStorage?.getItem(THEME_STORAGE_KEY);
      return stored === 'light' || stored === 'dark' ? stored : null;
    }

    const stored = await SecureStore.getItemAsync(THEME_STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch {
    return null;
  }
};

const persistMode = (mode: ThemeMode) => {
  try {
    if (Platform.OS === 'web') {
      globalThis.localStorage?.setItem(THEME_STORAGE_KEY, mode);
      return;
    }

    SecureStore.setItemAsync(THEME_STORAGE_KEY, mode).catch(() => undefined);
  } catch {
    return;
  }
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setModeState] = useState<ThemeMode>('dark');

  useEffect(() => {
    let active = true;

    readStoredMode().then((stored) => {
      if (active && stored) {
        setModeState(stored);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (typeof Appearance.setColorScheme === 'function') {
      Appearance.setColorScheme(mode);
    }
  }, [mode]);

  const setMode = useCallback((nextMode: ThemeMode) => {
    setModeState(nextMode);
    persistMode(nextMode);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((current) => {
      const nextMode = current === 'dark' ? 'light' : 'dark';
      persistMode(nextMode);
      return nextMode;
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      isDark: mode === 'dark',
      setMode,
      toggleMode,
    }),
    [mode, setMode, toggleMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
