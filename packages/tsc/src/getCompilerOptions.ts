import { join } from 'path';
import * as fs from 'fs';
import * as ts from 'typescript';
import { NorthbrookConfig } from 'northbrook';
import { isFile } from 'northbrook/helpers';

import { defaultCompilerOptions } from './defaultCompilerOptions';

const ES2015_OPTIONS =
  {
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    module: ts.ModuleKind.ES2015,
    target: ts.ScriptTarget.ES5,
  };

const COMMONJS_OPTIONS: ts.CompilerOptions =
  {
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES5,
  };

export function getCompilerOptions(
  directory: string,
  options: any,
  config: NorthbrookConfig)
{
  const configurationPath: string = ts.findConfigFile(directory, isFile);

  if (!configurationPath) return [ defaultCompilerOptions ];

  const configurationContents: string = fs.readFileSync(configurationPath).toString();

  const configJson = ts.parseConfigFileTextToJson(configurationPath, configurationContents).config;

  const compilerOptions =
    ts.convertCompilerOptionsFromJson(configJson.compilerOptions, directory).options;

  if (!compilerOptions) throw new Error('Failed to parse a TypeScript Configuration');

  const tsc = (config as any).tsc || {};

  const outDir = options.directory || tsc.directory || 'lib';
  const shouldBuildModules = tsc.es2015 || false;

  const commonjsOptions =
    {
      ...compilerOptions,
      ...COMMONJS_OPTIONS,
      outDir: join(directory, outDir),
    };

  const es2015Options =
    {
      ...compilerOptions,
      ...ES2015_OPTIONS,
      outDir: join(directory, outDir + '.es2015'),
    };

  const programOptions: Array<ts.CompilerOptions> =
    [
      commonjsOptions,
    ];

  if (shouldBuildModules)
    programOptions.push(es2015Options);

  return programOptions;
}
