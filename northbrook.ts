import { NorthbrookConfig } from 'northbrook';
import { plugin as defaultPlugins } from 'northbrook/plugins';
import { plugin as mocha } from '@northbrook/mocha';
import { plugin as tslint } from './packages/tslint/src';

const config: NorthbrookConfig =
  {
    packages: ['packages/**'],
    plugins: [
      defaultPlugins,
      mocha,
      tslint,
    ],

    tslint: {
      patterns: [
        /\.ts/,
        '!**/__test__/**.ts',
        '!node_modules/**/*.*',
      ],
    },
  };

export = config;
