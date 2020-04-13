// eslint-disable-next-line no-undef
module.exports = {
    name: "front",
    displayName: "Tests unitaires du front",
    rootDir: "./src",
    resetMocks: true,
    resetModules: true,
    verbose: true,
    transform: {
        "^.+\\.svelte$": "jest-transform-svelte",
        "^.+\\.js$": "babel-jest",
    },
    moduleFileExtensions: ["js", "svelte"],
    testPathIgnorePatterns: ["node_modules"],
    bail: false,
    transformIgnorePatterns: ["node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)"],
    setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
};
