const bullQueue = require('bull')
const amarDabiQueue = new bullQueue('amarDabiQueue', { redis: { host: '127.0.0.1', port: 6379 } })
const amaderDabiQueue = new bullQueue('amaderDabiQueue', { redis: { host: '127.0.0.1', port: 6379 } })

module.exports = { amarDabiQueue, amaderDabiQueue };