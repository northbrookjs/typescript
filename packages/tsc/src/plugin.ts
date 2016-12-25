import {
  command,
  Command,
  alias,
  description,
  Description,
  flag,
  Flag,
  each,
} from 'northbrook';

import { compilePackages } from './compilePackages';

const directoryFlag: Flag =
  flag('string', alias('directory', 'd'), description('Directory to compile files into'));

const tscDescription: Description =
  description('Compile your packages with the TypeScript Compiler');

export const plugin: Command =
  command(alias('tsc'), tscDescription, directoryFlag);

each(plugin, compilePackages).catch(err => console.error(err));
