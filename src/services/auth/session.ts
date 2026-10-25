import type { AuthUserResponse } from '@ROTA-TCC/types';

export interface SessionPayload {
  accessToken: string;
  refreshToken: string;
  user?: AuthUserResponse;
}

export type LoginOutcome =
  | { type: 'session'; session: SessionPayload }
  | { type: 'two-factor'; partialToken: string };

type UnknownRecord = Record<string, unknown>;

const asRecord = (value: unknown): UnknownRecord =>
  value && typeof value === 'object' ? (value as UnknownRecord) : {};

const unwrap = (body: unknown): UnknownRecord => {
  const record = asRecord(body);
  return asRecord(record.data ?? record);
};

const asString = (value: unknown) => (typeof value === 'string' ? value : undefined);

const parseUser = (value: unknown): AuthUserResponse | undefined => {
  const user = asRecord(value);

  if (
    typeof user.id === 'string' &&
    typeof user.email === 'string' &&
    typeof user.alias === 'string'
  ) {
    return { id: user.id, email: user.email, alias: user.alias };
  }

  return undefined;
};

export const parseSessionPayload = (body: unknown): SessionPayload | null => {
  const data = unwrap(body);
  const accessToken = asString(data.accessToken);
  const refreshToken = asString(data.refreshToken);

  if (!accessToken || !refreshToken) return null;

  return {
    accessToken,
    refreshToken,
    user: parseUser(data.user),
  };
};

export const parseLoginPayload = (body: unknown): LoginOutcome | null => {
  const data = unwrap(body);

  if (data.requires2fa === true) {
    const partialToken = asString(data.partialToken);
    return partialToken ? { type: 'two-factor', partialToken } : null;
  }

  const session = parseSessionPayload(body);
  return session ? { type: 'session', session } : null;
};
