import { plugin as defaultPlugins } from 'northbrook/plugins';
import { plugin as mocha } from '@northbrook/mocha';
import { plugin as tslint } from './packages/tslint/src';
import { plugin as tsc } from './packages/tsc/src';
import { NorthbrookConfig } from 'northbrook';

const config: NorthbrookConfig =
  {
    packages: ['packages/**'],

    plugins: [
      defaultPlugins,
      mocha,
      tslint,
      tsc,
    ],

    tsc: {
      es2015: false,
    },
  };

export = config;
