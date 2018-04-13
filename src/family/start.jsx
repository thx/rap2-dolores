import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { Provider } from 'react-redux'
import createHistory from 'history/createBrowserHistory'
import { ConnectedRouter, routerReducer, routerMiddleware as createRouterMiddleware } from 'react-router-redux'
import createSagaMiddleware from 'redux-saga'
import URI from 'urijs'

import loggerMiddleware from './loggerMiddleware'
import handleLocation from './handleLocation'

const logger = true
const start = (container, { reducers = {}, listeners = {}, Routes }, callback) => {
  let store
  const history = createHistory()
  const routerMiddleware = createRouterMiddleware(history)
  const sagaMiddleware = createSagaMiddleware({})
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  let middlewares = logger ? [loggerMiddleware, routerMiddleware, sagaMiddleware] : [routerMiddleware, sagaMiddleware]
  store = createStore(
    combineReducers({ ...reducers, router: routerReducer }),
    composeEnhancers(applyMiddleware(...middlewares))
  )

  // 初始化当前页所需的数据
  history.location.params = URI(history.location.search || '').search(true)
  history.listen((location, action) => handleLocation({ store, listeners, location, action }))

  const Root = (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
    </Provider>
  )

  const renderRoot = (callback) => {
    render(Root, container, callback) // 开始渲染
  }

  if (callback) callback(null, { store, history, sagaMiddleware, renderRoot })

  return { store, sagaMiddleware, renderRoot }
}

export default start
