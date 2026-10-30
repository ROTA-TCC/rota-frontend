const baseConfig = require('./jest.config');

module.exports = {
  ...baseConfig,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/__tests__/useAuth.test.tsx',
    '<rootDir>/__tests__/useOAuthProviders.test.tsx',
    '<rootDir>/__tests__/useRunTracker.test.ts',
    '<rootDir>/__tests__/.*\\.integration\\.test\\.tsx$',
  ],
};
