const fs = require('fs')
const Koa = require('koa')
const serve = require('koa-static')
const Router = require('koa-router')
const session = require('koa-session')
const config = require('../src/config')
const app = new Koa()

app.keys = config.keys
app.use(session(config.session, app))

app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
app.use(async (ctx, next) => {
  await next()
  if (ctx.response.body && ctx.response.body.url) {
    ctx.response.body = JSON.stringify(ctx.response.body, null, 4)
  }
})

app.use(serve('build'))

let router = new Router()

router.get('/check.node', (ctx) => {
  ctx.body = 'success'
})

router.get('/status.taobao', (ctx) => {
  ctx.body = 'success'
})

router.get('/test/test.status', (ctx) => {
  ctx.body = 'success'
})

router.get('/env', (ctx, next) => {
  ctx.body = process.env.NODE_ENV
})

router.get('/delos', (ctx, next) => {
  ctx.body = process.env.RAP2_DELOS
})
router.get('/account/info', (ctx) => {
  ctx.body = {
    url: ctx.request.url,
    data: ctx.session.id ? {
      id: ctx.session.id,
      empId: ctx.session.empId,
      fullname: ctx.session.fullname,
      email: ctx.session.email
    } : undefined
  }
})

router.get('/*', (ctx) => {
  ctx.type = 'html'
  ctx.body = fs.createReadStream('build/index.html')
})

app.use(router.routes())

module.exports = app
