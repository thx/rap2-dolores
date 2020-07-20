import React, { Component } from 'react'
import { render } from 'react-dom'
import { Store } from 'redux'
import { connect, Provider } from 'react-redux'
import { History } from 'history'
import { ConnectedRouter } from 'connected-react-router'
import { MuiThemeProvider } from '@material-ui/core/styles/'
import { SnackbarProvider } from 'notistack'
import { GlobalProvider } from './GlobalProvider'
import { ThemeProvider, CssBaseline } from '@material-ui/core'
import GlobalStyles from '../components/common/GlobalStyles'
import MuiTheme from '../components/common/MuiTheme'
import Routes from 'routes'
import { PropTypes } from 'family'
import { THEME_TEMPLATES } from 'components/account/ThemeChangeOverlay'
import { RootState } from 'actions/types'

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
      const themeId = this.props.themeId
      const theme = MuiTheme(THEME_TEMPLATES[themeId].theme)
      theme.overrides = {
        ...theme.overrides,
        MuiCssBaseline: {
          ...GlobalStyles(theme),
        },
      }
      return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <MuiThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3}>
              <GlobalProvider>
                <ConnectedRouter history={history}>
                  <Routes />
                </ConnectedRouter>
              </GlobalProvider>
            </SnackbarProvider>
          </MuiThemeProvider>
        </ThemeProvider>
      )
    }
  }

  const App = connect((state: RootState) => ({ themeId: state.themeId }), {})(RootBase)

  render((
    <Provider store={store}>
      <App />
    </Provider>
  ), container)
}

export default start
