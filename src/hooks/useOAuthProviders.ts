import { useEffect, useState } from 'react';

import {
  getOAuthProviders,
  type OAuthProviders,
} from '@/services/api/authService';

const DEFAULT_PROVIDERS: OAuthProviders = {
  google: true,
  facebook: true,
};

export function useOAuthProviders(enabled = true): OAuthProviders {
  const [providers, setProviders] = useState<OAuthProviders>(DEFAULT_PROVIDERS);

  useEffect(() => {
    if (!enabled) return () => undefined;

    let active = true;

    getOAuthProviders()
      .then((next) => {
        if (active) setProviders(next);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [enabled]);

  return providers;
}
