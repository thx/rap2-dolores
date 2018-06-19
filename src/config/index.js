module.exports =
  process.env.NODE_ENV === 'development' // development or production
    ? require('./config.dev')
    : require('./config.prod')
