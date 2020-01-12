module.exports = [
  {
    option: '-s, --source [path]',
    description: 'Source folder rsync would copy from',
    defaultValue: './',
  },
  {
    option: '-d, --dest <path>',
    description: 'Destination address rsync would copy to',
    required: true
  },
  {
    option: '-l, --listen [port]',
    description: 'Listen on port to make Glitch project stop showing \'loading\' icon',
    defaultValue: 3000,
  },
  {
    option: '-p, --pass <password>',
    description: 'Password to connect to your external server by SSH',
  },
  {
    option: '-t, --throttle <number>',
    description: 'Adds a delay before sending your changes to rsync'
  }
]