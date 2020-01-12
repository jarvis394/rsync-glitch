const cli = require('commander')
const rsync = require('rsync')
const http = require('http')
const options = require('./options')

const server = http.createServer()

options.forEach({ option, description, default => cli.option(option

server.listen(3000)