const serve = process.env.RAP2_SERVE;

const config: IConfig = {
  serve: serve || `http://${window.location.hostname}:38080`,
  keys: ['some secret hurr'],
  session: {
    key: 'koa:sess',
  },
}

export default config
