import { takeLatest } from 'redux-saga/effects'
import start from './start'
import handleLocation from './handleLocation'

const _relatives = []
const _reducers = {} // { id/key: reducer }
const _prefilters = []
const _sagas = {} // { pattern: [sagas] }
const _listeners = {} // { pathname: [listeners] }
let _routes

const Family = {
  addRelative (relative) {
    _relatives.push(relative)
    return this
  },
  addRelatives (relatives) {
    relatives.forEach(_relatives.push)
    return this
  },
  addReducer (id, reducer) {
    _reducers[id] = reducer
    return this
  },
  addReducers (map) {
    if (!map) return this
    for (let id in map) _reducers[id] = map[id]
    return this
  },
  addPrefilter (prefilter) {
    _prefilters.push(prefilter)
    return this
  },
  addPrefilters (prefilters) {
    prefilters.forEach(_prefilters.push)
    return this
  },
  addSaga (pattern, saga) {
    _sagas[pattern] = [...(_sagas[pattern] || []), saga]
    return this
  },
  addSagas (sagas) {
    if (!sagas) return this
    for (let pattern in sagas) {
      if (Array.isArray(sagas[pattern])) {
        sagas[pattern].forEach(saga => this.addSaga(pattern, saga))
        continue
      }
      this.addSaga(pattern, sagas[pattern])
    }
    return this
  },
  addListener (pathname, listeners) {
    _listeners[pathname] = [...(_listeners[pathname] || []), ...listeners]
    return this
  },
  addListeners (map) {
    if (!map) return this
    for (let pathname in map) this.addListener(pathname, map[pathname])
    return this
  },
  setRoutes (routes) {
    if (!routes) return this
    _routes = routes
    return this
  },
  start (container) {
    _relatives.forEach(({ reducers = {}, sagas = {}, listeners = {} }) => {
      this.addReducers(reducers)
      this.addListeners(listeners)
      this.addSagas(sagas)
    })

    let props = { reducers: _reducers, listeners: _listeners, Routes: _routes }
    start(container, props, (err, { store, history, sagaMiddleware, renderRoot }) => {
      if (err) {
        console.log(err)
        return
      }

      Family.store = store
      Family.history = history

      function * rootSaga () {
        for (let prefilter of _prefilters) {
          yield * prefilter({ store, renderRoot })
        }
        for (let pattern in _sagas) {
          for (let saga of _sagas[pattern]) {
            yield takeLatest(pattern, saga)
            // 如何取消已经 take 的 sage？这是个伪问题，应该是不再发送 action！
          }
        }

        renderRoot(() => {
          handleLocation({ store, listeners: _listeners, location: { pathname: '*' } })
          handleLocation({ store, listeners: _listeners, location: store.getState().router.location })
        })
      }

      sagaMiddleware.run(rootSaga)
    })
  }
}

export default Family
