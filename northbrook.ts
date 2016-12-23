import { NorthbrookConfig } from 'northbrook';
import { plugin as defaultPlugins } from 'northbrook/plugins';
import { plugin as mocha } from '@northbrook/mocha';

const config: NorthbrookConfig =
  {
    packages: ['packages/**'],
    plugins: [
      defaultPlugins,
      mocha,
    ],
  }

export = config;