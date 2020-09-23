
const config: IConfig = {
  serve: `http://${window.location.hostname}:8080`,
  keys: ['some secret hurr'],
  session: {
    key: 'koa:sess',
  },
}

export default config
