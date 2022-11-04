/* eslint-disable */
module.exports = {
  preset: '../../jest.preset.js',
  testPathIgnorePatterns: [
    'node_modules',
    '.*/__.*@.*__',
    '.*/files/',
    '<rootDir>/src-nx-workspace/*',
  ],
  testTimeout: 10000,
  collectCoverage: true,
  coverageDirectory: '../../coverage/tools/schematics/',
  collectCoverageFrom: ['src/**/*.ts', '!src/**/files/**'],
  // coverage thresholds are set to current test state should be improved
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 64,
      functions: 80,
      lines: 80,
    },
  },
  verbose: true,
  globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' } },
  displayName: 'schematics',
};
