/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

export default {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    "/node_modules/"
  ],

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",


  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  // moduleNameMapper: {},
  "moduleNameMapper": {
    "@functions/(.*)": "<rootDir>/src/functions/$1",
    "@libs/(.*)": "<rootDir>/src/libs/$1",
    "@repositories/(.*)": "<rootDir>/src/repositories/$1",
    "@services/(.*)": "<rootDir>/src/services/$1",
  },

  // The test environment that will be used for testing
  testEnvironment: "node",

  // The glob patterns Jest uses to detect test files
  testMatch: [
    "<rootDir>/**/__tests__/**/*.[jt]s?(x)",
    "<rootDir>/**/?(*.)+(spec|test).[tj]s?(x)"
  ],

  "transform": {
    "^.+\\.ts?$": "ts-jest"
  },

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: [
    "/node_modules/"
  ],
};
