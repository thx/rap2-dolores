import URI from 'urijs'

const handleLocation = ({
  store,
  listeners,
  location,
}: any) => {
  // TODO 2.x 统一控制日志
  const auth = store.getState().auth
  const isLogined = !!(auth && auth.id)
  const {
    pathname,
    params,
  } = location
  if (pathname === '/' && !isLogined) {
    return
  }
  if (listeners[pathname]) {
    listeners[pathname].forEach((item: any) => {
      store.dispatch(item(params))
    })
  }
}

export default handleLocation
