import { command, Command, alias, description, each } from 'northbrook';
import { LintResult } from 'tslint';
import { runLint } from './runLint';

export const plugin: Command =
  command(alias('tslint'), description('Lint your TypeScript files with TSLint'));

each(plugin, runLint)
  .catch((result: any) => {
    if (result.output !== void 0) {
      console.error(result.output);
    } else if (typeof result.stderr === 'string') {
      console.log(result.stdout);
      console.error(result.stderr);
    } else {
      console.error(result.message || result);
    }

    process.exit(1);
  });
