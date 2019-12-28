// eslint-disable-next-line no-undef
module.exports = {
    name: 'api',
    displayName: "Tests unitaires de l'API",
    rootDir: './src',
    resetMocks: true,
    resetModules: true,
    verbose: true,
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
};
