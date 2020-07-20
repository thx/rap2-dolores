import React from 'react'
import { Button, makeStyles, createStyles, CircularProgress } from '@material-ui/core'
import { ButtonProps } from '@material-ui/core/Button'
import { green } from '@material-ui/core/colors'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: 'relative',
      display: 'inline',
    },
    buttonProgress: {
      color: green[500],
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
  })
)

interface Props extends ButtonProps {
  label: string
}

export default React.forwardRef((props: Props, ref: any) => {
  const { children, label, ...rest } = props
  const classes = useStyles()
  const loading = props.disabled
  return (
    <div className={classes.root} ref={ref}>
      <Button {...rest}>
        {loading ? '处理中...' : label}
        {children}
      </Button>
      {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
    </div>
  )
})
