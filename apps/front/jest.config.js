// eslint-disable-next-line no-undef
module.exports = {
    name: 'front',
    displayName: 'Tests unitaires du front',
    rootDir: './src',
    resetMocks: true,
    resetModules: true,
    verbose: true,
    transform: {
        '^.+\\.js$': 'babel-jest',
        '^.+\\.svelte$': 'svelte-jester',
    },
    moduleFileExtensions: ['js', 'svelte'],
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
};
