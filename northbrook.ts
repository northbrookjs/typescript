const config =
  {
    packages: ['packages/**'],

    plugins: [
      'northbrook/plugins',
      'mocha',
      './packages/tsc/src',
      './packages/tslint/src',
    ],
  };

export = config;
