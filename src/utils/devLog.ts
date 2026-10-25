const SENSITIVE_KEY_PATTERN = /token|authorization|cookie|password|secret/i;

const sanitize = (value: unknown, depth = 0): unknown => {
  if (depth > 3) return '[truncated]';

  if (Array.isArray(value)) {
    return value.map((item) => sanitize(item, depth + 1));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        SENSITIVE_KEY_PATTERN.test(key) ? '[redacted]' : sanitize(item, depth + 1),
      ])
    );
  }

  return value;
};

const isDev = () => typeof __DEV__ !== 'undefined' && __DEV__;

export const devLog = (scope: string, message: string, data?: Record<string, unknown>) => {
  if (!isDev()) return;
  if (data) {
    console.log(`[${scope}] ${message}`, sanitize(data));
    return;
  }
  console.log(`[${scope}] ${message}`);
};

export const devWarn = (scope: string, message: string, data?: Record<string, unknown>) => {
  if (!isDev()) return;
  if (data) {
    console.warn(`[${scope}] ${message}`, sanitize(data));
    return;
  }
  console.warn(`[${scope}] ${message}`);
};
