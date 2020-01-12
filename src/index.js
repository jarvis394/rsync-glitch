const cli = require('commander')
const rsync = require('rsync')
const http = require('http')
const options = require('./options')

/**
 * HTTP server for simply listen on some port in order to
 * stop Glitch app showing 'loading' icon
 */
const server = http.createServer()

/** Set up options for cli application */
options.forEach(({ option, description, defaultValue, required }) => {
  const i = required ? 'requiredOption' : 'option'
  cli[i](option, description, defaultValue)
})

cli.parse(process.argv)

// server.listen(3000)