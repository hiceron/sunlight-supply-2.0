// Jest configuration for Vite + React + TypeScript
export default {
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  transform: {},
};
