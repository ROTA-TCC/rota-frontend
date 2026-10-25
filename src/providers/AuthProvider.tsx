import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'expo-router';
import type { AuthUserResponse, LoginDto } from '@ROTA-TCC/types';

import {
  ApiError,
  setLogoutHandler,
  setRefreshHandler,
} from '@/services/api/interceptors';
import {
  login as loginRequest,
  register as registerRequest,
  verifyTwoFactor as verifyTwoFactorRequest,
} from '@/services/api/authService';
import {
  clearSession,
  hasStoredSession,
  logoutSession,
  refreshAccessToken,
  restoreSession,
  saveSession,
} from '@/services/auth/sessionManager';
import type { SessionPayload } from '@/services/auth/session';
import { devWarn } from '@/utils/devLog';

export type AuthStatus = 'bootstrapping' | 'authenticated' | 'unauthenticated';
export type AuthFlowOutcome = 'authenticated' | 'two-factor';

interface AuthContextType {
  status: AuthStatus;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  user: AuthUserResponse | null;
  login: (data: LoginDto) => Promise<AuthFlowOutcome>;
  register: (alias: string, email: string, password: string) => Promise<AuthFlowOutcome>;
  verifyTwoFactor: (code: string) => Promise<void>;
  cancelTwoFactor: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BOOTSTRAP_TIMEOUT_MS = 5000;

const restoreWithTimeout = () =>
  new Promise<SessionPayload | null>((resolve, reject) => {
    const timer = setTimeout(() => resolve(null), BOOTSTRAP_TIMEOUT_MS);

    restoreSession().then(
      (session) => {
        clearTimeout(timer);
        resolve(session);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<AuthStatus>('bootstrapping');
  const [user, setUser] = useState<AuthUserResponse | null>(null);
  const [partialToken, setPartialToken] = useState<string | null>(null);
  const logoutInProgress = useRef(false);
  const router = useRouter();

  const resetLocalSession = useCallback(async () => {
    try {
      await clearSession();
    } catch {
      devWarn('auth', 'falha ao limpar tokens locais');
    }
    setUser(null);
    setPartialToken(null);
    setStatus('unauthenticated');
  }, []);

  const forceLogout = useCallback(async () => {
    if (logoutInProgress.current) return;
    logoutInProgress.current = true;

    try {
      await resetLocalSession();
      router.replace('/(auth)/login');
    } finally {
      logoutInProgress.current = false;
    }
  }, [resetLocalSession, router]);

  const logout = useCallback(async () => {
    if (logoutInProgress.current) return;
    logoutInProgress.current = true;

    try {
      await logoutSession();
    } catch {
      devWarn('auth', 'logout remoto falhou');
    } finally {
      await resetLocalSession();
      router.replace('/(auth)/login');
      logoutInProgress.current = false;
    }
  }, [resetLocalSession, router]);

  const applySession = useCallback(async (session: SessionPayload) => {
    await saveSession(session);
    setUser(session.user ?? null);
    setPartialToken(null);
    setStatus('authenticated');
  }, []);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      try {
        const session = await restoreWithTimeout();
        if (!active) return;

        if (session) {
          setUser(session.user ?? null);
          setStatus('authenticated');
        } else {
          const hasSession = await hasStoredSession();
          if (!active) return;
          setStatus(hasSession ? 'authenticated' : 'unauthenticated');
        }
      } catch {
        if (!active) return;
        devWarn('auth', 'nao foi possivel restaurar a sessao');
        const hasSession = await hasStoredSession();
        if (!active) return;
        setStatus(hasSession ? 'authenticated' : 'unauthenticated');
      }
    };

    void bootstrap();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setRefreshHandler(refreshAccessToken);
    setLogoutHandler(() => {
      void forceLogout();
    });
  }, [forceLogout]);

  const login = useCallback(
    async (data: LoginDto): Promise<AuthFlowOutcome> => {
      const outcome = await loginRequest(data);

      if (outcome.type === 'two-factor') {
        setUser(null);
        setPartialToken(outcome.partialToken);
        setStatus('unauthenticated');
        return 'two-factor';
      }

      await applySession(outcome.session);
      return 'authenticated';
    },
    [applySession]
  );

  const register = useCallback(
    async (alias: string, email: string, password: string): Promise<AuthFlowOutcome> => {
      await registerRequest({ alias, email, password });
      const outcome = await loginRequest({ email, password });

      if (outcome.type === 'two-factor') {
        setUser(null);
        setPartialToken(outcome.partialToken);
        setStatus('unauthenticated');
        return 'two-factor';
      }

      await applySession(outcome.session);
      return 'authenticated';
    },
    [applySession]
  );

  const verifyTwoFactor = useCallback(
    async (code: string) => {
      if (!partialToken) {
        throw new ApiError('Sessão de verificação expirada. Faça login novamente.');
      }

      const session = await verifyTwoFactorRequest({ partialToken, code });
      await applySession(session);
    },
    [applySession, partialToken]
  );

  const cancelTwoFactor = useCallback(() => {
    setPartialToken(null);
  }, []);

  const value = useMemo(
    () => ({
      status,
      isAuthenticated: status === 'authenticated',
      isBootstrapping: status === 'bootstrapping',
      user,
      login,
      register,
      verifyTwoFactor,
      cancelTwoFactor,
      logout,
    }),
    [
      status,
      user,
      login,
      register,
      verifyTwoFactor,
      cancelTwoFactor,
      logout,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
