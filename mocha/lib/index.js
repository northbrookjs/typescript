const { join } = require('path')
const { readdirSync } = require('fs')
const { isDirectory, isInitialized, separator } = require('northbrook/lib/util')
const findConfig = require('find-config')
const addPath = require('app-module-path').addPath

const Mocha = require('mocha')

exports.plugin = test

function test (program, config, workingDir) {
  if (!config.packages) {
    return console.log('Not packages have been configured')
  }
  program
    .command('ts-mocha')
    .option('-o, --only <packageName>', 'Run linting in a single package')
    .description('Runs tests in all managed packages')
    .action(options => {
      testLikeABoss(config, workingDir, options)
    })
}

function testLikeABoss (config, workingDir, options) {
  isInitialized(config)

  const packages = getConfiguration(config, options).packages

  if (packages.length === 0) {
    if (options.only) {
      return console.log('Cannot find package ' + options.only)
    }
    return console.log('Cannot find any packages to test :(')
  }

  // all this recursion is to be able to run the tests synchronously and to
  // provide output which is actually useful.
  function runTest (packageName, callBack) {
    const packageDir = join(workingDir, packageName)
    addPath(join(packageDir, 'node_modules'))
    const tsconfig = findConfig.require('tsconfig.json', { home: false, cwd: packageDir })
    const nbconfig = findConfig.require('northbrook.json', { home: false, cwd: packageDir })

    const { testFolder, extensions } = getConfiguration(nbconfig)

    // this registers how to load .ts files
    require('ts-node').register(tsconfig)

    const testDir = join(packageDir, testFolder)
    return runTests(testDir, extensions, callBack)
  }

  function callBack (failures) {
    console.log(separator())

    if (packages.length === 0) return

    const packageName = packages.shift()
    console.log(separator(packageName))
    runTest(packageName, callBack)
  }

  const packageName = packages.shift()
  console.log(separator(packageName))
  runTest(packageName, callBack)
}

function runTests (testDir, extensions, callBack) {
  const files = getAllTSFilesInDirectory(testDir, extensions)

  const mocha = new Mocha()

  files.forEach(function (file) {
    mocha.addFile(file)
  })

  mocha.run(function (failures) {
    callBack(failures)
  })
}

function getAllTSFilesInDirectory (dir, extensions) {
  let files = []

  readdirSync(dir).forEach(function (file) {
    const abspath = join(dir, file)

    if (isDirectory(abspath)) {
      files.push(...getAllTSFilesInDirectory(abspath))
    } else {
      extensions.forEach(function (ext) {
        if (file.endsWith(ext)) {
          files.push(abspath)
        }
      })
    }
  })

  return files
}

function hasConfig (config) {
  return config && config['ts-mocha']
}

function getConfiguration (config, options) {
  // get packages and ensure that the original packages array is not mutated
  let packages = options && options.only
    ? config.packages && config.packages.filter(p => p === options.only).slice()
    : config.packages.slice()

  // filter the packages if some are to be excluded
  packages = Array.isArray(hasConfig(config).exclude)
    ? packages.filter(packageName => hasConfig(config).exclude.indexOf(packageName) === -1)
    : packages

  const extensions = Array.isArray(hasConfig(config).extensions)
    ? config['ts-mocha'].extensions
    : ['.ts', '.tsx']

  const testFolder = hasConfig(config) && typeof config['ts-mocha'].directory === 'string'
    ? config['ts-mocha'].directory
    : 'test/'

  return { packages, extensions, testFolder }
}
