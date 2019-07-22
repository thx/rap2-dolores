import { takeLatest } from 'redux-saga/effects'
import start from './start'
import handleLocation from './handleLocation'
import { createBrowserHistory as createHistory, History } from 'history'
import {
  createStore,
  applyMiddleware,
  combineReducers,
  compose,
  Store
} from 'redux'
import {
  routerMiddleware as createRouterMiddleware,
  connectRouter
} from 'connected-react-router'
import loggerMiddleware from './loggerMiddleware'
import createSagaMiddleware from 'redux-saga'
import URI from 'urijs'

const _relatives: any = []
const _reducers: any = {} // { id/key: reducer }
const _prefilters: any[] = []
const _sagas: any = {} // { pattern: [sagas] }
const _listeners: any = {} // { pathname: [listeners] }
// let _routes: any

const Family: {
  store?: Store;
  history?: History;
  [k: string]: any;
} = {
  store: undefined,
  history: undefined,
  addRelative(relative: any) {
    _relatives.push(relative)
    return this
  },
  addRelatives(relatives: any) {
    relatives.forEach(_relatives.push)
    return this
  },
  addReducer(id: any, reducer: any) {
    _reducers[id] = reducer
    return this
  },
  addReducers(map: any) {
    if (!map) {
      return this
    }
    // tslint:disable-next-line: forin
    for (const id in map) {
      _reducers[id] = map[id]
    }
    return this
  },
  addPrefilter(prefilter: any) {
    _prefilters.push(prefilter)
    return this
  },
  addPrefilters(prefilters: any) {
    prefilters.forEach(_prefilters.push)
    return this
  },
  addSaga(pattern: any, saga: any) {
    _sagas[pattern] = [...(_sagas[pattern] || []), saga]
    return this
  },
  addSagas(sagas: any) {
    if (!sagas) {
      return this
    }
    // tslint:disable-next-line: forin
    for (const pattern in sagas) {
      if (Array.isArray(sagas[pattern])) {
        sagas[pattern].forEach((saga: any) => this.addSaga(pattern, saga))
        continue
      }
      this.addSaga(pattern, sagas[pattern])
    }
    return this
  },
  addListener(pathname: any, listeners: any) {
    _listeners[pathname] = [...(_listeners[pathname] || []), ...listeners]
    return this
  },
  addListeners(map: any) {
    if (!map) {
      return this
    }
    // tslint:disable-next-line: forin
    for (const pathname in map) {
      this.addListener(pathname, map[pathname])
    }
    return this
  },
  // setRoutes(routes: any) {
  //   if (!routes) {
  //     return this
  //   }
  //   _routes = routes
  //   return this
  // },
  start(container: any) {
    _relatives.forEach(({ reducers = {}, sagas = {}, listeners = {} }: any) => {
      this.addReducers(reducers)
      this.addListeners(listeners)
      this.addSagas(sagas)
    })

    /** init store begin */
    const logger = false
    const history = createHistory()
    const routerMiddleware = createRouterMiddleware(history)
    const sagaMiddleware = createSagaMiddleware({})
    const composeEnhancers =
      // @ts-ignore
      (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
        // @ts-ignore
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          trace: true,
          traceLimit: 100,
        })) ||
      compose
    const middlewares = logger
      ? [loggerMiddleware, routerMiddleware, sagaMiddleware]
      : [routerMiddleware, sagaMiddleware]
    const store = createStore<any, any, any, any>(
      combineReducers({ ..._reducers, router: connectRouter(history) }),
      composeEnhancers(applyMiddleware(...middlewares))
    )
    // 初始化当前页所需的数据
    // @ts-ignore
    history.location.params = URI(history.location.search || '').search(true)
    history.listen((location, action: any) =>
      handleLocation({ store, listeners: _listeners, location, action })
    )

    Family.store = store
    Family.history = history

    handleLocation({
      store,
      listeners: _listeners,
      location: { pathname: '*' },
    })
    handleLocation({
      store,
      listeners: _listeners,
      location: store.getState().router.location,
    })

    /** init store end */

    function* rootSaga() {

      try {
        for (const prefilter of _prefilters) {
          yield* prefilter({ store })
        }
      } catch (error) {
        return
      }

      // 在执行 prefilter 之后再开始渲染主UI
      start(container, { store, history })
      // tslint:disable-next-line: forin
      for (const pattern in _sagas) {
        for (const saga of _sagas[pattern]) {
          yield takeLatest(pattern, saga)
        }
      }

    }
    sagaMiddleware.run(rootSaga)

  },
}

export default Family
