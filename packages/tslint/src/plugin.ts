import { command, Command, alias, description, each } from 'northbrook';
import { runLint } from './runLint';

export const plugin: Command =
  command(alias('tslint'), description('Lint your TypeScript files with TSLint'));

each(plugin, runLint);
