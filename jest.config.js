const baseProject = {
  collectCoverage: true,
  collectCoverageFrom: ['packages/**/*.{js,jsx,ts,tsx}', '!packages/**/*.d.ts'],
  setupFiles: ['react-app-polyfill/jsdom'],
  testEnvironment: 'jsdom',
  testURL: 'http://localhost',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest',
    '^.+\\.css$': '<rootDir>/config/jest/cssTransform.js',
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '<rootDir>/config/jest/fileTransform.js'
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$', '^.+\\.module\\.(css|sass|scss)$'],
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy'
  },
  moduleFileExtensions: ['web.js', 'js', 'web.ts', 'ts', 'web.tsx', 'tsx', 'json', 'web.jsx', 'jsx', 'node'],
  automock: false,
}

const projects = [
  {
    displayName: 'useFormValidation',
    roots: ['./packages/useFormValidation'],
    testMatch: ['<rootDir>/packages/useFormValidation/**/*.(spec|test).{js,jsx,ts,tsx}']
  }
]

module.exports = {
  ...baseProject,
  projects
}
