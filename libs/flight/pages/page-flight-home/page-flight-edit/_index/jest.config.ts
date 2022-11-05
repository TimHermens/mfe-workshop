module.exports = {
  displayName: 'page:flight-edit',
  preset: '../../../../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/test-setup.ts'],
  globals: {
    'ts-jest': {
      stringifyContentPathRegex: '\\.(html|svg)$',
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: { '^.+\\.(ts|js|html)$': 'jest-preset-angular' },
};
