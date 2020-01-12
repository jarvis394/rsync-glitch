const cli = require('commander')
const chalk = require('chalk')
const http = require('http')
const chokidar = require('chokidar')
const throttleWrapper = require('lodash.throttle')
const options = require('./options')
const rsyncCreator = require('./rsync')
const ignoredList = require('./ignoredList')
const packageJson = require('../package.json')

/**
 * HTTP server for simply listen on some port in order to
 * stop Glitch app showing 'loading' icon
 */
const server = http.createServer()

/** Describes an application. Short and simple. */
const appDescription = chalk.bold('Copies contents of your project to the external server 🚀')

let wasFiletreeChanged = false
let lastTime = Date.now()

/** Set up cli application parameters */
cli
  .name(packageJson.name)
  .version(packageJson.version)
  .description(appDescription)

/** Set up options for cli application */
options.forEach(({ option, description, defaultValue, required }) => {
  const i = required ? 'requiredOption' : 'option'
  cli[i](option, description, defaultValue)
})

/** Parse arguments which were given to the application */
cli.parse(process.argv)

/** Listen on given port */
if (cli.listen) {
  server.listen(3000)
  console.log(chalk.green('Your app is listening on port'), chalk.yellow(cli.listen))
}

const throttle = parseInt(cli.throttle) || 0

/** Create rsync wrapper instance */
const rsync = rsyncCreator(cli.source, cli.dest)

/** Create watcher */
const watcher = chokidar.watch(cli.source, { 
  ignoreInitial: true,
  ignored: ignoredList
})

const execute = () => {
  console.log(chalk.gray('INFO:  Saving changes...'))

  rsync.execute((error, code, cmd) => {
    // If error happened then notify user
    if (code === 0) {
      console.log(chalk.green('OK:'), ' Saved changes!')
    } else {
      console.error(
        chalk.white('[' + code + ']') + '  On trying to execute rsync: \n', 
        chalk.white(error),
        '\nExecuted command:', chalk.yellow(cmd)
      )
    }
  })
}

/**
 * Executes on every file change, whether it is 'add', 
 * 'remove' or any other event
 * @param {string} event - Event name
 * @param {string} path - File path
 */
const onChange = (event, path) => {
  throttleWrapper(execute, throttle)
}

// Watch all changes
watcher.on('all', (...args) => onChange(...args))
