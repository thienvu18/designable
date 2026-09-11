const path = require('path')

module.exports = {
  collectCoverage: true,
  verbose: true,
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  testMatch: ['**/__tests__/**/*.spec.[jt]s?(x)'],
  setupFilesAfterEnv: [path.resolve(__dirname, './setupTests.ts')],
  moduleNameMapper: {
    '\\.(css|less|scss)$': path.resolve(__dirname, './styleMock.js'),
    '^@ant-design/colors/es/(.*)$': '@ant-design/colors/lib/$1',
    '^@thienvu18/designable-formily-transformer$': path.resolve(
      __dirname,
      '../formily/transformer/src'
    ),
    '^@thienvu18/designable-formily-setters$': path.resolve(
      __dirname,
      '../formily/setters/src'
    ),
    '^@thienvu18/designable-formily-antd$': path.resolve(
      __dirname,
      '../formily/antd/src'
    ),
    '^@thienvu18/designable-shared$': path.resolve(
      __dirname,
      '../packages/shared/src'
    ),
    '^@thienvu18/designable-core$': path.resolve(
      __dirname,
      '../packages/core/src'
    ),
    '^@thienvu18/designable-react$': path.resolve(
      __dirname,
      '../packages/react/src'
    ),
    '^@thienvu18/designable-react-sandbox$': path.resolve(
      __dirname,
      '../packages/react-sandbox/src'
    ),
    '^@thienvu18/designable-react-settings-form$': path.resolve(
      __dirname,
      '../packages/react-settings-form/src'
    ),
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-sticky-box|@ant-design|@thienvu18)/)',
  ],
  transform: {
    '^.+\\.(ts|tsx|js|jsx|mjs)$': [
      'ts-jest',
      {
        tsconfig: path.resolve(__dirname, '../tsconfig.jest.json'),
        diagnostics: false,
      },
    ],
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/',
    '/esm/',
    '/lib/',
    '/dist/',
    'package.json',
    '/formily/next/',
  ],
}
