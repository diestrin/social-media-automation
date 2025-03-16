import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.perf-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/../src/$1',
  },
  setupFilesAfterEnv: ['./jest-perf.setup.ts'],
  testTimeout: 60000, // Longer timeout for performance tests
  maxWorkers: 1, // Run tests serially to avoid interference
};

export default config;
