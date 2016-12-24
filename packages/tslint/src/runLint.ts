import { EOL } from 'os';
import { join } from 'path';
import { readFileSync } from 'fs';
import { Linter, LintResult } from 'tslint';
import { loadConfigurationFromPath } from 'tslint/lib/configuration';
import { EachHandlerOptions, Stdio } from 'northbrook';
import { isFile } from 'northbrook/helpers';
import * as expand from 'glob-expand';

const defaultPatterns: Array<RegExp | string> =
  [
    /\.ts/,
    '!node_modules/**/*.*',
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

  const patterns = config.tslint && config.tslint.patterns || defaultPatterns;

  const filesToLint: Array<string> =
    expand({ filter: 'isFile', cwd: path }, patterns);

  const program = Linter.createProgram(findTsConfig(path, directory), path);
  const linter = new Linter({ fix: false }, program);

  return new Promise((resolve, reject) => {

    io.stdout.write(`Running TSLint for ${name}...` + EOL);

    filesToLint.forEach(function (filePath: string) {
      const fileContents: string =
        readFileSync(join(path, filePath)).toString();

      linter.lint(join(path, filePath), fileContents, tslintConfig);
    });

    const result = linter.getResult();

    if (result.failureCount > 0) {
      io.stderr.write(`Running TSLint for ${name} FAILED!` + EOL);

      return reject(result);
    }

    io.stdout.write(`Running TSLint for ${name} complete.` + EOL);

    resolve(result);
  });
}

const TSCONFIG = `tsconfig.json`;
const TSLINT = `tslint.json`;

function findTsConfig(
  path: string,
  directory: string): any
{
  const pathTsConfig = join(path, TSCONFIG);
  const projectTsConfig = join(directory, TSCONFIG);

  if (isFile(pathTsConfig))
    return pathTsConfig;

  if (isFile(projectTsConfig))
    return projectTsConfig;

  return join(__dirname, 'defaultTsConfig.json');
}

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
