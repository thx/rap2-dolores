import React, { useState } from 'react'
import { Paper, Theme, List, ListSubheader, makeStyles, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, IconButton } from '@material-ui/core'
import Settings from '@material-ui/icons/Settings'
import Palette from '@material-ui/icons/Palette'
import ThemeChangeOverlay, { THEME_TEMPLATE_KEY } from './ThemeChangeOverlay'
import { CACHE_KEY } from 'utils/consts'

const useStyles = makeStyles(({ spacing }: Theme) => ({
  root: {
    padding: spacing(1),
    maxWidth: 400,
  },
}))

interface Props {
  isFetching: boolean
  data: { [key: string]: string }
  onChange: (key: CACHE_KEY, val: string) => void
}

function MySettings(props: Props) {
  const classes = useStyles()
  const { data, onChange, isFetching } = props
  const [editingThemeTemplate, setEditingThemeTemplate] = useState(false)

  const themeId = data[CACHE_KEY.THEME_ID] as THEME_TEMPLATE_KEY || THEME_TEMPLATE_KEY.RED

  const handleClose = (themeId?: THEME_TEMPLATE_KEY) => {
    setEditingThemeTemplate(false)
    themeId && onChange(CACHE_KEY.THEME_ID, themeId)
  }

  return (
    <Paper className={classes.root}>
      <List subheader={<ListSubheader>偏好设置</ListSubheader>}>
        <ListItem>
          <ListItemIcon>
            <Palette />
          </ListItemIcon>
          <ListItemText primary="个性皮肤设置" />
          <ListItemSecondaryAction>
            <IconButton disabled={isFetching} onClick={() => setEditingThemeTemplate(true)}>
              <Settings />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      <ThemeChangeOverlay
        val={themeId}
        open={editingThemeTemplate}
        handleClose={handleClose}
      />
    </Paper>
  )
}

export default MySettings
