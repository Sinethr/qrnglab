module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'server.js',
    '!node_modules/**'
  ],
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/tests/env.js']
};