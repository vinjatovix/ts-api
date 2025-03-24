module.exports = {
  preset: 'ts-jest',
  setupFiles: ['<rootDir>/setupTests.ts'],
  testEnvironment: 'jest-environment-node',
  cacheDirectory: '.tmp/jestCache',
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  watchPathIgnorePatterns: ['<rootDir>/test-report.json'],
  testResultsProcessor: 'jest-sonar-reporter',
  coverageReporters: ['lcov'],
  coveragePathIgnorePatterns: [
    '/interfaces/',
    '/dist/',
    '/node_modules/',
    '/test/',
    '/start.ts',
    '/server.ts'
  ],
  maxWorkers: '50%'
};
