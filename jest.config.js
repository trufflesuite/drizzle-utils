const testPathIgnorePatterns = [
  "/node_modules/",
  "/test-app/",
  "/coverage/",
  "/__tests__/utils/",
];

module.exports = {
  projects: [
    {
      displayName: "jsdom and node",
      testPathIgnorePatterns,
      testMatch: [
        "**/__tests__/**/!(react_native)*.js?(x)",
        "**/!(react_native)?(*.)+(spec|test).js?(x)",
      ],
    },
    {
      displayName: "React Native",
      testPathIgnorePatterns,
      testMatch: [
        "**/__tests__/**/react_native*.js?(x)",
        "**/react_native?(*.)+(spec|test).js?(x)",
      ],
    },
  ],
};
