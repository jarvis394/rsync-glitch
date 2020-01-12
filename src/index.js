const cli = require('commander')
const chalk = require('chalk')
const ssh = require('ssh2')
const http = require('http')
const fs = require('fs')
const chokidar = require('chokidar')
const options = require('./options')
const rsyncCreator = require('./rsync')
const packageJson = require('../package.json')

let privateKey, delayedTask
try {
  privateKey = fs.readFileSync('./.ssh/id_rsa')
} catch(e) {
  console.error('There is some error on trying to read the RSA key:\n', e, '\n\nThe expected path was: ./.ssh/id_rsa')
}

/**
 * HTTP server for simply listen on some port in order to
 * stop Glitch app showing 'loading' icon
 */
const server = http.createServer()

// Describes an application. Short and simple. */
const appDescription = chalk.bold('Copies contents of your project to the external server 🚀')

// SSH connection to execute remove commands */
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
  console.log(chalk.green('Your app is listening on port'), chalk.yellow(cli.listen), '\n')
}

const flags = cli.flags || 'avr'
const port = parseInt(cli.port) || 22
const throttle = parseInt(cli.throttle) || 1000
const host = cli.dest.split(':')[0].split('@')[1]
const username = cli.dest.split(':')[0].split('@')[0]

// Connect to the server
sshConnection.on('ready', () => {
  console.log('INFO:  Estabilished SSH connection to', cli.dest.split(':')[0])
  console.log('INFO:  Started watching for the file changes...')

  // Create rsync wrapper instance 
  const rsync = rsyncCreator(cli.source, cli.dest, flags)

  // Create watcher 
  const watcher = chokidar.watch(cli.source, { 
    ignoreInitial: true,
    ignored: /\.save\./g,
    awaitWriteFinish: true
  })

  const execute = path => {
    console.log(chalk.gray('INFO:  Saving changes for "' + path + '"...'))

    rsync.execute((error, code, cmd) => {
      // If error happened then notify user
      if (code === 0) {
        console.log(chalk.green('OK:  '), ' Saved changes!')
      } else {
        console.error(
          chalk.white('[' + code + ']') + '  On trying to execute rsync: \n', 
          chalk.white(error),
          '\nExecuted command:', chalk.yellow(cmd)
        )
      }
    }, 
    (data) => cli.verbose && data.toString('utf8') && console.log(data.toString('utf8')), 
    (data) => cli.verbose && data.toString('utf8') && console.log(data.toString('utf8')))
  }

  const unlinkFile = path => {
    const command = 'rm ' + cli.dest.split(':')[1] + '/' + path

    console.log('INFO:  Deleting the file "' + path + '"...')

    sshConnection.exec(command, (error, stream) => {
      if (error) console.error(
        chalk.white('On trying to delete the file "' + path + '":'),
        '\n' + error
      )

      console.log('OK:    File was deleted (' + path + ')')
    })
  }

  const unlinkDir = path => {
    path = path.split('/')[path.split('/').length - 1]
    const command = 'rm -rf ' + cli.dest.split(':')[1] + '/' + path

    console.log('INFO:  Deleting the directory "' + path + '"...')

    sshConnection.exec(command, (error, stream) => {
      if (error) console.error(
        chalk.white('On trying to delete the directory "' + path + '":'),
        '\n' + error
      )

      console.log('OK:    Directory was deleted (' + path + ')')
    })
  }

  /**
   * Executes on every file change, whether it is 'add', 
   * 'remove' or any other event
   * @param {string} event - Event name
   * @param {string} path - File path
   */
  const onChange = (event, path) => {
    clearTimeout(delayedTask)

    cli.verbose && console.log('INFO:  Got event "' + event + '"')
    
    if (event === 'unlink') {
      return unlinkFile(path)
    } else if (event === 'unlinkDir') {
      return unlinkDir(path)
    }
    
    delayedTask = setTimeout(() => execute(path), throttle)
  }

  // Watch for all changes
  watcher.on('all', (...args) => onChange(...args))
}).connect({
  host,
  port,
  username,
  privateKey
})
