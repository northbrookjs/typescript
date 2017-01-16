import * as assert from 'assert';
import { join } from 'path';
import { each } from 'northbrook';
import { defaultStdio } from 'northbrook/helpers';
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

    each(plugin, (input, io) => runLint(input, io).catch((x: any) => {
      assert.strictEqual(x.stderr,
        '\n/home/tylor/code/northbrook/typescript/packages/' +
        'tslint/src/__test__/failing.skip.ts[2, 3]: ' +
        'The class method \'foo\' must be marked either ' +
        '\'private\', \'public\', or \'protected\'\n');

      done();
    }));

    plugin.handler({ config, args, options, directory: packageDir }, defaultStdio);
  });
});
