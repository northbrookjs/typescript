const { join } = require('path')
const { readdirSync } = require('fs')
const { exec, isDirectory, separator, isInitialized } = require('northbrook/lib/util')

exports.plugin = lint

function lint (program, config, workingDir) {
  program
    .command('tslint')
    .option('-o, --only <packageName>', 'Run linting in a single package')
    .description('Runs tslint in all managed packages')
    .action(options => lintLikeABoss(config, workingDir, options))
}

function lintLikeABoss (config, workingDir, options) {
  isInitialized(config)

  const packages = options.only
    ? config.packages.filter(p => p === options.only)
    : config.packages

  if (packages.length === 0) {
    if (options.only) {
      return console.log('Cannot find package ' + options.only)
    }
    return console.log('Cannot find any packages to test :(')
  }

  packages.forEach(function (packageName) {
    const packageDir = join(workingDir, packageName)
    const srcDir = join(packageDir, 'src/')
    const pkg = require(join(packageDir, 'package.json'))
    const name = pkg.name

    const cmd = `tslint -c tslint.json ${packageName}/src/*.ts`

    const lintCmd = containsDirectories(srcDir)
      ? `${cmd} ${packageName}/src/**/*ts` : cmd

    exec(lintCmd, { silent: true, cwd: workingDir })
      .then(() => {
        console.log(separator(name))
        console.log('    Running TSLint was successful!\n')
        console.log(separator())
      })
      .catch(({out}) => {
        console.log(separator(name))
        console.log(modOutput(out))
        console.log(separator())
      })
  })
}

function modOutput (output) {
  return '    ' + output.replace('\n', '\n    ')
}

function containsDirectories (path) {
  return readdirSync(path).some(isDirectory)
}
