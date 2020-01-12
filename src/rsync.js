const RSync = require('rsync')
const rsync = new RSync()

module.exports = (source, destination, flags) => {
  rsync.source(source)
  rsync.destination(destination)
  rsync.flags(flags)
  rsync.exclude([ '*.save.*' ])
  
  return rsync
}
