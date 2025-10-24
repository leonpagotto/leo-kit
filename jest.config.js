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
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  verbose: true,
  testTimeout: 10000
};
