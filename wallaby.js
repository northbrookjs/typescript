module.exports = function (wallaby) {
  return {
    files: [
      '!packages/**/src/**/*.test.ts',
      'packages/**/src/**/*.ts',
    ],

    tests: [
      'packages/**/src/**/*.test.ts',
    ],

    testFramework: 'mocha',

    env: { type: 'node' },
  }
}
