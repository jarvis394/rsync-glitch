const cli = require('commander')
const chalk = require('chalk')
const rsync = require('rsync')
const http = require('http')
const options = require('./options')
const packageJson = require('../package.json')

/**
 * HTTP server for simply listen on some port in order to
 * stop Glitch app showing 'loading' icon
 */
const server = http.createServer()

/** Describes an application. Short and simple. */
const appDescription = chalk.bold('Copies contents of your project to the external server 🚀')

cli
  .name(packageJson.name)
  .version(packageJson.version)
  .description(appDescription)

/** Set up options for cli application */
options.forEach(({ option, description, defaultValue, required }) => {
  const i = required ? 'requiredOption' : 'option'
  cli[i](option, description, defaultValue)
})

cli.parse(process.argv)

// server.listen(3000)