import React, { Component } from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { Provider } from 'react-redux'
import { createBrowserHistory as createHistory } from 'history'
import { routerMiddleware as createRouterMiddleware, connectRouter, ConnectedRouter } from 'connected-react-router'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import createSagaMiddleware from 'redux-saga'
import URI from 'urijs'
import loggerMiddleware from './loggerMiddleware'
import handleLocation from './handleLocation'
import { withStyles } from '@material-ui/core'
import GlobalStyles from '../components/common/GlobalStyles'
import ThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import MuiTheme from '../components/common/MuiTheme'
import Routes from 'routes'
import { PropTypes } from 'family'

const logger = false
const start = (container: any, { reducers,  listeners }: any, callback: any) => {
  const history = createHistory()
  const routerMiddleware = createRouterMiddleware(history)
  const sagaMiddleware = createSagaMiddleware({})
  // @ts-ignore
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  const middlewares = logger ? [loggerMiddleware, routerMiddleware, sagaMiddleware] : [routerMiddleware, sagaMiddleware]
  const store = createStore(
    combineReducers({ ...reducers, router: connectRouter(history) }),
    composeEnhancers(applyMiddleware(...middlewares))
  )

  // 初始化当前页所需的数据
  // @ts-ignore
  history.location.params = URI(history.location.search || '').search(true)
  history.listen((location, action: any) => handleLocation({ store, listeners, location, action }))

  class RootBase extends Component<any> {
    static childContextTypes = {
      store: PropTypes.object,
    }

    getChildContext() {
      return { store }
    }
    render() {
      return (
        <ThemeProvider theme={MuiTheme}>
          <MuiThemeProvider theme={MuiTheme}>
            <Provider store={store}>
              <ConnectedRouter history={history}>
                <Routes store={store} />
              </ConnectedRouter>
            </Provider>
          </MuiThemeProvider>
        </ThemeProvider>
      )
    }
  }

  const Root = withStyles(GlobalStyles)(RootBase)

  const renderRoot = (callback: any) => {
    render(<Root />, container, callback) // 开始渲染
  }

  if (callback) { callback(null, { store, history, sagaMiddleware, renderRoot }) }

  return { store, sagaMiddleware, renderRoot }
}

export default start
