import React, { Component } from 'react'
import { render } from 'react-dom'
import { Store } from 'redux'
import { Provider } from 'react-redux'
import { History } from 'history'
import { ConnectedRouter } from 'connected-react-router'
import { MuiThemeProvider } from '@material-ui/core/styles/'
import { SnackbarProvider } from 'notistack'
import { GlobalProvider } from './GlobalProvider'
import { withStyles } from '@material-ui/core'
import GlobalStyles from '../components/common/GlobalStyles'
import MuiTheme from '../components/common/MuiTheme'
import Routes from 'routes'
import { PropTypes } from 'family'

const start = (
  container: any,
  { store, history }: { store: Store; history: History }
) => {
  class RootBase extends Component<any> {
    static childContextTypes = {
      store: PropTypes.object,
    }

    getChildContext() {
      return { store }
    }
    render() {
      return (
        <MuiThemeProvider theme={MuiTheme}>
          <SnackbarProvider maxSnack={3}>
            <GlobalProvider>
              <Provider store={store}>
                <ConnectedRouter history={history}>
                  <Routes />
                </ConnectedRouter>
              </Provider>
            </GlobalProvider>
          </SnackbarProvider>
        </MuiThemeProvider>
      )
    }
  }

  const Root = withStyles(GlobalStyles)(RootBase)
  render(<Root />, container)
}

export default start
