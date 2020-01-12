const cli = require('commander')
const chalk = require('chalk')
const http = require('http')
const chokidar = require('chokidar')
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

/** s*/

/**
 * Executes on every file change, whether it is 'add', 
 * 'remove' or any other event
 * @param {string} event - Event name
 * @param {string} path - File path
 */
const onChange = (event, path) => {
  const now = Date.now()
  console.log(event, path, now, lastTime)
  
  if (now > lastTime + throttle) {
    console.log('Trying rsync...')
    rsync.execute((error, stdout, stderr) => {
      stdout && console.log('stdout:', stdout)
      error && console.log('error:', error)
      stderr && console.log('stderr:', stderr)
      
      lastTime = now
    })
  }
}

watcher.on('all', (...args) => onChange(...args))
