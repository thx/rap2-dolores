const config: IConfig = {
  serve: `${window.location.protocol}//${window.location.hostname}:38080`,
  keys: ['some secret hurr'],
  session: {
    key: 'koa:sess',
  },
}

export default config
