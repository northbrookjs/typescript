const { join } = require('path')
const findConfig = require('find-config')
const { exec, getRelative, logSeparator, isInitialized } = require('northbrook/lib/util')

exports.plugin = build

function build (program, config, workingDir) {
  program
    .command('ts-build')
    .option('-o, --only <packageName>', 'Run the build only for a particular package')
    .description('Builds all managed projects with TypeScript')
    .action(options => buildLikeABoss(config, workingDir, options))
}

function buildLikeABoss (config, workingDir, options) {
  isInitialized(config)

  const packages = options.only
    ? config.packages.filter(p => p === options.only)
    : config.packages

  packages.forEach(function (packageName) {
    const packageDir = join(workingDir, packageName)
    require('app-module-path').addPath(join(packageDir, 'node_modules'))

    const tsconfig = findConfig.require('tsconfig.json', { home: false, cwd: packageDir })
    const files = tsconfig.files.join(' ')

    const commonjs = commonjsOptions(tsconfig)
    const es2015 = es2015Options(tsconfig)

    const relative = getRelative(packageName)
    const bin = `${relative}/node_modules/.bin`

    const cmd = config => `${bin}/tsc ${config} ${files}`

    return Promise.all([
      exec(cmd(commonjs), { silent: true, cwd: packageDir }),
      exec(cmd(es2015), { silent: true, cwd: packageDir })
    ]).then(() => {
      logSeparator(packageName)
      console.log(`    Successfully completed build of ${packageName}`)
      logSeparator()
    }).catch(err => logSeparator(packageName) || console.error(err) || logSeparator())
  })
}

function commonjsOptions (tsconfig) {
  return buildOptions(
    Object.assign({}, tsconfig, {
      compilerOptions: Object.assign({}, tsconfig.compilerOptions, {
        target: 'ES5',
        module: 'commonjs',
        outDir: 'lib/'
      })
    }).compilerOptions
  )
}

function es2015Options (tsconfig) {
  return buildOptions(
    Object.assign({}, tsconfig, {
      compilerOptions: Object.assign({}, tsconfig.compilerOptions, {
        target: 'es2015',
        module: 'es2015',
        outDir: 'es/'
      })
    }).compilerOptions
  )
}

const booleanOptions = [
  'allowJs', 'allowSyntheticDefaultImports', 'allowUnreachableCode',
  'allowUnusedLabels', 'declaration', 'diagnostics', 'emitBOM',
  'emitsDecoratorMetadata', 'experimentalDecorators', 'forceConsistentCasingInFileNames',
  'inlineSourceMap', 'inlineSources', 'isolatedModules', 'listFiles', 'noEmit',
  'noEmitHelpers', 'noEmitOnError', 'noFallthroughCasesInSwitch', 'noImplicitAny',
  'noImplicitReturns', 'noImplicitThis', 'noImplicitUseString', 'noLib', 'noResolve',
  'noUnusedLocals', 'noUnusedParameters', 'preserveConstEnums', 'pretty',
  'removeComments', 'skipDefaultLibCheck', 'sourceMap', 'strictNullChecks',
  'stripInternal', 'suppressExcessPropertyErrors', 'suppressImplicitAnyErrors',
  'traceResolution'
]

function buildOptions (compilerOptions) {
  let options = ''
  for (const option in compilerOptions) {
    const value = compilerOptions[option]
    if (booleanOptions.indexOf(option) > -1) {
      if (value) {
        options += ' --' + option
      }
    } else {
      if (Array.isArray(value)) {
        if (value.length === 0) continue
        options += ' --' + option + ' ' + value.join(',')
      } else {
        options += ' --' + option + ' ' + value
      }
    }
  }
  return options
}
