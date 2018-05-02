import URI from 'urijs'

const handleLocation = ({ store, listeners, location, action }) => {
  // TODO 2.x 统一控制日志
  location.params = URI(location.search || '').search(true)
  let isLogined = !!store.getState().auth.id
  let { pathname, params } = location
  console.log('dispatch center')
  console.log(isLogined)
  console.log(pathname)
  console.log(params)
  if (pathname === '/' && !isLogined) {
    return
  }
  if (listeners[pathname]) {
    listeners[pathname].forEach(item => {
      store.dispatch(item(params))
    })
  }
}

export default handleLocation
