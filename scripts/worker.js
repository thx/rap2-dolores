// https://github.com/node-modules/graceful
let graceful = require('graceful')
let now = () => new Date().toISOString().replace(/T/, ' ').replace(/Z/, '')
let app = require('./app')
let PORT = 8080
let server = app.listen(PORT, () => {
  console.log(`[${now()}]   worker#${process.pid} rap2-dolores is running as ${PORT}`)
})

graceful({
  servers: [server],
  killTimeout: '10s',
  error: (err, throwErrorCount) => {
    if (err.message) err.message += ` (uncaughtException throw ${throwErrorCount} times on pid:${process.pid})`
    console.error(`[${now()}] worker#${process.pid}] ${err.message}`)
  }
})
