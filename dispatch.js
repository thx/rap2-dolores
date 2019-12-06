process.env.NODE_ENV = 'production'

// https://nodejs.org/api/cluster.html
// https://github.com/node-modules/graceful/blob/master/example/express_with_cluster/dispatch.js
// http://gitlab.alibaba-inc.com/mm/fb/blob/master/dispatch.js

let cluster = require('cluster')
let path = require('path')
let now = () => new Date().toISOString().replace(/T/, ' ').replace(/Z/, '')

cluster.setupMaster({
  exec: path.join(__dirname, 'scripts/worker.js')
})

if (cluster.isMaster) {
  const maxSize = +process.env.SIGMA_MAX_PROCESSORS_LIMIT || +process.env.AJDK_MAX_PROCESSORS_LIMIT || require('os').cpus().length
  for (let i = 0; i < maxSize; i++) {
    cluster.fork()
  }
  cluster.on('listening', (worker, address) => {
    console.error(`[${now()}] master#${process.pid} worker#${worker.process.pid} is now connected to ${address.address}:${address.port}.`)
  })
  cluster.on('disconnect', (worker) => {
    console.error(`[${now()}] master#${process.pid} worker#${worker.process.pid} has disconnected.`)
  })
  cluster.on('exit', (worker, code, signal) => {
    console.error(`[${now()}] master#${process.pid} worker#${worker.process.pid} died (${signal || code}). restarting...`)
    cluster.fork()
  })
}
