import {
  parseLoginPayload,
  parseSessionPayload,
} from '@/services/auth/session';

describe('parseSessionPayload', () => {
  test('extrai tokens e usuário do envelope data', () => {
    const result = parseSessionPayload({
      success: true,
      data: {
        accessToken: 'access',
        refreshToken: 'refresh',
        user: { id: '1', email: 'ana@example.com', alias: 'Ana' },
      },
    });

    expect(result).toEqual({
      accessToken: 'access',
      refreshToken: 'refresh',
      user: { id: '1', email: 'ana@example.com', alias: 'Ana' },
    });
  });

  test('aceita resposta sem envelope', () => {
    const result = parseSessionPayload({
      accessToken: 'access',
      refreshToken: 'refresh',
    });

    expect(result).toMatchObject({
      accessToken: 'access',
      refreshToken: 'refresh',
    });
  });

  test('retorna null quando falta o refresh token', () => {
    expect(parseSessionPayload({ data: { accessToken: 'access' } })).toBeNull();
  });
});

describe('parseLoginPayload', () => {
  test('identifica sessão completa', () => {
    const result = parseLoginPayload({
      data: {
        accessToken: 'access',
        refreshToken: 'refresh',
        user: { id: '1', email: 'ana@example.com', alias: 'Ana' },
      },
    });

    expect(result).toEqual({
      type: 'session',
      session: {
        accessToken: 'access',
        refreshToken: 'refresh',
        user: { id: '1', email: 'ana@example.com', alias: 'Ana' },
      },
    });
  });

  test('identifica exigência de 2FA', () => {
    const result = parseLoginPayload({
      data: { requires2fa: true, partialToken: 'partial' },
    });

    expect(result).toEqual({ type: 'two-factor', partialToken: 'partial' });
  });

  test('retorna null para payload inválido', () => {
    expect(parseLoginPayload({ data: {} })).toBeNull();
  });
});
