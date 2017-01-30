import { EOL } from 'os';
import { join } from 'path';
import { EachHandlerOptions, Stdio } from 'northbrook';
import * as rimraf from 'rimraf';

import { getCompilerOptions } from './getCompilerOptions';
import { getFilesToCompile } from './getFilesToCompile';
import { compile } from './compile';

export function compilePackages({ pkg, config, options }: EachHandlerOptions, io: Stdio) {
  io.stdout.write(`Compiling ${pkg.name}... ` + EOL);

  const tsc = (config as any).tsc || {};
  const outDir = options.directory || tsc.directory || 'lib';

  return new Promise((resolve, reject) => {
    rimraf(join(pkg.path, outDir), (error) => {
      if (error) reject(error);

      rimraf(join(pkg.path, outDir + '.es2015'), (err) => {
        if (err) reject(err);

        const compilerOptions = getCompilerOptions(pkg.path, options, config);

        const filesToCompile = getFilesToCompile(pkg.path, config);

        compilerOptions.forEach(compile(filesToCompile, reject));

        io.stdout.write(`Completed compilation of ${pkg.name}` + EOL);

        resolve();
      });
    });
  });
}
