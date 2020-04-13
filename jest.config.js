// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

// eslint-disable-next-line no-undef
module.exports = {
    clearMocks: true,
    // The test environment that will be used for testing
    testEnvironment: 'node',
    // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
    testPathIgnorePatterns: ['/node_modules/'],
    verbose: true,
    projects: ['<rootDir>/apps/api/', '<rootDir>/apps/front/'],
};
