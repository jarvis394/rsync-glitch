const RSync = require('rsync')
const ignoredList = require('./ignoredList')
const rsync = new RSync()

module.exports = (source, destination) => {
  rsync.source(source)
  rsync.destination(destination)
  
  ignoredList.forEach(i => rsync.pattern({
    action: '-',
    pattern: i
  }))
  
  return rsync
}
