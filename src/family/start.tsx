import React, { Component } from 'react'
import { render } from 'react-dom'
import { Store } from 'redux'
import { Provider } from 'react-redux'
import { History } from 'history'
import { ConnectedRouter } from 'connected-react-router'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import { SnackbarProvider } from 'notistack'
import { withStyles } from '@material-ui/core'
import GlobalStyles from '../components/common/GlobalStyles'
import ThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
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
        <ThemeProvider theme={MuiTheme}>
          <MuiThemeProvider theme={MuiTheme}>
            <SnackbarProvider maxSnack={3}>
              <Provider store={store}>
                <ConnectedRouter history={history}>
                  <Routes/>
                </ConnectedRouter>
              </Provider>
            </SnackbarProvider>
          </MuiThemeProvider>
        </ThemeProvider>
      )
    }
  }

  const Root = withStyles(GlobalStyles)(RootBase)
  render(<Root />, container)
}

export default start
