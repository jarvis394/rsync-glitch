const RSync = require('rsync')
const rsync = new RSync()

module.exports = (source, destination) => {
  rsync.source(source)
  rsync.destination(destination)
  return rsync
}
