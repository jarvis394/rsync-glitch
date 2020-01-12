const RSync = require('rsync')
const ignoredList = require('./ignoredList')
const rsync = new RSync()

module.exports = (source, destination) => {
  rsync.source(source)
  rsync.destination(destination)
  rsync.flags('avzr --exclude="*.save.*"')
  // rsync.exclude(ignoredList)
  
  return rsync
}
