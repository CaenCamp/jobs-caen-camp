// eslint-disable-next-line no-undef
module.exports = {
    name: 'e2e',
    displayName: 'Tests e2e',
    rootDir: '.',
    resetMocks: true,
    resetModules: true,
    verbose: true,
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    moduleFileExtensions: ['js'],
    testPathIgnorePatterns: ['node_modules', 'cypress'],
    transformIgnorePatterns: ['node_modules', 'cypress'],
};
