module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  cacheDirectory: '.tmp/jestCache',
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  watchPathIgnorePatterns: ['<rootDir>/test-report.json'],
  reporters: ['default'],
  testResultsProcessor: 'jest-sonar-reporter',
  coverageReporters: ['text', 'html', 'lcov', 'clover'],
  coveragePathIgnorePatterns: [
    '/interfaces/',
    '/dist/',
    '/node_modules/',
    '/test/',
    '/start.ts',
    '/server.ts',
  ]
};
