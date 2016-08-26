const { plugin: build } = require('@northbrook/ts-build')
const { plugin: create } = require('@northbrook/ts-create')
const { plugin: init } = require('@northbrook/ts-init')
const { plugin: lint } = require('@northbrook/tslint')
const { plugin: mocha } = require('@northbrook/ts-mocha')

exports.plugin = function (program, config, workingDir) {
  build(program, config, workingDir)
  create(program, config, workingDir)
  init(program, config, workingDir)
  lint(program, config, workingDir)
  mocha(program, config, workingDir)
}
