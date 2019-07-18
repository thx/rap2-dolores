// http://redux.js.org/docs/api/applyMiddleware.html
const loggerMiddleware = ({ getState }: any) => {
  return (next: any) => (action: any) => {
    if (action.type === 'FETCH_START' || action.type === 'FETCH_STOP') { return next(action) }

    console.group(action.type)
    console.log(action)
    const newValue = next(action)
    console.log(getState())
    console.groupEnd()
    return newValue
  }
}

export default loggerMiddleware
