module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	cacheDirectory: '.tmp/jestCache',
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: '<rootDir>/coverage',
};
