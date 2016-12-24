import { command, Command, alias, description, each } from 'northbrook';
import { LintResult } from 'tslint';
import { runLint } from './runLint';

export const plugin: Command =
  command(alias('tslint'), description('Lint your TypeScript files with TSLint'));

each(plugin, runLint)
  .catch((result: LintResult) => {
    if (result.output)
      console.error(result.output);

    console.error(result);
  });
