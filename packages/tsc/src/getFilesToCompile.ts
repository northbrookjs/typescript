import { join } from 'path';
import { NorthbrookConfig } from 'northbrook';
import * as expand from 'glob-expand';

const defaultPatterns: Array<RegExp | string> =
  [
    /\.ts/,
    '!**/__test__/**/*.*',
    '!lib/**/*.*',
    '!lib/**/*.*',
    '!**/*.spec.ts',
    '!**/*.test.ts',
    '!**/*Spec.ts',
    '!**/*Test.ts',
    '!**/*.skip.ts',
  ];

export function getFilesToCompile(directory: string, config: NorthbrookConfig) {
  const patterns = (config as any).tsc && (config as any).tsc.patterns || defaultPatterns;

  return expand({ filter: 'isFile', cwd: directory }, patterns.concat('!node_modules/**/*.*'))
    .map(file => join(directory, file));
}
