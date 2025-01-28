/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    rootDir: __dirname, // Explicit root directory
    testEnvironment: "node",
    testMatch: ["**/*.test.ts"],
    transform: {
        "^.+\\.tsx?$": ["ts-jest", {}],
    },
    verbose: true,
   // setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
    //globalTeardown: "/Users/user/Clinton/prodProjects/WashikaDao/backend/src/test/setup.ts",
};
