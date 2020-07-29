
const config: IConfig =
  process.env.NODE_ENV === 'development' // development or production
    ? require('./config.dev').default
    : require('./config.prod').default

export default config
