const testPathIgnorePatterns = [
  "/node_modules/",
  "/test-app/",
  "/coverage/",
  "/__tests__/utils/",
];

module.exports = {
  projects: [
    {
      // jest built-in jsdom and node jest-environments specified using docblocks
      // https://jestjs.io/docs/en/configuration.html#testenvironment-string
      displayName: "jsdom and node",
      testPathIgnorePatterns,
      testMatch: [
        "**/__tests__/**/!(react_native)*.js?(x)",
        "**/!(react_native)?(*.)+(spec|test).js?(x)",
      ],
    },
    {
      // our custom RN env
      displayName: "React Native",
      testPathIgnorePatterns,
      testMatch: [
        "**/__tests__/**/react_native*.js?(x)",
        "**/react_native?(*.)+(spec|test).js?(x)",
      ],
      testEnvironment:
        "./packages/core/__tests__/utils/react-native-environment.js",
    },
  ],
};
