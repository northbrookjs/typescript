const { join } = require('path')
const { readdirSync } = require('fs')
const { isDirectory, isInitialized, logSeparator } = require('northbrook/lib/util')
const findConfig = require('find-config')

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

  // get packages and ensure that the original packages array is not mutated
  const packages = options && options.only
    ? config.packages && config.packages.filter(p => p === options.only).slice()
    : config.packages.slice()

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
    const tsconfig = findConfig.require('tsconfig.json', { home: false, cwd: packageDir })

    // this registers how to load .ts files
    require('ts-node').register(tsconfig)

    const testDir = join(packageDir, 'test/')
    return runTests(testDir, callBack)
  }

  function callBack (failures) {
    logSeparator()

    if (packages.length === 0) return

    const packageName = packages.shift()
    logSeparator(packageName)
    runTest(packageName, callBack)
  }

  const packageName = packages.shift()
  logSeparator(packageName)
  runTest(packageName, callBack)
}

function runTests (testDir, callBack) {
  const files = getAllTSFilesInDirectory(testDir)

  const mocha = new Mocha()

  files.forEach(function (file) {
    mocha.addFile(file)
  })

  mocha.run(function (failures) {
    callBack(failures)
  })
}

function getAllTSFilesInDirectory (dir) {
  let files = []
  readdirSync(dir).filter(function (file) {
    const abspath = join(dir, file)

    if (isDirectory(abspath)) {
      files.push(...getAllTSFilesInDirectory(abspath))
    }

    if (file.substr(-3) === '.ts' || file.substr(-4) === '.tsx') {
      return files.push(abspath)
    }
  })

  return files
}
