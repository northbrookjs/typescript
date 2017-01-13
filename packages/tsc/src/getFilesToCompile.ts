import * as expand from 'glob-expand';

import { NorthbrookConfig } from 'northbrook';
import { join } from 'path';

const defaultPatterns: Array<RegExp | string> =
  [
    'src/**/*.ts',
    'src/**/*.tsx',
    'src/**/*.js',
    '!src/__test__/**/*.*',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts',
    '!src/**/*Spec.ts',
    '!src/**/*Test.ts',
    '!src/**/*.skip.ts',
  ];

export function getFilesToCompile(directory: string, config: NorthbrookConfig) {
  const patterns = (config as any).tsc && (config as any).tsc.patterns || defaultPatterns;

  return expand({ filter: 'isFile', cwd: directory }, patterns.concat('!node_modules/**/*.*'))
    .map(file => join(directory, file));
}
