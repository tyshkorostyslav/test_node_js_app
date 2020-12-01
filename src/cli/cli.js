'use strict'

const {
  parseArgumentsIntoOptions,
  promptForMissingOptions,
  promptForActions,
} = require('./cli_functions')

async function cli(args) {
  let options = parseArgumentsIntoOptions(args)
  options = await promptForMissingOptions(options)
  options = await promptForActions(options)
  if (options.data || options.title) {
    await promptForActions(options)
  }
}

module.exports = { cli }
