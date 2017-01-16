import * as expand from 'glob-expand';

import { EachHandlerOptions, Stdio } from 'northbrook';
import { LintResult, Linter } from 'tslint';

import { EOL } from 'os';
import { isFile } from 'northbrook/helpers';
import { join } from 'path';
import { loadConfigurationFromPath } from 'tslint/lib/configuration';
import { readFileSync } from 'fs';

const defaultPatterns: Array<RegExp | string> =
  [
    /\.ts$/,
    '!lib/**/*.ts',
    '!lib.es2015/**/*.ts',
    '!**/*.skip.ts',
  ];

export function runLint (
  { pkg, directory, config }: EachHandlerOptions,
  io: Stdio): Promise<LintResult>
{
  const { path, name } = pkg;

  let tslintConfig = findTslintConfig(path, directory);

  if (!tslintConfig)
    tslintConfig = require('@motorcycle/tslint');
  else
    tslintConfig = loadConfigurationFromPath(tslintConfig);

  const patterns =
    (config as any).tslint && (config as any).tslint.patterns || defaultPatterns;

  const filesToLint: Array<string> =
    expand({ filter: 'isFile', cwd: path }, patterns.concat([
      '!node_modules/**/*.*',
      '!**/node_modules/**.*',
    ]));

  const linter = new Linter({ fix: false });

  return new Promise((resolve, reject) => {

    io.stdout.write(`Running TSLint for ${name}...` + EOL);

    filesToLint.forEach(function (filePath: string) {
      const absoluteFilePath = join(path, filePath);

      const fileContents: string =
        readFileSync(absoluteFilePath).toString();

      linter.lint(absoluteFilePath, fileContents, tslintConfig);
    });

    const result = linter.getResult();

    if (result.failureCount > 0) {
      io.stderr.write(`Running TSLint for ${name} FAILED!` + EOL);

      return reject({ stdout: '', stderr: result.output });
    }

    io.stdout.write(`Running TSLint for ${name} complete.` + EOL);

    resolve({ stdout: '', stderr: '' });
  });
}

const TSLINT = `tslint.json`;

function findTslintConfig(
  path: string,
  directory: string): any {
  const pathTslint = join(path, TSLINT);
  const projectTslint = join(directory, TSLINT);

  if (isFile(pathTslint))
    return pathTslint;

  if (isFile(projectTslint))
    return projectTslint;

  return false;
}
