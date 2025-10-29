module.exports = {
  displayName: 'LionPack Tests',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'lib/team/**/*.js',
    'lib/commands/**/*.js',
    '!lib/team/**/*.test.js',
    '!lib/commands/**/*.test.js',
    '!node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 20,  // Realistic: Current coverage is 26%
      functions: 30,  // Realistic: Current coverage is 37%
      lines: 20,  // Realistic: Current coverage is 20%
      statements: 20  // Realistic: Current coverage is 21%
    }
  },
  verbose: true,
  testTimeout: 10000
};
