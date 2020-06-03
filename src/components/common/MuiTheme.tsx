import createMuiTheme from '@material-ui/core/styles/createMuiTheme'

export const theme = {
  palette: {
  },
  // overrides: {
  // },
}

const MuiTheme = createMuiTheme({
  overrides: {
    MuiTableCell: {
      root: {
        padding: '0 16px',
      },
    },
  },
  typography: {
    htmlFontSize: 10,
    fontSize: 12,
  },
  ...theme,
})

export default MuiTheme
