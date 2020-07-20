import createMuiTheme, { ThemeOptions } from '@material-ui/core/styles/createMuiTheme'
import { THEME_TEMPLATES, THEME_TEMPLATE_KEY } from 'components/account/ThemeChangeOverlay'

export const theme = {
  palette: THEME_TEMPLATES[THEME_TEMPLATE_KEY.INDIGO].theme,
  typography: {
    fontSize: 13,
    // 告知 Material-UI 此 html 元素的具体字体大小。
    htmlFontSize: 12,
  },
  overrides: {
    MuiTableCell: {
      root: {
        padding: `8px 16px`,
      },
    },
    MuiFormControl: {
      root: {
        zIndex: 'inherit',
      },
    },
  },
}

const MuiTheme = (options?: ThemeOptions) => createMuiTheme({
  ...theme as ThemeOptions,
  ...(options || {})
})

export default MuiTheme
