import { EOL } from 'os';
import { EachHandlerOptions, Stdio } from 'northbrook';

import { getCompilerOptions } from './getCompilerOptions';
import { getFilesToCompile } from './getFilesToCompile';
import { compile } from './compile';

export function compilePackages({ pkg, config, options }: EachHandlerOptions, io: Stdio) {
  io.stdout.write(`Compiling ${pkg.name} `);

  const compilerOptions = getCompilerOptions(pkg.path, options, config);

  const filesToCompile = getFilesToCompile(pkg.path, config);

  compilerOptions.forEach(compile(filesToCompile));

  io.stdout.write(`complete!` + EOL);
}
