const cli = require('commander')
const rsync = require('rsync')
const http = require('http')
const options = require('./options')

/**
 * HTTP server for simply listen on some port in order to
 * get Glitch app stop showing 'loading' icon
 */
const server = http.createServer()

/** Set up options for cli application */
options.forEach(({ option, description, defaultValue }) => {
  cli.option(option, description, defaultValue)
})

server.listen(3000)