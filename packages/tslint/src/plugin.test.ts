import * as assert from 'assert';
import { join } from 'path';
import { each } from 'northbrook';
import { defaultStdio } from 'northbrook/helpers';
import { LintResult } from 'tslint';
import { plugin } from './plugin';
import { runLint } from './runLint';

describe('tslint plugin', function () {
  it('is has a handler', () => {
    assert.strictEqual(plugin.type, 'command');
    assert.strictEqual(typeof plugin.handler, 'function');
  });

  it('lints typescript files', function (done) {
    const packageDir = join(__dirname);

    const config = {
      packages: [ join(packageDir, '__test__') ],

      tslint: {
        patterns: [
          /.ts/,
        ],
      },
    };

    const args: Array<string> = [];
    const options: any = {};

    if (!plugin.handler) return done(new Error('No handler was found'));

    each(plugin, runLint).catch((x: any) => {
      const result = x as LintResult;

      assert.strictEqual(result.failureCount, 1);

      const failingTestPath = (result.failures[0] as any).sourceFile.path;

      assert.strictEqual(failingTestPath, join(packageDir, '__test__/failing.skip.ts'));

      assert.strictEqual(result.failures[0].getFailure(),
        'The class method \'foo\' must be marked either \'private\', \'public\', or \'protected\'');

      done();
    });

    plugin.handler({ config, args, options, directory: packageDir }, defaultStdio);
  });
});
