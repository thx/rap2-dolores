// http://redux.js.org/docs/api/applyMiddleware.html
const loggerMiddleware = ({ getState }) => {
  return (next) => (action) => {
    if (action.type === 'FETCH_START' || action.type === 'FETCH_STOP') return next(action)

    console.group(action.type)
    console.log(action)
    let newValue = next(action)
    console.log(getState())
    console.groupEnd(action.type)
    return newValue
  }
}

export default loggerMiddleware
