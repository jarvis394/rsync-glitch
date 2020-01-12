const cli = require('commander')
const chalk = require('chalk')
const ssh = require('ssh2')
const http = require('http')
const fs = require('fs')
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

/** SSH connection to execute remove commands */
const sshConnection = new ssh.Client()

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
const host = cli.dest.split(':')[0].split('@')[1]
const user = cli.dest.split(':')[0].split('@')[0]

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
  }, 
  (data) => data.toString('utf8') && console.log(data.toString('utf8')), 
  (data) => data.toString('utf8') && console.log(data.toString('utf8')))
}

const unlinkFile = path => {
  const command = 'rm ' + cli.dest.split(':')[1] + '/' + path
  
  sshConnection.on('ready', () => {
    sshConnection.exec(command, (error, stream) => {
      if (error) console.error(
        chalk.white('On trying to delete the file "' + path + '":'),
        '\n' + error
      )

      console.log('OK:  Deleted the directory', path)
    })
  }).connect({
    host,
    port: 22,
    username: user,
    password: 'vladikus123'
  })
}

const unlinkDir = path => {
  const command = 'rm -rf' + cli.dest.split(':')[1] + '/' + path
  
  sshConnection.on('ready', () => {
    sshConnection.exec(command, (error, stream) => {
      if (error) console.error(
        chalk.white('On trying to delete the directory "' + path + '":'),
        '\n' + error
      )

      console.log('OK:  Deleted the directory', path)
    })
  }).connect({
    host,
    port: 22,
    username: user,
    privateKey: require('fs').readFileSync('/here/is/my/key')
  })
}

/**
 * Executes on every file change, whether it is 'add', 
 * 'remove' or any other event
 * @param {string} event - Event name
 * @param {string} path - File path
 */
const onChange = (event, path) => {
  if (event === 'unlink') {
    return unlinkFile(path)
  } else if (event === 'unlinkDir') {
    return unlinkDir(path)
  }
  
  console.log(event)
  
  execute()
}

// Watch all changes
watcher.on('all', (...args) => onChange(...args))
