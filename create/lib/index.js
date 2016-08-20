const { join } = require('path')
const { writeFile } = require('fs')

const Khaos = require('khaos')
const beautify = require('js-beautify').js_beautify
const prompt = require('prompt-for')

const { isDirectory, getRelative } = require('northbrook/lib/util')

exports.plugin = create

function create (program, config, workingDir) {
  program
    .command('ts-create <relativePathToPackage>')
    .description('Initialize a new TS package for northbrook to manage')
    .action((packageName, options) => initializePackage(config, workingDir, packageName, options))
}

function initializePackage (config, workingDir, packageName, options) {
  const templateDirectory = join(__dirname, 'template/')
  const destinationDirectory = join(workingDir, packageName)

  if (isDirectory(destinationDirectory)) {
    return console.log('This directory already exists')
  }

  const khaos = new Khaos(templateDirectory)

  readFiles(khaos, function (files) {
    promptForInformation(function (promptAnswers) {
      const answers = generateAnswers(packageName, promptAnswers, workingDir)
      writeFiles(khaos, destinationDirectory, files, answers)
        .catch(err => console.log(err))
        .then(() => addPackageToConfig(packageName, config, workingDir))
    })
  })
}

function generateAnswers (packageName, promptAnswers, workingDir) {
  const {
    author,
    repository: { url: gitUrl },
    bugs: { url: bugsUrl },
    homepage
  } = require(join(workingDir, 'package.json'))

  const relative = getRelative(packageName)
  const bin = `${relative}/node_modules/.bin`

  // creates commands that allow running these commands when in a directory
  const lintCmd = `${bin}/northbrook lint --only ${packageName}`
  const testUnitCmd = `${bin}/northbrook test --only ${packageName}`
  const buildCmd = `${bin}/northbrook build --only ${packageName}`

  return Object.assign({}, promptAnswers, {
    author,
    gitUrl,
    bugsUrl,
    homepage,
    lintCmd,
    testUnitCmd,
    buildCmd
  })
}

// when a new package is created, add it to the northbrookjs config
function addPackageToConfig (packageName, config, workingDir) {
  const packages = config.packages

  if (packages.indexOf(packageName) !== -1) {
    return
  }

  packages.push(packageName)

  const newConfig = Object.assign({}, config, { packages: packages.sort() })
  let data = beautify(JSON.stringify(newConfig))

  console.log('Adding ' + packageName, '...')
  writeFile(join(workingDir, 'northbrook.json'), data, function (err) {
    if (err) throw err
  })
}

function readFiles (khaos, callback) {
  khaos.read(function (err, files) {
    if (err) throw err

    callback(files)
  })
}

const schemaForPrompt =
  {
    'packageName': 'string',
    'description': 'string',
    'private': 'boolean'
  }

function promptForInformation (callback) {
  prompt(schemaForPrompt, function (err, answers) {
    if (err) throw err

    callback(answers)
  })
}

function writeFiles (khaos, destination, files, answers) {
  return new Promise(function (resolve, reject) {
    khaos.write(destination, files, answers, function (err) {
      if (err) reject(err)
      resolve()
    })
  })
}
