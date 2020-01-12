const RSync = require('rsync')
const ignoredList = require('./ignoredList')
const rsync = new RSync()

module.exports = (source, destination, flags) => {
  rsync.source(source)
  rsync.destination(destination)
  rsync.flags(flags)
  rsync.exclude([ '*.save.*', ...ignoredList ])
  
  return rsync
}
