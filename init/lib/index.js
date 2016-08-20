const { join } = require('path')

const Khaos = require('khaos')
const prompt = require('prompt-for')

exports.plugin = init

function init (program, config, workingDir) {
  program
    .command('ts-init')
    .description('Initialize top-level TypeScript configurations')
    .action((env, options) => initializeRepository(config, workingDir, env, options))
}

function initializeRepository (config, workingDir, env, options) {
  const templateDirectory = join(__dirname, 'template/')

  const khaos = new Khaos(templateDirectory)

  readFiles(khaos, function (files) {
    promptForInformation(function (promptAnswers) {
      const githubRepo = promptAnswers.githubUsername.trim() + '/' + promptAnswers.packageName.trim()
      const answers = Object.assign({}, promptAnswers, {
        githubRepo,
        northbrookVersion: config.version
      })

      writeFiles(khaos, workingDir, files, answers)
        .catch((err) => console.log('Failed to initialize this package:\n', err))
        .then(() => console.log('Successfully initialized with typescript configurations + extras'))
    })
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
    'authorName': 'string',
    'authorEmail': 'string',
    'githubUsername': 'string'
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
      resolve(null)
    })
  })
}
