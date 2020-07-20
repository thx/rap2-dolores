import grey from '@material-ui/core/colors/grey'
import { StyleRules, Theme } from '@material-ui/core/styles'

const GlobalStyles = (theme: Theme) => ({
  '@global': {
    'body': {
      margin: 0,
      padding: 0,
      backgroundColor: grey[200],
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif;',
      fontSize: '1rem',
    },
    '.ml1': {
      marginLeft: theme.spacing(1),
    },
    '.mr1': {
      marginRight: theme.spacing(1),
    },
    '.mb1': {
      marginBottom: theme.spacing(1),
    },
    '.mt1': {
      marginTop: theme.spacing(1),
    },
    'ol': {
      padding: `0 ${theme.spacing(2)}px`,
    },
    'ul': {
      padding: `0 ${theme.spacing(2)}px`,
    },
    'li': {
      padding: `${theme.spacing(1)}px 0`,
    },
    '.g-link': {
      color: theme.palette.primary.main,
      cursor: 'pointer',
    },
    'a, a:hover, a:focus, a:active, a:visited': {
      color: theme.palette.primary.main,
      cursor: 'pointer',
    },
  },
}) as StyleRules

export default GlobalStyles
