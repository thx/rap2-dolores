import { takeLatest } from 'redux-saga/effects'
import start from './start'
import handleLocation from './handleLocation'

const _relatives: any = []
const _reducers: any = {} // { id/key: reducer }
const _prefilters: any[] = []
const _sagas: any = {} // { pattern: [sagas] }
const _listeners: any = {} // { pathname: [listeners] }
let _routes: any

const Family = {
  store: null,
  history: null,
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
    if (!map) { return this }
    // tslint:disable-next-line: forin
    for (const id in map) { _reducers[id] = map[id] }
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
    if (!sagas) { return this }
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
    if (!map) { return this }
    // tslint:disable-next-line: forin
    for (const pathname in map) { this.addListener(pathname, map[pathname]) }
    return this
  },
  setRoutes(routes: any) {
    if (!routes) { return this }
    _routes = routes
    return this
  },
  start(container: any) {
    _relatives.forEach(({ reducers = {}, sagas = {}, listeners = {} }: any) => {
      this.addReducers(reducers)
      this.addListeners(listeners)
      this.addSagas(sagas)
    })

    const props = { reducers: _reducers, listeners: _listeners, Routes: _routes }
    start(container, props, (err: any, { store, history, sagaMiddleware, renderRoot }: any) => {
      if (err) {
        console.log(err)
        return
      }

      Family.store = store
      Family.history = history

      function* rootSaga() {
        for (const prefilter of _prefilters) {
          yield* prefilter({ store, renderRoot })
        }
        // tslint:disable-next-line: forin
        for (const pattern in _sagas) {
          for (const saga of _sagas[pattern]) {
            yield takeLatest(pattern, saga)
          }
        }

        renderRoot(() => {
          handleLocation({ store, listeners: _listeners, location: { pathname: '*' } })
          handleLocation({ store, listeners: _listeners, location: store.getState().router.location })
        })
      }
      sagaMiddleware.run(rootSaga)
    })
  },
}

export default Family
